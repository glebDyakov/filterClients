import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { store } from './_helpers';
import App from './App';

import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';

import common_ru from '../public/lang/translations.ru';
import common_pl from '../public/lang/translations.pl';
import common_ua from '../public/lang/translations.ua';
import common_en from '../public/lang/translations.en';

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  keySeparator: false,
  lng: 'ru', // language to use
  resources: {
    RU: {
      common: common_ru, // 'common' is our custom namespace
    },
    PL: {
      common: common_pl,
    },
    EN: {
      common: common_en,
    },
    UA: {
      common: common_ua,
    },
  },
});

render(
  <I18nextProvider i18n={i18next}>
    <Provider store={store}>
      <App/>
    </Provider>
  </I18nextProvider>,
  document.getElementById('app'),
);
