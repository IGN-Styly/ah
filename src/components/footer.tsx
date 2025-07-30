import AppConfig from "@/lib/config";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="relative flex w-full flex-col items-center gap-16 overflow-hidden border-t border-border bg-background px-4 py-12 text-foreground lg:p-24"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container flex w-full flex-col items-start justify-between gap-12">
        {/* Title and Description */}
        <section
          className="flex w-full flex-col gap-4 text-center lg:w-1/2 lg:text-left"
          aria-labelledby="footer-title"
        >
          <Link href="/">
            <h1
              id="footer-title"
              className="text-4xl font-bold text-foreground hover:text-muted-foreground"
            >
              Auction House
            </h1>
          </Link>
          <p className="mx-auto max-w-xl text-muted-foreground lg:mx-0">
            AuctionHouse is a reactive realtime application that allows the
            exchange of NBT Items in an open market for coins.
          </p>
        </section>

        {/* Navigation Links */}
        <section
          className="grid w-full max-w-5xl place-items-center gap-12 text-center sm:text-left"
          aria-label="Footer navigation and links"
        >
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:w-full">
            {/* Follow Us Section */}
            <section
              className="flex flex-col items-center gap-2 sm:items-start"
              aria-labelledby="follow-us-heading"
            >
              <h2 id="follow-us-heading" className="text-base font-semibold">
                Follow Us
              </h2>
              <div className="flex gap-4">
                <Link
                  href={AppConfig.GITHUB}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="GitHub"
                >
                  GitHub
                </Link>
              </div>
            </section>

            {/* About Us Section */}
            <section
              className="flex flex-col gap-2"
              aria-labelledby="about-us-heading"
            >
              <h2 id="about-us-heading" className="text-base font-semibold">
                About Us
              </h2>
              <nav aria-label="About navigation">
                <ul className="grid gap-2">
                  <li>
                    <Link
                      href="/about"
                      className="font-normal text-muted-foreground hover:text-foreground"
                    >
                      Team and Contributors
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="font-normal text-muted-foreground hover:text-foreground"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/pricing"
                      className="font-normal text-muted-foreground hover:text-foreground"
                    >
                      Pricing
                    </Link>
                  </li>
                </ul>
              </nav>
            </section>

            {/* Get Started Section */}
          </div>
        </section>

        {/* Copyright Information */}
        <section
          className="grid w-full grid-cols-[1fr_auto] items-center gap-2"
          aria-label="Copyright information"
        >
          <p className="flex justify-center gap-2 text-muted-foreground lg:justify-start">
            Made with ❤️ by @ign-styly
          </p>
        </section>
      </div>
    </footer>
  );
}
