import { JSX, FC, ReactNode } from "react";

export const example = `§9{§8ench: §2[§2]§8, §8Unbreakable: §71b§8, §8HideFlags: §7254§8, §8display: §2{§8Lore: §e[§7"§7Gear Score: §d1136 §8(3375)§7"§8, §7"§7Damage: §c+346 §e(+30) §8(+1,136)§7"§8, §7"§7Strength: §c+245 §e(+30) §9(+50) §8(+816.5)§7"§8, §7"§7Crit Damage: §c+70% §8(+248.5%)§7"§8, §7"§7Bonus Attack Speed: §c+7% §9(+7%) §8(+10.5%)§7"§8, §7"§7Intelligence: §a+610 §9(+125) §d(+40) §8(+2,041.25)§7"§8, §7"§7Ferocity: §a+33 §8(+45)§7"§8, §7" §5[§b✎§5] §5[§b⚔§5]§7"§8, §7"§7"§8, §7"§d§l§d§lUltimate Wise V§9, §9Cleave V§9, §9Critical VI§7"§8, §7"§9Cubism V§9, §9Ender Slayer V§9, §9Execute V§7"§8, §7"§9Experience IV§9, §9Fire Aspect III§9, §9First Strike IV§7"§8, §7"§9Giant Killer V§9, §9Impaling III§9, §9Lethality VI§7"§8, §7"§9Life Steal IV§9, §9Looting IV§9, §9Luck VI§7"§8, §7"§9Scavenger IV§9, §9Sharpness V§9, §9Thunderlord VI§7"§8, §7"§9Vampirism V§9, §9Venomous V§7"§8, §7"§7"§8, §7"§7Deals §c+50% §7damage to Withers.§7"§8, §7"§7Grants §c+1 §c❁ Damage §7and §a+2 §b✎§7"§8, §7"§bIntelligence §7per §cCatacombs §7level.§7"§8, §7"§7"§8, §7"§aScroll Abilities:§7"§8, §7"§6Ability: Wither Impact  §e§lRIGHT CLICK§7"§8, §7"§7Teleport §a10 blocks§7 ahead of you.§7"§8, §7"§7Then implode dealing §c21,768.2 §7damage§7"§8, §7"§7to nearby enemies. Also applies the§7"§8, §7"§7wither shield scroll ability reducing§7"§8, §7"§7damage taken and granting an§7"§8, §7"§7absorption shield for §e5 §7seconds.§7"§8, §7"§8Mana Cost: §3149§7"§8, §7"§7"§8, §7"§d§l§ka§r §d§lMYTHIC DUNGEON SWORD §d§l§ka§7"§8]§8, §8Name: §7"§f§f§dHeroic Hyperion  §6✪✪✪✪✪§7"§2}§8, §8ExtraAttributes: §2{§8rarity_upgrades: §71§8, §8hot_potato_count: §715§8, §8gems: §e{§8COMBAT_0: §c{§8uuid: §7"61309524-66f6-4fb7-a213-342f05826695§7"§8, §8quality: §7"FLAWLESS§7"§c}§8, §8unlocked_slots: §c[§7"SAPPHIRE_0§7"§8, §7"COMBAT_0§7"§c]§8, §8COMBAT_0_gem: §7"SAPPHIRE§7"§8, §8SAPPHIRE_0: §c{§8uuid: §7"c5b8d275-bc73-46ab-bc52-6fb705e7441e§7"§8, §8quality: §7"FLAWLESS§7"§c}§e}§8, §8modifier: §7"heroic§7"§8, §8upgrade_level: §75§8, §8id: §7"HYPERION§7"§8, §8enchantments: §e{§8impaling: §73§8, §8luck: §76§8, §8critical: §76§8, §8cleave: §75§8, §8looting: §74§8, §8scavenger: §74§8, §8ender_slayer: §75§8, §8fire_aspect: §73§8, §8experience: §74§8, §8vampirism: §75§8, §8life_steal: §74§8, §8execute: §75§8, §8giant_killer: §75§8, §8first_strike: §74§8, §8venomous: §75§8, §8thunderlord: §76§8, §8ultimate_wise: §75§8, §8sharpness: §75§8, §8cubism: §75§8, §8lethality: §76§e}§8, §8uuid: §7"b6616063-c309-4a64-b8a8-52d357bf9fa1§7"§8, §8ability_scroll: §e[§7"WITHER_SHIELD_SCROLL§7"§8, §7"SHADOW_WARP_SCROLL§7"§8, §7"IMPLOSION_SCROLL§7"§e]§8, §8timestamp: §71725110658221L§2}§9}`;

interface ParsedNBT {
  name?: string;
  lore: string[];
}

/**
 * Interface for JSON-based NBT data
 *
 * This format matches the output of parseNBT to ensure compatibility
 * - Name: Item name with Minecraft formatting codes (§)
 * - Lore: Array of lore lines with Minecraft formatting codes
 *
 * Note: Empty lines in lore should be represented as "§7" to match parseNBT output
 */
interface NBTJson {
  Name: string;
  Lore: string[];
  // Additional properties can be added as needed
}

/**
 * Props for the NBTDisplay component
 */
/**
 * Structured NBT data type for more explicit type handling
 */
export interface StructuredNBTData {
  ench?: any[];
  Unbreakable?: boolean;
  HideFlags?: number;
  display: {
    Lore: string[];
    Name: string;
  };
  ExtraAttributes?: any;
  [key: string]: any;
}

interface NBTDisplayProps {
  nbtData: string | StructuredNBTData;
  showRaw?: boolean;
}

/**
 * Maps Minecraft color codes to CSS color values
 */
const colorMap: Record<string, string> = {
  "0": "#000000", // Black
  "1": "#0000AA", // Dark Blue
  "2": "#00AA00", // Dark Green
  "3": "#00AAAA", // Dark Aqua
  "4": "#AA0000", // Dark Red
  "5": "#AA00AA", // Dark Purple
  "6": "#FFAA00", // Gold
  "7": "#AAAAAA", // Gray
  "8": "#555555", // Dark Gray
  "9": "#5555FF", // Blue
  a: "#55FF55", // Green
  b: "#55FFFF", // Aqua
  c: "#FF5555", // Red
  d: "#FF55FF", // Light Purple
  e: "#FFFF55", // Yellow
  f: "#FFFFFF", // White
};

/**
 * Maps Minecraft formatting codes to CSS text styles
 */
const formatMap: Record<string, React.CSSProperties> = {
  k: { fontStyle: "italic" }, // Obfuscated (just using italic as placeholder)
  l: { fontWeight: "bold" }, // Bold
  m: { textDecoration: "line-through" }, // Strikethrough
  n: { textDecoration: "underline" }, // Underline
  o: { fontStyle: "italic" }, // Italic
  r: { fontWeight: "normal", textDecoration: "none", fontStyle: "normal" }, // Reset
};
export const jsonexample = {
  ench: [],
  Unbreakable: true,
  HideFlags: 254,
  display: {
    Lore: [
      "§7Gear Score: §d1136 §8(3375)§7",
      "§7Damage: §c+346 §e(+30) §8(+1,136)§7",
      "§7Strength: §c+245 §e(+30) §9(+50) §8(+816.5)§7",
      "§7Crit Damage: §c+70% §8(+248.5%)§7",
      "§7Bonus Attack Speed: §c+7% §9(+7%) §8(+10.5%)§7",
      "§7Intelligence: §a+610 §9(+125) §d(+40) §8(+2,041.25)§7",
      "§7Ferocity: §a+33 §8(+45)§7",
      " §5[§b✎§5] §5[§b⚔§5]§7",
      "§7",
      "§d§l§d§lUltimate Wise V§9, §9Cleave V§9, §9Critical VI§7",
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
      "§d§l§ka§r §d§lMYTHIC DUNGEON SWORD §d§l§ka§7",
    ],
    Name: "§f§f§dHeroic Hyperion §6✪✪✪✪✪§7",
  },
  ExtraAttributes: {
    rarity_upgrades: 1,
    hot_potato_count: 15,
    gems: {
      COMBAT_0: {
        uuid: "61309524-66f6-4fb7-a213-342f05826695§7",
        quality: "FLAWLESS§7",
      },
      unlocked_slots: ["SAPPHIRE_0§7", "COMBAT_0§7"],
      COMBAT_0_gem: "SAPPHIRE§7",
      SAPPHIRE_0: {
        uuid: "c5b8d275-bc73-46ab-bc52-6fb705e7441e§7",
        quality: "FLAWLESS§7",
      },
    },
    modifier: "heroic§7",
    upgrade_level: 5,
    id: "HYPERION§7",
    enchantments: {
      impaling: 3,
      luck: 6,
      critical: 6,
      cleave: 5,
      looting: 4,
      scavenger: 4,
      ender_slayer: 5,
      fire_aspect: 3,
      experience: 4,
      vampirism: 5,
      life_steal: 4,
      execute: 5,
      giant_killer: 5,
      first_strike: 4,
      venomous: 5,
      thunderlord: 6,
      ultimate_wise: 5,
      sharpness: 5,
      cubism: 5,
      lethality: 6,
    },
    uuid: "b6616063-c309-4a64-b8a8-52d357bf9fa1§7",
    ability_scroll: [
      "WITHER_SHIELD_SCROLL§7",
      "SHADOW_WARP_SCROLL§7",
      "IMPLOSION_SCROLL§7",
    ],
    timestamp: 1725110658221,
  },
};
/**
 * Parses a string with Minecraft formatting codes into React elements with appropriate styling
 */
function parseFormattedText(text: string): ReactNode[] {
  if (!text) return [];

  // Handle empty line case (just a color code)
  if (text === "§7") {
    return [
      <span key="empty" style={{ color: "#AAAAAA" }}>
        &nbsp;
      </span>,
    ];
  }

  const segments: ReactNode[] = [];
  let currentStyle: React.CSSProperties = {};
  let currentColor = "#AAAAAA"; // Default gray
  let currentText = "";
  let segmentKey = 0;

  // Process characters one by one
  let i = 0;
  while (i < text.length) {
    // Handle color codes
    if (text[i] === "§" && i + 1 < text.length) {
      // If we have accumulated text, create a segment
      if (currentText !== "") {
        segments.push(
          <span
            key={segmentKey++}
            style={{ ...currentStyle, color: currentColor }}
          >
            {currentText.replace(/ /g, "\u00A0")}
          </span>,
        );
        currentText = "";
      }

      const code = text[i + 1].toLowerCase();

      if (colorMap[code]) {
        currentColor = colorMap[code];
        // Color codes reset formatting
        currentStyle = {};
      } else if (formatMap[code]) {
        currentStyle = { ...currentStyle, ...formatMap[code] };
      } else if (code === "r") {
        // Reset
        currentStyle = {};
        currentColor = "#AAAAAA"; // Default gray
      }

      i += 2; // Skip the color code
    }
    // Handle spaces specially to ensure they're preserved
    else if (text[i] === " ") {
      // If the next character is a color code, handle the space separately
      if (i + 1 < text.length && text[i + 1] === "§") {
        // Add current text if any
        if (currentText !== "") {
          segments.push(
            <span
              key={segmentKey++}
              style={{ ...currentStyle, color: currentColor }}
            >
              {currentText.replace(/ /g, "\u00A0")}
            </span>,
          );
          currentText = "";
        }

        // Add the space as its own segment
        segments.push(
          <span
            key={segmentKey++}
            style={{ ...currentStyle, color: currentColor }}
          >
            {"\u00A0"}
          </span>,
        );

        i++; // Move past the space
      } else {
        // Otherwise just add the space to the current text
        currentText += " ";
        i++;
      }
    }
    // Handle normal characters
    else {
      currentText += text[i];
      i++;
    }
  }

  // Add any remaining text
  if (currentText !== "") {
    segments.push(
      <span key={segmentKey} style={{ ...currentStyle, color: currentColor }}>
        {currentText.replace(/ /g, "\u00A0")}
      </span>,
    );
  }

  // If we ended up with no content but had formatting codes, display a space
  if (segments.length === 0) {
    return [
      <span key="empty" style={{ color: currentColor }}>
        &nbsp;
      </span>,
    ];
  }

  return segments;
}

/**
 * NBTDisplay component renders Minecraft NBT data with proper formatting
 */
export const NBTDisplay: FC<NBTDisplayProps> = ({
  nbtData,
  showRaw = false,
}) => {
  // Parse the NBT data if it's a string, otherwise use it directly as StructuredNBTData
  const parsedData =
    typeof nbtData === "string"
      ? JSON.parse(nbtData)
      : (nbtData as StructuredNBTData);

  // Extract display information
  const display = parsedData?.display || {};
  const name = display.Name || "";
  const lore = display.Lore || [];

  return (
    <div
      className="nbt-display text-xs"
      style={{
        fontFamily: "Minecraft, monospace",
        padding: "8px",
        borderRadius: "4px",
        lineHeight: "1.2",
      }}
    >
      {/* Item Name */}
      <div
        className="nbt-name"
        style={{
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {parseFormattedText(name)}
      </div>

      {/* Divider */}
      <div
        style={{ height: "1px", backgroundColor: "#555555", margin: "4px 0" }}
      />

      {/* Lore Lines */}
      <div className="nbt-lore">
        {lore.map((line: string, index: number) => (
          <div
            key={index}
            className="lore-line"
            style={{ minHeight: "1.2em", whiteSpace: "pre-wrap" }}
          >
            {parseFormattedText(line)}
          </div>
        ))}
      </div>

      {/* Show Raw NBT */}
      {showRaw && (
        <div style={{ marginTop: "12px", fontSize: "0.8em", color: "#888888" }}>
          <details>
            <summary>Raw NBT</summary>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
              {JSON.stringify(parsedData, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

/**
 * NBTExample component demonstrates the NBTDisplay with the example data
 */
/**
 * Alternative auction example data
 */
export const auctionExample: StructuredNBTData = {
  ench: [],
  Unbreakable: true,
  HideFlags: 254,
  display: {
    Lore: [
      "§7Item Info:§8 §d§lWEAPON",
      "§7Damage: §c+120 §8(§a+25§8)",
      "§7Strength: §c+55 §e(+15)",
      "§7Crit Chance: §c+12%",
      "§7Crit Damage: §c+35%",
      "§7",
      "§6§lEPIC SWORD",
      "§7",
      "§7Stats:",
      "§7 §6+10 Mining Fortune",
      "§7 §6+5% Auction House Tax Reduction",
      "§7",
      "§6Auction Info:",
      "§7 §6Seller: §fMinecrafter123",
      "§7 §6Starting Bid: §a5,000 coins",
      "§7 §6Current Bid: §a12,500 coins",
      "§7 §6Time Left: §e2d 4h 35m",
      "§7",
      "§6§l§nAUCTION ITEM",
      "§7Click to view in Auction House",
    ],
    Name: "§6§lDragon's Sword §6✪✪✪§7",
  },
  ExtraAttributes: {
    id: "DRAGON_SWORD",
    auction_id: "abc123def456",
    seller_uuid: "12345678-1234-5678-1234-567812345678",
    starting_bid: 5000,
    current_bid: 12500,
    end_time: 1725510658221,
  },
};

export const NBTExample: FC = () => {
  return (
    <div>
      <h2>NBT Display Example</h2>
      <NBTDisplay nbtData={jsonexample} />

      <h3>Auction NBT Example</h3>
      <NBTDisplay nbtData={auctionExample} />

      <h3>Raw NBT String Example</h3>
      <NBTDisplay nbtData={example} showRaw={true} />
    </div>
  );
};

export function parseNBT(nbt: string): any {
  let pos = 0;

  // Skip color codes and whitespace
  function skipFormatting(): void {
    while (pos < nbt.length) {
      const char = nbt[pos];
      if (char === "§" && pos + 1 < nbt.length) {
        pos += 2; // Skip color code
      } else if (
        char === " " ||
        char === "\t" ||
        char === "\n" ||
        char === "\r"
      ) {
        pos++;
      } else {
        break;
      }
    }
  }

  function peek(): string {
    return nbt[pos] || "";
  }

  function consume(): string {
    return nbt[pos++] || "";
  }

  function parseValue(): any {
    skipFormatting();

    const char = peek();
    if (char === "{") {
      return parseObject();
    } else if (char === "[") {
      return parseArray();
    } else if (char === '"') {
      return parseString();
    } else {
      return parsePrimitive();
    }
  }

  function parseObject(): any {
    const obj: any = {};
    consume(); // consume '{'

    while (pos < nbt.length) {
      skipFormatting();

      if (peek() === "}") {
        consume();
        break;
      }

      // Parse key
      const key = parseKey();
      if (!key) break;

      skipFormatting();

      // Expect colon
      if (peek() === ":") {
        consume();
      }

      skipFormatting();

      // Parse value
      const value = parseValue();
      obj[key] = value;

      skipFormatting();

      // Handle comma
      if (peek() === ",") {
        consume();
      }
    }

    return obj;
  }

  function parseArray(): any[] {
    const arr: any[] = [];
    consume(); // consume '['

    while (pos < nbt.length) {
      skipFormatting();

      if (peek() === "]") {
        consume();
        break;
      }

      const value = parseValue();
      arr.push(value);

      skipFormatting();

      if (peek() === ",") {
        consume();
      }
    }

    return arr;
  }

  function parseKey(): string {
    let key = "";

    while (pos < nbt.length) {
      const char = peek();
      if (char === ":" || char === "§" || char === " ") {
        break;
      }
      key += consume();
    }

    return key.trim();
  }

  function parseString(): string {
    let result = "";
    consume(); // consume opening quote

    while (pos < nbt.length) {
      const char = peek();
      if (char === '"') {
        // Check if this is truly the end by looking ahead
        let tempPos = pos + 1;
        // Skip any color codes after the quote
        while (
          tempPos < nbt.length &&
          nbt[tempPos] === "§" &&
          tempPos + 1 < nbt.length
        ) {
          tempPos += 2;
        }
        // If we hit a structural character, this is the end of the string
        if (
          tempPos >= nbt.length ||
          nbt[tempPos] === "," ||
          nbt[tempPos] === "}" ||
          nbt[tempPos] === "]"
        ) {
          consume(); // consume closing quote
          break;
        } else {
          result += consume();
        }
      } else {
        result += consume();
      }
    }

    return result;
  }

  function parsePrimitive(): any {
    let value = "";

    while (pos < nbt.length) {
      const char = peek();
      if (char === "," || char === "}" || char === "]" || char === "§") {
        break;
      }
      value += consume();
    }

    value = value.trim();

    // Handle NBT type suffixes
    if (value.endsWith("b")) {
      const num = parseInt(value.slice(0, -1));
      return num === 1 ? true : num === 0 ? false : num;
    } else if (value.endsWith("s")) {
      return parseInt(value.slice(0, -1));
    } else if (value.endsWith("L")) {
      // Parse as Number instead of BigInt for compatibility
      return Number(value.slice(0, -1));
    } else if (value.endsWith("f")) {
      return parseFloat(value.slice(0, -1));
    } else if (value.endsWith("d")) {
      return parseFloat(value.slice(0, -1));
    } else if (!isNaN(Number(value)) && value !== "") {
      return Number(value);
    }

    return value;
  }

  try {
    return parseValue();
  } catch (error) {
    console.error("Failed to parse NBT:", error);
    return null;
  }
}
