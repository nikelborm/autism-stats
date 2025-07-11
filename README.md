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

| chance | recipient is | recipient's decision is | donor is     | caused child to be |
| ------ | ------------ | ----------------------- | ------------ | ------------------ |
| 2.4    | autistic     | not to skip the choice  | autistic     | autistic           |
| 0      | autistic     | not to skip the choice  | autistic     | neurotypical       |
| 0.8    | autistic     | not to skip the choice  | neurotypical | autistic           |
| 0.8    | autistic     | not to skip the choice  | neurotypical | neurotypical       |
| 0.05   | autistic     | to skip the choice      | autistic     | autistic           |
| 0      | autistic     | to skip the choice      | autistic     | neurotypical       |
| 0.475  | autistic     | to skip the choice      | neurotypical | autistic           |
| 0.475  | autistic     | to skip the choice      | neurotypical | neurotypical       |
| 4.75   | neurotypical | not to skip the choice  | autistic     | autistic           |
| 4.75   | neurotypical | not to skip the choice  | autistic     | neurotypical       |
| 0      | neurotypical | not to skip the choice  | neurotypical | autistic           |
| 66.5   | neurotypical | not to skip the choice  | neurotypical | neurotypical       |
| 0.475  | neurotypical | to skip the choice      | autistic     | autistic           |
| 0.475  | neurotypical | to skip the choice      | autistic     | neurotypical       |
| 0      | neurotypical | to skip the choice      | neurotypical | autistic           |
| 18.05  | neurotypical | to skip the choice      | neurotypical | neurotypical       |

|                                                | all    | autistic child | neurotypical child |
| ---------------------------------------------- | ------ | -------------- | ------------------ |
| caused child to be autistic                    | 0.0895 |                |                    |
| caused child to be neurotypical                | 0.9105 |                |                    |
| recipient's decision is to skip the choice     | 0.2    | 0.01           | 0.19               |
| recipient's decision is not to skip the choice | 0.8    | 0.0795         | 0.7205             |
| recipient is autistic                          | 0.05   | 0.03725        | 0.01275            |
| recipient is neurotypical                      | 0.95   | 0.05225        | 0.89775            |
| donor is autistic                              | 0.129  | 0.07675        | 0.05225            |
| donor is neurotypical                          | 0.871  | 0.01275        | 0.85825            |

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
