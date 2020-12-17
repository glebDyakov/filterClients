import React, {Component} from 'react';

class Dropdown extends Component {
  constructor(props) {
    super(props);

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
