import React, { PureComponent } from 'react';
import moment from 'moment'
import ReactPhoneInput from "react-phone-input-2";
import { isValidNumber } from "libphonenumber-js";
import { origin } from "../../_helpers/handle-response";
import { withTranslation } from "react-i18next";
import 'react-phone-input-2/lib/style.css';
import MediaQuery from 'react-responsive'

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

    const { setScreen, info, changeBackToRandomStaff, backToRandomStaff, selectedTime: time, refreshTimetable, selectedStaff, serviceId, selectedDay, selectedServices, selectedTime, getDurationForCurrentStaff,
      group, handleChange, isValidEmailAddress, forceUpdateStaff, flagAllStaffs, setterPhone, setterEmail, handleSave, clientActivationId, enteredCodeError, t } = this.props;
    const classBool = (!selectedStaff.staffId || !serviceId || !selectedDay || !group.phone || !isValidNumber(group.phone) || !selectedTime || !group.clientName || (group.email ? !isValidEmailAddress(group.email) : false) || (info.companyTypeId === 2 ? !group.carNumber : false))
    console.log(classBool)
    const { enteredCode } = this.state;
    const desctop = 710;
    const mob = 709;
    const currentDay = moment(selectedDay).format('DD MMMM YYYY,');
    if (!clientActivationId) {
      $('.phones_country').css({ display: 'flex' })
    }

    if (group.phone > 0 && group.phone[0] !== "+") {
      group.phone = "+" + group.phone
    }

    let serviceInfo = null
    if (selectedServices[0]) {
      let priceFrom = 0;
      let priceTo = 0;
      let duration = 0;
      selectedServices.forEach((service) => {
        priceFrom += parseInt(service.priceFrom)
        priceTo += parseInt(service.priceTo)
        duration += parseInt(getDurationForCurrentStaff(service))
      })

      serviceInfo = (
        <div className="last_list_block">
          <div className="last_list_caption">
            <div className="last_list_img">
              <img src={selectedStaff.imageBase64 ? "data:image/png;base64," + selectedStaff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`} alt="" />
              <div className="last_list_name">
                <span>{selectedStaff.firstName} {selectedStaff.lastName}</span>
                <p>{currentDay} {moment(time).format('LT')}</p>
              </div>
            </div>
            <p className="desktop_visible" style={{
              fontSize: "13px",
              marginRight: "17px",
            }}>{t("Длительность")}: {moment.duration(parseInt(duration), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}</p>
          </div>
          <div className="last_list_services">
            <p>{t("Список услуг:")}Список услуг:</p>
            {selectedServices.map((service, id) => (
              <p>{id + 1}. <span> {service.name}&nbsp;</span>
                <strong>({service.priceFrom}{service.priceFrom !== service.priceTo && " - " + service.priceTo}&nbsp;{service.currency})</strong>
              </p>
            ))}
          </div>
          <div className="last_list_price">
            <p>{t("Итого:")}Итого:</p>
            <p>{priceFrom}{priceFrom !== priceTo && " - " + priceTo}&nbsp;</p>
            <span>{selectedServices[0] && selectedServices[0].currency}</span>
          </div>
        </div >
      )
    }

    return (
      <div className="service_selection screen5">
      <div className="title_block entry_form-title">
        <span className="prev_block" onClick={() => {
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
          <span className="title_block_text">{t("Назад")}</span>
        </span>
        {/* <p className="modal_title">{t("Запись")}</p> */}
      </div>
      <div className="last_list">

        {serviceInfo}

      </div>
    {
      clientActivationId ? (
        <React.Fragment>
          <p style={{ marginBottom: '0' }} className="modal_title">{t("Подтверждение нового клиента")}</p>
          <p style={{ display: 'flex', alignItems: 'center' }}>
            <img style={{ height: '22px', marginRight: '4px' }} src={`${process.env.CONTEXT}public/img/client-verification.svg`}
            /> <span>{t("Код подтверждения был отправлен на номер")} {group.phone}. {t("Введите код ниже")}:</span>
          </p>
          <input type="text" placeholder={t("Код")} name="enteredCode" onChange={this.handleActivationChange}
            value={enteredCode}
            className={(enteredCodeError ? ' redBorder' : '')}
          />
        </React.Fragment>
      ) : (
          <React.Fragment>
            <div className="entry_form">
              <div className="entry_form_block">
                <div className="entry_form-item">
                  <p>{t("Имя")}</p>
                  <input type="text" placeholder={t("Введите имя")} name="clientName" onChange={handleChange}
                    value={group.clientName && group.clientName}
                    className={((group.phone && !group.clientName) ? ' redBorder' : '')}
                  />
                </div>
                <MediaQuery maxWidth={mob}>
                  <div className="entry_form-item">
                    <p>{t("Телефон")}</p>
                    <div className="phones_country">
                      <ReactPhoneInput
                        regions={['america', 'europe']}
                        disableAreaCodes={true}
                        inputClass={((!group.phone && group.email && group.email !== '' && !isValidNumber(group.phone)) ? ' redBorder' : '')} value={group.phone} country={'by'} onChange={phone => setterPhone(phone)}
                      />

                    </div>
                    <span> {t("На этот номер вы получите SMS с кодом подтверждения и информацию о записи")}</span>
                  </div>

                  {info.companyTypeId === 2 && (
                    <React.Fragment>
                      <div className="entry_form-item">
                        <p>{t("Марка авто")}</p>
                        <input type="text" placeholder={t("Введите марку авто")} name="carBrand" onChange={handleChange}
                          value={group.carBrand && group.carBrand}
                          className={'' + ((group.email && group.email !== '' && !isValidEmailAddress(group.email)) ? ' redBorder' : '')}
                        />
                      </div>
                      <div className="entry_form-item">
                        <p>{t("Гос. номер")}</p>
                        <input type="text" placeholder={t("Введите гос. номер")} name="carNumber" onChange={handleChange}
                          value={group.carNumber && group.carNumber}
                          className={'' + ((group.email && group.email !== '' && !isValidEmailAddress(group.email)) ? ' redBorder' : '')}
                        />
                      </div>
                    </React.Fragment>
                  )}
                  <div className="entry_form-item">
                    <p>Email</p>
                    <input type="text" placeholder={t("Hello@gmail.com")} name="email" onChange={handleChange}
                      onKeyUp={() => setterEmail()}
                      value={group.email}
                      className={'' + ((group.email && group.email !== '' && !isValidEmailAddress(group.email)) ? ' redBorder' : '')}
                    />
                  </div>
                </MediaQuery>
                <MediaQuery minWidth={desctop}>
                  <div className="entry_form-item">
                    <p>Email</p>
                    <input type="text" placeholder={t("Hello@gmail.com")} name="email" onChange={handleChange}
                      onKeyUp={() => setterEmail()}
                      value={group.email}
                      className={'' + ((group.email && group.email !== '' && !isValidEmailAddress(group.email)) ? ' redBorder' : '')}
                    />
                  </div>
                  {info.companyTypeId === 2 && (
                    <React.Fragment>
                      <div className="entry_form-item">
                        <p>{t("Марка авто")}</p>
                        <input type="text" placeholder={t("Введите марку авто")} name="carBrand" onChange={handleChange}
                          value={group.carBrand && group.carBrand}
                          className={'' + ((group.email && group.email !== '' && !isValidEmailAddress(group.email)) ? ' redBorder' : '')}
                        />
                      </div>
                      <div className="entry_form-item">
                        <p>{t("Гос. номер")}</p>
                        <input type="text" placeholder={t("Введите гос. номер")} name="carNumber" onChange={handleChange}
                          value={group.carNumber && group.carNumber}
                          className={'' + ((group.email && group.email !== '' && !isValidEmailAddress(group.email)) ? ' redBorder' : '')}
                        />
                      </div>
                    </React.Fragment>
                  )}
                  <div className="entry_form-item">
                    <p>{t("Телефон")}</p>
                    <div className="phones_country">
                      <ReactPhoneInput
                        regions={['america', 'europe']}
                        disableAreaCodes={true}
                        inputClass={((!group.phone && group.email && group.email !== '' && !isValidNumber(group.phone)) ? ' redBorder' : '')} value={group.phone} country={'by'} onChange={phone => setterPhone(phone)}
                      />

                    </div>
                    <span>На этот номер вы получите SMS с кодом <br /> подтверждения и информацию о записи</span>
                  </div>
                </MediaQuery>

                <div className="entry_form-item">
                  <p>{t("Комментарии")}</p>
                  <textarea placeholder={t("Напишите комментарий")} name="description" onChange={handleChange} value={group.description} />
                  {/* <p className="term">{t("Нажимая кнопку записаться, вы соглашаетесь с")} <a href={`${origin}/user_agreement`} target="_blank">{t("условиями пользовательского соглашения")}</a></p> */}
                </div>
              </div>

            </div>
          </React.Fragment>
        )
    }
        <MediaQuery maxWidth={mob}>
          <div className="last_footer_block">
            <input
             className={((!selectedStaff.staffId || !serviceId || !selectedDay || !group.phone || !isValidNumber(group.phone) || !selectedTime || !group.clientName || (group.email ? !isValidEmailAddress(group.email) : false) || (info.companyTypeId === 2 ? !group.carNumber : false)) ? 'disabledField' : '') + " book_button"}
             disabled={!selectedStaff.staffId || !serviceId || !selectedDay || !group.phone || !isValidNumber(group.phone) || !selectedTime || !group.clientName || (group.email ? !isValidEmailAddress(group.email) : false) || (info.companyTypeId === 2 ? !group.carNumber : false)}
              type="submit" value={clientActivationId ? t("Подтвердить код") : t('Записаться')} onClick={
                () => {
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
                }} />
            <p>
              {t("Нажимая кнопку записаться, вы соглашаетесь с")}&nbsp;
              <a rel="nofollow noopener noreferrer" href={`${origin}/user_agreement`} >{t("условиями пользовательского соглашения")}</a>
            </p>
          </div>
        </MediaQuery>

        <MediaQuery minWidth={desctop}>
          <div className="specialist">
            <div className="last_footer_block">
              <p>
                {t("Нажимая кнопку записаться, вы соглашаетесь с")}&nbsp;
              <a rel="nofollow noopener noreferrer" href={`${origin}/user_agreement`} >{t("условиями пользовательского соглашения")}</a>
              </p>
              <input
              className={((!selectedStaff.staffId || !serviceId || !selectedDay || !group.phone || !isValidNumber(group.phone) || !selectedTime || !group.clientName || (group.email ? !isValidEmailAddress(group.email) : false) || (info.companyTypeId === 2 ? !group.carNumber : false)) ? 'disabledField' : '') + " next_block book_button"}
              disabled={!selectedStaff.staffId || !serviceId || !selectedDay || !group.phone || !isValidNumber(group.phone) || !selectedTime || !group.clientName || (group.email ? !isValidEmailAddress(group.email) : false) || (info.companyTypeId === 2 ? !group.carNumber : false)}
                type="submit" value={clientActivationId ? t("Подтвердить код") : t('Записаться')} onClick={
                  () => {
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
                  }} />
            </div>
          </div>
        </MediaQuery>
      </div >
    );
  }
}

export default withTranslation("common")(TabFive);