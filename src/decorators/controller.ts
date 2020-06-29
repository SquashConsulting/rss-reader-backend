/**
 * Controller Decorator
 *
 * @packageDocumentation
 * @category Utility
 */

/**
 * Given a `ControllerModule`, this function turns all the
 * controller actions into decorated methods.
 */
export default function decorateControllerModule(
  controller: ControllerModule,
): ControllerModule {
  for (const key in controller) {
    controller[key] = withErrorHandler(controller[key]);
  }

  return controller;
}

/**
 * Given a `ControllerAction`, this function returns a
 * modified version of the action that uses the default Error Handler.
 */
function withErrorHandler(fn: ControllerAction): ControllerAction {
  return function () {
    const next = arguments[2];

    try {
      const value = fn.apply(this, arguments);

      if (value instanceof Promise) {
        return value.then((data) => data).catch((error) => next(error));
      }

      return value;
    } catch (error) {
      next(error);
    }
  };
}
