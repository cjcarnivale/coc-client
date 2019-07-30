import React, { Component } from "react";
import "./SafeCountCalculator.css";
import Config from "../../config";
import dayjs from "dayjs";

export default class SafeCountCalculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: dayjs(Date.now()).format("MM/DD/YYYY"),
      currency: [],
      isLoaded: false,
      error: null,
      confirmSubmit: false,
      currentDayEntered: false
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

  postSafeCount = (date) => {
    this.toggleConfirmSubmit();
    date = dayjs(date).format("YYYY-MM-DD");
    const newSafeCount = {
      date: this.state.date,
      quarters: this.state.currency[0].count,
      dimes: this.state.currency[1].count,
      nickles: this.state.currency[2].count,
      pennies: this.state.currency[3].count,
      ones: this.state.currency[4].count,
      fives: this.state.currency[5].count,
      tens: this.state.currency[6].count,
      twenties: this.state.currency[7].count,
      fifties: this.state.currency[8].count,
      hundreds: this.state.currency[9].count
    };
    fetch(`${Config.API_ENDPOINT}/safecounts`, {
      headers: {
        "content-type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(newSafeCount)
    }).then(
      this.setState({
        currentDayEntered: true
      })
    );
  };

  render() {
    const gTotal = this.state.currency.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.count * currentValue.multiplier,
      0
    );

    return (
      <div className="count-form-container">
        {!this.state.isLoaded ? (
          <div className="loading">Loading</div>
        ) : this.state.error ? (
          <div className="error">OOPS... something went wrong!</div>
        ) : this.state.currentDayEntered ? (
          <div className="already-entered">
            You have entered a safe count for today!
          </div>
        ) : (
          <div>
            {this.state.error === 'All inputs must be numeric' && (
              <div className="validation-error">Only use numbers when inputting counts!</div>
            )} 
            <div className="date-display">Date: {this.state.date}</div>
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
                  <div className="total-match">
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
                  <button type="button" onClick={this.postSafeCount}>
                    Confirm
                  </button>
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
    fetch(
      `${Config.API_ENDPOINT}/safecounts/${dayjs(this.date).format(
        "YYYY-MM-DD"
      )}`
    )
      .then(res => res.json())
      .then(resJson => {
        if (resJson.error === `Safe count for that day doesn't exist`) {
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
        } else {
          this.setState({
            currentDayEntered: true,
            isLoaded: true
          });
        }
      })
      .then(
      result => {
        this.setState({
          isLoaded: true
        })
      },
      error => {
        this.setState({
          isLoaded: true,
          error
        });
      });
  }
}
