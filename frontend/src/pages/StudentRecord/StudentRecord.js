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

const TD_CLASSES = ['courseCode', 'grade', 'units', IGNORE + ' weight', IGNORE + ' cumulative']

const SPECIAL_COURSE_CODE = ['AWOL', 'LOA'];
const SPECIAL_COURSE_SWITCH = true;

//regex
    const insideParenthesis = /^[0-9]+\(([0-9]+)\)$/;
    const insideParenthesisReverse = /^\(([0-9]+)\)+[0-9]$/;
    const semesterName = /^((First|Second) Semester SY 20[0-9][0-9]-20[0-9][0-9]|Midyear 20[0-9][0-9])$/;



class StudentRecord extends React.Component{
  
    constructor(props) {
        super(props)

        this.state = {
            studentID : localStorage.getItem("studentID"),
            studentFN : localStorage.getItem("studentFN"),
            studentLN : localStorage.getItem("studentLN"),
            studentProgram : localStorage.getItem("studentProgram"),
            studentGWA : localStorage.getItem("studentGWA"),
            totalGrade: 0,
            totalUnits: 0,
            semesters: null,
            freshlyAddedSem: null,
            edits: {},
            deleted: [],
            beforeEdit: {},
            isEditClicked: false,
            isSaveClicked: false,
            isBackClicked: false,
            isDeleteClicked: false,
            tableEditOn: false,
            isAddTableClicked: false,
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
                studentProgram: this.state.studentProgram,
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
                keys = Object.keys(this.state.semesters);
                for (let i = 0; i < keys.length; i++){
                    if(!(keys[i] in editedSemesters)){
                        let data = this.state.semesters[keys[i]];
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
            Axios.post("http://localhost:3001/editRecord", {data:final})
            .then((response) => {
                if(response) {
                    this.setState({ isSaveClicked: true, isEditClicked: false });
                }else{
                    alert('Failed to save edits')
                }
                
            })
            .catch((err) => {
                console.log(err.message);
            });



        }else{
            alert('finalize all edits');
        }
    }
    //assuming the end point receives a post request
    //and the term column follows the formatting I/17/18 meaning sem 1 of sy 2017-2018
    getRecord = () => {
        let totalGrade = 0;
        let totalUnits = 0;
        Axios.post("http://localhost:3001/viewRecords", {id: this.state.studentID})
            .then((response) => {
                let semesters = {};
                for (let i = 0; i < response.data.length; i++){
                    let course = response.data[i];
                    if (SPECIAL_COURSE_CODE.includes(course[COURSE_CODE]) && SPECIAL_COURSE_SWITCH){
                        semesters[course[TERM]] = course[COURSE_CODE];
                    }
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
                    if(!isNaN(course[GRADE])){totalGrade = parseFloat(course[GRADE]) + totalGrade;}
                    totalUnits = parseInt(course[UNITS]) + totalUnits;
                }
                console.log(semesters);

                this.setState(prevState => ({
                    totalGrade: totalGrade,
                    totalUnits: totalUnits,
                    semesters: semesters,
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
                if(data === 'delete') {
                    let temp = this.state.semesters;
                    delete temp[key.split('-')[1]];
                    this.setState(prevState => ({
                        semesters: temp,
                    }), () => {
                        console.log(this.state)
                        let tables = document.querySelectorAll(`table[id$='data']`);
                        for(let i = 0; i < tables.length; i++){
                            let rows = tables[i].querySelector("tbody").children;
                            for(let j = 0; j < rows.length; j++){
                                if(rows[j].querySelector(`[id$=_editSection]`) != null){
                                    rows[j].removeChild(rows[j].lastChild);
                                }
                            }
                        }
    
                        let totalGrade = 0;
                        let totalUnits = 0;
                        for(let key in this.state.semesters){
                            for(let i = 0; i < this.state.semesters[key].length; i++){
                                if(!isNaN(this.state.semesters[key][i][GRADE])){
                                    totalGrade = parseFloat(this.state.semesters[key][i][GRADE]) + totalGrade;
                                }
                                totalUnits = !isNaN(this.state.semesters[key][i][GRADE])?
                                            !isNaN(this.state.semesters[key][i][GRADE])?
                                                parseFloat(this.state.semesters[key][i][UNITS]) + totalUnits
                                                :insideParenthesis.exec(this.state.semesters[key][i][UNITS]) != null?
                                                    parseFloat(insideParenthesis.exec(this.state.semesters[key][i][UNITS])[1]) + totalUnits
                                                    :insideParenthesisReverse.exec(data[i][2]) != null?
                                                        parseFloat(insideParenthesis.exec(this.state.semesters[key][i][UNITS])[1]) + totalUnits
                                                        :'err'
                                            :totalUnits;
                            }
                        }
                        this.setState({
                            totalGrade: totalGrade,
                            totalUnits: totalUnits,
                            studentGWA: totalGrade / totalUnits,
                        })
                    });
                    return;
                }
                if(SPECIAL_COURSE_CODE.includes(data) && SPECIAL_COURSE_SWITCH){
                    this.setState(prevstate =>({
                        semesters: {
                            ...prevstate.semesters,
                            [key.split('-')[1]]: data,
                        }
                    }), () =>{
                        let totalGrade = 0;
                        let totalUnits = 0;
                        for(let key in this.state.semesters){
                            for(let i = 0; i < this.state.semesters[key].length; i++){
                                if(!isNaN(this.state.semesters[key][i][GRADE])){
                                    totalGrade = parseFloat(this.state.semesters[key][i][GRADE]) + totalGrade;
                                }
                                totalUnits = !isNaN(this.state.semesters[key][i][GRADE])?
                                                !isNaN(this.state.semesters[key][i][GRADE])?
                                                    parseFloat(this.state.semesters[key][i][UNITS]) + totalUnits
                                                    :insideParenthesis.exec(this.state.semesters[key][i][UNITS]) != null?
                                                        parseFloat(insideParenthesis.exec(this.state.semesters[key][i][UNITS])[1]) + totalUnits
                                                        :insideParenthesisReverse.exec(data[i][2]) != null?
                                                            parseFloat(insideParenthesis.exec(this.state.semesters[key][i][UNITS])[1]) + totalUnits
                                                            :'err'
                                            : totalUnits;
                            }
                        }
                        this.setState({
                            totalGrade: totalGrade,
                            totalUnits: totalUnits,
                            studentGWA: totalGrade / totalUnits,
                        })
                    });
                    return;
                }
                let temp = [];
                for (let i = 0; i < data.length; i++){
                    temp.push({
                        [COURSE_CODE]: data[i][0],
                        [GRADE]: data[i][1],
                        [UNITS]: data[i][2],
                        [TERM]: key.split('-')[1],
                        [WEIGHT]: isNaN(data[i][1])? 0
                                :!isNaN(data[i][2])
                                ?parseFloat(data[i][2]) * parseFloat(data[i][1])
                                :insideParenthesis.exec(data[i][2]) != null
                                ?parseFloat(insideParenthesis.exec(data[i][2])[1]) * parseFloat(data[i][1])
                                :insideParenthesisReverse.exec(data[i][2]) != null
                                ?parseFloat(insideParenthesis.exec(data[i][2])[1]) * parseFloat(data[i][1])
                                : 'err',
                    })
                }
                //two setStates to force re render
                this.setState(prevState => ({
                    semesters: {
                        ...prevState.semesters,
                        [key.split('-')[1]]: [],
                    }
                }), () => {
                    this.setState(prevState => ({
                        semesters: {
                            ...prevState.semesters,
                            [key.split('-')[1]]: temp
                        }
                    }), () => {
                        let rows = document.getElementById(key + '_data').querySelector('tbody').children;
                        for(let i = 0; i < rows.length; i++){
                            if(rows[i].querySelector(`[id$=_editSection]`) != null){
                                rows[i].removeChild(rows[i].lastChild);
                            }
                        }
    
                        let totalGrade = 0;
                        let totalUnits = 0;
                        for(let key in this.state.semesters){
                            for(let i = 0; i < this.state.semesters[key].length; i++){
                                if(!isNaN(this.state.semesters[key][i][GRADE])){
                                    totalGrade = parseFloat(this.state.semesters[key][i][GRADE]) + totalGrade;
                                }
                                totalUnits = !isNaN(this.state.semesters[key][i][GRADE])?
                                                !isNaN(this.state.semesters[key][i][GRADE])?
                                                    parseFloat(this.state.semesters[key][i][UNITS]) + totalUnits
                                                    :insideParenthesis.exec(this.state.semesters[key][i][UNITS]) != null?
                                                        parseFloat(insideParenthesis.exec(this.state.semesters[key][i][UNITS])[1]) + totalUnits
                                                        :insideParenthesisReverse.exec(data[i][2]) != null?
                                                            parseFloat(insideParenthesis.exec(this.state.semesters[key][i][UNITS])[1]) + totalUnits
                                                            :'err'
                                            : totalUnits;
                            }
                        }
                        this.setState({
                            totalGrade: totalGrade,
                            totalUnits: totalUnits,
                            studentGWA: totalGrade / totalUnits,
                        })
                    });
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
    
    selectAllOnEditableElement = (event) => {
        //this is here to select content when clicked
        let cell = event.target;
        let range, selection;
        if (document.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(cell);
            range.select();
        } else if (window.getSelection) {
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(cell);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

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
                    {this.state.isSaveClicked? 
                        <div id = 'editNotes' className = {styles.prompt}>Edit Notes:
                            <div><p id = 'editNotes_data' contentEditable onFocus={this.selectAllOnEditableElement}
                            >Type here...</p></div>
                            <button id = 'ediNotes_submit' onClick={() => {
                                let element = document.getElementById('editNotes_data');
                                if(element == null){
                                    console.log('error occured');
                                    return;
                                }
                                if(element.innerHTML.length > 255){
                                    alert('Please limit the note to 255 characters');
                                    return;
                                }else{
                                    Axios.post("http://localhost:3001/addedithistory", {
                                        Username: localStorage.getItem('user'),
                                        ID: this.state.studentID,
                                        notes: element.innerHTML,
                                    }).then((response) => {
                                            this.setState({ isSaveClicked: false, isEditClicked: false });
                                    })
                                    .catch((err) => {
                                        console.log(err.message);
                                    });
                                }
                            }}>SAVE</button>
                        </div> 
                    :null}
                    {this.state.isAddTableClicked?
                        <div className = {styles.prompt} id = 'semesterInput'
                            onBlur = {() => {
                                    this.setState({isAddTableClicked: false})
                                }
                            }>
                            <div contentEditable 
                                onFocus={this.selectAllOnEditableElement}
                                onKeyDown = { (event) => {
                                    let element = event.target;
                                    if(event.key === 'Enter'){
                                        if(semesterName.exec(element.innerHTML) != null){
                                            let particles = element.innerHTML.split(' ');
                                            let semester = particles[0] !== 'Midyear'? 
                                                                particles[0] === 'First'? 'l/' + particles[3].split('-')[0].substring(2) + '/' + particles[3].split('-')[1].substring(2)
                                                                    :particles[0] === 'Second'? 'll/' + particles[3].split('-')[0].substring(2) + '/' + particles[3].split('-')[1].substring(2)
                                                                        : 'something went wrong'
                                                                : 'midyear ' + particles[1];
                                            this.setState(prevstate =>({
                                                isAddTableClicked: false,
                                                semesters:{
                                                    ...prevstate.semesters,
                                                    [semester]:[],
                                                },
                                                freshlyAddedSem: semester,
                                                tableEditOn: true,
                                            }));
                                            return;
                                        }else{
                                            alert('input invalid \n e.g: First Semester SY 2017-2019; Midyear 2030')
                                        }
                                    }
                                }}
                                >Semester... e.g: First Semester SY 2017-2019; Midyear 2030
                            </div>
                        </div>
                    :null}
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
                                    <span>{this.state.totalGrade}</span>
                                </span><br/>
                                <span>
                                    <span>Total Enrolled Units: </span>
                                    <span>{this.state.totalUnits}</span>
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
                                {/*<EditStudentRecord 
                                    id = 'msc'
                                    hide = {!this.state.isEditClicked}
                                    saveEdit = {this.compileEdit}
                                />*/}
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
                            {this.state.semesters == null?
                            <div style = {{color: 'white'}}>Failed To Load Data, Please Refresh</div>
                            :Object.keys(this.state.semesters).map((key, index) => {
                                return(
                                    <div key={index} style = {{position:'relative'}}>
                                        <div style = {{color: 'white'}}>{key.split('/').length === 3
                                            ?(key.split('/')[0] === 'l'? 
                                                'First Semester ' 
                                                :key.split('/')[0] === 'll'?
                                                'Second Semester '
                                                :'something went wrong') + 'SY 20' + key.split('/')[1] + '-20' + key.split('/')[2]
                                            :key.split(' ').length === 2
                                                ?key.split(' ')[0] === 'midyear'
                                                ?'Midyear ' + key.split(' ')[1]
                                                :'something went wrong'
                                            : null}</div>
                                        <ReactBootStrap.Table  triped = 'true' bordered hover size="sm" className={styles.table} id = {'table-' + key +'_data'}>
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
                                                {SPECIAL_COURSE_CODE.includes(this.state.semesters[key]) && SPECIAL_COURSE_SWITCH?
                                                                <tr>
                                                                <td className = 'courseCode'>{this.state.semesters[key]}</td>
                                                                <td className = 'grade'>...</td>
                                                                <td className = 'units'>...</td>
                                                                <td className= {IGNORE + ' weight'}>...</td>
                                                                <td className= {IGNORE+ ' cumulative'}>{this.cumulative}</td>
                                                                </tr>
                                                    :this.state.semesters[key].map((item, i) => {
                                                        this.cumulative = parseFloat(item[WEIGHT]) + this.cumulative;
                                                        return(
                                                                <tr key={i}>
                                                                <td className = 'courseCode'>{item[COURSE_CODE]}</td>
                                                                <td className = 'grade'>{item[GRADE]}</td>
                                                                <td className = 'units'>{item[UNITS]}</td>
                                                                <td className= {IGNORE + ' weight'}>{item[WEIGHT]}</td>
                                                                <td className= {IGNORE+ ' cumulative'}>{this.cumulative}</td>
                                                                </tr>
                                                        )
                                                    })
                                                }
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
                                            hide = {!this.state.isEditClicked || this.state.tableEditOn}
                                            saveEdit = {this.compileEdit}
                                            ignoreClassList = {[IGNORE]}
                                            inProgress = {() => {this.setState(prevstate =>({tableEditOn: !prevstate.tableEditOn}))}}
                                            initialProgress = {this.state.freshlyAddedSem === key? 'editingInProgress': undefined}
                                            tdClasses = {TD_CLASSES}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                        {this.state.isEditClicked && !this.state.tableEditOn? 
                            <button onClick = {() => {
                                this.setState({isAddTableClicked: true}, () => {
                                    document.getElementById('semesterInput').children[0].focus();
                                });
                            }}>ADD TABLE</button>
                            : null
                        }
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
export default StudentRecord