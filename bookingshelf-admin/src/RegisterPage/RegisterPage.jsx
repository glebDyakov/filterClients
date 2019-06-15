import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { isValidNumber } from 'libphonenumber-js';
import '../../public/scss/licenseAgreement.scss'


import { userActions } from '../_actions';
import ReactPhoneInput from "react-phone-input-2";
import {history} from "../_helpers";

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);

        let params = this.props.location

        this.state = {
            user: {
                companyName: '',
                phone: '',
                email: params.search.length!==0 ? params.search.split('?email=')[1].replace("%40", "@"):'',
                password: '',
                password_repeated: '',
                countryCode: '',
                timezoneId: ''
            },
            authentication: props.authentication,
            submitted: false,
            agreed: false,
            openModal: false
        };

        if(params.state && params.state.param2 && params.state.param3){
            this.state = {
                user: {
                    email: params.state.param1,
                    companyName: params.state.param2,
                    password: params.state.param3
                },
                submitted: false
            };
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isValidEmailAddress = this.isValidEmailAddress.bind(this)
    }

    componentDidMount() {
        document.title = "Регистрация в системе Онлайн-запись";

    }

    componentWillReceiveProps(newProps) {
        if ( JSON.stringify(this.props.authentication) !==  JSON.stringify(newProps.authentication)) {

            this.setState({...this.state, authentication: newProps.authentication})

            if(newProps.authentication.status!=='register.company' && newProps.authentication && newProps.authentication.error && (newProps.authentication.error.code === 1 || newProps.authentication.error.code === 3 || newProps.authentication.error.length>1)){
                setTimeout(() => {
                    this.setState({...this.state, authentication: [] });
                }, 3000)
            }
        }
    }

    handleChange(event) {
        const { name, value } = event.target;
        const { user } = this.state;



        if(name==='countryCode'){
            this.setState({...this.state, user: {...user, [name]: value, timezoneId: '' }});
        }else {
            this.setState({
                user: {
                    ...user,
                    [name]: value
                }
            });

        }
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({ submitted: true });
        const { user, agreed, authentication } = this.state;
        const { dispatch } = this.props;
        if (user.companyName && user.email && user.password && user.timezoneId!=='' && user.countryCode!=='' && agreed && !authentication.registering) {
            dispatch(userActions.register(user));
        }
    }

    render() {
        const { user, emailIsValid, agreed, authentication } = this.state;

        return (
            <div>
                <div className="container-bg slideLeft"></div>
                <div className="sign_up_container content-pages-bg">
                    <div className="logo_sign_in">
                        <a href="#" className="logo">
                            <span className="logo2"></span>
                        </a>
                    </div>
                    <div className="sign_up">
                        <div>
                            <form name="form" onSubmit={this.handleSubmit}>
                                <p>Зарегистрируйтесь и получите бесплатный пробный период 30 дней</p>
                                <span>Название компании</span>
                                <input type="text" className={'' + (user.countryCode && !user.companyName ? ' redBorder' : '')} name="companyName" value={user.companyName} onChange={this.handleChange} />

                                <span>Введите email</span>
                                <input type="text"   className={'' + (!this.isValidEmailAddress(user.email) && user.password && !user.email  ? ' redBorder' : '')} name="email" value={user.email} onChange={this.handleChange}
                                       onKeyUp={() => this.setState({
                                           emailIsValid: this.isValidEmailAddress(user.email)
                                       })}
                                />

                                <span>Cтрана</span>
                                <div className="">
                                    <select className={"custom-select"+((user.countryCode && user.countryCode===''  ? ' redBorder' : ''))} value ={user.countryCode}  name="countryCode"  onChange={this.handleChange}>
                                        <option value=''></option>
                                        <option value='BLR'>Беларусь</option>
                                        <option value='UKR'>Украина</option>
                                        <option value='RUS'>Россия</option>
                                    </select>
                                </div>
                                <span>Таймзона</span>
                                <div className="">
                                    {user.countryCode === '' &&
                                    <select className={"disabledField custom-select"+((user.countryCode && user.timezoneId===''  ? ' redBorder' : ''))} value={user.timezoneId}
                                            name="timezoneId">
                                    </select>
                                    }
                                    {user.countryCode === 'BLR' &&
                                    <select className="custom-select" value={user.timezoneId}
                                            name="timezoneId" onChange={this.handleChange}>
                                        <option value=''>-</option>
                                        <option value='Europe/Minsk'>Europe/Minsk</option>
                                    </select>
                                    }
                                    {user.countryCode === 'UKR' &&
                                    <select className="custom-select" value={user.timezoneId}
                                            name="timezoneId" onChange={this.handleChange}>
                                        <option value=''>-</option>
                                        <option value='Europe/Kiev'>Europe/Kiev</option>
                                    </select>
                                    }
                                    {user.countryCode === 'RUS' &&
                                    <select className="custom-select" value={user.timezoneId}
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

                                <span>Пароль</span>
                                <input type="password" className={'' + ((user.countryCode || user.companyName) && !user.password ? ' redBorder' : '')} name="password" value={user.password} onChange={this.handleChange} />

                                {/*<span>Подтвердите пароль</span>*/}
                                {/*<input type="password"  className={'' + (user.password && !user.password_repeated || (user.password_repeated && user.password!==user.password_repeated) ? ' redBorder' : '')} name="password_repeated" value={user.password_repeated} onChange={this.handleChange} />*/}
                                <label>
                                    <input type="checkbox" onChange={()=>this.setState({...this.state, agreed: !agreed})} checked={agreed}/>
                                    <span className={'' + ((user.countryCode || user.companyName) && !agreed ? ' redBorder' : '')}/>
                                    Регистрируясь, вы принимаете условия <span
                                    style={{width: "initial", height: "initial", border: "none", marginLeft: "34px"}}
                                    onClick={()=>this.setState({openModal:true})}>публичного договора</span>
                                </label>


                                {authentication && authentication.error && ((authentication.error.code === 3)  || (authentication.error.length>0 && authentication.error[1] && authentication.error[1].code === 3)) &&
                                <p className="alert-danger p-1 rounded pl-3 mb-2">Такой email уже зарегистрирован</p>
                                }
                                {authentication && authentication.error && ((authentication.error.code === 1)  || (authentication.error.length>0 && authentication.error[0] && authentication.error[0].code === 1)) &&
                                <p className="alert-danger p-1 rounded pl-3 mb-2">Название такой компании уже зарегистрировано</p>
                                }
                                {
                                    authentication && authentication.status && authentication.status === 'register.company' && (!authentication.error || authentication.error===-1)  &&
                                    <p className="alert-success p-1 rounded pl-3 mb-2">Проверьте email и завершите регистрацию, перейдя по ссылке в письме</p>
                                }
                                <button className={((!emailIsValid || !user.companyName || user.countryCode==='' || user.timezoneId==='' || authentication.registering) || !agreed ? 'disabledField': '')+' button text-center'}
                                        type={emailIsValid && user.companyName && user.countryCode!=='' && user.timezoneId!=='' && agreed && 'submit'}
                                >Регистрация
                                </button>

                                {authentication.registering &&
                                <img style={{width: "57px"}}
                                     src="data:image/gif;base64,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06pdy7at27dw/+PKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fv4MOLH0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5P+STDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz26++/AAcs8MCN2QDDACqwQEINJgABABAm1EACCyoMAIP/Dfd8AEEABYwggAERbGDEBhEYIMAIBQQAwQcZb9zxxyGPXPLJKa9sj8YcewyyyCSbjLLKLN/sss4x90wz0GLNQEMQKegAwNNQRy310zqkEAQNM7zDgQYUVICBEWCHLfbYYGNQAQUacKA1116T7bbYZqOtdjtbd/3122/HnfbaduOd99l7b1XAEC1MbfjhUbcwRAHrMJDAAX5HLvYBCTDQ+OOSZ0655ek4DnnmkW9++eeg4y26VTcIgQLirLcOAApC3FDOBCFkUPrtGYQwwey131567ruPQ7vtvmcOPO/EFx/58VG9IMMKrkfP+goyvBAOCB0soPztC3QAwvXZb196//fff4O99uJnTj746Kcf+fpOEXCC9PSzfgIB33hAgPu3E+BB/vvjH+j85w39CXCA/ytgAA8YOQIuJQc+qJ8EWeeDHGxDBA5g4O0cIIILZlCDoOOgNjAIwhB2cIQfLGHkRIiUAcRggjA8XAwGkI0ASECFoJNAAGp4QxxK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3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAwocSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gw4odS7as2bNo06pdy7at27dw/+PKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fv4MOLH0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5P+STDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz26++/AAcs8MAXfgBBAAWMIIABEWxgxAYRGCDACAUEAMH/B/cYjLDCDDsMscQUW4zxOjbAMIAKLJBQgwlAAACECTWQwIIKA8BgA6AcaEBBBRgY4fPPQAftMwYVUKABB+/kvHPPQjf9M9FGIz3ODDQEkYIOAGSt9dZcZ61DCkHQMIOeDCRwgNNoO31AAgysU/bZacf989ptf1PAEC10rffeW7cwRAF1ThBCBnIXLnQGIUxQjuCEG+64EYgrns0NQqDA9+WYA4CCEDfACUIHCzwuus8LdABCOJ+HPvrjpZ9ezQsyrJD57JevIMMLbXpAwOq8E+DBN7rzvrrv1BBwAu3IX34C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WI3WeI3YmI3auI3c2I3e+I3gGI7iOHmO5FiO5niO6JiO6riO7NiO7viO8BiP8jiP9FiP9niP+JiP+riP/NiP/viPABmQAjmQBFmQBnmQCJmQCrmQDNmQDvmQEBmREjmRFFmRFnmRGJmRGrmRHNmRHvmRIBmSIjmSJFmSJnmSKJmSKrmSLNmSLvmSMBmT8BAIACH5BAUUAEcALAAAAAAgA1gCAAf/gEeCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAwocSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gw4odS7as2bNo06pdy7at27dw/+PKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fv4MOLH0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5P+STDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz2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"/>                                }
                            </form>
                        </div>
                        <Link to="/login"><button className="gray-button" type="button">У меня уже есть аккаунт</button></Link>
                    </div>
                </div>
                {this.state.openModal && <div className="modalLicense">
                    <div className="modalHeader"><p>Публичный договор</p></div>
                    <div className="licenseAgreement">
                        <header>
                            <p>{`
                            Договор о предоставлении простого неисключительного права
                            (простой, неисключительной лицензии) 
                            на использование программного обеспечения 
                            «Онлайн-запись и Автоматизация бизнеса сферы услуг» 
                            в сети Интернет (в WEB-варианте)
                    `}
                        </p>
                        </header>

                        <p>
                            {`Настоящий договор в соответствии с п. 2 ст. 462 Гражданского кодекса Республики Беларусь является Публичным договором (далее именуемый по тексту – «Договор»), определяет порядок предоставления простого неисключительного права (простой, неисключительной лицензии) на использование программного обеспечения (программы) «Онлайн-запись и Автоматизация бизнеса сферы услуг», представленного в сети Интернет (в WEB-варианте) по адресу https://online-zapis.com, а также взаимные права, обязанности и порядок взаимоотношений между Частным предприятием «СОФТ-МЭЙК», в лице директора Борщова Дениса Сергеевича, именуемым в дальнейшем «Лицензиар», `}<strong>и юридическим лицом и (или) физическим лицом (в том числе, индивидуальным предпринимателем, самозанятым лицом),</strong>{` именуемым в дальнейшем «Лицензиат», принявшим (акцептовавшим) публичное предложение (оферту) о заключении настоящего Договора, вместе далее именуемые «Стороны».`}
                        </p>
                        <p className="title">1. ОБЩИЕ ПОЛОЖЕНИЯ. ТЕРМИНЫ И ОПРЕДЕЛЕНИЯ</p><p>{`
                1.1.Настоящий договор заключается и исполняется в соответствии с Гражданским кодексом Республики Беларусь от 07.12.1998 № 218-З, Законом Республики Беларусь от 17.05.2011 № 262-З «Об авторском праве и смежных правах», Законом Республики Беларусь от 10.11.2008 № 455-З (ред. от 11.05.2016) «Об информации, информатизации и защите информации», а также иными нормативными правовыми актами Республики Беларусь. международными договорами и соглашениями.
                1.2. Термины и определения, применяемые в настоящем Договоре, используются в значении, закрепленном в нормативных правовых актах, указанных в п.1.1. настоящего Договора. При этом, если контекст Договора не требует иного, нижеприведенные термины имеют следующие значения:
                `}<strong>«Лицензия»</strong>{` – право на использование Программы, выраженное в передаваемых Лицензиату реквизитах доступа (логин и пароль) определенными способами. Предоставляемые по настоящему Договору лицензии являются простыми (неисключительными) лицензиями.
                `}<strong>«Программное обеспечение «Онлайн-запись и Автоматизация бизнеса сферы услуг», «Программа»</strong>{` – представленная в объективной форме упорядоченная совокупность команд и данных, предназначенных для использования на компьютере и в иных системах и устройствах в целях обработки, передачи и хранения информации, производства вычислений, получения аудиовизуальных изображений и других результатов.
                `}<strong>«Данные Лицензиата»</strong>{` – любая и вся информация, вносимая Лицензиатом в Программу из «Аккаунта Лицензиата», включающая сведения о Лицензиате как об организации, индивидуальном предпринимателе;
                `}<strong>«Аккаунт Лицензиата»</strong>{` – настраиваемое виртуальное рабочее место Лицензиата в Программе, где Лицензиат осуществляет действия согласно выбранному Тарифному плану. Аккаунт Лицензиата обладает уникальным именем (login) и паролем (password), что является доступом к Программе на учетный период.
                `}<strong>«Лицензионное вознаграждение» </strong>{` – стоимость права использования Программы.
               `}<strong>«Учетный период»</strong>{` – оплаченный посредством лицензионного вознаграждения период использования Программы. Минимальный оплачиваемый период – 3 (три) месяца.
                `}<strong>«Тарифный план»</strong>{` – цены на Лицензии, установленные Лицензиаром, и представленные в сети Интернет по адресу https://online-zapis.com.
                `}<strong>«Интернет-сайт», «Сайт»</strong>{` – сложный объект интеллектуальной собственности, представляющий собой совокупность программ для ЭВМ, баз данных, текстовой, графической и иной информации, доступной для Лицензиата и других пользователей сети Интернет посредством доменного имени – уникального электронного адреса, позволяющего осуществлять доступ к информации в сети Интернет. Название Сайта – www.online-zapis.com. Адрес Сайта: https://online-zapis.com.
            `}</p>
                        <p className="title">2. ПРЕДМЕТ ДОГОВОРА</p>
                        <p>{`
                    2.1. На условиях и в порядке, предусмотренном настоящим Договором, Лицензиар предоставляет Лицензиату неисключительное право (простая, неисключительная лицензия) на использование Программы, представленной в сети Интернет (в WEB-варианте) по адресу https://online-zapis.com, по целевому назначению Программы в течение срока действия Лицензии, следующим способами:
                    2.1.1. удаленный доступ к Программе с воспроизведением на серверах Лицензиара;
                    2.1.2. визуализация работы Программы на удаленном мониторе устройства Лицензиата;
                    2.1.3. ввод, редактирование, удаление, перемещение и копирование Данных Лицензиата и иной информации в пределах, необходимых для использования Программы Лицензиатом.
                    Программа предоставляется Лицензиату «как есть» («AS IS»). Лицензиар не дает гарантий, что Программа будет работать на любом оборудовании, на любой рабочей станции, совместно с любыми другими приложениями без возникновения ошибок.
                    2.2. Всеми правами на Программу и документацию, имеющую отношение к ней, обладает Лицензиар.
                    2.3. Исключительное право интеллектуальной собственности на Программу и любые ее компоненты и элементы, включая объекты авторского права и товарные знаки, заключенные в нем, и иные объекты интеллектуальной собственности, принадлежат Лицензиару.
                    2.4. Лицензиар предоставляет Лицензиату право использования Программы на срок, предусмотренный выбранным Лицензиатом Тарифным планом. 
                    2.5. Лицензиат выплачивает Лицензиару Лицензионное вознаграждение за предоставление права использования Программы в порядке и размере, определяемом в соответствии с выбранным Лицензиатом Тарифным планом.
                    2.6. Лицензиар сохраняет за собой право выдачи Лицензий на использование Программы третьим лицам.
                    2.7. Техническую поддержку Программы Лицензиар оказывает в соответствии с правилами оказания технической поддержки, размещенными на страницах Интернет-сайта.
                    В обязанности Лицензиара по настоящему Договору не входит оказание Лицензиату услуг по предоставлению доступа в сеть Интернет, услуг по настройке или диагностике мобильных устройств, компьютеров, программного обеспечения и пр.
                    2.8. Лицензиар предоставляет Лицензиату необходимое пространство на сервере для использования такого пространства в целях обработки и хранения данных, вводимых с использованием Программы.
                    2.9. Лицензиар обеспечивает Лицензиату круглосуточный доступ к Программе и к серверу, за исключением времени проведения профилактических работ.
                    2.10. Лицензиар обеспечивает защиту исключительных прав техническими и (или) программными средствами, ограничивающими неправомерный доступ к Программе. Лицензиат не вправе осуществлять действия, направленные на устранение ограничений использования Лицензии на Программу, установленных путем применения средств защиты исключительных прав.
                    2.11. Лицензиар своевременно осуществляет обновление Программы, а также обеспечивает целостность и сохранность на сервере данных, введенных Лицензиатом в Программу, до истечения 6 (шести) месяцев с момента прекращения настоящего Договора или до момента получения уведомления от Лицензиата о необходимости уничтожения таких данных. Лицензиар обеспечивает конфиденциальность всех данных, введенных Лицензиатом в Программу, в течение всего периода их нахождения на сервере.
                    2.12. Право на использование Программы является непередаваемым. Лицензиат не имеет права: 
                    – передавать свои права и обязанности на использование Программы третьим лицам, в том числе (но не исключительно) на передачу третьим лицам полностью или в части прав и (или) обязанностей по настоящему Договору; 
                    – продавать, тиражировать, копировать Программу полностью или частично;
                    – отчуждать Программу полностью или частично иным образом, в том числе безвозмездно; 
                    – осуществлять без предварительного письменного разрешения Лицензиара републикацию материалов, размещенных на какой-либо странице Интернет-сайта, на других страницах в сети Интернет, перепечатку (публикацию) указанных материалов в письменной и (или) электронной форме отдельно и (или)  в составе сборников;
                    – использовать без предварительного письменного разрешения Лицензиара Программу для создания и публикации электронных справочно-энциклопедических изданий, баз данных, аналогичных Программе, не включать Программу в какие бы то ни было базы данных, не распространять Программу способами, не предусмотренными настоящим Договором, не доводить до всеобщего сведения материалы и документы, содержащиеся в Программе, а также авторские произведения, содержащиеся в Программе.
                    – передавать третьим лицам пароли и логины, используемые для доступа к Программе и обязуется обеспечивать их конфиденциальность, а также осуществлять синтаксический анализ (парсинг) и (или) лексический анализ в отношении Программы, а также интернет-страниц Интернет-сайта. Лицензиат несет ответственность за действия, совершенные третьими лицами с использованием его Аккаунта, а также за ущерб, причиненный третьими лицами, в том числе за ущерб, нанесенный Программе и (или) Лицензиару.
                    2.13. Если Программа содержит какое-либо программное обеспечение третьих лиц, такое программное обеспечение предоставляется без гарантий качества, а его использование регулируется условиями и ограничениями, установленными такими третьими лицами.
                    2.14. Лицензиар обязан воздерживаться от каких-либо действий, способных затруднить осуществление Лицензиатом прав, предоставленных по Лицензии.
                    2.15. Лицензиар вправе приостанавливать либо полностью прекращать доступ Лицензиата к Программе в случае нарушения последним условий настоящего Договора, о чем Лицензиат уведомляется посредством отправки Лицензиаром уведомления в Аккаунт Лицензиата и (или) на электронную почту Лицензиата с прекращением доступа в Аккаунт Лицензиата.
                    2.16. Лицензиар предоставляет бесплатную услугу по загрузке в Программу Данных Лицензиата. Услуга предоставляется на следующих условиях:
                    Объем загружаемых данных – не более 10 страниц формата А4
                    Данные должны быть переданы Лицензиатом персональному менеджеру в электронном виде, в виде файлов формата xlsx, docx, jpg, png. Другие форматы файлов могут быть приняты к загрузке после согласования с персональным менеджером.
                    Услуга доступна только тем пользователям Программы, которые, находятся на одном из платных тарифов – «Solo», «Team» или «Pro».
                    Срок загрузки данных в аккаунт – 5 (пяти) рабочих дня с момента передачи данных Лицензиатом. Срок может быть увеличен в связи с высокой загрузкой сотрудников, производящих загрузку.
                    Загружаемые данные – справочник клиентов, услуг, сотрудников. Возможность загрузки данных другого типа должна быть согласована с персональным менеджером.
                    В случае, если Лицензиату требуется загрузка данных на условиях, отличающихся от вышеперечисленных, такая загрузка может быть произведена на дополнительной платной основе. В этом случае условия, на которых может быть произведена загрузка формулируются персональным менеджером, на основании полученного от Лицензиата запроса.
               `}</p>

                        <p className="title">3. ПОРЯДОК ЗАКЛЮЧЕНИЯ ДОГОВОРА</p> <p>{`
                    3.1. Публикация (размещение) текста настоящего Договора является публичным предложением (офертой) Лицензиара, адресованным неопределенному кругу лиц заключить настоящий Договор (п.2. ст.407 Гражданского Кодекса Республики Беларусь). 
                    3.2. Заключение настоящего Договора производится путем присоединения Лицензиата к настоящему Договору, то есть посредством принятия (акцепта) Лицензиатом условий настоящего Договора в целом, без каких-либо условий, изъятий и оговорок (ст.398 Гражданского Кодекса Республики Беларусь).
                    3.3. Настоящий договор, при условии соблюдения порядка его акцепта, считается заключенным в простой письменной форме (п.2, п.3 ст.404 и п.3 ст.408 Гражданского Кодекса Республики Беларусь).
                    3.4. На Сайте может содержаться иная дополнительная информация о порядке и условиях предоставления Лицензий по настоящему Договору. Указанная информация применяется в части не противоречащей условиям настоящего Договора.
                    3.5. Фактом полного и безоговорочного принятия (акцепта) Лицензиатом условий настоящего Договора является факт предварительной (первичной) регистрации Лицензиата на Сайте (п.3 ст.408 Гражданского Кодекса Республики Беларусь).
            `}</p>
                        <p className="title">4. ПРАВА И ОБЯЗАННОСТИ СТОРОН</p><p>{`
                    `}<strong>4.1. Лицензиар обязуется:</strong>{`
                    4.1.1. предоставить Лицензиату фактическую возможность использовать функциональные возможности Программы в согласованных объемах и на условиях, предусмотренных соответствующим Тарифным планом;
                    4.1.2. обеспечивать поддержание нормального функционирования Программы, за исключением времени проведения профилактических работ и (или) технического обслуживания Программы, наступления форс-мажорных и иных обстоятельств, не зависящих от Лицензиара;
                    4.1.3. обеспечить невозможность использования Программы после окончания оплаченного периода Лицензии.
                    `}<strong>4.2. Лицензиар вправе:</strong>{`
                    4.2.1. осуществлять любую модификацию Программы при условии сохранения в нем содержания и структуры введенных Лицензиатом данных;
                    4.2.2. удалять введенную Лицензиатом информацию, не соответствующую требованиям законодательства;
                    4.2.3. в одностороннем внесудебном порядке изменять условия настоящего Договора путем размещения актуальной версии договора на Сайте;
                    4.2.4. в одностороннем внесудебном порядке приостановить предоставление Лицензии и (или) отказаться от исполнения настоящего Договора в случаях, если:
                    4.2.4.1. Лицензиат осуществляет действия, нарушающие правила использования Лицензии, указанные в настоящем Договоре, или положения действующего законодательства Республики Беларусь;
                    4.2.4.2. данные, вводимые Лицензиатом, противоречат положениям действующего законодательства Республики Беларусь;
                    4.2.4.3. при нарушении Лицензиатом обязательств, предусмотренных настоящим Договором.
                    В указанных случаях внесенные Лицензиатом денежные средства в оплату Лицензионного вознаграждения не возвращаются.
                    4.2.5. в одностороннем внесудебном порядке изменять срок бесплатного тестового режима пользования Программой;
                    4.2.6. предоставлять поддержку и обслуживание Программы;
                    4.2.7. время от времени выпускать обновления для Программы и автоматически обновлять ее версию. Настоящим Лицензиат дает согласие на такое автоматическое обновление, а условия и положения настоящего Договора будут иметь силу для указанных обновлений.
                    `}<strong>4.3. Лицензиат обязуется:</strong>{`
                    4.3.1. осуществлять ввод только тех данных, которые являются достоверными и соответствуют требованиям законодательства Республики Беларусь;
                    4.3.2. в случае получения доступа к Программе третьими лицами из Аккаунта Лицензиата немедленно известить об этом Лицензиара;
                    4.3.3. немедленно извещать Лицензиара о возникающих неполадках в доступе к Программе, в том числе при вводе в него данных;
                    4.3.4. своевременно осуществлять оплату Лицензионного вознаграждения;
                    4.3.5. использовать права, предоставленные по настоящему Договору, добросовестно, в соответствии с целями использования Программы, предусмотренными выбранным Лицензиатом Тарифным планом;
                    4.3.7. не использовать Программу для причинения ущерба третьим лицам, включая других Лицензиатов.
                    `}<strong>4.4. Лицензиат вправе:</strong>{`
                    4.4.1. осуществлять использование Программы на условиях, предусмотренных настоящим Договором;
                    4.4.2. по своему выбору приостановить использование Программы (Лицензии). При этом Лицензиат соглашается с тем, что действие Лицензии не прекращается и не приостанавливается, а лицензионное вознаграждение за оплаченный Лицензиатом период, в течение которого он фактически не пользовался своими правами, не подлежит возврату Лицензиаром Лицензиату;
                    4.4.3. в любое время продлить (пролонгировать) или возобновить срок действия Лицензии.
            `}</p>
                        <p className="title">5. ПОРЯДОК ПЕРЕДАЧИ ПРАВ</p><p>{`
                    5.1. Необходимым условием активации Лицензии является предварительная (первичная) регистрация Лицензиата на Сайте. При осуществлении регистрации Лицензиат обязуется указать актуальный контактный номер мобильного телефона и актуальный адрес электронной почты, которые будут использоваться при активации Лицензии. В случае изменения сообщенного при регистрации контактного номера мобильного телефона и (или) адреса электронной почты Лицензиат обязуется сообщить Лицензиару новый номер телефона и (или) адрес электронной почты незамедлительно в течение 1 (одного) рабочего дня с момента их изменения. В случае неисполнения данной обязанности сообщение об активации, направленное по изначально указанному Лицензиатом адресу электронной почты, будет считаться надлежащим образом направленным, а Лицензия – активированной и переданной Лицензиату надлежащим образом в день направления Лицензиаром сообщения об активации.
                    5.2. Срок активации Лицензии Лицензиаром – 5 (пять) рабочих дней с момента предварительной (первичной) регистраций Лицензиата на Сайте. 
                    5.3. Лицензия считается активированной и надлежащим образом переданной Лицензиату с момента отправки Лицензиаром Лицензиату электронного сообщения, содержащего уведомление об активации Лицензии, на адрес электронной почты Лицензиата, указанный им при регистрации на Сайте и являющийся его логином для доступа к Программе. 
                    5.4. Срок действия Лицензии в отношении любого из выбранных Лицензиатом Тарифных планов увеличивается на 30 (тридцать) календарных дней бесплатного тестового режима пользования Программой, если иной срок дополнительно не установлен Лицензиаром.
                    5.5. Неоплата Лицензиатом Лицензионного вознаграждения согласно выбранного им Тарифного плана в течение 5 (пяти) рабочих дней с момента окончания срока действия бесплатного тестового режима пользования Программой, предусмотренного п. 5.4. настоящего Договора, а равно при не продление (отказ от пролонгации) Лицензии в отношении оплаченного Тарифного плана (п.п. 6.2.4. настоящего Договора), не является основанием для прекращения действия Договора (за исключением случая удаления Аккаунта Лицензиата), но является основанием для прекращения действия Лицензии.`}</p>
                        <p className="title">6. РАЗМЕР ВОЗНАГРАЖДЕНИЯ И ПОРЯДОК РАСЧЕТОВ</p><p>{`
                    6.1. За передачу Лицензии на право использования Программы Лицензиат уплачивает Лицензиару вознаграждение авансовым платежом в виде 100% стоимости, предусмотренной Тарифным планом. Стоимость и срок действия Лицензии дополнительно могут указываться в счете. По истечении срока ее действия Лицензия возобновляется автоматически на тот же срок и в том же объеме, при условии оплаты в соответствии с п.п. 6.2.4. настоящего Договора.
                    6.2. Порядок выплаты лицензионного вознаграждения по настоящему Договору:
                    6.2.1. Лицензиат перечисляет вознаграждение за передачу прав на использование Программы (Лицензии) путем безналичного перечисления денежных средств в белорусских рублях на расчетный счет Лицензиара на основании предварительно выставленного счета.
                    6.2.2. Датой оплаты является дата зачисления денежных средств на расчетный счёт Лицензиара.
                    6.2.3. Лицензиат обязан оплатить счет в течение 5 (пяти) банковских дней с момента его выставления.
                    6.2.4. В случае пролонгации права использования Программы в период действия Договора (автоматическая пролонгация Лицензии) выплата Лицензионного вознаграждения производится не позднее 5 (пяти) банковских дней до начала нового Учетного периода. Если счет не будет оплачен в указанный срок, Лицензия прекращает свое действие.
                    6.3. Стоимость Лицензионного вознаграждения сформирована без НДС в соответствии с подп. 1.2.2 п. 1 ст. 326 Налогового кодекса (Особенная часть) Республики Беларусь
            `}</p>
                        <p className="title">7. ОТВЕТСТВЕННОСТЬ СТОРОН. РАЗРЕШЕНИЕ СПОРОВ</p><p>{`
                    7.1. Настоящим Стороны подтверждают, что обладают всеми необходимыми правами и полномочиями для надлежащего исполнения обязательств по настоящему Договору и своими действиями в рамках исполнения настоящего Договора не нарушают прав третьих лиц, включая права третьих лиц в отношении объектов интеллектуальной собственности.
                    7.2. Лицензиар несет ответственность за обеспечение функциональности Программы в части сохранности данных Лицензиата лишь в том случае, если утрата или искажение указанных данных возникла по его вине. В указанном случае предоставление Лицензии продлевается на срок, который потребовался для восстановления потерянных данных Лицензиата, но не более 3 (трех) дней. Период такой потери определяется с момента извещения о ней Лицензиатом Лицензиара до момента её устранения.
                    7.3. В случае нарушения доступности Программы для Лицензиата по вине или в связи с предотвратимыми неполадками в оборудовании Лицензиара, предоставление лицензии продлевается на срок, в течение которого Программа была недоступна. Период недоступности Программы считается с момента извещения об этом Лицензиара до момента восстановления функциональности Программы.
                    7.4. Лицензиар не несет ответственности за достоверность информации, размещаемой Лицензиатом в Программе, и за соответствие ее нормам законодательства. Всю полноту ответственности за нарушения законодательства Республики Беларусь в отношении информации, размещаемой Лицензиатом в Программе несет Лицензиат.
                    7.5. Лицензиат гарантирует, что вводимая им информация не нарушает каких-либо прав третьих лиц, включая права интеллектуальной собственности. В случае нарушения данных гарантий, Лицензиат возмещает Лицензиару все понесенные им убытки, вызванные таким нарушением в случае предъявления к Лицензиару претензий со стороны третьих лиц.
                    7.6. Лицензиар не несет ответственности за прямой или косвенный ущерб, причиненный Лицензиату в результате использования или невозможности частичного или полного использования Программы в результате перебоев или перерывов в работе сети Интернет, а также в случае иных обстоятельств, возникших не по вине Лицензиара.
                    7.7. Лицензиар не несет ответственности за задержки, прерывание, ущерб или потери, происходящие из-за дефектов в любом электронном или механическом оборудовании, не принадлежащем Лицензиару, а также за проблемы при передаче данных или соединении, возникшие не по вине Лицензиара, за качество каналов связи общего пользования, посредством которых осуществляется доступ к Сайту, а также в случае блокирования доступа к Сайту (тематическому разделу сайта) Лицензиара в результате действия третьих лиц, в том числе органов государственной власти.
                    7.8. Настоящим Лицензиат признает и соглашается с тем, что ответственность Лицензиара ограничивается предметом настоящего Договора.
                    7.9. Лицензиат использует Программу на свой риск. Лицензиар не несет ответственности за ущерб, который может возникнуть у Лицензиата в связи с использованием Программы, в том числе по вине других лицензиатов.
                    7.10. Лицензиар имеет право в одностороннем порядке отказаться от исполнения договора (прекратить предоставление лицензии Лицензиату) без возврата уплаченного Лицензионного вознаграждения и без возмещения каких-либо убытков, понесенных Лицензиатом в результате прекращения предоставления лицензии:
                    7.10.1 в случае нарушения Лицензиатом п. 4.3. настоящего Договора;
                    7.10.2 в случае злоупотребления Лицензиатом полученными им по настоящему Договору правами, в том числе в связи с получением жалоб от других лицензиатов;
                    7.10.3 в случае причинения Лицензиатом ущерба Лицензиару и (или) другим лицензиатам. Сторона договора, имущественным интересам и деловой репутации которой был нанесен ущерб в результате ненадлежащего исполнения обязательств другой Стороной, вправе требовать возмещения причиненного ей этой Стороной документально подтвержденного прямого реального ущерба, под которым понимаются расходы, которые Сторона, чье право нарушено, произвела или произведет для восстановления своих прав и интересов.
                    7.11. Лицензиар не несет ответственности за несвоевременное предоставление доступа к Программе в случае наличия одного или нескольких из следующих условий: неполучения или несвоевременного получения Лицензиатом электронного сообщения об активации Лицензии по причинам, не зависящим от Лицензиара, включая без ограничения предоставление Лицензиатом некорректного адреса электронной почты, сбои в работе почтового клиента Лицензиата или сервера электронной почты Лицензиата.
                    7.12. Лицензиат несет ответственность за сохранность своих учтённых данных, в том числе своего логина и пароля к Аккаунту Лицензиата и за убытки, которые могут возникнуть по причине его несанкционированного использования. Лицензиар не несет ответственности и не возмещает убытки, возникшие в результате несанкционированного использования третьими лицами логина и пароля доступа Лицензиата.
                    7.13. Лицензиат гарантирует Лицензиару, что: 
                    а) он указал достоверные данные при предварительной (первичной) регистрации Лицензиата на Сайте;
                    б) он ознакомился с условиями настоящего Договора, понимает предмет и условия Договора и полностью согласен с ними.
                    7.14. Претензионный порядок досудебного урегулирования споров, вытекающих из Договора, является для Сторон обязательным.
                    7.15. Все споры в случае невозможности достижения Сторонами соглашения по возникшим разногласиям, подлежат разрешению в экономическом суде по месту нахождения Лицензиара.

                `}</p>
                        <p className="title">8. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ</p><p >{`
                    8.1. Стороны безоговорочно соглашаются с тем, что настоящий Договор заключен по месту нахождения Лицензиара.
                    8.2. Договор вступает в силу с момента его акцепта Лицензиатом и действует на неопределенный срок, но в любом случае до момента удаления Аккаунта Лицензиата и до полного исполнения Сторонами принятых на себя обязательств. 
                    Срок действия Договора не ограничивается сроком действия Лицензии, но ограничивается периодом действия Аккаунта Лицензиата.
                    8.3. Односторонний отказ от Договора или одностороннее изменение его условий не допускается, за исключением случаев, прямо предусмотренных настоящим Договором и действующим законодательством Республики Беларусь.
                    8.4. В случае добровольного прекращения (приостановления) Лицензиатом использования Программы (в том числе удаления Аккаунта лицензиата) перерасчет и (или) возврат Лицензионного вознаграждения не производится. Такое прекращение использование программы Лицензиатом не признается Сторонами односторонним отказом Лицензиата от исполнения настоящего Договора.
                    8.5. При прекращении действия Лицензии Лицензиар полностью отключает Лицензиата от доступа к Программе.
                    8.6. Прекращение Договора по любому основанию не освобождает Стороны от ответственности за нарушения условий Договора, возникшие в течение срока его действия.
                    8.7. Настоящим Лицензиат выражает свое согласие получать от Лицензиара и его партнеров рекламные рассылки, а также иную информацию о продуктах и услугах, в том числе посредством e-mail и sms-рассылок.
                    8.8. Лицензиар обязуется обрабатывать и хранить персональные данные Лицензиата, предоставленные Лицензиару, обеспечивать их конфиденциальность и не предоставлять доступ к этой информации третьим лицам, за исключением случаев, предусмотренных действующим законодательством Республики Беларусь.
                    8.9. В случае если какое-либо из условий настоящего Договора потеряет юридическую силу, будет признанно незаконным, или будет исключено из настоящего Договора, то это не влечет недействительность остальных условий настоящего Договора, которые сохранят юридическую силу и являются, обязательными для исполнения всеми Сторонами.
                    8.10. Любые уведомления по Договору могут направляться одной Стороной другой Стороне: на адрес электронной почты Лицензиата, указанный им при регистрации, либо сообщенный Лицензиару письменно дополнительно; на адрес электронной почты Лицензиара с адреса электронной почты Лицензиата, указанного им при регистрации либо сообщенного Лицензиару письменно дополнительно; по факсу; почтой с уведомлением о вручении.
                    8.11. Лицензиар не принимает на себя никаких обязательств в отношении предмета Договора, за исключением указанных в Договоре, кроме случаев, когда такие обязательства зафиксированы в письменном виде и подписаны Лицензиаром и Лицензиатом.
                `}</p>
                    <p style={{marginBottom: "0"}}>{`Дата публикации текущей редакции 10.06.2019 `}</p>
                    </div>
                    <div className="hideModal"><p onClick={()=>this.setState({openModal:false}) } style={{cursor: "pointer"}}>Скрыть</p></div>
                </div>}

            </div>
        );
    }

    isValidEmailAddress(address) {
        return !! address.match(/.+@.+/);
    }
}

function mapStateToProps(state) {
    const { authentication } = state;
    return {
        authentication
    };
}

const connectedRegisterPage = connect(mapStateToProps)(RegisterPage);
export { connectedRegisterPage as RegisterPage };