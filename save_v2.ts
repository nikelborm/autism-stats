const chances = getChances({
  probabilityOfDonorToBeAutistic: 0.05,
  probabilityOfRecipientToBeAutistic: 0.05,
  chanceOfDonationToCauseAutisticChild: {
    ifBothAreAutistic: 1,
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
    ifBothAreAutistic: number,
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
  return applyPipeline([{ ctx: [], coefficient: 1 }], [
    {
      getCoefficient: () => config.probabilityOfRecipientToBeAutistic,
      option: 'autistic recipient',
      reverseOption: 'neurotypical recipient'
    },
    {
      getCoefficient: (ctx) =>
        ctx.includes('autistic recipient')
          ? config.chanceThatRecipientWillSkipChoosingDonor.ifRecipientIsAutistic
          : config.chanceThatRecipientWillSkipChoosingDonor.ifRecipientIsNeurotypical,
      option: 'decided to skip',
      reverseOption: 'decided not to skip'
    },
    {
      getCoefficient: (ctx) =>
        ctx.includes('decided not to skip')
          ? (ctx.includes('autistic recipient')
            ? config.chanceThatInvolvedRecipientWillChooseAutisticDonor.ifRecipientIsAutistic
            : config.chanceThatInvolvedRecipientWillChooseAutisticDonor.ifRecipientIsNeurotypical)
          : config.probabilityOfDonorToBeAutistic,
      option: 'autistic donor',
      reverseOption: 'neurotypical donor'
    },
    {
      getCoefficient: (ctx) =>
        ctx.includes('autistic recipient') && ctx.includes('autistic donor')
          ? config.chanceOfDonationToCauseAutisticChild.ifBothAreAutistic
          : ctx.includes('neurotypical recipient') && ctx.includes('neurotypical donor')
            ? config.chanceOfDonationToCauseAutisticChild.ifNoneAreAutistic
            : config.chanceOfDonationToCauseAutisticChild.ifOnePartnerIsAutistic,
      option: 'will cause autistic child',
      reverseOption: 'will cause neurotypical child'
    },
  ])
}

function logInsightsFromMatrix(chances: MatrixEntry[]) {
  const getCoefficientCalculatorInScope =
    (parentScope: (ctx: string[]) => boolean) =>
      (subScope: (ctx: string[]) => boolean = () => true) =>
        stripTail(
          chances
            .filter(e => parentScope(e.ctx) && subScope(e.ctx))
            .reduce((sum, e) => sum + e.coefficient, 0)
        )

  function getGroupedBySubCategory(subCategoryName: string) {
    const calcCoefficient = getCoefficientCalculatorInScope(ctx => ctx.includes(subCategoryName))
    return {
      [subCategoryName]: {
        autisticChild:     calcCoefficient(ctx => ctx.includes('will cause autistic child')),
        neurotypicalChild: calcCoefficient(ctx => ctx.includes('will cause neurotypical child')),
        all:               calcCoefficient()
      }
    }
  }

  function getGroupedByCategory(categoryName: string) {
    return {
      [categoryName]: {
        all: getCoefficientCalculatorInScope(ctx => ctx.includes(categoryName))()
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

function applyPipeline(
  sourceArray: MatrixEntry[],
  pipeline: {
    getCoefficient: (ctx: string[]) => number,
    option: string,
    reverseOption: string,
  }[]
) {
  let matrix = sourceArray
  for (const { getCoefficient, option, reverseOption } of pipeline) {
    const newMatrix: MatrixEntry[] = [];
    for (const { ctx, coefficient: previousCoefficient } of matrix) {
      const coefficient = getCoefficient(ctx);
      if (coefficient < 0 || coefficient > 1)
        throw Error('Incorrect chances');
      newMatrix.push(
        { ctx: [...ctx, option       ], coefficient: previousCoefficient * (coefficient    )},
        { ctx: [...ctx, reverseOption], coefficient: previousCoefficient * (1 - coefficient)}
      )
    }
    matrix = newMatrix;
  }
  logMatrix(matrix);

  return matrix;
}

function logMatrix(matrix: MatrixEntry[]) {
  console.table(
    matrix
      .sort((a, b) => a.ctx.join(', ').localeCompare(b.ctx.join(', ')))
      .map(v => [stripTail(v.coefficient), ...v.ctx])
  )
}

function stripTail(n: number) {
  return Number(n.toFixed(10))
}

type MatrixEntry = {
  ctx: string[],
  coefficient: number
};
