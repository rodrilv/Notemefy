import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import * as enL from "./en.json";
import * as esL from "./es.json";


i18n.use(initReactI18next).use(LanguageDetector).init({
    resources: {
        en: {
            translation: enL,
        },
        es: {
            translation: esL, 
        }
    },
    //lng: ``,
    fallbackLng: "es",
    interpolation: {
        escapeValue: false,
    }
});

export default i18n;