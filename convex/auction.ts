import { query, mutation } from "@convex/server";
import { v } from "convex/values";
import { ar } from "date-fns/locale";
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("auctions").collect();
  },
});
export const create = mutation({
  args: {
    item: v.object({
      title: v.string(),
      lore: v.string(),
      image: v.string(),
      currentBid: v.number(),
      buyNowPrice: v.optional(v.number()),
      length: v.number(),
      bidcount: v.number(),
      seller: v.id("users"),
      bids: v.record(
        v.string(),
        v.object({ id: v.id("users"), bid: v.number() }),
      ),
    }),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("auctions", args.item);
  },
});
