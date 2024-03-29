import React, { Component } from "react";
import Calculator from "../../components/Calculator/Calculator";


export default class Dashboard extends Component {
  render() {
    return (
      <div>
        <div>
          <h2 className="heading">Safe Count</h2>
          <Calculator manual={false} type="safecounts" />
        </div>
        <div>
          <h2 className= "heading">Change Order Calculator</h2>
          <Calculator manual={false} type="changeorders" />
        </div>
      </div>
    );
  }
}
