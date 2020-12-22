import React, {Component} from 'react';

class DropdownItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {children} = this.props;

    return (
      <React.Fragment>
        {children}
      </React.Fragment>
    );
  }
}

export default DropdownItem;
