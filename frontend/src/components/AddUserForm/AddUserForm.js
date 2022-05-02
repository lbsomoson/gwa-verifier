import Axios from 'axios';
import React from "react";

import styles from './AddUserForm.module.css';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';


class AddUserForm extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            userType: "",
            userName: "",
            userPassword: "",
            userRePassword: ""
        }

        this.getType = this.getType.bind(this);
        this.getUserName = this.getUserName.bind(this);
        this.getPassword =this.getPassword.bind(this);
        this.getRePassword = this.getRePassword.bind(this);
        this.addUser = this.addUser.bind(this);
        this.addUserPostFunc = this.addUserPostFunc.bind(this);
        this.getUser = this.getUser.bind(this);
        
    }


    getType(e){
        this.setState({userType: e});
    }
    getUserName(e){
        this.setState({userName : e.target.value});
    }
    getPassword(e){
        this.setState({userPassword: e.target.value});
    }
    getRePassword(e){
        this.setState({userRePassword: e.target.value});
    }

    getUser(user){

        console.log("checking if user exists already");
        Axios.post("http://localhost:3001/findUser",
        {username: user}).then((response) => {
            if(response.data.msg){
                console.log("not found on record");
                
            }else{
                console.log("found on record");
                
            }
            
        })
    }

    addUser(){
        console.log(this.state.userName);
        if(this.state.userName.length > 0){
            if (this.state.userPassword.length > 0){
                if(this.state.userPassword === this.state.userRePassword){
                    if(this.state.userType !== ""){
                        this.addUserPostFunc()
                    }else{
                        alert("Select User Type");
                    }
                
                }else{
                    alert("Passwords are different");
                }

            }else{
                alert("Add a password");
            }
        

        }else{
            alert("ADD USER NAME");
        }

        /*
        console.log("username: "+this.state.userName);
        console.log("password: "+this.state.userPassword);
        console.log("type: "+this.state.userType);
        */
    }

    addUserPostFunc(){

        Axios.post("http://localhost:3001/addUser",
        {username: this.state.userName, userpassword: this.state.userPassword, usertype: this.state.userType}).then((response) => {
            if(response.data.success){
                alert("user: "+response.data.username+" added");
                this.props.addUserFunc();
            }
        })
    }



    render(){
        return (
            <div className={styles.container}>
                <button className={styles.button1} onClick={this.props.addUserFunc}>Close</button> <br/>
                <input 
                    className={styles.LogInElement} 
                    type="text" 
                    placeholder="Username" 
                    onChange={this.getUserName}
                /> <br/>
                <input 
                    className={styles.LogInElement} 
                    type="password" 
                    placeholder="Password"
                    onChange={this.getPassword} 
                    
                /> <br/>

                <input 
                    className={styles.LogInElement} 
                    type="password" 
                    placeholder="Enter Password Again" 
                    onChange={this.getRePassword}
                    
                /> <br/>
                
                <Dropdown className="mt-4" onSelect={this.getType}>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        User Type
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item eventKey="admin">Admin</Dropdown.Item>
                        <Dropdown.Item eventKey="member">Member</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                

                <button 
                    className={`button-text ${styles.LogInButton}`} 
                    onClick={this.addUser}
                >LOGIN</button>

        
            </div>
        )
    }
}

export default AddUserForm;