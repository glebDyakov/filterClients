import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PublicRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        !localStorage.getItem('user')
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/calendar', state: { from: props.location } }} />
    )} />
)