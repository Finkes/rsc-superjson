"use client";

import { SuperJSONProps, withSuperJsonDeserializedProps } from "./superjson-deserialize";
import * as React from "react";
import { JSX } from "react";

export default function SuperJSONComponent<P extends JSX.IntrinsicAttributes>({
  component,
  props,
  children,
}: {
  component: React.ComponentType<P>;
  props: SuperJSONProps<P>;
  children?: React.ReactNode;
}) {
  const WithSuperJsonDeserializedProps = withSuperJsonDeserializedProps(component);
  return <WithSuperJsonDeserializedProps {...props}>{children}</WithSuperJsonDeserializedProps>;
}
