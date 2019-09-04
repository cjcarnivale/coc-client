import React, { Component } from "react";
import FetchService from "../../services/fetch-service";
import dayjs from "dayjs"; 
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
  };

  updateCount = (i, e, den) => {
    console.log(this.state.counts[i][den.name])
    const counts = [...this.state.counts]
    counts[i][den.name] = e.targetvalue
    this.setState({
      counts
    })
  }

  postUpdate = (date) => {

  }

  resetCount = (date, i) => {
    date = dayjs(date).format("YYYY-MM-DD") 
    FetchService.getSafeCount(date)
    .then(count => {
      let copy = [...this.state.counts];
      copy[i] = count[0];
      this.setState({
        isLoaded: true,
        counts: copy
      })
    }, 
    error => {
      this.setState({
        isLoaded: true,
        error
      });
    }
    )
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
            {this.state.counts.map((count, i) =>
              this.state.editing === i ? (
                <div key={i}>
                  <span>{count.id.slice(4, 16)}</span>
                  {this.state.denominations.map((den, i) => (
                    <span key={i}>
                      {den.name}:{" "}
                      <input
                        type="number"
                        min="0"
                        value={count[den.name.toLowerCase()]}
                        onChange={e => this.updateCount(i, e, den)}
                      />
                    </span>
                  ))}
                  <button type="button" onClick={() => this.postUpdate(count.id.slice(4, 16))}>
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => {this.toggleEditItem(null); this.resetCount(count.id.slice(4, 16), i)}}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="daily-count" key={i}>
                  <span>{count.id.slice(4, 16)}</span>
                  {this.state.denominations.map((den, i) => (
                    <span key={i}>
                      {den.name}: {count[den.name.toLowerCase()]}
                    </span>
                  ))}
                  <button type="button" onClick={() => this.toggleEditItem(i)}>
                    Edit
                  </button>
                  <button type="button">Delete</button>
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    function getSafeCountsAndDenominations() {
      return Promise.all([
        FetchService.getAllSafeCounts(),
        FetchService.getDenominations()
      ]);
    }
    getSafeCountsAndDenominations().then(
      ([counts, denominations]) => {
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
