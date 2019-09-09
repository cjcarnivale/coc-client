import React, { Component } from "react";
import Calculator from "../../components/Calculator/Calculator";
import "./DashboardRoute.css";

export default class Dashboard extends Component {
  render() {
    return (
      <div>
        <h2 className="scc-heading">Safe Count</h2>
        <Calculator />
      </div>
    );
  }
}
