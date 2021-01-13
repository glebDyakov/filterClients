import React, { Component } from 'react';
import PercentList from './PercentList';

class MobilePercentList extends Component {
  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, false);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.onClose();
    }
  }

  render() {
    return (
      <div className="list-modal-wrapper">
        <div ref={this.setWrapperRef} className="list-modal">
          <PercentList {...this.props}/>
        </div>
      </div>
    );
  }
}

export default MobilePercentList;
