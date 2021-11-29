import React from 'react';
import styles from '../styles/header.module.css';

const Header = function () {
  return (
    <header
      className={styles["header-layout"]} >
      <div
        className={styles["header-name"]} >
        <h1
          className={styles["seo-title"]} >
          ICED T
        </h1>
        <h2
          className={styles["subtitle"]} >
          IoT Cost Estimator and Diagram Tool
        </h2>
      </div>
    </header>
  );
};

export default Header;
