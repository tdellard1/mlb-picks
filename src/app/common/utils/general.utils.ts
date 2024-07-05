export function countKeys(t: any): any {
  switch (t?.constructor) {
    case Object:
      1
      return Object
        .values(t)
        .reduce((r: any, v: any) => r + 1 + countKeys(v), 0)
    case Array:
      2
      return t
        .reduce((r: any, v: any) => r + countKeys(v), 0)
    default:
      3
      return 0
  }
}

export function sum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

export function roundToDecimalPlace(number: number, decimal: number): number {
  return Number(number.toFixed(decimal));
}

export function deepCopy(value: any): any {
  return JSON.parse(JSON.stringify(value))
}
