import React from 'react';
import Axios from 'axios';
import * as ReactBootStrap from 'react-bootstrap';
import styles from './StudentRecord.module.css'
import { BasicButton } from "../../components"
import { Navigate } from "react-router";

class StudentRecord extends React.Component{
  
    constructor(props) {
        super(props)

        this.state = {
            studentID : localStorage.getItem("studentID"),
            studentFN : localStorage.getItem("studentFN"),
            studentLN : localStorage.getItem("studentLN"),
            studentProgram : localStorage.getItem("studentProgram"),
            studentGWA : localStorage.getItem("studentGWA"),
            record: record,
            isEditClicked: false,
            isSaveClicked: false,
            isBackClicked: false,
            isDeleteClicked: false
        }

        this.editButtonClicked = this.editButtonClicked.bind(this);
        this.saveButtonClicked = this.saveButtonClicked.bind(this);
        this.backButtonClicked = this.backButtonClicked.bind(this);
        this.deleteButtonClicked = this.deleteButtonClicked.bind(this);
    }

    editButtonClicked() {
      this.setState({ isEditClicked: true, isSaveClicked: false });

    }

    saveButtonClicked() {
      this.setState({ isSaveClicked: true, isEditClicked: false });
    }

    backButtonClicked() {
        this.setState({ isBackClicked: true });
    }

    deleteButtonClicked() {
        this.setState({ isDeleteClicked: true });
        //const student_id = this.state.studentID;

        console.log("Deleting student...");
        /*
        fetch("http://localhost:3001/deletestudent", {
            method: "POST",
            body: student_id,
        })
            .then((result) => {
            console.log("Deleted Successfully");
            })
            .catch((err) => {
            console.log(err.message);
        });
        */

        Axios.post("http://localhost:3001/deletestudent", {student_id:this.state.studentID}).then((response) => {
            console.log(response)
        })
    }

    render(){

        //console.log(studentID);
        //console.log(studentFN);
        //console.log(studentLN);
        //console.log(studentProgram);
        //console.log(studentGWA);
        if(this.state.isBackClicked === false && this.state.isDeleteClicked === false){
            return(
                <div className={styles.row}>
                        <div className={styles.left}>
                            <div className={styles.studentDetails}>
                                <h4>Name: {this.state.studentFN + " " + this.state.studentLN}</h4>
                                <h5>Course: {this.state.studentProgram}</h5>
                                Total Grade: {"N/A"}<br/>
                                Total Enrolled: {"N/A"}<br/>
                                GWA: {this.state.studentGWA}<br/>
                                Required Units: {"N/A"}<br/>
                            </div>
                            
                            {
                                this.state.isEditClicked ? 
                                  <BasicButton
                                    label="Edit"
                                    color="green" 
                                    variant="filled"
                                    size="small"
                                    block
                                    onClick={this.editButtonClicked}
                                  />
                                :
                                  <BasicButton
                                      label="Save"
                                      color="green" 
                                      variant="filled"
                                      size="small"
                                      block
                                      onClick={this.saveButtonClicked}
                                  />
                                   
                            }
                             <BasicButton
                                    label="Delete"
                                    color="green" 
                                    variant="filled"
                                    size="small"
                                    block
                                    onClick={this.deleteButtonClicked}
                            />
    
                            <BasicButton
                                    label="Back to Student Records"
                                    color="green" 
                                    variant="filled"
                                    size="small"
                                    block
                                    onClick={this.backButtonClicked}
                            />
                            
                        </div>
                        <div className={styles.right}>
                        {record.semesters.map((sem, index) => {
                                return(
                                <ReactBootStrap.Table  key={index} striped bordered hover size="sm">
                                    <thead>
                                    <tr>
                                        <th>Course No</th>
                                        <th>Grade</th>
                                        <th>Units</th>
                                        <th>Enrolled</th>
                                        <th>Term</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {sem.map((item, i) => {
                                        return(
                                                <tr key={i}>
                                                <td>{item.courseNo}</td>
                                                <td>{item.grade}</td>
                                                <td>{item.units}</td>
                                                <td>{item.enrolled}</td>
                                                <td>{item.term}</td>
                                                </tr>
                                        )})}
                                    </tbody>
                                </ReactBootStrap.Table>
                                )
                        })}
                        </div>
                </div>
    
            )
        }else{
            return(
                <Navigate to="/Main" />
            )
        }
        
    }
}

const record = {
    'name': "Maria Makiling",
    'course': "BACA",
    'semesters': [
          [
              {
                  'courseNo': 'ENG 1(AH)',
                  'grade': 2,
                  'units': 3,
                  'enrolled': 6,
                  'term': 6
              },{
                  'courseNo': 'FIL 20',
                  'grade': 2.25,
                  'units': 3,
                  'enrolled': 6.75,
                  'term': 12.75
              },{
                  'courseNo': 'IT 1(MST)',
                  'grade': 2,
                  'units': 3,
                  'enrolled': 6,
                  'term': 18.75
              },{
                  'courseNo': 'PE 1',
                  'grade': 2,
                  'units': 0,
                  'enrolled': 0,
                  'term': 18.75
              },{
                  'courseNo': 'PHILO1(SSP)',
                  'grade': 1.75,
                  'units': 3,
                  'enrolled': 5.25,
                  'term': 24
              },{
                  'courseNo': 'PSY 1(SSP)',
                  'grade': 1.75,
                  'units': 3,
                  'enrolled': 5.25,
                  'term': 29.25
              },{
                  'courseNo': 'SPCM 1(AH)',
                  'grade': 1.75,
                  'units': 3,
                  'enrolled': 5.25,
                  'term': 34.5
              }
          ],[
              {
                  'courseNo': 'ENG 2(AH)',
                  'grade': 1.5,
                  'units': 3,
                  'enrolled': 4.5,
                  'term': 39
              },{
                  'courseNo': 'HUM 1(AH)',
                  'grade': 1.5,
                  'units': 3,
                  'enrolled': 4.5,
                  'term': 43.5
              },{
                  'courseNo': 'HUM 2(AH)',
                  'grade': 1.5,
                  'units': 3,
                  'enrolled': 4.5,
                  'term': 48
              },{
                  'courseNo': 'MATH1(MST)',
                  'grade': 2,
                  'units': 3,
                  'enrolled': 6,
                  'term': 54
              },{
                  'courseNo': 'MATH2(MST)',
                  'grade': 2,
                  'units': 3,
                  'enrolled': 6,
                  'term': 60
              },{
                  'courseNo': 'SOSC1(SSP)',
                  'grade': 2.25,
                  'units': 3,
                  'enrolled': 7.5,
                  'term': 67.5
              }
          ],[
              {
                  'courseNo': 'COMA 101',
                  'grade': 1.25,
                  'units': 3,
                  'enrolled': 3.75,
                  'term': 71.25
              },{
                  'courseNo': 'ENG 4',
                  'grade': 2,
                  'units': 3,
                  'enrolled': 6,
                  'term': 77.25
              },{
                  'courseNo': 'JAP 10',
                  'grade': 1.75,
                  'units': 3,
                  'enrolled': 5.25,
                  'term': 82.5
              },{
                  'courseNo': 'MATH 17',
                  'grade': 1.75,
                  'units': 5,
                  'enrolled': 8.75,
                  'term': 91.25
              },{
                  'courseNo': 'NASC3(MST)',
                  'grade': 2,
                  'units': 3,
                  'enrolled': 6,
                  'term': 91.25
              },{
                  'courseNo': 'NSTP 1',
                  'grade': 1.75,
                  'units': 0,
                  'enrolled': 0,
                  'term': 91.25
              },{
                  'courseNo': 'SPCM 102',
                  'grade': 1.75,
                  'units': 3,
                  'enrolled': 5.25,
                  'term': 102.5
              }
          ],[
              {
                  'courseNo': 'COMA 104',
                  'grade': 1.25,
                  'units': 3,
                  'enrolled': 3.75,
                  'term': 106.25
              },{
                  'courseNo': 'FIL 21',
                  'grade': 2,
                  'units': 3,
                  'enrolled': 6,
                  'term': 112.25
              },{
                  'courseNo': 'JAP 11',
                  'grade': 1.75,
                  'units': 3,
                  'enrolled': 5.25,
                  'term': 117.5
              },{
                  'courseNo': 'MGT 101',
                  'grade': 1.5,
                  'units': 3,
                  'enrolled': 4.5,
                  'term': 122
              },{
                  'courseNo': 'SOC 130',
                  'grade': 2.25,
                  'units': 3,
                  'enrolled': 6.75,
                  'term': 128.75
              },{
                  'courseNo': 'STAT 101',
                  'grade': 1.75,
                  'units': 3,
                  'enrolled': 5.25,
                  'term': 134
              }
          ],[
              {
                  'courseNo': 'ENG 101',
                  'grade': 2,
                  'units': 3,
                  'enrolled': 6,
                  'term': 140
              },{
                  'courseNo': 'COMA 192',
                  'grade': 1,
                  'units': 3,
                  'enrolled': 3,
                  'term': 143
              },{
                  'courseNo': 'COMA 105',
                  'grade': 2,
                  'units': 3,
                  'enrolled': 6,
                  'term': 149
              },{
                  'courseNo': 'HUME 150',
                  'grade': 1.75,
                  'units': 3,
                  'enrolled': 5.25,
                  'term': 154.25
              },{
                  'courseNo': 'PE 2',
                  'grade': 5,
                  'units': 0,
                  'enrolled': 0,
                  'term': 154.25
              },{
                  'courseNo': 'PI 10(SSP)',
                  'grade': 2.25,
                  'units': 3,
                  'enrolled': 6.75,
                  'term': 161
              },{
                  'courseNo': 'THEA 107',
                  'grade': 1,
                  'units': 3,
                  'enrolled': 3,
                  'term': 164
              }
          ],[
              {
                  'courseNo': 'ENG 103',
                  'grade': 2,
                  'units': 3,
                  'enrolled': 6,
                  'term': 170
              },{
                  'courseNo': 'ENG 104',
                  'grade': 2.25,
                  'units': 3,
                  'enrolled': 6.75,
                  'term': 176.75
              },{
                  'courseNo': 'HUME 170',
                  'grade': 2,
                  'units': 3,
                  'enrolled': 6,
                  'term': 182.75
              },{
                  'courseNo': 'NSTP 2',
                  'grade': 1.25,
                  'units': 0,
                  'enrolled': 0,
                  'term': 182.75
              },{
                  'courseNo': 'PHLO 184',
                  'grade': 2,
                  'units': 3,
                  'enrolled': 6,
                  'term': 188.75
              },{
                  'courseNo': 'SOC 112',
                  'grade': 1.75,
                  'units': 3,
                  'enrolled': 5.25,
                  'term': 194
              }
          ],[
              {
                  'courseNo': 'COMA 193',
                  'grade': 1.75,
                  'units': 3,
                  'enrolled': 5.25,
                  'term': 199.25
              },{
                  'courseNo': 'COMA 200',
                  'grade': 'S',
                  'units': 3,
                  'enrolled': 0,
                  'term': 199.25
              },{
                  'courseNo': 'ENG 5',
                  'grade': 1.75,
                  'units': 3,
                  'enrolled': 5.25,
                  'term': 204.5
              },{
                  'courseNo': 'HK 12',
                  'grade': 2.25,
                  'units': 0,
                  'enrolled': 0,
                  'term': 204.5
              },{
                  'courseNo': 'SPCM 101',
                  'grade': 1.5,
                  'units': 3,
                  'enrolled': 4.5,
                  'term': 209
              },{
                  'courseNo': 'SPCM 104',
                  'grade': 2.75,
                  'units': 3,
                  'enrolled': 8.25,
                  'term': 217.25
              }
          ],[
              {
                  'courseNo': 'ENG 156',
                  'grade': 1.5,
                  'units': 3,
                  'enrolled': 4.5,
                  'term': 221.75
              },{
                  'courseNo': 'ENG 155',
                  'grade': 1.25,
                  'units': 3,
                  'enrolled': 3.75,
                  'term': 225.5
              },{
                  'courseNo': 'ENG 102',
                  'grade': 1,
                  'units': 3,
                  'enrolled': 3,
                  'term': 228.5
              },{
                  'courseNo': 'ETHICS 1',
                  'grade': 1.75,
                  'units': 3,
                  'enrolled': 5.25,
                  'term': 233.75
              },{
                  'courseNo': 'STS 1',
                  'grade': 1.75,
                  'units': 3,
                  'enrolled': 5.25,
                  'term': 239
              }
          ],[
              {
                  'courseNo': 'COMA 200',
                  'grade': 'S',
                  'units': 3,
                  'enrolled': 0,
                  'term': 239
              },{
                  'courseNo': 'ENG 152',
                  'grade': 1.25,
                  'units': 3,
                  'enrolled': 3.75,
                  'term': 242.75
              },{
                  'courseNo': 'HK 12',
                  'grade': 2.75,
                  'units': 0,
                  'enrolled': 0,
                  'term': 242.75
              },{
                  'courseNo': 'HK 12',
                  'grade': 1.75,
                  'units': 0,
                  'enrolled': 0,
                  'term': 242.75
              },{
                  'courseNo': 'THEA 101',
                  'grade': 2,
                  'units': 3,
                  'enrolled': 6,
                  'term': 248.75
              }
          ],[
              {
                  'courseNo': 'COMA 200',
                  'grade': 1,
                  'units': 6,
                  'enrolled': 6,
                  'term': 254.75
              }
          ]
      ],
      'totalGrade': 146,
      'totalEnrolled': 254.75,
      'gwa': 1.74486,
      'requiredUnits': 144
  }
export default StudentRecord