import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const Index = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      <Redirect to={{ pathname: '/calendar/staff/'+props.match.params.id+'/'+
          props.match.params.date, state: { from: props.location } }}
      />
    )}
  />
);
export default Index;
