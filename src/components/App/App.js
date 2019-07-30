import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom"; 
import Dashboard from "../../routes/Dashboard/Dashboard.Route";
class App extends Component {
  render() {
    return (
      <main className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={Dashboard}/>
          </Switch>
        </BrowserRouter>
      </main>
    ); 
  }
}

export default App;
