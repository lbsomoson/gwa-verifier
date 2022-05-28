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

        this.IGNORE_ELEMENT_LIST = ['BUTTON'];
        this.IGNORE_ID_LIST = [this.EDIT_SECTION, this.EDITING_IN_PROGRESS];
        this.REEVALUATION_LIST = ['TD'];
        this.NOT_GROUP_OF_DATA = [this.MSC];
    }
    static defaultProps = {
        hide: false,
        updateState: () => {
            console.log('there is no function to update state of page');
        },
        giveStateWithKey: () => {
            return this.NO_STATE_GETTER;
        },
        cancelEdit: () => {
            return this.NO_CANCEL;
        }
    }

    //functions from page
        saveEdit = (data, key) => {
            let tableIndexes = key.split('-');
            if(tableIndexes.length === 2){
                let edit = this.props.giveStateWithKey('table' + tableIndexes[0]);
                if (edit === this.NO_STATE_GETTER){
                    console.log(edit);
                    return;
                }
                edit[parseInt(tableIndexes[1])] = data;
                this.props.saveEdit(edit, 'table' + tableIndexes[0]);
            }else{
                this.props.saveEdit(data, key);
            }
        }
        giveStateWithKey = (key) => {
            return this.props.giveStateWithKey(key);
        }

        cancelEdit = (key) => {
            return this.props.cancelEdit(key);
        }

	//changing all elements that are decided to be editable to an input element
    edit = (event) => {
        //styles className Dictionary
            const MSC_STYLE = 'hell1';
            const TABLE_STYLE = 'hell2';

        let button = event.currentTarget;
        let sectionId = button.id.split('_')[0];
        let newElement = this.makeCancelSubmit(sectionId, 'div');

        let edit = [];

        let parent = document.getElementById(sectionId + '_data');
        
        //for semester tables
            let temp = sectionId;
            sectionId = sectionId.substring(0, sectionId.length - 1);

            if(sectionId === this.TABLE){
                let tableIndex = temp.substring(temp.length - 1);
                let tableBody = parent.getElementsByTagName('tbody')[0];
                let tableRows = tableBody.children;

                for (let i = 0; i < tableRows.length; i++){
                    let rowId = tableIndex + '-' + i;

                    let editButton = document.createElement('button');
                        editButton.innerHTML = 'Edit';
                        editButton.id = rowId + '_' + this.EDIT;
                        editButton.onclick = this.edit;

                    let deleteButton = this.makeDelete(rowId);

                    //saving data before everything else
                    let newData = [];
                    for (let j = 0; j < tableRows[i].children.length; j++){
                        newData.push(tableRows[i].children[j].innerHTML);
                    }
                    edit.push(newData);

                    //add the buttons to row
                        let newElement = document.createElement('td');
                            newElement.id = tableIndex + '-' + i + '_' + this.EDIT_SECTION;
                            newElement.appendChild(editButton);
                            newElement.appendChild(deleteButton);
                        tableRows[i].appendChild(newElement);

                }
                    
                //add button for table
                    let addButton = document.createElement('button');
                        addButton.innerHTML = 'Add';
                        addButton.id = temp + '_' + this.ADD;
                        addButton.onclick = (event) => {
                            let button = event.currentTarget;
                            let sectionId = button.id.split('_');
                            let table = document.getElementById(sectionId[0] + '_data');
                            let tableBody = table.querySelector('tbody');
                            
                            //row to be inserted
                                let id = sectionId[0].substring(sectionId[0].length - 1) + '-' + tableBody.children.length
                            
                                let tableRow = document.createElement('tr');
                                    tableRow.id = id + '_' + this.DATA;
                                
                                //adds 5 td elements
                                for (let i = 0; i < 5; i++){
                                    let td = document.createElement('td');
                                    td.contentEditable = true;
                                    tableRow.appendChild(td);
                                }

                                //specific set of buttons for new row
                                    let newElement = document.createElement('td');
                                        newElement.id = id + '_' + this.EDITING_IN_PROGRESS;
                                    
                                    let cancelButton = document.createElement('button');
                                        cancelButton.innerHTML = 'Cancel';
                                        cancelButton.id = id + '_' + this.CANCEL + '_' + this.ADD;
                                        cancelButton.onclick = (event) => {
                                            let button = event.currentTarget;
                                            tableRow = button.parentNode.parentNode;
                                            tableRow.parentNode.removeChild(tableRow);
                                        }
                                    
                                    let submitButton = document.createElement('button');
                                        submitButton.innerHTML = 'Submit';
                                        submitButton.id = id + '_' + this.SUBMIT + '_' + this.ADD;
                                        submitButton.onclick = (event) => {
                                            let button = event.currentTarget;
                                            let sectionId = button.id.split('_')[0];
                                            let parent = document.getElementById(sectionId + '_' + this.DATA);
                                            let newData = [];
                                            for (let i = 0; i < parent.children.length; i++){
                                                if(this.IGNORE_ID_LIST.includes(parent.children[i].id.split('_')[1])){
                                                    continue;
                                                }
                                                parent.children[i].contentEditable = false;
                                                newData.push(parent.children[i].innerHTML);
                                            }
                                            this.saveEdit(newData, sectionId);

                            
                                            //change the buttons
                                                let editButton = document.createElement('button');
                                                    editButton.innerHTML = 'Edit';
                                                    editButton.id = sectionId + '_' + this.EDIT;
                                                    editButton.onclick = this.edit;
                            
                                                let deleteButton = this.makeDelete(sectionId);
                                                
                                                let newElement = document.createElement('td');
                                                    newElement.id = sectionId + '_' + this.EDIT_SECTION;
                                                    newElement.appendChild(editButton);
                                                    newElement.appendChild(deleteButton);
                                                parent.replaceChild(newElement, button.parentNode);

                                        }
                                    
                                    newElement.appendChild(cancelButton);
                                    newElement.appendChild(submitButton);

                                tableRow.appendChild(newElement);
                            
                                tableBody.appendChild(tableRow);
                                
                        }
                
                    newElement.appendChild(addButton);

                sectionId = temp;
            }

        else{
            sectionId = temp;
            for (let i = 0; i < parent.children.length; i++){
                //check if in ignore list
                    if (this.IGNORE_ID_LIST.includes(parent.children[i].id.split('_')[1])){
                        continue;
                    }
                    if (this.REEVALUATION_LIST.includes(parent.children[i].tagName)){
                        if (parent.children[i].children[0] != null){
                            if (this.IGNORE_ELEMENT_LIST.includes(parent.children[i].children[0].tagName)){
                                continue;
                            }
                        }
                    }
                    
                if(sectionId === this.MSC){
                    let element = parent.children[i].querySelector(`[id$="_data"]`);

                    //saving data before everything else
                        let newData =   element.innerHTML;
                        edit.push(newData);

                    element.contentEditable = true;
                }else {parent.children[i].contentEditable = true;}
            }
        }
        
        button.parentNode.parentNode.replaceChild(newElement, button.parentNode);

        let key = sectionId.split('-');
        if(!(key.length === 2)){this.saveEdit(edit, sectionId);}
        
    }
    changeBack = (id) => {
        id = id.split('_');
        let sectionId = id[0];

        let edit = [];

        let parent = document.getElementById(sectionId + '_data');

        let temp = id;
        id = sectionId.substring(0, sectionId.length - 1);
        if(id === this.TABLE){
            let tableIndex = temp[0].substring(temp[0].length - 1);
            let tableBody = parent.getElementsByTagName('tbody')[0];
            let tableRows = tableBody.children;

            //check if a row is still not finalized
                for (let i = 0; i < tableRows.length; i++){
                    let edit = document.getElementById(tableIndex + '-' + i + '_' + this.EDIT_SECTION);
                    if (edit == null) {
                        alert("submit row edits before submiting table edits");
                        return;
                    }
                }

            for (let i = 0; i < tableRows.length; i++){
                let edit = document.getElementById(tableIndex + '-' + i + '_' + this.EDIT_SECTION);
                tableRows[i].removeChild(edit);
            }
            //reverts changes
            if(temp[1] === this.CANCEL){
                parent.innerHTML = this.cancelEdit(sectionId);
                let tableBody = parent.getElementsByTagName('tbody')[0];
                console.log(tableBody);
                for (let i = 0; i < tableBody.children.length; i++){
                    let edit = document.getElementById(tableIndex + '-' + i + '_' + this.EDIT_SECTION);
                    tableBody.children[i].removeChild(edit);
                }
            }

            
            id = temp;
        }else{
            id = temp;
            for (let i = 0; i < parent.children.length; i++){
                //check if in ignore list
                    if (this.IGNORE_ID_LIST.includes(parent.children[i].id.split('_')[1])){
                        continue;
                    }
                    if (this.REEVALUATION_LIST.includes(parent.children[i].tagName)){
                        if (parent.children[i].children[0] != null){
                            if (this.IGNORE_ELEMENT_LIST.includes(parent.children[i].children[0].children[0].tagName)){
                                continue;
                            }
                        }
                    }
                if(sectionId === this.MSC){parent.children[i].querySelector(`[id$="_data"]`).contentEditable = false;}
                else{parent.children[i].contentEditable = false;}
                //update this.state[sectionId]
                    if(id[1] === this.SUBMIT){
                        if(sectionId === this.MSC){
                            let newData =   parent.children[i].querySelector(`[id$="_data"]`).innerHTML;
                            edit.push(newData);
                        }else {
                            let key = sectionId.split('-');
                            if(key.length === 2){
                                edit.push(parent.children[i].innerHTML);
                            }
                        }
                    }
                    if(id[1] === this.CANCEL){
                        if(sectionId === this.MSC){
                            /*edit = this.giveStateWithKey(sectionId);
                            if(data = this.NO_STATE_GETTER){
                                console.log(data);
                                return;
                            }
                            parent.children[i].querySelector(`[id$="_data"]`).innerHTML = edit[i];*/
                            this.cancelEdit(sectionId);
                        }else {
                            let key = sectionId.split('-');
                            if(key.length === 2){
                                /*edit = this.giveStateWithKey('table' + key[0])
                                if(data = this.NO_STATE_GETTER){
                                    console.log(data);
                                    return;
                                }
                                parent.children[i].innerHTML = edit[key[1]][i];*/
                                this.cancelEdit('table' + key[0]);
                            }
                        }
                    }
            }
            if (id[1] === this.SUBMIT) {this.saveEdit(edit, sectionId)}
        }

        //changes buttons
            let editButton = document.createElement('button');
                editButton.innerHTML = 'Edit';
                editButton.id = sectionId + '_' + this.EDIT;
                editButton.onclick = this.edit;

            let key = sectionId.split('-');
            if(key.length === 2){
                let deleteButton = this.makeDelete(sectionId);

                var newElement = document.createElement('td');
                    newElement.id = sectionId + '_' + this.EDIT_SECTION;
                    newElement.appendChild(editButton);
                    newElement.appendChild(deleteButton);
            }else{
                var newElement = document.createElement('div');
                    newElement.id = sectionId + '_' + this.EDIT_SECTION;
                    newElement.appendChild(editButton);
            }
            

            let toBeReplaced = document.getElementById(sectionId + '_' + this.EDITING_IN_PROGRESS);
            toBeReplaced.parentNode.replaceChild(newElement, toBeReplaced);
    }

    makeCancelSubmit = (sectionId, containerType) => {
        
        //cancel button
            let cancelButton = document.createElement('button');
            cancelButton.innerHTML = 'Cancel';
            cancelButton.id = sectionId + '_' + this.CANCEL;
            cancelButton.onclick = (event) => {
                let button = event.currentTarget;
                this.changeBack(button.id);
            };
    
        //submit button
            let submitButton = document.createElement('button');
                submitButton.innerHTML = 'Submit';
                submitButton.id = sectionId + '_' + this.SUBMIT;
                submitButton.onclick = (event) => {
                    let button = event.currentTarget;
                    this.changeBack(button.id);
                };


        let newElement = document.createElement(containerType);
        newElement.id = sectionId + '_' + this.EDITING_IN_PROGRESS; 
        newElement.appendChild(cancelButton);
        newElement.appendChild(submitButton);

        return newElement;
    }

    makeDelete = (rowId) => {
        let deleteButton = document.createElement('button');
            deleteButton.innerHTML = 'Delete';
            deleteButton.id = rowId + '_' + this.DELETE;
            deleteButton.onclick = (event) => {
                let button = event.currentTarget;
                let sectionId = button.id.split('_')[0];
                let tableIndexes = sectionId.split('-');
                let table = document.getElementById(this.TABLE + tableIndexes[0] + '_data');
                let tableBody = table.querySelector('tbody');

                let toBeDeleted = tableBody.children[parseInt(tableIndexes[1])];

                //adjusting id for edit buttons for row
                    for (let i = parseInt(tableIndexes[1]) + 1; i < tableBody.children.length; i++) {
                        tableBody.children[i].id = tableIndexes[0] + '-' + (i - 1) + '_' + this.DATA;
                        let editSection = tableBody.children[i].querySelector(`[id$="_editSection"]`);
                        editSection.id = tableIndexes[0] + '-' + (i - 1) + '_' + this.EDIT_SECTION;
                        editSection.querySelector(`[id$="_edit"]`).id = tableIndexes[0] + '-' + (i - 1) + '_' + this.EDIT;
                        editSection.querySelector(`[id$="_delete"]`).id = tableIndexes[0] + '-' + (i - 1) + '_' + this.DELETE;
                    }

                tableBody.removeChild(toBeDeleted);
                //delete data from this.state
                    let key = 'table' + sectionId.split('-')[0];
                    let arr = this.giveStateWithKey(key);
                    if (arr === this.NO_STATE_GETTER){
                        console.log(arr);
                        return;
                    }
                    console.log(key);
                    arr.splice(parseInt(tableIndexes[1]), 1);
                    this.saveEdit(arr, key);
            }
        
        return deleteButton;
    }

    render() {

        return (
            <div id = {this.props.id + '_' + this.EDIT_SECTION}>
                <button 
                    onClick={this.edit}
                    id = {this.props.id + '_' + this.EDIT}
                    hidden = {this.props.hide}
                >
                    Edit
                </button>
            </div>
        )
    }
}

export default EditStudentRecord;