import React, {Component} from 'react';

class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.closeDropdown = this.closeDropdown.bind(this);
  }

  componentDidMount() {
    document.addEventListener("click", this.closeDropdown, false);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.closeDropdown, false);
  }

  closeDropdown(e) {
    if (this.dropdown && !this.dropdown.contains(e.target)) {
      this.props.onClose();
    }
  }

  render() {
    const {children} = this.props;
    return (
      <ul ref={node => (this.dropdown = node)}
          className="dropdown d-flex flex-column">
        {children}
      </ul>
    );
  }
}

export default Dropdown;
