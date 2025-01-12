import type { FC, ReactNode } from "react";
import styles from "./index.module.less";

export const DemoDescription: FC<{
  content?: ReactNode;
  children?: ReactNode;
}> = (props) => {
  return (
    <div className={styles.demoDescription}>
      {props.content || props.children}
    </div>
  );
};
