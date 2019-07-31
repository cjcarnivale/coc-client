import React, { Component } from "react";
import Config from "../../config";
export default class SafeCountHistoryRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counts: [],
      isLoaded: false,
      error: null,
      editing: null
    };
  }

  toggleEditItem = (i) => {
    this.setState({
      editing: i
    }); 
  }

  render() {
    return (
      <div className="history-list-container">
        {!this.state.isLoaded ? (
          <div className="loading">Loading</div>
        ) : this.state.error ? (
          <div className="error">OOPS.. something went wrong!</div>
        ) : (
          <div className="history-list">
            <h1>Safe Count History</h1>
            {this.state.counts.map((count, i) => (
              this.state.editing === i ?
              (<div>
                <span>{count.id.slice(4, 16)}</span>
                <span>Quarters: <input type="number" min="0" value={count.quarters} /></span>
                <span>Dimes: <input type="number" min="0" value={count.dimes} /></span>
                <span>Nickles: <input type="number" min="0" value={count.nickles} /></span>
                <span>Pennies: <input type="number" min="0" value={count.pennies} /></span>
                <span>Ones: <input type="number" min="0" value={count.ones} /></span>
                <span>Fives: <input type="number" min="0" value={count.fives} /></span>
                <span>Tens: <input type="number" min="0" value={count.tens} /></span>
                <span>Twenties: <input type="number" min="0" value={count.twenties} /></span>
                <span>Fifties: <input type="number" min="0" value={count.fifties} /></span>
                <span>Hundreds: <input type="number" min="0" value={count.hundreds} /></span>
                <button type='button' onClick={() => this.toggleEditItem(null)}>Cancel</button>
              </div>)
              :
              (<div className="daily-count" key={i}>
                <span>{count.id.slice(4, 16)}</span>
                <span>Quarters: {count.quarters}</span>
                <span>Dimes: {count.dimes}</span>
                <span>Nickles: {count.nickles}</span>
                <span>Pennies: {count.pennies}</span>
                <span>Ones: {count.ones}</span>
                <span>Fives: {count.fives}</span>
                <span>Tens: {count.tens}</span>
                <span>Twenties: {count.twenties}</span>
                <span>Fifties: {count.fifties}</span>
                <span>Hundreds: {count.hundreds}</span>
                <button type="button" onClick={() => this.toggleEditItem(i)}>Edit</button>
                <button type="button">Delete</button>
              </div>)
            ))}
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    fetch(`${Config.API_ENDPOINT}/safecounts`)
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            counts: result
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
