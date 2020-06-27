import React from 'react';
import logo from './logo.svg';
import './App.css';
import PlayerWindow from './Containers/PlayerWindow';
import PartyPage from './Containers/PartyPage';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import JoinPage from './Containers/JoinPage';
import CreateRoom from './Containers/CreateRoom';
import LandingPage from './Components/LandingPage';

function App() {
  return (
  
    <div>
      <Router>
        <Switch>
          <Route exact component={LandingPage} path='/'/>
          <Route component={JoinPage} path='/party/:partyNum'/>
          <Route component={CreateRoom} path='/create'/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
