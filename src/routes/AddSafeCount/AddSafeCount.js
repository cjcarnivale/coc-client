import React, { Component } from "react";
import SafeCountCalculator from "../../components/SafeCountCalculator/SafeCountCalculator";
export default class AddSafeCount extends Component {
  render() {
    return (
      <div>
        <h2 className="calculator-title">Add Safe Count</h2>
        <SafeCountCalculator
          manual={this.props.location.state.manual}
        />
      </div>
    );
  }
}
