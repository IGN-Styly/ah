import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  items: defineTable({
    title: v.string(),
    lore: v.string(),
    image: v.string(),
  }),

  users: defineTable({
    name: v.string(),
    balance: v.number(),
    inventory: v.array(v.id("items")),
    auctions: v.array(v.id("autions")),
  }),
  auctions: defineTable({
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
});
