// function generateOverloads(amountOfSignatures: number) {
//   let signature = '';

//   for (
//     let currentSignatureIndex = 1;
//     currentSignatureIndex < amountOfSignatures;
//     currentSignatureIndex++
//   ) {
//     signature += 'export function applyBranchingTransformationPipeline<\n';
//     signature += '  InitialContext extends Record<string, string>,\n';
//     signature += '  Result0,\n';
//     for (let i = 1; i <= currentSignatureIndex; i++) {
//       signature += `  const Name${i} extends string, const Values${i} extends string, Result${i},\n`;
//     }
//     signature += '  Entries extends [\n';
//     for (let i = 1; i <= currentSignatureIndex; i++) {
//       signature += `    [Name${i}, Values${i}],\n`;
//     }
//     signature += '  ]\n';
//     signature += '>(\n';
//     (signature += '  sourceArray: MatrixEntries<InitialContext, Result0>,\n'),
//       (signature += '  ...pipelineOperations: [\n');
//     for (let i = 1; i <= currentSignatureIndex; i++) {
//       signature += `    SinglePipelineChoiceSplitter<Name${i}, Values${i}, Result${
//         i - 1
//       }, ${i - 1}, Result${i}, Entries, InitialContext>,\n`;
//     }
//     signature += '  ]\n';
//     signature += `): MatrixEntries<InitialContext & AssemblyEntriesToObject<Entries>, Result${currentSignatureIndex}>\n`;
//   }

//   console.log(signature);
// }

type SinglePipelineChoiceSplitter<
  OptionName extends string,
  CurrentOptionUnion extends string,
  TransformationSource,
  AmountOfContextEntriesToUse extends number,
  TransformationResult,
  AllEntries extends Entry[],
  InitialContext extends Record<string, string>
> = {
  transform: (
    transformationSource: NoInfer<TransformationSource>,
    previousContext: InitialContext &
      AssemblyEntriesToObject<
        SliceArrFromZeroIndexToNthElement<
          AllEntries,
          AmountOfContextEntriesToUse
        >
      >,
    currentOption: NoInfer<CurrentOptionUnion>
  ) => TransformationResult;
  optionName: OptionName;
  options: CurrentOptionUnion[];
};

type Entry = [string, string];

export type MatrixEntries<Ctx extends Record<string, string>, Result> = {
  ctx: Ctx;
  result: Result;
}[];

type AssemblyEntriesToObject<Entries extends Entry[]> = Entries extends [
  infer CurrentEntry extends Entry,
  ...infer RestEntries extends Entry[]
]
  ? {
      [key in CurrentEntry[0]]: CurrentEntry[1];
    } & AssemblyEntriesToObject<RestEntries>
  : {};

type SliceArrFromZeroIndexToNthElement<
  Arr extends any[],
  LimitLength extends number,
  ReturnArr extends any[] = []
> = ReturnArr['length'] extends LimitLength
  ? ReturnArr
  : Arr extends [infer A, ...infer other extends any[]]
  ? SliceArrFromZeroIndexToNthElement<other, LimitLength, [...ReturnArr, A]>
  : ReturnArr;

export function applyBranchingTransformationPipeline<
  InitialContext extends Record<string, string>,
  Result0,
  const Name1 extends string,
  const Values1 extends string,
  Result1,
  Entries extends [[Name1, Values1]]
>(
  sourceArray: MatrixEntries<InitialContext, Result0>,
  ...pipelineOperations: [
    SinglePipelineChoiceSplitter<
      Name1,
      Values1,
      Result0,
      0,
      Result1,
      Entries,
      InitialContext
    >
  ]
): MatrixEntries<InitialContext & AssemblyEntriesToObject<Entries>, Result1>;
export function applyBranchingTransformationPipeline<
  InitialContext extends Record<string, string>,
  Result0,
  const Name1 extends string,
  const Values1 extends string,
  Result1,
  const Name2 extends string,
  const Values2 extends string,
  Result2,
  Entries extends [[Name1, Values1], [Name2, Values2]]
>(
  sourceArray: MatrixEntries<InitialContext, Result0>,
  ...pipelineOperations: [
    SinglePipelineChoiceSplitter<
      Name1,
      Values1,
      Result0,
      0,
      Result1,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name2,
      Values2,
      Result1,
      1,
      Result2,
      Entries,
      InitialContext
    >
  ]
): MatrixEntries<InitialContext & AssemblyEntriesToObject<Entries>, Result2>;
export function applyBranchingTransformationPipeline<
  InitialContext extends Record<string, string>,
  Result0,
  const Name1 extends string,
  const Values1 extends string,
  Result1,
  const Name2 extends string,
  const Values2 extends string,
  Result2,
  const Name3 extends string,
  const Values3 extends string,
  Result3,
  Entries extends [[Name1, Values1], [Name2, Values2], [Name3, Values3]]
>(
  sourceArray: MatrixEntries<InitialContext, Result0>,
  ...pipelineOperations: [
    SinglePipelineChoiceSplitter<
      Name1,
      Values1,
      Result0,
      0,
      Result1,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name2,
      Values2,
      Result1,
      1,
      Result2,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name3,
      Values3,
      Result2,
      2,
      Result3,
      Entries,
      InitialContext
    >
  ]
): MatrixEntries<InitialContext & AssemblyEntriesToObject<Entries>, Result3>;
export function applyBranchingTransformationPipeline<
  InitialContext extends Record<string, string>,
  Result0,
  const Name1 extends string,
  const Values1 extends string,
  Result1,
  const Name2 extends string,
  const Values2 extends string,
  Result2,
  const Name3 extends string,
  const Values3 extends string,
  Result3,
  const Name4 extends string,
  const Values4 extends string,
  Result4,
  Entries extends [
    [Name1, Values1],
    [Name2, Values2],
    [Name3, Values3],
    [Name4, Values4]
  ]
>(
  sourceArray: MatrixEntries<InitialContext, Result0>,
  ...pipelineOperations: [
    SinglePipelineChoiceSplitter<
      Name1,
      Values1,
      Result0,
      0,
      Result1,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name2,
      Values2,
      Result1,
      1,
      Result2,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name3,
      Values3,
      Result2,
      2,
      Result3,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name4,
      Values4,
      Result3,
      3,
      Result4,
      Entries,
      InitialContext
    >
  ]
): MatrixEntries<InitialContext & AssemblyEntriesToObject<Entries>, Result4>;
export function applyBranchingTransformationPipeline<
  InitialContext extends Record<string, string>,
  Result0,
  const Name1 extends string,
  const Values1 extends string,
  Result1,
  const Name2 extends string,
  const Values2 extends string,
  Result2,
  const Name3 extends string,
  const Values3 extends string,
  Result3,
  const Name4 extends string,
  const Values4 extends string,
  Result4,
  const Name5 extends string,
  const Values5 extends string,
  Result5,
  Entries extends [
    [Name1, Values1],
    [Name2, Values2],
    [Name3, Values3],
    [Name4, Values4],
    [Name5, Values5]
  ]
>(
  sourceArray: MatrixEntries<InitialContext, Result0>,
  ...pipelineOperations: [
    SinglePipelineChoiceSplitter<
      Name1,
      Values1,
      Result0,
      0,
      Result1,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name2,
      Values2,
      Result1,
      1,
      Result2,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name3,
      Values3,
      Result2,
      2,
      Result3,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name4,
      Values4,
      Result3,
      3,
      Result4,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name5,
      Values5,
      Result4,
      4,
      Result5,
      Entries,
      InitialContext
    >
  ]
): MatrixEntries<InitialContext & AssemblyEntriesToObject<Entries>, Result5>;
export function applyBranchingTransformationPipeline<
  InitialContext extends Record<string, string>,
  Result0,
  const Name1 extends string,
  const Values1 extends string,
  Result1,
  const Name2 extends string,
  const Values2 extends string,
  Result2,
  const Name3 extends string,
  const Values3 extends string,
  Result3,
  const Name4 extends string,
  const Values4 extends string,
  Result4,
  const Name5 extends string,
  const Values5 extends string,
  Result5,
  const Name6 extends string,
  const Values6 extends string,
  Result6,
  Entries extends [
    [Name1, Values1],
    [Name2, Values2],
    [Name3, Values3],
    [Name4, Values4],
    [Name5, Values5],
    [Name6, Values6]
  ]
>(
  sourceArray: MatrixEntries<InitialContext, Result0>,
  ...pipelineOperations: [
    SinglePipelineChoiceSplitter<
      Name1,
      Values1,
      Result0,
      0,
      Result1,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name2,
      Values2,
      Result1,
      1,
      Result2,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name3,
      Values3,
      Result2,
      2,
      Result3,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name4,
      Values4,
      Result3,
      3,
      Result4,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name5,
      Values5,
      Result4,
      4,
      Result5,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name6,
      Values6,
      Result5,
      5,
      Result6,
      Entries,
      InitialContext
    >
  ]
): MatrixEntries<InitialContext & AssemblyEntriesToObject<Entries>, Result6>;
export function applyBranchingTransformationPipeline<
  InitialContext extends Record<string, string>,
  Result0,
  const Name1 extends string,
  const Values1 extends string,
  Result1,
  const Name2 extends string,
  const Values2 extends string,
  Result2,
  const Name3 extends string,
  const Values3 extends string,
  Result3,
  const Name4 extends string,
  const Values4 extends string,
  Result4,
  const Name5 extends string,
  const Values5 extends string,
  Result5,
  const Name6 extends string,
  const Values6 extends string,
  Result6,
  const Name7 extends string,
  const Values7 extends string,
  Result7,
  Entries extends [
    [Name1, Values1],
    [Name2, Values2],
    [Name3, Values3],
    [Name4, Values4],
    [Name5, Values5],
    [Name6, Values6],
    [Name7, Values7]
  ]
>(
  sourceArray: MatrixEntries<InitialContext, Result0>,
  ...pipelineOperations: [
    SinglePipelineChoiceSplitter<
      Name1,
      Values1,
      Result0,
      0,
      Result1,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name2,
      Values2,
      Result1,
      1,
      Result2,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name3,
      Values3,
      Result2,
      2,
      Result3,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name4,
      Values4,
      Result3,
      3,
      Result4,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name5,
      Values5,
      Result4,
      4,
      Result5,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name6,
      Values6,
      Result5,
      5,
      Result6,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name7,
      Values7,
      Result6,
      6,
      Result7,
      Entries,
      InitialContext
    >
  ]
): MatrixEntries<InitialContext & AssemblyEntriesToObject<Entries>, Result7>;
export function applyBranchingTransformationPipeline<
  InitialContext extends Record<string, string>,
  Result0,
  const Name1 extends string,
  const Values1 extends string,
  Result1,
  const Name2 extends string,
  const Values2 extends string,
  Result2,
  const Name3 extends string,
  const Values3 extends string,
  Result3,
  const Name4 extends string,
  const Values4 extends string,
  Result4,
  const Name5 extends string,
  const Values5 extends string,
  Result5,
  const Name6 extends string,
  const Values6 extends string,
  Result6,
  const Name7 extends string,
  const Values7 extends string,
  Result7,
  const Name8 extends string,
  const Values8 extends string,
  Result8,
  Entries extends [
    [Name1, Values1],
    [Name2, Values2],
    [Name3, Values3],
    [Name4, Values4],
    [Name5, Values5],
    [Name6, Values6],
    [Name7, Values7],
    [Name8, Values8]
  ]
>(
  sourceArray: MatrixEntries<InitialContext, Result0>,
  ...pipelineOperations: [
    SinglePipelineChoiceSplitter<
      Name1,
      Values1,
      Result0,
      0,
      Result1,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name2,
      Values2,
      Result1,
      1,
      Result2,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name3,
      Values3,
      Result2,
      2,
      Result3,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name4,
      Values4,
      Result3,
      3,
      Result4,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name5,
      Values5,
      Result4,
      4,
      Result5,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name6,
      Values6,
      Result5,
      5,
      Result6,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name7,
      Values7,
      Result6,
      6,
      Result7,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name8,
      Values8,
      Result7,
      7,
      Result8,
      Entries,
      InitialContext
    >
  ]
): MatrixEntries<InitialContext & AssemblyEntriesToObject<Entries>, Result8>;
export function applyBranchingTransformationPipeline<
  InitialContext extends Record<string, string>,
  Result0,
  const Name1 extends string,
  const Values1 extends string,
  Result1,
  const Name2 extends string,
  const Values2 extends string,
  Result2,
  const Name3 extends string,
  const Values3 extends string,
  Result3,
  const Name4 extends string,
  const Values4 extends string,
  Result4,
  const Name5 extends string,
  const Values5 extends string,
  Result5,
  const Name6 extends string,
  const Values6 extends string,
  Result6,
  const Name7 extends string,
  const Values7 extends string,
  Result7,
  const Name8 extends string,
  const Values8 extends string,
  Result8,
  const Name9 extends string,
  const Values9 extends string,
  Result9,
  Entries extends [
    [Name1, Values1],
    [Name2, Values2],
    [Name3, Values3],
    [Name4, Values4],
    [Name5, Values5],
    [Name6, Values6],
    [Name7, Values7],
    [Name8, Values8],
    [Name9, Values9]
  ]
>(
  sourceArray: MatrixEntries<InitialContext, Result0>,
  ...pipelineOperations: [
    SinglePipelineChoiceSplitter<
      Name1,
      Values1,
      Result0,
      0,
      Result1,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name2,
      Values2,
      Result1,
      1,
      Result2,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name3,
      Values3,
      Result2,
      2,
      Result3,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name4,
      Values4,
      Result3,
      3,
      Result4,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name5,
      Values5,
      Result4,
      4,
      Result5,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name6,
      Values6,
      Result5,
      5,
      Result6,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name7,
      Values7,
      Result6,
      6,
      Result7,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name8,
      Values8,
      Result7,
      7,
      Result8,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name9,
      Values9,
      Result8,
      8,
      Result9,
      Entries,
      InitialContext
    >
  ]
): MatrixEntries<InitialContext & AssemblyEntriesToObject<Entries>, Result9>;
export function applyBranchingTransformationPipeline<
  InitialContext extends Record<string, string>,
  Result0,
  const Name1 extends string,
  const Values1 extends string,
  Result1,
  const Name2 extends string,
  const Values2 extends string,
  Result2,
  const Name3 extends string,
  const Values3 extends string,
  Result3,
  const Name4 extends string,
  const Values4 extends string,
  Result4,
  const Name5 extends string,
  const Values5 extends string,
  Result5,
  const Name6 extends string,
  const Values6 extends string,
  Result6,
  const Name7 extends string,
  const Values7 extends string,
  Result7,
  const Name8 extends string,
  const Values8 extends string,
  Result8,
  const Name9 extends string,
  const Values9 extends string,
  Result9,
  const Name10 extends string,
  const Values10 extends string,
  Result10,
  Entries extends [
    [Name1, Values1],
    [Name2, Values2],
    [Name3, Values3],
    [Name4, Values4],
    [Name5, Values5],
    [Name6, Values6],
    [Name7, Values7],
    [Name8, Values8],
    [Name9, Values9],
    [Name10, Values10]
  ]
>(
  sourceArray: MatrixEntries<InitialContext, Result0>,
  ...pipelineOperations: [
    SinglePipelineChoiceSplitter<
      Name1,
      Values1,
      Result0,
      0,
      Result1,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name2,
      Values2,
      Result1,
      1,
      Result2,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name3,
      Values3,
      Result2,
      2,
      Result3,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name4,
      Values4,
      Result3,
      3,
      Result4,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name5,
      Values5,
      Result4,
      4,
      Result5,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name6,
      Values6,
      Result5,
      5,
      Result6,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name7,
      Values7,
      Result6,
      6,
      Result7,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name8,
      Values8,
      Result7,
      7,
      Result8,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name9,
      Values9,
      Result8,
      8,
      Result9,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name10,
      Values10,
      Result9,
      9,
      Result10,
      Entries,
      InitialContext
    >
  ]
): MatrixEntries<InitialContext & AssemblyEntriesToObject<Entries>, Result10>;
export function applyBranchingTransformationPipeline<
  InitialContext extends Record<string, string>,
  Result0,
  const Name1 extends string,
  const Values1 extends string,
  Result1,
  const Name2 extends string,
  const Values2 extends string,
  Result2,
  const Name3 extends string,
  const Values3 extends string,
  Result3,
  const Name4 extends string,
  const Values4 extends string,
  Result4,
  const Name5 extends string,
  const Values5 extends string,
  Result5,
  const Name6 extends string,
  const Values6 extends string,
  Result6,
  const Name7 extends string,
  const Values7 extends string,
  Result7,
  const Name8 extends string,
  const Values8 extends string,
  Result8,
  const Name9 extends string,
  const Values9 extends string,
  Result9,
  const Name10 extends string,
  const Values10 extends string,
  Result10,
  const Name11 extends string,
  const Values11 extends string,
  Result11,
  Entries extends [
    [Name1, Values1],
    [Name2, Values2],
    [Name3, Values3],
    [Name4, Values4],
    [Name5, Values5],
    [Name6, Values6],
    [Name7, Values7],
    [Name8, Values8],
    [Name9, Values9],
    [Name10, Values10],
    [Name11, Values11]
  ]
>(
  sourceArray: MatrixEntries<InitialContext, Result0>,
  ...pipelineOperations: [
    SinglePipelineChoiceSplitter<
      Name1,
      Values1,
      Result0,
      0,
      Result1,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name2,
      Values2,
      Result1,
      1,
      Result2,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name3,
      Values3,
      Result2,
      2,
      Result3,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name4,
      Values4,
      Result3,
      3,
      Result4,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name5,
      Values5,
      Result4,
      4,
      Result5,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name6,
      Values6,
      Result5,
      5,
      Result6,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name7,
      Values7,
      Result6,
      6,
      Result7,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name8,
      Values8,
      Result7,
      7,
      Result8,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name9,
      Values9,
      Result8,
      8,
      Result9,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name10,
      Values10,
      Result9,
      9,
      Result10,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name11,
      Values11,
      Result10,
      10,
      Result11,
      Entries,
      InitialContext
    >
  ]
): MatrixEntries<InitialContext & AssemblyEntriesToObject<Entries>, Result11>;
export function applyBranchingTransformationPipeline<
  InitialContext extends Record<string, string>,
  Result0,
  const Name1 extends string,
  const Values1 extends string,
  Result1,
  const Name2 extends string,
  const Values2 extends string,
  Result2,
  const Name3 extends string,
  const Values3 extends string,
  Result3,
  const Name4 extends string,
  const Values4 extends string,
  Result4,
  const Name5 extends string,
  const Values5 extends string,
  Result5,
  const Name6 extends string,
  const Values6 extends string,
  Result6,
  const Name7 extends string,
  const Values7 extends string,
  Result7,
  const Name8 extends string,
  const Values8 extends string,
  Result8,
  const Name9 extends string,
  const Values9 extends string,
  Result9,
  const Name10 extends string,
  const Values10 extends string,
  Result10,
  const Name11 extends string,
  const Values11 extends string,
  Result11,
  const Name12 extends string,
  const Values12 extends string,
  Result12,
  Entries extends [
    [Name1, Values1],
    [Name2, Values2],
    [Name3, Values3],
    [Name4, Values4],
    [Name5, Values5],
    [Name6, Values6],
    [Name7, Values7],
    [Name8, Values8],
    [Name9, Values9],
    [Name10, Values10],
    [Name11, Values11],
    [Name12, Values12]
  ]
>(
  sourceArray: MatrixEntries<InitialContext, Result0>,
  ...pipelineOperations: [
    SinglePipelineChoiceSplitter<
      Name1,
      Values1,
      Result0,
      0,
      Result1,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name2,
      Values2,
      Result1,
      1,
      Result2,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name3,
      Values3,
      Result2,
      2,
      Result3,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name4,
      Values4,
      Result3,
      3,
      Result4,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name5,
      Values5,
      Result4,
      4,
      Result5,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name6,
      Values6,
      Result5,
      5,
      Result6,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name7,
      Values7,
      Result6,
      6,
      Result7,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name8,
      Values8,
      Result7,
      7,
      Result8,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name9,
      Values9,
      Result8,
      8,
      Result9,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name10,
      Values10,
      Result9,
      9,
      Result10,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name11,
      Values11,
      Result10,
      10,
      Result11,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name12,
      Values12,
      Result11,
      11,
      Result12,
      Entries,
      InitialContext
    >
  ]
): MatrixEntries<InitialContext & AssemblyEntriesToObject<Entries>, Result12>;
export function applyBranchingTransformationPipeline<
  InitialContext extends Record<string, string>,
  Result0,
  const Name1 extends string,
  const Values1 extends string,
  Result1,
  const Name2 extends string,
  const Values2 extends string,
  Result2,
  const Name3 extends string,
  const Values3 extends string,
  Result3,
  const Name4 extends string,
  const Values4 extends string,
  Result4,
  const Name5 extends string,
  const Values5 extends string,
  Result5,
  const Name6 extends string,
  const Values6 extends string,
  Result6,
  const Name7 extends string,
  const Values7 extends string,
  Result7,
  const Name8 extends string,
  const Values8 extends string,
  Result8,
  const Name9 extends string,
  const Values9 extends string,
  Result9,
  const Name10 extends string,
  const Values10 extends string,
  Result10,
  const Name11 extends string,
  const Values11 extends string,
  Result11,
  const Name12 extends string,
  const Values12 extends string,
  Result12,
  const Name13 extends string,
  const Values13 extends string,
  Result13,
  Entries extends [
    [Name1, Values1],
    [Name2, Values2],
    [Name3, Values3],
    [Name4, Values4],
    [Name5, Values5],
    [Name6, Values6],
    [Name7, Values7],
    [Name8, Values8],
    [Name9, Values9],
    [Name10, Values10],
    [Name11, Values11],
    [Name12, Values12],
    [Name13, Values13]
  ]
>(
  sourceArray: MatrixEntries<InitialContext, Result0>,
  ...pipelineOperations: [
    SinglePipelineChoiceSplitter<
      Name1,
      Values1,
      Result0,
      0,
      Result1,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name2,
      Values2,
      Result1,
      1,
      Result2,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name3,
      Values3,
      Result2,
      2,
      Result3,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name4,
      Values4,
      Result3,
      3,
      Result4,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name5,
      Values5,
      Result4,
      4,
      Result5,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name6,
      Values6,
      Result5,
      5,
      Result6,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name7,
      Values7,
      Result6,
      6,
      Result7,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name8,
      Values8,
      Result7,
      7,
      Result8,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name9,
      Values9,
      Result8,
      8,
      Result9,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name10,
      Values10,
      Result9,
      9,
      Result10,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name11,
      Values11,
      Result10,
      10,
      Result11,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name12,
      Values12,
      Result11,
      11,
      Result12,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name13,
      Values13,
      Result12,
      12,
      Result13,
      Entries,
      InitialContext
    >
  ]
): MatrixEntries<InitialContext & AssemblyEntriesToObject<Entries>, Result13>;
export function applyBranchingTransformationPipeline<
  InitialContext extends Record<string, string>,
  Result0,
  const Name1 extends string,
  const Values1 extends string,
  Result1,
  const Name2 extends string,
  const Values2 extends string,
  Result2,
  const Name3 extends string,
  const Values3 extends string,
  Result3,
  const Name4 extends string,
  const Values4 extends string,
  Result4,
  const Name5 extends string,
  const Values5 extends string,
  Result5,
  const Name6 extends string,
  const Values6 extends string,
  Result6,
  const Name7 extends string,
  const Values7 extends string,
  Result7,
  const Name8 extends string,
  const Values8 extends string,
  Result8,
  const Name9 extends string,
  const Values9 extends string,
  Result9,
  const Name10 extends string,
  const Values10 extends string,
  Result10,
  const Name11 extends string,
  const Values11 extends string,
  Result11,
  const Name12 extends string,
  const Values12 extends string,
  Result12,
  const Name13 extends string,
  const Values13 extends string,
  Result13,
  const Name14 extends string,
  const Values14 extends string,
  Result14,
  Entries extends [
    [Name1, Values1],
    [Name2, Values2],
    [Name3, Values3],
    [Name4, Values4],
    [Name5, Values5],
    [Name6, Values6],
    [Name7, Values7],
    [Name8, Values8],
    [Name9, Values9],
    [Name10, Values10],
    [Name11, Values11],
    [Name12, Values12],
    [Name13, Values13],
    [Name14, Values14]
  ]
>(
  sourceArray: MatrixEntries<InitialContext, Result0>,
  ...pipelineOperations: [
    SinglePipelineChoiceSplitter<
      Name1,
      Values1,
      Result0,
      0,
      Result1,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name2,
      Values2,
      Result1,
      1,
      Result2,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name3,
      Values3,
      Result2,
      2,
      Result3,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name4,
      Values4,
      Result3,
      3,
      Result4,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name5,
      Values5,
      Result4,
      4,
      Result5,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name6,
      Values6,
      Result5,
      5,
      Result6,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name7,
      Values7,
      Result6,
      6,
      Result7,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name8,
      Values8,
      Result7,
      7,
      Result8,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name9,
      Values9,
      Result8,
      8,
      Result9,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name10,
      Values10,
      Result9,
      9,
      Result10,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name11,
      Values11,
      Result10,
      10,
      Result11,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name12,
      Values12,
      Result11,
      11,
      Result12,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name13,
      Values13,
      Result12,
      12,
      Result13,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name14,
      Values14,
      Result13,
      13,
      Result14,
      Entries,
      InitialContext
    >
  ]
): MatrixEntries<InitialContext & AssemblyEntriesToObject<Entries>, Result14>;
export function applyBranchingTransformationPipeline<
  InitialContext extends Record<string, string>,
  Result0,
  const Name1 extends string,
  const Values1 extends string,
  Result1,
  const Name2 extends string,
  const Values2 extends string,
  Result2,
  const Name3 extends string,
  const Values3 extends string,
  Result3,
  const Name4 extends string,
  const Values4 extends string,
  Result4,
  const Name5 extends string,
  const Values5 extends string,
  Result5,
  const Name6 extends string,
  const Values6 extends string,
  Result6,
  const Name7 extends string,
  const Values7 extends string,
  Result7,
  const Name8 extends string,
  const Values8 extends string,
  Result8,
  const Name9 extends string,
  const Values9 extends string,
  Result9,
  const Name10 extends string,
  const Values10 extends string,
  Result10,
  const Name11 extends string,
  const Values11 extends string,
  Result11,
  const Name12 extends string,
  const Values12 extends string,
  Result12,
  const Name13 extends string,
  const Values13 extends string,
  Result13,
  const Name14 extends string,
  const Values14 extends string,
  Result14,
  const Name15 extends string,
  const Values15 extends string,
  Result15,
  Entries extends [
    [Name1, Values1],
    [Name2, Values2],
    [Name3, Values3],
    [Name4, Values4],
    [Name5, Values5],
    [Name6, Values6],
    [Name7, Values7],
    [Name8, Values8],
    [Name9, Values9],
    [Name10, Values10],
    [Name11, Values11],
    [Name12, Values12],
    [Name13, Values13],
    [Name14, Values14],
    [Name15, Values15]
  ]
>(
  sourceArray: MatrixEntries<InitialContext, Result0>,
  ...pipelineOperations: [
    SinglePipelineChoiceSplitter<
      Name1,
      Values1,
      Result0,
      0,
      Result1,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name2,
      Values2,
      Result1,
      1,
      Result2,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name3,
      Values3,
      Result2,
      2,
      Result3,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name4,
      Values4,
      Result3,
      3,
      Result4,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name5,
      Values5,
      Result4,
      4,
      Result5,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name6,
      Values6,
      Result5,
      5,
      Result6,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name7,
      Values7,
      Result6,
      6,
      Result7,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name8,
      Values8,
      Result7,
      7,
      Result8,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name9,
      Values9,
      Result8,
      8,
      Result9,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name10,
      Values10,
      Result9,
      9,
      Result10,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name11,
      Values11,
      Result10,
      10,
      Result11,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name12,
      Values12,
      Result11,
      11,
      Result12,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name13,
      Values13,
      Result12,
      12,
      Result13,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name14,
      Values14,
      Result13,
      13,
      Result14,
      Entries,
      InitialContext
    >,
    SinglePipelineChoiceSplitter<
      Name15,
      Values15,
      Result14,
      14,
      Result15,
      Entries,
      InitialContext
    >
  ]
): MatrixEntries<InitialContext & AssemblyEntriesToObject<Entries>, Result15>;
export function applyBranchingTransformationPipeline(
  sourceArray: MatrixEntries<Record<string, string>, any>,
  ...pipelineOperations: SinglePipelineChoiceSplitter<
    string,
    string,
    any,
    any,
    any,
    [[string, string]],
    {}
  >[]
): any {
  let matrix = sourceArray;

  for (const { transform, optionName, options } of pipelineOperations) {
    matrix = matrix.flatMap(({ ctx, result: previousResult }) =>
      options.map((option) => ({
        ctx: { ...ctx, [optionName]: option },
        result: transform(previousResult, ctx, option),
      }))
    );
  }

  return matrix;
}
