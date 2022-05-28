import Axios from 'axios';
import React from "react";
import { Navigate } from "react-router";
import Cookies from "universal-cookie";
import Modal from 'react-bootstrap/Modal';
import * as ReactBootStrap from 'react-bootstrap';

import { UploadFile, BasicButton, StudentDataTabs, AddUserForm, SortTab } from '../../components';

import styles from './Main.module.css';

/*
const studentDataTabs = [
    {name:"Surname, Given Name MI", course:"BS CS", gwa:"1.45"},
    {name:"Surname, Given Name MI", course:"BS CS", gwa:"1.45"},
    {name:"Surname, Given Name MI", course:"BS CS", gwa:"1.45"},
    {name:"Surname, Given Name MI", course:"BS CS", gwa:"1.45"},
    {name:"Surname, Given Name MI", course:"BS CS", gwa:"1.45"},
    {name:"Surname, Given Name MI", course:"BS CS", gwa:"1.45"},
    {name:"Surname, Given Name MI", course:"BS CS", gwa:"1.45"},
   
  ];
*/

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
            students: [], //contains the rows from the students table in the database
            studentsSave: [], //to recover initial order of tabs before searching and sorting
            qualifiedStudents:[],
            showPrompt: 0,
            promptMsg: [],
            isViewClicked: 0
        }

        this.showAddUserFunc = this.showAddUserFunc.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.logout = this.logout.bind(this);
        this.getStudents = this.getStudents.bind(this);
        this.arrangeStudents = this.arrangeStudents.bind(this);
        this.viewStudentRecord = this.viewStudentRecord.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleViewClick = this.handleViewClick.bind(this);
    }


    arrangeStudents(x){
        console.log("IN MAIN:");
        this.setState({students : x});
    }


    handleFileChange(e) {
        //try catch in the event that no file is selected
        try{
            e.preventDefault()
            
            this.setState({
                fileContent: e.target.files,
            });

            console.log(this.state.fileContent.length);
            if(this.state.fileContent.length > 1){
                var str = "Selected (" + this.state.fileContent.length + ") files."
                document.getElementById("fileChosen").innerHTML = str;
            }else{
                var fullPath = document.getElementById('uploadFileBtn').value;
                if (fullPath) {
                var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                var filename = fullPath.substring(startIndex);
                if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                    filename = filename.substring(1);
                }
                document.getElementById("fileChosen").innerHTML = filename;
            }

            }
            
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
            .then(response => response.json())
            .then(result => {
                if(result.msg){
                    //console.log(result.msg);
                    this.setState({showPrompt : 1, promptMsg: result.msg});
                   
                }
                Axios.post("http://localhost:3001/addActivity",
                {username: this.state.username, action: "uploaded file(s)"}).then((response) => {
                    console.log(response)
                })
            
            })
            .catch((err) => {
            console.log(err.msg);
        });
    }

    handleViewClick(){this.setState({isViewClicked : 1})};

    handleClose(){this.setState({showPrompt : 0}); window.location.reload(false);};

    showAddUserFunc(){
        if(this.state.showAddUser === 0){
            this.setState({showAddUser: 1});
        }else if (this.state.showAddUser === 1){
            this.setState({showAddUser : 0});
        }
    }

    getStudents(){

        Axios.get("http://localhost:3001/viewstudents").then((response) => {
            this.setState({students: response.data, studentsSave: response.data})
            console.log(this.state.students);
        })

        Axios.get("http://localhost:3001/getQualified").then((response) => {
            console.log(response.data)
            this.setState({qualifiedStudents : response.data})
        })
    }

    viewStudentRecord(){
        console.log("Here in view");
        Axios.post("http://localhost:3001/viewRecords",
        {id: "2018-72434"}
        ).then((response) => {
            console.log(response);
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

        Axios.post("http://localhost:3001/addActivity",
        {username: this.state.username, action: "logged out"}).then((response) => {
            console.log(response)
        })

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
            
             }else if (this.state.isViewClicked === 1 && this.state.userType === "admin"){
                return(
                    <Navigate to="/adminpage" />
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
                            <SortTab data={this.state.students} save={this.state.studentsSave}
                             qual={this.state.qualifiedStudents} func={this.arrangeStudents} />
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
                        {(() => {
                            if(this.state.showPrompt === 1){

                                return(
                                    <Modal show={this.state.showPrompt}>
                                        <Modal.Header>
                                            <Modal.Title>File Upload</Modal.Title>
                                        </Modal.Header>

                                        <Modal.Body className={styles.modal}>
                                            {
                                                
                                                this.state.promptMsg.map((msg) => {
                                                    return(
                                                        <div>
                                                        <ReactBootStrap.Table  triped bordered size="sm" className={styles.table}>
                                                            <thead>
                                                            <tr>
                                                                <th className={styles.filename}>{"Warning(s) for " + msg[0]}</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    msg[1].map((index) => {
                                                                    return(
                                                                        <tr>
                                                                            <td className={styles.row}>{index}</td>
                                                                        </tr>
                                                                )})}
                                                                
                                                            </tbody>
                                                        </ReactBootStrap.Table>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Modal.Body>

                                        <Modal.Footer>
                                            <BasicButton
                                                label = "Close"
                                                onClick={this.handleClose} 
                                                color="green" 
                                                variant="filled"
                                                size="small" 
                                            >
                                            </BasicButton>
                                        </Modal.Footer>
                                    </Modal>
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
                                                block
                                                onClick = {this.showAddUserFunc}
                                            >
                                            </BasicButton>  
                                        </div>
                                    )
                                }
                            })()}
                            {(() => {
                                if (this.state.userType === "admin") {
                                    return (
                                        <div className={styles.button}>
                                            <BasicButton
                                                label = "Manage Users"
                                                color="white" 
                                                variant="outline"
                                                size="small"
                                                block
                                                onClick = {this.handleViewClick}
                                            >
                                            </BasicButton>  
                                        </div>
                                    )
                                }
                            })()}
                            <div className={styles.button}>
                                <BasicButton
                                    label = "Log Out"
                                    color="white" 
                                    variant="outline"
                                    size="small" 
                                    block
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