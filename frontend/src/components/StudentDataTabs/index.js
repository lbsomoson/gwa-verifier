import React from 'react';
import Axios from 'axios';
import styles from './StudentDataTabs.module.css';
import { Navigate } from "react-router";
import {BasicButton} from '../../components';

class StudentDataTabs extends React.Component{

    constructor(props) {
        super(props)

        this.state = {
            viewStudent: null,
            isViewClicked: false,
        }

        this.viewButtonClicked = this.viewButtonClicked.bind(this);
    }

    
    viewButtonClicked() {
        this.setState({isViewClicked: true});
        window.localStorage.setItem("studentID",this.state.viewStudent.ID);
        window.localStorage.setItem("studentFN",this.state.viewStudent.First_Name);
        window.localStorage.setItem("studentLN",this.state.viewStudent.Last_Name);
        window.localStorage.setItem("studentProgram",this.state.viewStudent.Program);
        window.localStorage.setItem("studentGWA",this.state.viewStudent.GWA);
        const str = "viewed student record: " + this.state.viewStudent.Last_Name + " " + this.state.viewStudent.First_Name + " (" + this.state.viewStudent.ID + ")";
        Axios.post("http://localhost:3001/addActivity",
        {username: localStorage.getItem("user"), action: str}).then((response) => {
            console.log(response)
        })
        //console.log(this.state.viewStudent.ID);
        //console.log(this.state.viewStudent.First_Name);
        //console.log(this.state.viewStudent.Last_Name);
        //console.log(this.state.viewStudent.Program);
        //console.log(this.state.viewStudent.GWA);
        
    }
    

    render(){
        const studentDataTabs = this.props.data
        if (this.state.isViewClicked === false){
            return(
                <div>
                    {
                        studentDataTabs.map((studentDataTab) => {
                            return (
                                <div className={styles.studentDataTab}>
                                    <div className={styles.name}>
                                    <h4>NAME</h4>
                                    <p>{studentDataTab.Last_Name+", "+studentDataTab.First_Name}</p>
                                    </div>
                                    <div className={styles.course}>
                                    <h4>COURSE</h4>
                                    <p>{studentDataTab.Program}</p>
                                    </div>
                                    <div className={styles.gwa}>
                                    <h4>GWA</h4>
                                    <p>{studentDataTab.GWA}</p>
                                    </div>
                                    <div className={styles.view}>
                                        <BasicButton 
                                            label = "view"
                                            color="red" 
                                            variant="outline"
                                            size="small" 
                                            onClick=
                                               {
                                                    () => { 
                                                    this.setState({viewStudent: studentDataTab}, () => {
                                                    //console.log(this.state.viewStudent);
                                                    this.viewButtonClicked();
                                                    });
    
                                                }}
                                                //{this.setState({viewStudent: studentDataTab}, () => {
                                                //    this.viewButtonClicked();
                                                //  })}
                                        >    
                                        </BasicButton>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            )
            
        }
        else{
            return(
                <div> 
                    <Navigate to="/studentrecord" />
                </div>
               
            )
        }
        
        
        
    }
}

export default StudentDataTabs;
/*
//<Link
//    to={{ pathname: `/studentrecord/${studentDataTab.ID}`, details: {studentDataTab.ID,studentDataTab.} }}
>

 // <Link
                    //    to={{
                            //to={{ pathname: `/cards/${id}`, state: id }}
                            pathname: "/studentrecord/${this.}",
                            state: this.state.viewStudent 
                        }}
                    /</div>/></Link>

*/