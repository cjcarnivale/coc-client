import React, { Component } from "react";
import Calculator from "../../components/Calculator/Calculator";

export default class AddCount extends Component {
  render() {
    return (
      <div>
        {this.props.location.state.type === "safecounts" ? (
          <div>
            <h2 className="heading">Add Safe Count</h2>
          </div>
        ) : (
          <div>
            <h2 className="heading">Add Change Order</h2>
          </div>
        )}
        <Calculator
          manual={this.props.location.state.manual}
          type={this.props.location.state.type}
        />
      </div>
    );
  }
}
