import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import 'whatwg-fetch';

import { store } from './_helpers';
import { App } from './App';

import { I18nextProvider } from "react-i18next";
import { i18next } from "./_helpers/i18n";


render(
    <I18nextProvider i18n={i18next}>
        <Provider store={store}>
            <App/>
        </Provider>
    </I18nextProvider>,
    document.getElementById('app')
);
