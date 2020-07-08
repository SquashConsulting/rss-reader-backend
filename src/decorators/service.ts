/**
 * ENV-Configurable Service Decorator
 *
 * @packageDocumentation
 * @category Utility
 */

type DecoratedService<T extends { [key: string]: (...args: any[]) => any }> = {
  [key in keyof T]: (...args: Parameters<T[key]>) => ReturnType<T[key]>;
};

/**
 * Given a `ServiceModule`, this function turns all the
 * service actions into configurable methods.
 */
export default function decorateService<
  T extends { [key: string]: (...args: any[]) => any }
>(ENV: string, Service: T): DecoratedService<T> {
  const condition = ENV === "true";

  let tempObj: { [key: string]: any } = {};

  for (const key in Service) {
    tempObj[key] = decorateMethod(Service[key], condition);
  }

  return tempObj as DecoratedService<T>;
}

/**
 * Given a `ServiceAction`, this function returns a
 * modified version of the action that conditionally warns about disabled actions.
 */
function decorateMethod<T extends (...args: any[]) => any>(
  method: T,
  condition: boolean,
): (...funcArgs: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    if (condition) {
      return method(...args);
    } else {
      console.warn("Trying to a call a disabled service action:", method.name);
    }
  };
}
