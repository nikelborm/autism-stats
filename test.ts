const config = {
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
} as const;

const asd = [
  {
    getCoefficient: () => config.probabilityOfRecipientToBeAutistic,
    option: 'autistic recipient',
    reverseOption: 'neurotypical recipient'
  },
  {
    getCoefficient: (ctx: Set<string>) =>
      ctx.has('autistic recipient')
        ? config.chanceThatRecipientWillSkipChoosingDonor.ifRecipientIsAutistic
        : config.chanceThatRecipientWillSkipChoosingDonor.ifRecipientIsNeurotypical,
    option: 'decided to skip',
    reverseOption: 'decided not to skip'
  },
  {
    getCoefficient: (ctx: Set<string>) =>
      ctx.has('decided not to skip')
        ? (ctx.has('autistic recipient')
          ? config.chanceThatInvolvedRecipientWillChooseAutisticDonor.ifRecipientIsAutistic
          : config.chanceThatInvolvedRecipientWillChooseAutisticDonor.ifRecipientIsNeurotypical)
        : config.probabilityOfDonorToBeAutistic,
    option: 'autistic donor',
    reverseOption: 'neurotypical donor'
  },
  {
    getCoefficient: (ctx: Set<string>) =>
      ctx.has('autistic recipient') && ctx.has('autistic donor')
        ? config.chanceOfDonationToCauseAutisticChild.ifBothPartnersAreAutistic
        : ctx.has('neurotypical recipient') && ctx.has('neurotypical donor')
          ? config.chanceOfDonationToCauseAutisticChild.ifNoneAreAutistic
          : config.chanceOfDonationToCauseAutisticChild.ifOnePartnerIsAutistic,
    option: 'will cause autistic child',
    reverseOption: 'will cause neurotypical child'
  },
];
// type Iterate = 
