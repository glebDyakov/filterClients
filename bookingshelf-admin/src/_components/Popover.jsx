import React from 'react';

class Popover extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            opened: false
        };

        this.toggleDropdown = this.toggleDropdown.bind(this);
    }

    toggleDropdown() {
        this.setState({ opened: !this.state.opened})
    }

    render() {
        const { props: { minWidth, ...rest} } = this.props;
        const { opened } = this.state;

        return (
            <span style={{ position: 'relative' }} className="questions_black" onMouseEnter={this.toggleDropdown} onMouseLeave={this.toggleDropdown} {...rest}>
                {opened && (
                    <span
                        style={{ color: 'black', padding: '2px 4px', textAlign: 'center', minWidth }}
                        className="questions_dropdown">
                        {rest && rest.title}
                    </span>
                )}
            </span>
        );
    }
}

export default Popover
