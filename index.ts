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
    usualFactor: number
  ) => (expectedOption === currentOption ? 1 - usualFactor : usualFactor);
  // pipeline length is always >= 1
  return applyBranchingTransformationPipeline(
    [{ ctx: {}, result: 1 }],
    {
      optionName: 'recipient is',
      options: ['autistic', 'neurotypical'],
      transform: (_, __, recipientIs) =>
        reverseFactorWhen(
          recipientIs,
          'neurotypical',
          config.probabilityOfRecipientToBeAutistic
        ),
    },
    {
      optionName: "recipient's decision is",
      options: ['to skip the choice', 'not to skip the choice'],
      transform: (factor, ctx, decisionIs) =>
        factor *
        reverseFactorWhen(
          decisionIs,
          'not to skip the choice',
          ctx['recipient is'] === 'autistic'
            ? config.chanceThatRecipientWillSkipChoosingDonor
                .ifRecipientIsAutistic
            : config.chanceThatRecipientWillSkipChoosingDonor
                .ifRecipientIsNeurotypical
        ),
    },
    {
      optionName: 'donor is',
      options: ['autistic', 'neurotypical'],
      transform: (factor, ctx, donorIs) =>
        factor *
        reverseFactorWhen(
          donorIs,
          'neurotypical',
          ctx["recipient's decision is"] === 'not to skip the choice'
            ? ctx['recipient is'] === 'autistic'
              ? config.chanceThatInvolvedRecipientWillChooseAutisticDonor
                  .ifRecipientIsAutistic
              : config.chanceThatInvolvedRecipientWillChooseAutisticDonor
                  .ifRecipientIsNeurotypical
            : config.probabilityOfDonorToBeAutistic
        ),
    },
    {
      optionName: 'caused child to be',
      options: ['autistic', 'neurotypical'],
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
    ...getGroupedBySubCategory("recipient's decision is to skip the choice"),
    ...getGroupedBySubCategory(
      "recipient's decision is not to skip the choice"
    ),
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
      .map((v) => ({ chance: stripTail(v.result * 100), ...v.ctx }))
  );
}

function stripTail(n: number) {
  return Number(n.toFixed(10));
}
