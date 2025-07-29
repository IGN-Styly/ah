import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { getToken } from "@convex-dev/better-auth/nextjs";
import { api } from "@convex/_generated/api";
import { createAuth } from "@convex/auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const token = await getToken(createAuth);
  if (token) {
    return (
      <>
        <Toaster />
        {children}
        <Footer />
      </>
    );
  } else {
    return redirect("/signin");
  }
};
export default layout;
