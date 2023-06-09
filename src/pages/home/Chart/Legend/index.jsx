import React from "react";

import { VARIETY_COLOR_MAPPING } from "../../constants.js";
import styles from "./index.module.css";

const Legend = () => {
  return (
    <div className={styles.container}>
      {Object.entries(VARIETY_COLOR_MAPPING).map(([key, value]) => (
        <span key={key} style={{ color: value }}>
          {key}
        </span>
      ))}
    </div>
  );
};

export default Legend;
