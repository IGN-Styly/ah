import {
  query,
  mutation,
  internalMutation,
  action,
  internalQuery,
} from "@convex/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { get } from "./auction";

import { betterAuthComponent } from "./auth";

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

export const signUser = internalQuery({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }
    const userId = await betterAuthComponent.getAuthUserId(ctx);
    if (!userId) {
      return { user: null };
    }

    const user = await ctx.db.get(userId as Id<"users">);

    return { user };
  },
});
