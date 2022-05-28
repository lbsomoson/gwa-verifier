import Axios from 'axios';
import React from "react";
import styles from "./SortTab.module.css";
import BasicButton from "../BasicButton";
import StudentDataTabs from "../StudentDataTabs";

class SortTab extends React.Component {



	constructor(props) {
        super(props)

        this.state = {
			qualified: 0,
			searchLabel: "Lastname,Firstname",
			searchInput: "",
			searchBy: "name",
			sortBy: "name",
			sortOrder: true,  //if true, then ascending order,
			students: this.props.data,
			newStudents: []
        }

		this.handleSelectChange = this.handleSelectChange.bind(this);
		this.SelectedChange = this.SelectedChange.bind(this);
		this.sortButtonFunc = this.sortButtonFunc.bind(this);
		this.sortByGwa = this.sortByGwa.bind(this);
		this.sortByID = this.sortByID.bind(this);
		this.sortByName = this.sortByName.bind(this);
		this.revertData = this.revertData.bind(this);
		this.handleSearchChange = this.handleSearchChange.bind(this);
		this.handleSearchInput = this.handleSearchInput.bind(this);
		this.SearchButtonFunc = this.SearchButtonFunc.bind(this);
		this.showQualified = this.showQualified.bind(this);
		this.searchName = this.searchName.bind(this);
		this.searchGwa = this.searchGwa.bind(this);
		this.searchID = this.searchID.bind(this);
		this.getDownload = this.getDownload.bind(this);

    }//constructor

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


	componentDidMount(){
		console.log("In componenddidmount")
		console.log(this.props.data)
		//this.setState({newStudents : this.state.students})
	}

	handleSelectChange(event){

		this.setState({sortBy: event.target.value});

	}

	handleSearchChange(event){
		console.log("In handle search change");
		let searchingBy = event.target.value;
		console.log(searchingBy);
		this.setState({searchBy: event.target.value});

		if(searchingBy === "name"){
			this.setState({searchLabel : "Lastname, Firstname"});
		}else if(searchingBy === "gwa"){
			this.setState({searchLabel: "GWA"});
		}else if(searchingBy === "student number"){
			this.setState({searchLabel : "20XX-XXXXX"})
		}
		

	}
	handleSearchInput(event){
		this.setState({searchInput : event.target.value})
	}

	//used by the Search Button
	SearchButtonFunc(){
		console.log("Here in SearchButtonFunc");
		//console.log(this.state.searchInput);
		
		if(this.state.searchBy === "name"){
			//console.log("search by name")
			const name_validator = new RegExp('^[A-Z][\s]{0,1}[a-z]+[,][A-Z][a-z]+$');

			if(name_validator.test(this.state.searchInput)){
				console.log("correct name format")
				let name = (this.state.searchInput).split(",")
				console.log(name[0])
				console.log(name[1])

				if(this.state.qualified ===1){
					this.searchName(name[1],name[0])
				}else{
					Axios.post("http://localhost:3001/searchstudents",
        			{fn: name[1], ln: name[0]}
        			).then((response) => {
						if(response.data.length > 0){
							this.props.func(response.data)
						}else{
							alert("No record found")
						}
        			})
				}
				
			}else{
				alert("Place valid format for Name")
			}
		}else if (this.state.searchBy === "gwa"){
			//console.log("search by gwa")
			const gwa_validator = new RegExp('^(1|2).[0-9]{0,4}$');

			if(gwa_validator.test(this.state.searchInput)){
				console.log("correct gwa format")
				let gwa = this.state.searchInput

				if(this.state.qualified === 1){
					this.searchGwa(gwa)
				}else{
					Axios.post("http://localhost:3001/searchstudentsGwa",
        			{gwa: gwa}
        			).then((response) => {
						if(response.data.length > 0){
							this.props.func(response.data)
						}else{
							alert("No record found")
						}
        			})

				}

			}else{
				alert("Place valid format for GWA")
			}
		}else if (this.state.searchBy === "student number"){
			//console.log("search by gwa")
			const sn_validator = new RegExp('^20[0-9]{2}-[0-9]{5}$');

			if(sn_validator.test(this.state.searchInput)){
				console.log("correct student number format")
				let id = this.state.searchInput

				if(this.state.qualified === 1){
					this.searchID(id)
				}else{
					Axios.post("http://localhost:3001/searchstudentsID",
        			{id: id}
        			).then((response) => {
						if(response.data.length > 0){
							this.props.func(response.data)
						}else{
							alert("No record found")
						}
        			})
				}
			}else{
				alert("Place valid format for Student No.")
			}

		}
		
	}

	searchName(firstName,lastName){

		let searched = []
		let data = this.props.qual

		for(let i = 0; i<data.length; i++){
			if((data[i].First_Name.toLowerCase() === firstName.toLowerCase()) && (data[i].Last_Name.toLowerCase() === lastName.toLowerCase())){
				console.log("push")
				searched.push(data[i])
			}
		}

		if(searched.length === 0){
			alert("No record found on Qualified")
		}else{
			this.props.func(searched)
		}
	}


	searchGwa(gwa){

		let searched = []
		let data = this.props.qual

		for(let i = 0; i<data.length; i++){
			console.log(data[i].GWA+" === "+gwa)
			if((data[i].GWA == gwa)){
				searched.push(data[i])
			}
		}

		if(searched.length === 0){
			alert("No record found on Qualified")
		}else{
			this.props.func(searched)
		}

	}

	searchID(id){

		let searched = []
		let data = this.props.qual

		for(let i = 0; i<data.length; i++){
			if((data[i].ID === id)){
				searched.push(data[i])
			}
		}

		if(searched.length === 0){
			alert("No record found on Qualified")
		}else{
			this.props.func(searched)
		}

	}


	SelectedChange(){
		console.log("In SelectedChange()");
		console.log(this.state.sortBy);
	}

	handleButtonClick(value){
		this.setState({sortOrder: value});

	}

	sortButtonFunc(){
		console.log("sortButtonFunc");
		console.log(this.state.sortBy);
		console.log(this.state.sortOrder);
		
		if(this.state.sortBy === "gwa"){
			if(this.state.sortOrder){
				this.sortByGwa(true);
			}else{
				this.sortByGwa(false);
			}
		}else if(this.state.sortBy === "student number"){
			if(this.state.sortOrder){
				this.sortByID(true);
			}else{
				this.sortByID(false);
			}
		}else if(this.state.sortBy === "name"){
			if(this.state.sortOrder){
				this.sortByName(true);
			}else{
				this.sortByName(false);
			}	
		}

	}//sortButtonFunc

	sortByGwa(order){
		console.log("In sortByGwa")
		//console.log(array1)
		let currentArray = this.props.data;
		let cArrayLen = currentArray.length;
		let newArray = [];

		//console.log(currentArray);
	
		for(let i = 0; i<currentArray.length; i++){
            let newArrayLength = newArray.length
			if(newArray.length === 0){
				newArray.push(currentArray[0]);
			}else{
				//console.log("newArrayLength: "+newArrayLength);
					for(let j = 0; j<newArrayLength;j++ ){
						//console.log("i: "+i+" j: "+j+" "+currentArray[i].GWA+" <= "+newArray[j].GWA);
						if(currentArray[i].GWA < newArray[j].GWA){
							//console.log("if");
							newArray.splice(j,0,currentArray[i]);
							//console.log(newArray);
							break;
						}else{
							//console.log("else");
							if(j === newArray.length-1){
								newArray.push(currentArray[i])
								//console.log(newArray);
							}
						}
					}
						
				}

		}

		if(order === false){
			newArray = newArray.reverse();
		}

		//console.log("new Array");
		//console.log(newArray);

		this.props.func(newArray);
	}//sortByGwa

	sortByID(order){
		console.log("In sortByID");
		console.log("order: "+order);
		let currentArray = this.props.data;
		let cArrayLen = currentArray.length;
		let newArray = [];

		for(let i = 0; i<currentArray.length; i++){
            let newArrayLength = newArray.length
            if(newArray.length === 0){
                newArray.push(currentArray[0]);
            }else{

                for(let j = 0; j<newArrayLength;j++ ){
                    console.log("i: "+i+" j: "+j+" "+parseInt(currentArray[i].ID.replace('-',''))+" <= "+parseInt(newArray[j].ID.replace('-','')));
                    if(parseInt(currentArray[i].ID.replace('-','')) < parseInt(newArray[j].ID.replace('-',''))){
                        //console.log("if");
                        newArray.splice(j,0,currentArray[i]);
                        //console.log(newArray);
                        break;
                    }else{
                        //console.log("else");
                        if(j === newArray.length-1){
                            newArray.push(currentArray[i])
                            //console.log(newArray);
                        }
                    }
                }
                
            }

        }

		if(order === false){
			newArray = newArray.reverse();
		}

		//console.log(newArray)
		this.props.func(newArray);
	}//sortByID


	sortByName(order){
		console.log("In sortByName")
		//console.log(array1)
		let currentArray = this.props.data;
		let cArrayLen = currentArray.length;
		let newArray = [];

		console.log(currentArray);
	
        for(let i = 0; i<currentArray.length; i++){
            let newArrayLength = newArray.length
            if(newArray.length === 0){
                newArray.push(currentArray[0]);
            }else{
            console.log("newArrayLength: "+newArrayLength);
                for(let j = 0; j<newArrayLength;j++ ){
                    //console.log("i: "+i+" j: "+j+" "+currentArray[i].GWA+" <= "+newArray[j].GWA);
                    if(currentArray[i].Last_Name.localeCompare(newArray[j].Last_Name) === -1){
                        //console.log("if");
                        newArray.splice(j,0,currentArray[i]);
                        //console.log(newArray);
                        break;
                    }else if (currentArray[i].Last_Name.localeCompare(newArray[j].Last_Name) === 0){  //if same last names
                        //console.log("else if");
                        if(currentArray[i].First_Name.localeCompare(newArray[j].First_Name) === -1){
                            newArray.splice(j,0,currentArray[i]);
                            //console.log(newArray);
                            break;
                        }

                    }else{
                        //console.log("else");
                        if(j === newArray.length-1){
                            newArray.push(currentArray[i])
                            //console.log(newArray);
                        }
                    }
                }
                
            }


        }


		if(order === false){
			newArray = newArray.reverse();
		}

		//console.log("new Array");
		//console.log(newArray);

		this.props.func(newArray);
	}//sortByName

	//used by revert button
	revertData(){
		if(this.state.qualified === 1){
			this.props.func(this.props.qual);
		}else{
			this.props.func(this.props.save);
		}
	}

	//used by Qualified button
	//shows the qualified students when clicked
	showQualified(){
		if(this.state.qualified === 0){
			this.setState({qualified : 1})
			this.props.func(this.props.qual);
		}else{
			this.setState({qualified : 0})
			this.props.func(this.props.save);
		}
		
	}

	getDownload(){
		Axios.get("http://localhost:3001/downloadSummary",
		).then((response) => {
						console.log(response)
        			})

	}
    render() {

        return (
			<div>
            <div id={styles['SortTabContainer']}>
                <form id={styles['SortTab']} onSubmit = {this.sort}>
					Sort by:
					<select id = 'SortTabDropDown' className={styles['SortTabContent']} onChange= {(e) => this.handleSelectChange(e)}>
						<option value='name'>Name</option>
						<option value='student number'>Student Number</option>
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
				<BasicButton
                    label = "Sort"
                    onClick={this.sortButtonFunc} 
                    color="green" 
                    variant="filled"
                    size="small" 
                ></BasicButton>
				
            </div>
			<div className={styles['searchTab']}>
				
				<select id = 'SortTabDropDown' className={styles['SortTabContent']} onChange= {(e) => this.handleSearchChange(e)}>
						<option value='name'>Name</option>
						<option value='student number'>Student Number</option>
						<option value='gwa'>GWA</option>
					</select>	
				<input 
					className={styles['inputF']}
                    type="text" 
                    placeholder={this.state.searchLabel}  
					onChange = {(e => this.handleSearchInput(e))}                      
                    />

				<div className={styles['searchBtn']}>
				<BasicButton
                    label = "Search"
                    onClick={this.SearchButtonFunc} 
                    color="green" 
                    variant="filled"
                    size="small" 
                ></BasicButton>
				</div>
				<div className={styles['searchBtn']}>
				<BasicButton

                    label = "Revert"
                    onClick={this.revertData} 
                    color="green" 
                    variant="filled"
                    size="small" 
                ></BasicButton>
				</div>
				<div className={styles['searchBtn']}>
				<BasicButton

                    label = "Qualified"
                    onClick={this.showQualified} 
                    color="green" 
                    variant="filled"
                    size="small" 
                ></BasicButton>
				</div>
				
				<BasicButton

                    label = "Download"
                    onClick={this.getDownload} 
                    color="green" 
                    variant="filled"
                    size="small" 
                ></BasicButton>
				
								
				</div>
				
			</div>
        )
    }
}

export default SortTab;