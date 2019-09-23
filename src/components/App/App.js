import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import DashboardRoute from "../../routes/DashboardRoute/DashboardRoute";
import SafeCountHistoryRoute from "../../routes/SafeCountHistoryRoute/SafeCountHistoryRoute";
import ChangeOrderHistoryRoute from "../../routes/ChangeOrderHistoryRoute/ChangeOrderHistoryRoute"
import AddCountRoute from "../../routes/AddCountRoute/AddCountRoute";
import NavBar from "../NavBar/NavBar";
import "./App.css";
export default class App extends Component {
  render() {
    return (
      <main className="App">
        <BrowserRouter>
          <NavBar />
          <Switch>
            <Route exact path="/" component={DashboardRoute} />
            <Route path="/history/safecounts" component={SafeCountHistoryRoute} />
            <Route path="/history/changeorders" component={ChangeOrderHistoryRoute} />
            <Route path="/addcount" component={AddCountRoute} />
          </Switch>
        </BrowserRouter>
      </main>
    );
  }
}
