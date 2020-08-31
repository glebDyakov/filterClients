import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, wrapped, ...rest }) => (
  <Route {...rest} render={(props) => {
    if (!localStorage.getItem('user')) {
      return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
    }

    return wrapped
      ? (
        <div className={'container_wrapper '+(localStorage.getItem('collapse')=='true'&&' content-collapse')}>
          <div className={'content-wrapper  full-container '+(localStorage.getItem('collapse')=='true'&&' content-collapse')}>
            <div className="container-fluid">
              <Component {...props} />
            </div>
          </div>
        </div>)
      : <Component {...props} />;
  }} />
);

export const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={(props) => (
      !localStorage.getItem('user')
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/calendar', state: { from: props.location } }} />
    )} />
  );
};
