import { withSuperjson } from "rsc-superjson";
import { ClientComponent } from "@/app/client";
import Decimal from "decimal.js";

const ClientComponentSuperjson = withSuperjson(ClientComponent)

export default function Server() {
  const decimal = new Decimal(1.23);
  return (
    <>
      <ClientComponentSuperjson decimal={decimal} />
    </>
  );
}
