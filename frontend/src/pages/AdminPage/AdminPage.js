import React from "react";
import Axios from 'axios';
import * as ReactBootStrap from 'react-bootstrap';
import styles from './AdminPage.module.css';
import Modal from 'react-bootstrap/Modal';

import {AddUserForm, BasicButton, ViewActivities} from '../../components';

class AdminPage extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            users: [],
            showAddUser: 0,
            deleteUser: null,
            changeUser: null,
            viewUser: null,
            viewActivities: [],
            isViewClicked: 0,
            isViewAllClicked: 0,
        }
        this.getUsers = this.getUsers.bind(this);
        this.showAddUserFunc = this.showAddUserFunc.bind(this);
        this.getUserActivities = this.getUserActivities.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleAllClose = this.handleAllClose.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.handleViewClicked = this.handleViewClicked.bind(this);
        this.getUserActivities = this.getUserActivities.bind(this);
        this.handleChangeClicked = this.handleChangeClicked.bind(this);
    }
    
    getUserActivities(){
        Axios.get("http://localhost:3001/finduseractivities",
        {params:{username: this.state.viewUser.Username}}).then((response) => {
            this.setState({viewActivities: response.data});
            console.log(this.state.viewActivities);
        })
    }

    handleChangeClicked(){

        if(this.state.changeUser.Type === "member"){
            Axios.post("http://localhost:3001/updateuser",
            {username: this.state.changeUser.Username, type:"admin"}).then((response) => {
                console.log(response)
            })

            const str = "updated user: " + this.state.changeUser.Username + " (from " + this.state.changeUser.Type + " to admin)";
            Axios.post("http://localhost:3001/addActivity",
            {username: localStorage.getItem("user"), action: str}).then((response) => {
                console.log(response)
            })

        }else{
            Axios.post("http://localhost:3001/updateuser",
            {username: this.state.changeUser.Username, type:"member"}).then((response) => {
                console.log(response)
            })
            const str = "updated user: " + this.state.changeUser.Username + " (from " + this.state.changeUser.Type + " to member)";
            Axios.post("http://localhost:3001/addActivity",
            {username: localStorage.getItem("user"), action: str}).then((response) => {
                console.log(response)
            })
        }

        window.location.reload()
       
    }

    handleViewClicked() {
        this.setState({isViewClicked: 1});
        this.getUserActivities();
        const str = "viewed user activity history: " + this.state.viewUser.Username;
        Axios.post("http://localhost:3001/addActivity",
        {username: localStorage.getItem("user"), action: str}).then((response) => {
            console.log(response)
        })
    }

    handleClose(){this.setState({isViewClicked: 0});};
    handleAllClose(){this.setState({isViewAllClicked: 0});};

    getUsers(){

        Axios.get("http://localhost:3001/viewusers").then((response) => {
            this.setState({users: response.data})
            console.log(this.state.users);
        })
    }

    showAddUserFunc(){
        if(this.state.showAddUser === 0){
            this.setState({showAddUser: 1});
        }else if (this.state.showAddUser === 1){
            this.setState({showAddUser : 0});
            this.getUsers();
        }

    }

     
    deleteUser(){
        //console.log(this.state.deleteUser.Username);
        Axios.post("http://localhost:3001/deleteuser", {username:this.state.deleteUser.Username}).then((response) => {
           console.log(response)
        })

        const str = "deleted user: " + this.state.deleteUser.Username;
        Axios.post("http://localhost:3001/addActivity",
        {username: localStorage.getItem("user"), action: str}).then((response) => {
            console.log(response)
        })

        this.getUsers();
    }

    componentDidMount() {
        this.getUsers();

        console.log(this.state.users);

    }

    render(){
            return(
               <div className={styles.adminPage}>
                    {(() => {
                        if(this.state.isViewClicked === 1){
                            const title = this.state.viewUser.Username + "'s Activity History";
                            return(
                                <Modal show={this.state.isViewClicked} size="lg">
                                    <Modal.Header>
                                        <Modal.Title>{title}</Modal.Title>
                                    </Modal.Header>

                                    <Modal.Body className={styles.modalBody}>
                                    {(() => {
                                        
                                        if(this.state.viewActivities.length === 0){
                                            return( <p>No activity history found.</p>)
                                        }else{
                                                return (
                                                    
                                                    <div>
                                                        <ReactBootStrap.Table  triped bordered size="sm" className={styles.table}>
                                                        <thead>
                                                        <tr>
                                                            <th className={styles.date}>Date</th>
                                                            <th className={styles.time}>Time</th>
                                                            <th className={styles.activity}>Activity</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.state.viewActivities.map((activity) => {
                                                                const date = activity.Date.substr(0,10);
                                                                var time = activity.Date.substr(11);
                                                                time = time.replace('.000Z','');
                                                                return(
                                                                        <tr>
                                                                        <td className={styles.row}>{date}</td>
                                                                        <td className={styles.row}>{time}</td>
                                                                        <td className={styles.row}>{activity.Action}</td>
                                                                        </tr>
                                                            )})}
                                                        </tbody>
                                                        </ReactBootStrap.Table>
                                                    </div>
                                                )
                                        }
                                    })()}
                                      
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
                   <h1 className={styles.h1Style}>Manage Users</h1>
                   <div className={styles.button}>
                        <BasicButton
                            label = "Create New Account"
                            color="green" 
                            variant="filled"
                            size="small"
                            block
                            onClick = {this.showAddUserFunc}
                        />
                     </div>
                     <div className={styles.button}>
                        <BasicButton
                            label = "View All Activities"
                            color="green" 
                            variant="filled"
                            size="small"
                            block
                            onClick=
                            {
                                () => { 
                                    this.setState({isViewAllClicked: 1}, () => {
                                });

                            }}
                        />
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
                            if(this.state.isViewAllClicked === 1){
                                return(
                                    <Modal show={this.state.isViewAllClicked} size="xl">
                                        <Modal.Header>
                                        <Modal.Title>All User Activities</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body className={styles.modalBody}>
                                            <ViewActivities/>
                                        </Modal.Body>
                                        <Modal.Footer>
                                        <BasicButton
                                            label = "Close"
                                            onClick={this.handleAllClose} 
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
                       {
                           this.state.users.map((userDataTab) => {
                            if(userDataTab.Username !== localStorage.getItem("user")){
                                return (
                                   
                                    <div className={styles.userDataTab}>
                                        <div className={styles.username}>
                                        <h5>USERNAME</h5>
                                        <p>{userDataTab.Username}</p>
                                        </div>
                                        <div className={styles.password}>
                                        <h5>PASSWORD</h5>
                                        <p>{userDataTab.Password}</p>
                                        </div>
                                        <div className={styles.type}>
                                        <h5>TYPE</h5>
                                        <p>{userDataTab.Type}</p>
                                        </div>
                                        {(() => {
                                            if(userDataTab.Type === "member"){
                                                return(
                                                    <div className={styles.delete}>
                                                        <BasicButton 
                                                            label = "delete user"
                                                            color="red" 
                                                            variant="outline"
                                                            size="small" 
                                                            onClick=
                                                                {
                                                                    () => { 
                                                                        this.setState({deleteUser: userDataTab}, () => {
                                                                        this.deleteUser();
                                                                    });
                    
                                                                }}
                                                        >    
                                                        </BasicButton>
                                                    </div>
                                                )
                                            }else{
                                                return(
                                                    <div className={styles.delete}></div>
                                                )
                                            }
                                        })()}
                                        
                                        <div className={styles.view}>
                                            <BasicButton 
                                                label = "view activities"
                                                color="red" 
                                                variant="outline"
                                                size="small" 
                                                onClick=
                                                   {
                                                        () => { 
                                                        this.setState({viewUser: userDataTab}, () => {
                                                        //console.log(this.state.viewStudent);
                                                        this.handleViewClicked();
                                                        });
        
                                                    }}
                                            >    
                                            </BasicButton>

                                        </div>

                                        <div className={styles.view}>
                                            <BasicButton 
                                                label = "change user type"
                                                color="red" 
                                                variant="outline"
                                                size="small" 
                                                onClick=
                                                   {
                                                        () => { 
                                                        this.setState({changeUser: userDataTab}, () => {
                                                        //console.log(this.state.viewStudent);
                                                        this.handleChangeClicked();
                                                        });
        
                                                    }}
                                            >    
                                            </BasicButton>

                                        </div>
                                    </div>
                                )
                            }else{
                                return(<div></div>);
                            }
                           
                        })
                       }
                           
               </div>
            )
    }
    
}
export default AdminPage
