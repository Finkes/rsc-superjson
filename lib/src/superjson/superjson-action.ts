import SuperJSON from "superjson";

export function SuperjsonAction<
  ServerAction extends (...args: any) => Promise<any>,
>(action: ServerAction) {
  // should have the same signature as the original action
  type Args = Parameters<typeof action>;
  return async (...args: Args): Promise<ReturnType<ServerAction>> => {
    return serializeWithSuperJSON(() => action(...args))
  };
}

export function callSuperjsonAction<ServerAction extends () => Promise<any>>(
  superAction: ServerAction,
) {
  return deserializeWithSuperJSON(superAction);
}

function deserializeWithSuperJSON<
  ServerAction extends () => Promise<any>,
>(serverAction: ServerAction) {
  return serverAction().then(SuperJSON.deserialize) as any as Promise<
    ReturnType<ServerAction>
  >;
}

function serializeWithSuperJSON<ServerAction extends () => Promise<any>>(
  serverAction: ServerAction,
): ReturnType<ServerAction> {
  return serverAction().then(
    SuperJSON.serialize,
  ) as any as ReturnType<ServerAction>;
}