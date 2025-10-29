import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textVariants = cva("", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    color: {
      foreground: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      "primary-foreground": "text-primary-foreground",
      destructive: "text-destructive",
      success: "text-green-600",
      error: "text-red-600",
      secondary: "text-secondary-foreground/70",
    },
  },
  defaultVariants: {
    size: "base",
    weight: "normal",
    color: "foreground",
  },
});

interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div" | "label";
}

function Text({
  className,
  size,
  weight,
  color,
  as: Comp = "p",
  ...props
}: TextProps) {
  return (
    <Comp
      className={cn(textVariants({ size, weight, color, className }))}
      {...props}
    />
  );
}

export { Text };
