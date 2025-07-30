"use client";
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
import { Search, ArrowDownUp, X } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import { useState } from "react";
import ItemGrid, { ItemGridProps } from "@/components/item-grid";

const InventoryPage = () => {
  let user = useQuery(api.auth.getCurrentUser);
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

  let propsf: ItemGridProps = {
    filter: {
      categories: selectedCategory,
      search: searchQuery,
    },
  };

  return (
    <div>
      <Navbar />
      <main className="flex flex-col px-6 py-8">
        <Card className="rounded-none p-4 ">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Inventory</h2>
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
                  <div className="absolute right-3 top-[25%] ">
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                      className="hover:bg-primary"
                    >
                      <X className="h-4 w-4 hover:text-background" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <div className="flex">
          <div className="mt-4">
            <Card className="min-w-[240px] p-4 rounded-none">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Separator />
              <div className="">
                <h4 className="font-medium mb-2.5">Categories</h4>
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
                    <RadioGroupItem value="equipment" id="category-equipment" />
                    <Label htmlFor="category-equipment">Equipment</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="misc" id="category-misc" />
                    <Label htmlFor="category-misc">Miscellaneous</Label>
                  </div>
                </RadioGroup>
              </div>
            </Card>
          </div>
          <div className="flex-1">
            <div className="mb-4">
              <ItemGrid filter={propsf.filter} className="mt-4" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default InventoryPage;
