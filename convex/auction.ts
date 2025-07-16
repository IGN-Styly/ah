import { query, mutation } from "@convex/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { useMutation } from "convex/react";

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
    own: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    let auctions: Doc<"auctions">[] = [];

    if (args.own) {
      // Fetch auctions where the user is the seller
      const sellingAuctions = await ctx.db
        .query("auctions")
        .withIndex("by_seller", (q) => q.eq("seller", args.own as Id<"users">))
        .collect();

      // Fetch auctions where the user has placed a bid
      const userBids = await ctx.db
        .query("bids")
        .withIndex("by_userId", (q) => q.eq("userId", args.own as Id<"users">))
        .collect();

      const bidAuctionIds = userBids.map((bid) => bid.auctionId);

      // Fetch auctions for these bidAuctionIds
      let bidAuctions: Doc<"auctions">[] = [];
      if (bidAuctionIds.length > 0) {
        bidAuctions = await Promise.all(
          bidAuctionIds.map((id) => ctx.db.get(id)),
        ).then((results) => results.filter(Boolean) as Doc<"auctions">[]);
      }

      // Combine and deduplicate auctions
      const auctionMap = new Map<string, Doc<"auctions">>();
      for (const auction of sellingAuctions) {
        auctionMap.set(auction._id, auction);
      }
      for (const auction of bidAuctions) {
        auctionMap.set(auction._id, auction);
      }
      auctions = Array.from(auctionMap.values());

      // Now apply all filters and sorting in TypeScript for the 'own' case

      // Filter by category if provided and not "all"
      if (args.category && args.category !== "all") {
        auctions = auctions.filter((a) => a.category === args.category);
      }

      // Filter by listing type
      if (args.listingType === "bin") {
        auctions = auctions.filter(
          (a) =>
            typeof a.buyNowPrice === "number" &&
            a.buyNowPrice !== null &&
            a.buyNowPrice !== undefined,
        );
      } else if (args.listingType === "bid") {
        auctions = auctions.filter(
          (a) => a.buyNowPrice === null || a.buyNowPrice === undefined,
        );
      }

      // Filter out ended auctions if includeEnded is false
      const now = Date.now();
      if (args.includeEnded === false) {
        auctions = auctions.filter((a) => a.end > now);
      }

      // Search filter (case-insensitive, supports enchant:"..." key:value search, comma-separated phrase match, then AND word search)
      if (args.search && args.search.trim() !== "") {
        let searchTerm = args.search.trim().toLowerCase();

        // Parse all enchant:"..." key:value searches
        const enchantRegex = /enchant:"([^"]+)"/g;
        let enchantPhrases: string[] = [];
        let match;
        while ((match = enchantRegex.exec(searchTerm)) !== null) {
          enchantPhrases.push(match[1].trim());
        }
        // Remove all enchant:"..." from the search term for further processing
        if (enchantPhrases.length > 0) {
          searchTerm = searchTerm
            .replace(/enchant:"([^"]+)"/g, "")
            .replace(/\s{2,}/g, " ")
            .trim();
        }

        // Split by comma for phrase search, trim each phrase
        const phrases = searchTerm
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p.length > 0);

        let filtered: typeof auctions = auctions;

        // If enchant:"..." is present, filter by all phrases in lore (AND logic)
        if (enchantPhrases.length > 0) {
          filtered = filtered.filter((a) => {
            const lore = a.lore.toLowerCase();
            return enchantPhrases.every((phrase) =>
              lore.includes(phrase.toLowerCase()),
            );
          });
        }

        // If there are still search terms left, apply phrase/word search
        if (phrases.length > 0 && phrases.some((p) => p.length > 0)) {
          if (phrases.length > 1) {
            // All phrases must be present as substrings in title or lore
            filtered = filtered.filter((a) => {
              const title = a.title.toLowerCase();
              const lore = a.lore.toLowerCase();
              return phrases.every(
                (phrase) => title.includes(phrase) || lore.includes(phrase),
              );
            });
          } else {
            // Single phrase: behave as before
            filtered = filtered.filter(
              (a) =>
                a.title.toLowerCase().includes(phrases[0]) ||
                a.lore.toLowerCase().includes(phrases[0]),
            );
          }
          // Fallback: if no results, do AND word search for all words in all phrases
          if (filtered.length === 0) {
            const words =
              phrases.length > 1
                ? phrases.flatMap((p) => p.split(/\s+/))
                : phrases[0].split(/\s+/);
            filtered = auctions.filter((a) => {
              const title = a.title.toLowerCase();
              const lore = a.lore.toLowerCase();
              // If enchantPhrases are present, keep that filter
              if (
                enchantPhrases.length > 0 &&
                !enchantPhrases.every((phrase) =>
                  lore.includes(phrase.toLowerCase()),
                )
              ) {
                return false;
              }
              return words.every(
                (word) => title.includes(word) || lore.includes(word),
              );
            });
          }
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
          auctions.sort((a, b) => b._creationTime - a._creationTime);
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
    }

    // Not own: use existing query logic
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
      q = q.filter((row) =>
        row.gt(row.field("buyNowPrice"), row.field("currentBid")),
      );
    }

    auctions = await q.collect();
    // Search filter (case-insensitive, supports enchant:"..." key:value search, comma-separated phrase match, then AND word search)
    if (args.search && args.search.trim() !== "") {
      let searchTerm = args.search.trim().toLowerCase();

      // Parse all enchant:"..." key:value searches
      const enchantRegex = /enchant:"([^"]+)"/g;
      let enchantPhrases: string[] = [];
      let match;
      while ((match = enchantRegex.exec(searchTerm)) !== null) {
        enchantPhrases.push(match[1].trim());
      }
      // Remove all enchant:"..." from the search term for further processing
      if (enchantPhrases.length > 0) {
        searchTerm = searchTerm
          .replace(/enchant:"([^"]+)"/g, "")
          .replace(/\s{2,}/g, " ")
          .trim();
      }

      // Split by comma for phrase search, trim each phrase
      const phrases = searchTerm
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      let filtered: typeof auctions = auctions;

      // If enchant:"..." is present, filter by all phrases in lore (AND logic)
      if (enchantPhrases.length > 0) {
        filtered = filtered.filter((a) => {
          const lore = a.lore.toLowerCase();
          return enchantPhrases.every((phrase) =>
            lore.includes(phrase.toLowerCase()),
          );
        });
      }

      // If there are still search terms left, apply phrase/word search
      if (phrases.length > 0 && phrases.some((p) => p.length > 0)) {
        if (phrases.length > 1) {
          // All phrases must be present as substrings in title or lore
          filtered = filtered.filter((a) => {
            const title = a.title.toLowerCase();
            const lore = a.lore.toLowerCase();
            return phrases.every(
              (phrase) => title.includes(phrase) || lore.includes(phrase),
            );
          });
        } else {
          // Single phrase: behave as before
          filtered = filtered.filter(
            (a) =>
              a.title.toLowerCase().includes(phrases[0]) ||
              a.lore.toLowerCase().includes(phrases[0]),
          );
        }
        // Fallback: if no results, do AND word search for all words in all phrases
        if (filtered.length === 0) {
          const words =
            phrases.length > 1
              ? phrases.flatMap((p) => p.split(/\s+/))
              : phrases[0].split(/\s+/);
          filtered = auctions.filter((a) => {
            const title = a.title.toLowerCase();
            const lore = a.lore.toLowerCase();
            // If enchantPhrases are present, keep that filter
            if (
              enchantPhrases.length > 0 &&
              !enchantPhrases.every((phrase) =>
                lore.includes(phrase.toLowerCase()),
              )
            ) {
              return false;
            }
            return words.every(
              (word) => title.includes(word) || lore.includes(word),
            );
          });
        }
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
        auctions.sort((a, b) => b._creationTime - a._creationTime);
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
      seller_claim: v.boolean(),
      buyer_claim: v.boolean(),
      title: v.string(),
      lore: v.string(),
      image: v.string(),
      currentBid: v.number(),
      buyNowPrice: v.optional(v.number()),
      end: v.number(),
      bidcount: v.number(),
      seller: v.id("users"),
      category: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("auctions", args.item);
  },
});

export const cancelAuction = mutation({
  args: { id: v.id("auctions") },
  handler: async (ctx, args) => {
    const { user } = (await ctx.runQuery(internal.users.signUser)) as {
      user: Doc<"users"> | null;
    };
    if (!user) {
      return { ok: false, message: "Invalid Signin" };
    }
    const auction = await ctx.db.get(args.id);
    if (!auction) {
      return { ok: false, message: "Auction not found" };
    }

    const now = Date.now();
    if (
      auction.end <= now ||
      (auction.buyNowPrice &&
        auction.currentBid &&
        auction.currentBid >= auction.buyNowPrice)
    ) {
      return { ok: false, message: "Auction has already ended" };
    }
    await ctx.db.delete(auction._id);
    const itemId = await ctx.db.insert("items", {
      category: auction.category,
      image: auction.image,
      lore: auction.lore,
      title: auction.title,
    });
    user.inventory.push(itemId);
    ctx.db.patch(user._id, { inventory: user.inventory });
    return {
      ok: true,
      message: "Canceled auction and transfered item to your inventory",
    };
  },
  returns: { ok: v.boolean(), message: v.string() },
});
export const claimSellerAuction = mutation({
  args: { id: v.id("auctions") },
  handler: async (ctx, args) => {
    const { user } = (await ctx.runQuery(internal.users.signUser)) as {
      user: Doc<"users"> | null;
    };
    if (!user) {
      return { ok: false, message: "Invalid Signin" };
    }
    const auction = await ctx.db.get(args.id);
    if (!auction) {
      return { ok: false, message: "Auction not found" };
    }
    const now = Date.now();
    if (
      auction.end > now &&
      auction.currentBid &&
      auction.buyNowPrice &&
      auction.currentBid < auction.buyNowPrice
    ) {
      return { ok: false, message: "Auction hasn't ended" };
    }
    if (auction.seller != user._id || auction.seller_claim) {
      return { ok: false, message: "You do not own this auction." };
    }
    if (auction.currentBid) {
      ctx.db.patch(user._id, { balance: user.balance + auction.currentBid });
      ctx.db.patch(auction._id, { seller_claim: true });
    } else {
      ctx.db.delete(auction._id);
      const item = await ctx.db.insert("items", {
        category: auction.category,
        image: auction.image,
        lore: auction.lore,
        title: auction.title,
      });
      user.inventory.push(item);
      ctx.db.patch(user._id, { inventory: user.inventory });
    }
    return { ok: true, message: "Succesfully claimed" };
  },
});

export const claimbidderAuction = mutation({
  args: { id: v.id("auctions") },
  handler: async (ctx, args) => {
    const { user } = (await ctx.runQuery(internal.users.signUser)) as {
      user: Doc<"users"> | null;
    };
    if (!user) {
      return { ok: false, message: "Invalid Signin" };
    }
    const auction = await ctx.db.get(args.id);
    if (!auction) {
      return { ok: false, message: "Auction not found" };
    }
    const now = Date.now();
    if (
      auction.end > now &&
      auction.currentBid &&
      auction.buyNowPrice &&
      auction.currentBid < auction.buyNowPrice
    ) {
      return { ok: false, message: "Auction hasn't ended" };
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
    if (!tbid) {
      return {
        ok: false,
        message: "You do not have a bid in this auction",
      };
    }
    if (auction.bidid == tbid?._id) {
      return {
        ok: false,
        message: "You may not claim your bid as you won the auction",
      };
    }

    ctx.db.patch(user._id, { balance: user.balance + tbid?.bid });
    ctx.db.delete(tbid._id);
    return { ok: true, message: "Succesfully claimed" };
  },
});

export const claimwinnerAuction = mutation({
  args: { id: v.id("auctions") },
  handler: async (ctx, args) => {
    const { user } = (await ctx.runQuery(internal.users.signUser)) as {
      user: Doc<"users"> | null;
    };
    if (!user) {
      return { ok: false, message: "Invalid Signin" };
    }
    const auction = await ctx.db.get(args.id);
    if (!auction) {
      return { ok: false, message: "Auction not found" };
    }
    const now = Date.now();
    if (
      auction.end > now &&
      auction.currentBid &&
      auction.buyNowPrice &&
      auction.currentBid < auction.buyNowPrice
    ) {
      return { ok: false, message: "Auction hasn't ended" };
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
    if (!tbid) {
      return {
        ok: false,
        message: "You do not have a bid in this auction",
      };
    }
    if (auction.bidid != tbid?._id) {
      return {
        ok: false,
        message: "You may not claim this item as you haven't won the auction",
      };
    }
    if (auction.buyer_claim) {
      return {
        ok: false,
        message: "You have already claimed this item",
      };
    }

    ctx.db.delete(tbid._id);
    ctx.db.patch(auction._id, { bidid: undefined, buyer_claim: true });
    const item = await ctx.db.insert("items", {
      category: auction.category,
      image: auction.image,
      lore: auction.lore,
      title: auction.title,
    });
    user.inventory.push(item);
    ctx.db.patch(user._id, { inventory: user.inventory });
    return { ok: true, message: "Succesfully claimed" };
  },
});

export const buyItNow = mutation({
  args: { id: v.id("auctions") },
  handler: async (ctx, args) => {
    const { user } = (await ctx.runQuery(internal.users.signUser)) as {
      user: Doc<"users"> | null;
    };
    if (!user) {
      return { ok: false, message: "Invalid Signin" };
    }
    const auction = await ctx.db.get(args.id);
    if (!auction) {
      return { ok: false, message: "Auction not found" };
    }
    if (!auction.buyNowPrice) {
      return { ok: false, message: "Not a BIN Auction" };
    }
    const now = Date.now();
    if (
      auction.end <= now ||
      (auction.buyNowPrice &&
        auction.currentBid &&
        auction.currentBid >= auction.buyNowPrice)
    ) {
      return { ok: false, message: "Auction has already ended" };
    }
    if (user.balance < auction.buyNowPrice) {
      return { ok: false, message: "Insufucient funds" };
    }
    if (user._id == auction.seller) {
      return { ok: false, message: "You cannot buy your own item" };
    }
    const bid = await ctx.db.insert("bids", {
      auctionId: auction._id,
      bid: auction.buyNowPrice,
      userId: user._id,
    });
    ctx.db.patch(auction._id, {
      bidid: bid,
      currentBid: auction.buyNowPrice,
      bidcount: auction.bidcount + 1,
    });
    ctx.db.patch(user._id, { balance: user.balance - auction.buyNowPrice });
    return { ok: true, message: "This Auction has been Succesfully Bought" };
  },
});
export const bid = mutation({
  args: { id: v.id("auctions"), amt: v.number() },
  handler: async (ctx, args) => {
    const { user } = (await ctx.runQuery(internal.users.signUser)) as {
      user: Doc<"users"> | null;
    };
    if (!user) {
      return { ok: false, message: "Invalid Signin" };
    }
    const auction = await ctx.db.get(args.id);
    if (!auction) {
      return { ok: false, message: "Auction not found" };
    }
    if (!auction.currentBid) {
      return { ok: false, message: "Not a Bid Auction" };
    }
    const now = Date.now();
    if (
      auction.end <= now ||
      (auction.buyNowPrice &&
        auction.currentBid &&
        auction.currentBid >= auction.buyNowPrice)
    ) {
      return { ok: false, message: "Auction has already ended" };
    }
    if (args.amt < auction.currentBid || user._id == auction.seller) {
      return { ok: false, message: "Invalid bid" };
    }
    if (user.balance < args.amt) {
      return { ok: false, message: "Insufucient funds" };
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
    let bid;
    if (!tbid) {
      bid = await ctx.db.insert("bids", {
        auctionId: auction._id,
        bid: args.amt,
        userId: user._id,
      });
    } else {
      ctx.db.patch(tbid._id, { bid: args.amt });
      bid = tbid?._id;
    }

    ctx.db.patch(auction._id, {
      bidid: bid,
      currentBid: args.amt,
      bidcount: auction.bidcount + 1,
    });
    ctx.db.patch(user._id, { balance: user.balance - args.amt });
    return { ok: true, message: "You have Succesfully bid on this Auction" };
  },
});
