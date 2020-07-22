import React, {Component} from 'react';
import moment from 'moment';

class AddButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      booking: props.company && props.company.booking,
      selectedDay: moment().utc().toDate(),
      urlButton: false,
      appointmentMessage: '',
      status: ''
    };
    this.showButtons = this.showButtons.bind(this)
    this.hideButtons = this.hideButtons.bind(this)
  }

  showButtons() {
    this.setState({ showButtons: true })
  }

  hideButtons() {
    this.setState({ showButtons: false })
  }

  render() {
    const { handleOpen, buttonText } = this.props;
    const { showButtons } = this.state;

    return (
      <React.Fragment>

        <a className={"add" + (showButtons ? ' rotate' : '')} onClick={showButtons ? this.hideButtons : this.showButtons}/>
        <div className={"buttons-container" + (showButtons ? '' : ' hide')}>
          <div className="p-4">
            <button type="button"
                    onClick={handleOpen}
                    className="button">{buttonText}
            </button>
          </div>
          <div className="arrow"></div>
        </div>
      </React.Fragment>

    );
  }
}


export default AddButton;
