import React, {PureComponent} from 'react';
import moment from 'moment'
import ReactPhoneInput from "react-phone-input-2";
import {isValidNumber} from "libphonenumber-js";
import {origin} from "../../_helpers/handle-response";


class TabFive extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
          enteredCode: '',
        };
        this.handleActivationChange = this.handleActivationChange.bind(this);
    }

    handleActivationChange({ target: { name, value } }) {
      this.setState({ [name]: value })
    }

    render() {

        const {setScreen, info, changeBackToRandomStaff, backToRandomStaff, refreshTimetable, selectedStaff,serviceId,selectedDay,selectedServices,selectedTime, getDurationForCurrentStaff,
            group,handleChange,isValidEmailAddress, forceUpdateStaff, flagAllStaffs, setterPhone,setterEmail,handleSave, clientActivationId, enteredCodeError } = this.props;
        const { enteredCode } = this.state;

        if (!clientActivationId) {
          $('.phones_country').css({ display: 'flex' })
        }

        let serviceInfo = null
        if (selectedServices[0]) {
            let priceFrom = 0;
            let priceTo= 0;
            let duration = 0;
            selectedServices.forEach((service) => {
                priceFrom += parseInt(service.priceFrom)
                priceTo += parseInt(service.priceTo)
                duration += parseInt(getDurationForCurrentStaff(service))
            })

            serviceInfo = (
                <div style={{ display: 'inline-block' }} className="supperVisDet service_item">
                    {(selectedServices.length===1)?<p>{selectedServices[0].name}</p>:
                        (<p>Выбрано услуг: <strong className="service_item_price">{selectedServices.length}</strong></p>)}
                    <p className={selectedServices.some((service) => service.priceFrom!==service.priceTo) && 'sow'}><strong className="service_item_price">{priceFrom}{priceFrom!==priceTo && " - "+priceTo}&nbsp;</strong> <span>{selectedServices[0] && selectedServices[0].currency}</span></p>
                    <span style={{ width: '100%' }} className="runtime">
                        <strong>{moment.duration(parseInt(duration), "seconds").format("h[ ч] m[ мин]")}</strong>
                    </span>
                    <div className="supperVisDet_info">
                        <p className="supperVisDet_info_title">Список услуг:</p>
                        {selectedServices.map(service => (
                            <p>• {service.name}</p>
                        ))}
                        <span className="supperVisDet_closer" />
                    </div>
                    <img className="tap-service-icon" src={`${process.env.CONTEXT}public/img/tap-service.svg`}/>
                </div>
            )
        }

        return (
            <div className="service_selection screen5">
                <div className="title_block">
                            <span className="prev_block" onClick={()=>{
                                if (flagAllStaffs) {
                                    forceUpdateStaff([]);
                                    setScreen(1)
                                } else {
                                    setScreen(4);
                                    refreshTimetable()
                                }
                            }
                            }
                            >
                                <span className="title_block_text">Назад</span>
                            </span>
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
                    {serviceInfo && serviceInfo}
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
                    <p style={{ display: 'flex', alignItems: 'center' }}>
                        <img style={{ height: '22px', marginRight: '4px' }} src={`${process.env.CONTEXT}public/img/client-verification.svg`}
                        /> <span>Код подтверждения был отправлен на номер {group.phone}. Введите код ниже:</span>
                    </p>
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
                    <p style={{ display: 'flex' }}>
                        <img style={{ height: '19px', marginRight: '4px' }} src={`${process.env.CONTEXT}public/img/client-verification.svg`}
                       /> <span>На этот номер вы получите SMS с кодом подтверждения и информацию о записи</span>
                    </p>
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
                    {info.companyTypeId === 2 && (
                      <React.Fragment>
                          <p>Марка авто</p>
                          <input type="text" placeholder="Введите марку авто" name="carBrand" onChange={handleChange}
                                 value={group.carBrand && group.carBrand}
                          />

                          <p>Гос. номер</p>
                          <input type="text" placeholder="Введите гос. номер" name="carNumber" onChange={handleChange}
                                 value={group.carNumber && group.carNumber}
                          />
                      </React.Fragment>
                    )}
                    <p>Комментарии</p>
                    <textarea placeholder="Комментарии к записи"  name="description" onChange={handleChange} value={group.description}/>
                    <p className="term">Нажимая кнопку &laquo;записаться&raquo;, вы соглашаетесь с <a href={`${origin}/user_agreement`} target="_blank">условиями пользовательского соглашения</a></p>
                  </React.Fragment>
                )}
                <input
                    className={((!selectedStaff.staffId || !serviceId || !selectedDay || !group.phone || !isValidNumber(group.phone) || !selectedTime || !group.clientName || (group.email ? !isValidEmailAddress(group.email) : false)) ? 'disabledField': '')+" book_button"}
                    disabled={!selectedStaff.staffId || !serviceId || !selectedDay || !group.phone || !isValidNumber(group.phone) || !selectedTime || !group.clientName || (group.email ? !isValidEmailAddress(group.email) : false)}
                    type="submit" value={clientActivationId ? 'Подтвердить код' : 'ЗАПИСАТЬСЯ'} onClick={
                    ()=> {
                      if (clientActivationId) {
                          handleSave({
                            clientActivationId,
                            clientVerificationCode: enteredCode
                          })
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