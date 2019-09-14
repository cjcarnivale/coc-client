import React, { Component } from "react";
import Calculator from "../../components/Calculator/Calculator";
import "./DashboardRoute.css";

export default class Dashboard extends Component {
  render() {
    return (
      <div>
        <div>
          <h2 className="scc-heading">Safe Count</h2>
          <Calculator manual={false} type="safecounts" />
        </div>
        <div>
          <h2>Change Order Calculator</h2>
          <Calculator manual={false} type="changeorders" />
        </div>
      </div>
    );
  }
}
