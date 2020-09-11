import moment from 'moment';
import i18next from 'i18next';


const switchLang = (lng) => {
  switch (lng) {
    case 'UA':
      return 'uk';
    case 'EN':
      return 'en-gb';
    default:
      return lng.toLowerCase();
  }
};


i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  keySeparator: false,
  lng: 'ru',
});

i18next.on('languageChanged', function(lng) {
  import(`../../public/lang/translations.${lng.toLowerCase()}`)
    .then((json) => {
      i18next.addResources(lng, 'common', json);
    });

  import(`moment/locale/${switchLang(lng)}`).then((localization) => {
    moment.locale(switchLang(lng), localization);
  });
});


export { i18next };
