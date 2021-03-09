import React from 'react';
import { COMPANY_SOCIAL_NETWORKS } from '../_constants';
import { INSTAGRAM_LINK_REGEX } from '../_constants/regex.constants';
import { isValid } from '../_helpers/validators';

const SocialNetworks = ({ handleChange, subcompany, t, i, errors, setErrors }) => {
  const validateValue = (regex, { target: { name, value } }) => {
    if (value) {
      const isValueValid = isValid(value, regex);
      setErrors({ ...errors, [name]: !isValueValid });
    } else {
      setErrors({ ...errors, [name]: false });
    }
  };

  return (
    <>
      <h4>{t('Соц. сети')}</h4>
      {COMPANY_SOCIAL_NETWORKS.map(({ name, displayingName, regex }) => (
        <React.Fragment key={name}>
          <p className="mt-2">{t(displayingName)}</p>
          <div className={`name_company_wrapper form-control ${errors[name] ? 'error' : ''}`}>
            <input
              type="text"
              className="company_input"
              placeholder={t('Введите ссылку на соц сеть')}
              name={name}
              maxLength="40"
              value={subcompany[name]}
              onChange={(e) => handleChange(e, i)}
              onBlur={(e) => validateValue(regex, e)}
            />
            <span className="company_counter">{subcompany[name]?.length || 0}/40</span>
          </div>
        </React.Fragment>
      ))}
    </>
  );
};

export default SocialNetworks;
