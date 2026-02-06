import { ComponentPropsWithoutRef, memo } from "react";

type ButtonProps = ComponentPropsWithoutRef<"button">;
type AnchorProps = ComponentPropsWithoutRef<"a">;

type LinkProps = { mode: "link"; href: string } & AnchorProps;
type ButtonLikeProps = {
  mode: "outline" | "default" | "custom";
  href?: never;
} & ButtonProps;

type CustomButtonProps = LinkProps | ButtonLikeProps;

const DEFAULT_CLASS_NAME =
  "relative inline-flex items-center justify-center rounded-xl min-w-24 px-5 py-3 font-semibold text-white bg-[color:var(--accent)] shadow-[0_10px_24px_rgba(0,0,0,0.25)] transition-colors duration-200 hover:bg-[color:var(--accent-strong)] disabled:opacity-60 disabled:cursor-not-allowed";

const OUTLINE_CLASS_NAME =
  "inline-flex items-center justify-center rounded-xl min-w-24 px-5 py-3 border border-[color:var(--stroke)] text-[color:var(--text)] bg-transparent transition-colors duration-200 hover:bg-white/5 disabled:opacity-60 disabled:cursor-not-allowed";

const LINK_CLASS_NAME =
  "text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors";

const isLinkProps = (props: CustomButtonProps): props is LinkProps =>
  props.mode === "link";

export const CustomButton = memo((props: CustomButtonProps) => {
  if (isLinkProps(props)) {
    const { children, className = "", href, ...rest } = props;
    return (
      <a
        className={LINK_CLASS_NAME + " " + className}
        href={href}
        target="_blank"
        rel="noreferrer"
        {...(rest as AnchorProps)}
      >
        {children}
      </a>
    );
  }

  const { mode, children, className = "", ...rest } = props;
  switch (mode) {
    case "custom":
      return (
        <button className={className} {...(rest as ButtonProps)}>
          {children}
        </button>
      );
    case "outline":
      return (
        <button
          className={OUTLINE_CLASS_NAME + " " + className}
          {...(rest as ButtonProps)}
        >
          {children}
        </button>
      );
    default:
      return (
        <button
          className={DEFAULT_CLASS_NAME + " " + className}
          {...(rest as ButtonProps)}
        >
          {children}
        </button>
      );
  }
});
