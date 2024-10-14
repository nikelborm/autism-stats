// https://stackoverflow.com/a/53175538
// https://github.com/microsoft/TypeScript/issues/30370
// https://github.com/microsoft/TypeScript/pull/52088

type Merge<T> = { [P in keyof T]: T[P] } & {};

const chances = getChances({
  probabilityOfDonorToBeAutistic: 0.05,
  probabilityOfRecipientToBeAutistic: 0.05,
  chanceOfDonationToCauseAutisticChild: {
    ifBothPartnersAreAutistic: 1,
    ifOnePartnerIsAutistic: 0.5,
    ifNoneAreAutistic: 0
  },
  chanceThatRecipientWillSkipChoosingDonor: {
    ifRecipientIsNeurotypical: 0.2,
    ifRecipientIsAutistic: 0.2,
  },
  chanceThatInvolvedRecipientWillChooseAutisticDonor: {
    ifRecipientIsNeurotypical: 0.125,
    ifRecipientIsAutistic: 0.6,
  }
})

logInsightsFromMatrix(chances)



function getChances(config: {
  probabilityOfDonorToBeAutistic: number,
  probabilityOfRecipientToBeAutistic: number,
  chanceOfDonationToCauseAutisticChild: {
    ifBothPartnersAreAutistic: number,
    ifOnePartnerIsAutistic: number,
    ifNoneAreAutistic: number,
  },
  chanceThatRecipientWillSkipChoosingDonor: {
    ifRecipientIsAutistic: number,
    ifRecipientIsNeurotypical: number,
  },
  chanceThatInvolvedRecipientWillChooseAutisticDonor: {
    ifRecipientIsAutistic: number,
    ifRecipientIsNeurotypical: number,
  },
}) {
  // pipeline length is always >= 1
  return applyPipeline(
    [{ ctx: new Set(), factor: 1 }],
    [
      [ 'autistic recipient', 'neurotypical recipient' ],
      [ 'decided to skip', 'decided not to skip' ],
      [ 'autistic donor', 'neurotypical donor' ],
      [ 'will cause autistic child', 'will cause neurotypical child' ]
    ],
    [
      () => config.probabilityOfRecipientToBeAutistic,
      (ctx) =>
        ctx.has('autistic recipient')
          ? config.chanceThatRecipientWillSkipChoosingDonor.ifRecipientIsAutistic
          : config.chanceThatRecipientWillSkipChoosingDonor.ifRecipientIsNeurotypical,
      (ctx) =>
        ctx.has('decided not to skip')
          ? (ctx.has('autistic recipient')
            ? config.chanceThatInvolvedRecipientWillChooseAutisticDonor.ifRecipientIsAutistic
            : config.chanceThatInvolvedRecipientWillChooseAutisticDonor.ifRecipientIsNeurotypical)
          : config.probabilityOfDonorToBeAutistic,
      (ctx) =>
        ctx.has('autistic recipient') && ctx.has('autistic donor')
          ? config.chanceOfDonationToCauseAutisticChild.ifBothPartnersAreAutistic
          : ctx.has('neurotypical recipient') && ctx.has('neurotypical donor')
            ? config.chanceOfDonationToCauseAutisticChild.ifNoneAreAutistic
            : config.chanceOfDonationToCauseAutisticChild.ifOnePartnerIsAutistic,
    ]
  )
}


type Concatenate<Options extends OptionsInGeneral> =
  Options extends [
    infer CurrentOptions extends OptionPair,
    ...infer RestOptions extends OptionsInGeneral
  ]
    ?
      | CurrentOptions[0] /* normal option */
      | CurrentOptions[1] /* reverse option */
      | Concatenate<RestOptions>
    : never;

type Transformation<
  IterationInfo extends IterationInfoObject
> = IterationInfo['leftNeighbors'] extends infer U extends OptionsInGeneral
  ? (ctx: Set<Concatenate<U>>) => number
  : never;


type IterationInfoObject<
  LeftNeighbors extends any[] = any[],
  CurrentCursor extends any = any,
  RightNeighbors extends any[] = any[],
> = {
  leftNeighbors: LeftNeighbors,
  currentCursor: CurrentCursor,
  rightNeighbors: RightNeighbors,
};



type Mapper<
  Elements extends any[],
  CurrentIterationInfo extends IterationInfoObject =
    Elements extends [infer CurrentCursor, ...infer RightNeighbors]
      ? IterationInfoObject<[], CurrentCursor, RightNeighbors>
      : never
> =
  [
    Transformation<CurrentIterationInfo>,
    ...(CurrentIterationInfo['rightNeighbors'] extends [infer NewCursor, ...infer NewRightNeighbors]
      ? Mapper<
        Elements,
        IterationInfoObject<
          [...CurrentIterationInfo['leftNeighbors'], CurrentIterationInfo['currentCursor']],
          NewCursor,
          NewRightNeighbors
        >
      >
      : []
    )
  ];

type OptionPair = [option: string, reverseOption: string]
type OptionsInGeneral = OptionPair[];



function logInsightsFromMatrix(chances: MatrixEntries) {
  const getFactorCalculatorInScope =
    (parentScope: (ctx: Set<string>) => boolean) =>
      (subScope: (ctx: Set<string>) => boolean = () => true) =>
        stripTail(
          chances
            .filter(e => parentScope(e.ctx) && subScope(e.ctx))
            .reduce((sum, e) => sum + e.factor, 0)
        )

  function getGroupedBySubCategory(subCategoryName: string) {
    const calcFactor = getFactorCalculatorInScope(ctx => ctx.has(subCategoryName))
    return {
      [subCategoryName]: {
        autisticChild:     calcFactor(ctx => ctx.has('will cause autistic child')),
        neurotypicalChild: calcFactor(ctx => ctx.has('will cause neurotypical child')),
        all:               calcFactor()
      }
    }
  }

  function getGroupedByCategory(categoryName: string) {
    return {
      [categoryName]: {
        all: getFactorCalculatorInScope(ctx => ctx.has(categoryName))()
      }
    }
  }

  console.table({
    ...getGroupedByCategory('will cause autistic child'),
    ...getGroupedByCategory('will cause neurotypical child'),
    ...getGroupedBySubCategory('decided to skip'),
    ...getGroupedBySubCategory('decided not to skip'),
    ...getGroupedBySubCategory('autistic recipient'),
    ...getGroupedBySubCategory('neurotypical recipient'),
    ...getGroupedBySubCategory('autistic donor'),
    ...getGroupedBySubCategory('neurotypical donor'),
  })
}

function applyPipeline<
  const OptionPairs extends OptionsInGeneral,
  const FactorCalculators extends Mapper<OptionPairs>
>(
  sourceArray: MatrixEntries,
  optionPairs: OptionPairs,
  factorCalculators: FactorCalculators
) {
  let matrix = sourceArray

  for (let i = 0; i < optionPairs.length; i++) {
    const [option, reverseOption] = optionPairs[i]!
    const getFactor = <unknown>factorCalculators[i] as (ctx: Set<string>) => number

    matrix = matrix.flatMap(({ ctx, factor: previousFactor }) => {
      const additionalFactor = getFactor(ctx);

      if (additionalFactor < 0 || additionalFactor > 1)
        throw Error('Incorrect chances');

      return [
        { ctx: ctx.union(new Set([option       ])), factor: previousFactor * (additionalFactor    )},
        { ctx: ctx.union(new Set([reverseOption])), factor: previousFactor * (1 - additionalFactor)}
      ]
    });
  }

  logMatrix(matrix);

  return matrix;
}

function logMatrix(matrix: MatrixEntries) {
  console.table(
    matrix
      .sort((a, b) => [...a.ctx].join(', ').localeCompare([...b.ctx].join(', ')))
      .map(v => [stripTail(v.factor), ...v.ctx])
  )
}

function stripTail(n: number) {
  return Number(n.toFixed(10))
}

type MatrixEntries = {
  ctx: Set<string>,
  factor: number
}[];

type ASd =
  | 'will cause autistic child'
  | 'will cause neurotypical child'
  | 'decided to skip'
  | 'decided not to skip'
  | 'autistic recipient'
  | 'neurotypical recipient'
  | 'autistic donor'
  | 'neurotypical donor'
