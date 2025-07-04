import { query, mutation } from "@convex/server";
import { v } from "convex/values";

// Sort types
export const SortOptions = {
  ENDING_SOON: "soon",
  PRICE_LOW: "lowhigh",
  PRICE_HIGH: "highlow",
  NEWEST: "new",
  MOST_BIDS: "bids",
} as const;

export const get = query({
  args: {
    includeEnded: v.optional(v.boolean()),
    category: v.optional(v.string()),
    sort: v.optional(v.string()),
    listingType: v.optional(v.string()), // NEW
    search: v.optional(v.string()), // Add search argument
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("auctions");

    // Filter by category if provided and not "all"
    if (args.category && args.category !== "all") {
      q = q.filter((row) => row.eq(row.field("category"), args.category));
    }

    // Filter by listing type
    if (args.listingType === "bin") {
      q = q.filter((row) =>
        row.and(
          row.neq(row.field("buyNowPrice"), undefined),
          row.neq(row.field("buyNowPrice"), null),
        ),
      );
    } else if (args.listingType === "bid") {
      q = q.filter((row) =>
        row.or(
          row.eq(row.field("buyNowPrice"), undefined),
          row.eq(row.field("buyNowPrice"), null),
        ),
      );
    }

    // Filter out ended auctions if includeEnded is false
    const now = Date.now();
    if (args.includeEnded === false) {
      q = q.filter((row) => row.gt(row.field("end"), now));
    }

    let auctions = await q.collect();

    // Search filter (case-insensitive, comma-separated phrase match first, then AND word search)
    if (args.search && args.search.trim() !== "") {
      const searchTerm = args.search.trim().toLowerCase();
      // Split by comma for phrase search, trim each phrase
      const phrases = searchTerm
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
      let filtered: typeof auctions = [];
      if (phrases.length > 1) {
        // All phrases must be present as substrings in title or lore
        filtered = auctions.filter((a) => {
          const title = a.title.toLowerCase();
          const lore = a.lore.toLowerCase();
          return phrases.every(
            (phrase) => title.includes(phrase) || lore.includes(phrase),
          );
        });
      } else {
        // Single phrase: behave as before
        filtered = auctions.filter(
          (a) =>
            a.title.toLowerCase().includes(searchTerm) ||
            a.lore.toLowerCase().includes(searchTerm),
        );
      }
      // Fallback: if no results, do AND word search for all words in all phrases
      if (filtered.length === 0) {
        const words =
          phrases.length > 1
            ? phrases.flatMap((p) => p.split(/\s+/))
            : searchTerm.split(/\s+/);
        filtered = auctions.filter((a) => {
          const title = a.title.toLowerCase();
          const lore = a.lore.toLowerCase();
          return words.every(
            (word) => title.includes(word) || lore.includes(word),
          );
        });
      }
      auctions = filtered;
    }

    // Sorting
    switch (args.sort) {
      case SortOptions.PRICE_LOW:
        auctions.sort((a, b) => {
          const aBid =
            typeof a.currentBid === "number" && !isNaN(a.currentBid)
              ? a.currentBid
              : typeof a.buyNowPrice === "number" && !isNaN(a.buyNowPrice)
                ? a.buyNowPrice
                : Infinity;
          const bBid =
            typeof b.currentBid === "number" && !isNaN(b.currentBid)
              ? b.currentBid
              : typeof b.buyNowPrice === "number" && !isNaN(b.buyNowPrice)
                ? b.buyNowPrice
                : Infinity;
          return aBid - bBid;
        });
        break;
      case SortOptions.PRICE_HIGH:
        auctions.sort((a, b) => {
          const aBid =
            typeof a.currentBid === "number" && !isNaN(a.currentBid)
              ? a.currentBid
              : typeof a.buyNowPrice === "number" && !isNaN(a.buyNowPrice)
                ? a.buyNowPrice
                : -Infinity;
          const bBid =
            typeof b.currentBid === "number" && !isNaN(b.currentBid)
              ? b.currentBid
              : typeof b.buyNowPrice === "number" && !isNaN(b.buyNowPrice)
                ? b.buyNowPrice
                : -Infinity;
          return bBid - aBid;
        });
        break;
      case SortOptions.NEWEST:
        auctions.sort((a, b) => b.created - a.created);
        break;
      case SortOptions.MOST_BIDS:
        auctions.sort((a, b) => b.bidcount - a.bidcount);
        break;
      case SortOptions.ENDING_SOON:
      default:
        auctions.sort((a, b) => a.end - b.end);
        break;
    }

    return auctions;
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
      end: v.number(),
      bidcount: v.number(),
      seller: v.id("users"),
      category: v.string(),
      bids: v.record(
        v.string(),
        v.object({ id: v.id("users"), bid: v.number() }),
      ),
      created: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("auctions", args.item);
  },
});
