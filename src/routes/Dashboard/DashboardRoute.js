import React, { Component } from "react";
import SafeCountCalculator from "../../components/SafeCountCalculator/SafeCountCalculator";
import ChangeOrderCalculator from "../../components/ChangeOrderCalculator/ChangeOrderCalculator"

export default class Dashboard extends Component {
  render() {
    return (
      <div>
        <div>
          <h2 className="calculator-title">Safe Count</h2>
          <SafeCountCalculator manual={false} />
        </div>
        <div>
          <h2 className="calculator-title">Change Order Calculator</h2>
          <ChangeOrderCalculator manual={false}/>
        </div>
      </div>
    );
  }
}
