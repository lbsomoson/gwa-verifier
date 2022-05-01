import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import "./normalize.css";
import "./typography.css";

import { Main, Login } from "./pages";
import { AddUserForm } from './components';

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
        </Routes>
      </Router>
  );
  }
}

export default App;
