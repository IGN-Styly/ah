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

export default function Home() {
  let user = useQuery(api.auth.getCurrentUser);
  if (user) {
    redirect("/dashboard");
  }
  return (
    <div className=" ">
      <Navbar></Navbar>
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 flex flex-box justify-center">
          <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
            <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
              <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold">
                Auction House
              </h1>
              <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                AuctionHouse is a reactive realtime application that allows the
                exchange of NBT Items in an open market for coins.
              </p>
              <div className="space-x-4">
                <Link
                  href="/signin"
                  className={cn(buttonVariants({ size: "lg" }), "rounded-none")}
                >
                  Get Started
                </Link>
                <Link
                  href={AppConfig.GITHUB}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "rounded-none",
                  )}
                >
                  GitHub
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
