import React, { Component } from 'react';

class IntervalInput extends Component {
  constructor(props) {
    super(props);
    this.timer = React.createRef();
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const { value } = e.target;


    if (isNaN(parseFloat(value))) return;


    this.props.changeEvent(this.props.typePercent, { ...this.props.item, amount: parseFloat(value) }, this.props.isNested);

    if (this.timer.current) clearTimeout(this.timer.current);

    this.timer.current = setTimeout(() => {
      this.props.action({
        ...this.props.item,
        amount: parseFloat(value),
      });
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
