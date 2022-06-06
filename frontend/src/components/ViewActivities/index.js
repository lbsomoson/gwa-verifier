import React from "react";
import Axios from 'axios';
import * as ReactBootStrap from 'react-bootstrap';
import styles from './ViewActivities.module.css';


class ViewActivities extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            allActivities:[],
        }
    }

    componentDidMount(){
        Axios.get("http://localhost:3001/findallactivities").then((response) => {
            this.setState({allActivities: response.data.reverse()});
            console.log(this.state.allActivities);
        })
    }

    render(){
        const activities = this.state.allActivities;
        return (
            <div className={styles.container}>
                <ReactBootStrap.Table striped bordered size="sm" className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.date}>Date</th>
                            <th className={styles.time}>Time</th>
                            <th className={styles.username}>Username</th>
                            <th className={styles.action}>Activity</th>
                        </tr>
                    </thead>
                <tbody>
                    {
                    activities.map((activity) => {
                        const date = activity.Date.substr(0,10);
                        var time = activity.Date.substr(11);
                        time = time.replace('.000Z','');
                        return(
                            <tr>
                                <td>{date}</td>
                                <td>{time}</td>
                                <td>{activity.Username}</td>
                                <td>{activity.Action}</td>
                            </tr>
                    )})}
                    
                </tbody>
            </ReactBootStrap.Table>
            </div>
        )
    }
}

export default ViewActivities;