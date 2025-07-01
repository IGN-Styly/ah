import { requireEnv } from "./util";

export default {
  providers: [
    {
      // Your Convex site URL is provided in a system
      // environment variable
      domain: requireEnv("CONVEX_SITE"),

      // Application ID has to be "convex"
      applicationID: "convex",
    },
  ],
};
