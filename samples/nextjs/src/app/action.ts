"use server"

import Decimal from "decimal.js";
import { CustomSuperjsonAction } from "@/lib/superjson/custom-superjson-action";

export const randomDecimalAction  = CustomSuperjsonAction(async () => {
  return new Decimal(Math.random()*100);
})

