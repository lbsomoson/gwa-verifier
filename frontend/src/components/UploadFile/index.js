import React from 'react';
import styles from "./UploadFile.module.css";
import { IoIosFolderOpen } from 'react-icons/io';

class UploadFile extends React.Component {

    render() {

        return (
            <div>
                <input 
                    id="uploadFileBtn"
                    type="file" 
                    accept=".csv, 
                        .pdf, 
                        application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, 
                        application/vnd.ms-excel"
                    onChange={this.props.handleFileChange} 
                    multiple
                    hidden
                />
                <label for="uploadFileBtn" className={`button-text ${styles.uploadFileBtn}`}><span><IoIosFolderOpen /></span></label>
                <span id="fileChosen" className={styles.fileChosen}>No file chosen.</span>
            </div>
        )
    }
}

export default UploadFile;