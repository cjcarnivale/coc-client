import React, { Component } from "react";
import SafeCountCalculator from "../../components/SafeCountCalculator/SafeCountCalculator";
import "./DashboardRoute.css";

export default class Dashboard extends Component {
  render() {
    return (
      <div>
        <h2 className="scc-heading">Safe Count</h2>
        <SafeCountCalculator />
      </div>
    );
  }
}
