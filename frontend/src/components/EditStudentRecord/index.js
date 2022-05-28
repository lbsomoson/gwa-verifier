import React from "react";
import styles from "./EditStudentRecord.module.css";

class EditStudentRecord extends React.Component {

    constructor(props){
        super(props);

        //err message
            this.NO_STATE_GETTER = 'no way to get state of page';
            this.NO_CANCEL = 'there is no function to cancel edits';

        //id dictionary
            this.MSC = 'msc';
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
        this.NOT_GROUP_OF_DATA = [this.MSC];

        this.state = {
            progress: this.EDIT_SECTION,
            isEditOn: false,
            edit: {},
            initialTable: '',
        };
    }

    static defaultProps = {
        hide: false,
        saveEdit: () => {
            console.log('there is no function to update state of page');
        },
        ignoreClassList: [],
    }

    edit = () => {
        let parent = document.getElementById(this.props.id + '_' + this.DATA);
        let edit = [];

        if (this.props.id === this.MSC){
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
            return;
        }
        let sectionId = this.props.id.split('-')[0];
        let tableIndex = this.props.id.split('-')[1];

        if (sectionId === this.TABLE) {
            let tableRows = parent.getElementsByTagName('tbody')[0].children;

            let content = [];
            for (let i = 0; i < parent.querySelector('tbody').children.length; i++){
                content = [...content, parent.querySelector('tbody').children[i]];
            }
            //saving table html to revert it when canceled
            this.setState({
                initialTable: parent.getElementsByTagName('tbody')[0].innerHTML,
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
            return;
        }

        console.log('no code for this kind of data yet');
    }

    cancel = () => {
        let parent = document.getElementById(this.props.id + '_' + this.DATA);

        if (this.props.id === this.MSC){
            let elements = parent.getElementsByClassName('data');

            for (let i = 0; i < elements.length; i++){

                //revert changes
                    elements[i].innerHTML = this.state.edit[i];

                elements[i].contentEditable = false;
            }
            this.setState({ 
                isEditOn: false,
                progress: this.EDIT_SECTION,
                edit: {}
            });
            return;
        }
        let sectionId = this.props.id.split('-')[0];
        if (sectionId === this.TABLE) {
            let tableBody = parent.getElementsByTagName('tbody')[0];
            tableBody.innerHTML = this.state.initialTable;
            this.setState({ 
                isEditOn: false,
                progress: this.EDIT_SECTION,
                edit: {},
                initialTable: ''
            });
            return;
        }

        console.log('no code for this kind of data yet');
    }

    submit = () => {
        let parent = document.getElementById(this.props.id + '_' + this.DATA);
        let edit = [];

        if (this.props.id === this.MSC){
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
                edit: {}
            });
            this.props.saveEdit(edit, this.props.id);
            return;
        }
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
                edit: {},
                initialTable: ''
            });
            parent.querySelector('tbody').innerHTML = '';
            for(let i = 0; i < this.state.tableRows.length; i++){
                parent.querySelector('tbody').appendChild(this.state.tableRows[i]);
            }
            this.props.saveEdit(this.state.edit, this.props.id);
            console.log(this.state.edit);
            return;
        }

        console.log('no code for this kind of data yet');
    }

    makeTableEditSection = (sectionId) => {
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
                    tableRow.children[i].contentEditable = true;
                }

                let container = this.makeTableEditingInProgress(sectionId);
                tableRow.replaceChild(container, button.parentNode);
            };
        let deleteButton = document.createElement('button');
            deleteButton.innerHTML = 'Delete';
            deleteButton.id = sectionId + '_' + this.DELETE;
            deleteButton.onclick = (event) => {
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
                    temp.splice(parseInt(tableIndexes[1]), 1);
                    this.setState({
                        edit: temp,
                    });
            }

        let container = document.createElement('td');
            container.id = sectionId + '_' + this.EDIT_SECTION;
            container.appendChild(editButton);
            container.appendChild(deleteButton);
        
        return container;
    }

    makeTableEditingInProgress = (sectionId) => {
        let cancelButton = document.createElement('button');
            cancelButton.innerHTML = 'Cancel';
            cancelButton.id = sectionId + '_' + this.CANCEL;
            cancelButton.onclick = (event) => {
                let button = event.currentTarget;
                let sectionId = button.id.split('_')[0];
                let tableIndexes = sectionId.split('-');
                let tableRow = document.getElementById(this.TABLE + '-' + tableIndexes[0] + '_' + this.DATA).querySelector('tbody').children[parseInt(tableIndexes[1])];
                
                for(let i = 0; i < tableRow.children.length; i++){

                    if (this.IGNORE_ID_LIST.includes(tableRow.children[i].id.split('_')[1])){
                        continue;
                    }
                    if(tableRow.children[i].classList.contains('weight')){
                        tableRow.children[i].innerHTML = parseFloat(tableRow.children[i - 1].innerHTML) * parseFloat(tableRow.children[i - 2].innerHTML);
                        continue;
                    }
                    if(tableRow.children[i].classList.contains('cumulative')){
                        tableRow.children[i].innerHTML = '...';
                        continue;
                    }
                    tableRow.children[i].innerHTML = this.state.edit[parseInt(tableIndexes[1])][i];

                    tableRow.children[i].contentEditable = false;
                }
                let newEditSection = this.makeTableEditSection(sectionId);

                tableRow.replaceChild(newEditSection, button.parentNode);
            };
        let submitButton = document.createElement('button');
            submitButton.innerHTML = 'Submit';
            submitButton.id = sectionId + '_' + this.SUBMIT;
            submitButton.onclick = (event) => {
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
                //check for valid input
                for(let i = 0; i < tableRow.children.length; i++){
                    if(tableRow.children[i].classList.contains('int')){
                        let content = tableRow.children[i].innerHTML;
                        if(!isNaN(content) && !isNaN(parseFloat(content))){
                            if(!(parseFloat(content) == parseInt(content))){
                                alert('input is not valid')
                                return;
                            }
                            continue;
                        }
                        alert('input is not valid')
                        return;
                    }
                    if(tableRow.children[i].classList.contains('number')){
                        let content = tableRow.children[i].innerHTML;
                        if(!isNaN(content) && !isNaN(parseFloat(content))){
                            continue;
                        }
                        alert('input is not valid')
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
                            tableRow.children[i].innerHTML = parseFloat(tableRow.children[i - 1].innerHTML) * parseFloat(tableRow.children[i - 2].innerHTML);
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

    add = () => {
        let sectionId = this.props.id.split('-')[0];
        let tableIndex = this.props.id.split('-')[1];
        let tableBody = document.getElementById(this.props.id + '_' + this.DATA).getElementsByTagName('tbody')[0];
        if(sectionId === this.TABLE){

            //make 4 td in a tr
            let tr = document.createElement('tr');
            for(let i = 0; i < 5; i++) {
                let td = document.createElement('td');
                    td.contentEditable = true;
                tr.appendChild(td);
            }
            tr.appendChild(this.makeTableEditingInProgress(tableIndex + '-' + tableBody.children.length));
            tableBody.appendChild(tr);
            this.setState(prevState => ({
                edit: [...prevState.edit,
                    ['', '', '']
                ]
            }));
        }
    }

    render() {
        return (
            <div hidden = {this.props.hide} id = {this.props.id + '_' + this.state.progress}>
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
                    hidden = {!this.state.isEditOn}
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
            </div>
        )
    }
}

export default EditStudentRecord;