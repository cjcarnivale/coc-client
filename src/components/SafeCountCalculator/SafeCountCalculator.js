import React, { Component } from "react";
import Loading from "../Loading/Loading";
import Calculator from "../Calculator/Calculator";
import "./SafeCountCalculator.css";

export default 
  class SafeCountCalculator extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoaded: true,
        currentDayEntered: false,
        gTotal: 0
      };
    }

    setIsLoaded = isLoaded => {
      this.setState({
        isLoaded
      });
    };

    setCurrentDayEntered = currentDayEntered => {
      this.setState({
        currentDayEntered
      });
    };

    setGTotal = gTotal => {
      this.setState({
        gTotal
      });
    };
    render() {
      return (
        <div className="count-form-container">
          {!this.state.isLoaded ? (
            <Loading />
          ) : (
            <div>
              <Calculator
                type="safecounts"
                manual={this.props.manual}
                setIsLoaded={this.setIsLoaded}
                setCurrentDayEntered={this.setCurrentDayEntered}
                currentDayEntered={this.state.currentDayEntered}
                setGTotal={this.setGTotal}
              />
              {this.state.gTotal !== 1750 && (
                <div className="total-match">
                  Your count does not match what should be in the safe.
                </div>
              )}
              {(this.state.currentDayEntered && !this.props.manual)&& (
                <div className="already-entered">
                  You have entered a safe count for today!
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
  };
