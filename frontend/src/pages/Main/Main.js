import Axios from 'axios';
import React from "react";
import { Navigate } from "react-router";
import Cookies from "universal-cookie";

import { UploadFile, BasicButton, StudentDataTabs, AddUserForm, SortTab } from '../../components';

import styles from './Main.module.css';

const studentDataTabs = [
    {name:"Surname, Given Name MI", course:"BS CS", gwa:"1.45"},
    {name:"Surname, Given Name MI", course:"BS CS", gwa:"1.45"},
    {name:"Surname, Given Name MI", course:"BS CS", gwa:"1.45"},
    {name:"Surname, Given Name MI", course:"BS CS", gwa:"1.45"},
    {name:"Surname, Given Name MI", course:"BS CS", gwa:"1.45"},
    {name:"Surname, Given Name MI", course:"BS CS", gwa:"1.45"},
    {name:"Surname, Given Name MI", course:"BS CS", gwa:"1.45"},
   
  ];

class Main extends React.Component{

    constructor(props) {
        super(props)

        this.state = {
            username: "",
            userType: "",
            showAddUser: 0,
            checkifLoggedin: false,
            isLoggedin: false,
            fileContent: [],
            students: [] //contains the rows from the students table in the database
        }

        this.showAddUserFunc = this.showAddUserFunc.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.logout = this.logout.bind(this);
        this.getStudents = this.getStudents.bind(this);
    }


    handleFileChange(e) {
        //try catch in the event that no file is selected
        try{
            e.preventDefault()
            
            this.setState({
                fileContent: e.target.files,
            });

        } catch {
            //do nothing when no file was selected
        }
    }

    uploadFile() {

        const data = new FormData();
        //let newArr = [];
        for (let i = 0; i < this.state.fileContent.length; i++) {
          data.append('files', this.state.fileContent[i]);
        }

        //data.append('files', newArr);

        console.log(data.get('files'));

        fetch("http://localhost:3001/single", {
            method: "POST",
            body: data,
        })
            .then((result) => {
            console.log("File Sent Successful");
            })
            .catch((err) => {
            console.log(err.message);
        });

        // Axios.post("http://localhost:3001/single",
        // {body: data}).then((response) => {
        //     console.log("File Sent Successful");
        //     //console.log(response)
        // })
    }

    
    showAddUserFunc(){
        if(this.state.showAddUser === 0){
            this.setState({showAddUser: 1});
        }else if (this.state.showAddUser === 1){
            this.setState({showAddUser : 0});
        }
    }

    getStudents(){

        Axios.get("http://localhost:3001/viewstudents").then((response) => {
            this.setState({students: response.data})
            console.log(this.state.students);
        })
    }
    

    componentDidMount() {

        this.getStudents();
        
        fetch("http://localhost:3001/checkifloggedin", {
            method: "POST",
            credentials: "include",
        })
        .then(response => response.json())
        .then(body => {
            console.log("response body:")
            console.log(body)
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

    render(){
        if(!this.state.checkifLoggedin){
            return (<div></div>)
        }else{
            if(this.state.isLoggedin === false){
                return(
                    <Navigate to="/" />
                )
            
            }else{
                return(
                <div className={styles.main}>
                    <div className={styles.left}>
                        <h1 className={styles.h1Style}>Student Records</h1>
                        <div className={styles.buttonGroup}>
                            <span className={styles.uploadFileBtn}>
                                <BasicButton
                                    label = "Upload"
                                    onClick={this.uploadFile} 
                                    color="green" 
                                    variant="filled"
                                    size="small" 
                                >
                                </BasicButton>
                            </span>
                            <span>
                                <UploadFile 
                                    handleFileChange={this.handleFileChange}
                                />
                            </span>
                            <SortTab/>
                        </div>
                        <div className={styles.studentDataTab}>
                            <StudentDataTabs data={this.state.students} />
                        </div>
                        {(() => {
                            if(this.state.showAddUser === 1){
                                return(
                                    <div className={styles.addUser}>
                                        <AddUserForm addUserFunc={this.showAddUserFunc}/>
                                    </div>
                                )
                            }
                            })()}
                         
                    </div>
                    <div className={styles.right}>
                        <h3 className={styles.h3Style}>{this.state.username}</h3>
                        <div className={styles.buttonGroup2}>
                            
                            {(() => {
                                if (this.state.userType === "admin") {
                                    return (
                                        <div className={styles.button}>
                                
                                            <BasicButton
                                                label = "Create New Account"
                                                color="white" 
                                                variant="outline"
                                                size="small"
                                                onClick = {this.showAddUserFunc}
                                            >
                                            </BasicButton>  
                                        </div>
                                    )
                                }
                            })()}
                            
                            <div className={styles.button}>
                                <BasicButton
                                    label = "View Activities"
                                    color="white" 
                                    variant="outline"
                                    size="small" 
                                > 
                                </BasicButton>
                            </div>
                            <div className={styles.button}>
                                <BasicButton
                                    label = "Log Out"
                                    color="white" 
                                    variant="outline"
                                    size="small" 
                                    onClick ={this.logout}
                                >
                                </BasicButton>
                            </div>
                           
                        </div>
                    </div>
                    
                    
                </div>
                )
            }


        }

        
    }
}
export default Main