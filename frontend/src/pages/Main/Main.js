import Axios from 'axios';
import React from "react";
import { Navigate } from "react-router";
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
            logOut: 0, 
            showAddUser: 0,
            fileContent: [],
        }
        
        this.addFiles = this.addFiles.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.getUser = this.getUser.bind(this);
        this.logOutFunc = this.logOutFunc.bind(this);
        this.showAddUserFunc = this.showAddUserFunc.bind(this);
    }

    //used for the button selecting the files
    handleFileChange(e) {
        //try catch in the event that no file is selected
        try{
            this.addFiles(e.target.files);
            
            //original code
            /*const reader = new FileReader()
            reader.onload = async (e) => { 
                let text = (e.target.result)
                //console.log(text);
                this.setState({
                    fileContent: text,
                });
            };
            reader.readAsText(e.target.files[0])
            const fileChosen = document.getElementById('fileChosen');
            fileChosen.textContent = e.target.files[0].name*/
        } catch {
            //do nothing when no file was selected
        }
    }

    //reads group of files given FileList object and saves them to a list variable
    addFiles(files) {
        var contents = [];

        [].forEach.call(files, function(file) {
            var reader = new FileReader();
            reader.onloadend = function() {
                contents.push(reader.result);
            }
            reader.readAsText(file);
        });
        console.log(contents);
        this.setState({
            fileContent: contents,
        });
    }

    //sends post request when upload button is clicked
    uploadFile() {
        console.log(this.state.username+" "+this.state.userType);
        Axios.post("http://localhost:3001/uploadFile",
        {uploadedFile: this.state.fileContent}).then((response) => {
            console.log(response.data)
        })
    
    }

    componentDidMount() { 
        this.getUser();
    }

    getUser(){
        
        Axios.post("http://localhost:3001/findUser",
        {username: window.localStorage.getItem("user")}).then((response) => {
            console.log(response.data[0]);
            this.setState({ username: response.data[0].username, userType: response.data[0].type});
        })

    }
    logOutFunc(){
        this.setState({logOut : 1});
    }

    showAddUserFunc(){
        if(this.state.showAddUser === 0){
            this.setState({showAddUser: 1});
        }else if (this.state.showAddUser === 1){
            this.setState({showAddUser : 0});
        }
    }

    render(){

        if(window.localStorage.getItem("loggedIn") !== "true"){
            return(
                <Navigate to="/" />
            )
        
        }else if (this.state.logOut === 1){
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
                            <StudentDataTabs data={studentDataTabs} />
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
                        <h3 className={styles.h3Style}>{this.state.userType}</h3>
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
                                    onClick ={this.logOutFunc}
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
export default Main