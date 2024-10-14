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
    [{ ctx: [], factor: 1 }],
    [
      {
        getFactor: () => config.probabilityOfRecipientToBeAutistic,
        option: 'autistic recipient',
        reverseOption: 'neurotypical recipient'
      },
      {
        getFactor: (ctx) =>
          ctx[0] === 'autistic recipient'
            ? config.chanceThatRecipientWillSkipChoosingDonor.ifRecipientIsAutistic
            : config.chanceThatRecipientWillSkipChoosingDonor.ifRecipientIsNeurotypical,
        option: 'decided to skip',
        reverseOption: 'decided not to skip'
      },
      {
        getFactor: (ctx) =>
          ctx[1] === 'decided not to skip'
            ? (ctx[0] === 'autistic recipient'
              ? config.chanceThatInvolvedRecipientWillChooseAutisticDonor.ifRecipientIsAutistic
              : config.chanceThatInvolvedRecipientWillChooseAutisticDonor.ifRecipientIsNeurotypical)
            : config.probabilityOfDonorToBeAutistic,
        option: 'autistic donor',
        reverseOption: 'neurotypical donor'
      },
      {
        getFactor: (ctx) =>
          ctx[0] === 'autistic recipient' && ctx[2] === 'autistic donor'
            ? config.chanceOfDonationToCauseAutisticChild.ifBothPartnersAreAutistic
            : ctx[0] === 'neurotypical recipient' && ctx[2] === 'neurotypical donor'
              ? config.chanceOfDonationToCauseAutisticChild.ifNoneAreAutistic
              : config.chanceOfDonationToCauseAutisticChild.ifOnePartnerIsAutistic,
        option: 'will cause autistic child',
        reverseOption: 'will cause neurotypical child'
      },
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
    (parentScope: (ctx: Array<string>) => boolean) =>
      (subScope: (ctx: Array<string>) => boolean = () => true) =>
        stripTail(
          chances
            .filter(e => parentScope(e.ctx) && subScope(e.ctx))
            .reduce((sum, e) => sum + e.factor, 0)
        )

  function getGroupedBySubCategory(subCategoryName: string) {
    const calcFactor = getFactorCalculatorInScope(ctx => ctx.includes(subCategoryName))
    return {
      [subCategoryName]: {
        autisticChild:     calcFactor(ctx => ctx.includes('will cause autistic child')),
        neurotypicalChild: calcFactor(ctx => ctx.includes('will cause neurotypical child')),
        all:               calcFactor()
      }
    }
  }

  function getGroupedByCategory(categoryName: string) {
    return {
      [categoryName]: {
        all: getFactorCalculatorInScope(ctx => ctx.includes(categoryName))()
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

type Op<Ctx, O, RO> = { getFactor: (ctx: Ctx) => number, option: O, reverseOption: RO };

function applyPipeline<
  const O1 extends string, const RO1 extends string,
>(
  sourceArray: MatrixEntries,
  pipelineOperations: [
    Op<[], O1, RO1>,
  ]
): {
  ctx: [O1 | RO1],
  factor: number
}[]

function applyPipeline<
  const O1 extends string, const RO1 extends string,
  const O2 extends string, const RO2 extends string,
>(
  sourceArray: MatrixEntries,
  pipelineOperations: [
    Op<[        ], O1, RO1>,
    Op<[O1 | RO1], O2, RO2>,
  ]
): {
  ctx: [O1 | RO1, O2 | RO2],
  factor: number
}[]

function applyPipeline<
  const O1 extends string, const RO1 extends string,
  const O2 extends string, const RO2 extends string,
  const O3 extends string, const RO3 extends string,
>(
  sourceArray: MatrixEntries,
  pipelineOperations: [
    Op<[                  ], O1, RO1>,
    Op<[O1 | RO1          ], O2, RO2>,
    Op<[O1 | RO1, O2 | RO2], O3, RO3>,
  ]
): {
  ctx: [O1 | RO1, O2 | RO2, O3 | RO3],
  factor: number
}[]

function applyPipeline<
  const O1 extends string, const RO1 extends string,
  const O2 extends string, const RO2 extends string,
  const O3 extends string, const RO3 extends string,
  const O4 extends string, const RO4 extends string,
>(
  sourceArray: MatrixEntries,
  pipelineOperations: [
    Op<[                            ], O1, RO1>,
    Op<[O1 | RO1                    ], O2, RO2>,
    Op<[O1 | RO1, O2 | RO2          ], O3, RO3>,
    Op<[O1 | RO1, O2 | RO2, O3 | RO3], O4, RO4>,
  ]
): {
  ctx: [O1 | RO1, O2 | RO2, O3 | RO3, O4 | RO4],
  factor: number
}[]

function applyPipeline<
  const O1 extends string, const RO1 extends string,
  const O2 extends string, const RO2 extends string,
  const O3 extends string, const RO3 extends string,
  const O4 extends string, const RO4 extends string,
  const O5 extends string, const RO5 extends string,
>(
  sourceArray: MatrixEntries,
  pipelineOperations: [
    Op<[                                      ], O1, RO1>,
    Op<[O1 | RO1                              ], O2, RO2>,
    Op<[O1 | RO1, O2 | RO2                    ], O3, RO3>,
    Op<[O1 | RO1, O2 | RO2, O3 | RO3          ], O4, RO4>,
    Op<[O1 | RO1, O2 | RO2, O3 | RO3, O4 | RO4], O5, RO5>,
  ]
): {
  ctx: [O1 | RO1, O2 | RO2, O3 | RO3, O4 | RO4, O5 | RO5],
  factor: number
}[]

function applyPipeline<
  const O1 extends string, const RO1 extends string,
  const O2 extends string, const RO2 extends string,
  const O3 extends string, const RO3 extends string,
  const O4 extends string, const RO4 extends string,
  const O5 extends string, const RO5 extends string,
  const O6 extends string, const RO6 extends string,
>(
  sourceArray: MatrixEntries,
  pipelineOperations: [
    Op<[                                                ], O1, RO1>,
    Op<[O1 | RO1                                        ], O2, RO2>,
    Op<[O1 | RO1, O2 | RO2                              ], O3, RO3>,
    Op<[O1 | RO1, O2 | RO2, O3 | RO3                    ], O4, RO4>,
    Op<[O1 | RO1, O2 | RO2, O3 | RO3, O4 | RO4          ], O5, RO5>,
    Op<[O1 | RO1, O2 | RO2, O3 | RO3, O4 | RO4, O5 | RO5], O6, RO6>,
  ]
): {
  ctx: [O1 | RO1, O2 | RO2, O3 | RO3, O4 | RO4, O5 | RO5, O6 | RO6],
  factor: number
}[]

function applyPipeline<
  const O1 extends string, const RO1 extends string,
  const O2 extends string, const RO2 extends string,
  const O3 extends string, const RO3 extends string,
  const O4 extends string, const RO4 extends string,
  const O5 extends string, const RO5 extends string,
  const O6 extends string, const RO6 extends string,
  const O7 extends string, const RO7 extends string,
>(
  sourceArray: MatrixEntries,
  pipelineOperations: [
    Op<[                                                          ], O1, RO1>,
    Op<[O1 | RO1                                                  ], O2, RO2>,
    Op<[O1 | RO1, O2 | RO2                                        ], O3, RO3>,
    Op<[O1 | RO1, O2 | RO2, O3 | RO3                              ], O4, RO4>,
    Op<[O1 | RO1, O2 | RO2, O3 | RO3, O4 | RO4                    ], O5, RO5>,
    Op<[O1 | RO1, O2 | RO2, O3 | RO3, O4 | RO4, O5 | RO5          ], O6, RO6>,
    Op<[O1 | RO1, O2 | RO2, O3 | RO3, O4 | RO4, O5 | RO5, O6 | RO6], O7, RO7>,
  ]
): {
  ctx: [O1 | RO1, O2 | RO2, O3 | RO3, O4 | RO4, O5 | RO5, O6 | RO6, O7 | RO7],
  factor: number
}[]

function applyPipeline<
  const O1 extends string, const RO1 extends string,
  const O2 extends string, const RO2 extends string,
  const O3 extends string, const RO3 extends string,
  const O4 extends string, const RO4 extends string,
  const O5 extends string, const RO5 extends string,
  const O6 extends string, const RO6 extends string,
  const O7 extends string, const RO7 extends string,
  const O8 extends string, const RO8 extends string,
>(
  sourceArray: MatrixEntries,
  pipelineOperations: [
    Op<[                                                                    ], O1, RO1>,
    Op<[O1 | RO1                                                            ], O2, RO2>,
    Op<[O1 | RO1, O2 | RO2                                                  ], O3, RO3>,
    Op<[O1 | RO1, O2 | RO2, O3 | RO3                                        ], O4, RO4>,
    Op<[O1 | RO1, O2 | RO2, O3 | RO3, O4 | RO4                              ], O5, RO5>,
    Op<[O1 | RO1, O2 | RO2, O3 | RO3, O4 | RO4, O5 | RO5                    ], O6, RO6>,
    Op<[O1 | RO1, O2 | RO2, O3 | RO3, O4 | RO4, O5 | RO5, O6 | RO6          ], O7, RO7>,
    Op<[O1 | RO1, O2 | RO2, O3 | RO3, O4 | RO4, O5 | RO5, O6 | RO6, O7 | RO7], O8, RO8>,
  ]
): {
  ctx: [O1 | RO1, O2 | RO2, O3 | RO3, O4 | RO4, O5 | RO5, O6 | RO6, O7 | RO7, O8 | RO8],
  factor: number
}[]

function applyPipeline(
  sourceArray: MatrixEntries,
  pipelineOperations: (
    Op<any, string, string>
  )[]
): {
  ctx: string[],
  factor: number
}[]
{
  let matrix = sourceArray

  for (const { getFactor, option, reverseOption } of pipelineOperations) {

    matrix = matrix.flatMap(({ ctx, factor: previousFactor }) => {
      const additionalFactor = (getFactor as (ctx: Array<string>) => number)(ctx);

      if (additionalFactor < 0 || additionalFactor > 1)
        throw Error('Incorrect chances');

      return [
        { ctx: [...ctx, option       ], factor: previousFactor * (additionalFactor    )},
        { ctx: [...ctx, reverseOption], factor: previousFactor * (1 - additionalFactor)}
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
  ctx: Array<string>,
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
