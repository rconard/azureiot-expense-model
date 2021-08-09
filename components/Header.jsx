import React from 'react';
import styles from '../styles/header.module.css';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const {
    } = this.state;

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
  }
}

export async function getStaticProps(context) {
  return {
    props: {
    },
  };
};

export default Header;
