import React, { Component } from 'react';

class IntervalInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      interval: undefined,
    };
  }

  onChangeInput(e) {
    const { action, duration } = this.props;
    clearInterval(this.state.interval);
    this.setState({
      interval: setInterval(() => {
        action();
        clearInterval(this.state.interval);
      }, 2000),
    });
  }

  render() {
    const { onChange, value } = this.props;

    return (
      <input
        placeholder="%"
        onChange={(e) => {
          onChange(e);
          this.onChangeInput(e);
        }}
        type="number"
        value={value}/>
    );
  }
}

export default IntervalInput;
