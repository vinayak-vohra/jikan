import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn, createTWClasses } from "@/lib/utils";
import { STATUS } from "@/features/tasks/tasks.types";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow",
        secondary: "border-transparent bg-secondary text-secondary-foreground ",
        admin: "bg-orange-200 text-orange-900 shadow-sm",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow",
        outline: "text-foreground",
        ...Object.values(STATUS).reduce(
          (acc, status) => ({
            ...acc,
            [status]: cn(
              createTWClasses(
                {
                  bg: 100,
                  text: 900,
                  border: 300,
                },
                status
              ),
              "shadow"
            ),
          }),
          {} as Record<STATUS, string>
        ),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
