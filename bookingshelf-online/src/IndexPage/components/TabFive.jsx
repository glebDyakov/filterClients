import React, { PureComponent } from 'react';
import moment from 'moment'
import ReactPhoneInput from "react-phone-input-2";
import { isValidNumber } from "libphonenumber-js";
import { origin } from "../../_helpers/handle-response";
import { withTranslation } from "react-i18next";
import 'react-phone-input-2/lib/style.css';
import MediaQuery from 'react-responsive'
import {TABLET_WIDTH} from '../../_constants/global.constants'
import skip_arrow from "../../../public/img/icons/skip-arrow.svg"

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

    const { enteredCode } = this.state;

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
        priceFrom += Number(service.priceFrom)
        priceTo += Number(service.priceTo)
        duration += Number(getDurationForCurrentStaff(service))
      })
      priceTo=Math.floor(priceTo * 100) / 100;
      priceFrom=Math.floor(priceFrom * 100) / 100;
      serviceInfo = (
        <div className="last_list_block">
          <div className="last_list_caption">
            <div className="last_list_img">
              <img src={selectedStaff.imageBase64 ? "data:image/png;base64," + selectedStaff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`} alt="" />
              <div className="last_list_name">
                <span>{selectedStaff.firstName} {selectedStaff.lastName}</span>
                <p>{t(`${currentDay}`)} {moment(time).format('LT')}</p>
              </div>
            </div>
            <p className="desktop_visible" style={{
              fontSize: "13px",
              marginRight: "17px",
            }}>{t("????????????????????????")}: {moment.duration(parseInt(duration), "seconds").format(`h[ ${t("??")}] m[ ${t("??????????")}]`)}</p>
          </div>
          <div className="last_list_services">
            <p>{t("???????????? ??????????")}:</p>
            {selectedServices.map((service, id) => (
              <p key={id}>{id + 1}. <span> {service.name}&nbsp;</span>
                <strong>({service.priceFrom}{service.priceFrom !== service.priceTo && " - " + service.priceTo}&nbsp;{service.currency})</strong>
              </p>
            ))}
          </div>
          <div className="last_list_price">
            <p>{t("??????????")}:</p>
            <p>{priceFrom}{priceFrom !== priceTo && " - " + priceTo}&nbsp;</p>
            <span>{selectedServices[0] && selectedServices[0].currency}</span>
          </div>
        </div >
      )
    }

    return (
      <div className="service_selection screen5">
        <div className="service_selection_block_five">
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
              <span className="title_block_text">{t("??????????")}</span>
            </span>
            {/* <p className="modal_title">{t("????????????")}</p> */}
          </div>
          <div className="last_list">

            {serviceInfo}

          </div>
          {
            clientActivationId ? (
              <React.Fragment>
                <div className="confirmation">
                 <p  className="modal_title">{t("?????????????????????????? ???????????? ??????????????")}</p>
                <p >
                  <img src={`${process.env.CONTEXT}public/img/client-verification.svg`}
                  /> <span>{t("?????? ?????????????????????????? ?????? ?????????????????? ???? ??????????")} {group.phone}. {t("?????????????? ?????? ????????")}:</span>
                </p>
                <input type="text" placeholder={t("??????")} name="enteredCode" onChange={this.handleActivationChange}
                  value={enteredCode}
                  className={(enteredCodeError ? ' redBorder' : '')}
                /> 
                </div>
                
              </React.Fragment>
            ) : (
                <React.Fragment>
                  <div className="entry_form">
                    <div className="entry_form_block">
                      <div className="entry_form-item">
                        <p>{t("??????")}</p>
                        <input type="text" placeholder={t("?????????????? ??????")} name="clientName" onChange={handleChange}
                          value={group.clientName && group.clientName}
                          className={((group.phone && !group.clientName) ? ' redBorder' : '')}
                        />
                      </div>
                      <MediaQuery maxWidth={TABLET_WIDTH-1}>
                        <div className="entry_form-item">
                          <p>{t("??????????????")}</p>
                          <div className="phones_country">
                            <ReactPhoneInput
                              regions={['america', 'europe']}
                              disableAreaCodes={true}
                              inputClass={((!group.phone && group.email && group.email !== '' && !isValidNumber(group.phone)) ? ' redBorder' : '')} value={group.phone} country={'by'} onChange={phone => setterPhone(phone)}
                            />

                          </div>
                          <span> {t("???? ???????? ?????????? ???? ???????????????? SMS ?? ?????????? ?????????????????????????? ?? ???????????????????? ?? ????????????")}</span>
                        </div>

                        {info.companyTypeId === 2 && (
                          <React.Fragment>
                            <div className="entry_form-item">
                              <p>{t("?????????? ????????")}</p>
                              <input type="text" placeholder={t("?????????????? ?????????? ????????")} name="carBrand" onChange={handleChange}
                                value={group.carBrand && group.carBrand}
                                className={'' + ((group.email && group.email !== '' && !isValidEmailAddress(group.email)) ? ' redBorder' : '')}
                              />
                            </div>
                            <div className="entry_form-item">
                              <p>{t("??????. ??????????")}</p>
                              <input type="text" placeholder={t("?????????????? ??????. ??????????")} name="carNumber" onChange={handleChange}
                                value={group.carNumber && group.carNumber}
                                className={'' + ((group.email && group.email !== '' && !isValidEmailAddress(group.email)) ? ' redBorder' : '')}
                              />
                            </div>
                          </React.Fragment>
                        )}
                        <div className="entry_form-item">
                          {!(group.email && group.email !== '' && !isValidEmailAddress(group.email))
                            ? (<p >{t("Email")}</p>)
                            : (<div className="error_text_red">
                              <p >{t("Email")}</p>
                              <p >{t("???????????????????????? Email")}</p>
                            </div>
                            )}
                          <input type="text" placeholder={t("Hello@gmail.com")} name="email" onChange={handleChange}
                            onKeyUp={() => setterEmail()}
                            value={group.email}
                            className={'' + ((group.email && group.email !== '' && !isValidEmailAddress(group.email)) ? ' redBorder' : '')}
                          />
                        </div>
                      </MediaQuery>
                      <MediaQuery minWidth={TABLET_WIDTH}>
                        <div className="entry_form-item">
                          {!(group.email && group.email !== '' && !isValidEmailAddress(group.email))
                            ? (<p >{t("Email")}</p>)
                            : (<div className="error_text_red">
                              <p >{t("Email")}</p>
                              <p >{t("???????????????????????? Email")}</p>
                            </div>
                            )}
                          <input type="text" placeholder={t("Hello@gmail.com")} name="email" onChange={handleChange}
                            onKeyUp={() => setterEmail()}
                            value={group.email}
                            className={'' + ((group.email && group.email !== '' && !isValidEmailAddress(group.email)) ? ' redBorder' : '')}
                          />
                        </div>
                        {info.companyTypeId === 2 && (
                          <React.Fragment>
                            <div className="entry_form-item">
                              <p>{t("?????????? ????????")}</p>
                              <input type="text" placeholder={t("?????????????? ?????????? ????????")} name="carBrand" onChange={handleChange}
                                value={group.carBrand && group.carBrand}
                                className={'' + ((group.email && group.email !== '' && !isValidEmailAddress(group.email)) ? ' redBorder' : '')}
                              />
                            </div>
                            <div className="entry_form-item">
                              <p>{t("??????. ??????????")}</p>
                              <input type="text" placeholder={t("?????????????? ??????. ??????????")} name="carNumber" onChange={handleChange}
                                value={group.carNumber && group.carNumber}
                                className={'' + ((group.email && group.email !== '' && !isValidEmailAddress(group.email)) ? ' redBorder' : '')}
                              />
                            </div>
                          </React.Fragment>
                        )}
                        <div className="entry_form-item">
                          <p>{t("??????????????")}</p>
                          <div className="phones_country">
                            <ReactPhoneInput
                              regions={['america', 'europe']}
                              disableAreaCodes={true}
                              inputClass={((!group.phone && group.email && group.email !== '' && !isValidNumber(group.phone)) ? ' redBorder' : '')} value={group.phone} country={'by'} onChange={phone => setterPhone(phone)}
                            />

                          </div>
                          <span>{t("???? ???????? ?????????? ???? ???????????????? SMS ?? ?????????? ?????????????????????????? ?? ???????????????????? ?? ????????????")}</span>
                        </div>
                      </MediaQuery>

                      <div className="entry_form-item">
                        <p>{t("??????????????????????")}</p>
                        <textarea placeholder={t("???????????????? ??????????????????????")} name="description" onChange={handleChange} value={group.description} />
                        {/* <p className="term">{t("?????????????? ???????????? ????????????????????, ???? ???????????????????????? ??")} <a href={`${origin}/user_agreement`} target="_blank">{t("?????????????????? ?????????????????????????????????? ????????????????????")}</a></p> */}
                      </div>
                    </div>

                  </div>
                </React.Fragment>
              )
          }
          <MediaQuery minWidth={TABLET_WIDTH}>
            <div className="specialist">
              <div className="last_footer_block">
                <p >
                  {t("?????????????? ???????????? ????????????????????, ???? ???????????????????????? ?? ?????????????????? ")}&nbsp;
              <a className="last_footer_block_desc_a"  href={`${origin}/user_agreement`} >{t("?????????????????????????????????? ????????????????????")}</a>
                </p>
                <button
                  className={((!selectedStaff.staffId || !serviceId || !selectedDay || !group.phone || !isValidNumber(group.phone) || !selectedTime || !group.clientName || (group.email ? !isValidEmailAddress(group.email) : false) || (info.companyTypeId === 2 ? !group.carNumber : false)) ? 'disabledField' : '') + " book_button"}
                  disabled={!selectedStaff.staffId || !serviceId || !selectedDay || !group.phone || !isValidNumber(group.phone) || !selectedTime || !group.clientName || (group.email ? !isValidEmailAddress(group.email) : false) || (info.companyTypeId === 2 ? !group.carNumber : false)}
                  type="submit" onClick={
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
                    }} >{clientActivationId ? t("?????????????????????? ??????") : t('????????????????????')}<img src={skip_arrow} alt="skip_arrow" /></button>
              </div>
            </div>
          </MediaQuery>
          <MediaQuery maxWidth={TABLET_WIDTH-1}>
            <div className="last_footer_block">
              <button
                className={((!selectedStaff.staffId || !serviceId || !selectedDay || !group.phone || !isValidNumber(group.phone) || !selectedTime || !group.clientName || (group.email ? !isValidEmailAddress(group.email) : false) || (info.companyTypeId === 2 ? !group.carNumber : false)) ? 'disabledField' : '') + " book_button"}
                disabled={!selectedStaff.staffId || !serviceId || !selectedDay || !group.phone || !isValidNumber(group.phone) || !selectedTime || !group.clientName || (group.email ? !isValidEmailAddress(group.email) : false) || (info.companyTypeId === 2 ? !group.carNumber : false)}
                type="submit"  onClick={
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
                  }} >{clientActivationId ? t("?????????????????????? ??????") : t('????????????????????')}<img src={skip_arrow} alt="skip_arrow" /></button>
              <p>
                {t("?????????????? ???????????? ????????????????????, ???? ???????????????????????? ?? ?????????????????? ")}&nbsp;
              <a className="last_footer_block_a"  href={`${origin}/user_agreement`} >{t("?????????????????????????????????? ????????????????????")}</a>
              </p>
            </div>
          </MediaQuery>
        </div >
      </div>
    );
  }
}

export default withTranslation("common")(TabFive);