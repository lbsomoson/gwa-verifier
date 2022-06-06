import React from "react";
import Axios from 'axios';
import { Navigate } from 'react-router-dom';
import Cookies from "universal-cookie";

import { InputLogin, BasicButton } from "../../components";
import styles from './Login.module.css';

class Login extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            username1: "",
            password1: "",
            loggedIn: 0,     //set to 1 when the user is logged in
            isUsernameEmpty: false,
            isPasswordEmpty: false,
            hasWrongCredentials: false,
        }

        this.loginUser = this.loginUser.bind(this)
        this.createFirstUser = this.createFirstUser.bind(this)
        this.addActivity = this.addActivity.bind(this)
        
    }
    componentDidMount(){
        window.localStorage.setItem("loggedIn","false")
        document.title = "Login";
    }

    createFirstUser(){  //creates the First User(Admin) if the users table in the database is empty
        Axios.get("http://localhost:3001/viewusers",
        ).then((response) => {
            if(response.data.length === 0){
                Axios.post("http://localhost:3001/signup",
                {username: "admin", userpassword: "password", usertype:"admin"}).then((response) => {
                    console.log("Added first User");
                })
            }else{
                console.log("User/s already exists.")
            }
        })
    }
    updateUsername(e){ //stores the value inputted in the username field
        this.setState({username1: e.target.value})
    }
    updatePassword(e){  //stores the value inputted in the password field
        this.setState({password1: e.target.value})
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value, 
            isUsernameEmpty: false, 
            isPasswordEmpty: false,
            hasWrongCredentials: false
        })
    }

    addActivity(){
        Axios.post("http://localhost:3001/addActivity",
        {username: this.state.username1, action: "logged in"}).then((response) => {
            console.log(response)
        })
    }

    loginUser(){ //sends to the back end the values placed in the input fields

        if (this.state.password1 === "" && this.state.username1 === "") {
            this.setState({ isPasswordEmpty: true, isUsernameEmpty: true })
        } else if (this.state.password1 === "") {
            this.setState({ isPasswordEmpty: true });
        } else if (this.state.username1 === "") {
            this.setState({ isUsernameEmpty: true});
        } else {
            Axios.post("http://localhost:3001/loginUser",
                {
                    username: this.state.username1,
                    password: this.state.password1
                })
                .then((response) => {
                    console.log(response)
                    if(response.data.msg){  // if user with given username AND password not found
                        this.setState({ hasWrongCredentials: true });
                    }else{  // if user found in database
                        window.localStorage.setItem("user", response.data.username) //uses local storage so that the Main page could access the username of the user 
                        window.localStorage.setItem("type", response.data.type)
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
        }
    }

    render(){
        if(this.state.loggedIn === 1){   //redirects to the Main Page when the user is logged in
            return <Navigate to="/Main" />
        }else{

            return(
                <div className={styles.container}>
                    <div className={styles.login}>
                        <img src="/images/uplb.png" alt="uplb-logo" className={styles.uplb}/>
                        <h5 className={styles.center}>Login</h5>
                        {
                            this.state.hasWrongCredentials && 
                            <span className={styles.errorMessage}>The login credentials you've entered are invalid.</span>
                        }
                        {
                            (this.state.isPasswordEmpty || this.state.isUsernameEmpty) &&
                            <span className={styles.errorMessage}>The login credentials are incomplete.</span>
                        }
                        <InputLogin 
                            label={"Username"}
                            type={"text"}
                            onChange={this.handleInputChange}
                            required
                            name={"username1"}
                        />
                        <InputLogin 
                            label={"Password"}
                            type={"password"}
                            onChange={this.handleInputChange}
                            required
                            name={"password1"}
                        />
                        <div className={styles.spacing}></div>
                        <BasicButton 
                            label = "Login"
                            onClick={this.loginUser} 
                            color="brand-primary" 
                            variant="filled"
                            size="default" 
                        />
                        <BasicButton 
                            label = "Setup"
                            onClick={this.createFirstUser} 
                            color="brand-secondary" 
                            variant="filled"
                            size="default" 
                        />
                    </div>
                    <div className={styles.color_overlay}></div>
                </div>
        )
        }
    }
}
export default Login