import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const CalendarPrePage = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        <Redirect to={{ pathname: '/calendar/staff/'+props.match.params.id+"/"+props.match.params.date, state: { from: props.location } }} />
    )} />
)