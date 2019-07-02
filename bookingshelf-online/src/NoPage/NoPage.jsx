import React from 'react';


export class NoPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="page404">
                <div className="container">
                    <span className="red_center_text">404</span>
                    <p className="title">Такой страницы не существует</p>
                    <a className="button" href="/">перейти на главную</a>
                    <div className="clear"></div>
                </div>
            </div>
        );
    }

}
