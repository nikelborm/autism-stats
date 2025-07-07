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
┌────┬─────────┬───────────────────────────┬─────────────────────────┬───────────────────────┬─────────────────────────────────┐
│    │ 0       │ 1                         │ 2                       │ 3                     │ 4                               │
├────┼─────────┼───────────────────────────┼─────────────────────────┼───────────────────────┼─────────────────────────────────┤
│  0 │ 0.024   │ recipient is autistic     │ decision is not to skip │ donor is autistic     │ caused child to be autistic     │
│  1 │ 0       │ recipient is autistic     │ decision is not to skip │ donor is autistic     │ caused child to be neurotypical │
│  2 │ 0.008   │ recipient is autistic     │ decision is not to skip │ donor is neurotypical │ caused child to be autistic     │
│  3 │ 0.008   │ recipient is autistic     │ decision is not to skip │ donor is neurotypical │ caused child to be neurotypical │
│  4 │ 0.0005  │ recipient is autistic     │ decision is to skip     │ donor is autistic     │ caused child to be autistic     │
│  5 │ 0       │ recipient is autistic     │ decision is to skip     │ donor is autistic     │ caused child to be neurotypical │
│  6 │ 0.00475 │ recipient is autistic     │ decision is to skip     │ donor is neurotypical │ caused child to be autistic     │
│  7 │ 0.00475 │ recipient is autistic     │ decision is to skip     │ donor is neurotypical │ caused child to be neurotypical │
│  8 │ 0.0475  │ recipient is neurotypical │ decision is not to skip │ donor is autistic     │ caused child to be autistic     │
│  9 │ 0.0475  │ recipient is neurotypical │ decision is not to skip │ donor is autistic     │ caused child to be neurotypical │
│ 10 │ 0       │ recipient is neurotypical │ decision is not to skip │ donor is neurotypical │ caused child to be autistic     │
│ 11 │ 0.665   │ recipient is neurotypical │ decision is not to skip │ donor is neurotypical │ caused child to be neurotypical │
│ 12 │ 0.00475 │ recipient is neurotypical │ decision is to skip     │ donor is autistic     │ caused child to be autistic     │
│ 13 │ 0.00475 │ recipient is neurotypical │ decision is to skip     │ donor is autistic     │ caused child to be neurotypical │
│ 14 │ 0       │ recipient is neurotypical │ decision is to skip     │ donor is neurotypical │ caused child to be autistic     │
│ 15 │ 0.1805  │ recipient is neurotypical │ decision is to skip     │ donor is neurotypical │ caused child to be neurotypical │
└────┴─────────┴───────────────────────────┴─────────────────────────┴───────────────────────┴─────────────────────────────────┘
┌─────────────────────────────────┬────────┬───────────────┬───────────────────┐
│                                 │ all    │ autisticChild │ neurotypicalChild │
├─────────────────────────────────┼────────┼───────────────┼───────────────────┤
│     caused child to be autistic │ 0.0895 │               │                   │
│ caused child to be neurotypical │ 0.9105 │               │                   │
│             decision is to skip │ 0.2    │ 0.01          │ 0.19              │
│         decision is not to skip │ 0.8    │ 0.0795        │ 0.7205            │
│           recipient is autistic │ 0.05   │ 0.03725       │ 0.01275           │
│       recipient is neurotypical │ 0.95   │ 0.05225       │ 0.89775           │
│               donor is autistic │ 0.129  │ 0.07675       │ 0.05225           │
│           donor is neurotypical │ 0.871  │ 0.01275       │ 0.85825           │
└─────────────────────────────────┴────────┴───────────────┴───────────────────┘
```

Output will differ depending on the parameters you set at the beggining of `index.ts`:

```javascript
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
    ifRecipientIsAutistic: 0.5,
  },
  chanceThatInvolvedRecipientWillChooseAutisticDonor: {
    ifRecipientIsNeurotypical: 0.125,
    ifRecipientIsAutistic: 0.6,
  },
});
```

All parameters are normalized from `0` to `1`.

## TODO

1. Integrate codegen from https://github.com/ksxnodemodules/ts-pipe-compose
