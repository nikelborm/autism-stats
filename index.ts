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
  return applyPipeline([{ ctx: new Set(), coefficient: 1 }], [
    {
      getCoefficient: () => config.probabilityOfRecipientToBeAutistic,
      option: 'autistic recipient',
      reverseOption: 'neurotypical recipient'
    },
    {
      getCoefficient: (ctx) =>
        ctx.has('autistic recipient')
          ? config.chanceThatRecipientWillSkipChoosingDonor.ifRecipientIsAutistic
          : config.chanceThatRecipientWillSkipChoosingDonor.ifRecipientIsNeurotypical,
      option: 'decided to skip',
      reverseOption: 'decided not to skip'
    },
    {
      getCoefficient: (ctx) =>
        ctx.has('decided not to skip')
          ? (ctx.has('autistic recipient')
            ? config.chanceThatInvolvedRecipientWillChooseAutisticDonor.ifRecipientIsAutistic
            : config.chanceThatInvolvedRecipientWillChooseAutisticDonor.ifRecipientIsNeurotypical)
          : config.probabilityOfDonorToBeAutistic,
      option: 'autistic donor',
      reverseOption: 'neurotypical donor'
    },
    {
      getCoefficient: (ctx) =>
        ctx.has('autistic recipient') && ctx.has('autistic donor')
          ? config.chanceOfDonationToCauseAutisticChild.ifBothPartnersAreAutistic
          : ctx.has('neurotypical recipient') && ctx.has('neurotypical donor')
            ? config.chanceOfDonationToCauseAutisticChild.ifNoneAreAutistic
            : config.chanceOfDonationToCauseAutisticChild.ifOnePartnerIsAutistic,
      option: 'will cause autistic child',
      reverseOption: 'will cause neurotypical child'
    },
  ])
}

function logInsightsFromMatrix(chances: MatrixEntries<AllContextTags>) {
  const getCoefficientCalculatorInScope =
    (parentScope: (ctx: Set<AllContextTags>) => boolean) =>
      (subScope: (ctx: Set<AllContextTags>) => boolean = () => true) =>
        stripTail(
          chances
            .filter(e => parentScope(e.ctx) && subScope(e.ctx))
            .reduce((sum, e) => sum + e.coefficient, 0)
        )

  function getGroupedBySubCategory(subCategoryName: AllContextTags) {
    const calcCoefficient = getCoefficientCalculatorInScope(ctx => ctx.has(subCategoryName))
    return {
      [subCategoryName]: {
        autisticChild:     calcCoefficient(ctx => ctx.has('will cause autistic child')),
        neurotypicalChild: calcCoefficient(ctx => ctx.has('will cause neurotypical child')),
        all:               calcCoefficient()
      }
    }
  }

  function getGroupedByCategory(categoryName: AllContextTags) {
    return {
      [categoryName]: {
        all: getCoefficientCalculatorInScope(ctx => ctx.has(categoryName))()
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

function applyPipeline<T extends MatrixEntries<string>, K extends (T extends MatrixEntries<infer U> ? U : never)>(
  sourceArray: T,
  pipeline: {
    getCoefficient: (ctx: Set<K>) => number,
    option: string,
    reverseOption: string,
  }[]
) {
  let matrix = sourceArray
  for (const { getCoefficient, option, reverseOption } of pipeline) {
    const newMatrix: MatrixEntries<T> = [];
    for (const { ctx, coefficient: previousCoefficient } of matrix) {
      const additionalCoefficient = getCoefficient(ctx);
      if (additionalCoefficient < 0 || additionalCoefficient > 1)
        throw Error('Incorrect chances');
      newMatrix.push(
        { ctx: ctx.union(new Set([option       ])), coefficient: previousCoefficient * (additionalCoefficient    )},
        { ctx: ctx.union(new Set([reverseOption])), coefficient: previousCoefficient * (1 - additionalCoefficient)}
      )
    }
    matrix = newMatrix;
  }
  logMatrix(matrix);

  return matrix;
}

function logMatrix<T extends string>(matrix: MatrixEntries<T>) {
  console.table(
    matrix
      .sort((a, b) => [...a.ctx].join(', ').localeCompare([...b.ctx].join(', ')))
      .map(v => [stripTail(v.coefficient), ...v.ctx])
  )
}

function stripTail(n: number) {
  return Number(n.toFixed(10))
}

type MatrixEntries<T extends string> = {
  ctx: Set<T>,
  coefficient: number
}[];

type AllContextTags =
  | 'will cause autistic child'
  | 'will cause neurotypical child'
  | 'decided to skip'
  | 'decided not to skip'
  | 'autistic recipient'
  | 'neurotypical recipient'
  | 'autistic donor'
  | 'neurotypical donor'
