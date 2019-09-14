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
        editingChangeOrder: false,
        count: {},
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

    toggleConfirmSubmit = () => {
      this.setState({
        confirmSubmit: !this.state.confirmSubmit
      });
    };

    toggleEditingChangeOrder = () => {
      this.setState({
        editingChangeOrder: !this.state.editingChangeOrder
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

    postCount = () => {
      this.toggleConfirmSubmit();
      const newCount = {
        date: dayjs(this.state.date).format("YYYY-MM-DD")
      };

    Object.assign(newCount, this.state.count);
    console.log(newCount)

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

      this.resetCounts();
    };

    generateChangeOrder = () => {
      this.toggleEditingChangeOrder();
      generateChangeOrder(dayjs(this.state.date).format("YYYY-MM-DD")).then(
        resJson => {
          const { date, ...count } = resJson[0]
          this.setState({
            isLoaded: true,
            count 
          })
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
                {!this.state.currentDayEntered &&
                !this.state.editingChangeOrder &&
                this.props.type === "changeorders" ? (
                  <div>
                    <button type="button" onClick={this.generateChangeOrder}>
                      Generate Change Order
                    </button>
                  </div>
                ) : (
                  Object.keys(this.state.count).map((key, i) => (
                    <div className="denominations-item" key={i}>
                      <span>{`${key.charAt(0).toUpperCase()}${key.substring(
                        1
                      )}`}</span>
                      <input
                        step="1"
                        type="number"
                        min="0"
                        value={this.state.count[key]}
                        onChange={e => this.updateCount(key, e)}
                      />
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
                  ))
                )}
                {!this.state.currentDayEntered &&
                !this.state.editingChangeOrder &&
                this.props.type === "changeorders" ? (
                  <> </>
                ) : (
                  <div>
                    <button type="button" onClick={this.resetCounts}>
                      Reset
                    </button>
                    <div className="grand-total">
                      Grand Total: $ {this.state.gTotal()}
                      {(this.state.gTotal() !== 1750 && this.props.type === "safecounts")&& (
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
                        <button
                          type="button"
                          onClick={this.toggleConfirmSubmit}
                        >
                          Submit Count
                        </button>
                      </div>
                    ) : (
                      <div>
                        <button type="button" onClick={this.postCount}>
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={this.toggleConfirmSubmit}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>
          )}
          }
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
          denominations.forEach(den => {
            count[den.name] = 0;
          });
          if (getCurrentDay.length === 0) {
            this.setState({
              isLoaded: true,
              denominations,
              currentDayEntered: false,
              count
            });
          } else {
            this.setState({
              isLoaded: true,
              denominations,
              currentDayEntered: true,
              count
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
