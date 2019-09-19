import React, { Component } from "react";
import Calculator from "../../components/Calculator/Calculator";

export default class AddSafeCount extends Component {
  render() {
    return (
      <div>
        <h2 className="heading">Add Safe Count</h2>
        <Calculator
          manual={this.props.location.state.manual}
          type={this.props.location.state.type}
        />
      </div>
    );
  }
}
