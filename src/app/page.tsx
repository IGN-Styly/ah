"use client";
import AuctionGrid from "@/components/auction-grid";
import Navbar from "@/components/navbar";
import { example, NBTDisplay, parseNBT } from "@/components/nbt";
import SignIn from "@/components/signIn";
import { ModeToggle } from "@/components/theme";
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
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            AuctionHouse
          </h1>
        </div>
        <SignIn />
        <AuctionGrid />
        <ModeToggle />
      </main>
    </div>
  );
}
