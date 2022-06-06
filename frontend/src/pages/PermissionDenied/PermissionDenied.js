import React from 'react';
import { NavBar } from '../../components';
import { VscWarning } from 'react-icons/vsc';
import styles from "./PermissionDenied.module.css";

class PermissionDenied extends React.Component {

  render() {
    return(
      <div>
        <NavBar />
        <div className={styles.container}>
          <div className={styles.title}>
            Access Denied
          </div>
          <div className={styles.body}>
            <div>
              <VscWarning size={70} color="red"/>
            </div>
            <div className={styles.message}>
              <div>
                Oops... You do not have permission to access this page.<br/>
              </div>
              <div>
                <a href="http://localhost:3000/Main">Click Here</a> to go back to the main page.
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default PermissionDenied;