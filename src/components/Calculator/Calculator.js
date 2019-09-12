import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./Calculator.css";
import SafeCountService from "../../services/safe-count-service";
import DenominationsService from "../../services/denominations-service";
import dayjs from "dayjs";
import clonedeep from "lodash/cloneDeep";

export default withRouter(
  class Calculator extends Component {
    constructor(props) {
      super(props);
      this.state = {
        date: dayjs(Date.now()).format("YYYY/MM/DD"),
        denominations: [],
        isLoaded: false,
        error: null,
        confirmSubmit: false,
        currentDayEntered: false,
        gTotal: () => {
          return this.state.denominations.reduce(
            (accumulator, currentValue) =>
              accumulator + currentValue.count * currentValue.multiplier,
            0
          );
        }
      };
    }

    updateDate = e => {
      const date = e.target.value;
      this.setState({
        date
      });
    };

    updateCount = (i, e) => {
      let denominations = clonedeep(this.state.denominations);
      denominations[i].count = e.target.value;
      this.setState({
        denominations
      });
    };

    toggleConfirmSubmit = () => {
      this.setState({
        confirmSubmit: !this.state.confirmSubmit
      });
    };

    resetCounts = () => {
      let copy = clonedeep(this.state.denominations);
      let reset = [];
      for (let i = 0; i < copy.length; i++) {
        const den = copy[i];
        den.count = 0;
        reset.push(den);
      }
      this.setState({
        denominations: reset
      });
    };

    postSafeCount = () => {
      this.toggleConfirmSubmit();
      const newSafeCount = {
        date: dayjs(this.state.date).format("YYYY-MM-DD")
      };

      for (let i = 0; i < this.state.denominations.length; i++) {
        Object.assign(newSafeCount, {
          [this.state.denominations[i].name]: this.state.denominations[i].count
        });
      }

      SafeCountService.postSafeCount(newSafeCount).then(
        res => {
          return !res.ok
            ? res.json().then(resJson =>
                this.setState({
                  error: resJson.error,
                  isLoaded: true
                })
              )
            : res
                .json()
                .then(
                  this.setState({
                    isLoaded: true,
                    currentDayEntered: true,
                    error: null
                  })
                )
                .then(() => {
                  if (this.props.manual) {
                    this.props.history.push("/safecounthistory");
                  }
                });
        },
        error => {
          this.setState({
            isLoaded: false,
            error
          });
        }
      );

      this.resetCounts();
    };

    render() {
      return (
        <div className="count-form-container">
          {!this.state.isLoaded ? (
            <div className="loading">Loading</div>
          ) : (
            <div>
              <div className="date-display">
                Date:{" "}
                {this.props.manual ? (
                  <input
                    type="date"
                    value={dayjs(this.state.date).format("YYYY-MM-DD")}
                    onChange={e => this.updateDate(e)}
                  />
                ) : (
                  dayjs(this.state.date).format("MM-DD-YYYY")
                )}
              </div>
              <form className="count-form">
                {this.state.error && (
                  <div className="validation-error">{this.state.error}</div>
                )}
                {this.state.denominations.map((den, i) => (
                  <div className="denominations-item" key={i}>
                    <span>{`${den.name
                      .charAt(0)
                      .toUpperCase()}${den.name.substring(1)}`}</span>
                    <input
                      step="1"
                      type="number"
                      min="0"
                      value={this.state.denominations[i].count}
                      onChange={e => this.updateCount(i, e)}
                    />
                    <span>
                      {`${den.type}`}
                      {den.count !== "1" ? "s" : ""}
                    </span>
                    <span>Total: $ {den.count * den.multiplier}</span>
                  </div>
                ))}
                <button type="button" onClick={this.resetCounts}>
                  Reset
                </button>
                <div className="grand-total">
                  Grand Total: $ {this.state.gTotal()}
                  {this.state.gTotal() !== 1750 && (
                    <div className="total-match">
                      Your count does not match what should be in the safe
                    </div>
                  )}
                </div>
                {this.state.currentDayEntered && !this.props.manual ? (
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
              </form>
            </div>
          )}
        </div>
      );
    }

    componentDidMount() {
      function getSafeCountAndDenominations(date) {
        return Promise.all([
          SafeCountService.getSafeCount(date),
          DenominationsService.getDenominations()
        ]);
      }
      getSafeCountAndDenominations(
        dayjs(this.state.date).format("YYYY-MM-DD")
      ).then(
        ([getCurrentDay, denominations]) => {
          if (getCurrentDay.currentDayEntered === false) {
            this.setState({
              isLoaded: true,
              denominations
            });
          } else {
            this.setState({
              isLoaded: true,
              denominations,
              currentDayEntered: getCurrentDay.currentDayEntered
            });
          }
        },
        error => {
          this.setState({
            isLoaded: false,
            error: error.message
          });
        }
      );
    }
  }
);
