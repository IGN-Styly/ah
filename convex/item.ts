import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { betterAuthComponent } from "./auth";
import { Doc, Id } from "./_generated/dataModel";
import { get } from "./auction";
import { api, internal } from "./_generated/api";
import { ar, tr } from "date-fns/locale";
import AppConfig from "@/lib/config";
export const getItems = query({
  args: {
    category: v.optional(v.string()),
    search: v.optional(v.string()), // Add search argument
  },
  handler: async (ctx, args) => {
    let items = [];
    const { user } = (await ctx.runQuery(internal.users.signUser)) as {
      user: Doc<"users"> | null;
    };
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
export const sellItem = mutation({
  args: {
    id: v.id("items"),
    end: v.number(),
    bid: v.optional(v.number()),
    bin: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { user } = (await ctx.runQuery(internal.users.signUser)) as {
      user: Doc<"users"> | null;
    };
    let item = await ctx.db.get(args.id);
    if (!(user?.inventory.includes(args.id) && item)) {
      return { ok: false, message: "Insufficient balance to cover the tax." };
    }

    const highestValue = Math.max(args.bin || 0, args.bid || 0);
    const taxAmount = AppConfig.TAX * highestValue;

    if (user.balance < taxAmount) {
      return { ok: false, message: "Insufficient balance to cover the tax." };
    }
    ctx.db.patch(user._id, { balance: user.balance - taxAmount });
    ctx.db.delete(args.id);
    ctx.db.insert("auctions", {
      bidcount: 0,
      bids: {},
      category: item.category,
      image: item.image,
      lore: item.lore,
      seller: user._id,
      title: item.title,
      buyNowPrice: args.bin,
      currentBid: args.bid,
      end: args.end,
    });
    return { ok: true, message: "Auction Created!" };
  },
  returns: { ok: v.boolean(), message: v.string() },
});
