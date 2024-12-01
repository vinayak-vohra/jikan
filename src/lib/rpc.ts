import { hc } from "hono/client";

import { AppType } from "@/app/api/[[...route]]/route";

export const { api } = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);
