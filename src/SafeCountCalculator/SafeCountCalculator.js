import React, { Component } from "react";
import "./SafeCountCalculator.css";

export default class SafeCountCalculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: [
        {
          name: "Quarters",
          count: 0,
          multiplier: 10
        },
        {
          name: "Dimes",
          count: 0,
          multiplier: 5
        },
        {
          name: "Nickles",
          count: 0,
          multiplier: 2
        },
        {
          name: "Pennies",
          count: 0,
          multiplier: 0.5
        },
        {
          name: "Ones",
          count: 0,
          multiplier: 1
        },
        {
          name: "Fives",
          count: 0,
          multiplier: 5
        }
      ]
    };
  }

  updateCount = (i, e) => {
    const currency = [...this.state.currency];
    currency[i].count = e.target.value;
    this.setState({
      currency
    });
  };

  render() {
    return (
      <div className="count-form-container">
        <form className="count-form">
          {this.state.currency.map((den, i) => (
            <div className="currency-item" key={i}>
              <span>{den.name}</span>
              <input
                type="number"
                min="0"
                value={this.state.currency[i].count}
                onChange={e => this.updateCount(i, e)}
              />
              <span>{i < 4 ? "roll(s)" : "bill(s)"}</span>
              <span>Total: $ {den.count * den.multiplier}</span>
            </div>
          ))}
          <div className="grand-total">
            Grand Total:{" "}
            {this.state.currency.reduce(
              (accumulator, currentValue) =>
                accumulator + currentValue.count * currentValue.multiplier,
              0
            )}
          </div>
            <button type="submit">Submit Count</button>
        </form>
      </div>
    );
  }
}
