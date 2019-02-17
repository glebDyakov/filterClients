import React, {Component} from 'react';
import { connect } from 'react-redux';
import {HeaderMain} from "../_components/HeaderMain";


import '../../public/scss/styles.scss'
import '../../public/scss/email.scss'

import {UserSettings} from "../_components/modals";
import {UserPhoto} from "../_components/modals/UserPhoto";
import Pace from "react-pace-progress";


class FaqPage extends Component {

    constructor(props) {
        super(props);

        if(props.match.params.activeTab &&
            props.match.params.activeTab!=='email_sms' &&
            props.match.params.activeTab!=='system'
        ){
            props.history.push('/nopage')
        }

        if(props.match.params.activeTab==='email_sms') {document.title = "Вопросы по Email и SMS | Онлайн-запись";}
        if(props.match.params.activeTab==='system'){document.title = "Вопросы по системе | Онлайн-запись"}

        this.state = {
            isLoading: true,
            activeTab: props.match.params.activeTab?props.match.params.activeTab:'email_sms'
        };
    }

    componentDidMount() {
        document.title = "Вопросы и ответы | Онлайн-запись";

        setTimeout(() => this.setState({ isLoading: false }), 4500);
        initializeJs();

    }

    componentWillReceiveProps(newProps) {

    }

    setTab(tab){
        this.setState({
            ...this.state,
            activeTab: tab
        })

        if(tab==='email_sms') {document.title = "Вопросы по Email и SMS | Онлайн-запись";}
        if(tab==='system'){document.title = "Вопросы по системе | Онлайн-запись"}

        history.pushState(null, '', '/faq/'+tab);

    }

    render() {
        const {activeTab} = this.state;

        return (
            <div className="emailPage">
                {this.state.isLoading ? <div className="zIndex"><Pace color="rgb(42, 81, 132)" height="3"  /></div> : null}

                <div className={"container_wrapper "+(localStorage.getItem('collapse')=='true'&&' content-collapse')}>
                    <div className={"content-wrapper "+(localStorage.getItem('collapse')=='true'&&' content-collapse')}>
                        <div className="container-fluid">
                            <HeaderMain/>
                            <div className="retreats">
                                <div className="flex-content col-sm-12">
                                    <ul className="nav nav-tabs">
                                        <li className="nav-item">
                                            <a className={"nav-link"+(activeTab==='email_sms'?' active show':'')} data-toggle="tab"
                                               href="#email_sms" onClick={()=>{this.setTab('email_sms')}}>Sms-email</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={"nav-link"+(activeTab==='system'?' active show':'')} data-toggle="tab"
                                               href="#system" onClick={()=>{this.setTab('system')}}>Вопросы по системе</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex-content col-md-5">
                                </div>
                                <div className="tab-content" style={{'height': '71vh'}}>
                                    <div className={"tab-pane content-pages-bg"+(activeTab==='email_sms'?' active':'')}  id="email_sms">
                                        <div className="templates-group">
                                            <div className="templates-list row p-3">
                                                <div className="col-4">
                                            <span>
                                                <strong>Вопрос</strong>
Отличаются ли цены на E-mail рассылки и сообщения в разные страны?
                                            </span>
                                                </div>
                                                <div className="col-8">
                                            <span>
                                                <strong className="sub-title">Ответ</strong>
                                                <span className="massege-templates">Нет, цены одинаковы по всему миру.</span>
                                            </span>
                                                </div>
                                            </div>
                                            <div className="templates-list row p-3">
                                                <div className="col-4">
                                            <span>
                                                <strong>Вопрос</strong>
Любая рассылка — то спам. Вы нарушаете закон?
                                            </span>
                                                </div>
                                                <div className="col-8">
                                            <span>
                                                <strong className="sub-title">Ответ</strong>
                                                <span className="massege-templates">Рассылка СМС не является нарушением "О рекламе", если получатели (Ваши клиенты) добровольно согласились на получение информации от Вас. Мы не занимаемся безадресными рассылками без подтверждения согласия получателей (спамом).</span>
                                            </span>
                                                </div>
                                            </div>
                                            <div className="templates-list row p-3">
                                                <div className="col-4">
                                            <span>
                                                <strong>Вопрос</strong>
Как получатели могут ответить на sms?
                                            </span>
                                                </div>
                                                <div className="col-8">
                                            <span>
                                                <strong className="sub-title">Ответ</strong>
                                                <span className="massege-templates">Получатель может ответить на Ваше сообщение, если в тексте смс Вы введете номер своего городского или мобильного телефона. Вы отправляете от буквенного номера, поэтому Вам ответить не смогут.</span>
                                            </span>
                                                </div>
                                            </div>
                                            <div className="templates-list row p-3">
                                                <div className="col-4">
                                            <span>
                                                <strong>Вопрос</strong>
                                                Сколько текста влезет в 1 смс?
                                            </span>
                                                </div>
                                                <div className="col-8">
                                            <span>
                                                <strong className="sub-title">Ответ</strong>
                                                <span className="massege-templates">Латиницей – 160 символов, кириллицей - 70. Если в сообщении используется хотя бы один кириллический символ, то максимальная длина одного сообщения составляет 70 символов. Обратите внимание на то, что при склейке сообщений суммарная длина нового сообщения уменьшается на 4 символа.</span>
                                            </span>
                                                </div>
                                            </div>
                                            <div className="templates-list row p-3">
                                                <div className="col-4">
                                            <span>
                                                <strong>Вопрос</strong>
                                                Что будет? Если сообщение длиннее 160 или 70 символов?
                                            </span>
                                                </div>
                                                <div className="col-8">
                                            <span>
                                                <strong className="sub-title">Ответ</strong>
                                                <span className="massege-templates">При отправке СМС система автоматически разбивает каждое сообщение на несколько частей и отправляет их отдельно, но абонент получит только одно длинное СМС с полным текстом.</span>
                                            </span>
                                                </div>
                                            </div>
                                            <div className="templates-list row p-3">
                                                <div className="col-4">
                                            <span>
                                                <strong>Вопрос</strong>
Включены ли SMS в стоимость обслуживания?
                                            </span>
                                                </div>
                                                <div className="col-8">
                                            <span>
                                                <strong className="sub-title">Ответ</strong>
                                                <span className="massege-templates">
Нет, мы используем сторонние сервисы и несем финансовые обязательства. При этом, мы предлагаем более выгодные цены на SMS рассылки для наших клиентов.
</span>
                                            </span>
                                                </div>
                                            </div>
                                            <div className="templates-list row p-3">
                                                <div className="col-4">
                                            <span>
                                                <strong>Вопрос</strong>
Включены ли E-mail сообщения в стоимость обслуживания?
                                            </span>
                                                </div>
                                                <div className="col-8">
                                            <span>
                                                <strong className="sub-title">Ответ</strong>
                                                <span className="massege-templates">Да, некоторое количество E-mail сообщений включено в каждый из пакетов. При превышении, вы получаете лучшую на рынке цену по E-mail рассылкам. Важно понимать, что мы используем только Авторизованные системы, что позволяет исключить попадание писем в спам.
</span>
                                            </span>
                                                </div>
                                            </div>
                                            <div className="templates-list row p-3">
                                                <div className="col-4">
                                            <span>
                                                <strong>Вопрос</strong>
Отличаются ли цены на SMS рассылки и сообщения в разные страны?
                                            </span>
                                                </div>
                                                <div className="col-8">
                                            <span>
                                                <strong className="sub-title">Ответ</strong>
                                                <span className="massege-templates">Да, цены отличаются. При покупке SMS пакета, вы выбираете страну, в которой будут отправляться уведомления или рассылки.</span>
                                            </span>
                                                </div>
                                            </div>


                                        </div>
                                    </div>

                                    <div className={"tab-pane content-pages-bg"+(activeTab==='system'?' active':'')} id="system">
                                        <div className="templates-group">
                                            <div className="templates-list row p-3">
                                                <div className="col-4">
                                            <span>
                                                <strong>Вопрос</strong>
                                                Что такое виджет «Онлайн запись»?
                                            </span>
                                                </div>
                                                <div className="col-8">
                                            <span>
                                                <strong className="sub-title">Ответ</strong>
                                                <span className="massege-templates">Виджет – это вспомогательное приложение, выполняющее определенную функцию. В этом случае, функцию записи онлайн. Он интегрируется на сайт и поддерживается на любом устройстве – на телефоне, планшете, компьютере и ноутбуке.</span>
                                            </span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <hr/>
                                <div className="delimiter p-3"><span></span><p className="col-12">Не нашли ответ на вопрос? Используйте форму обратной связи на сайте: <a href="http://online-zapis.com" target="_blank"><b>Online-zapis.com</b></a></p></div>

                            </div>

                        </div>
                    </div>

                </div>

                <UserSettings/>
                <UserPhoto/>
            </div>
        );
    }

    handleSubmit(e) {

    }
}

function mapStateToProps(store) {
    const {alert}=store;

    return {
        alert
    };
}

const connectedEmailPage = connect(mapStateToProps)(FaqPage);
export { connectedEmailPage as FaqPage };