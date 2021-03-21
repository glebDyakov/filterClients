import React, { useState } from 'react';
import { companyActions, notificationActions } from '../_actions';
import Avatar from 'react-avatar-edit';
import 'react-bootstrap-timezone-picker/dist/react-bootstrap-timezone-picker.min.css';
import { access } from '../_helpers/access';
import ReactPhoneInput from 'react-phone-input-2';
import { withTranslation } from 'react-i18next';
import { VISITS_STORAGE_DURATIONS } from '../_constants';
import ConfirmModal from '../_components/modals/ConfirmModal';

const SubCompany = ({
  subcompany,
  t,
  i,
  handleChange,
  handleNotificationChange,
  setState,
  handleSubmit,
  onCrop,
  onClose,
  adding,
  saved,
  isAvatarOpened,
  submitted,
  onVisitStorageDurationChange,
  status,
  subcompanies,
  handleChangePhone,
}) => {
  return (
    <form key={`settings-page_subcompanies-item-${i}`} className="content retreats company_fields" name="form">
      <h3>
        {t('Филиал')} {i + 1}
      </h3>

      <div className="row">
        <div className="col-md-4">
          <p>{t('Название компании')}</p>
          <div className="name_company_wrapper form-control">
            <input
              type="text"
              className="company_input"
              placeholder={t('Например Стоматология')}
              name="companyName"
              maxLength="40"
              value={subcompany.companyName}
              onChange={(e) => handleChange(e, i)}
            />
            <span className="company_counter">{subcompany.companyName.length}/40</span>
          </div>
        </div>
        <div className="col-md-4">
          <p>{t('Вид деятельности')}</p>
          <select
            className="custom-select"
            onChange={(e) => handleNotificationChange(e, i)}
            name="companyTypeId"
            value={subcompany && subcompany.companyTypeId}
          >
            <option value={1}>{t('Салоны красоты, барбершопы, SPA')}</option>
            <option value={2}>{t('СТО, автомойки, шиномонтажи')}</option>
            <option value={3}>{t('Коворкинг')}</option>
            <option value={4}>{t('Медицинские центры')}</option>
          </select>
        </div>
        <div className="col-md-4">
          <p>Email</p>
          <div className="name_company_wrapper form-control">
            <div className="input-text2">
              <input
                type="email"
                placeholder={t('Например') + ': walkerfrank@gmail.com'}
                name="companyEmail"
                disabled
                className="company_input disabledField"
                value={subcompany.companyEmail}
                onChange={(e) => handleChange(e, i)}
                maxLength="60"
              />
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div className="row">
        <div className="col-sm-4">
          <p className="phone_hint_wrapper">
            <p>
              {t('Номер телефона')} ({t('Владельца')})
            </p>
            {subcompany.defaultPhone === 1 && <p>({t('Будет указан в автоуведомлениях')})</p>}
          </p>

          <div style={{ border: 'none' }} className="name_company_wrapper form-control">
            <div style={{ border: 'none' }} className="check-box-group2 input-text2">
              {/* <div className="input-text2">
                 <input type="radio" aria-label="" name="defaultPhone1"
                        disabled={!(subcompany.companyPhone1 && subcompany.companyPhone1.length > 4)}
                        checked={subcompany.defaultPhone===1} onChange={(e) => handleChangePhone(e, i)}/>*/}
              {/* </div> */}

              <ReactPhoneInput
                defaultCountry={'by'}
                country={'by'}
                regions={['america', 'europe']}
                placeholder={t('Введите номер телефона владельца')}
                value={subcompany.companyPhone1}
                onChange={(companyPhone1) => {
                  const newSubcompanies = subcompanies;
                  newSubcompanies[i].companyPhone1 = companyPhone1.replace(/[() ]/g, '');
                  setState({ subcompanies: newSubcompanies });
                }}
              />
            </div>
            <span className="company_counter">{subcompany.companyPhone1.length - 2}/20</span>
          </div>

          <p>{t('Адрес компании')}</p>
          <div className="check-box-group2 form-control">
            {/* <div className="input-text2">
               <input type="radio" aria-label="" name="defaultAddress1"
                      disabled={!subcompany.companyAddress1}  checked={subcompany.defaultAddress===1}
                      onChange={(e) => handleChangeAddress(e, i)}/>
            </div> */}

            <input
              checked={true}
              type="text"
              placeholder={t('Введите адрес')}
              name="companyAddress1"
              className="company_input"
              value={subcompany.companyAddress1}
              onChange={(e) => handleChange(e, i)}
              maxLength="40"
            />
            <span className="company_counter">{subcompany.companyAddress1.length}/40</span>
          </div>

          <p>{t('Срок хранения истории визитов')}</p>
          <div className="check-box-group2 form-control">
            <select
              className="custom-select"
              placeholder="По умолчанию"
              value={subcompany.appointmentStoragePeriod}
              onChange={(e) => onVisitStorageDurationChange(e, i)}
              name="appointmentStoragePeriod"
            >
              {VISITS_STORAGE_DURATIONS.map(({ name, value }) => (
                <option value={value} key={name}>
                  {t(name)}
                </option>
              ))}
            </select>
          </div>

          <div className="buttons-container-setting d-none d-md-flex">
            {adding && i === subcompanies.length - 1 ? null : (
              <button
                type="button"
                className={(saved === i && (status === 'saved.settings' || submitted) && 'disabledField') + ' button'}
                onClick={(e) => {
                  if (saved !== i && (status !== 'saved.settings' || !submitted)) {
                    handleSubmit(e, subcompany, i);
                  }
                }}
              >
                {t('Сохранить')}
              </button>
            )}
          </div>

          {/* <p>Адрес компании</p>*/}
          {/* <div className="check-box-group2 form-control">*/}
          {/*    <div className="input-text2">*/}
          {/*        <input type="radio" aria-label="" name="defaultAddress2"
                    disabled={!subcompany.companyAddress2} checked={subcompany.defaultAddress===2}
                    onChange={(e) => handleChangeAddress(e, i)}/>*/}
          {/*    </div>*/}

          {/*    <input type="text" placeholder="" name="companyAddress2" className="company_input"*/}
          {/*           value={subcompany.companyAddress2}
                    onChange={(e) => handleChange(e, i)} maxLength="40"/>*/}
          {/*    <span className="company_counter">{subcompany.companyAddress2.length}/40</span>*/}
          {/* </div>*/}

          {/* <p>Адрес компании</p>*/}
          {/* <div className="check-box-group2 form-control">*/}
          {/*    <div className="input-text2">*/}
          {/*        <input type="radio" aria-label="" name="defaultAddress3"
                    disabled={!subcompany.companyAddress3} checked={subcompany.defaultAddress===3}
                    onChange={(e) => handleChangeAddress(e, i)}/>*/}
          {/*    </div>*/}

          {/*    <input type="text" placeholder="" name="companyAddress3" className="company_input"*/}
          {/*           value={subcompany.companyAddress3} onChange={(e) => handleChange(e, i)}
                    maxLength="40"/>*/}
          {/*    <span className="company_counter">{subcompany.companyAddress3.length}/40</span>*/}
          {/* </div>*/}
        </div>

        <div className="col-sm-4">
          <p className="phone_hint_wrapper">
            <p>{t('Номер телефона')}</p>
            {subcompany.defaultPhone === 2 && <p>({t('Будет указан в автоуведомлениях')})</p>}
          </p>

          <div style={{ border: 'none' }} className="name_company_wrapper form-control">
            <div style={{ border: 'none' }} className="check-box-group2 input-text2">
              <div className="input-text2">
                 <input type="radio" aria-label="" name="defaultPhone2"
                        disabled={!(subcompany.companyPhone3 && subcompany.companyPhone3.length > 4)}
                        checked={subcompany.defaultPhone===2} onChange={(e) => handleChangePhone(e, i)}/>
              </div>

              <ReactPhoneInput
                defaultCountry={'by'}
                country={'by'}
                regions={['america', 'europe']}
                placeholder={t('Введите номер телефона')}
                value={subcompany.companyPhone3}
                onChange={(companyPhone3) => {
                  const newSubcompanies = subcompanies;
                  newSubcompanies[i].companyPhone3 = companyPhone3.replace(/[() ]/g, '');
                  setState({ subcompanies: newSubcompanies });
                }}
              />
            </div>
            <span className="company_counter">{subcompany.companyPhone3.length - 2}/20</span>
          </div>

          <p className="mt-2">{t('Город')}</p>
          <div className="name_company_wrapper form-control">
            <input
              type="text"
              className="company_input"
              placeholder={t('Введите название города')}
              name="city"
              maxLength="40"
              value={subcompany.city}
              onChange={(e) => handleChange(e, i)}
            />
            <span className="company_counter">{subcompany.city.length}/40</span>
          </div>
        </div>

        <div className="col-sm-4">
          <p className="phone_hint_wrapper">
            <p>{t('Номер телефона')}</p>
            {subcompany.defaultPhone === 3 && <p>({t('Будет указан в автоуведомлениях')})</p>}
          </p>

          <div style={{ border: 'none' }} className="name_company_wrapper form-control">
            <div style={{ border: 'none' }} className="check-box-group2 input-text2">
              <div className="input-text2">
                 <input type="radio" aria-label="" name="defaultPhone3"
                        disabled={!(subcompany.companyPhone2 && subcompany.companyPhone2.length > 4)}
                        checked={subcompany.defaultPhone===3} onChange={(e) => handleChangePhone(e, i)}/>
              </div>
              <ReactPhoneInput
                defaultCountry={'by'}
                country={'by'}
                regions={['america', 'europe']}
                placeholder={t('Введите номер телефона')}
                value={subcompany.companyPhone2}
                onChange={(companyPhone2) => {
                  const newSubcompanies = subcompanies;
                  newSubcompanies[i].companyPhone2 = companyPhone2.replace(/[() ]/g, '');
                  setState({ subcompanies: newSubcompanies });
                }}
              />
            </div>
            <span className="company_counter">{subcompany.companyPhone2.length - 2}/20</span>
          </div>

          <p className="text-center">{t('Фото компании')}</p>
          <div className="upload_container">
            <div className="setting image_picker">
              <div className="settings_wrap">
                <label className="drop_target">
                  <div className="image_preview">
                    <div className="existed-image">
                      <img
                        src={
                          subcompany.imageBase64 && subcompany.imageBase64 !== ''
                            ? 'data:image/png;base64,' + subcompany.imageBase64
                            : `${process.env.CONTEXT}public/img/add_new.svg`
                        }
                      />
                    </div>

                    {isAvatarOpened && <Avatar height={117} cropRadius="100%" label="" onCrop={(e) => onCrop(e, i)} onClose={onClose} />}
                  </div>
                </label>
              </div>
            </div>
          </div>

          {saved === i && status === 'saved.settings' && <p className="alert-success p-1 rounded pl-3 mb-2">{t('Настройки сохранены')}</p>}
        </div>

        <div className="buttons-container-setting d-md-none mx-auto">
          {adding && i === subcompanies.length - 1 ? null : (
            <button
              type="button"
              className={(saved === i && (status === 'saved.settings' || submitted) && 'disabledField') + ' button'}
              onClick={(e) => {
                if (saved !== i && (status !== 'saved.settings' || !submitted)) {
                  handleSubmit(e, subcompany, i);
                }
              }}
            >
              {t('Сохранить')}
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default SubCompany;
