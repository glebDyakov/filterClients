import React from 'react';

class Hint extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state={
      opened: false,
    };

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  componentDidUpdate() {
    if (this.state.opened) {
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }
  }

  handleOutsideClick() {
    this.setState({ opened: false });
  }

  toggleDropdown() {
    this.setState({ opened: !this.state.opened });
  }

  render() {
    const { hintMessage, customLeft } = this.props;

    return (
      <span style={customLeft ? { left: customLeft } : {}} className="questions_black" onClick={this.toggleDropdown}>
        {/* <img className="rounded-circle" src={`${process.env.CONTEXT}public/img/information_black.svg`} alt="" />*/}
        {this.state.opened && <span className="questions_dropdown">{hintMessage}</span>}
      </span>
    );
  }
}

export default Hint;
