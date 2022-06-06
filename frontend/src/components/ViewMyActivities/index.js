import React from "react";
import Axios from 'axios';
import * as ReactBootStrap from 'react-bootstrap';
import styles from './ViewMyActivities.module.css';

class ViewMyActivities extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewActivities: [],
    }
    
    this.getUserActivities = this.getUserActivities.bind(this);
  }

  getUserActivities(){
    Axios.get("http://localhost:3001/finduseractivities",
    {params:{username: this.props.userLocalStorage}}).then((response) => {
      console.log(response.data)
      this.setState({viewActivities: response.data.reverse()});
    })
    console.log(this.state.viewActivities);
  }
  
  componentDidMount() {
    
    this.getUserActivities();
    const str = "viewed user activity history: " + this.props.userLocalStorage;
    Axios.post("http://localhost:3001/addActivity",
    {username: localStorage.getItem("user"), action: str}).then((response) => {
      console.log(response)
    })

  }

  render() {
    if(this.state.viewActivities.length === 0){
      return( 
        <div>
          <div className={styles.title}>
            {this.props.userLocalStorage}'s Activity History
          </div>
          <p>No activity history found.</p>
        </div>
      )
    }else{
      return (
        <div>
          <div className={styles.title}>
            {this.props.userLocalStorage}'s Activity History
          </div>
          <div className={styles.body}>
            <ReactBootStrap.Table striped bordered size="sm" className={styles.table}>
              <thead>
              <tr>
                <th className={styles.date}>Date</th>
                <th className={styles.time}>Time</th>
                <th className={styles.activity}>Activity</th>
              </tr>
              </thead>
              <tbody>
                {this.state.viewActivities.map((activity) => {
                  const date = activity.Date.substr(0,10);
                  var time = activity.Date.substr(11);
                  time = time.replace('.000Z','');
                  return(
                    <tr>
                      <td className={styles.row}>{date}</td>
                      <td className={styles.row}>{time}</td>
                      <td className={styles.row}>{activity.Action}</td>
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

export default ViewMyActivities;