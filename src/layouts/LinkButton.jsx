import React from "react";
import styles from "./LinkButton.module.css";
import { Link } from "react-router-dom";

const LinkButton = ({ to, text }) => {
  return (
    <div>
      <Link className={styles.btn} to={to}>
        {text}
      </Link>
    </div>
  );
};

export default LinkButton;
