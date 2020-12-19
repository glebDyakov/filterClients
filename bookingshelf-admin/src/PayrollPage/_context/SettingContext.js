import React from 'react';

const SettingContext = React.createContext();

export const SettingProvider = SettingContext.Provider;
export const SettingConsumer = SettingContext.Consumer;

export default SettingContext;
