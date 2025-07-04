"use client";
import AuctionGrid, { AuctionGridProps } from "@/components/auction-grid";
import Navbar from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, ArrowDownUp } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  let user = useQuery(api.auth.getCurrentUser);
  const [listingType, setListingType] = useState("all");
  const [sortBy, setSortBy] = useState("soon");
  type CategoryKey =
    | "weapons"
    | "armor"
    | "accessories"
    | "consumables"
    | "blocks"
    | "tools"
    | "misc"
    | "all";

  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // This would typically come from your API or data source

  let propsf: AuctionGridProps = {
    filter: {
      categories: selectedCategory,
      sort: sortBy as "highlow" | "lowhigh" | "soon" | "new" | "bids",
      listingType: listingType as "bin" | "bid" | "all",
      search: searchQuery,
    },
  };
  return (
    <div className=" ">
      <Navbar />
      <main className="flex flex-col px-6 py-8">
        <Card className="rounded-none p-4 ">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Marketplace</h2>
              <div className="flex items-center space-x-2 ">
                <div className="relative w-xl">
                  <Input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-none"
                  />
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>
                <div className="w-48">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="rounded-none">
                      <div className="flex items-center gap-2">
                        <ArrowDownUp className="h-4 w-4" />
                        <SelectValue placeholder="Sort by" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="highlow">Highest Price</SelectItem>
                      <SelectItem value="lowhigh">Lowest Price</SelectItem>
                      <SelectItem value="soon">Ending Soon</SelectItem>
                      <SelectItem value="new">Newest</SelectItem>
                      <SelectItem value="bids">Most Bids</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <div className="flex">
          <div className="mt-4">
            <Card className="min-w-[240px] p-4 rounded-none">
              <h3 className="text-lg font-semibold">Filters</h3>

              <div className="space-y-4">
                {/* Listing Type Filter */}
                <div>
                  <h4 className="font-medium mb-2">Listing Type</h4>
                  <RadioGroup
                    defaultValue="all"
                    value={listingType}
                    onValueChange={setListingType}
                    className="space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all">Show All</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bin" id="bin" />
                      <Label htmlFor="bin">Buy It Now Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="auctions" id="auctions" />
                      <Label htmlFor="auctions">Auctions Only</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Categories */}
                <div>
                  <h4 className="font-medium mb-2">Categories</h4>
                  <RadioGroup
                    value={selectedCategory}
                    onValueChange={(value) =>
                      setSelectedCategory(value as CategoryKey)
                    }
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="category-all" />
                      <Label htmlFor="category-all">All Categories</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weapons" id="category-weapons" />
                      <Label htmlFor="category-weapons">Weapons</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="armor" id="category-armor" />
                      <Label htmlFor="category-armor">Armor</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="accessories"
                        id="category-accessories"
                      />
                      <Label htmlFor="category-accessories">Accessories</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="consumables"
                        id="category-consumables"
                      />
                      <Label htmlFor="category-consumables">Consumables</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="blocks" id="category-blocks" />
                      <Label htmlFor="category-blocks">Blocks</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tools" id="category-tools" />
                      <Label htmlFor="category-tools">Tools & Equipment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="equipment"
                        id="category-equipment"
                      />
                      <Label htmlFor="category-equipment">Equipment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="misc" id="category-misc" />
                      <Label htmlFor="category-misc">Miscellaneous</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </Card>
          </div>
          <div className="flex-1">
            <div className="mb-4">
              <AuctionGrid filter={propsf.filter} className="mt-4" />
            </div>
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {[...Array(Math.min(5, totalPages))].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {totalPages > 5 && (
                    <>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setCurrentPage(totalPages)}
                          isActive={currentPage === totalPages}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
