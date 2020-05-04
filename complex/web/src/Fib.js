import React, { Component } from "react";
import axios from "axios";

class Fib extends Component {
  state = {
    seenIdices: [],
    values: {},
    index: "",
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndices();
  }

  async fetchValues() {
    const values = await axios.get("/api/values/current");
    this.setState({ values: values.data });
  }

  async fetchIndices() {
    const seenIndices = await axios.get("/api/values/all");
    this.setState({ seenIndices: seenIndices.data });
  }

  renderSeenIndices() {
    return this.state.seenIdices.map(({ number }) => number).join(", ");
  }

  renderValues() {
    const entries = [];
    this.state.values.forEach(() => {
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      );
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    await axios.post("/api/values", {
      index: this.state.index,
    });

    this.setState({ index: "" });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter index:</label>
          <input
            value={this.state.index}
            onChange={(event) => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>
        </form>
        <h3>Indices Seen</h3>
        {this.renderSeenIndices()}
        <h3>Calculations:</h3>
        {this.renderValues()}
      </div>
    );
  }
}

export default Fib;
