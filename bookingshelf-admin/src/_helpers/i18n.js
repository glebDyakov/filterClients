import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next)
    .init({
        resources: {
            ru: {
                translations: {
                    "Имя": "Имя",
                    "Начало": "Начало"

                }
            },
            en: {
                translations: {
                    "Имя": "Name",
                    "Начало": "Start"

                }
            }
        },
        fallbackLng: "ru",
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
