import React from "react";
import Axios from 'axios';
import * as ReactBootStrap from 'react-bootstrap';
import styles from './ViewEdits.module.css';

class ViewEdits extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            allEdits:[],
        }
    }

    componentDidMount(){
        Axios.get("http://localhost:3001/viewedithistory").then((response) => {
            this.setState({allEdits: response.data.reverse()});
            console.log(this.state.allEdits);
        })
    }

    render(){
        const edits = this.state.allEdits;
        return (
          <div className={styles.container}>
            <ReactBootStrap.Table striped bordered size="sm" className={styles.table}>
              <thead>
              <tr>
                  <th className={styles.date}>Date</th>
                  <th className={styles.time}>Time</th>
                  <th className={styles.username}>Username</th>
                  <th className={styles.id}>Student ID</th>
                  <th className={styles.notes}>Edit Notes</th>
              </tr>
              </thead>
              <tbody>
                {
                  edits.map((edit) => {
                    const date = edit.Datetime_of_edit.substr(0,10);
                    var time = edit.Datetime_of_edit.substr(11);
                    time = time.replace('.000Z','');
                    return(
                      <tr>
                        <td>{date}</td>
                        <td>{time}</td>
                        <td>{edit.Username}</td>
                        <td>{edit.Student_ID}</td>
                        <td>{edit.Edit_notes}</td>
                      </tr>
                  )})
                }
                  
              </tbody>
            </ReactBootStrap.Table>
          </div>
        )
    }
}
export default ViewEdits;