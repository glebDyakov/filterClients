import React, { Component } from 'react';
import MobilePercentList from './MobilePercentList';

class MobilePercentHandler extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.handleModal = this.handleModal.bind(this);
  }

  handleModal(isOpen) {
    console.log("handleModal", isOpen);
    this.setState(() => ({
      isOpen,
    }));

  }

  render() {
    return (
      <div className="select-container">
        <button onClick={this.handleModal.bind(null, true)} className="select-percent-button desk-hidden">
          <p>Нажмите чтобы задать %</p>
        </button>
        {this.state.isOpen && <MobilePercentList {...this.props} onClose={() => {
          this.handleModal(false)
        }}/>}
      </div>
    );
  }
}

export default MobilePercentHandler;
