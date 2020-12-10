import React, {Component} from 'react';

class DropdownListItems extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children } = this.props;

    return (
      <ul className="d-flex flex-column">
        {children}
      </ul>
    );
  }
}

export default DropdownListItems;
