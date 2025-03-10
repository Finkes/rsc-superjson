"use client"

import Decimal from "decimal.js";
import { callSuperjsonAction } from "rsc-superjson";
import { randomDecimalAction } from "@/app/action";
import { useState } from "react";


export function ClientComponent({
  decimal
}:{
  decimal: Decimal
}) {
  const [decimalValue, setDecimalValue] = useState<Decimal>(decimal);
  return (
    <div className={"w-[500px] mx-auto mt-10"}>
      <h1>Client Component</h1>
      <p>This is a client component.</p>
      <p>Decimal value: {decimalValue.toString()}</p>
      <button className={"ring-1 rounded-sm p-1 mt-2"} onClick={async () => {
        const response = await callSuperjsonAction(() => randomDecimalAction())
        setDecimalValue(response);
      }}>fetch random decimal</button>
    </div>
  );
}