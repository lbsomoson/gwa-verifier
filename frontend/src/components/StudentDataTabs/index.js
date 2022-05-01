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
                                <p>{studentDataTab.name}</p>
                                </div>
                                <div className={styles.course}>
                                <h4>COURSE</h4>
                                <p>{studentDataTab.course}</p>
                                </div>
                                <div className={styles.gwa}>
                                <h4>GWA</h4>
                                <p>{studentDataTab.gwa}</p>
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