import { Clock } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";

export const LoadingCard = () => {
  return (
    <Card className="w-full overflow-hidden rounded-none group transition-all duration-200 py-1">
      <div className="relative -mt-1">
        <div className="cursor-pointer">
          <Skeleton className="w-full aspect-square object-cover border-b-2 border-border rounded-none"></Skeleton>

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>

        {/* Listing type badge */}
      </div>
      <CardContent className="p-3 space-y-3">
        <h3 className="font-semibold text-sm leading-tight uppercase tracking-wider text-center line-clamp-2">
          Loading
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted p-2 border rounded-none text-center">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              BID
            </span>
            <div className="font-semibold text-base text-primary">
              <Skeleton>Loading</Skeleton>
            </div>
          </div>
          <div className="bg-muted p-2 border rounded-none text-center">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              BIN
            </span>
            <div className="font-semibold text-base text-primary">
              <Skeleton>Loading</Skeleton>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs bg-muted p-2 border rounded-none">
          <div className="flex items-center gap-1" title={`Ends`}>
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className={`font-semibold uppercase tracking-wider`}>
              <Skeleton>Loading</Skeleton>
            </span>
          </div>
          <span className="font-semibold uppercase tracking-wider flex">
            <Skeleton className="mr-1">...</Skeleton> BIDS
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 rounded-none text-sm font-mono font-black"
          >
            <Skeleton className="bg-transparent">Loading</Skeleton>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
