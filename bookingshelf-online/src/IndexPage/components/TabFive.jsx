import React, {PureComponent} from 'react';
import moment from 'moment'
import config from 'config'
import ReactPhoneInput from "react-phone-input-2";
import {isValidNumber} from "libphonenumber-js";


class TabFive extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
          enteredCode: '',
          enteredCodeError: false
        };
        this.handleActivationChange = this.handleActivationChange.bind(this);
    }

    handleActivationChange({ target: { name, value } }) {
      this.setState({ [name]: value })
    }

    render() {

        const {setScreen,refreshTimetable, selectedStaff,serviceId,selectedDay,selectedServices,selectedTime,
            group,handleChange,isValidEmailAddress,setterPhone,setterEmail,handleSave, clientActivationId, clientVerificationCode} = this.props;
        const { enteredCode, enteredCodeError } = this.state;

        if (!clientActivationId) {
          $('.phones_country').css({ display: 'flex' })
        }

        return (
            <div className="service_selection screen5">
                <div className="title_block">
                            <span className="prev_block" onClick={()=>{
                                setScreen(4);
                                refreshTimetable()}}>
                                Назад</span>
                    <p className="modal_title">Запись</p>
                </div>
                <div className="specialist">
                    {selectedStaff.staffId &&
                    <div>
                        <p className="img_container">
                            <img src={selectedStaff.imageBase64?"data:image/png;base64,"+selectedStaff.imageBase64:`${process.env.CONTEXT}public/img/image.png`} alt=""/>
                            <span>{selectedStaff.firstName} {selectedStaff.lastName}</span>
                        </p>
                    </div>
                    }
                    {serviceId &&
                    <div className="supperVisDet">
                        {(selectedServices.length === 1) ? <p>{selectedServices[0].name && selectedServices[0].name.length > 85 ? `${selectedServices[0].name.slice(0, 85)}...` : selectedServices[0].name}</p> :
                            (<p>Выбрано услуг: <br/>
                                <p><strong>{selectedServices.length}</strong></p></p>)}
                        <div className="supperVisDet_info">
                            <p className="supperVisDet_info_title">Список услуг:</p>
                            {selectedServices.map(service => (
                                <p>{service.name}</p>
                            ))}
                            <span className="supperVisDet_closer" />
                        </div>
                    </div>
                    }
                    {selectedDay &&
                    <div className="date_item_popup">
                        <strong>{moment(selectedDay).locale('ru').format('DD MMMM YYYY')}</strong>
                    </div>
                    }
                    {selectedTime &&
                    <div className="date_item_popup">
                        <strong>{moment(selectedTime, 'x').format('HH:mm')}</strong>
                    </div>
                    }
                </div>
                {clientActivationId ? (
                  <React.Fragment>
                    <p style={{ marginBottom: '0' }} className="modal_title">Подтверждение нового клиента</p>
                    <p>Код подтверждения был отправлен на номер {group.phone}. Введите код ниже:</p>
                    <input type="text" placeholder="Код" name="enteredCode" onChange={this.handleActivationChange}
                           value={enteredCode}
                           className={(enteredCodeError ? ' redBorder' : '')}
                    />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <p>Имя</p>
                    <input type="text" placeholder="Введите имя" name="clientName" onChange={handleChange}
                           value={group.clientName && group.clientName}
                           className={((group.phone && !group.clientName) ? ' redBorder' : '')}
                    />
                    <p>Телефон</p>
                    <div className="phones_country">
                      <ReactPhoneInput
                        regions={['america', 'europe']}
                        disableAreaCodes={true}

                        inputClass={((!group.phone && group.email && group.email!=='' && !isValidNumber(group.phone)) ? ' redBorder' : '')} value={ group.phone }  defaultCountry={'by'} onChange={phone => setterPhone(phone)}
                      />

                    </div>
                    <br/>
                    <p>Email</p>
                    <input type="text" placeholder="Введите email" name="email" onChange={handleChange}
                           onKeyUp={() => setterEmail()}
                           value={group.email}
                           className={'' + ((group.email && group.email!=='' && !isValidEmailAddress(group.email)) ? ' redBorder' : '')}
                    />
                    <p>Комментарии</p>
                    <textarea placeholder="Комментарии к записи"  name="description" onChange={handleChange} value={group.description}/>
                    <p className="term">Нажимая кнопку &laquo;записаться&raquo;, вы соглашаетесь с <a href={`${config.baseUrl}/user_agreement`} target="_blank">условиями пользовательского соглашения</a></p>
                  </React.Fragment>
                )}
                <input className={((!selectedStaff.staffId || !serviceId || !selectedDay || !group.phone || !isValidNumber(group.phone) || !selectedTime || !group.clientName) ? 'disabledField': '')+" book_button"} type="submit" value={clientActivationId ? 'Подтвердить код' : 'ЗАПИСАТЬСЯ'} onClick={
                    ()=> {
                      if (clientActivationId) {

                        if (enteredCode === clientVerificationCode) {
                          this.setState({ enteredCodeError: false });
                          handleSave({
                            clientActivationId,
                            clientVerificationCode: enteredCode
                          })
                        } else {
                          this.setState({ enteredCodeError: true })
                        }

                      } else {
                        $('.phones_country').css({ display: 'none' })
                        if (selectedStaff.staffId && serviceId && selectedDay && group.phone && isValidNumber(group.phone) && selectedTime && group.clientName) {
                          handleSave()
                        }
                      }
                    }}/>
            </div>
        );
    }
}
export default TabFive;