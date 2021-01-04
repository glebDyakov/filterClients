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
    this.setState(() => ({
      isOpen,
    }));
  }

  render() {
    return (
      <>
        <button onClick={this.handleModal.bind(null, true)} className="select-staff-button">
          <>
            <p>Нажмите чтобы задать %</p>
          </>

          {this.state.isOpen && <MobilePercentList onClose={this.handleModal.bind(null, false)}/>}
        </button>

      </>

    );
  }
}

export default MobilePercentHandler;
