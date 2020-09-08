import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ruTranslate from "../../public/lang/translations.ru";

i18n
    .use(initReactI18next)
    .init({
        // we init with resources
        resources: {
            en: {
                translations: {
                    "Добавление в черный список": "Add to black list",
                    "Поиск по имени, номеру тел., имейлу": "Search by name, phone, email..",
                    "Сохранить": "Save"
                }
            },
            ru: {
                translations: {
                    ...ruTranslate
                }
            }
        },
        fallbackLng: "en",
        debug: true,

        // have a common namespace used around the full app
        ns: ["translations"],
        defaultNS: "translations",

        keySeparator: false, // we use content as keys

        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
