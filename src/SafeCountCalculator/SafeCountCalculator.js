import React, { Component } from "react";
import "./SafeCountCalculator.css";
import Config from "../config";

export default class SafeCountCalculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: [],
      isLoaded: false,
      error: null,
      confirmSubmit: false
    };
  }

  updateCount = (i, e) => {
    const currency = [...this.state.currency];
    currency[i].count = e.target.value;
    this.setState({
      currency
    });
  };

  toggleConfirmSubmit = () => {
    this.setState({
      confirmSubmit: !this.state.confirmSubmit
    })
  }

  render() {
    return (
      <div className="count-form-container">
        {!this.state.isLoaded 
          ? <div>Loading</div> 
          : this.state.error 
            ? <div>Error: {this.state.error.message}</div>
            : <form className="count-form">
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
              {!this.state.confirmSubmit
                ? <button type="button" onClick={this.toggleConfirmSubmit}>Submit Count</button>
                : <div>
                    <button type="submit">Confirm</button>
                    <button type="button" onClick={this.toggleConfirmSubmit}>Cancel</button>
                  </div>
              }
            </form>}
          </div>
    );
  }

  componentDidMount() {
    fetch(`${Config.API_ENDPOINT}/denominations`)
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            currency: result
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }
}
