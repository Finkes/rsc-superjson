import SuperJSONComponent from "./superjson-component";
import { serialize } from "./superjson-deserialize";
import { ComponentType, ReactNode } from "react";

/**
 * Wraps a component with SuperJSON serialization.
 * Note that next.js [parallel route slots](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#slots) are not supported and must be excluded via `excludedSuperjsonProps`.
 * The implicit `children` slot is excluded by default.
 * @param Component
 */
export function withSuperjson<
  T extends Record<string, any> & {
    excludedSuperjsonProps?: string[];
    children?: ReactNode;
  },
>(Component: ComponentType<T>) {
  return function WrappedComponent(
    props: T & { children?: ReactNode; excludedSuperjsonProps?: string[] },
  ) {
    const propsWithoutExcludedProps = { ...props };
    delete (propsWithoutExcludedProps as any).children;
    for (const prop of props.excludedSuperjsonProps ?? []) {
      delete propsWithoutExcludedProps[prop];
    }
    const serializedProps = serialize(propsWithoutExcludedProps);
    let mergedProps = {
      ...serializedProps,
      ...props.excludedSuperjsonProps?.reduce((acc, excludedProp) => {
        acc[excludedProp] = props[excludedProp];
        return acc;
      }, {} as any),
    };
    return (
      <SuperJSONComponent
        component={Component as ComponentType<any>}
        props={mergedProps}
      >
        {(props as any).children}
      </SuperJSONComponent>
    );
  };
}
