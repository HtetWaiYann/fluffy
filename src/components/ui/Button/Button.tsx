import clsx from "clsx";
import type { ReactNode } from "react";
import styles from "./Button.module.scss";

type ButtonProps = {
  children: ReactNode;
  className?: string;
};

export function Button({ children, className }: ButtonProps) {
  return (
    <button type="button" className={clsx(styles.button, className)}>
      {children}
    </button>
  );
}
