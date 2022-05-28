import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import "./normalize.css";
import "./typography.css";

import { Main, Login,StudentRecord, AdminPage } from "./pages";
import { AddUserForm, StudentDataTabs } from './components';

class App extends React.Component{
  
  constructor(props){
    super(props)

    this.state = {
      username: ""
    }

    this.setUsername = this.setUsername.bind(this)

  }

  setUsername(user){
    this.setState({username:user})
  }

  render(){
    console.log(this.state.username)
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/main" element={<Main />} />
          <Route exact path="/studentrecord" element={<StudentRecord />} />
          <Route exact path="/adminpage" element={<AdminPage />} />
        </Routes>
      </Router>
  );
  }
}

export default App;
//<Route exact path="/studentrecord" element={<StudentRecord />} />