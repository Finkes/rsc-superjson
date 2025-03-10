
import { SuperjsonAction } from "rsc-superjson";
import { registerCustomSuperjsonTypes } from "@/lib/superjson/register-types";

// register custom superjson types for server actions
registerCustomSuperjsonTypes()

// using a wrapper ensures that custom types are registered when calling the server action.
// In addition, the wrapper can be used to add additional functionality, such as logging or error handling.
export function CustomSuperjsonAction<
  ServerAction extends (...args: any) => Promise<any>,
>(action: ServerAction) {
  // optional: add additional wrappers like sentry
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#step-4-instrument-nextjs-server-actions-optional

  // wrapped function has the same signature as the original action
  return SuperjsonAction(action);
}