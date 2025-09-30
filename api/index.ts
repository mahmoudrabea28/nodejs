// api/index.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Express app هو نفسه الهاندلر
  // @ts-ignore
  return app(req, res);
}
