// https://stackoverflow.com/a/53175538
// https://github.com/microsoft/TypeScript/issues/30370
// https://github.com/microsoft/TypeScript/pull/52088

import {
  applyBranchingTransformationPipeline,
  type MatrixEntries,
} from './applyBranchingTransformationPipeline.js';

const chances = getChances({
  probabilityOfDonorToBeAutistic: 0.05,
  probabilityOfRecipientToBeAutistic: 0.05,
  chanceOfDonationToCauseAutisticChild: {
    ifBothPartnersAreAutistic: 1,
    ifOnePartnerIsAutistic: 0.5,
    ifNoneAreAutistic: 0,
  },
  chanceThatRecipientWillSkipChoosingDonor: {
    ifRecipientIsNeurotypical: 0.2,
    ifRecipientIsAutistic: 0.2,
  },
  chanceThatInvolvedRecipientWillChooseAutisticDonor: {
    ifRecipientIsNeurotypical: 0.125,
    ifRecipientIsAutistic: 0.6,
  },
});

const renderCtx = (ctx: Record<string, string>) =>
  Object.entries(ctx).map((e) => e.join(' '));

logMatrix(chances);
logInsightsFromMatrix(
  chances.map((e) => ({ ctx: renderCtx(e.ctx), factor: e.result }))
);

function getChances(config: {
  probabilityOfDonorToBeAutistic: number;
  probabilityOfRecipientToBeAutistic: number;
  chanceOfDonationToCauseAutisticChild: {
    ifBothPartnersAreAutistic: number;
    ifOnePartnerIsAutistic: number;
    ifNoneAreAutistic: number;
  };
  chanceThatRecipientWillSkipChoosingDonor: {
    ifRecipientIsAutistic: number;
    ifRecipientIsNeurotypical: number;
  };
  chanceThatInvolvedRecipientWillChooseAutisticDonor: {
    ifRecipientIsAutistic: number;
    ifRecipientIsNeurotypical: number;
  };
}) {
  const reverseFactorWhen = <T, U extends T>(
    currentOption: T,
    expectedOption: U,
    matchingFactor: number
  ) => (expectedOption === currentOption ? 1 - matchingFactor : matchingFactor);
  // pipeline length is always >= 1
  return applyBranchingTransformationPipeline(
    [{ ctx: {}, result: 1 }],
    {
      transform: (_, __, recipientIs) =>
        reverseFactorWhen(
          recipientIs,
          'neurotypical',
          config.probabilityOfRecipientToBeAutistic
        ),
      options: ['autistic', 'neurotypical'],
      optionName: 'recipient is',
    },
    {
      transform: (factor, ctx, decisionIs) =>
        factor *
        reverseFactorWhen(
          decisionIs,
          'not to skip',
          ctx['recipient is'] === 'autistic'
            ? config.chanceThatRecipientWillSkipChoosingDonor
                .ifRecipientIsAutistic
            : config.chanceThatRecipientWillSkipChoosingDonor
                .ifRecipientIsNeurotypical
        ),

      options: ['to skip', 'not to skip'],
      optionName: 'decision is',
    },
    {
      transform: (factor, ctx, donorIs) =>
        factor *
        reverseFactorWhen(
          donorIs,
          'neurotypical',
          ctx['decision is'] === 'not to skip'
            ? ctx['recipient is'] === 'autistic'
              ? config.chanceThatInvolvedRecipientWillChooseAutisticDonor
                  .ifRecipientIsAutistic
              : config.chanceThatInvolvedRecipientWillChooseAutisticDonor
                  .ifRecipientIsNeurotypical
            : config.probabilityOfDonorToBeAutistic
        ),
      options: ['autistic', 'neurotypical'],
      optionName: 'donor is',
    },
    {
      transform: (factor, ctx, childWillBe) =>
        factor *
        reverseFactorWhen(
          childWillBe,
          'neurotypical',
          ctx['recipient is'] === 'autistic' && ctx['donor is'] === 'autistic'
            ? config.chanceOfDonationToCauseAutisticChild
                .ifBothPartnersAreAutistic
            : ctx['recipient is'] === 'neurotypical' &&
              ctx['donor is'] === 'neurotypical'
            ? config.chanceOfDonationToCauseAutisticChild.ifNoneAreAutistic
            : config.chanceOfDonationToCauseAutisticChild.ifOnePartnerIsAutistic
        ),
      options: ['autistic', 'neurotypical'],
      optionName: 'caused child to be',
    }
  );
}

function logInsightsFromMatrix(chances: { ctx: string[]; factor: number }[]) {
  const transformCalculatorInScope =
    (parentScope: (ctx: Array<string>) => boolean) =>
    (subScope: (ctx: Array<string>) => boolean = () => true) =>
      stripTail(
        chances
          .filter((e) => parentScope(e.ctx) && subScope(e.ctx))
          .reduce((sum, e) => sum + e.factor, 0)
      );

  function getGroupedBySubCategory(subCategoryName: string) {
    const calcFactor = transformCalculatorInScope((ctx) =>
      ctx.includes(subCategoryName)
    );
    return {
      [subCategoryName]: {
        autisticChild: calcFactor((ctx) =>
          ctx.includes('caused child to be autistic')
        ),
        neurotypicalChild: calcFactor((ctx) =>
          ctx.includes('caused child to be neurotypical')
        ),
        all: calcFactor(),
      },
    };
  }

  function getGroupedByCategory(categoryName: string) {
    return {
      [categoryName]: {
        all: transformCalculatorInScope((ctx) => ctx.includes(categoryName))(),
      },
    };
  }

  console.table({
    ...getGroupedByCategory('caused child to be autistic'),
    ...getGroupedByCategory('caused child to be neurotypical'),
    ...getGroupedBySubCategory('decision is to skip'),
    ...getGroupedBySubCategory('decision is not to skip'),
    ...getGroupedBySubCategory('recipient is autistic'),
    ...getGroupedBySubCategory('recipient is neurotypical'),
    ...getGroupedBySubCategory('donor is autistic'),
    ...getGroupedBySubCategory('donor is neurotypical'),
  });
}

function logMatrix(matrix: MatrixEntries<Record<string, string>, number>) {
  console.table(
    matrix
      .sort((a, b) =>
        renderCtx(a.ctx).join(', ').localeCompare(renderCtx(b.ctx).join(', '))
      )
      .map((v) => [stripTail(v.result), ...renderCtx(v.ctx)])
  );
}

function stripTail(n: number) {
  return Number(n.toFixed(10));
}
