import React from 'react';
import styles from '../styles/header.module.css';

const Header = function () {
  return (
    <header
      className={styles["header-layout"]} >
      <div
        className={styles["header-name"]} >
        <h1>
          Azure IoT Expense Estimator
        </h1>
      </div>
    </header>
  );
};

export default Header;
