import moment from 'moment';
import i18next from 'i18next';
import {store} from './store';
import {userConstants} from "../_constants";


const switchLang = (lng) => {
    switch (lng) {
        case 'EN':
            return 'en-gb';
        default:
            return lng.toLowerCase();
    }
};

const switchWindowLang = (lng) => {
    switch (lng) {
        case "uk":
        case 'uk-ua':
            return 'UK';
        case "ru":
        case "ru-ru":
            return 'RU';
        case "pl":
        case "pl-pl":
            return "PL";
        default:
            return "EN";
    }
};

const lang = localStorage.getItem("language") || switchWindowLang(window.navigator.language.toLowerCase()) || "en";

i18next.init({
    interpolation: {escapeValue: false}, // React already does escaping
    keySeparator: false,
    fallbackLng: "en",
    lng: lang,
});

console.log(window.navigator.language)

import(`moment/locale/${switchLang(lang)}`).then((localization) => {
    moment.locale(switchLang(lang), localization);
    store.dispatch({type: userConstants.UPDATE_LANG, lang: lang.toLowerCase()});
});

i18next.on('languageChanged', function (lng) {
    localStorage.setItem("language", lng);
    import(`../../public/lang/translations.${lng.toLowerCase()}`)
        .then((json) => {
            i18next.addResources(lng, 'common', json);
            store.dispatch({type: userConstants.UPDATE_LANG, lang: lng.toLowerCase()});
        });
    import(`moment/locale/${switchLang(lng)}`).then((localization) => {
        moment.locale(switchLang(lng), localization);
        store.dispatch({type: userConstants.UPDATE_LANG, lang: lng.toLowerCase()});
    });
});

export {i18next};
