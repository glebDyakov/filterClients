import React from 'react';

const StaffSidebarContext = React.createContext();

export const StaffSidebarProvider = StaffSidebarContext.Provider;
export const StaffSidebarConsumer = StaffSidebarContext.Consumer;

export default StaffSidebarContext;
