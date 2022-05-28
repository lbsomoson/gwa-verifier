import React from "react";
import styles from "./EditStudentRecord.module.css";

const VALID_GRADES = [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 4, 5];
const VALID_GRADES_STRING = ['DRP', 'INC', 'DFG', 'S', 'U'];
const SPECIAL_COURSE_CODE = ['AWOL', 'LOA'];
const SPECIAL_COURSE_SWITCH = false;

//regex
    const insideParenthesis = /^[0-9]+\(([0-9]+)\)$/;
    const insideParenthesisReverse = /^\(([0-9]+)\)+[0-9]$/;
    const courseCode_regex = /^[A-Z]+ [0-9]+$/;

class EditStudentRecord extends React.Component {

    constructor(props){
        super(props);

        //err message
            this.NO_STATE_GETTER = 'no way to get state of page';
            this.NO_CANCEL = 'there is no function to cancel edits';

        //id dictionary
            //this.MSC = 'msc';
            this.TABLE = 'table';
            this.DATA = 'data';

        //button id dictionary;
            this.EDIT = 'edit';
            this.CANCEL = 'cancel';
            this.SUBMIT = 'submit';
            this.ADD = 'add'
            this.DELETE = 'delete';
            this.EDIT_SECTION = 'editSection';
            this.EDITING_IN_PROGRESS = 'editingInProgress';

        this.DELETED_LIST = 'deleted';

        this.IGNORE_ELEMENT_LIST = ['BUTTON', 'BR'];
        this.IGNORE_ID_LIST = [this.EDIT_SECTION, this.EDITING_IN_PROGRESS];
        this.REEVALUATION_LIST = ['TD'];
        //this.NOT_GROUP_OF_DATA = [this.MSC];

        this.state = {
            progress: this.props.initialProgress != null? this.props.initialProgress: this.EDIT_SECTION,
            isEditOn: false,
            edit: [],
            tableRows: [],
            oneRow: false,
            containsSpecialCourseCode: false,
        };
    }
    componentDidMount(){
        if(this.props.initialProgress === this.EDITING_IN_PROGRESS 
            && document.getElementById(this.props.id + '_' + this.DATA).querySelector('tbody').children.length === 0){
            this.setState({ isEditOn: true }, this.add(true));
            
        }
        let table = document.getElementById(this.props.id + '_' + this.DATA);
        let tableBody = table.querySelector('tbody');
        if(tableBody.children.length === 1){
            this.setState({oneRow: true});
            if(SPECIAL_COURSE_CODE.includes(tableBody.children[0].innerHTML) && SPECIAL_COURSE_SWITCH){
                this.setState({containsSpecialCourseCode: true});
            }
        }
    }

    static defaultProps = {
        hide: false,
        saveEdit: () => {
            console.log('there is no function to update state of page');
        },
        ignoreClassList: [],
        initialProgress: this.EDIT_SECTION,
    }

    edit = () => {
        let parent = document.getElementById(this.props.id + '_' + this.DATA);
        let edit = [];

        /*if (this.props.id === this.MSC){
            let elements = parent.getElementsByClassName('data');

            for (let i = 0; i < elements.length; i++){

                //saving data before everything else
                    let newData = elements[i].innerHTML;
                    edit.push(newData);

                elements[i].contentEditable = true;
            }
            this.setState({ 
                isEditOn: true,
                progress: this.EDITING_IN_PROGRESS,
                edit: edit
            });
            this.props.inProgress();
            return;
        }*/
        let sectionId = this.props.id.split('-')[0];
        let tableIndex = this.props.id.split('-')[1];

        if (sectionId === this.TABLE) {
            let tableRows = parent.getElementsByTagName('tbody')[0].children;
            if(tableRows.length === 1){
                this.setState({
                    oneRow: true,
                    containsSpecialCourseCode: SPECIAL_COURSE_CODE.includes(tableRows[0].children.innerHTML && SPECIAL_COURSE_SWITCH)
                });
            }

            let content = [];
            for (let i = 0; i < parent.querySelector('tbody').children.length; i++){
                content = [...content, parent.querySelector('tbody').children[i]];
            }
            //saving table html to revert it when canceled
            this.setState({
                tableRows: content,
            });

            for(let i = 0; i < tableRows.length; i++){
                //getting elements to be ignored  designated by the parent component
                    let ignore = [];
                    for(let k = 0; k < this.props.ignoreClassList.length; k++){
                        let temp = tableRows[i].getElementsByClassName(this.props.ignoreClassList[k]);
                        
                        //checking for duplicates
                            for (let j = 0; j < temp.length; j++)
                            if(!ignore.includes(temp[j])){
                                ignore.push(temp[j]);
                            }
                    }

                let newData = [];
                for(let j = 0; j < tableRows[i].children.length; j++){
                    if(ignore.includes(tableRows[i].children[j])){
                        continue;
                    }

                    //saving before everything else
                    let element = tableRows[i].children[j];
                    newData.push(element.innerHTML);

                }
                edit.push(newData);

                let newEditSection = this.makeTableEditSection(tableIndex + '-' + i);

                tableRows[i].appendChild(newEditSection);
            }
            this.setState({ 
                isEditOn: true,
                progress: this.EDITING_IN_PROGRESS,
                edit: edit
            });
            this.props.inProgress();
            return;
        }

        console.log('no code for this kind of data yet');
    }

    cancel = () => {
        let parent = document.getElementById(this.props.id + '_' + this.DATA);

        /*if (this.props.id === this.MSC){
            let elements = parent.getElementsByClassName('data');

            for (let i = 0; i < elements.length; i++){

                //revert changes
                    elements[i].innerHTML = this.state.edit[i];

                elements[i].contentEditable = false;
            }
            this.setState({ 
                isEditOn: false,
                progress: this.EDIT_SECTION,
                edit: [],
            });
            this.props.inProgress();
            return;
        }*/
        let sectionId = this.props.id.split('-')[0];
        if (sectionId === this.TABLE) {
            let tableBody = parent.getElementsByTagName('tbody')[0];
            tableBody.innerHTML = '';
            for(let i = 0; i < this.state.tableRows.length; i++){
                this.state.tableRows[i].removeChild(this.state.tableRows[i].lastChild);
                tableBody.appendChild(this.state.tableRows[i]);
            }
            this.setState({ 
                isEditOn: false,
                progress: this.EDIT_SECTION,
                edit: [],
                tableRows: [],
                oneRow: false,
            });
            this.props.inProgress();
            return;
        }

        console.log('no code for this kind of data yet');
    }

    submit = () => {
        let parent = document.getElementById(this.props.id + '_' + this.DATA);
        let edit = this.state.edit;

        if(SPECIAL_COURSE_CODE.includes(this.state.edit) && SPECIAL_COURSE_SWITCH){
            this.cancel();
            this.props.saveEdit(edit, this.props.id);
            this.setState({ 
                isEditOn: false,
                progress: this.EDIT_SECTION,
                edit: [],
                oneRow: false,
                tableRows: [],
            });
            return;
        }

        /*if (this.props.id === this.MSC){
            let elements = parent.getElementsByClassName('data');

            for (let i = 0; i < elements.length; i++){

                //saving data before everything else
                    let newData = elements[i].innerHTML;
                    edit.push(newData);

                elements[i].contentEditable = false;
            }
            this.setState({
                isEditOn: false,
                progress: this.EDIT_SECTION,
                edit: []
            });
            this.props.inProgress();
            this.props.saveEdit(edit, this.props.id);
            return;
        }*/
        let sectionId = this.props.id.split('-')[0];

        if (sectionId === this.TABLE) {
            let tableRows = parent.getElementsByTagName('tbody')[0].children;

            //check if a row is in progress
            if(tableRows[0].parentNode.querySelector(`[id$=${this.EDITING_IN_PROGRESS}]`) != null){
                alert(`finalize all edits in rows of ${this.props.id}`);
                return;
            }

            //remove editSection
                for(let i = 0; i < tableRows.length; i++){
                    let editSection = tableRows[i].querySelector(`[id$=${this.EDIT_SECTION}]`);
                    tableRows[i].removeChild(editSection);
                }

            this.setState({ 
                isEditOn: false,
                progress: this.EDIT_SECTION,
                edit: [],
                oneRow: false,
                tableRows: [],
            });
            parent.querySelector('tbody').innerHTML = '';
            for(let i = 0; i < this.state.tableRows.length; i++){
                parent.querySelector('tbody').appendChild(this.state.tableRows[i]);
            }
            this.props.saveEdit(edit, this.props.id);
            console.log(this.state.edit);
            this.props.inProgress();
            return;
        }

        console.log('no code for this kind of data yet');
    }

    add = (fresh) => {
        let sectionId = this.props.id.split('-')[0];
        let tableIndex = this.props.id.split('-')[1];
        let tableBody = document.getElementById(this.props.id + '_' + this.DATA).getElementsByTagName('tbody')[0];
        if(sectionId === this.TABLE){

            //make 4 td in a tr
            let tr = document.createElement('tr');
            for(let i = 0; i < 5; i++) {
                let td = document.createElement('td');
                    td.className = this.props.tdClasses[i];
                if(i < 3){
                    td.contentEditable = true;
                }else{
                    td.innerHTML = '...'
                }
                tr.appendChild(td);
            }
            this.setState(prevState => ({
                edit: [
                    ...prevState.edit,
                    ['', '', '']
                ]
            }), () => {
                tr.appendChild(this.makeTableEditingInProgress(tableIndex + '-' + tableBody.children.length, this.ADD));
                if(typeof fresh === 'boolean' && tableBody.children.length === 1){
                    return;
                }
                tableBody.appendChild(tr);

                //check if only one row
                if(tableBody.children.length === 1){
                    this.setState({oneRow: true}, () => {
                        let deleteButton = document.getElementById(this.props.id.split('-')[1] + '-0' + '_' + this.DELETE);
                        if (deleteButton != null){
                            deleteButton.hidden = true;
                            return;
                        }
                        let cancelButton =  document.getElementById(this.props.id.split('-')[1] + '-0' + '_' + this.CANCEL);
                        if (cancelButton != null){
                            cancelButton.hidden = true;
                            return;
                        }
                    });
                }else if (tableBody.children.length > 1){
                    this.setState({oneRow: false}, () => {
                        let deleteButton = document.getElementById(this.props.id.split('-')[1] + '-0' + '_' + this.DELETE);
                        if (deleteButton != null){
                            deleteButton.hidden = false;
                            return;
                        }
                        let cancelButton =  document.getElementById(this.props.id.split('-')[1] + '-0' + '_' + this.CANCEL);
                        if (cancelButton != null){
                            cancelButton.hidden = false;
                            return;
                        }
                    });
                }
            });
        }
    }

    delete = () => {
        this.cancel();
        this.props.saveEdit('delete', this.props.id);
    }

    inputEventListenerForCourseCode = (event) => {
        let element = event.target;
        console.log(element.innerHTML);
        if(!this.state.oneRow){
            element.removeEventListener('input', this.inputEventListenerForCourseCode);
            return;
        }
        if(SPECIAL_COURSE_CODE.includes(element.innerHTML) && SPECIAL_COURSE_SWITCH){
            element.parentNode.children[1].contentEditable = false;
            element.parentNode.children[2].contentEditable = false;
            element.parentNode.children[1].innerHTML = '...';
            element.parentNode.children[2].innerHTML = '...';
            element.parentNode.children[3].innerHTML = '...';
            this.setState({containsSpecialCourseCode: true});
        }else{
            element.parentNode.children[1].contentEditable = true;
            element.parentNode.children[2].contentEditable = true;
            element.parentNode.children[1].innerHTML = this.state.edit[0][1];
            element.parentNode.children[2].innerHTML = this.state.edit[0][2];
            element.parentNode.children[3].innerHTML = isNaN(this.state.edit[0][1])? 0
                                                        :!isNaN(this.state.edit[0][2])
                                                        ?parseFloat(this.state.edit[0][2]) * parseFloat(this.state.edit[0][1])
                                                        :insideParenthesis.exec(this.state.edit[0][2]) != null
                                                        ?parseFloat(insideParenthesis.exec(this.state.edit[0][2])) * parseFloat(this.state.edit[0][1])
                                                        :insideParenthesisReverse.exec(this.state.edit[0][2]) != null
                                                        ?parseFloat(insideParenthesis.exec(this.state.edit[0][2])) * parseFloat(this.state.edit[0][1])
                                                        : 'err';
            this.setState({containsSpecialCourseCode: false});

        }
        
    }

    makeTableEditSection = (sectionId) => {
        console.log(this.state.oneRow)
        let editButton = document.createElement('button');
            editButton.innerHTML = 'Edit';
            editButton.id = sectionId + '_' + this.EDIT;
            editButton.onclick = (event) => {
                let button = event.currentTarget;
                let sectionId = button.id.split('_')[0];
                let tableIndexes = sectionId.split('-');
                let tableRow = document.getElementById(this.TABLE + '-' + tableIndexes[0] + '_' + this.DATA).querySelector('tbody').children[parseInt(tableIndexes[1])];
                
                //getting elements to be ignored  designated by the parent component
                    let ignore = [];
                    for(let i = 0; i < this.props.ignoreClassList.length; i++){
                        let temp = tableRow.getElementsByClassName(this.props.ignoreClassList[i]);
                        
                        //checking for duplicates
                            for (let j = 0; j < temp.length; j++)
                            if(!ignore.includes(temp[j])){
                                ignore.push(temp[j]);
                            }
                    }
                
                for(let i = 0; i < tableRow.children.length; i++){
                    if(ignore.includes(tableRow.children[i])){
                        continue;
                    }
                    if((!tableRow.children[i].classList.contains('courseCode') && this.containsSpecialCourseCode)
                        && SPECIAL_COURSE_SWITCH){
                        continue;
                    }
                    tableRow.children[i].contentEditable = true;
                    console.log(this.state.oneRow)
                    if((tableRow.children[i].classList.contains('courseCode') && this.state.oneRow)
                        && SPECIAL_COURSE_SWITCH){
                        tableRow.children[i].addEventListener("input", this.inputEventListenerForCourseCode)
                    }
                }

                let container = this.makeTableEditingInProgress(sectionId);
                tableRow.replaceChild(container, button.parentNode);
            };
        let deleteButton = document.createElement('button');
            deleteButton.innerHTML = 'Delete';
            deleteButton.id = sectionId + '_' + this.DELETE;
            deleteButton.onclick = this.deleteFunctionForRow;
            if(document.getElementById(this.props.id + '_' + this.DATA).querySelector('tbody').children.length === 1){
                deleteButton.hidden = true;
            }

        let container = document.createElement('td');
            container.id = sectionId + '_' + this.EDIT_SECTION;
            container.appendChild(editButton);
            container.appendChild(deleteButton);
        return container;
    }

    makeTableEditingInProgress = (sectionId, add) => {
        let cancelButton = document.createElement('button');
            cancelButton.innerHTML = 'Cancel';
            cancelButton.id = sectionId + '_' + this.CANCEL;
            if(add === this.ADD){
                cancelButton.onclick = this.deleteFunctionForRow;
                cancelButton.className = this.ADD;
            }else{
                cancelButton.onclick = (event) => {
                    let button = event.currentTarget;
                    let sectionId = button.id.split('_')[0];
                    let tableIndexes = sectionId.split('-');
                    let tableRow = document.getElementById(this.TABLE + '-' + tableIndexes[0] + '_' + this.DATA).querySelector('tbody').children[parseInt(tableIndexes[1])];
                    
                    //for things related to SPECIAL_COURSE_CODE
                        if(this.state.oneRow && SPECIAL_COURSE_SWITCH){
                            tableRow.children[0].removeEventListener('input', this.inputEventListenerForCourseCode);
                            this.setState({
                                containsSpecialCourseCode: SPECIAL_COURSE_CODE.includes(this.state.edit[parseInt(tableIndexes[1])][0]),
                            });
                        }

                    for(let i = 0; i < tableRow.children.length; i++){

                        if (this.IGNORE_ID_LIST.includes(tableRow.children[i].id.split('_')[1])){
                            continue;
                        }
                        if(tableRow.children[i].classList.contains('weight')){
                            tableRow.children[i].innerHTML = isNaN(tableRow.children[i - 2].innerHTML)? 0
                                                            :!isNaN(tableRow.children[i - 1].innerHTML)
                                                            ?parseFloat(tableRow.children[i - 1].innerHTML) * parseFloat(tableRow.children[i - 2].innerHTML)
                                                            :insideParenthesis.exec(tableRow.children[i - 1].innerHTML) != null
                                                            ?parseFloat(insideParenthesis.exec(tableRow.children[i - 1].innerHTML)[1]) * parseFloat(tableRow.children[i - 2].innerHTML)
                                                            :insideParenthesisReverse.exec(tableRow.children[i - 1].innerHTML) != null
                                                            ?parseFloat(insideParenthesis.exec(tableRow.children[i - 1].innerHTML)[1]) * parseFloat(tableRow.children[i - 2].innerHTML)
                                                            : 'err';
                            continue;
                        }
                        if(tableRow.children[i].classList.contains('cumulative')){
                            tableRow.children[i].innerHTML = '...';
                            continue;
                        }
                        console.log(this.state.edit)
                        tableRow.children[i].innerHTML = this.state.edit[parseInt(tableIndexes[1])][i];

                        tableRow.children[i].contentEditable = false;
                    }
                    let newEditSection = this.makeTableEditSection(sectionId);

                    tableRow.replaceChild(newEditSection, button.parentNode);
                };
            }
        let submitButton = document.createElement('button');
            submitButton.innerHTML = 'Submit';
            submitButton.id = sectionId + '_' + this.SUBMIT;
            submitButton.onclick = (event) => {
                let button = event.currentTarget;
                let sectionId = button.id.split('_')[0];
                let tableIndexes = sectionId.split('-');
                let tableRow = document.getElementById(this.TABLE + '-' + tableIndexes[0] + '_' + this.DATA).querySelector('tbody').children[parseInt(tableIndexes[1])];
                
                //for things related to SPECIAL_COURSE_CODE
                if(this.state.oneRow && SPECIAL_COURSE_SWITCH){
                    tableRow.children[0].removeEventListener('input', this.inputEventListenerForCourseCode);
                    if(this.state.containsSpecialCourseCode){
                        this.setState({edit: tableRow.children[0].innerHTML});
                        let newEditSection = this.makeTableEditSection(sectionId);
                        tableRow.replaceChild(newEditSection, button.parentNode);
                        return;
                    }
                }
                
                //getting elements to be ignored  designated by the parent component
                let ignore = [];
                for(let i = 0; i < this.props.ignoreClassList.length; i++){
                    let temp = tableRow.getElementsByClassName(this.props.ignoreClassList[i]);
                    
                    //checking for duplicates
                        for (let j = 0; j < temp.length; j++)
                        if(!ignore.includes(temp[j])){
                            ignore.push(temp[j]);
                        }
                }
                //check for valid input
                for(let i = 0; i < tableRow.children.length; i++){
                    if(tableRow.children[i].classList.contains('courseCode')){
                        console.log(courseCode_regex.exec(tableRow.children[i].innerHTML))
                        if(courseCode_regex.exec(tableRow.children[i].innerHTML) != null){
                            continue;
                        }
                        else{
                            alert('input is not valid1')
                            return;
                        }
                    }
                    if(tableRow.children[i].classList.contains('units')){
                        let content = tableRow.children[i].innerHTML;
                        let matches = insideParenthesis.exec(content);
                        if(matches != null){
                            continue;
                        }
                        matches = insideParenthesisReverse.exec(content);
                        if(matches != null){
                            continue;
                        }
                        if(!isNaN(content) && !isNaN(parseFloat(content))){
                            if(!(parseFloat(content) == parseInt(content))){
                                alert('input is not valid2')
                                return;
                            }
                            continue;
                        }
                        alert('input is not valid3')
                        return;
                    }
                    if(tableRow.children[i].classList.contains('grade')){
                        let content = tableRow.children[i].innerHTML;
                        if(VALID_GRADES.includes(parseFloat(content))){
                            continue;
                        }
                        if(VALID_GRADES_STRING.includes(content)){
                            continue;
                        }
                        alert('input is not valid4')
                        return;
                    }
                }
                let edit = [];
                for(let i = 0; i < tableRow.children.length; i++){
                    if (this.IGNORE_ID_LIST.includes(tableRow.children[i].id.split('_')[1])){
                        continue;
                    }
                    if(ignore.includes(tableRow.children[i])){
                        if(tableRow.children[i].classList.contains('weight')){
                            tableRow.children[i].innerHTML = isNaN(tableRow.children[i - 2].innerHTML)? 0
                                                            :!isNaN(tableRow.children[i - 1].innerHTML)
                                                            ?parseFloat(tableRow.children[i - 1].innerHTML) * parseFloat(tableRow.children[i - 2].innerHTML)
                                                            :insideParenthesis.exec(tableRow.children[i - 1].innerHTML) != null
                                                            ?parseFloat(insideParenthesis.exec(tableRow.children[i - 1].innerHTML)[1]) * parseFloat(tableRow.children[i - 2].innerHTML)
                                                            :insideParenthesisReverse.exec(tableRow.children[i - 1].innerHTML) != null
                                                            ?parseFloat(insideParenthesis.exec(tableRow.children[i - 1].innerHTML)[1]) * parseFloat(tableRow.children[i - 2].innerHTML)
                                                            : 'err';
                            continue;
                        }
                        if(tableRow.children[i].classList.contains('cumulative')){
                            tableRow.children[i].innerHTML = '...';
                            continue;
                        }
                        continue;
                    }
                    edit.push(tableRow.children[i].innerHTML);

                    tableRow.children[i].contentEditable = false;
                }
                let temp = this.state.edit;
                temp[parseInt(tableIndexes[1])] = edit;

                this.setState(prevState => ({
                    edit: temp
                }));

                let newEditSection = this.makeTableEditSection(sectionId);
                tableRow.replaceChild(newEditSection, button.parentNode);

            };

        let container = document.createElement('td');
            container.id = sectionId + '_' + this.EDITING_IN_PROGRESS;
            container.appendChild(cancelButton);
            container.appendChild(submitButton);

            return container;
    }

    deleteFunctionForRow = (event) => {
        let button = event.currentTarget;
        let sectionId = button.id.split('_')[0];
        let tableIndexes = sectionId.split('-');
        let tableBody = document.getElementById(this.TABLE + '-' + tableIndexes[0] + '_' + this.DATA).querySelector('tbody');
        let tableRow = tableBody.children[parseInt(tableIndexes[1])];

        //changing ids
        for(let i = parseInt(tableIndexes[1]) + 1; i < tableBody.children.length; i++){
            let sectionId = tableIndexes[0] + '-' + (i - 1);
            let editSection = tableBody.children[i].querySelector(`[id$=${this.EDIT_SECTION}]`);
            if(editSection != null){
                editSection.id = sectionId  + '_' + this.EDIT_SECTION;
                editSection.querySelector(`[id$=${this.EDIT}]`).id = sectionId + '_' + this.EDIT; 
                editSection.querySelector(`[id$=${this.DELETE}]`).id = sectionId + '_' + this.DELETE;
                continue;
            }

            let editingInProgress = tableBody.children[i].querySelector(`[id$=${this.EDITING_IN_PROGRESS}]`);
            if(editingInProgress != null){
                editingInProgress.id = sectionId + '_' + this.EDITING_IN_PROGRESS;
                editingInProgress.querySelector(`[id$=${this.CANCEL}]`).id = sectionId + '_' + this.CANCEL; 
                editingInProgress.querySelector(`[id$=${this.SUBMIT}]`).id = sectionId + '_' + this.SUBMIT;
                continue;
            }
            else{console.log('something went wrong in deleting')}
        }
                
        //deleting row
            tableRow.parentNode.removeChild(tableRow);

            let temp = this.state.edit;
            console.log(temp);
            temp.splice(parseInt(tableIndexes[1]), 1);
            this.setState({
                edit: temp,
            });

        //check if only one row
        if(tableBody.children.length === 1){
            this.setState({oneRow: true}, () => {
                if(document.getElementById(this.props.id.split('-')[1] + '-0' + '_' + this.DELETE) != null){
                    document.getElementById(this.props.id.split('-')[1] + '-0' + '_' + this.DELETE).hidden = true;
                    return;
                }
                let cancelButton = document.getElementById(this.props.id.split('-')[1] + '-0' + '_' + this.CANCEL);
                if(cancelButton != null && cancelButton.classList.contains(this.ADD)){
                    cancelButton.hidden = true;
                }
            })
        }
    }

    render() {
        return (
            <div hidden = {this.props.hide && !this.state.isEditOn} id = {this.props.id + '_' + this.state.progress}>
                <button 
                    onClick={this.edit}
                    id = {this.props.id + '_' + this.EDIT}
                    hidden = {this.state.isEditOn}
                >
                    Edit
                </button>
                <button 
                    onClick={this.cancel}
                    id = {this.props.id + '_' + this.CANCEL}
                    hidden = {!this.state.isEditOn || this.props.initialProgress === this.EDITING_IN_PROGRESS}
                >
                    Cancel
                </button>
                <button 
                    onClick={this.submit}
                    id = {this.props.id + '_' + this.SUBMIT}
                    hidden = {!this.state.isEditOn}
                >
                    Submit
                </button>
                <button 
                    onClick={this.add}
                    id = {this.props.id + '_' + this.ADD}
                    hidden = {!this.state.isEditOn}
                >
                    Add
                </button>
                <button 
                    onClick={this.delete}
                    id = {this.props.id + '_' + this.DELETE}
                    hidden = {!this.state.isEditOn}
                >
                    Delete Table
                </button>
            </div>
        )
    }
}

export default EditStudentRecord;