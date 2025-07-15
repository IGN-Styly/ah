import { v } from "convex/values";
import { query } from "./_generated/server";
import { betterAuthComponent } from "./auth";
import { Id } from "./_generated/dataModel";
import { get } from "./auction";

export const getItems = query({
  args: {
    category: v.optional(v.string()),
    search: v.optional(v.string()), // Add search argument
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }
    const userId = await betterAuthComponent.getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    let items = [];
    const user = await ctx.db.get(userId as Id<"users">);
    if (!user?.inventory) {
      return null;
    }
    for (var id of user.inventory) {
      const item = await ctx.db.get(id as Id<"items">);
      if (
        args.category &&
        (item?.category == args.category || args.category == "all")
      )
        items.push(item);
    }
    return items;
  },
});
