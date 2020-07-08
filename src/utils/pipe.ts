/**
 * Pipe Function
 *
 * ### Examples:
 * ```typescript
 * const result = pipe<number>(
 *   1,
 *   (num: number): number => num + 1,
 *   (num: number): number => num * num,
 *   (num: number): number => num - num,
 * );
 *
 * console.log(result); // 2
 * ```
 *
 * @packageDocumentation
 * @category Utility
 */
type handler<T> = (value: T) => T;

/**
 * Pipes given `initialValue` to the given list of functions.
 */
export default function pipe<T>(initialValue: T, ...fns: handler<T>[]): T {
  return fns.reduce(
    (prev: T, nextFn: handler<T>): T => nextFn(prev),
    initialValue,
  );
}
