import React from "react";
import { Navigate } from "react-router";

import Cookies from "universal-cookie";

import BasicButton from "../BasicButton";
import styles from "./NavBar.module.css";
import { IoLogOutOutline } from 'react-icons/io5';

class NavBar extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      checkifLoggedin:false, 
      isLoggedin: false, 
      username: null, 
      userType: null,
    }

    this.renderMemberItems = this.renderMemberItems.bind(this);
    this.renderAdminItems = this.renderAdminItems.bind(this);
    this.logout = this.logout.bind(this);
  }

  renderMemberItems() {
    return(
      <>
        <a href="http://localhost:3000/Main"
        className={`paragraph ${styles.navbarItem}`}
        >
          Main
        </a>
      </>
    )
  }

  renderAdminItems() {
    return(
      <>
        <a 
          className={`paragraph ${styles.navbarItem}`}
					href="http://localhost:3000/Main"
        >
          Main
        </a>
        <a 
          className={`paragraph ${styles.navbarItem}`}
					href="http://localhost:3000/admin-dashboard"
        >
          Dashboard
        </a>
      </>
    )
  }

  componentDidMount() {
    fetch("http://localhost:3001/checkifloggedin", {
        method: "POST",
        credentials: "include",
      })
      .then(response => response.json())
      .then(body => {
        if(body.isLoggedin) {
          this.setState({
            checkifLoggedin:true, isLoggedin: true, username: body.username, userType: body.type
          });
        }else{
          this.setState({
            checkifLoggedin:true, isLoggedin: false
          });
        }
      });
  }

  logout(e) {
    e.preventDefault();

    const cookies = new Cookies();
    cookies.remove("authToken");

    localStorage.removeItem("user")

    this.setState({isLoggedin: false });
}

  render() {
    if(!this.state.checkifLoggedin){
      return (<div></div>)
    } else {
      if (this.state.isLoggedin) {
        return(
          <header className={styles.baseStyles}>
            <div className={styles.navBarContainer}>
                <div className={styles.navBarLeftItems}>
                  <div className={`paragraph ${styles.navbarItem}`}>SHAC</div>
                </div>
                <div className={styles.navbarRightItems}>
                  {
                    this.state.userType === "member" 
                      ? this.renderMemberItems()
                      : this.renderAdminItems()
                  }
                  <BasicButton 
                    color="white"
                    variant="filled"
                    size="small"
                    onClick={this.logout}
                    label="Logout"
                    icon={<IoLogOutOutline />}
                  />
                </div>
            </div>
          </header>
        )
      } else {
        return(
          <Navigate to="/" />
        )
      }
    }

  }
}

export default NavBar;