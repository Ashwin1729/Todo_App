import React from "react";
import styles from "./Header.module.css";
import logo from "../assets/algobulls_logo.png";

const Header = () => {
  return (
    <div className={styles.header}>
      <img src={logo} alt="AlgoBulls_Logo" />
    </div>
  );
};

export default Header;
