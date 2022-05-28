import React from 'react';
import * as ReactBootStrap from 'react-bootstrap';

import { EditStudentRecord } from '../../components';

class StudentData extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            record: {
                'name': "Maria Makiling",
                'course': "BACA",
                'semesters': [
                      [
                          {
                              'courseNo': 'ENG 1(AH)',
                              'grade': 2,
                              'units': 3,
                              'enrolled': 6,
                              'term': 6
                          },{
                              'courseNo': 'FIL 20',
                              'grade': 2.25,
                              'units': 3,
                              'enrolled': 6.75,
                              'term': 12.75
                          },{
                              'courseNo': 'IT 1(MST)',
                              'grade': 2,
                              'units': 3,
                              'enrolled': 6,
                              'term': 18.75
                          },{
                              'courseNo': 'PE 1',
                              'grade': 2,
                              'units': 0,
                              'enrolled': 0,
                              'term': 18.75
                          },{
                              'courseNo': 'PHILO1(SSP)',
                              'grade': 1.75,
                              'units': 3,
                              'enrolled': 5.25,
                              'term': 24
                          },{
                              'courseNo': 'PSY 1(SSP)',
                              'grade': 1.75,
                              'units': 3,
                              'enrolled': 5.25,
                              'term': 29.25
                          },{
                              'courseNo': 'SPCM 1(AH)',
                              'grade': 1.75,
                              'units': 3,
                              'enrolled': 5.25,
                              'term': 34.5
                          }
                      ],[
                          {
                              'courseNo': 'ENG 2(AH)',
                              'grade': 1.5,
                              'units': 3,
                              'enrolled': 4.5,
                              'term': 39
                          },{
                              'courseNo': 'HUM 1(AH)',
                              'grade': 1.5,
                              'units': 3,
                              'enrolled': 4.5,
                              'term': 43.5
                          },{
                              'courseNo': 'HUM 2(AH)',
                              'grade': 1.5,
                              'units': 3,
                              'enrolled': 4.5,
                              'term': 48
                          },{
                              'courseNo': 'MATH1(MST)',
                              'grade': 2,
                              'units': 3,
                              'enrolled': 6,
                              'term': 54
                          },{
                              'courseNo': 'MATH2(MST)',
                              'grade': 2,
                              'units': 3,
                              'enrolled': 6,
                              'term': 60
                          },{
                              'courseNo': 'SOSC1(SSP)',
                              'grade': 2.25,
                              'units': 3,
                              'enrolled': 7.5,
                              'term': 67.5
                          }
                      ],[
                          {
                              'courseNo': 'COMA 101',
                              'grade': 1.25,
                              'units': 3,
                              'enrolled': 3.75,
                              'term': 71.25
                          },{
                              'courseNo': 'ENG 4',
                              'grade': 2,
                              'units': 3,
                              'enrolled': 6,
                              'term': 77.25
                          },{
                              'courseNo': 'JAP 10',
                              'grade': 1.75,
                              'units': 3,
                              'enrolled': 5.25,
                              'term': 82.5
                          },{
                              'courseNo': 'MATH 17',
                              'grade': 1.75,
                              'units': 5,
                              'enrolled': 8.75,
                              'term': 91.25
                          },{
                              'courseNo': 'NASC3(MST)',
                              'grade': 2,
                              'units': 3,
                              'enrolled': 6,
                              'term': 91.25
                          },{
                              'courseNo': 'NSTP 1',
                              'grade': 1.75,
                              'units': 0,
                              'enrolled': 0,
                              'term': 91.25
                          },{
                              'courseNo': 'SPCM 102',
                              'grade': 1.75,
                              'units': 3,
                              'enrolled': 5.25,
                              'term': 102.5
                          }
                      ],[
                          {
                              'courseNo': 'COMA 104',
                              'grade': 1.25,
                              'units': 3,
                              'enrolled': 3.75,
                              'term': 106.25
                          },{
                              'courseNo': 'FIL 21',
                              'grade': 2,
                              'units': 3,
                              'enrolled': 6,
                              'term': 112.25
                          },{
                              'courseNo': 'JAP 11',
                              'grade': 1.75,
                              'units': 3,
                              'enrolled': 5.25,
                              'term': 117.5
                          },{
                              'courseNo': 'MGT 101',
                              'grade': 1.5,
                              'units': 3,
                              'enrolled': 4.5,
                              'term': 122
                          },{
                              'courseNo': 'SOC 130',
                              'grade': 2.25,
                              'units': 3,
                              'enrolled': 6.75,
                              'term': 128.75
                          },{
                              'courseNo': 'STAT 101',
                              'grade': 1.75,
                              'units': 3,
                              'enrolled': 5.25,
                              'term': 134
                          }
                      ],[
                          {
                              'courseNo': 'ENG 101',
                              'grade': 2,
                              'units': 3,
                              'enrolled': 6,
                              'term': 140
                          },{
                              'courseNo': 'COMA 192',
                              'grade': 1,
                              'units': 3,
                              'enrolled': 3,
                              'term': 143
                          },{
                              'courseNo': 'COMA 105',
                              'grade': 2,
                              'units': 3,
                              'enrolled': 6,
                              'term': 149
                          },{
                              'courseNo': 'HUME 150',
                              'grade': 1.75,
                              'units': 3,
                              'enrolled': 5.25,
                              'term': 154.25
                          },{
                              'courseNo': 'PE 2',
                              'grade': 5,
                              'units': 0,
                              'enrolled': 0,
                              'term': 154.25
                          },{
                              'courseNo': 'PI 10(SSP)',
                              'grade': 2.25,
                              'units': 3,
                              'enrolled': 6.75,
                              'term': 161
                          },{
                              'courseNo': 'THEA 107',
                              'grade': 1,
                              'units': 3,
                              'enrolled': 3,
                              'term': 164
                          }
                      ],[
                          {
                              'courseNo': 'ENG 103',
                              'grade': 2,
                              'units': 3,
                              'enrolled': 6,
                              'term': 170
                          },{
                              'courseNo': 'ENG 104',
                              'grade': 2.25,
                              'units': 3,
                              'enrolled': 6.75,
                              'term': 176.75
                          },{
                              'courseNo': 'HUME 170',
                              'grade': 2,
                              'units': 3,
                              'enrolled': 6,
                              'term': 182.75
                          },{
                              'courseNo': 'NSTP 2',
                              'grade': 1.25,
                              'units': 0,
                              'enrolled': 0,
                              'term': 182.75
                          },{
                              'courseNo': 'PHLO 184',
                              'grade': 2,
                              'units': 3,
                              'enrolled': 6,
                              'term': 188.75
                          },{
                              'courseNo': 'SOC 112',
                              'grade': 1.75,
                              'units': 3,
                              'enrolled': 5.25,
                              'term': 194
                          }
                      ],[
                          {
                              'courseNo': 'COMA 193',
                              'grade': 1.75,
                              'units': 3,
                              'enrolled': 5.25,
                              'term': 199.25
                          },{
                              'courseNo': 'COMA 200',
                              'grade': 'S',
                              'units': 3,
                              'enrolled': 0,
                              'term': 199.25
                          },{
                              'courseNo': 'ENG 5',
                              'grade': 1.75,
                              'units': 3,
                              'enrolled': 5.25,
                              'term': 204.5
                          },{
                              'courseNo': 'HK 12',
                              'grade': 2.25,
                              'units': 0,
                              'enrolled': 0,
                              'term': 204.5
                          },{
                              'courseNo': 'SPCM 101',
                              'grade': 1.5,
                              'units': 3,
                              'enrolled': 4.5,
                              'term': 209
                          },{
                              'courseNo': 'SPCM 104',
                              'grade': 2.75,
                              'units': 3,
                              'enrolled': 8.25,
                              'term': 217.25
                          }
                      ],[
                          {
                              'courseNo': 'ENG 156',
                              'grade': 1.5,
                              'units': 3,
                              'enrolled': 4.5,
                              'term': 221.75
                          },{
                              'courseNo': 'ENG 155',
                              'grade': 1.25,
                              'units': 3,
                              'enrolled': 3.75,
                              'term': 225.5
                          },{
                              'courseNo': 'ENG 102',
                              'grade': 1,
                              'units': 3,
                              'enrolled': 3,
                              'term': 228.5
                          },{
                              'courseNo': 'ETHICS 1',
                              'grade': 1.75,
                              'units': 3,
                              'enrolled': 5.25,
                              'term': 233.75
                          },{
                              'courseNo': 'STS 1',
                              'grade': 1.75,
                              'units': 3,
                              'enrolled': 5.25,
                              'term': 239
                          }
                      ],[
                          {
                              'courseNo': 'COMA 200',
                              'grade': 'S',
                              'units': 3,
                              'enrolled': 0,
                              'term': 239
                          },{
                              'courseNo': 'ENG 152',
                              'grade': 1.25,
                              'units': 3,
                              'enrolled': 3.75,
                              'term': 242.75
                          },{
                              'courseNo': 'HK 12',
                              'grade': 2.75,
                              'units': 0,
                              'enrolled': 0,
                              'term': 242.75
                          },{
                              'courseNo': 'HK 12',
                              'grade': 1.75,
                              'units': 0,
                              'enrolled': 0,
                              'term': 242.75
                          },{
                              'courseNo': 'THEA 101',
                              'grade': 2,
                              'units': 3,
                              'enrolled': 6,
                              'term': 248.75
                          }
                      ],[
                          {
                              'courseNo': 'COMA 200',
                              'grade': 1,
                              'units': 6,
                              'enrolled': 6,
                              'term': 254.75
                          }
                      ]
                  ],
                  'totalGrade': 146,
                  'totalEnrolled': 254.75,
                  'gwa': 1.74486,
                  'requiredUnits': 144
            }
        };
    }
    
    updateState = (childData,key) => {
        //record object key dictionary
            const NAME_KEY = 'name';
            const COURSE_KEY = 'course';
            const GRADE_TOTAL_KEY = 'totalGrade';
            const ENROLLED_TOTAL_KEY = 'totalEnrolled';
            const GWA_KEY = 'gwa';
            const UNITS_REQUIRED_KEY = 'requiredUnits';
            const SEMESTERS_KEY = 'semesters'

        //semester object key dictionary
            const COURSENO_KEY = 'courseNo';
            const GRADE_KEY = 'grade';
            const UNITS_KEY = 'UNITS';
            const ENROLLED_KEY = 'enrolled';
            const TERM_KEY = 'term';

        //key parameter dictionary
            const MSC = 'msc';
            const TABLE = 'table';

        if (key === MSC){
            this.setState(prevState => ({
                record: {                    // specific object of record object
                    ...prevState.record,       // copy all record key-value pairs
                    // update value of specific key
                        [NAME_KEY]: childData[0],
                        [COURSE_KEY]: childData[1],
                        [GRADE_TOTAL_KEY]: childData[2],
                        [ENROLLED_TOTAL_KEY]: childData[3],
                        [GWA_KEY]: childData[4],
                        [UNITS_REQUIRED_KEY]: childData[5],
                }
            }))
            console.log(this.state.record);
            return;
        }
        if (key.substring(0, key.length - 1) === TABLE){
            let items = [...this.state.record[SEMESTERS_KEY]];
                items[parseInt(key.substring(key.length - 1))] = childData;
            this.setState(prevState => ({
                record: {
                    ...prevState.record,
                    [SEMESTERS_KEY]: items,
                }
            }))
        }
        console.log(this.state.record);
    }

	render() {
		return (
			<div>
                    {/*enclosed text with no tag with div, labels such as 'Name: ' and their corresponding data with span to be easier to access with how I approach edit function 
                    editing those tags are fine. just inform me
                    -Joachim*/}
					<div id = 'msc_data'>
						<h4>
                            <span>Name: </span>
                            <span id = 'name_data'>{this.state.record.name}</span>
                        </h4>
						<h5>
                            <span>Course: </span>
                            <span id = 'course_data'>{this.state.record.course}</span>
                        </h5>
						<div>
                            <span>Total Grade: </span>
                            <span id = 'grade_data'>{this.state.record.totalGrade}</span>
                        </div>
						<div>
                            <span>Total Enrolled: </span>
                            <span id = 'enrolled_data'>{this.state.record.totalEnrolled}</span>
                        </div>
						<div>
                            <span>GWA: </span>
                            <span id = 'gwa_data'>{this.state.record.gwa}</span>
                        </div>
						<div>
                            <span>Required Units: </span>
                            <span id = 'units_data'>{this.state.record.requiredUnits}</span>
                        </div>
                        <EditStudentRecord 
                            id= 'msc'
                            parentCallback = {this.callbackFunction}
                        />
					</div>
					<div>
					{this.state.record.semesters.map((sem, index) => {
							return(
                                <div key={index} style = {{position:'relative'}}>
                                    <ReactBootStrap.Table striped bordered hover size="sm" id = {'table' + index + '_data'}>
                                        <thead>
                                        <tr>
                                            <th>Course No</th>
                                            <th>Grade</th>
                                            <th>Units</th>
                                            <th>Enrolled</th>
                                            <th>Term</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {sem.map((item, i) => {
                                            return(
                                                    <tr key={i} id = {index.toString() + '-' + i.toString() + '_data'}>
                                                    <td>{item.courseNo}</td>
                                                    <td>{item.grade}</td>
                                                    <td>{item.units}</td>
                                                    <td>{item.enrolled}</td>
                                                    <td>{item.term}</td>
                                                    </tr>
                                            )})}
                                        </tbody>
                                    </ReactBootStrap.Table>
                                    
                                    <EditStudentRecord 
                                        id= {'table' + index.toString()}
                                        updateState = {this.updateState}
                                    />
                                </div>
							)
					})}
					</div>
			</div>
		);
}}

export default StudentData;
