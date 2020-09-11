import moment from 'moment';
import i18next from 'i18next';

i18next.init({
    interpolation: { escapeValue: false }, // React already does escaping
    keySeparator: false,
    lng: 'ru', // language to use
});

i18next.on('languageChanged', function(lng) {
    import(`../../public/lang/translations.${lng.toLowerCase()}`)
        .then(json => {
            i18next.addResources(lng, "common", json);
        });

    import(`moment/locale/${lng.toLowerCase()}`).then(localization => moment.locale(lng.toLowerCase(), localization));
});

export { i18next };