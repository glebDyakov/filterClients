import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {origin} from '../_helpers/handle-response'

import '../../public/scss/log_in.scss'

import {userActions} from '../_actions';
import {isValidEmailAddress} from "../_helpers/validators";
import ReactPhoneInput from "react-phone-input-2";

class Index extends React.Component {
    constructor(props) {
        super(props);

        let params = this.props.location

        this.state = {
            user: {
                companyName: '',
                companyTypeId: 1,
                phone: '',
                email: params.search.length !== 0 ? params.search.split('?email=')[1].replace("%40", "@") : '',
                password: '',
                password_repeated: '',
                countryCode: '',
                timezoneId: ''
            },
            invalidFields: {},
            touchedFields: {},
            authentication: props.authentication,
            submitted: false,
            agreed: false,
            openModal: false
        };

        if (params.state && params.state.param2 && params.state.param3) {
            this.state = {
                isOpenAuthModal: true,
                user: {
                    email: params.state.param1,
                    companyName: params.state.param2,
                    password: params.state.param3
                },
                submitted: false
            };
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        document.title = "Регистрация в системе Онлайн-запись";

    }

    componentWillReceiveProps(newProps) {
        if (JSON.stringify(this.props.authentication) !== JSON.stringify(newProps.authentication)) {

            this.setState({...this.state, authentication: newProps.authentication})

            if(newProps.authentication && newProps.authentication.status && newProps.authentication.status === 'register.company' && (!newProps.authentication.error || newProps.authentication.error === -1)) {
                this.setState({openModal: true});
                setTimeout(() => {
                    this.setState({openModal: false});

                }, 2000)
            }

            if (newProps.authentication.status !== 'register.company' && newProps.authentication && newProps.authentication.error && (newProps.authentication.error.code === 1 || newProps.authentication.error.code === 3 || newProps.authentication.error.length > 1)) {
                setTimeout(() => {
                    this.setState({...this.state, authentication: []});
                }, 3000)
            }
        }
    }


    handleChange(event) {
        const {name, value} = event.target;
        const {user, invalidFields, touchedFields} = this.state;

        if (name === 'countryCode') {
            if (touchedFields.timezoneId) {
                invalidFields.timezoneId = true;
            }
            user.timezoneId = '';
        }

        if (touchedFields[name]) {
            let isInvalid;
            if (name === 'email') {
                isInvalid = !value || !isValidEmailAddress(value);
            } else if (name === 'companyName' || name === 'password') {
                isInvalid = !value.replace(/[ ]/g, '')
            } else {
                isInvalid = !value;
            }
            invalidFields[name] = isInvalid
        }

        this.setState({user: {...user, [name]: value}, invalidFields});
    }

    handleBlur(event, extraName) {
        let {name, value} = event.target;
        name = extraName || name;

        const {invalidFields, touchedFields} = this.state;
        const newState = {}
        newState.touchedFields = {...touchedFields, [name]: true}
        if (!value) {
            newState.invalidFields = {...invalidFields, [name]: true};
        }

        this.setState(newState)
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({submitted: true});
        const {user, agreed, authentication, emailIsValid,} = this.state;
        const body = JSON.parse(JSON.stringify(user));
        body.phone = body.phone.startsWith('+') ? body.phone : `+${body.phone}`;

        const {dispatch} = this.props;
        if (emailIsValid && user.companyName && user.email && user.password && user.password === user.password_repeated && user.timezoneId !== '' && user.countryCode !== '' && agreed && !authentication.registering) {
            dispatch(userActions.register(body));
        }

    }

    render() {
        const {user, emailIsValid, agreed, authentication, invalidFields} = this.state;

        const modal = this.state.openModal &&
            (<div className="message-is-sent-wrapper">
                <div className="message-is-sent-modal">
                    <button className="close"></button>
                    <div className="modal-body">
                        <img src={`${process.env.CONTEXT}public/img/icons/Check_mark.svg`}
                             alt="message is sent image"/>
                        <p className="body-text">Проверьте email и завершите регистрацию, перейдя по
                            ссылке в письме</p>
                    </div>
                </div>
            </div>);

        return (
            <div>
                <div className="sign_up_container content-pages-bg">
                    <div className="logo_sign_in">
                        <div>
                            <h2 className="logo-title">Добро пожаловать!</h2>
                            <p className="logo-description">Зарегистрируйтесь и получите бесплатный пробный период 30
                                дней</p>
                        </div>
                        <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK4AAABxCAYAAABMZJgUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAB92SURBVHgB7Z0JfFTltcDPd++dfSbLZCULhCUCgqJCXaiI+Pqs2tpNik+fa2nV6gORahGf7xn7e9bisxRbkeJPfaDPti+2WNHaVooUFIUqoLITMRskIXsmmfUu3zvfnUwyk8xMJrORgfv//YbMXWe4c+75zvadC6ChoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaERLwTOUDwez2SDwTBPUZRKDgFZPur2+baazeZG0NAYYxBK6UIU1l34V8EXdXlEKkoyHUBRdoiieA1oaIwFUCTzUSh/3y+vA7R0u2lHr2dgWVIU9YW8iC8BNDROFyiAehTaD5k0Hj3ZEyK4Hp9E3V5pYPl4cy91uH0B7fuX6upqHjQ0TgdUll8KCKbLI9Fup5dGosc1ZJss/wI0NNINpeJ8RVForJxoc1C3T1TftzvcVFYU2e12V4BGRsFBhqPIZHGPywdHTnSDJCtR9z3c0AEfHT0FBoGHzj4PiBIFjhBOr9evAA2NdKHatmgdqE6XrNBoevdQfTt9fWcNjaCdj+Mr429ijQzB6/XOoCOioNC20U3vRxRaFYz7VoJGxpDR4SA9x+WLaB7Ut/ZCns0IuVYDYBQBNn/4+cA+CgUw6gX41tzJQEhovqWj1wvdTh+Mz7cAryhFuKoGNDKCzI5jiqIsGI0wLtcCOsE/0jMh/acLK/Ad7d+JQJZZP0xoGTaTAEYdDwJPgAgmJ2hkDBmd8sURvgT/qUepTPQG9AKcyiOkWBPeKLDrjebWCsygz8ZFQ4yHsSD6KSLL60AQ3kEFQkEDTQFF+SRgp8qjCIu5MCnR4RjIqG0Fjai4XK4yvNZ1NH5YDPJe0PCDCYQHmcDub+iivYGMWAwwR+1kRx91etRjbgaNqOA12kATp506HHmg0V+jQGmjrMg0HlBHf0a1moURwRt9O00OUyEJZHzsEm2mdkmS7uAI5w6sa+5kpmrAlAo1qVgkobnLFVjsk0TxdjyHBBojURi80NzZB5t21kCHw3/ZD9S1wZu7jg8kgbbsqYP3DpxkimXoeZLiV50RQXedTrdVluWl+Lav3eEBg54pUP/1cbhE6PMMymWebcCn6PV65Zsxa7YPNEZkaFRm58Em2P5ZI/x9/wl1+Q/vH4Ot++rhSGMntPe44a3dX8Afdx4DltXUGAGfzzdHUeTPgsel1h5PSFljv4HAKslmgkbM4PU6HHwFW7qc9DfbDlPUvOryJ5+30urtR9VqPOYjv7Onlr77SX04U2EaJIEzbgYEXhhWpvgNFOAbOY6/AJcnsvX4H/0C1caHIEkvY1hmB2oQBc5ynl+yZL6nq72kdNqMD2549NH6aPuy6A1es1mha5kZEEmEIm6bjuc5Aglyxk7dCVBbW2tkfysqKrxnUwyxqqpKKD/VPV6gznMdbS2GrJKyHqcle8+9P/tZF9u+btF3npZ9vuV4pxPC85JgMi67+9XqtZHOJ4viGk4Q7ofE6GhqahpfWlrqggQ54wX3bGPj8uULXCcb7qeSeKUiidks5c3sU/8PTShv0B8xFIxb5W5ufEGR5cFoCq/bs2TTH+dEOi+OXOPw9Q88VxnEBxvhVuLxT0ES0MJAZwgb77mn1NnT+dPeL47dhlLWH0tBge1XTf5lSiSvd7p0onZDsM4iuL/eaPxdtPOjwDWj4F6KJsNyzJwxAbfjK9hPcOL2veGPhU6QfS8Cb3gLkoSmcc8A/nfJkrLuhrodFJSJ4bZzKDmBsFSwraS3Wvfjpg3G7OKdt619ZjeMAo/Hc53BYPhT0KoHULjXQJrQNO4ZgLP91LJgoQ1oI7+sUlj4lQsgy2qCfxyog/01zah3/dsll3uaPsuwHYV2D4wSFNrg6MCj+HoG0ohWPJ3hbFy6dLzk890dvA5T4NDqdoNHkmBSaR4U5meBUa+DKy6qhEtnVQwKtiLrJDcdtc3Z0dGRhX+Yo9YFsvwN1LRPpNvx1QQ3w/H2dt2BTpiVCaOEnliH24NC6wWLIMCFk8fB1ZdO87tF/cyePh6mVxSp75mkKaL3is1Pr8+P9fM+/vhjnd1ufw5t3Rfh1KlyIghvwmlgTJkKaIeRx5/bUARm6K66804PaIyI5HLdIKKG7fX5M1QyCm8WZg7nnFMGV10yNURoA1w2azLUNLaCKFNWpCR01u1n9QPtsXze7Nmz2Rlv53lehtPImNG4D6xeXfqDVaveretpbmpobm753qpVP7937VoraESkuqpKjwmVmUx1mlDD+mQFSrOtcO3F0+Cqi8MLrbqvQYDywpzAIiheZ8zDPJoEMnvBaWZMCO7a6mprj9f7NtpmVxIWnQHIRk2w3Ofo+21VdbUeNCKDHphbEkGv42Hh3Jlw5zcugfPOKR1aWwQwpNbAZNT3ryZgLBjXBxnGmBDcvbW1S9BMOH/oekmRvt7a2Pht0AjLoqoqn5NwOwpzbPCD6y+DaZOKoIMVtQypyHpxx0H4xV/2wqcNbQPrAikJ4DhlxrT5xyHDOO027l3r12f7OjqWhAsoM23gFaVF+Pb/QCMsBSXlT84dp7/MoBcML7x3SJ1Dd+35FaDnOcgxG1TNe8eXpwOPy8ECjc5V4A338Xu/YU0A/wAZxGnXuEpXz80otOMibUdNXMmcNtAIi3nevK0Wq7mBCebd82fCtTPGQ2GWCQ6d6BjYp63PA28dqGeZiIF1SpBSlp2e70GGcdoFF2OJNwUvsxhk6EBHtSLvKCxatEg2GfSqjfr5qS6479UdIIlyyDU82d0HBxtDgwaCwA/Ec31u11dfWLz4YsggkmoqrK6utn/R0PAlQvSteb2d+6uqqqIK3ao33rAdOnjw8sDdw4RW9HjBYDYF7UU7tJmh0aFUUaVySnEuPHPzFapQmlADu9w+MKMTNruiUH0FS3NulhkKci2QazHBsRPtvOh0rMORbU6mXOukCO56DErv3rLl2c9qam5Fw9REqRecBkP9nf/101fMXNaatY/8W0e44+qOfn4NCaqX8Hk8YDAaQ/bRcbpRpyPPJrq2bcuxteyxYEBWFcySHIv6dxYKqij3R63CiOL5lSUwbXKx2kdNfP8gfHGy46IXv/+9u3DTesgAkmIqfPTuuy8olN6Fd6uJSWF/UccEPPujLtL7WdXa5y8Id5xXEecGpJZpW+bpsq73AylJth4Ubep4FHK6Dq7jFXnuUOFs63VDQ3svbDnYAEoYyWWO74GGduhF+7e8KFddJzl7M8bWTVhwl/736m9KknRbxDp4SksaHR2/Cudg8YS7NPAe8+2gM4SGbPEGaC51uUZVtXQ2wZpSU1FaEK7GrzjbAnabCeZOKQEuQhGgW5TAZjNCU2u3uocsioUspQsZQMKC65bFO6K5/GoOnSqX/3DNmgnB66sp5SVZupC9ZyV3CmZ9MI0YcqzA839+/PHHHaARlq6uLq6ls6cz0vZ8qwkshgjWIGrcAkwNb/ngMBw/2QEd6FvgOOmcM2eOCBlAwjYu4UgFjDB7i5kAJsoxr7UusG7vc89NxAHMoAq2JIGgC/0qbEYjSOR50IiI9Le3f7JZVqYzezUHtev0SePC2rPhOPh5E2zbc0z9bQKVupzBVAsZQuLOmQKtw1ZRtWHywDJ75/C4Q2Z39jg9fm0LzEwQMZIQ6pTxHPfX51c+9A/QCMurS5dWdjfWPsgKbPYc8U8R7+hxwuUXVYYGaYeCv0v9iTbYsZd1tPQLrQPNNF71LegWyBAS17iEexqFtEKm9JwBR0uW0KkioBOCTk+oPfg4URHVfrSUOWV4MTkyaLUwbas3GldBzPrDz7L1O8bpiPwYni3eeVGjhvrTUeaYdibUhY5S1c9/cFXCkRJvb88iSVZYo8mBi/TJsSbo6nHB5bMmQa7d1r+B+hMPKMwnOhxQc7wFDtU249r+vhMotB5JhmKLGQSjdS9kCAkL7voVD265f826R3pcXb8fOCkvgBdDWwIKbhT7VxUuES+coB/0B9i11vFC9XMPPLBj3fLlMBoMvPIqfvYCLq15NvZhI99fXp+M6WsFrwnHal8vgwTx+LwWlyiCTR/qS9Wf6ob6d/ZAC35WH69TQ2KnUJjbnR74+nkTwOToGxBaBqsoE9gF43jvuIUrP4KXXoJMIClxXI+3b3aIrLBZpf3znAIdUFALdoV8MM9XSqhtZbzbdUZ/dxkcrt7kCXlb9vn+Gk8gPMdiOC9cH9yxgNmgg9ZuF45GSlJGA0vltA3Svo9WtrrcUBCSsGEQaHP6YF9nJ7D82Lwp42DVFefCxIIseK56x7BKMYPfKe647rpKL2QISRHccfn2Z0+0td2LsdhstswuC4/aVkani9P5NYJRpzsVfIykyOewQg+WYw9UKikKLXzhkYd/DXHCcUSBUYt7miCsVRSHjqhiY2EslqqFBLi9qurYuhsXrqdu993hdP78yUXwzbnT4KLSPCi2W9UdBgprQqDQ4/WBzWCETCIpCYiqxYub0CFbpgRdPxbaUiT/b8MmS+M1+yKwjcV0UfMUYdwQBINhcODiiL36u9+N/4F5aMbBGIY5rLJCrW77eTmQBAw5ebsD166wrAgu//aVcM2d34DzLr8AzkWBvQ5Ng+Jca4hUZ5kNMPdbV0J5Zbk6IlpRsWTjiIdR9oJf33rrHMgQklar8NLKlRvueXr1VK/P8zBbZkO2ghEt2j/H32i21gX2ffqVd8y41sA0ss7gNxNYJCKb1z+06LXX4tZEOo58ISr0IhijqJEWQvim9s5JuNgBCeJsb55fXJwP1918LZRPHZwEObmyDMj+QywdGfr5GDm4bekiUMYVw4VXzoHOlnZoP9kKB3bth4P7a3QlZgtzKjKiV3BSq8POGX/pT/SC8NuBkzNzAZ0D/MH6KpSy+sB6j9JcTNUOK4Mfr+P4l3/50PI3IAHQZm6GMQzP+Y2i9l7fBEiQjcuWXTZp5pRbFz+yGMYHCa2K2Qz03KloCJsHK0FQs9LJFarQBlbZUejPmX0ufOe+G+GWJTeh40iufvXJ53IhA0hqddjyRXPdS375y3vQ7sryyfLX9HixWHRBp9N9unTpdQOGf0tbdz4zE/hAaR0hJwuoMroQQhgooYNNA8YgAt9/oyqQkKmw6dln80wd9dX/fOu1HBfJGbXagM6aiWEDTIRheBJMzIYlEaM8E2dMhoLSQltTi4f1we2CMU7S63F/tXSpY2JZ2a0GXng14OFjtCCkBy2lcgXTxDzTAoie0y198pFHEh460fxoT1YLRhYishmFpPp6HBe4HlAECZDj6/je/IX/VMZFi6AENrFwmckEsTQtsubY9FPOLX685u23Y30wyWkjJYXkK//1X7vGuV3fR027RhVeie4M3i5xNFtBwWXbDHr9z3794x+9DknAxOm+gCRQmGWEH1w+ERZ/uQLmVcbcciAqaqSlX9AoIaUQJ8yxnXf95V8zmlMjW5wifXfiNOutMMZJ2QyIqqoqz/MPPfQAleljsuw7HLzN5/GYOYw6oLPwwb88+OB/Jqt42Wo1nKBJONOc8Tlg1guodXm4eILdP18rCQR6eCmSMh3iRDy+8zaO5+ZDyiAsqvhTV82utGUf4yHlkyUvmz51zd5jx27Et58G1ik+Xw5muFoshNy4IInPX3BSdzNHonYbjolOl9R/BgoOj8jiy5AUiGo2AabHx8VzeMunLRaeO/yz1OdYaIHeLLyM5tzQWpEOjtKwjUPk7l4qc9Sjd8MHpNTeACkm5YK79JZbHDc9tCLkEUEen0+fm5t7269WrEhq3LXz2kv6jNW721DeCiEB9jR04mgAGN8U4OOG7nAP4IgL1Vxgd5YcWrcRK0VZx+7Cb1IMaYDzORcQxbMAhJHLMNAZBzZoCizJYSJ1tLPzAmK390AKSctkyfz8opCGEya9Qb9+xYqkVyJVEaJwFBK+20VJgZ2ft8OfDrRAmyO5naCYg4Y3Qtbbb9eMykiltduMaGQ8DGmCsnkTvS2x7csiF+ptySp+KHO8r4UUkxbBdfZ00/X9lfVo+3KSrKSsWBkjC0kZptQpSJB8+h00w6d9beWjOU7hhfvwfxcykvQ63eD1SSnJcqvf0tXGyvdG3nlIooM3GpsgxaRFcLu9HseeTX9V3XOfTldAZfEkpAi8hLGpidOE6qDh355ecVKsx7S1HbGBKA/Ttk2nOjAqo4OUmbyiG3+wEboz9WdHByFKn9OZ8MNJRiItglucaz+uGOUS9r5NFC/JMWenbB4ZF2fwXG3+FsMrUe3G8f7KOTRHYnbQcvpaVxKODovLEY5PwjcaAfcI4XVZCXkGGr7tthYVxdT5MRHS0oJpwriCuuO1jWzqzh63xzM1t7J8G6QKShriVUG93R3+oTGKLFhz8tTIQLwI/cfqOK4ilv3pyY/HU7Fv2dDv1NzaCfacxJpZNqLGLrRng0EXWQyopzvq5aRyaGmJROkJfRoexZUWwXU3NrZ6FFn1pA16Y/ZTixenrDugUS/UeMT4ImzuPgcUl02MuF2mkHCEIVCeISr+ESga7Jltct3fq/GQoQW34PR4YXJR3rAGd6P6LooCBjazWokiZ16H/2YmEW7WocfK9BSkgbSYCo899pjypVkXPVXT1O3Mycn/CqRwfNMJNG7HIFCpFgk2zSjRyBjfn/bF80QN8LMMmdKw82n8gS4Jt90nyerTchJBlGMoxGOfIUd+rCkd4pgRnvsQ0kBaBJc9xVGWRM7rFc3tXW2HIYVIXndnvOOUoIveUkBJhsbtf+YY/hu9XqF226NEEZeFrqQD30PHx1+2PGokN0TUNUqo8BPCHYM0kLamd6gfxI6eThwilZQWe8+dZO7GixyXKSKNYGLQJAwUapgNta5CaEF1mKbVeGNwcu3fH6eE/CRkA6vtOHQUyN5PoOfwMbBnWyBRYs4IqoIb3tKl0qCaUGuvqZRwsVQspE1w0UQiDmcfOgK6lNpAs2fPljiOa41HxEQx+pQrWUmO4PL+WbfZn/dZs4O3OT7enC/W7fgtBsz+c9hxdRiednvUMkV7TzfkK4M3mdvrg+5eJ3i80rD5ZNFgEyWj2rcBIpkKlIbY2Gw08RmNn0IaSItzxuy1Z367Se/C1KBZb6yDFMIKdp567cNafBdznFQ9jv2jRLb51HAZE9wk3OrqFB4K1kWzjGtX1L3XiMaz2J9c+DZ+yvBaXabJzEYgnV2DPROO1wFBwTvc58UbToKi/BzocvSpT97xoXDrBR4qK0qiehOyFNtkE7WFQNgTyKH3CYFOi8WSlmL+lAnu+2+8YWtt7FaHws0v/c4gGAVjj6MbCnSCZ9OzGwdqF77zb7ezFkLJddYk0jzakBj7AgZD9OFXQmnTJ+GKqQ46VYvOvkvoSOYJ7t+NIammU6zlz+AGFFZWIzB1YnnQf3VQgXswo1ZT34yHyNRqMpLykoIQ7ehl8/0StJOpKvghF7oR0kRKBPfJJ5+c9ObmLYcUUQ7npm/5EGoGFv797vvve2L9M89BEuEF2OOT4Zb+7HlMeL1uMFhtUfeRk1BsoyYxUCsWWAgUWUf+duoeFgvQChTQ+hOsF4B/Q04WwPjyiP8/DAtC5Xg1x0F6el1Qf+IUODBFbDbpUSNLamhvZuX4hMJpQ9PBONolpR46FlIiuM4upwGFNqan5SjAJadSOwjrRGFtb73cRxQyNdYIA/V5TEZb7n2RtqvdDHHIxPzBSzqeiyk7pyPUMIWeWixQySRl5QDV6dSmR9SuwJUYLjbGevX1eCnz8oBabSJ8euAEkaWJyoTymG/KbJtZfQ38R/zFMDELbaReFUNDYZTAIUgTKUtzP3Xjv/yRSOI3o30Ax/Oio+Sywqo1D3TDaebZP31yjqPXczTS4Ml+4pZuF5oT/Pmr7py/H2LE9+bGiwXR8QKcP/084BOZeQ9eSoSb0Gt306aWP3PjioBLU/MTYp8CkMUmbYR+ntLjCCmwoRx/h5CbtRHSQMqiCkaPq8coecAQ5WVU0IvIWTYm2oi6nL5J0cRAjeHGEVXQX3/7P6Tzv3QnJGZPeik1LhIq5r2OhtACqSBPtV/TBsfi22GuzlCNK5BaSBPas3z74ThaEe1iUCVWo2M4OqvpCIW47T+fwhluFSZdttn/Rei1RjQ5mNkiyQk1w4kdIUyXmyGmBkaOZMFqrYc0cVoFNz0DXWygIORF265qXIgPUjzLifGIH+Hb0fXm4ohEOP33hQlzX2OLbEI0D/75atMnlkItOlyQjg5/Qhgfm900wVVhHGEjZ9qiCikTXJ3FHDVDpva7IqSjqir1lUSxQCjJiVbOmGjyQZg4948SkB/j25iK6NHRaVdk4QYy4cuvBNaJ9R/OQFlRXToUFKgoK4LPjtSB15fCJuJMaPnhgstCYSGZREobCEnfb5my2/WVqqopPZ/u2UUjaDJWIMLn5C/+4csvvwRpZsXzH3zVI7mfCX5ICqZhiwmQ7MhHUVV40SGqo+yxQv1gKuGjX9x79bDp3A+u//tfcSifAEGfwbDpabmOJyYYAY8EXW6RttOg38ikI1lmAQqDbyFWt+XFENmF5UZYOIMk/we1TwaSNXyyhuJysWDx4DKlb+ny7ddDmogakFGfnIPpf4iTUzVHf3F8164Vvr6+kAApQT8lf8LkV2Z89Rr3PRs33gRpZt/nLXNqmnqmQnxUDLxDKbHoec9qSof9H/60+3iF0yudA/Fj73/FRI7OBx70oczG5HVdpBgQJ7bwLSCIIAAN+ijUthINcx3ixIvn2xRth6g3KJWkxegNvwAaGmmFthLCRa2e06IKGhmJJrgaY5AYU+GRaGlpsRQVFVUEln0+H9Hr9TSRv+w88RzLjnviif9+atmyex+2WCxjIhKRZvS0dX/CDxdx9rlg89Y9MOvcCZBlNUNhXg7+HkNcHb0NSE5F5JPIEjpnIf0m2jibdQF7E8/vGmYdBpxI1PRxVOesuLjYiX8OwhjhKwuu6Xj00R/HnG49k+iufy83S0m8W5UFx1i91APOzhY4t3QyAL6Hoacl0bN8VJTV6rQACqFHeELSKicZYyr8++rVpbJEk9tWJoMwcuY8SBJM2x46GjlXQPTRq+SGZhExtHkc0kzGCO5Hm/5ykclmS8tEvLGIIssJ9UMLpqKsGE40tYbdpo7duhH6hSmhHSYwup22csYAGSO4MhVnmrKyP4GzFB3xxvYQwBhgndFdLHkQqbpMN0JbM7WgPSjdy5O0P8IgYwRXbzB/KS+r/CicpVBZjqs1aSSybRbodgyfU6qaCcIIEzGHmAqKYP4I0kxGCK76eHuel55/vsoFZym1XXxfMmYZB5hcUQx7Dw6pQmT55ayS6LEmedh0HdBZdGmrCguQlsmSifL662/NEN2eMVG3m25++tKOgk5JqVq723tPiY3AxaUUzivmIM8U26NYI3HetAmwa9+x0C7Y2Si01uiKfWjLJTy+F0NXKe2FG46MENzGupMlBqPxrHqS+r1rq602Y+FdbV7pv1A4TOzRWi04sm9GY+nNoxTKsxW4uIxAucUDZXYjjLa8pqK8EDZUvztwFLGhwOZWjnzg0Co5Ap9Bsie7xkBGCG5Bvn2+JMkJPQMtk1j5wo4v+yTpGY9PGXhGcrBYMimpbfXAZ0ebwZZXAmW5AEWYk5lVTCAPXbhi1MzCCEagXieAyaTHOFuOv/rLZI+pJwMd1rmGpLylaDgyQnD7nL1l37rh+gNv/nkTnMlU/U+t0SM33O8SxSrUoMZwYsS6xficPSB5nZBdWMEeNQLNqImb+gjsa/ErPhsmn/ItBPJRiMuzAOxmAgbBv01UCPR5KZxEw+uENwv6jBVgM4/isWshpgLrK0bTNl0nmLE0CSEsVVXV+m3vrH9x+wdbx/wjjBLhR+u35SuUblAU+rVoT4D39HWBz90HtvwyiPdJ8UyEp5fnQaG7ltrtOWT+VfNjPJCC3N0Dg89IQneRI7cLubkvQ5oZ8xq3tm1Ppdls6oUzmKqXt83sdipvsO470YTR3dOGiQg6aqFlHXh43v/AwUKbEeZUFsKcKUVwsslCtm//AKiX1cWPcD6qgOLxwtAHe8lUd1pi62NecJsP7BsvUvI+nKH8x8btF/Y4lbfZzLRo+7lQaNmsEYs9xgQa7qtDQ3d2RR7MLMmC4myTKrhCYI6a242mhAVqDh0C6mRRxngqsoiiz7Wcltj6mBdczmCeazMaz0jHrGrD1iu6XTIz3CPWITAFJ/s8IItedMRifCAlCu3kYhvccskEyDIGWqcOFzujoT8awbR3HHEBtLdZiNIHp4Exn4DweT0T5i28LqU9dU8HT7yy46JuN0QVWgYTN0d7A1iZ0I5gHgRkb/ZEO9xzxeR+oY3ciIolNGxWCzq/TogLQrYm66mgo2VMa1yWMVv37IviQ7fdFueVHZs8uG7bzNZe8W/4o+dG249FEJhdm1s8JSablu1Rkmv6YNHFEzDGQHLR2TOOpEoLCoq8u3fvMS+4cl6sTRpcPCFNeO5mp875H3CaGNOC+9b2XZONeh2cSdyzbmupTODPTLAi7aOKGqWKQcc/q88vvl2UlOyRzsuOseq51yo42y2GPHvMw/f1198wo6Ol45qrF37z55BBjGlT4cS+/RUiwFY4Q6g+cEBvE7gNqEmjP+CZUpkD8jBHuBqfKI8otAzUgu9ZBNMPFy2aOSqbc/bXr67NzrHFGA8bO4xpwdUZ9Jfq9Ya0Fymnit3vtT7mE5WrmDYN96LsBVQSOO5Hq3+44GmfLH2f9S6PtH/gGDQjPlYIf+Mjt18y6jb2VXff7UKLJGVPQUoV/w9cEwtiHek3eQAAAABJRU5ErkJggg=="
                            alt="Login image"/>
                    </div>
                    <div className="sign_up">
                        <div>
                            <form id="sign-up-form" name="form" onSubmit={this.handleSubmit}>
                                <span>Название компании</span>
                                <input type="text" className={'' + (invalidFields.companyName ? ' redBorder' : '')}
                                       onBlur={this.handleBlur} name="companyName" value={user.companyName}
                                       onChange={this.handleChange}/>

                                <span>Вид деятельности</span>
                                <div className="custom-select-wrapper">

                                    <select className="custom-select" name="companyTypeId" onChange={this.handleChange}
                                            value={user.companyTypeId}>
                                        <option value={1}>Салоны красоты, барбершопы, SPA</option>
                                        <option value={2}>СТО, автомойки, шиномонтажи</option>
                                        <option value={3}>Коворкинг</option>
                                        <option value={4}>Медицинские центры</option>
                                    </select>
                                </div>

                                <span>Cтрана</span>
                                <div className="custom-select-wrapper">
                                    <select
                                        className={"custom-select" + ((invalidFields.countryCode ? ' redBorder' : ''))}
                                        onBlur={this.handleBlur} value={user.countryCode} name="countryCode"
                                        onChange={this.handleChange}>
                                        <option value=''></option>
                                        <option value='BLR'>Беларусь</option>
                                        <option value='UKR'>Украина</option>
                                        <option value='RUS'>Россия</option>
                                    </select>
                                </div>
                                <span>Таймзона</span>
                                <div className="custom-select-wrapper">
                                    {user.countryCode === '' &&
                                    <select
                                        className={"disabledField custom-select" + ((invalidFields.timezoneId ? ' redBorder' : ''))}
                                        onBlur={this.handleBlur} value={user.timezoneId}
                                        name="timezoneId">
                                    </select>
                                    }
                                    {user.countryCode === 'BLR' &&
                                    <select
                                        className={"custom-select" + ((invalidFields.timezoneId ? ' redBorder' : ''))}
                                        onBlur={this.handleBlur} value={user.timezoneId}
                                        name="timezoneId" onChange={this.handleChange}>
                                        <option value=''>-</option>
                                        <option value='Europe/Minsk'>Europe/Minsk</option>
                                    </select>
                                    }
                                    {user.countryCode === 'UKR' &&
                                    <select
                                        className={"custom-select" + ((invalidFields.timezoneId ? ' redBorder' : ''))}
                                        onBlur={this.handleBlur} value={user.timezoneId}
                                        name="timezoneId" onChange={this.handleChange}>
                                        <option value=''>-</option>
                                        <option value='Europe/Kiev'>Europe/Kiev</option>
                                    </select>
                                    }
                                    {user.countryCode === 'RUS' &&
                                    <select
                                        className={"custom-select" + ((invalidFields.timezoneId ? ' redBorder' : ''))}
                                        onBlur={this.handleBlur} value={user.timezoneId}
                                        name="timezoneId" onChange={this.handleChange}>
                                        <option value=''>-</option>
                                        <option value='Europe/Moscow'>Europe/Moscow</option>
                                        <option value='Europe/Astrakhan'>Europe/Astrakhan</option>
                                        <option value='Europe/Kaliningrad'>Europe/Kaliningrad'</option>
                                        <option value='Europe/Kirov'>Europe/Kirov</option>
                                        <option value='Europe/Samara'>Europe/Samara</option>
                                        <option value='Europe/Saratov'>Europe/Saratov</option>
                                        <option value='Europe/Simferopol'>Europe/Simferopol</option>
                                        <option value='Europe/Ulyanovsk'>Europe/Ulyanovsk</option>
                                        <option value='Europe/Volgograd'>Europe/Volgograd</option>
                                        <option value='Asia/Anadyr'>Asia/Anadyr</option>
                                        <option value='Asia/Barnaul'>Asia/Barnaul</option>
                                        <option value='Asia/Chita'>Asia/Chita</option>
                                        <option value='Asia/Irkutsk'>Asia/Irkutsk</option>
                                        <option value='Asia/Kamchatka'>Asia/Kamchatka</option>
                                        <option value='Asia/Khandyga'>Asia/Khandyga</option>
                                        <option value='Asia/Krasnoyarsk'>Asia/Krasnoyarsk</option>
                                        <option value='Asia/Magadan'>Asia/Magadan</option>
                                        <option value='Asia/Novokuznetsk'>Asia/Novokuznetsk</option>
                                        <option value='Asia/Novosibirsk'>Asia/Novosibirsk</option>
                                        <option value='Asia/Omsk'>Asia/Omsk</option>
                                        <option value='Asia/Sakhalin'>Asia/Sakhalin</option>
                                        <option value='Asia/Srednekolymsk'>Asia/Srednekolymsk'</option>
                                        <option value='Asia/Tomsk'>Asia/Tomsk</option>
                                        <option value='Asia/Ust-Nera'>Asia/Ust-Nera</option>
                                        <option value='Asia/Vladivostok'>Asia/Vladivostok</option>
                                        <option value='Asia/Yakutsk'>Asia/Yakutsk</option>
                                        <option value='Asia/Yekaterinburg'>Asia/Yekaterinburg</option>
                                    </select>
                                    }
                                </div>

                                <span>Телефон</span>
                                <ReactPhoneInput
                                    defaultCountry={'by'}
                                    country={'by'}
                                    regions={['america', 'europe']}
                                    placeholder=""
                                    value={user.phone}
                                    onChange={phone => {
                                        this.setState({user: {...user, phone: phone.replace(/[() ]/g, '')}})
                                    }}
                                />

                                <span>Введите email</span>
                                <input type="text" className={'' + (invalidFields.email ? ' redBorder' : '')}
                                       onBlur={this.handleBlur} name="email" value={user.email}
                                       onChange={this.handleChange}
                                       onKeyUp={() => this.setState({
                                           emailIsValid: isValidEmailAddress(user.email)
                                       })}
                                />

                                <span>Пароль</span>
                                <input type="password" className={'' + (invalidFields.password ? ' redBorder' : '')}
                                       onBlur={this.handleBlur} name="password" value={user.password}
                                       onChange={this.handleChange}/>

                                <span>Подтвердите пароль</span>
                                <input type="password"
                                       className={'' + (user.password && !user.password_repeated || (user.password_repeated && user.password !== user.password_repeated) ? ' redBorder' : '')}
                                       name="password_repeated" value={user.password_repeated}
                                       onChange={this.handleChange}/>

                            </form>
                        </div>
                        <div className="bottom-container">
                            <label>
                                <input className="form-check-input" type="checkbox" onChange={() => this.setState({
                                    agreed: !agreed,
                                    invalidFields: {...invalidFields, agreed: agreed}
                                })} name="agreed" onBlur={this.handleBlur} checked={agreed}/>
                                <span className={"check-box-circle" + (invalidFields.agreed ? ' redBorder' : '')}/>
                                Я принимаю условия&nbsp;<a
                                href={`${origin}/licence_agreement`}
                                target="_blank"
                                onClick={() => this.setState({openModal: true})}>пользовательского соглашения</a>
                            </label>



                            {authentication && authentication.error && ((authentication.error.code === 3) || (authentication.error.length > 0 && authentication.error[1] && authentication.error[1].code === 3)) &&
                            <p className="alert-danger p-1 rounded pl-3 mb-2">Такой email уже зарегистрирован</p>
                            }
                            {authentication && authentication.error && ((authentication.error.code === 1) || (authentication.error.length > 0 && authentication.error[0] && authentication.error[0].code === 1)) &&
                            <p className="alert-danger p-1 rounded pl-3 mb-2">Название такой компании уже
                                зарегистрировано</p>
                            }
                            <button form="sign-up-form"
                                    className={((!emailIsValid || !user.companyName.replace(/[ ]/g, '') || user.countryCode === '' || (user.password !== user.password_repeated) || user.timezoneId === '' || user.password.replace(/[ ]/g, '') === '' || authentication.registering) || !agreed ? 'disabledField' : '') + ' button sign_up_button'}
                                    type={emailIsValid && user.companyName.replace(/[ ]/g, '') && user.countryCode !== '' && user.timezoneId !== '' && user.password.replace(/[ ]/g, '') !== '' && agreed && 'submit'}
                            >Зарегистрироваться
                            </button>

                            {authentication.registering &&
                            <img style={{width: "57px"}}
                                 src="data:image/gif;base64,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06pdy7at27dw/+PKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fv4MOLH0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5P+STDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz26++/AAcs8MCN2QDDACqwQEINJgABABAm1EACCyoMAIP/Dfd8AEEABYwggAERbGDEBhEYIMAIBQQAwQcZb9zxxyGPXPLJKa9sj8YcewyyyCSbjLLKLN/sss4x90wz0GLNQEMQKegAwNNQRy310zqkEAQNM7zDgQYUVICBEWCHLfbYYGNQAQUacKA1116T7bbYZqOtdjtbd/3122/HnfbaduOd99l7b1XAEC1MbfjhUbcwRAHrMJDAAX5HLvYBCTDQ+OOSZ0655ek4DnnmkW9++eeg4y26VTcIgQLirLcOAApC3FDOBCFkUPrtGYQwwey131567ruPQ7vtvmcOPO/EFx/58VG9IMMKrkfP+goyvBAOCB0soPztC3QAwvXZb196//fff4O99uJnTj746Kcf+fpOEXCC9PSzfgIB33hAgPu3E+BB/vvjH+j85w39CXCA/ytgAA8YOQIuJQc+qJ8EWeeDHGxDBA5g4O0cIIILZlCDoOOgNjAIwhB2cIQfLGHkRIiUAcRggjA8XAwGkI0ASECFoJNAAGp4QxxK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3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAwocSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gw4odS7as2bNo06pdy7at27dw/+PKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fv4MOLH0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5P+STDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz26++/AAcs8MAXfgBBAAWMIIABEWxgxAYRGCDACAUEAMH/B/cYjLDCDDsMscQUW4zxOjbAMIAKLJBQgwlAAACECTWQwIIKA8BgA6AcaEBBBRgY4fPPQAftMwYVUKABB+/kvHPPQjf9M9FGIz3ODDQEkYIOAGSt9dZcZ61DCkHQMIOeDCRwgNNoO31AAgysU/bZacf989ptf1PAEC10rffeW7cwRAF1ThBCBnIXLnQGIUxQjuCEG+64EYgrns0NQqDA9+WYA4CCEDfACUIHCzwuus8LdABCOJ+HPvrjpZ9ezQsyrJD57JevIMMLbXpAwOq8E+DBN7rzvrrv1BBwAu3IX34C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WI3WeI3YmI3auI3c2I3e+I3gGI7iOHmO5FiO5niO6JiO6riO7NiO7viO8BiP8jiP9FiP9niP+JiP+riP/NiP/viPABmQAjmQBFmQBnmQCJmQCrmQDNmQDvmQEBmREjmRFFmRFnmRGJmRGrmRHNmRHvmRIBmSIjmSJFmSJnmSKJmSKrmSLNmSLvmSMBmT8BAIACH5BAUUAEcALAAAAAAgA1gCAAf/gEeCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAwocSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gw4odS7as2bNo06pdy7at27dw/+PKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fv4MOLH0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5P+STDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz2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"/>}
                        </div>
                    </div>
                    <div className="block_bottom">
                        <span className="sign_up_text">Уже есть аккаунт?&nbsp;</span>
                        <Link to="/login"><p className="sign_up_open" type="button">Войти</p></Link>
                    </div>

                </div>
                {modal}

                <p className="footer">© Онлайн запись</p>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {authentication} = state;
    return {
        authentication
    };
}

export default connect(mapStateToProps)(Index);
