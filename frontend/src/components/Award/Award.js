import React from 'react';
import styles from './Award.module.css';
import { IoMdTrophy } from 'react-icons/io';

class Award extends React.Component {

  render() {

    return(
      <div className={styles.container}>
        <div className={styles.inside}>
          <div className={styles.trophy}><IoMdTrophy size={40} /></div>
          <span className={styles.award}>{this.props.award}</span>
        </div>
      </div>
    )
  }
}

export default Award;