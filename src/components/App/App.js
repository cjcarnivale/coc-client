import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom"; 
import Dashboard from "../../routes/Dashboard/Dashboard.Route";
import SafeCountHistoryRoute from "../../routes/SafeCountHistory/SafeCountHistoryRoute";
export default class App extends Component {
  render() {
    return (
      <main className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={Dashboard}/>
            <Route path='/safecounthistory' component={SafeCountHistoryRoute} />
          </Switch>
        </BrowserRouter>
      </main>
    ); 
  }
}

