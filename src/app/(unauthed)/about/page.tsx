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
          <h1 className="text-3xl font-bold mb-4">About Us</h1>
          <div className="max-w-2xl text-left space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-2">Core Maintainer</h2>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  <span className="font-medium">@ign-styly</span> – Creator &
                  Sole Developer
                </li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">Contributors</h2>
              <p>
                This project is currently maintained solely by{" "}
                <span className="font-medium">@ign-styly</span>. Community
                contributions are welcome! If you would like to contribute, see
                below.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">Get Involved</h2>
              <p>
                This project is Free and Open Source Software (FOSS). Everyone
                is welcome to participate!
              </p>
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>Contribute code, documentation, or ideas</li>
                <li>Report bugs or request features</li>
                <li>Help with community support</li>
              </ul>
              <p className="mt-2">
                Check the repository for open issues and contribution
                guidelines. If you have questions or want to get involved,
                please start a thread in the repository's Discussions section
                rather than sending direct messages.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
