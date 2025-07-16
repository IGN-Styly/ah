"use client";
import { Button } from "@/components/ui/button";
import { Apple, Landmark, User } from "lucide-react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";
import { ModeToggle } from "./theme";
import { redirect, useRouter } from "next/navigation";
import { Avatar, AvatarImage } from "./ui/avatar";
import { formatPriceBNK } from "@/lib/price";

export default function Navbar() {
  let user = useQuery(api.auth.getCurrentUser);
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === undefined;
  let route = useRouter();
  return (
    <nav className="sticky z-50 px-6 py-4 top-0">
      <div
        className={`mx-auto rounded-2xl px-6 backdrop-blur-[5px] h-[76px] ${
          isDark
            ? "bg-[linear-gradient(137deg,rgba(17,18,20,.75)_4.87%,rgba(12,13,15,.9)_75.88%)]"
            : "bg-[linear-gradient(137deg,rgba(240,240,245,.85)_4.87%,rgba(255,255,255,.95)_75.88%)]"
        }`}
        style={{
          border: isDark
            ? "1px solid var(--Card-Border,hsla(0,0%,100%,.06))"
            : "1px solid var(--Card-Border,hsla(0,0%,0%,.1))",
          boxShadow: isDark
            ? "inset 0 1px 1px 0 hsla(0,0%,100%,.15)"
            : "inset 0 1px 1px 0 hsla(0,0%,0%,.05)",
          maxWidth: "var(--container-width, 1204px)",
        }}
      >
        <div className="flex items-center justify-between h-full">
          <Link href={"/"} className="flex items-center space-x-3">
            <Landmark className={isDark ? "text-white" : "text-gray-800"} />
            <span
              className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-800"}`}
            >
              Auction House
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-8 text-[14px]  text-center flex-1  justify-center-safe">
            <Link href="#">About</Link>
            <Link href="#">Pricing</Link>
            <Link href="#">Changelog</Link>
          </div>

          <div className="flex items-center space-x-4">
            {!user ? (
              <Link href="/signin">
                <Button>Sign In</Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    <User />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    <div className="flex-row flex gap-2 items-center">
                      <Avatar>
                        <AvatarImage src={user.image}></AvatarImage>
                      </Avatar>
                      @{user?.name}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>
                    <div className="flex-row flex gap-2 items-center">
                      Purse: ${formatPriceBNK(user.balance as number)}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      redirect("/inventory");
                    }}
                  >
                    Inventory
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      redirect("/myauctions");
                    }}
                  >
                    My auctions
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      await authClient.signOut();
                      route.refresh();
                    }}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
