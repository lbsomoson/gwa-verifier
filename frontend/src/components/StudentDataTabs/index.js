import React from 'react';
import styles from './StudentDataTabs.module.css';
import {BasicButton} from '../../components';

class StudentDataTabs extends React.Component{

    render(){
        const studentDataTabs = this.props.data
        return(
            <div>
                {
                   studentDataTabs.map((studentDataTab) => {
                        return (
                            <div className={styles.studentDataTab}>
                                <div className={styles.name}>
                                <h4>NAME</h4>
                                <p>{studentDataTab.Last_Name+", "+studentDataTab.First_Name}</p>
                                </div>
                                <div className={styles.course}>
                                <h4>COURSE</h4>
                                <p>{studentDataTab.Program}</p>
                                </div>
                                <div className={styles.gwa}>
                                <h4>GWA</h4>
                                <p>{studentDataTab.GWA}</p>
                                </div>
                                <div className={styles.view}>
                                    <BasicButton 
                                        label = "view"
                                        color="red" 
                                        variant="outline"
                                        size="small" 
                                    >    
                                    </BasicButton>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default StudentDataTabs;