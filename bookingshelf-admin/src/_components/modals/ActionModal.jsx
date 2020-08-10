import React, {Component} from 'react';

class ActionModal extends Component {
    constructor(props) {
        super(props);

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.onClickOutside = this.onClickOutside.bind(this);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    onClickOutside() {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            console.log(event.target)
            const {closeHandler} = this.props;
            closeHandler();
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.onClickOutside, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.onClickOutside, false);
    }


    render() {
        const {title, closeHandler, buttons} = this.props;

        return (
            <span className="action-modal-wrapper">
                <span ref={this.setWrapperRef} className="action-modal">
                    <span className="modal-content">
                        <span className="modal-header">
                            <h4 className="modal-title">{title}</h4>
                            <button onClick={closeHandler} type="button" className="close" data-dismiss="modal" />
                        </span>
                        <span className="modal-body">
                            <span className="form-group">
                                {buttons && buttons.length > 0 && buttons.map(item => {
                                    const {handler, params, innerText, className, additionalHandler, additionalParam} = item;
                                    return (
                                        <button type="button" className={className} onClick={() => {

                                            handler((params ? params : null), (additionalParam ? additionalParam : null));
                                            if (additionalHandler) {
                                                additionalHandler();
                                            }
                                        }}>{innerText}</button>
                                    )
                                })}
                            </span>
                        </span>
                    </span>
                </span>
            </span>
        );
    }
}

export default ActionModal;