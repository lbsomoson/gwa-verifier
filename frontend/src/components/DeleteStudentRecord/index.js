import React from "react";

class DeleteStudentRecord extends React.Component {


	delete() {
        //get the ID to of the data to be deleted
        /*
        let toBeDeleted = this.props//.something;
        */

        //let the backend handle database querries so send the id to backend
        /*
        axios.post(//url,
        {toBeDeleted: toBeDeleted}).then((response) => {
            console.log(response.data);
        });
        */
	}

    render() {

        return (
            <div>
                <button 
					label = 'Delete'
                    onClick={this.delete} 
                />
            </div>
        )
    }
}

export default DeleteStudentRecord;