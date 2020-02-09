import React from 'react';
import { connect } from 'react-redux';
import { isValidNumber } from 'libphonenumber-js';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

class PhoneInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countryCode: 'by',
            isValidPhone: this.validatePhone(props.value),
            isTouchedPhone: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.getIsValidPhone = this.getIsValidPhone.bind(this);
        this.validatePhone = this.validatePhone.bind(this);
    }
    
    componentDidMount() {
        this.getIsValidPhone(this.state.isValidPhone);
    }
    
    componentDidUpdate(prevProps, prevState) {
        const { isValidPhone } = this.state;
        if (prevState.isValidPhone !== isValidPhone) {
            this.getIsValidPhone(isValidPhone)
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.countryCode && (newProps.countryCode !== this.props.countryCode)) {
            let countryCode;
            switch (newProps.countryCode) {
                case 'UKR':
                    countryCode = 'ua';
                    break;
                case 'RUS':
                    countryCode = 'ru';
                    break;
                default:
                    countryCode = 'by';
            }
            this.setState( { countryCode });
        }
    }

    handleChange(phone) {
        const value = phone.startsWith('+') ? phone : `+${phone}`;
        this.setState({ isValidPhone: this.validatePhone(value) })
        this.props.onChange(value.replace(/[() ]/g, ''));
    }

    handleBlur(event) {
        const { value } = event.target;
        const { isValidPhone, isTouchedPhone } = this.state;

        const newState = {
            isTouchedPhone: true
        };
        newState.isValidPhone = this.validatePhone(value);

        if ((isValidPhone !== newState.isValidPhone) || (isTouchedPhone !== newState.isTouchedPhone)) {
            this.setState(newState)
        }
    }

    getIsValidPhone(isValidPhone) {
        const { getIsValidPhone } = this.props
        if (getIsValidPhone) {
            getIsValidPhone(isValidPhone)
        }
    }

    validatePhone(phone) {
        return phone && phone.replace(/[+]/g, '') && isValidNumber(phone);
    }

    render() {
        const { value } = this.props;
        const { isValidPhone, isTouchedPhone, countryCode } = this.state

        return (
            <ReactPhoneInput
                defaultCountry={countryCode}
                country={countryCode}
                regions={['america', 'europe']}
                placeholder=""
                enableLongNumbers={true}
                disableAreaCodes={true}
                inputClass={`${((!isTouchedPhone || isValidPhone) ? '' : ' redBorder')}`}
                value={value}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
            />
        )
    }
}
function mapStateToProps(state) {
    const { authentication } = state;
    return { countryCode: authentication.user && authentication.user.countryCode };
}

export default connect(mapStateToProps)(PhoneInput);
