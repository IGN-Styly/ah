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
          <h1 className="text-4xl font-extrabold mb-4">Privacy Policy</h1>
          <div className="max-w-2xl text-left space-y-4">
            <p>
              Your privacy is important to us. This Privacy Policy explains how
              we collect, use, and protect your information when you use our
              website or services.
            </p>
            <h2 className="text-xl font-semibold mt-4">
              Information We Collect
            </h2>
            <ul className="list-disc list-inside ml-4">
              <li>
                Personal information you provide (such as your username, email
                discord id, or other contact details).
              </li>
              <li>
                Usage data (such as pages visited, time spent on the site, and
                other analytics).
              </li>
            </ul>
            <h2 className="text-xl font-semibold mt-4">
              How We Use Your Information
            </h2>
            <ul className="list-disc list-inside ml-4">
              <li>Provide and improve our services.</li>
              <li>Communicate with you about updates or offers.</li>
              <li>Analyze usage to enhance user experience.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-4">Information Sharing</h2>
            <p>
              We do not sell or share your personal information with third
              parties except as required by law.
            </p>
            <h2 className="text-xl font-semibold mt-4">Data Security</h2>
            <p>
              We take reasonable measures to protect your information from
              unauthorized access.
            </p>
            <h2 className="text-xl font-semibold mt-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us via github discussions.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
