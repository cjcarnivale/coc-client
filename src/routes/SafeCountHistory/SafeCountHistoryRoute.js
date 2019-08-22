import React, { Component } from "react";
import FetchService from "../../services/fetch-service"
export default class SafeCountHistoryRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      denominations: [],
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
              (<div key={i}>
                <span>{count.id.slice(4, 16)}</span>
                {this.state.denominations.map((den, i) => ( 
                  <span key={i}>{den.name}: <input type="number" min="0" defaultValue={count[den.name.toLowerCase()]} /></span>
                ))}
                <button type='button' onClick={() => this.toggleEditItem(null)}>Cancel</button>
              </div>)
              :
              (<div className="daily-count" key={i}>
                <span>{count.id.slice(4, 16)}</span>
                {this.state.denominations.map((den, i) => (
                  <span key={i}>{den.name}: {count[den.name.toLowerCase()]}</span>
                ))}
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
    function getSafeCountsAndDenominations() {
      return Promise.all([FetchService.getAllSafeCounts(), FetchService.getDenominations()])
    }
    getSafeCountsAndDenominations()
      .then(([counts, denominations]) => {
          this.setState({
            isLoaded: true,
            denominations,
            counts
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
