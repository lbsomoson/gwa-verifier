import Axios from 'axios';
import React from "react";

import { InputLogin, BasicButton } from '../../components';

import styles from './AddUserForm.module.css';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IoMdAdd } from "react-icons/io";


class AddUserForm extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            userType: "",
            userName: "",
            userPassword: "",
            userRePassword: "",
            show: false,
            isUsernameEmpty: false,
            isPasswordEmpty: false,
            isPasswordEmpty2: false,
            isMismatch: false,
            isAlreadyExists: false,
        }

        // this.getType = this.getType.bind(this);
        // this.getUserName = this.getUserName.bind(this);
        // this.getPassword =this.getPassword.bind(this);
        // this.getRePassword = this.getRePassword.bind(this);
        this.addUser = this.addUser.bind(this);
        this.addUserPostFunc = this.addUserPostFunc.bind(this);
        this.getUser = this.getUser.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }


    // getType(e){
    //     this.setState({userType: e});
    // }
    // getUserName(e){
    //     this.setState({userName : e.target.value});
    // }
    // getPassword(e){
    //     this.setState({userPassword: e.target.value});
    // }
    // getRePassword(e){
    //     this.setState({userRePassword: e.target.value});
    // }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
            isUsernameEmpty: false,
            isPasswordEmpty: false,
            isPasswordEmpty2: false,
            isMismatch: false,
            isAlreadyExists: false,
        });
        console.log(this.state);
    }


    getUser(){

        // console.log("checking if user exists already");
        // Axios.post("http://localhost:3001/findUser",
        // {username: user}).then((response) => {
        //     if(response.data.msg){
        //         console.log("not found on record");
                
        //     }else{
        //         console.log("found on record");
                
        //     }
            
        // })
        console.log(this.state.userName);
        console.log("checking if user exists already");
        return new Promise((resolve)=> {
            Axios.get("http://localhost:3001/finduser",
                {params: {username: this.state.userName}}).then( (response) => {
                    console.log(response)
                    
                        if(response.data.msg){
                                console.log("not found on record");
                                console.log("found will be set to TRUE");
                                resolve(true);
                        }else{
                                console.log("found on record");
                                console.log("found will be set to FALSE");
                                resolve(false);
                        }
                })

        })
    }

    async addUser(){
        const result =  await this.getUser();
        console.log(result);
        this.setState(this.setState({found: result}), () => {
        if(this.state.userName.length > 0){
            if(this.state.found === true){
                if (this.state.userPassword.length > 0){
                    if(this.state.userPassword === this.state.userRePassword){
                        if(this.state.userType !== ""){
                            //console.log("USER ADDED");
                            this.addUserPostFunc();
                            const str = "added new user: " + this.state.userName;
                            Axios.post("http://localhost:3001/addActivity",
                            {username: localStorage.getItem("user"), action: str}).then((response) => {
                                console.log(response)
                            })
                            
                        }else{
                            alert("Select User Type");
                            //console.log("Select user type");
                        }
                    
                    }else{
                        alert("Passwords are different");
                        //console.log("passwords are different")
                    }
                

                }else{
                    alert("Add a password");
                    //console.log("Add a password");
                }
            }else{
                alert("USER NOT ADDED, USER ALREADY EXISTS");
                //console.log("USER NOT ADDED, USER ALREADY EXISTS");
            }

        }else{
            alert("ADD USER NAME");
            //console.log("Add Username");
        }
        });
        
    }
    // if (this.state.userName === "") 
    // this.setState({ isUsernameEmpty: true });
    // if (this.state.userPassword === "") 
    // this.setState({ isPasswordEmpty: true });
    // if (this.state.userRePassword === "") 
    //     this.setState({ isPasswordEmpty2: true });
    // if (this.state.userType === "") 
    // this.setState({ isTypeEmpty: true });
    // if ((this.state.userPassword !== "" || this.state.userRePassword !== "") && this.state.userPassword !== this.state.userRePassword)
    //     this.setState({ isMismatch: true });
    
    // console.log(this.state);
    // const result =  await this.getUser();
    // console.log(result);

    // this.setState( this.setState({ found: result }), () => {
    //     if(!this.state.isUsernameEmpty && !this.state.isPasswordEmpty && !this.state.isPasswordEmpty2 && !this.state.isTypeEmpty && !this.state.isMismatch) {
    //         this.addUserPostFunc();
    //         const str = "added new user: " + this.state.userName;
    //         Axios.post("http://localhost:3001/addActivity",
    //         {username: localStorage.getItem("user"), action: str}).then((response) => {
    //             console.log(response)
    //         })
    //     }
    // })

    addUserPostFunc(){

        Axios.post("http://localhost:3001/signup",
        {username: this.state.userName, userpassword: this.state.userPassword, usertype: this.state.userType}).then((response) => {
            console.log(response)
            if (response.data === "Successfully Added user to database!") {
                this.setState({ show: false });
            } else {
                console.log("There was an error");
            }
        })
    }

    render(){
        return (
            <div>
                <BasicButton 
                    color="brand-secondary"
                    variant="filled"
                    size="small"
                    label="New User"
                    icon={<IoMdAdd />}
                    onClick={() => {
                        this.setState({ show: true })
                    }}
                />
                <div>
                    <Modal
                        show={this.state.show}
                        onHide={() => {
                            this.setState({ show: false })
                        }}
                        backdrop="static"
                        keyboard={false}
                        size="md"
                        centered
                        >
                        <Modal.Header closeButton>
                            <Modal.Title>Create New User</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className={styles.addUser}>
                                {
                                    this.state.isUsernameEmpty &&
                                    <span className={styles.errorMessage}>Username field is empty.</span>
                                }
                                {
                                    (this.state.isPasswordEmpty || this.state.isPasswordEmpty2) &&
                                    <span className={styles.errorMessage}>Password field is empty.</span>
                                }
                                {
                                    this.state.isMismatch &&
                                    <span className={styles.errorMessage}>There is a password mismatch.</span>
                                }
                                {
                                    this.state.isTypeEmpty &&
                                    <span className={styles.errorMessage}>Select user type.</span>
                                }
                                <InputLogin 
                                    label={"Username"}
                                    type={"text"}
                                    onChange={this.handleInputChange}
                                    name={"userName"}
                                    required
                                />
                                <InputLogin 
                                    label={"Password"}
                                    type={"password"}
                                    onChange={this.handleInputChange}
                                    name={"userPassword"}
                                    required
                                />
                                <InputLogin 
                                    label={"Re-Enter Password"}
                                    type={"password"}
                                    onChange={this.handleInputChange}
                                    name={"userRePassword"}
                                    required
                                />
                                <select name="userType" className={styles['userType']} onChange={this.handleInputChange}>
                                    <option value='name' disabled selected>User Type</option>
                                    <option value='admin'>Admin</option>
                                    <option value='member'>Member</option>
                                </select>
                            </div>

                        </Modal.Body>
                        <Modal.Footer>
                            <BasicButton 
                                color="brand-secondary"
                                variant="filled"
                                size="default"
                                label="Create User"
                                onClick={this.addUser}
                            />
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        )
    }
}

export default AddUserForm;

{/* <div className={styles.container}>
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
    >CREATE</button>


</div> */}