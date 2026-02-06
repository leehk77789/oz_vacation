import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface DescriptionProps extends PropsWithChildren {
  className?: string;
}

export const Description = ({ children, className = "" }: DescriptionProps) => {
  return (
    <p
      className={twMerge(
        "text-sm font-normal text-[color:var(--muted)] pb-6",
        className
      )}
    >
      {children}
    </p>
  );
};
