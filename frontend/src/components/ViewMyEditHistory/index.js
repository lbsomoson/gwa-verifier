import React from "react";
import Axios from 'axios';
import * as ReactBootStrap from 'react-bootstrap';
import styles from './ViewMyEditHistory.module.css';

class ViewMyEditHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      viewEdits: [],
    }

    this.getUserEditActivities = this.getUserEditActivities.bind(this);

  }

  getUserEditActivities() {
    Axios.get("http://localhost:3001/finduseredits",
    {params:{username: this.props.userLocalStorage}}).then((response) => {
        this.setState({viewEdits: response.data.reverse()});
        console.log(this.state.viewEdits);
    })
  }

  componentDidMount() {
    this.getUserEditActivities();

    const str = "viewed user edit history: " + this.props.userLocalStorage;
    Axios.post("http://localhost:3001/addActivity",
    {username: localStorage.getItem("user"), action: str}).then((response) => {
        console.log(response)
    })
  }

  render() {
    if(this.state.viewEdits.length === 0){
      <div>
        <div className={styles.title}>
          {this.props.userLocalStorage}'s Edit History
        </div>
        <p>No edit history found.</p>
      </div>
    }else{
      return (
        <div>
          <div className={styles.title}>
            {this.props.userLocalStorage}'s Edit History
          </div>
          <div className={styles.body}>
            <ReactBootStrap.Table striped bordered size="sm" className={styles.table}>
            <thead>
              <tr>
                <th className={styles.dateEdit}>Date</th>
                <th className={styles.timeEdit}>Time</th>
                <th className={styles.studentIdEdit}>Student ID</th>
                <th className={styles.activityEdit}>Activity</th>
              </tr>
            </thead>
            <tbody>
              {this.state.viewEdits.map((activity) => {
                const date = activity.Datetime_of_edit.substr(0,10);
                var time = activity.Datetime_of_edit.substr(11);
                time = time.replace('.000Z','');
                return(
                  <tr>
                    <td className={styles.row}>{date}</td>
                    <td className={styles.row}>{time}</td>
                    <td className={styles.row}>{activity.Student_ID}</td>
                    <td className={styles.row}>{activity.Edit_notes}</td>
                  </tr>
              )})}
            </tbody>
            </ReactBootStrap.Table>
          </div>
        </div>
      )
    }
  }
}

export default ViewMyEditHistory;