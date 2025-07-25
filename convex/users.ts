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

export const loadDummy = internalMutation({
  args: { amt: v.number() },
  handler: async (ctx, args) => {
    for (let i = 0; i < args.amt; i++) {
      ctx.db.insert("auctions", {
        bidcount: 0,
        buyNowPrice: 1000000000,
        buyer_claim: false,
        category: "weapons",
        currentBid: 100000,
        end: Date.now() + 86400000 + i * 1000 * 60,
        image:
          "/assets/prism_all/assets/minecraft/textures/items/iron_sword.png",
        lore: `{ "ench": [],
        "Unbreakable": true,
        "HideFlags": 254,
        "display": {
          "Lore": [
            "§7Gear Score: §d1136 §8(3375)§7",
            "§7Damage: §c+346 §e(+30) §8(+1,136)§7",
            "§7Strength: §c+245 §e(+30) §9(+50) §8(+816.5)§7",
            "§7Crit Damage: §c+70% §8(+248.5%)§7",
            "§7Bonus Attack Speed: §c+7% §9(+7%) §8(+10.5%)§7",
            "§7Intelligence: §a+610 §9(+125) §d(+40) §8(+2,041.25)§7",
            "§7Ferocity: §a+33 §8(+45)§7",
            " §5[§b✎§5] §5[§b⚔§5]§7",
            "§7",
            "§d§l§d§lUltimate Wise ${i}§9, §9Cleave V§9, §9Critical VI§7",
            "§9Cubism V§9, §9Ender Slayer V§9, §9Execute V§7",
            "§9Experience IV§9, §9Fire Aspect III§9, §9First Strike IV§7",
            "§9Giant Killer V§9, §9Impaling III§9, §9Lethality VI§7",
            "§9Life Steal IV§9, §9Looting IV§9, §9Luck VI§7",
            "§9Scavenger IV§9, §9Sharpness V§9, §9Thunderlord VI§7",
            "§9Vampirism V§9, §9Venomous V§7",
            "§7",
            "§7Deals §c+50% §7damage to Withers.§7",
            "§7Grants §c+1 §c❁ Damage §7and §a+2 §b✎§7",
            "§bIntelligence §7per §cCatacombs §7level.§7",
            "§7",
            "§aScroll Abilities:§7",
            "§6Ability: Wither Impact  §e§lRIGHT CLICK§7",
            "§7Teleport §a10 blocks§7 ahead of you.§7",
            "§7Then implode dealing §c21,768.2 §7damage§7",
            "§7to nearby enemies. Also applies the§7",
            "§7wither shield scroll ability reducing§7",
            "§7damage taken and granting an§7",
            "§7absorption shield for §e5 §7seconds.§7",
            "§8Mana Cost: §3149§7",
            "§7",
            "§d§l§ka§r §d§lMYTHIC DUNGEON SWORD §d§l§ka§7"
          ],
          "Name": "§f§f§dHeroic Hyperion §6✪✪✪✪✪§7"
        },
        "ExtraAttributes": {
          "rarity_upgrades": 1,
          "hot_potato_count": 15,
          "gems": {
            "COMBAT_0": {
              "uuid": "61309524-66f6-4fb7-a213-342f05826695§7",
              "quality": "FLAWLESS§7"
            },
            "unlocked_slots": [
              "SAPPHIRE_0§7",
              "COMBAT_0§7"
            ],
            "COMBAT_0_gem": "SAPPHIRE§7",
            "SAPPHIRE_0": {
              "uuid": "c5b8d275-bc73-46ab-bc52-6fb705e7441e§7",
              "quality": "FLAWLESS§7"
            }
          },
          "modifier": "heroic§7",
          "upgrade_level": 5,
          "id": "HYPERION§7",
          "enchantments": {
            "impaling": 3,
            "luck": 6,
            "critical": 6,
            "cleave": 5,
            "looting": 4,
            "scavenger": 4,
            "ender_slayer": 5,
            "fire_aspect": 3,
            "experience": 4,
            "vampirism": 5,
            "life_steal": 4,
            "execute": 5,
            "giant_killer": 5,
            "first_strike": 4,
            "venomous": 5,
            "thunderlord": 6,
            "ultimate_wise": 5,
            "sharpness": 5,
            "cubism": 5,
            "lethality": 6
          },
          "uuid": "b6616063-c309-4a64-b8a8-52d357bf9fa1§7",
          "ability_scroll": [
            "WITHER_SHIELD_SCROLL§7",
            "SHADOW_WARP_SCROLL§7",
            "IMPLOSION_SCROLL§7"
          ],
          "timestamp": 1725110658221
        }
      }`,
        seller: "j9758makajz1dn783181nwa0397kt5fk" as Id<"users">,
        seller_claim: false,
        title: `Heroic Hyperion ${i}`,
      });
    }
  },
});

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
