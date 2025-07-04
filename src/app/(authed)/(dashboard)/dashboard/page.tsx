"use client";
import AuctionGrid from "@/components/auction-grid";
import { AuctionSidebar } from "@/components/auction-sidebar";
import Navbar from "@/components/navbar";
import { Card } from "@/components/ui/card";

import { authClient } from "@/lib/auth-client";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";

export default function Home() {
  let user = useQuery(api.auth.getCurrentUser);

  return (
    <div className=" ">
      <Navbar></Navbar>
      <main className="flex flex-col px-6 py-8">
        <Card className="rounded-none"></Card>
        <div className="flex">
          <AuctionSidebar />
          <div className="container mx-auto">
            <AuctionGrid />
          </div>
        </div>
      </main>
    </div>
  );
}
