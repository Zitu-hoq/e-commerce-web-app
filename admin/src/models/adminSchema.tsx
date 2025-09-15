"use client";

import { z } from "zod";

export const Admin = z.object({
  name: z.string(),
  password: z.string(),
});
