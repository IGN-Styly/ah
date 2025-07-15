"use client";
import AuctionGrid from "@/components/auction-grid";
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
import { cn } from "@/lib/utils";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { Landmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SigninPage() {
  let user = useQuery(api.auth.getCurrentUser);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
          "z-[-100]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

      <div className="absolute top-0 left-0">
        <Link href={"/"} className="flex items-center space-x-3 m-12">
          <Landmark />
          <span className="text-xl font-semibold">Auction House</span>
        </Link>
      </div>
      <div className="w-full max-w-md m-12">
        <SignIn />
      </div>
    </div>
  );
}
