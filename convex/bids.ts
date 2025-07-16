import { v } from "convex/values";
import { query } from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

export const getbid = query({
  args: { id: v.id("auctions") },
  handler: async (ctx, args) => {
    const { user } = (await ctx.runQuery(internal.users.signUser)) as {
      user: Doc<"users"> | null;
    };
    if (!user) {
      return null;
    }
    const auction = await ctx.db.get(args.id);
    if (!auction) {
      return null;
    }
    let tbid = await ctx.db
      .query("bids")
      .withIndex("by_userId", (q) => {
        return q.eq("userId", user._id);
      })
      .filter((q) => {
        return q.eq(q.field("auctionId"), auction._id);
      })
      .first();
    return tbid;
  },
});
