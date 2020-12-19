import React, { Component } from 'react';

class IntervalInput extends Component {
  constructor(props) {
    super(props);
    this.timer = React.createRef();
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    if (isNaN(e.target.value)) return;

    this.props.changeEvent(e);
    if (this.timer.current) clearTimeout(this.timer.current);

    this.timer.current = setTimeout(() => {
      this.props.action(this.props.name);
      clearTimeout(this.timer.current);
    }, 2000);
  }

  render() {
    return (
      <input {...this.props} onChange={this.onChange}/>
    );
  }
}

export default IntervalInput;
