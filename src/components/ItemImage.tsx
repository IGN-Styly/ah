import { cn } from "@/lib/utils";
import Image from "next/image";

export const ItemImage = ({
  ...props
}: {
  title: string;
  image: string;
  className?: string;
  border?: boolean;
  size?: number;
  classNameTop?: string;
}) => {
  return (
    <>
      <div
        className={
          props.border
            ? cn(
                "aspect-square object-cover border-2 border-border p-3",
                props.classNameTop,
              )
            : cn("border-b-2 border-border p-3 ", props.classNameTop)
        }
      >
        <Image
          src={props.image || "/placeholder.svg?height=200&width=200"}
          alt={props.title}
          width={props.size ? props.size : 200}
          height={props.size ? props.size : 200}
          style={{ imageRendering: "pixelated" }}
          className={cn("w-full aspect-square object-cover", props.className)}
        />
      </div>
    </>
  );
};
