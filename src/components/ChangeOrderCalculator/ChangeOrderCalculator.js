import React, { Component } from "react";
import dayjs from "dayjs";
import generateChangeOrder from "../../services/generate-change-order-service";
import Loading from "../Loading/Loading";
import Calculator from "../Calculator/Calculator";

export default class ChangeOrderCalculator extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isEditing: false,
        isLoaded: true,
        currentDayEntered: false,
        error: null,
        changeOrder: {}
      };
    }

    setIsLoaded = isLoaded => {
      this.setState({
        isLoaded
      });
    };

    setCurrentDayEntered = currentDayEntered => {
      (console.log('I ran')); 
      this.setState({
        currentDayEntered
      });
    };

    toggleEditing = () => {
      this.setState({
        editing: !this.state.editing
      });
    };

    generateChangeOrder = () => {
      generateChangeOrder(dayjs(Date.now()).format("YYYY-MM-DD")).then(
        res => {
          return !res.ok
            ? res.json().then(resJson =>
                this.setState({
                  error: resJson.error
                })
              )
            : res.json().then(resJson => {
                const { date, ...changeOrder } = resJson[0];
                this.setState({
                  error: null,
                  isLoaded: true,
                  isEditing: true,
                  changeOrder
                });
              });
        },
        error => {
          this.setState({
            error: error.message,
            isLoaded: false
          });
        }
      );
    };

    render() {
      return (
        <div className="count-form-container">
          {!this.state.isLoaded ? (
            <Loading />
          ) : (
            <div>
              {this.state.error && (
                <div className="error">{this.state.error}</div>
              )}
              {!this.state.isEditing && !this.state.currentDayEntered ? (
                <div>
                  <button type="button" onClick={this.generateChangeOrder}>
                    Generate Change Order
                  </button>
                </div>
              ) : (
                <div>
                  {!this.state.currentDayEntered ? (
                    <Calculator
                      type="changeorders"
                      manual={this.props.manual}
                      setIsLoaded={this.setIsLoaded}
                      setCurrentDayEntered={this.setCurrentDayEntered}
                      currentdayEntered={this.state.currentDayEntered}
                      changeOrder={this.state.changeOrder}
                    />
                  ) : (
                    <div>
                      <Calculator
                        type="changeorders"
                        manual={this.props.manual}
                        setIsLoaded={this.setIsLoaded}
                        setCurrentDayEntered={this.setCurrentDayEntered}
                        currentDayEntered = {this.state.currentDayEntered}
                        changeOrderEntered = {this.state.currentDayEntered}
                      />

                      {this.state.currentDayEntered && (
                        <div className="already-entered">
                          You have entered a change order for today!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
  };
