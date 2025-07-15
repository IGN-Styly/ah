// Centralized price formatting and parsing utilities for AuctionHouse

/**
 * Formats a price value into a human-readable string with suffixes.
 * Examples: 1200 => "1.20k", 2500000 => "2.50m", 1000000000 => "1.00b"
 * @param price - The price value to format.
 * @param decimals - Number of decimal places (default: 2).
 */
export function formatPrice(price: number, decimals: number = 2): string {
  if (price >= 1_000_000_000)
    return `${(price / 1_000_000_000).toFixed(decimals)}b`;
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(decimals)}m`;
  if (price >= 1_000) return `${(price / 1_000).toFixed(decimals)}k`;
  return price.toFixed(decimals);
}

/**
 * Formats a number as a currency string.
 * Examples: 1200 => "$1,200.00"
 * @param amount - The amount to format.
 * @param currency - The currency code (default: "USD").
 * @param decimals - Number of decimal places (default: 2).
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  decimals: number = 2,
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Parses a price string with optional suffixes (k, m, b) into a number.
 * Examples: "1.2k" => 1200, "2.5m" => 2500000, "1b" => 1000000000
 * @param value - The string to parse.
 * @returns The numeric value, or null if invalid.
 */
export function parsePrice(value: string | null): number | null {
  if (!value) return null;
  const numericPart = parseFloat(value);
  if (isNaN(numericPart)) return null;
  const unit = value.trim().slice(-1).toLowerCase();
  switch (unit) {
    case "k":
      return numericPart * 1_000;
    case "m":
      return numericPart * 1_000_000;
    case "b":
      return numericPart * 1_000_000_000;
    default:
      return numericPart;
  }
}
