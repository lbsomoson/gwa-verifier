import React from "react";
import Axios from 'axios';
import {Navigate} from 'react-router-dom';
import Cookies from "universal-cookie";

import styles from './Login.module.css';

class Login extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            username1: "",
            password1: "",
            loggedIn: 0     //set to 1 when the user is logged in
        }

        this.updateUsername = this.updateUsername.bind(this)
        this.updatePassword = this.updatePassword.bind(this)
        this.loginUser = this.loginUser.bind(this)
        this.addActivity = this.addActivity.bind(this)
        
    }
    componentDidMount(){
        window.localStorage.setItem("loggedIn","false")
    }
    updateUsername(e){ //stores the value inputted in the username field
        this.setState({username1: e.target.value})
    }
    updatePassword(e){  //stores the value inputted in the password field
        this.setState({password1: e.target.value})
    }

    addActivity(){
        Axios.post("http://localhost:3001/addActivity",
        {username: this.state.username1, action: "logged in"}).then((response) => {
            console.log(response)
        })
    }

    loginUser(){ //sends to the back end the values placed in the input fields
        console.log('Attempting Login . . .');
        Axios.post("http://localhost:3001/loginUser",
        {username: this.state.username1,
        password: this.state.password1}).then((response) => {
            console.log(response)
            if(response.data.msg){  // if user with given username AND password not found
                //console.log("not logged in")
                alert("User not logged in")
                window.location.reload(false)  //reload
            }else{  // if user found in database
                console.log("logged in") 
                console.log(response.data.username)
                window.localStorage.setItem("user",response.data.username) //uses local storage so that the Main page could access the username of the user 
                this.setState({loggedIn: 1})
                window.localStorage.setItem("loggedIn","true")


                const cookies = new Cookies();
                cookies.set(
                    "authToken",
                    response.data.token,
                    {
                        path: "localhost:3001/",
                        age: 60*60,
                        sameSite: "lax"
                });
                this.addActivity();

                
            }
        })
        console.log('Attempting to Test . . .');
    }

    render(){
        if(this.state.loggedIn === 1){   //redirects to the Main Page when the user is logged in
            return <Navigate to="/Main" />
        }else{

            return(
                <div className={styles.LoginMain}>
                <div className={styles.Login}>
                    <h1 className={styles.h1Style}>GWA Verifier</h1>  
                    <input 
                        className={styles.LogInElement} 
                        type="text" 
                        placeholder="Username" 
                        onChange={this.updateUsername}
                    />
                    <input 
                        className={styles.LogInElement} 
                        type="password" 
                        placeholder="Password" 
                        onChange={this.updatePassword}
                    />

                    <button 
                        className={`button-text ${styles.LogInButton}`} 
                        onClick={this.loginUser}
                    >LOGIN</button>

                </div>
                </div>
        )
        }
    }
}
export default Login