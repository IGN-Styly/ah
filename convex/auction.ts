import { query, mutation } from "@convex/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { useMutation } from "convex/react";
import { paginationOptsValidator } from "convex/server";
import { formatPriceBNK } from "@/lib/price";
import AppConfig from "@/lib/config";

// Sort types
export const SortOptions = {
  ENDING_SOON: "soon",
  PRICE_LOW: "lowhigh",
  PRICE_HIGH: "highlow",
  NEWEST: "new",
  MOST_BIDS: "bids",
} as const;
// if (args.own) {
//   // Fetch auctions where the user is the seller
//   const sellingAuctions = await ctx.db
//     .query("auctions")
//     .withIndex("by_seller", (q) => q.eq("seller", args.own as Id<"users">))
//     .collect();

//   // Fetch auctions where the user has placed a bid
//   const userBids = await ctx.db
//     .query("bids")
//     .withIndex("by_userId", (q) => q.eq("userId", args.own as Id<"users">))
//     .collect();

//   const bidAuctionIds = userBids.map((bid) => bid.auctionId);

//   // Fetch auctions for these bidAuctionIds
//   let bidAuctions: Doc<"auctions">[] = [];
//   if (bidAuctionIds.length > 0) {
//     bidAuctions = await Promise.all(
//       bidAuctionIds.map((id) => ctx.db.get(id)),
//     ).then((results) => results.filter(Boolean) as Doc<"auctions">[]);
//   }

//   // Combine and deduplicate auctions
//   const auctionMap = new Map<string, Doc<"auctions">>();
//   for (const auction of sellingAuctions) {
//     auctionMap.set(auction._id, auction);
//   }
//   for (const auction of bidAuctions) {
//     auctionMap.set(auction._id, auction);
//   }
//   auctions = Array.from(auctionMap.values());

//   // Now apply all filters and sorting in TypeScript for the 'own' case

//   // Filter by category if provided and not "all"
//   if (args.category && args.category !== "all") {
//     auctions = auctions.filter((a) => a.category === args.category);
//   }

//   // Filter by listing type
//   if (args.listingType === "bin") {
//     auctions = auctions.filter(
//       (a) =>
//         typeof a.buyNowPrice === "number" &&
//         a.buyNowPrice !== null &&
//         a.buyNowPrice !== undefined,
//     );
//   } else if (args.listingType === "bid") {
//     auctions = auctions.filter(
//       (a) => a.buyNowPrice === null || a.buyNowPrice === undefined,
//     );
//   }

//   // Filter out ended auctions if includeEnded is false
//   const now = Date.now();
//   if (args.includeEnded === false) {
//     auctions = auctions.filter((a) => a.end > now);
//   }

//   // Search filter (case-insensitive, supports enchant:"..." key:value search, comma-separated phrase match, then AND word search)
//   if (args.search && args.search.trim() !== "") {
//     let searchTerm = args.search.trim().toLowerCase();

//     // Parse all enchant:"..." key:value searches
//     const enchantRegex = /enchant:"([^"]+)"/g;
//     let enchantPhrases: string[] = [];
//     let match;
//     while ((match = enchantRegex.exec(searchTerm)) !== null) {
//       enchantPhrases.push(match[1].trim());
//     }
//     // Remove all enchant:"..." from the search term for further processing
//     if (enchantPhrases.length > 0) {
//       searchTerm = searchTerm
//         .replace(/enchant:"([^"]+)"/g, "")
//         .replace(/\s{2,}/g, " ")
//         .trim();
//     }

//     // Split by comma for phrase search, trim each phrase
//     const phrases = searchTerm
//       .split(",")
//       .map((p) => p.trim())
//       .filter((p) => p.length > 0);

//     let filtered: typeof auctions = auctions;

//     // If enchant:"..." is present, filter by all phrases in lore (AND logic)
//     if (enchantPhrases.length > 0) {
//       filtered = filtered.filter((a) => {
//         const lore = a.lore.toLowerCase();
//         return enchantPhrases.every((phrase) =>
//           lore.includes(phrase.toLowerCase()),
//         );
//       });
//     }

//     // If there are still search terms left, apply phrase/word search
//     if (phrases.length > 0 && phrases.some((p) => p.length > 0)) {
//       if (phrases.length > 1) {
//         // All phrases must be present as substrings in title or lore
//         filtered = filtered.filter((a) => {
//           const title = a.title.toLowerCase();
//           const lore = a.lore.toLowerCase();
//           return phrases.every(
//             (phrase) => title.includes(phrase) || lore.includes(phrase),
//           );
//         });
//       } else {
//         // Single phrase: behave as before
//         filtered = filtered.filter(
//           (a) =>
//             a.title.toLowerCase().includes(phrases[0]) ||
//             a.lore.toLowerCase().includes(phrases[0]),
//         );
//       }
//       // Fallback: if no results, do AND word search for all words in all phrases
//       if (filtered.length === 0) {
//         const words =
//           phrases.length > 1
//             ? phrases.flatMap((p) => p.split(/\s+/))
//             : phrases[0].split(/\s+/);
//         filtered = auctions.filter((a) => {
//           const title = a.title.toLowerCase();
//           const lore = a.lore.toLowerCase();
//           // If enchantPhrases are present, keep that filter
//           if (
//             enchantPhrases.length > 0 &&
//             !enchantPhrases.every((phrase) =>
//               lore.includes(phrase.toLowerCase()),
//             )
//           ) {
//             return false;
//           }
//           return words.every(
//             (word) => title.includes(word) || lore.includes(word),
//           );
//         });
//       }
//     }

//     auctions = filtered;
//   }

//   // Sorting
//   switch (args.sort) {
//     case SortOptions.PRICE_LOW:
//       auctions.sort((a, b) => {
//         const aBid =
//           typeof a.currentBid === "number" && !isNaN(a.currentBid)
//             ? a.currentBid
//             : typeof a.buyNowPrice === "number" && !isNaN(a.buyNowPrice)
//               ? a.buyNowPrice
//               : Infinity;
//         const bBid =
//           typeof b.currentBid === "number" && !isNaN(b.currentBid)
//             ? b.currentBid
//             : typeof b.buyNowPrice === "number" && !isNaN(b.buyNowPrice)
//               ? b.buyNowPrice
//               : Infinity;
//         return aBid - bBid;
//       });
//       break;
//     case SortOptions.PRICE_HIGH:
//       auctions.sort((a, b) => {
//         const aBid =
//           typeof a.currentBid === "number" && !isNaN(a.currentBid)
//             ? a.currentBid
//             : typeof a.buyNowPrice === "number" && !isNaN(a.buyNowPrice)
//               ? a.buyNowPrice
//               : -Infinity;
//         const bBid =
//           typeof b.currentBid === "number" && !isNaN(b.currentBid)
//             ? b.currentBid
//             : typeof b.buyNowPrice === "number" && !isNaN(b.buyNowPrice)
//               ? b.buyNowPrice
//               : -Infinity;
//         return bBid - aBid;
//       });
//       break;
//     case SortOptions.NEWEST:
//       auctions.sort((a, b) => b._creationTime - a._creationTime);
//       break;
//     case SortOptions.MOST_BIDS:
//       auctions.sort((a, b) => b.bidcount - a.bidcount);
//       break;
//     case SortOptions.ENDING_SOON:
//     default:
//       auctions.sort((a, b) => a.end - b.end);
//       break;
//   }

//   return auctions;
// }
export const get = query({
  args: {
    includeEnded: v.optional(v.boolean()),
    category: v.optional(v.string()),
    sort: v.optional(v.string()),
    listingType: v.optional(v.string()), // NEW
    search: v.optional(v.string()), // Add search argument
    own: v.optional(v.id("users")),
    paginationOpts: paginationOptsValidator,
    now: v.number(),
  },
  handler: async (ctx, args) => {
    let q;

    // Not own: use existing query logic
    if (args.search) {
      q = ctx.db.query("auctions").withSearchIndex("search_title", (q) => {
        return q.search("lore", args.search as string);
      });
    } else {
      q = ctx.db.query("auctions");
      switch (args.sort) {
        case SortOptions.PRICE_LOW:
          q = q.withIndex("by_price").order("asc");
          break;
        case SortOptions.PRICE_HIGH:
          q = q.withIndex("by_price").order("desc");
          break;
        case SortOptions.NEWEST:
          q = q.withIndex("by_creation_time").order("desc");
          break;
        case SortOptions.MOST_BIDS:
          q = q.withIndex("by_bidcount").order("desc");
          break;
        case SortOptions.ENDING_SOON:
        default:
          q = q.withIndex("by_end").order("asc");
          break;
      }
    }

    // Filter by category if provided and not "all"
    if (args.category && args.category !== "all") {
      q = q.filter((p) => p.eq(p.field("category"), args.category));
    }

    // Filter by listing type

    if (args.listingType === "bin") {
      q = q.filter((row) =>
        row.and(
          row.neq(row.field("buyNowPrice"), undefined),
          row.neq(row.field("buyNowPrice"), null),
        ),
      );
    } else if (args.listingType === "auctions") {
      q = q.filter((row) =>
        row.not(
          row.or(
            row.eq(row.field("currentBid"), undefined),
            row.eq(row.field("currentBid"), null),
          ),
        ),
      );
    }

    // const now = Date.now();
    if (args.includeEnded === false) {
      q = q.filter((row) => row.gt(row.field("end"), args.now));
      q = q.filter((row) =>
        row.or(
          row.gt(row.field("buyNowPrice"), row.field("currentBid")),
          row.eq(row.field("buyNowPrice"), null),
        ),
      );
    }
    let auctions = await q.paginate(args.paginationOpts);
    if (args.search) {
      switch (args.sort) {
        case SortOptions.PRICE_LOW:
          auctions.page.sort((a, b) => {
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
          auctions.page.sort((a, b) => {
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
          auctions.page.sort((a, b) => b._creationTime - a._creationTime);
          break;
        case SortOptions.MOST_BIDS:
          auctions.page.sort((a, b) => b.bidcount - a.bidcount);
          break;
        case SortOptions.ENDING_SOON:
        default:
          auctions.page.sort((a, b) => a.end - b.end);
          break;
      }
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
      return {
        ok: false,
        message: "You must be signed in to cancel an auction.",
      };
    }
    const auction = await ctx.db.get(args.id);
    if (!auction) {
      return {
        ok: false,
        message: "The auction you are trying to cancel does not exist.",
      };
    }

    const now = Date.now();
    if (
      auction.end <= now ||
      (auction.buyNowPrice &&
        auction.currentBid &&
        auction.currentBid >= auction.buyNowPrice)
    ) {
      return {
        ok: false,
        message: "The auction has already ended and cannot be canceled.",
      };
    }
    await ctx.db.delete(auction._id);
    const itemId = await ctx.db.insert("items", {
      category: auction.category,
      image: auction.image,
      lore: auction.lore,
      title: auction.title,
      user: user._id,
    });
    user.inventory.push(itemId);
    ctx.db.patch(user._id, { inventory: user.inventory });
    return {
      ok: true,
      message:
        "The auction has been successfully canceled, and the item has been returned to your inventory.",
    };
  },
  returns: { ok: v.boolean(), message: v.string() },
});
export const claimSellerAuction = mutation({
  args: { id: v.id("auctions") },
  handler: async (ctx, args) => {
    let txt = "";
    const { user } = (await ctx.runQuery(internal.users.signUser)) as {
      user: Doc<"users"> | null;
    };
    if (!user) {
      return {
        ok: false,
        message: "You must be signed in to claim auction proceeds.",
      };
    }
    const auction = await ctx.db.get(args.id);
    if (!auction) {
      return {
        ok: false,
        message: "The auction you are trying to claim does not exist.",
      };
    }
    const now = Date.now();
    if (
      auction.end > now &&
      auction.currentBid &&
      auction.buyNowPrice &&
      auction.currentBid < auction.buyNowPrice
    ) {
      return { ok: false, message: "The auction has not ended yet." };
    }
    if (auction.seller != user._id || auction.seller_claim) {
      return {
        ok: false,
        message: "You are not authorized to claim this auction.",
      };
    }
    if (auction.currentBid) {
      ctx.db.patch(user._id, { balance: user.balance + auction.currentBid });
      ctx.db.patch(auction._id, { seller_claim: true });
      txt = formatPriceBNK(auction.currentBid);
    } else {
      ctx.db.delete(auction._id);
      const item = await ctx.db.insert("items", {
        category: auction.category,
        image: auction.image,
        lore: auction.lore,
        title: auction.title,
        user: user._id,
      });
      txt = "item";
      user.inventory.push(item);
      ctx.db.patch(user._id, { inventory: user.inventory });
    }
    return {
      ok: true,
      message:
        "You have successfully claimed the auction proceeds of " + txt + ".",
    };
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
        message:
          "You do not have a bid in this auction. Please ensure you have participated in the auction before claiming.",
      };
    }
    if (auction.bidid == tbid?._id) {
      return {
        ok: false,
        message:
          "You cannot claim your bid refund because you won the auction. Please claim your item instead.",
      };
    }

    ctx.db.patch(user._id, { balance: user.balance + tbid?.bid });
    ctx.db.delete(tbid._id);
    return {
      ok: true,
      message:
        "You have successfully claimed your bid refund. The amount has been added back to your balance.",
    };
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
        message: "You must have an active bid in this auction to claim it.",
      };
    }
    if (auction.bidid != tbid?._id) {
      return {
        ok: false,
        message:
          "You cannot claim this item because you did not win the auction.",
      };
    }
    if (auction.buyer_claim) {
      return {
        ok: false,
        message: "This item has already been claimed.",
      };
    }

    ctx.db.delete(tbid._id);
    ctx.db.patch(auction._id, { bidid: undefined, buyer_claim: true });
    const item = await ctx.db.insert("items", {
      category: auction.category,
      image: auction.image,
      lore: auction.lore,
      title: auction.title,
      user: user._id,
    });
    user.inventory.push(item);
    ctx.db.patch(user._id, { inventory: user.inventory });
    return {
      ok: true,
      message:
        "You have successfully claimed your auction item. It has been added to your inventory.",
    };
  },
});

export const buyItNow = mutation({
  args: { id: v.id("auctions") },
  handler: async (ctx, args) => {
    const { user } = (await ctx.runQuery(internal.users.signUser)) as {
      user: Doc<"users"> | null;
    };
    if (!user) {
      return {
        ok: false,
        message: "You must be signed in to complete this action.",
      };
    }
    const auction = await ctx.db.get(args.id);
    if (!auction) {
      return {
        ok: false,
        message: "The auction you are trying to buy does not exist.",
      };
    }
    if (!auction.buyNowPrice) {
      return {
        ok: false,
        message: "This auction is not eligible for 'Buy It Now'.",
      };
    }
    const now = Date.now();
    if (
      auction.end <= now ||
      (auction.buyNowPrice &&
        auction.currentBid &&
        auction.currentBid >= auction.buyNowPrice)
    ) {
      return {
        ok: false,
        message: "The auction has already ended or been purchased.",
      };
    }
    if (user.balance < auction.buyNowPrice) {
      return {
        ok: false,
        message: "You do not have sufficient funds to complete this purchase.",
      };
    }
    if (user._id == auction.seller) {
      return {
        ok: false,
        message: "You cannot purchase your own auction item.",
      };
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
    ctx.db.patch(user._id, {
      balance:
        user.balance -
        auction.buyNowPrice * AppConfig.TAX -
        auction.buyNowPrice,
    });
    return {
      ok: true,
      message:
        "You have successfully purchased the auction item. Thank you for your purchase!",
    };
  },
});
export const bid = mutation({
  args: { id: v.id("auctions"), amt: v.number() },
  handler: async (ctx, args) => {
    const { user } = (await ctx.runQuery(internal.users.signUser)) as {
      user: Doc<"users"> | null;
    };
    if (!user) {
      return { ok: false, message: "You must be signed in to place a bid." };
    }
    const auction = await ctx.db.get(args.id);
    if (!auction) {
      return {
        ok: false,
        message: "The auction you are trying to bid on does not exist.",
      };
    }
    if (!auction.currentBid) {
      return { ok: false, message: "This auction does not accept bids." };
    }
    const now = Date.now();
    if (
      auction.end <= now ||
      (auction.buyNowPrice &&
        auction.currentBid &&
        auction.currentBid >= auction.buyNowPrice)
    ) {
      return { ok: false, message: "The auction has already ended." };
    }
    if (args.amt < auction.currentBid || user._id == auction.seller) {
      return {
        ok: false,
        message: "Your bid must be higher than the current bid.",
      };
    }
    if (user.balance < args.amt || user._id == auction.seller) {
      return {
        ok: false,
        message: "You do not have sufficient funds to place this bid.",
      };
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
    return {
      ok: true,
      message: "Your bid has been successfully placed. Good luck!",
    };
  },
});
