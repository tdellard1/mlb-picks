export class AssertUtils {
    public static assertLength(array: any[], expectedLength: number) {
        if (array.length !== expectedLength) {
            throw new Error(`Assert length of array: ${array.length}, expected: ${expectedLength}`);
        }
    }
}

export function assertValue(value: any) {
    if (value === null) {
        throw new Error('Asserted value was null.');
    } else if (value === undefined) {
        throw new Error('Asserted value was undefined.');
    }
}