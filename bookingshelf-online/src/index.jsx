import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import 'whatwg-fetch';

import {store} from './_helpers';
import {App} from './App';

import i18next from "i18next";
import {I18nextProvider} from "react-i18next";

import common_ru from "../public/lang/translations.ru";
import common_pl from "../public/lang/translations.pl";

i18next.init({
    interpolation: { escapeValue: false },  // React already does escaping
    lng: 'pl',                              // language to use
    resources: {
        ru: {
            common: common_ru               // 'common' is our custom namespace
        },
        pl: {
            common: common_pl
        },
    },
});

render(
    <I18nextProvider i18n={i18next}>
        <Provider store={store}>
            <App/>
        </Provider>
    </I18nextProvider>,
    document.getElementById('app')
);