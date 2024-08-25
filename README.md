# Autism stats example

## What is this?

It's just silly little calculator to get stats of autism children' birth rates

## What's for?

For fun.

## Install dependencies

```bash
npm install
```

## Run script

Command to run script:
```bash
npm start
```

It will print something like this:
```javascript
┌─────────┬─────────┬──────────────────────────┬───────────────────────┬──────────────────────┬─────────────────────────────────┐
│ (index) │ 0       │ 1                        │ 2                     │ 3                    │ 4                               │
├─────────┼─────────┼──────────────────────────┼───────────────────────┼──────────────────────┼─────────────────────────────────┤
│ 0       │ 0.024   │ 'autistic recipient'     │ 'decided not to skip' │ 'autistic donor'     │ 'will cause autistic child'     │
│ 1       │ 0       │ 'autistic recipient'     │ 'decided not to skip' │ 'autistic donor'     │ 'will cause neurotypical child' │
│ 2       │ 0.008   │ 'autistic recipient'     │ 'decided not to skip' │ 'neurotypical donor' │ 'will cause autistic child'     │
│ 3       │ 0.008   │ 'autistic recipient'     │ 'decided not to skip' │ 'neurotypical donor' │ 'will cause neurotypical child' │
│ 4       │ 0.0005  │ 'autistic recipient'     │ 'decided to skip'     │ 'autistic donor'     │ 'will cause autistic child'     │
│ 5       │ 0       │ 'autistic recipient'     │ 'decided to skip'     │ 'autistic donor'     │ 'will cause neurotypical child' │
│ 6       │ 0.00475 │ 'autistic recipient'     │ 'decided to skip'     │ 'neurotypical donor' │ 'will cause autistic child'     │
│ 7       │ 0.00475 │ 'autistic recipient'     │ 'decided to skip'     │ 'neurotypical donor' │ 'will cause neurotypical child' │
│ 8       │ 0.0475  │ 'neurotypical recipient' │ 'decided not to skip' │ 'autistic donor'     │ 'will cause autistic child'     │
│ 9       │ 0.0475  │ 'neurotypical recipient' │ 'decided not to skip' │ 'autistic donor'     │ 'will cause neurotypical child' │
│ 10      │ 0       │ 'neurotypical recipient' │ 'decided not to skip' │ 'neurotypical donor' │ 'will cause autistic child'     │
│ 11      │ 0.665   │ 'neurotypical recipient' │ 'decided not to skip' │ 'neurotypical donor' │ 'will cause neurotypical child' │
│ 12      │ 0.00475 │ 'neurotypical recipient' │ 'decided to skip'     │ 'autistic donor'     │ 'will cause autistic child'     │
│ 13      │ 0.00475 │ 'neurotypical recipient' │ 'decided to skip'     │ 'autistic donor'     │ 'will cause neurotypical child' │
│ 14      │ 0       │ 'neurotypical recipient' │ 'decided to skip'     │ 'neurotypical donor' │ 'will cause autistic child'     │
│ 15      │ 0.1805  │ 'neurotypical recipient' │ 'decided to skip'     │ 'neurotypical donor' │ 'will cause neurotypical child' │
└─────────┴─────────┴──────────────────────────┴───────────────────────┴──────────────────────┴─────────────────────────────────┘
┌───────────────────────────────┬────────┬───────────────┬───────────────────┐
│ (index)                       │ all    │ autisticChild │ neurotypicalChild │
├───────────────────────────────┼────────┼───────────────┼───────────────────┤
│ will cause autistic child     │ 0.0895 │               │                   │
│ will cause neurotypical child │ 0.9105 │               │                   │
│ decided to skip               │ 0.2    │ 0.01          │ 0.19              │
│ decided not to skip           │ 0.8    │ 0.0795        │ 0.7205            │
│ autistic recipient            │ 0.05   │ 0.03725       │ 0.01275           │
│ neurotypical recipient        │ 0.95   │ 0.05225       │ 0.89775           │
│ autistic donor                │ 0.129  │ 0.07675       │ 0.05225           │
│ neurotypical donor            │ 0.871  │ 0.01275       │ 0.85825           │
└───────────────────────────────┴────────┴───────────────┴───────────────────┘
```

Output will differ depending on the parameters you set at the beggining of `index.ts`:
```javascript
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
    ifRecipientIsAutistic: 0.5,
  },
  chanceThatInvolvedRecipientWillChooseAutisticDonor: {
    ifRecipientIsNeurotypical: 0.125,
    ifRecipientIsAutistic: 0.6,
  }
})
```

All parameters are normalized from `0` to `1`.
