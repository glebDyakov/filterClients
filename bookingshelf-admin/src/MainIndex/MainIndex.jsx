import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const MainIndex = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        <Redirect to={{ pathname: '/calendar', state: { from: props.location } }} />
    )} />
)