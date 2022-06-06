import Axios from 'axios';
import React from "react";
import { Navigate } from "react-router";
import Cookies from "universal-cookie";
import Modal from 'react-bootstrap/Modal';
import * as ReactBootStrap from 'react-bootstrap';


import { UploadFile, BasicButton, StudentDataTabs, AddUserForm, SortTab, NavBar, Pagination } from '../../components';

import styles from './Main.module.css';
import { IoMdAdd, IoMdDownload } from "react-icons/io";
import { IoTabletLandscape } from 'react-icons/io5';

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
            showPrompt: false,
            promptMsg: [],
            isViewClicked: 0,
			show: false,
            showPrompts: [],
            pageCount: 0,
            limit: 10,
            currentPage: 1,
            postsPerPage: 10, 
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
		this.getDownload = this.getDownload.bind(this);
    }


    arrangeStudents(x){
        // console.log("IN MAIN:");
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
                console.log(result.msg);
                if(result.msg){
                    this.setState({showPrompt : true, promptMsg: result.msg});
                    var showPrompts = []
                    for (var i=0; i<result.msg[0][1].length; i++) {
                        showPrompts.push(true);
                    }
                    this.setState({ showPrompts: showPrompts });
                }
                Axios.post("http://localhost:3001/addActivity",
                {username: this.state.username, action: "uploaded file(s)"}).then((response) => {
                    console.log(response)
                })
            })
            .catch((err) => {
            console.log(err.msg);
        });

        this.setState({ show: false });
        // window.location.reload(false);
    }

    handleViewClick(){this.setState({isViewClicked : 1})};

    handleClose(){this.setState({showPrompt : false}); window.location.reload(false);};

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
        
		document.title = "Main"
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
        // this.setState({ pageCount: Math.ceil(this.state.students.length/this.state.limit) });
        // console.log(this.state.pageCount);
    }

    getDownload(){
		Axios.get("http://localhost:3001/downloadSummary",)
        .then((response) => {
            console.log(response)
        })
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
        const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
        const indexOfFistPost = indexOfLastPost - this.state.postsPerPage;
        const currentPosts = this.state.students.slice(indexOfFistPost, indexOfLastPost);

        console.log(currentPosts, this.state.students.length, this.state.postsPerPage);

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
                    <div>
                        <NavBar />
                        <div className={styles.container}>
                            <div className={styles.topText}>
                                <div className={styles.left}>
                                    Student Records
                                    <span className={styles.entries}> | {this.state.students.length} {this.state.students.length > 1 ? "entries" : "entry"}</span>
                                </div>
                                <div className={styles.right}>
                                    <BasicButton 
                                        color="brand-primary"
                                        variant="outline"
                                        size="small"
                                        label="Summary"
                                        icon={<IoMdDownload />}
                                        onClick={this.getDownload}
                                    />
                                    {/* <a href="file:///C:\Users\Desktop\project-2\project\backend\table.pdf" download rel="noopener noreferrer" target="_blank">
                                        Download Summary
                                    </a> */}
                                    <BasicButton 
                                        color="brand-secondary"
                                        variant="filled"
                                        size="small"
                                        label="New Record"
                                        icon={<IoMdAdd />}cd 
                                        onClick={() => {
                                                this.setState({ show: true })
                                        }}
                                    />

                                    <Modal
                                        show={this.state.show}
                                        onHide={() => {
                                            this.setState({ show: false })
                                        }}
                                    >
                                        <Modal.Header closeButton>
                                            <Modal.Title>Upload .pdf, .csv, or .xlsx file/s</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <UploadFile 
                                                handleFileChange={this.handleFileChange}
                                            />
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <BasicButton 
                                                color="brand-primary"
                                                variant="filled"
                                                size="default"
                                                label="Upload"
                                                onClick={this.uploadFile}
                                            />
                                        </Modal.Footer>
                                    </Modal>
                                </div>
                            </div>

                            <div className={styles.filterBar}>
                                        <SortTab 
                                            data={this.state.students} 
                                            save={this.state.studentsSave} 
                                            qual={this.state.qualifiedStudents} 
                                            func={this.arrangeStudents}
                                        />
                            </div>

                            <div>
                                <div className={styles.header}>
                                    <div className={styles.name}>Name</div>
                                    <div className={styles.id}>Student Number</div>
                                    <div className={styles.course}>Program</div>
                                    <div className={styles.gwa}>GWA</div>
                                    <div className={styles.action}>Action</div>
                                </div>
                            </div>

                            <div className={styles.list}>
                                    {this.state.students.map((student, i) => {
                                        return(
                                            <StudentDataTabs 
                                                key={i}
                                                data={student}
                                            />
                                        )})
                                    }
                            </div>
                            
                        </div>
                            
                            {
                                this.state.showPrompt &&
                                <ReactBootStrap.ToastContainer position="bottom-end" className="p-3">
                                    {
                                        this.state.promptMsg.map((msg) => {
                                            return(
                                                msg[1].map((index, key) => {
                                                    return(
                                                        <ReactBootStrap.Toast 
                                                            bg="warning" 
                                                            show={this.state.showPrompts[key]} 
                                                            onClose={()=>{
                                                                //eslint-disable-next-line
                                                                this.state.showPrompts[key] = false;
                                                                this.forceUpdate();
                                                            }}>
                                                            <ReactBootStrap.ToastHeader>
                                                                {"Warning(s) for " + msg[0]}
                                                            </ReactBootStrap.ToastHeader>
                                                            <ReactBootStrap.ToastBody>
                                                                {index}
                                                            </ReactBootStrap.ToastBody>
                                                        </ReactBootStrap.Toast>
                                                    )
                                                })
                                            )
                                        })
                                    }

                                </ReactBootStrap.ToastContainer>
                            }

                            <Pagination postsPerPage={this.state.postsPerPage} totalPosts={this.state.students.length}/>
                            
                    </div>
                )
            }
        }
    }
}

export default Main;