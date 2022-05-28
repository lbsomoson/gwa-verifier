import React from 'react';
import Axios from 'axios';
import * as ReactBootStrap from 'react-bootstrap';
import styles from './StudentRecord.module.css'
import { BasicButton, EditStudentRecord } from "../../components"
import { Navigate } from "react-router";

//dictionary of keys for object from record
    const COURSE_CODE = 'Course_Code';
    const COURSE_TYPE = 'Course_Type';
    const GRADE = 'Grade';
    const ID = 'ID';
    const STUDENT_ID = 'Student_ID';
    const TERM = 'Term';
    const UNITS = 'Units';
    const WEIGHT = 'Weight';

//ignore for edit
    const IGNORE = 'ignore';

//dictionary for sectionID
    const TABLE = 'table';
    const MSC = 'msc';

class StudentRecord extends React.Component{
  
    constructor(props) {
        super(props)

        this.state = {
            studentID : localStorage.getItem("studentID"),
            studentFN : localStorage.getItem("studentFN"),
            studentLN : localStorage.getItem("studentLN"),
            studentProgram : localStorage.getItem("studentProgram"),
            studentGWA : localStorage.getItem("studentGWA"),
            record: {
                //studentID: '2019-07258',
                semesters: null,
            },
            edits: {},
            deleted: [],
            beforeEdit: {},
            isEditClicked: false,
            isSaveClicked: false,
            isBackClicked: false,
            isDeleteClicked: false
        }
        this.cumulative = 0;

        this.editButtonClicked = this.editButtonClicked.bind(this);
        this.saveButtonClicked = this.saveButtonClicked.bind(this);
        this.backButtonClicked = this.backButtonClicked.bind(this);
        this.deleteButtonClicked = this.deleteButtonClicked.bind(this);
        //this.getRecord = this.getRecord.bind(this);
    }

    componentDidMount(){
        console.log("Here in student record")
        //console.log(this.state.studentID);
        this.getRecord()
    }

    editButtonClicked() {
      this.setState({ isEditClicked: true, isSaveClicked: false });

    }

    saveButtonClicked() {

      let inProgress = document.querySelector(`[id$="editingInProgress"]`);
        if (inProgress == null){
            let final = {
                studentID: this.state.studentID,
                courses: [],
            };
            let editedSemesters = [];
            final.studentID = this.state.studentID;
            let keys = Object.keys(this.state.edits);
            /*
            //adding edited tables
                for (let i = 0; i < keys.length; i++){
                    if(keys[i] === MSC) {
                        //some code
                        continue;
                    }
                    if(keys[i].split('-')[0] === TABLE){
                        let data = this.state.edits[keys[i]];
                        editedSemesters.push(keys[i].split('-')[1]);
                        for(let j = 0; j < data.length; j++){
                            let temp = {};
                            temp[COURSE_CODE] = data[j][0];
                            temp[GRADE] = data[j][1];
                            temp[UNITS] = data[j][2];
                            temp[WEIGHT] = parseFloat(data[j][1]) * parseFloat(data[j][2]);
                            temp[TERM] = keys[i].split('-')[1];
                            final.courses.push(temp);
                        }
                        continue;
                    }
                }
            */
            //adding remaining semester tables
                keys = Object.keys(this.state.record.semesters);
                for (let i = 0; i < keys.length; i++){
                    if(!(keys[i] in editedSemesters)){
                        let data = this.state.record.semesters[keys[i]];
                        for(let j = 0; j < data.length; j++){
                            final.courses.push({
                                [COURSE_CODE]: data[j][COURSE_CODE],
                                [ID]: data[j][ID],
                                [GRADE]: data[j][GRADE],
                                [UNITS]: data[j][UNITS],
                                [WEIGHT]: data[j][WEIGHT],
                                [TERM]: keys[i],
    
                            });
                        }
                    }
                }

            console.log(final);

            Axios.post("http://localhost:3001/editRecord", {data: final}).then().catch((err) => {
                console.log(err)
            })

            this.setState({ isSaveClicked: true, isEditClicked: false });
        }else{
            alert('finalize all edits');
        }
    }
    //assuming the end point receives a post request
    //and the term column follows the formatting I/17/18 meaning sem 1 of sy 2017-2018
    getRecord = () => {
        Axios.post("http://localhost:3001/viewRecords", {id: this.state.studentID})
            .then((response) => {
                let semesters = {};
                for (let i = 0; i < response.data.length; i++){
                    let course = response.data[i];
                    if (!(course[TERM] in semesters)){
                        semesters[course[TERM]] = [
                            {
                                [ID]: course[ID],
                                [COURSE_CODE]: course[COURSE_CODE],
                                [GRADE]: course[GRADE],
                                [UNITS]: course[UNITS],
                                [WEIGHT]: course[WEIGHT],
                                [TERM]: course[TERM],
                            }
                        ]
                        continue;
                    }else{
                        semesters[course[TERM]].push({
                            [ID]: course[ID],
                            [COURSE_CODE]: course[COURSE_CODE],
                            [GRADE]: course[GRADE],
                            [UNITS]: course[UNITS],
                            [WEIGHT]: course[WEIGHT],
                            [TERM]: course[TERM],
                        });
                    }
                }
                console.log(semesters);

                this.setState(prevState => ({
                    record: {...this.state.record,
                        semesters: semesters
                    }
                }));
            })
            .catch((err) => {
                console.log(err.message);
            });

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

        const str = "deleted student: " + this.state.studentLN + " " + this.state.studentFN + " (" + this.state.studentID + ")";
        Axios.post("http://localhost:3001/addActivity",
        {username: localStorage.getItem("user"), action: str}).then((response) => {
            console.log(response)
        })
    }
    cancelButtonClicked = () => {
        window.location.reload()
    }

    //functions for EditStudentRecord
        compileEdit = (data, key) => {
            console.log(data);
            if(key.split('-')[0] === TABLE){
                /*
                this.setState(prevstate => ({
                    edits: {
                        ...prevstate.edits,
                        [key]: data,
                    }
                }));*/
                let temp = [];
                for (let i = 0; i < data.length; i++){
                    temp.push({
                        [COURSE_CODE]: data[i][0],
                        [GRADE]: data[i][1],
                        [UNITS]: data[i][2],
                        [WEIGHT]: parseFloat(data[i][1]) * parseFloat(data[i][2]),
                        [TERM]: key.split('-')[1],
                    })
                }
                this.setState(prevState => ({
                    record: {
                        ...prevState.record,
                        semesters: {
                            ...prevState.record.semesters,
                            [key.split('-')[1]]: temp
                        }
                    }
                }), () => {
                    let rows = document.getElementById(key + '_data').querySelector('tbody').children;
                    for(let i = 0; i < rows.length; i++){
                        if(rows[i].querySelector(`[id$=_editSection]`) != null){
                            rows[i].removeChild(rows[i].lastChild);
                        }
                    }
                });
            }
        }
        /*getDeleted = (data, key) => {
            if(data === 'cancel'){
                this.setState(prevstate => ({
                    deleted: []
                }));
            }else{
                this.setState(prevstate => ({
                    deleted: [
                        ...prevstate.deleted,
                        this.state.record.semesters[key.split('-')[0]][key.split('-')[1]],
                    ]
                }));
            }
        }*/

    render(){
        this.cumulative = 0;

        //console.log(studentID);
        //console.log(studentFN);
        //console.log(studentLN);
        //console.log(studentProgram);
        //console.log(studentGWA);
        if(this.state.isBackClicked === false && this.state.isDeleteClicked === false){
            return(
                <div className={styles.studentRec}>
                    <button onClick={this.getRecord}
                    >Load data from backend(this will be removed)</button>
                    <div className={styles.header}>
                        <div className={styles.left}>

                        {/*enclosed text with no tag with div, labels such as 'Name: ' and their corresponding data with span to be easier to access with how I approach edit function 
                        editing those tags are fine. just inform me
                        className 'data' is the identifier of editable fields, please don't remove it unless needed,
                            -when adding className please do it like this: 'data {newClassName}'
                        -Joachim*/}

                            <div className={styles.studentDetails} id = 'msc_data'>
                                <h4 className={styles.studentName}>
                                    <span className = 'data'>{this.state.studentLN}</span>, <span className = 'data'>{this.state.studentFN}</span>
                                </h4>
                                <h5 className={styles.studentCourse}>
                                    <span className = 'data'>{this.state.studentProgram}</span>
                                </h5>
                                <span>
                                    <span>Total Grade: </span>
                                    <span>{"N/A"}</span>
                                </span><br/>
                                <span>
                                    <span>Total Enrolled: </span>
                                    <span>{"N/A"}</span>
                                </span><br/>
                                <span>
                                    <span>GWA: </span>
                                    <span className = 'data'>{this.state.studentGWA}</span>
                                </span><br/>
                                <span>
                                    <span>Required Units: </span>
                                    <span>{"N/A"}</span>
                                </span><br/>

                                {/*this components makes new buttons if you want to style them i recommend adding the styles to the page style
                                the css selectors are the folowing:
                                    -button[id$='_editSection'] for the div/td containing edit button
                                    -button[id$='_editingInProgress'] for the div/td containing submit button
                                    -button[id$='_edit'] for edit button
                                    -button[id$='_delete'] for delete button
                                    -button[id$='_add'] for add button
                                    -button[id$='_submit'] for submit button
                                    -button[id$='_cancel'] for cancel button
                                
                                i can add classes to them if someone requests

                                -Joachim*/}
                                <EditStudentRecord 
                                    id = 'msc'
                                    hide = {!this.state.isEditClicked}
                                    saveEdit = {this.compileEdit}
                                />
                            </div>
                        </div>
                        <div className={styles.right}>
                                {
                                    this.state.isEditClicked ? 
                                    <div className={styles.btns}>
                                        <button
                                            className = {styles.finalize}
                                            id = 'mainSave'
                                            onClick={this.saveButtonClicked}
                                        >SAVE</button>
                                        <button
                                            className = {styles.finalize}
                                            id = 'mainCancel'
                                            onClick={this.cancelButtonClicked}
                                        >CANCEL</button>
                                    </div>
                                    :
                                    <div className={styles.btns}>
                                        <BasicButton
                                            label="Edit"
                                            color="green" 
                                            variant="filled"
                                            size="small"
                                            block
                                            onClick={this.editButtonClicked}
                                        />
                                    </div>
                                }
                                <div className={styles.btns}>
                                    <BasicButton
                                        label="Delete"
                                        color="green" 
                                        variant="filled"
                                        size="small"
                                        block
                                        onClick={this.deleteButtonClicked}
                                    />
                                </div>
                                <div className={styles.btns}>
                                <BasicButton
                                    label="Back to Student Records"
                                    color="green" 
                                    variant="filled"
                                    size="small"
                                    block
                                    onClick={this.backButtonClicked}
                                />
                                </div>
                         </div>
                    </div>
                    <div className={styles.tableWrapper}>
                        <div className={styles.records}>
                            {this.state.record.semesters == null?
                            <div>LOADING</div>
                            :Object.keys(this.state.record.semesters).map((key, index) => {
                                return(
                                    <div key={index} style = {{position:'relative'}}>
                                        <ReactBootStrap.Table  triped bordered hover size="sm" className={styles.table} id = {'table' + '-' + key +'_data'}>
                                            <thead>
                                            <tr>
                                                <th>Course No</th>
                                                <th>Grade</th>
                                                <th>Units</th>
                                                <th>Weight</th>
                                                <th>Cumulative</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.record.semesters[key].map((item, i) => {
                                                    this.cumulative = item[WEIGHT] + this.cumulative;
                                                    return(
                                                            <tr key={i}>
                                                            <td>{item[COURSE_CODE]}</td>
                                                            <td className = 'number'>{item[GRADE]}</td>
                                                            <td className = 'number int'>{item[UNITS]}</td>
                                                            <td className= {IGNORE + ' weight'}>{item[WEIGHT]}</td>
                                                            <td className= {IGNORE+ ' cumulative'}>{this.cumulative}</td>
                                                            </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </ReactBootStrap.Table>

                                        {/*this components makes new buttons if you want to style them i recommend adding the styles to the page style
                                        the css selectors are the folowing:
                                            -button[id$='_editSection'] for the div containing edit button
                                            -button[id$='_editingInProgress'] for the div containing submit button
                                            -button[id$='_edit'] for edit button
                                            -button[id$='_delete'] for delete button
                                            -button[id$='_add'] for add button
                                            -button[id$='_submit'] for submit button
                                            -button[id$='_cancel'] for cancel button
                                        
                                        i can add classes to them if someone requests

                                        -Joachim*/}
                                        <EditStudentRecord 
                                            id= {'table-' + key}
                                            hide = {!this.state.isEditClicked}
                                            saveEdit = {this.compileEdit}
                                            ignoreClassList = {[IGNORE]}
                                        />
                                    </div>
                                )
                            })}
                        </div>
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

/*
<div className={styles.records}>
                        {record.semesters.map((sem, index) => {
                                return(
                                <ReactBootStrap.Table  key={index} striped bordered hover size="sm" className={styles.table}>
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
*/

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