import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom"; 
import Dashboard from "../../routes/Dashboard/DashboardRoute";
import SafeCountHistoryRoute from "../../routes/SafeCountHistory/SafeCountHistoryRoute";
import AddSafeCount from "../../routes/AddSafeCount/AddSafeCount"
export default class App extends Component {
  render() {
    return (
      <main className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={Dashboard}/>
            <Route path='/safecounthistory' component={SafeCountHistoryRoute} />
            <Route path='/addsafecount' component={AddSafeCount} />
          </Switch>
        </BrowserRouter>
      </main>
    ); 
  }
}

