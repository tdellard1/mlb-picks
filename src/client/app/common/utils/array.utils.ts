export function ensure<T>(argument: T | undefined | null, message: string = 'This value was promised to be there but is not.'): T {
  if (argument === undefined || argument === null) {
    throw new TypeError(message + argument);
  }

  return argument;
}
