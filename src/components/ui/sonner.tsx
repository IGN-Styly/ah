"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      toastOptions={{ style: { borderRadius: 0, borderWidth: 4 } }}
      theme={theme as ToasterProps["theme"]}
      className="toaster group rounded-none"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      richColors={true}
      {...props}
    />
  );
};

export { Toaster };
