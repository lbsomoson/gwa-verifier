import React from "react";
import styles from "./InputLogin.module.css"

class InputLogin extends React.Component {

    render() {
        return(
            <div className={styles.inputField}>
                <input 
                    type={this.props.type}
                    onChange={this.props.onChange}
                    required
                    autoComplete="new-password"
                    name={this.props.name}
                />
                <div className={styles.underline}></div>
                <label>{this.props.label}</label>
            </div>
        )
    }
}

export default InputLogin;