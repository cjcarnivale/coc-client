import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./Calculator.css";
import CountService from "../../services/count-service";
import DenominationsService from "../../services/denominations-service";
import dayjs from "dayjs";
import clonedeep from "lodash/cloneDeep";
import generateChangeOrder from "../../services/generate-change-order-service";

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
        count: {},
        resetCount: {},
        gTotal: () => {
          let total = 0;
          for (let key in this.state.count) {
            total += parseInt(
              this.state.count[key] *
                this.state.denominations.find(den => den.name === key)[
                  "multiplier"
                ]
            );
          }
          return total;
        }
      };
      if (this.props.type === "changeorders" && !this.props.manual) {
        this.state.generateChangeOrder = true;
      }
    }

    updateDate = e => {
      const date = e.target.value;
      this.setState({
        date
      });
    };

    updateCount = (key, e) => {
      let count = clonedeep(this.state.count);
      count[key] = e.target.value;
      this.setState({
        count
      });
    };

    toggleConfirmSubmit = e => {
      e.preventDefault();
      this.setState({
        confirmSubmit: !this.state.confirmSubmit
      });
    };

    toggleGenerateChangeOrder = () => {
      this.setState({
        generateChangeOrder: !this.state.generateChangeOrder
      });
    };

    resetCounts = () => {
      const resetCount = clonedeep(this.state.resetCount)
      this.setState({
        count: resetCount
      });
    };

    postCount = e => {
      e.preventDefault();
      this.toggleConfirmSubmit(e);
      const newCount = {
        date: dayjs(this.state.date).format("YYYY-MM-DD")
      };

      Object.assign(newCount, this.state.count);

      CountService.postCount(newCount, this.props.type).then(
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
      if (!this.props.manual && this.props.type === "safecounts"){
      this.resetCounts();
      }
    };

    generateChangeOrder = () => {
      generateChangeOrder(dayjs(this.state.date).format("YYYY-MM-DD")).then(
        res => {
          return !res.ok
            ? res.json().then(resJson =>
                this.setState({
                  error: resJson.error
                })
              )
            : res.json().then(resJson => {
                const { date, ...count } = resJson[0];
                this.setState(
                  {
                    error: null,
                    isLoaded: true,
                    count,
                    resetCount: count
                  },
                  () => this.toggleGenerateChangeOrder()
                );
              });
        },
        error => {
          this.setState({
            isLoaded: false,
            error
          });
        }
      );
    };

    render() {
      return (
        <div className="count-form-container">
          {!this.state.isLoaded ? (
            <div className="loading">Loading</div>
          ) : (
            <div>
              {this.state.error && (
                <div className="error">{this.state.error}</div>
              )}
              {!this.state.currentDayEntered &&
              this.props.type === "changeorders" &&
              this.state.generateChangeOrder &&
              !this.props.manual ? (
                <div>
                  <button
                    type="button"
                    className="generate-button"
                    onClick={this.generateChangeOrder}
                  >
                    Generate Change Order
                  </button>
                </div>
              ) : (
                <div>
                  <form
                    className="count-form"
                    onSubmit={e => this.postCount(e)}
                  >
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
                    {Object.keys(this.state.count).map((key, i) => (
                      <div className="denominations-item" key={i}>
                        <span>{`${key.charAt(0).toUpperCase()}${key.substring(
                          1
                        )}`}</span>
                        {(this.state.currentDayEntered && this.props.type) ===
                        "changeorders" ? (
                          <span id="count-form-value">
                            {this.state.count[key]}
                          </span>
                        ) : (
                          <input
                            className="count-form-input"
                            step="1"
                            type="number"
                            min="0"
                            value={this.state.count[key]}
                            onChange={e => this.updateCount(key, e)}
                          />
                        )}
                        <span>
                          {`${
                            this.state.denominations.find(
                              den => den.name === key
                            )["type"]
                          }`}
                          {this.state.count[key] !== "1" ? `s` : ""}
                        </span>
                        <span>
                          Total: $
                          {this.state.count[key] *
                            this.state.denominations.find(
                              den => den.name === key
                            )["multiplier"]}
                        </span>
                      </div>
                    ))}
                    <div>
                      {(this.props.type === "safecounts" ||
                        (this.props.type === "changeorders" &&
                          !this.state.currentDayEntered)) && (
                        <button type="button" onClick={this.resetCounts}>
                          Reset
                        </button>
                      )}
                      <div className="grand-total">
                        Grand Total: $ {this.state.gTotal()}
                        {this.state.gTotal() !== 1750 &&
                          this.props.type === "safecounts" && (
                            <div className="total-match">
                              Your count does not match what should be in the
                              safe
                            </div>
                          )}
                      </div>
                      {this.state.currentDayEntered && !this.props.manual ? (
                        <div>
                          {this.props.type === "safecounts" && (
                            <div className="already-entered">
                              You have entered a safe count for today!
                            </div>
                          )}
                          {this.props.type === "changeorders" && (
                            <div className="already-entered">
                              You have entered a change order for today!
                            </div>
                          )}
                        </div>
                      ) : !this.state.confirmSubmit ? (
                        <div>
                          <button
                            type="button"
                            onClick={e => this.toggleConfirmSubmit(e)}
                          >
                            Submit Count
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button type="submit">Confirm</button>
                          <button
                            type="button"
                            onClick={e => this.toggleConfirmSubmit(e)}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    componentDidMount() {
      function getCountAndDenominations(date, type) {
        return Promise.all([
          CountService.getCount(date, type),
          DenominationsService.getDenominations(type)
        ]);
      }
      getCountAndDenominations(
        dayjs(this.state.date).format("YYYY-MM-DD"),
        this.props.type
      ).then(
        ([getCurrentDay, denominations]) => {
          let count = {};
          if (this.props.type === "safecounts") {
            denominations.forEach(den => {
              count[den.name] = 0;
            });
          }
          if (getCurrentDay.length === 0) {
            this.setState({
              isLoaded: true,
              denominations,
              currentDayEntered: false,
              count, 
              resetCount: count
            });
          } else {
            if (this.props.type === "changeorders") {
              const { id, ...changeOrderCount } = getCurrentDay[0];
              Object.assign(count, changeOrderCount);
            }
            this.setState({
              isLoaded: true,
              denominations,
              currentDayEntered: true,
              count,
              resetCount: count
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
