import React, { Component } from "react";
import "./SafeCountCalculator.css";
import Config from "../../config";
import dayjs from "dayjs"

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
    });
  };

  resetCounts = () => {
    let copy = [...this.state.currency];
    let reset = [];
    for (let i = 0; i < copy.length; i++) {
      const den = copy[i];
      den.count = 0;
      reset.push(den);
    }
    this.setState({
      currency: reset
    });
  };

  render() {
    const gTotal = this.state.currency.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.count * currentValue.multiplier,
      0
    );

    let date = Date.now(); 
    date = dayjs(date).format('MM/DD/YYYY');

    return (
      <div className="count-form-container">
        {!this.state.isLoaded ? (
          <div className="loading">Loading</div>
        ) : this.state.error ? (
          <div className="error">OOPS... something went wrong!</div>
        ) : (
          <div>
            <div className="date-display">Date: {date}</div>
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
                Grand Total: {gTotal}
                {gTotal !== 1750 && (
                  <div>
                    Your count does not match what should be in the safe
                  </div>
                )}
              </div>
              {!this.state.confirmSubmit ? (
                <div>
                  <button type="button" onClick={this.toggleConfirmSubmit}>
                    Submit Count
                  </button>
                  <button type="button" onClick={this.resetCounts}>
                    Reset
                  </button>
                </div>
              ) : (
                <div>
                  <button type="submit">Confirm</button>
                  <button type="button" onClick={this.toggleConfirmSubmit}>
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        )}
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
