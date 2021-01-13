import React, { Component } from 'react';

class IntervalSelect extends Component {
  constructor(props) {
    super(props);
    this.timer = React.createRef();
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.props.changeEvent(e);

    // if (this.timer.current) clearTimeout(this.timer.current);
    //
    // this.timer.current = setTimeout(() => {
    //   this.props.action(this.props.name);
    //   clearTimeout(this.timer.current);
    // }, 2000);
  }

  render() {
    return (
      <select {...this.props} onChange={this.onChange}>
        {this.props.children}
      </select>
    );
  }
}

export default IntervalSelect;
