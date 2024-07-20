export function countKeys(t: any): any {
  switch (t?.constructor) {
    case Object:
      return Object
        .values(t)
        .reduce((r: any, v: any) => r + 1 + countKeys(v), 0)
    case Array:
      return t
        .reduce((r: any, v: any) => r + countKeys(v), 0)
    default:
      return 0
  }
}

export function sum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

export function roundToDecimalPlace(number: number, decimal: number): number {
  return Number(number.toFixed(decimal));
}

export function deepCopy<T>(value: any): any {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function convertMapToArray<T>(map: Map<any, any>): T[] {
  const returnArray: Array<T> = [];
  map.forEach((item) => returnArray.push(item));
  return returnArray;
}

export function convertArrayToMap<T>(array: any[], prop: string): Map<any, any> {
  return new Map<any, T>(array.map((item: any) => ([item[prop], item])));
}
