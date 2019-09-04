import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./SafeCountCalculator.css";
import FetchService from "../../services/fetch-service";
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

  postSafeCount = () => {
    this.toggleConfirmSubmit();
    const newSafeCount = {
      date: dayjs(this.state.date).format("YYYY-MM-DD")
    };

    for (let i = 0; i < this.state.currency.length; i++) {
      Object.assign(newSafeCount, {
        [this.state.currency[i].name.toLowerCase()]: this.state.currency[i]
          .count
      });
    }

    FetchService.postSafeCount(newSafeCount).then(res => {
      return !res.ok
        ? res.json().then(resJson =>
            this.setState({
              error: resJson.error,
              isLoaded: true
            })
          )
        : res.json().then(
            this.setState({
              isLoaded: true,
              currentDayEntered: true,
              error: null
            }),
            error => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          );
    });

    this.resetCounts();
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
        ) : typeof this.state.error !== "string" &&
          this.state.error !== null ? (
          <div className="error">OOPS... Something went wrong!</div>
        ) : (
          <div>
            <div className="date-display">Date: {this.state.date}</div>
            <form className="count-form">
              {this.state.error && (
                <div className="validation-error">{this.state.error}</div>
              )}
              {this.state.currency.map((den, i) => (
                <div className="currency-item" key={i}>
                  <span>{den.name}</span>
                  <input
                    step="1"
                    type="number"
                    min="0"
                    value={this.state.currency[i].count}
                    onChange={e => this.updateCount(i, e)}
                  />
                  <span>{i < 4 ? "roll(s)" : "bill(s)"}</span>
                  <span>Total: $ {den.count * den.multiplier}</span>
                </div>
              ))}
              <button type="button" onClick={this.resetCounts}>
                Reset
              </button>
              <div className="grand-total">
                Grand Total: $ {gTotal}
                {gTotal !== 1750 && (
                  <div className="total-match">
                    Your count does not match what should be in the safe
                  </div>
                )}
              </div>
              {this.state.currentDayEntered ? (
                <div className="already-entered">
                  You have entered a safe count for today!
                </div>
              ) : !this.state.confirmSubmit ? (
                <div>
                  <button type="button" onClick={this.toggleConfirmSubmit}>
                    Submit Count
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

              <Link className="history-link" to="/safecounthistory">
                Safe Count History
              </Link>
            </form>
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    function getSafeCountAndDenominations(date) {
      return Promise.all([
        FetchService.getSafeCount(date),
        FetchService.getDenominations()
      ]);
    }
    getSafeCountAndDenominations(
      dayjs(this.state.date).format("YYYY-MM-DD")
    ).then(
      ([todayEntered, denominations]) => {
        if (todayEntered.error === `Safe count for that day doesn't exist`) {
          this.setState({
            isLoaded: true,
            currency: denominations
          });
        } else {
          this.setState({
            isLoaded: true,
            currency: denominations,
            currentDayEntered: true
          });
        }
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
