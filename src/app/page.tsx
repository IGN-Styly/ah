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
  let user = useQuery(api.auth.getCurrentUser);

  return (
    <div className="">
      <Navbar></Navbar>
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 flex  justify-center flex-col items-center">
          <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
            <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
              <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold">
                Auction House
              </h1>
              <p className="max-w-[45rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                AuctionHouse is a reactive realtime application that allows the
                exchange of NBT Items in an open market for coins.
              </p>
              <div className="space-x-4">
                <Link
                  href={user ? "/dashboard" : "/signin"}
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

          <section
            id="features"
            className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24 "
          >
            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
              <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                Features
              </h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                This project is an experiment using modern technologies to see
                what how fast an MVP can be built using the BENTO Stack.
              </p>
            </div>
            <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
              <div className="relative overflow-hidden rounded-none border bg-background p-2">
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <svg viewBox="0 0 24 24" className="h-12 w-12 fill-current">
                    <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z" />
                  </svg>
                  <div className="space-y-2">
                    <h3 className="font-bold">Next.js</h3>
                    <p className="text-sm text-muted-foreground">
                      App dir, Routing, Layouts, Loading UI and API routes.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-none border bg-background p-2">
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <svg viewBox="0 0 24 24" className="h-12 w-12 fill-current">
                    <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38a2.167 2.167 0 0 0-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44a23.476 23.476 0 0 0-3.107-.534A23.892 23.892 0 0 0 12.769 4.7c1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442a22.73 22.73 0 0 0-3.113.538 15.02 15.02 0 0 1-.254-1.42c-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87a25.64 25.64 0 0 1-4.412.005 26.64 26.64 0 0 1-1.183-1.86c-.372-.64-.71-1.29-1.018-1.946a25.17 25.17 0 0 1 1.013-1.954c.38-.66.773-1.286 1.18-1.868A25.245 25.245 0 0 1 12 8.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933a25.952 25.952 0 0 0-1.345-2.32zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493a23.966 23.966 0 0 0-1.1-2.98c.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98a23.142 23.142 0 0 0-1.086 2.964c-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39a25.819 25.819 0 0 0 1.341-2.338zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143a22.005 22.005 0 0 1-2.006-.386c.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295a1.185 1.185 0 0 1-.553-.132c-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" />
                  </svg>
                  <div className="space-y-2">
                    <h3 className="font-bold">React 19</h3>
                    <p className="text-sm">
                      Server and Client Components. Use hook.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-none border bg-background p-2">
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <svg viewBox="0 0 24 24" className="h-12 w-12 fill-current">
                    <path d="M0 12C0 5.373 5.373 0 12 0c4.873 0 9.067 2.904 10.947 7.077l-15.87 15.87a11.981 11.981 0 0 1-1.935-1.099L14.99 12H12l-8.485 8.485A11.962 11.962 0 0 1 0 12Zm12.004 12L24 12.004C23.998 18.628 18.628 23.998 12.004 24Z" />
                  </svg>
                  <div className="space-y-2">
                    <h3 className="font-bold">Database</h3>
                    <p className="text-sm text-muted-foreground">
                      Convex Allowing for realtime interactions.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-none border bg-background p-2">
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <svg viewBox="0 0 24 24" className="h-12 w-12 fill-current">
                    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
                  </svg>
                  <div className="space-y-2">
                    <h3 className="font-bold">Components</h3>
                    <p className="text-sm text-muted-foreground">
                      UI components built using Radix UI and styled with
                      Tailwind CSS.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-none border bg-background p-2">
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="h-12 w-12 fill-current"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  <div className="space-y-2">
                    <h3 className="font-bold">Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      Authentication using BetterAuth and Layouts
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-none border bg-background p-2">
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                    className="h-12 w-12 fill-current"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      d="M165.735 25.07 188.947.972H.466V25.07h165.269Z"
                      clipRule="evenodd"
                    />
                    <path d="m163.981 96.324 90.041-92.64-32.816-.001-75.589 77.078 18.364 15.563ZM233.658 131.418c0 23.657-19.178 42.836-42.835 42.836-19.108 0-35.31-12.516-40.823-29.815l-3.375-10.591-19.296 19.295 1.763 4.193c10.123 24.085 33.942 41.018 61.731 41.018 36.968 0 66.936-29.968 66.936-66.936 0-24.481-13.36-45.678-32.803-57.328l-4.561-2.732-17.668 17.895 8.061 4.255c13.615 7.188 22.87 21.473 22.87 37.91Z" />
                    <path
                      fillRule="evenodd"
                      d="M88.263 192.669V45.646H64.165v147.023h24.097Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="space-y-2">
                    <h3 className="font-bold">Env</h3>
                    <p className="text-sm text-muted-foreground">
                      T3 Env for easy Environment variable management.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
