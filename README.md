# rsc-superjson
Superjson wrapper for React Server Components (RSC) in Next.js 13+. 
Inspired by [next-superjson-plugin](https://github.com/blitz-js/next-superjson-plugin). This package
enables seamless serialization of custom types between server components and client components in React.

> **Note:** You don't need this package if all the types you need are supported by React. 
> [See all supported types here](https://react.dev/reference/rsc/use-server#serializable-parameters-and-return-values)!

## Why use this package?
- ✅ **Seamless integration**
- ✅ **No SWC plugin required**
- ✅ **Support for Custom Types**
- ✅ **Support for Server Actions**
- ✅ **Lightweight dependency**
- ✅ **~3.5% faster builds compared to using [next-superjson-plugin](https://github.com/blitz-js/next-superjson-plugin)**

## Basic Usage
To pass superjson serialized props from React server components to client components, simply wrap
the client component with `withSuperjson()`. Note that any custom types which are not [supported out
of the box by superjson](https://github.com/flightcontrolhq/superjson?tab=readme-ov-file#examples-3) need to be registered on both the client and server side (see [installation](#installation)).

### Passing superjson serialized props from server to client
```typescript
// app/page.tsx
// [...]
import { withSuperjson } from "rsc-superjson";

const ClientComponentSuperjson = withSuperjson(ClientComponent)

export default function Server() {
  const decimal = new Decimal(1.23);
  return (
    <>
      <ClientComponentSuperjson decimal={decimal} />
  </>
);
}
```

### Calling superjson serialized server actions from client
```typescript
// app/action.ts
"use server"

import Decimal from "decimal.js";
import { SuperjsonAction } from "rsc-superjson";

// register custom types, since decimal is not supported out of the box
registerCustomSuperjsonTypes();

export const randomDecimalAction  = SuperjsonAction(async () => {
  return new Decimal(Math.random()*100);
})
```
You will likely want to use a wrapper around SuperjsonAction to ensure custom types a registered 
when calling the action. See [installation](#installation) for an example.



## Installation
1. `npm i rsc-superjson`
2. (optional) To register custom types, create the following snippets:

```typescript
// lib/superjson/register-types.ts

import SuperJSON from "superjson";
import Decimal from "decimal.js";

export function registerCustomSuperjsonTypes() {
  SuperJSON.registerCustom<Decimal, string>(
    {
      isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
      serialize: (v) => v.toJSON(),
      deserialize: (v) => new Decimal(v),
    },
    "Decimal",
  );
}
```


```typescript
// lib/superjson/register-types-server.ts
import { registerCustomSuperjsonTypes } from "@/lib/superjson/register-types";
registerCustomSuperjsonTypes()

export default function RegisterSuperjsonCustomTypesServerside(
) {
  return null;
}
```


```typescript
// lib/superjson/register-types-client.ts
"use client"

import { registerCustomSuperjsonTypes } from "@/lib/superjson/register-types";
registerCustomSuperjsonTypes()

export default function RegisterSuperjsonCustomTypesClientside(
) {
  return null;
}
```

3. (optional) If you also want to use superjson to serialize responses of server actions, you can use the following snippet:
```typescript
// lib/superjson/custom-superjson-action.ts
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
```
