import React, { Component } from "react";
import SafeCountService from "../../services/safe-count-service";
import DenominationService from "../../services/denominations-service";
import dayjs from "dayjs";

export default class History extends Component {
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

  toggleEditItem = i => {
    this.setState({
      editing: i
    });
  };

  updateCount = (e, denName) => {
    let counts = [...this.state.counts];
    counts[this.state.editing][denName.toLowerCase()] = e.currentTarget.value;
    this.setState({
      counts
    });
  };

  postUpdate = date => {
    date = dayjs(date).format("YYYY-MM-DD");
    const newSafeCount = {
      date
    };
    const updatedCount = this.state.counts[this.state.editing];
    Object.assign(newSafeCount, updatedCount);
    SafeCountService.updateSafeCount(updatedCount, date).then(
      res => {
        return !res.ok
          ? res
              .json()
              .then(resJson =>
                this.setState({
                  error: resJson.error,
                  isLoaded: true
                })
              )
              .then(
                SafeCountService.getAllSafeCounts().then(counts =>
                  this.setState({
                    counts
                  })
                )
              )
          : SafeCountService.getAllSafeCounts().then(counts =>
              this.setState({
                counts,
                isLoaded: true,
                error: null
              })
            );
      },
      error => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
    this.toggleEditItem(null);
  };

  deleteCount = date => {
    date = dayjs(date).format("YYYY-MM-DD");
    SafeCountService.deleteSafeCount(date).then(
      () => {
        SafeCountService.getAllSafeCounts().then(counts => {
          this.setState({
            counts,
            isLoaded: true
          });
        });
      },
      error => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  };

  resetCount = (date, i) => {
    date = dayjs(date).format("YYYY-MM-DD");
    SafeCountService.getSafeCount(date).then(
      count => {
        let copy = [...this.state.counts];
        copy[i] = count[0];
        this.setState({
          isLoaded: true,
          counts: copy
        });
      },
      error => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  };

  render() {
    return (
      <div className="history-list-container">
        {!this.state.isLoaded ? (
          <div className="loading">Loading</div>
        ) : typeof this.state.error !== "string" &&
          this.state.error !== null ? (
          <div className="error">OOPS... Something went wrong!</div>
        ) : (
          <div className="history-list">
            {this.state.error && (
              <div className="validation-error">{this.state.error}</div>
            )}
            {this.state.counts.map((count, i) => (
              <div key={i}>
                <span>{count.id.slice(4, 16)}</span>
                {this.state.denominations.map((den, j) => (
                  <span key={j}>
                    {den.name}:{" "}
                    {this.state.editing === i ? (
                      <input
                        type="number"
                        min="0"
                        value={count[den.name.toLowerCase()]}
                        onChange={e => this.updateCount(e, den.name)}
                      />
                    ) : (
                      `${den.name}: ${count[den.name.toLowerCase()]}`
                    )}
                  </span>
                ))}
                {this.state.editing === i ? (
                  <span>
                    <button
                      type="button"
                      onClick={() => this.postUpdate(count.id.slice(4, 16))}
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        this.toggleEditItem(null);
                        this.resetCount(count.id.slice(4, 16), i);
                      }}
                    >
                      Cancel
                    </button>
                  </span>
                ) : (
                  <span>
                    <button
                      type="button"
                      onClick={() => this.toggleEditItem(i)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        this.deleteCount(this.state.counts[i].id.slice(4, 16))
                      }
                    >
                      Delete
                    </button>
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    function getSafeCountsAndDenominations() {
      return Promise.all([
        SafeCountService.getAllSafeCounts(),
        DenominationService.getDenominations()
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