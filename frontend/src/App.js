import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import "./normalize.css";
import "./typography.css";

import { Main, Login,StudentRecord, AdminPage, PermissionDenied } from "./pages";

class App extends React.Component{
  
  constructor(props){
    super(props)

    this.state = {
      username: "",
      type: ""
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
          <Route exact path="/admin-dashboard" element={<AdminPage />} />
          <Route exact path="/access-denied" element={<PermissionDenied />} />
        </Routes>
      </Router>
  );
  }
}

export default App;
//<Route exact path="/studentrecord" element={<StudentRecord />} />