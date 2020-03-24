import React from 'react';
import logo from './logo.svg';
import './App.css';
import {HashRouter as Router,Switch,Route} from 'react-router-dom'
import CytoscapeGraph from './Components/cytoscape_graph.jsx'
import CytoscapeGraph1 from './Components/cytoscape_component.jsx'
import Values from './Components/Test.jsx'

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
            <Route path='/' exact component={CytoscapeGraph}/>
            <Route path='/test' exact component={Values}/>
            <Route path='/graph1' exact component={CytoscapeGraph1}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
