import React, { Component } from "react";
import CountService from "../../services/count-service";
import DenominationService from "../../services/denominations-service";
import dayjs from "dayjs";
import clonedeep from "lodash/cloneDeep";
import "./History.css"
export default class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      denominations: [],
      counts: [],
      updatedCounts: [],
      isLoaded: false,
      error: null,
      editing: null
    };
  }

  toggleEditItem = i => {
    const updatedCounts = clonedeep(this.state.counts);
    if (i === null) {
      this.setState({
        updatedCounts: [],
        editing: i
      });
    } else {
      this.setState({
        updatedCounts,
        editing: i
      });
    }
  };

  updateCount = (e, denName) => {
    const updatedCounts = clonedeep(this.state.updatedCounts);
    updatedCounts[this.state.editing][denName] = e.currentTarget.value;
    this.setState({
      updatedCounts
    });
  };

  patchUpdate = date => {
    date = dayjs(date).format("YYYY-MM-DD");
    const updatedCount = this.state.updatedCounts[this.state.editing];
    CountService.updateCount(updatedCount, this.props.type, date).then(
      res => {
        const updatedCount = clonedeep(this.state.updatedCounts);
        return !res.ok
          ? res.json().then(resJson =>
              this.setState({
                error: resJson.error,
                isLoaded: true
              })
            )
          : this.setState(
              {
                isLoaded: true,
                counts: updatedCount,
                error: null
              },
              this.toggleEditItem(null)
            );
      },
      error => {
        this.setState({
          isLoaded: false,
          error: error.message
        });
      }
    );
  };

  deleteCount = (type, date, i) => {
    date = dayjs(date).format("YYYY-MM-DD");
    const copy = clonedeep(this.state.counts);
    copy.splice(i, 1);
    CountService.deleteCount(type, date).then(
      () => {
        this.setState({
          counts: copy,
          isLoaded: true
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
        ) : (
          <div>
            {this.state.error && (
              <div className="validation-error">{this.state.error}</div>
            )}
            {this.state.counts.map((count, i) => (
              <div className="history-list"key={i}>
                <span className="history-list-item">{count.id.slice(4, 16)}</span>
                {this.state.denominations.map((den, j) => (
                  <span className="history-list-item" key={j}>
                    {`${den.name.charAt(0).toUpperCase()}${den.name.substring(
                      1
                    )}`}
                    :{" "}
                    {this.state.editing === i ? (
                      <input className="history-list-item"
                        type="number"
                        min="0"
                        value={this.state.updatedCounts[i][den.name]}
                        onChange={e => this.updateCount(e, den.name)}
                      />
                    ) : (
                      <span>
                      {`${count[den.name]}`}
                      </span>
                    )}
                  </span>
                ))}
                <span className="history-list-item">{`Total: ${this.state.denominations
                  .map(den => den.name)
                  .map(
                    name =>
                      count[name] *
                      this.state.denominations.find(den => den.name === name)
                        .multiplier
                  )
                  .reduce((acc, currentVal) => acc + currentVal, 0)}`}</span>
                {this.state.editing === i ? (
                  <span>
                    <button
                      type="button"
                      onClick={() => this.patchUpdate(count.id.slice(4, 16))}
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        this.toggleEditItem(null);
                      }}
                    >
                      Cancel
                    </button>
                  </span>
                ) : (
                  <span id="history-button-container">
                    <button
                      type="button"
                      onClick={() => this.toggleEditItem(i)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        this.deleteCount(this.props.type,
                          this.state.counts[i].id.slice(4, 16),
                          i
                        )
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
    function getCountsAndDenominations(type) {
      return Promise.all([
        CountService.getAllCounts(type),
        DenominationService.getDenominations(type)
      ]);
    }
    getCountsAndDenominations(
    this.props.type).then(
      ([counts, denominations]) => {
        this.setState({
          isLoaded: true,
          denominations,
          counts
        });
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
