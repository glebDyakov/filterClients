import React from 'react';
import { connect } from 'react-redux';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

class PhoneInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countryCode: 'by',
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(phone) {
        const value = phone.startsWith('+') ? phone : `+${phone}`;
        this.props.handleChange(value.replace(/[() ]/g, ''));
    }

    render() {
        const { value } = this.props;

        return (
            <ReactPhoneInput
                defaultCountry={'by'}
                country={'by'}
                regions={['america', 'europe']}
                placeholder=""
                value={value}
                onChange={this.handleChange}
            />
        )
    }
}
function mapStateToProps(state) {
    const { authentication } = state;
    return { countryCode: authentication.user && authentication.user.countryCode };
}

export default connect(mapStateToProps)(PhoneInput);
