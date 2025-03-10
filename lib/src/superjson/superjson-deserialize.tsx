import hoistNonReactStatics from "hoist-non-react-statics";
import React, { JSX } from "react";
import SuperJSON from "superjson";

export type SuperJSONProps<P> = P & {
  _superjson?: ReturnType<typeof SuperJSON.serialize>["meta"];
};

export function deserializeProps<P>(serializedProps: SuperJSONProps<P>): P {
  const { _superjson, ...props } = serializedProps;
  return SuperJSON.deserialize({ json: props as any, meta: _superjson });
}

export function withSuperJsonDeserializedProps<P extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<P>,
): React.ComponentType<SuperJSONProps<P>> {
  function _withSuperJsonDeserialized(serializedProps: SuperJSONProps<P>) {
    try {
      const deserializedProps = deserializeProps(serializedProps);
      return <Component {...deserializedProps} />;
    } catch (e) {
      throw new Error(
        `SuperJson deserialization failed for ${Component.name}. Details: ${e instanceof Error ? e.message : e}`,
      );
    }
  }
  hoistNonReactStatics(_withSuperJsonDeserialized, Component);
  return _withSuperJsonDeserialized;
}

export function serialize<P>(props: P): SuperJSONProps<P> {
  const { json, meta: _superjson } = SuperJSON.serialize(props);
  return {
    ...(json as any),
    _superjson,
  };
}
