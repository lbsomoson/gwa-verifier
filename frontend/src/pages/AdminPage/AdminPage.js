import React from "react";
import Axios from 'axios';
import * as ReactBootStrap from 'react-bootstrap';
import styles from './AdminPage.module.css';
import Modal from 'react-bootstrap/Modal';
import { Tab, Tabs } from 'react-bootstrap';

import {AddUserForm, BasicButton, NavBar, ViewActivities, ViewEdits, ViewMyActivities, ViewMyEditHistory} from '../../components';

class AdminPage extends React.Component{

  constructor(props){
    super(props)

    this.state = {
      users: [],
      showAddUser: 0,
      deleteUser: null,
      viewUser: null,
      changeUser: null,
      viewActivities: [],
      // isViewClicked: 0,
      // isViewAllClicked: 0,
      show: false,
      show2: false,
      show3: false,
      key: "manage-users",
      // isManageUsersClicked: true,
      // isViewAllActivitiesClicked: false,
      // isViewAllEditHistoryClicked: false,
      // isViewAllEditHistoryClicked: false,
      // isViewMyActivities: false,
      // isViewMyEditHistoryClicked: false,
    }
    this.getUsers = this.getUsers.bind(this);
    this.showAddUserFunc = this.showAddUserFunc.bind(this);
    this.getUserActivities = this.getUserActivities.bind(this);
    this.getUserEditActivities = this.getUserEditActivities.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleAllClose = this.handleAllClose.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.handleViewClicked = this.handleViewClicked.bind(this);
    this.handleChangeClicked = this.handleChangeClicked.bind(this);
    this.handleViewEditClicked = this.handleViewEditClicked.bind(this);
  }
    
  getUserActivities(){
    Axios.get("http://localhost:3001/finduseractivities",
    {params:{username: this.state.viewUser.Username}}).then((response) => {
      console.log(response.data)
      this.setState({viewActivities: response.data});
    })
    console.log(this.state.viewActivities);
  }

  getUserEditActivities(){
    console.log(this.state.viewEditUser);

    Axios.get("http://localhost:3001/finduseredits",
    {params:{username: this.state.viewEditUser.Username}}).then((response) => {
        this.setState({viewEdits: response.data});
        console.log(this.state.viewEdits);
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

    console.log(this.state.isViewClicked);
    // console.log("here in handle view clicked")
    this.getUserActivities();
    const str = "viewed user activity history: " + this.state.viewUser.Username;
    Axios.post("http://localhost:3001/addActivity",
    {username: localStorage.getItem("user"), action: str}).then((response) => {
      console.log(response)
    })
  }

  handleViewEditClicked() {
    // this.setState({isViewEditClicked: 1});
    this.getUserEditActivities();
    const str = "viewed user edit history: " + this.state.viewEditUser.Username;
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
      // console.log(this.state.users);
    })
    this.setState({ show: false });
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
    window.location.reload();
  }

  // componentDidUpdate(prevState) {
  //   if(this.state.users !== prevState.users) {
  //     this.getUsers();
  //   }
  // }


  componentDidMount() {
    document.title = "Dashboard";
    this.getUsers();
  }

    render(){
      return(
        <div>
          <NavBar />
          <div className={styles.container}>
          <div className={styles.topText}>
              <div className={styles.left}>
                Admin Dashboard 
                {
                  this.state.isManageUsersClicked ? 
                  <span className={styles.entries}> | {this.state.users.length-1} {this.state.users.length-1 > 1 ? "users" : "user"}</span>
                  :
                  ""
                }
              </div>
              <div className={styles.right}>
                <AddUserForm />
              </div>
            </div>

            <div className={styles.navTabs}>
              <Tabs className="mb-3" activeKey={this.state.key} onSelect={(k) => {this.setState({ key: k })}}>
                <Tab eventKey="manage-users" title="Manage Users">

                <div className={styles.header}>
                  <div className={styles.usernameH}>Username</div>
                  <div className={styles.typeH}>User Type</div>
                  <div className={styles.actionH}>Action</div>
                </div>

                  {
                    this.state.users.map((user, i) => {
                      if(user.Username !== localStorage.getItem("user")) {
                        return(
                          <div key={i}>
                            <div className={styles.tabs}>
                              <div className={styles.username}>{user.Username}</div>
                              <div className={styles.type}>{user.Type}</div>
                              <div className={styles.action}>
                                <div className={styles.viewActivitiesBtn}>
                                  <BasicButton 
                                    color="brand-secondary"
                                    variant="outline"
                                    size="small"
                                    label="Activity History"
                                    onClick={() => { 
                                        this.setState({viewUser: user, show: true}, () => {
                                        this.handleViewClicked();
                                      });
                                    }}
                                  />
                                  <Modal 
                                    show={this.state.show}
                                    onHide={() => {
                                        this.setState({ show: false })
                                    }} 
                                    size="lg">
                                      <Modal.Header>
                                        <Modal.Title>Activity History</Modal.Title>
                                      </Modal.Header>
                    
                                      <Modal.Body className={styles.modalBody}>
                                      {(() => {
                                          if(this.state.viewActivities.length === 0){
                                            return( <p>No activity history found.</p>)
                                          }else{
                                            return (
                                              <div>
                                                <ReactBootStrap.Table striped bordered size="sm" className={styles.table}>
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
                                                    )
                                                  })}
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
                                              onClick={() => {
                                                this.setState({ show: false });
                                              }} 
                                              color="green" 
                                              variant="filled"
                                              size="default" 
                                          >
                                          </BasicButton>
                                      </Modal.Footer>
                                  </Modal>
                                  
                                </div>
                                <div className={styles.editBtn}>
                                  <BasicButton 
                                    color="brand-secondary"
                                    variant="outline"
                                    size="small"
                                    label="Edit History"
                                    onClick={() => {
                                      this.setState({ viewEditUser: user, show3: true }, () => {
                                        this.handleViewEditClicked();
                                      })
                                    }}
                                  />
                                  <Modal 
                                      show={this.state.show3}
                                      onHide={() => {
                                          this.setState({ show3: false })
                                      }} 
                                      size="lg">
                                        <Modal.Header>
                                          <Modal.Title>Activity History</Modal.Title>
                                        </Modal.Header>
                      
                                        <Modal.Body className={styles.modalBody}>
                                        {(() => {
                                            if(this.state.viewActivities.length === 0){
                                              return( <p>No activity history found.</p>)
                                            }else{
                                              return (
                                                <ReactBootStrap.Table  striped bordered size="sm" className={styles.table}>
                                                  <thead>
                                                  <tr>
                                                      <th className={styles.dateEdit}>Date</th>
                                                      <th className={styles.timeEdit}>Time</th>
                                                      <th className={styles.studentIdEdit}>Student ID</th>
                                                      <th className={styles.activityEdit}>Activity</th>
                                                  </tr>
                                                  </thead>
                                                  <tbody>
                                                      {this.state.viewEdits.map((activity) => {
                                                        const date = activity.Datetime_of_edit.substr(0,10);
                                                        var time = activity.Datetime_of_edit.substr(11);
                                                        time = time.replace('.000Z','');
                                                        return(
                                                          <tr>
                                                            <td className={styles.row}>{date}</td>
                                                            <td className={styles.row}>{time}</td>
                                                            <td className={styles.row}>{activity.Student_ID}</td>
                                                            <td className={styles.row}>{activity.Edit_notes}</td>
                                                          </tr>
                                                      )})}
                                                  </tbody>
                                                </ReactBootStrap.Table>
                                              )
                                            }
                                        })()}
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <BasicButton
                                                label = "Close"
                                                onClick={() => {
                                                  this.setState({ show3: false });
                                                }} 
                                                color="green" 
                                                variant="filled"
                                                size="default" 
                                            >
                                            </BasicButton>
                                        </Modal.Footer>
                                    </Modal>
                                </div>
                                <div className={styles.updateBtn}>
                                  <BasicButton 
                                    color="brand-secondary"
                                    variant="filled"
                                    size="small"
                                    label="Update"
                                    onClick={() => {
                                      this.setState({ changeUser: user }, () => {
                                        this.handleChangeClicked();
                                      })
                                    }}
                                  />
                                </div>
                                <div>
                                  <BasicButton 
                                    color="brand-primary"
                                    variant="filled"
                                    size="small"
                                    label="Delete"
                                    onClick={() => { 
                                        this.setState({deleteUser: user, show2: true});
                                    }}
                                  />
                                  {/* {(() => {
                                    const deleteUser = this.deleteUser.Username; */}
                                    <Modal
                                      size="md"
                                      aria-labelledby="contained-modal-title-vcenter"
                                      centered
                                      show={this.state.show2}
                                      onHide={() => {
                                        this.setState({ show2: false })
                                      }}
                                    >
                                      <Modal.Header closeButton>
                                        <Modal.Title id="contained-modal-title-vcenter">
                                          Confirm user delete?
                                        </Modal.Title>
                                      </Modal.Header>
                                      <Modal.Body>
                                        <p>
                                          Are you sure you want to delete this user?
                                        </p>
                                      </Modal.Body>
                                      <Modal.Footer>
                                        <BasicButton
                                          onClick={() => {this.setState({ show2: false })}}
                                          color="brand-secondary" 
                                          variant="outline"
                                          size="default" 
                                          label="Cancel"
                                        />
                                        <BasicButton
                                          onClick={() => {this.setState({ show2: false }, () => {
                                            this.deleteUser();
                                          })}}
                                          label="Confirm"
                                          color="brand-primary" 
                                          variant="filled"
                                          size="default" 
                                        />
                                      </Modal.Footer>
                                    </Modal>
                                  {/* })} */}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      } else {
                        return(
                          <div></div>
                        )
                      }
                    })
                  }
                </Tab>
                <Tab eventKey="view-all-activities" title="View All Activities">
                  <ViewActivities />
                </Tab>
                <Tab eventKey="view-all-edit-history" title="View All Edit History">
                  <ViewEdits/>
                </Tab>
                <Tab eventKey="view-my-activities" title="View My Activities">
                  <ViewMyActivities userLocalStorage={localStorage.getItem("user")}/>
                </Tab>
                <Tab eventKey="view-my-edit-history" title="View My Edit History">
                  <ViewMyEditHistory userLocalStorage={localStorage.getItem("user")} />
                </Tab>
              </Tabs>
            </div>

          </div>
        </div>
      )
    }
    
}
export default AdminPage
