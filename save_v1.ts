// import { deepStrictEqual } from 'assert';

function expandMatrix({
  sourceArray,
  activateWhen,
  coefficient,
  option,
  reverseOption
}: {
  sourceArray: [ctx: string[], coefficient: number][],
  activateWhen: (ctx: string[]) => boolean,
  coefficient: number,
  option: string,
  reverseOption: string,
}): [string[], number][] {
  const unaffectedPart = sourceArray.filter(v => !activateWhen(v[0]))
  const affectedPart = sourceArray.filter(v => activateWhen(v[0]))
  return unaffectedPart
    .concat(affectedPart.map(v => [[...v[0], option       ], v[1] * (coefficient    )]))
    .concat(affectedPart.map(v => [[...v[0], reverseOption], v[1] * (1 - coefficient)]));
}

const config = {
  probabilityOfDonorToBeAutistic: 0.05 as number,
  probabilityOfRecipientToBeAutistic: 0.05 as number,
  chanceOfDonationToCauseAutisticChild: {
    ifBothAreAutistic: 1 as number,
    ifOnePartnerIsAutistic: 0.5 as number,
    ifNoneAreAutistic: 0 as number
  },
  chanceThatRecipientWillSkipChoosingDonor: {
    ifRecipientIsNeurotypical: 0.2 as number,
    ifRecipientIsAutistic: 0.5 as number,
  },
  chanceThatInvolvedRecipientWillChooseAutisticDonor: {
    ifRecipientIsNeurotypical: 0.125 as number,
    ifRecipientIsAutistic: 0.6 as number,
  }
} as const;


let sourceArray = expandMatrix({
  sourceArray: [
    [[], 1],
  ],
  activateWhen: () => true,
  coefficient: config.probabilityOfRecipientToBeAutistic,
  option: 'autistic recipient',
  reverseOption: 'neurotypical recipient'
})

//////////////

sourceArray = expandMatrix({
  sourceArray,
  activateWhen: ctx => ctx.includes('autistic recipient'),
  coefficient: config.chanceThatRecipientWillSkipChoosingDonor.ifRecipientIsAutistic,
  option: 'decided to skip',
  reverseOption: 'decided not to skip'
})

sourceArray = expandMatrix({
  sourceArray,
  activateWhen: ctx => ctx.includes('neurotypical recipient'),
  coefficient: config.chanceThatRecipientWillSkipChoosingDonor.ifRecipientIsNeurotypical,
  option: 'decided to skip',
  reverseOption: 'decided not to skip'
})

//////////////

sourceArray = expandMatrix({
  sourceArray,
  activateWhen: ctx => ctx.includes('autistic recipient') && ctx.includes('decided not to skip'),
  coefficient: config.chanceThatInvolvedRecipientWillChooseAutisticDonor.ifRecipientIsAutistic,
  option: 'autistic donor',
  reverseOption: 'neurotypical donor'
})

sourceArray = expandMatrix({
  sourceArray,
  activateWhen: ctx => ctx.includes('neurotypical recipient') && ctx.includes('decided not to skip'),
  coefficient: config.chanceThatInvolvedRecipientWillChooseAutisticDonor.ifRecipientIsNeurotypical,
  option: 'autistic donor',
  reverseOption: 'neurotypical donor'
})

sourceArray = expandMatrix({
  sourceArray,
  activateWhen: ctx => ctx.includes('decided to skip'),
  coefficient: config.probabilityOfDonorToBeAutistic,
  option: 'autistic donor',
  reverseOption: 'neurotypical donor'
})

//////////////

sourceArray = expandMatrix({
  sourceArray,
  activateWhen: ctx => ctx.includes('autistic recipient') && ctx.includes('autistic donor'),
  coefficient: config.chanceOfDonationToCauseAutisticChild.ifBothAreAutistic,
  option: 'will result in autistic child',
  reverseOption: 'will result in neurotypical child'
})

sourceArray = expandMatrix({
  sourceArray,
  activateWhen: ctx => ctx.includes('neurotypical recipient') && ctx.includes('neurotypical donor'),
  coefficient: config.chanceOfDonationToCauseAutisticChild.ifNoneAreAutistic,
  option: 'will result in autistic child',
  reverseOption: 'will result in neurotypical child'
})

sourceArray = expandMatrix({
  sourceArray,
  activateWhen: ctx => (
    ctx.includes('neurotypical recipient') && ctx.includes('autistic donor')
  ) || (
    ctx.includes('autistic recipient') && ctx.includes('neurotypical donor')
  ),
  coefficient: config.chanceOfDonationToCauseAutisticChild.ifOnePartnerIsAutistic,
  option: 'will result in autistic child',
  reverseOption: 'will result in neurotypical child'
})

console.table(sourceArray.map(v => [Number(v[1].toFixed(8)), v[0].join(', ')] as [number, string]).sort((a, b)=> a[1].localeCompare(b[1])))


function getChancesLowLevel({
  probabilityOfDonorToBeAutistic: a, // +
  probabilityOfRecipientToBeAutistic: b, // +
  chanceOfDonationToCauseAutisticChild: {
    ifBothAreAutistic: c,
    ifOnePartnerIsAutistic: d,
    ifNoneAreAutistic: e,
  },
  chanceThatRecipientWillSkipChoosingDonor: { // +
    ifRecipientIsAutistic: f, // +
    ifRecipientIsNeurotypical: g, // +
  }, // +
  chanceThatInvolvedRecipientWillChooseAutisticDonor: { // +
    ifRecipientIsAutistic: h, // +
    ifRecipientIsNeurotypical: k, // +
  }, // +
}: typeof config) {
  if(
    [a, b, c, d, e, f, g, h, k].some(e => e < 0 || e > 1)
  ) throw Error('Incorrect chances');

  const chances = sourceArray;

  // assert(chances.reduce((sum, e) => sum + e[1], 0) === 1)

  return {
    autisticChild:     chances.filter(e => e[0][0] === 'autistic recipient').reduce((sum, e) => sum + e[1], 0),
    neurotypicalChild: chances.filter(e => e[0][0] === 'neurotypical recipient').reduce((sum, e) => sum + e[1], 0)
  }
}

// function getChances({
//   probabilityOfManToBeAutistic: a,
//   probabilityOfWomanToBeAutistic: b,
//   chanceOfSexToCauseAutisticChild: {
//     whenBothAreAutistic: c,
//     whenOnePartnerIsAutistic: d,
//     whenNoneAreAutistic: e,
//   },
//   chanceThatItDoesntMatterIfChildIsAutistic: {
//     whenWomanIsAutistic: f,
//     whenWomanIsNeurotypical: g,
//   },
//   chanceThatItsImportantForChildToBeAutisticSpecifically: {
//     whenWomanIsAutistic: h,
//     whenWomanIsNeurotypical: k,
//   },
// }) {}

const result = getChancesLowLevel(config)

console.log(result)
