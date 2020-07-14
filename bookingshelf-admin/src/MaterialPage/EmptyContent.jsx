import React, {Component} from 'react';
import moment from 'moment';

class EmptyContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            booking: props.company && props.company.booking,
            selectedDay: moment().utc().toDate(),
            urlButton: false,
            appointmentMessage: '',
            status: ''
        };
    }

    render() {
        const { img, title, text, buttonText, buttonClick, hideButton } = this.props;

        return (
            <div className="empty-content">
                <img className="empty-content-img" src={`${process.env.CONTEXT}public/img/${img}.svg`} alt="" />
                <p className="empty-content-title">{title}</p>
                <p className="empty-content-text">{text}</p>
                {!hideButton && <button className="button empty-content-button" type="button" onClick={buttonClick}>{buttonText}</button>}
            </div>

        );
    }
}


export default EmptyContent;
