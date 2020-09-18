import i18next from "i18next";
import moment from "moment";
import {store} from "./store";

import common_ru from "../../public/lang/translations.ru";
import common_pl from "../../public/lang/translations.pl";
import common_ua from "../../public/lang/translations.uk";
import common_en from "../../public/lang/translations.en";
import {staffConstants} from "../_constants";

const localStorageLanguage = localStorage.getItem("lang");

const switchWindowLang = (lng) => {
    switch (lng) {
        case 'uk-ua':
            return 'UK';
        case "ru":
            return 'RU';
        case "pl":
            return "PL";
        default:
            return "EN";
    }
};

const switchLang = (lng) => {
    switch (lng) {
        case 'EN':
            return 'en-gb';
        default:
            return lng.toLowerCase();
    }
};

i18next.init({
    interpolation: { escapeValue: false },  // React already does escaping
    lng: localStorageLanguage ? localStorageLanguage : switchWindowLang(window.navigator.language) || 'en',                              // language to use
    keySeparator: false,
    resources: {
        ru: {
            common: common_ru               // 'common' is our custom namespace
        },
        pl: {
            common: common_pl
        },
        en: {
            common: common_en
        },
        uk: {
            common: common_ua
        }
    },
});

i18next.on('languageChanged', function(lng) {
    localStorage.setItem("lang", lng);
    import(`../../public/lang/translations.${lng.toLowerCase()}`)
        .then((json) => {
            i18next.addResources(lng, 'common', json);
            store.dispatch({type: staffConstants.CHANGE_LANG, lang: lng.toLowerCase()});
        });
    import(`moment/locale/${switchLang(lng)}`).then((localization) => {
        moment.locale(switchLang(lng), localization);
        store.dispatch({type: staffConstants.CHANGE_LANG, lang: lng.toLowerCase()});
    });
});

export { i18next };
