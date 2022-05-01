import React from "react";
import styles from "./SortTab.module.css";

class SortTab extends React.Component {

	//a prototype of student data to work with while datatype is an issue
	//these are all assumption of what data will this class will get
	static NAME = 'name';
	static STUDENT_NUMBER = 'student number';
	static COURSE = 'course';
	static GWA = 'gwa';

	//made up data
	studentData = [
		{
			'name':			'Mark Philip A. Trinidad',
			'student number':	'201907256', //6 digit number
			'course':			'BSCS', //abbreviate with a dictionary to define them
			'gwa':			'2.25', //number from 1 to 5 inclusive
		},
		{
			'name':			'James T. Suarez',
			'student number':	'2119021365',
			'course':			'BACA',
			'gwa':			'3.0',
		},
		{
			'name':			'Aubrey Miles',
			'student number':	'2020069231',
			'course':			'BSCS',
			'gwa':			'1.5',
		}
	]

	//var initialization
	sortby = 'name';
	direction = true;

	//just in case this needed to read csv
	/*toObjectArray(arr) {
		fs.readFile('people.csv',function (err,data) {
			arr = [];
			if (err) {
    			return console.log(err);
  			}
			var obj = {};
			var bufferString = data.toString();
			var entries = bufferString.split('\n');
			var headers = entries[0].split(',');
			for(var i = 1; i < arr.length i++){
				var entry = entries[i].split(',');
				for( var j = 0; j < entry.length){
					obj[headers[j]].trim()] = entry[j].trim();
				}
				arr.push(obj);
			}
		}


	}*/

	//arranges list of student data with a variable parameter
	//	direction is true if ascending
	sort() {

		//alphabetically
		console.log(this.sortby);
		if(this.sortby === 'name' || this.sortby === 'course') {
			//bubble sort
			for (let j = this.studentData.length - 1; j >= 1 ; j--) {//counts number of items already sorted
				for(let i = 0; i < j; i++) {//iterates every array item on the unsorted part of array

					//if the first letter is same, checks for other letters
					if (this.studentData[i][this.sortby][0] === this.studentData[i+1][this.sortby][0]){	
						for(let k = 1; k < this.studentData[i][this.sortby].length; i++){//iterates every letter

							//if it is the last letter of one of the string, checks for longer string then break for loop
							if (k === this.studentData[i][this.sortby].length - 1){
								if (!(this.studentData[i][this.sortby].length > this.studentData[i+1][this.sortby].length ^ this.direction)){
									let temp = this.studentData[i];
									this.studentData[i] = this.studentData[i+1];
									this.studentData[i+1] = temp;
									break;
								}
							}
							
							//checks if current pair of letter is same
							if (this.studentData[i][this.sortby][k] === this.studentData[i+1][this.sortby][k]){
									continue;
							}

							//checks for swap
							if (!(this.studentData[i][this.sortby][k] > this.studentData[i+1][this.sortby][k] ^ this.direction)) {
								let temp = this.studentData[i];
								this.studentData[i] = this.studentData[i+1];
								this.studentData[i+1] = temp;
							}

							//else
							break;
						}
					}else if (!(this.studentData[i][this.sortby][0] > this.studentData[i+1][this.sortby][0] ^ this.direction)) {
						let temp = this.studentData[i];
						this.studentData[i] = this.studentData[i+1];
						this.studentData[i+1] = temp;
						
					}
					
				}
			}
			return;
		}

		//else	numerically
		//bubble sort
		for (let j = this.studentData.length - 1; j >= 1 ; j--) {//counts number of items already sorted
			for(let i = 0; i < j; i++) {//iterates every array item on the unsorted part of array

				//xnor
				if (!(this.studentData[i][this.sortby] > this.studentData[i+1][this.sortby] ^ this.direction)) {
					let temp = this.studentData[i];
					this.studentData[i] = this.studentData[i+1];
					this.studentData[i+1] = temp;
				}
			}
		}
	}

	displayDebug(){
		document.getElementById('debug_display').removeAttribute("hidden"); 
		for(var j = 0; j < this.studentData.length; j++) {
			if(j === 0){
				document.getElementById('debug_display').innerHTML = '<li>' + this.studentData[j]['name'] + '</li>';
			}else{
				const node = document.createElement("li");
				const textnode = document.createTextNode(this.studentData[j]['name']);
				node.appendChild(textnode);
				document.getElementById("debug_display").appendChild(node);
			}
		}
	}

	handleSelectChange(event){
		event.preventDefault();
		this.sortby = event.target.value;
		this.sort(event.target.value);

		//probably some element constructor or css editing line of code here
		/*
		document.getElementById(STUDENTDATATABS).innerHTML = ''; //delete currentStudentDataTabs
		//probably search for a way to pass the array of object to main page
		*/

		//this.displayDebug();
	}

	handleButtonClick(value){
		this.direction = value;
		this.sort();

		//probably some element constructor or css editing line of code here

		//this.displayDebug();
	}

    render() {

        return (
            <div id={styles['SortTabContainer']}>
                <form id={styles['SortTab']} onSubmit = {this.sort}>
					Sort by:
					<select id = 'SortTabDropDown' className={styles['SortTabContent']} onChange= {(e) => this.handleSelectChange(e)}>
						<option value='name'>Name</option>
						<option value='student number'>Student Number</option>
						<option value='course'>Course</option>
						<option value='gwa'>GWA</option>
					</select>
					<button 
						id = 'arrowdown'
						className={styles['SortTabContent']}
						onClick = {(event) => {
							event.preventDefault();
							this.handleButtonClick(true)}}>&#8639;&#8638;</button>
					<button
						id = 'arrowup'
						className={styles['SortTabContent']}
						onClick = {(event) => {
							event.preventDefault();
							this.handleButtonClick(false)}}>&#8643;&#8642;</button>
                </form>
				<ul id = 'debug_display' hidden></ul>
            </div>
        )
    }
}

export default SortTab;