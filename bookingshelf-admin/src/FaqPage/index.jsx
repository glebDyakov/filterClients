import React, {Component} from 'react';
import { connect } from 'react-redux';

import '../../public/scss/email.scss'

class Index extends Component {

    constructor(props) {
        super(props);

        if(props.match.params.activeTab &&
            props.match.params.activeTab!=='email_sms' &&
            props.match.params.activeTab!=='system' &&
            props.match.params.activeTab!=='staff'
        ){
            props.history.push('/nopage')
        }

        if(props.match.params.activeTab==='email_sms') {document.title = "Вопросы по Email и SMS | Онлайн-запись";}
        if(props.match.params.activeTab==='system'){document.title = "Вопросы по журналу записи | Онлайн-запись"}
        if(props.match.params.activeTab==='staff'){document.title = "Вопросы по сотрудникам | Онлайн-запись"}

        this.state = {
            isLoading: true,
            activeTab: props.match.params.activeTab?props.match.params.activeTab:'email_sms',
        };
    }

    componentDidMount() {
        document.title = "Вопросы и ответы | Онлайн-запись";

        setTimeout(() => this.setState({ isLoading: false }), 800);
        initializeJs();

    }

    setTab(tab){
        this.setState({
            ...this.state,
            activeTab: tab
        })

        if(tab==='email_sms') {document.title = "Вопросы по Email и SMS | Онлайн-запись";}
        if(tab==='system'){document.title = "Вопросы по журналу записи | Онлайн-запись"}
        if(tab==='system'){document.title = "Вопросы по сотрудникам | Онлайн-запись"}

        history.pushState(null, '', '/faq/'+tab);

    }

    render() {
        const {activeTab} = this.state;

        return (
            <div className="emailPage">
                <div className="retreats">
                    {/*<div className="flex-content col-sm-12">*/}
                    {/*    <ul className="nav nav-tabs">*/}
                    {/*        <li className="nav-item">*/}
                    {/*            <a className={"nav-link"+(activeTab==='email_sms'?' active show':'')} data-toggle="tab"*/}
                    {/*               href="#email_sms" onClick={()=>{this.setTab('email_sms')}}>Sms-email</a>*/}
                    {/*        </li>*/}
                    {/*        <li className="nav-item">*/}
                    {/*            <a className={"nav-link"+(activeTab==='system'?' active show':'')} data-toggle="tab"*/}
                    {/*               href="#system" onClick={()=>{this.setTab('system')}}>Журнал записи</a>*/}
                    {/*        </li>*/}
                    {/*      <li className="nav-item">*/}
                    {/*        <a className={"nav-link"+(activeTab==='staff'?' active show':'')} data-toggle="tab"*/}
                    {/*           href="#staff" onClick={()=>{this.setTab('staff')}}>Сотрудники</a>*/}
                    {/*      </li>*/}
                    {/*    </ul>*/}
                    {/*</div>*/}


                    <div className="header-tabs-container faq-tabs">
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <a className={"nav-link  show" + (activeTab === 'email_sms' ? ' active' : '')}
                                   data-toggle="tab" href="#email_sms" onClick={() => {
                                    this.setTab('email_sms')
                                }}>SMS-EMAIL</a>
                            </li>
                            <li className="nav-item">
                                <a className={"nav-link" + (activeTab === 'newsletter' || activeTab === 'system' ? ' show active' : '')}
                                   data-toggle="tab" href="#system" onClick={() => {
                                    this.setTab('system')
                                }}>Журнал записи</a>
                            </li>

                            <li className="nav-item">
                                <a className={"nav-link  show" + (activeTab === 'staff' ? ' active' : '')}
                                   data-toggle="tab"
                                   href="#staff" onClick={() => {
                                    this.setTab('staff')
                                }}>Сотрудники</a>
                            </li>
                        </ul>


                    </div>

                    <div className="tab-content faq-page">
                        <div className={"tab-pane content-pages-bg"+(activeTab==='email_sms'?' active':'')}  id="email_sms">
                            <div className="templates-group">
                                <div className="templates-list row p-3">
                                    <div className="col-md-4">
                                <span>
                                    <strong>Вопрос</strong>
Любая рассылка — это спам. Вы нарушаете закон?
                                </span>
                                    </div>
                                    <div className="col-md-8">
                                <span>
                                    <strong className="sub-title">Ответ</strong>
                                    <span className="massege-templates">Рассылка СМС не является нарушением закона "О рекламе", если получатели (Ваши клиенты) добровольно согласились на получение информации от Вас. Мы не занимаемся безадресными рассылками без подтверждения согласия получателей (спамом).</span>
                                </span>
                                    </div>
                                </div>
                                <div className="templates-list row p-3">
                                    <div className="col-md-4">
                                <span>
                                    <strong>Вопрос</strong>
Как получатели могут ответить на sms?
                                </span>
                                    </div>
                                    <div className="col-md-8">
                                <span>
                                    <strong className="sub-title">Ответ</strong>
                                    <span className="massege-templates">Получатель может ответить на Ваше сообщение, если в тексте смс Вы введете номер своего городского или мобильного телефона. Вы отправляете от буквенного номера, поэтому Вам ответить не смогут.</span>
                                </span>
                                    </div>
                                </div>
                                <div className="templates-list row p-3">
                                    <div className="col-md-4">
                                <span>
                                    <strong>Вопрос</strong>
                                    Сколько текста влезет в 1 смс?
                                </span>
                                    </div>
                                    <div className="col-md-8">
                                <span>
                                    <strong className="sub-title">Ответ</strong>
                                    <span className="massege-templates">Латиницей – 160 символов, кириллицей - 70. Если в сообщении используется хотя бы один кириллический символ, то максимальная длина одного сообщения составляет 70 символов. Обратите внимание на то, что при склейке сообщений суммарная длина нового сообщения уменьшается на 4 символа.</span>
                                </span>
                                    </div>
                                </div>
                                <div className="templates-list row p-3">
                                    <div className="col-md-4">
                                <span>
                                    <strong>Вопрос</strong>
                                    Что будет, если сообщение длиннее 160 или 70 символов?
                                </span>
                                    </div>
                                    <div className="col-md-8">
                                <span>
                                    <strong className="sub-title">Ответ</strong>
                                    <span className="massege-templates">При отправке СМС система автоматически разбивает каждое сообщение на несколько частей и отправляет их отдельно, но абонент получит только одно длинное СМС с полным текстом.</span>
                                </span>
                                    </div>
                                </div>
                                <div className="templates-list row p-3">
                                    <div className="col-md-4">
                                <span>
                                    <strong>Вопрос</strong>
Включены ли SMS в стоимость обслуживания?
                                </span>
                                    </div>
                                    <div className="col-md-8">
                                <span>
                                    <strong className="sub-title">Ответ</strong>
                                    <span className="massege-templates">
Нет, мы используем сторонние сервисы и несем финансовые обязательства. При этом, мы предлагаем более выгодные цены на SMS рассылки для наших клиентов.
</span>
                                </span>
                                    </div>
                                </div>
                                <div className="templates-list row p-3">
                                    <div className="col-md-4">
                                <span>
                                    <strong>Вопрос</strong>
Отличаются ли цены на SMS рассылки и сообщения в разные страны?
                                </span>
                                    </div>
                                    <div className="col-md-8">
                                <span>
                                    <strong className="sub-title">Ответ</strong>
                                    <span className="massege-templates">Да, цены отличаются. При покупке SMS пакета, вы выбираете страну, в которой будут отправляться уведомления или рассылки.</span>
                                </span>
                                    </div>
                                </div>

                                <div className="templates-list row p-3">
                                    <div className="col-md-4">
                                <span>
                                    <strong>Вопрос</strong>
Какие бывают статусы SMS-сообщений?
                                </span>
                                    </div>
                                    <div className="col-md-8">
                                <span>
                                    <strong className="sub-title">Ответ</strong>
                                    <span className="massege-templates">
                                        "Доставлено" - сообщение доставлено абоненту.<br />
"Не доставлено" - сообщение не доставлено абоненту, так как абонент находится вне зоны действия сети или аппарат абонента выключен.<br />
"Заблокировано" - сообщение заблокировано по финансовой причине или по желанию клиента.<br />
"Доставляется" - сообщение не получило окончательный статус (время жизни смс 24 часа, в течение этого периода статус обновится).
                                    </span>
                                </span>
                                    </div>
                                </div>


                            </div>
                        </div>

                        <div className={"tab-pane content-pages-bg"+(activeTab==='system'?' active':'')} id="system">
                            <div className="templates-group">
                                <div className="templates-list row p-3">
                                    <div className="col-md-4">
                                      <span>
                                          <strong>Вопрос</strong>
                                          Как создать визит?
                                      </span>
                                    </div>
                                    <div className="col-md-8">
                                        <span>
                                            <strong className="sub-title">Ответ</strong>
                                            <span className="massege-templates">Создать визит можно либо через кнопку “плюс” в нижней части экрана, либо нажатием на ячейку в журнале.</span>
                                        </span>
                                    </div>
                                </div>
                              <div className="templates-list row p-3">
                                <div className="col-md-4">
                                      <span>
                                          <strong>Вопрос</strong>
                                          Как перенести визит?
                                      </span>
                                </div>
                                <div className="col-md-8">
                                        <span>
                                            <strong className="sub-title">Ответ</strong>
                                            <span className="massege-templates">Чтобы перенести визит нажмите на шапку визита. В появившейся информации о визите есть опция “перенести визит”.</span>
                                        </span>
                                </div>
                              </div>
                              <div className="templates-list row p-3">
                                <div className="col-md-4">
                                      <span>
                                          <strong>Вопрос</strong>
                                         Как отменить визит?
                                      </span>
                                </div>
                                <div className="col-md-8">
                                        <span>
                                            <strong className="sub-title">Ответ</strong>
                                            <span className="massege-templates">В шапке визита нажмите на значек удаления.</span>
                                        </span>
                                </div>
                              </div>
                              <div className="templates-list row p-3">
                                <div className="col-md-4">
                                      <span>
                                          <strong>Вопрос</strong>
                                          Что такое зарезервированное время?
                                      </span>
                                </div>
                                <div className="col-md-8">
                                        <span>
                                            <strong className="sub-title">Ответ</strong>
                                            <span className="massege-templates">Опция необходима, если сотруднику нужно отлучиться или просто вычеркнуть время из доступного для записи.</span>
                                        </span>
                                </div>
                              </div>

                            </div>
                        </div>

                      <div className={"tab-pane content-pages-bg"+(activeTab==='staff'?' active':'')} id="system">
                        <div className="templates-group">
                          <div className="templates-list row p-3">
                            <div className="col-md-4">
                                      <span>
                                          <strong>Вопрос</strong>
                                          Как добавить сотрудника?
                                      </span>
                            </div>
                            <div className="col-md-8">
                                        <span>
                                            <strong className="sub-title">Ответ</strong>
                                            <span className="massege-templates">Вы можете пригласить сотрудник по email или добавить вручную. Email является логином сотрудника. Если Email не добавлен, сотрудник будет зарегистрирован, но не сможет зайти в свой профиль для просмотра администраторской области.</span>
                                        </span>
                            </div>
                          </div>
                          <div className="templates-list row p-3">
                            <div className="col-md-4">
                                      <span>
                                          <strong>Вопрос</strong>
                                          Как создать расписание?
                                      </span>
                            </div>
                            <div className="col-md-8">
                                        <span>
                                            <strong className="sub-title">Ответ</strong>
                                            <span className="massege-templates">На вкладке рабочие часы создайте расписание для каждого сотрудника на каждый день. Создайте несколько промежутков, если нужно разбить расписание на несколько временных интервалов.  Выберите “повторять” если расписание постоянно не меняется.</span>
                                        </span>
                            </div>
                          </div>
                          <div className="templates-list row p-3">
                            <div className="col-md-4">
                                      <span>
                                          <strong>Вопрос</strong>
                                         Что такое доступы?
                                      </span>
                            </div>
                            <div className="col-md-8">
                                        <span>
                                            <strong className="sub-title">Ответ</strong>
                                            <span className="massege-templates">Доступы необходимы, чтобы контролировать какая информация доступна сотруднику. При создании сотрудника выберите доступ. В настройках доступа, если необходимо, проставьте галочки какой уровень разрешает просматривать ту или иную информацию.</span>
                                        </span>
                            </div>
                          </div>
                          <div className="templates-list row p-3">
                            <div className="col-md-4">
                                      <span>
                                          <strong>Вопрос</strong>
                                          Что такое выходные дни?
                                      </span>
                            </div>
                            <div className="col-md-8">
                                        <span>
                                            <strong className="sub-title">Ответ</strong>
                                            <span className="massege-templates">Создание выходного дня делает этот день недоступным для записи ко всем сотрудникам.</span>
                                        </span>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                    <hr/>
                  <div style={{ position: 'absolute', bottom: '0' }} className="delimiter p-3"><span></span><p className="col-12">
                    Не нашли ответ на вопрос? Используйте <span style={{ textDecoration: 'underline', cursor: 'pointer'}} onClick={() => {
                        $('#__replain_widget').addClass('__replain_widget_show')
                        $('#__replain_widget_iframe').contents().find(".btn-img").click()
                        $("#__replain_widget_iframe").contents().find(".hide-chat").bind("click", function() {
                          $('#__replain_widget').removeClass('__replain_widget_show')
                        });
                      }}>форму обратной связи
                    </span></p></div>

                </div>
            </div>
        );
    }
}

function mapStateToProps(store) {
    const {alert}=store;

    return {
        alert
    };
}

export default connect(mapStateToProps)(Index);
