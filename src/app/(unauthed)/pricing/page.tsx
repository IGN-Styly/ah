"use client";
import AuctionGrid from "@/components/auction-grid";
import Navbar from "@/components/navbar";
import { example, NBTDisplay, parseNBT } from "@/components/nbt";
import SignIn from "@/components/signIn";
import { ModeToggle } from "@/components/theme";
import { buttonVariants } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth-client";
import AppConfig from "@/lib/config";
import { cn } from "@/lib/utils";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="">
      <Navbar></Navbar>
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 flex justify-center flex-col items-center">
          <h1 className="text-4xl font-extrabold mb-4">AuctionHouse Fees</h1>
          <div className="max-w-2xl text-left space-y-4">
            <p>
              We believe in simple, transparent pricing. Here’s how fees work
              when you use our auction platform:
            </p>
            <h2 className="text-xl font-semibold mt-4">Listing Tax</h2>
            <ul className="list-disc list-inside ml-4">
              <li>
                When you list an item, you pay a{" "}
                <span className="font-bold">2.5% tax</span> up front, based on
                the higher of your starting bid or "Buy It Now" price.
              </li>
              <li>
                Example: Starting bid 1,000, Buy Now 2,000 → Tax: 2.5% of 2,000
                = 50
              </li>
              <li>
                The tax is taken immediately when you create the auction. If you
                don't have enough balance, you can't list the item.
              </li>
            </ul>
            <h2 className="text-xl font-semibold mt-4">BIN Tax</h2>
            <ul className="list-disc list-inside ml-4">
              <li>
                When you choose to buy it now, you pay a{" "}
                <span className="font-bold">2.5% tax</span>, based on the "Buy
                It Now" price of the item.
              </li>
              <li>Example: Buy Now 2,000 → Tax: 2.5% of 2,000 = 50</li>
              <li>The tax is taken immediately when you purchase the item.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-4">No Other Fees</h2>
            <p>
              You get the full winning bid when your item sells. There are no
              additional commissions or hidden charges.
            </p>
            <p className="text-muted-foreground text-sm">
              This listing tax and BIN tax helps support the platform and keep
              the marketplace running smoothly.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
