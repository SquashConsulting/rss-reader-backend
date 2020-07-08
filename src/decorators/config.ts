/**
 * ENV-Configurable Service Decorator
 *
 * @packageDocumentation
 * @category Utility
 */

/**
 * Given a `ServiceModule`, this function turns all the
 * service actions into environemnt-configurable methods.
 */
export default function decorateServiceModule(ENV: string, Service: ServiceModule): ServiceModule {
  const condition = ENV === "true";

  for (const key in Service) {
    Service[key] = function ConfiguredServiceAction() {
      if (condition) {
        return Service[key].apply(this, arguments);
      } else {
        console.warn("Trying to call a disabled Service action:", Service.name, "::", key);
      }
    };
  }

  return Service;
}
