import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { COMPANY_SOCIAL_NETWORKS, SOCIAL_NETWORK_MAP } from '../_constants';
import { INSTAGRAM_LINK_REGEX } from '../_constants/regex.constants';
import { isValid } from '../_helpers/validators';
import { companyService } from '../_services';

const SocialNetworks = ({ t, companyId }) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false)
  const { data } = useSWR(companyId ? ['socialnetwork', companyId] : null, () => companyService.getSubcompanySocialNetworks());

  const handleChange = ({ target: { name, value } }) => setValues({ ...values, [name]: value });

  const validateValue = (regex, { target: { name, value } }) => {
    if (value) {
      const isValueValid = isValid(value, regex);
      setErrors({ ...errors, [name]: !isValueValid });
    } else {
      setErrors({ ...errors, [name]: false });
    }
  };

  const saveData = async () => {
    if (!Object.values(errors).filter((value) => value).length) {
      try {
        const body = COMPANY_SOCIAL_NETWORKS.map(({ name }) => ({
          socialNetwork: SOCIAL_NETWORK_MAP[name],
          companyUrl: values[name] || '',
          companyId,
        }));
        await companyService.updateCompanySocialNetworks(body);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (data) {
      const socialsValues = data.reduce((items, social) => ({ ...items, [social.socialNetwork.toLowerCase()]: social.companyUrl }), {});
      setValues({ ...socialsValues });
    }
  }, [data]);

  return (
    <div className="company-fields social-wrap">
      <p className="mt-2">{t('Соц. сети')}</p>
      {data ? (
        COMPANY_SOCIAL_NETWORKS.map(({ name, displayingName, regex }) => (
          <React.Fragment key={name}>
            <p className="mt-2">{t(displayingName)}</p>
            <div className={`name_company_wrapper form-control ${errors[name] ? 'error' : ''}`}>
              <input
                type="text"
                className="company_input"
                placeholder={t('Введите ссылку на соц сеть')}
                name={name}
                maxLength="40"
                value={values[name]}
                onChange={(e) => handleChange(e)}
                onBlur={(e) => validateValue(regex, e)}
              />
              <span className="company_counter">{values[name]?.length || 0}/40</span>
            </div>
          </React.Fragment>
        ))
      ) : (
        <div className="loader">
          <img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt="" />
        </div>
      )}
      {showSuccess && <p className="alert-success p-1 rounded pl-3">{t("Сохранено")}</p>}
      <button className="ahref button button-save" onClick={saveData}>
        {t('Сохранить')}
      </button>
    </div>
  );
};

export default SocialNetworks;
