import React from 'react';

const PayrollContext = React.createContext();

export const PayrollProvider = PayrollContext.Provider;
export const PayrollConsumer = PayrollContext.Consumer;

export default PayrollContext;
