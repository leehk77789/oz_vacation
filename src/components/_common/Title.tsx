import { twMerge } from "tailwind-merge";

interface TitleProps {
  className?: string;
  children: React.ReactNode;
}

const Default_Class_Name =
  "text-2xl md:text-3xl font-semibold tracking-tight text-[color:var(--text)]";

export const Title = ({ className, children }: TitleProps) => {
  return <h1 className={twMerge(Default_Class_Name, className)}>{children}</h1>;
};
