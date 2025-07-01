import { query, mutation, internalMutation, action } from "@convex/server";
import { v } from "convex/values";
import { ar } from "date-fns/locale";
import { internal } from "./_generated/api";
import { nan } from "zod";

export const getUsername = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_id", (q) => {
        return q.eq("_id", args.id);
      })
      .first();
  },
});
export const createUser = internalMutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      name: args.name,
      balance: 0,
      inventory: [],
      auctions: [],
    });
  },
});

export const createUserAction = action({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // ... your logic here ...
    await ctx.runMutation(internal.users.createUser, { name: args.name });
  },
});
