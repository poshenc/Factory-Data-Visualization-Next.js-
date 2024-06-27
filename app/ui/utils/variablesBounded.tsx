export type variableValidation = 'notInInterval'

export function intervalValidation(validateFunction: variableValidation): (value1: number, value2: number, value3: string, value4: boolean) => boolean {
  switch (validateFunction) {
    case 'notInInterval':
      return isNotBetweenBounded
    default:
      return () => true
  }
}

export function isNotBetweenBounded(upperBound: number, lowerBound: number, variable: string, nullable: boolean): boolean {
  const hasNull = variable.split(',').some((variable: string) => variable === 'null')
  let variableArray: number[] = [];
  variable.split(',').forEach(variable => variable === 'null' ? undefined : variableArray.push(parseFloat(variable)))
  const exceededUperLimit = variableArray.some((variable: number) => variable > upperBound)
  const belowLowerLimit = variableArray.some((variable: number) => variable < lowerBound)
  let InvalidNull: boolean
  InvalidNull = nullable ? false : hasNull
  return exceededUperLimit || belowLowerLimit || InvalidNull
}