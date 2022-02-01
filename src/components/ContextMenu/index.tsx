import React from "react";

import styles from "./index.module.css";

type Action = {
  name: string;
  danger: boolean;
  handler: () => void;
};

type Props = {
  actions: Action[];
  onClose: () => void;
  x: number;
  y: number;
  z: number;
};

export default function ContextMenu({
  actions,
  onClose,
  x = 0,
  y = 0,
  z = 2,
}: Props) {
  return (
    <div style={{ top: x, left: y, zIndex: z }} className={styles.contextMenu}>
      {actions.map((action, i) =>
        action.danger ? (
          <div
            className={styles.contextMenuItemDanger}
            onClick={action.handler}
            key={action.name + i}
          >
            {action.name}
          </div>
        ) : (
          <div
            className={styles.contextMenuItem}
            onClick={action.handler}
            key={action.name + i}
          >
            {action.name}
          </div>
        )
      )}
      <div className={styles.contextMenuItem} onClick={onClose}>
        Close
      </div>
    </div>
  );
}
