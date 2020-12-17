import React, { Component } from 'react';

class IntervalInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeout: undefined,
    };
  }

  onChangeInput(e) {
    const { action, duration } = this.props;
    clearTimeout(this.state.timeout);
    this.setState({
      timeout: setTimeout(() => {
        action();
        clearTimeout(this.state.timeout);
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
