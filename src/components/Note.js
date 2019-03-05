import React, { Component } from 'react';
// import Transition from './Transition';
import { POSITION, TYPE } from '../scripts/helpers/constant';
import cx from 'classnames';

const noop = () => {};

export default class Note extends Component {
    static defaultProps = {
        type: TYPE.INFO,
        in: true,
        onOpen: noop,
        onClose: noop,
        className: null,
        updateId: null,
        role: 'alert',
        
    };

    state = {
        isRunning: true,
        preventExitTransition: false
    };

    ref = null;

    componentDidMount(){
        this.props.onOpen(this.props.children.props);
    }

    componentWillUnmount(){
        this.props.onClose(this.props.children.props);
    }

    render(){
        const { children, transition: Transition, type, closeNote, position, className, updateId, role } = this.props;
        const noteProps = {
            className: cx(
                'note-general',
                `note-${type}`
            )
        }
        return(
            <div className="note-bounceInRight">
                <div {...noteProps}>
                    <div className={cx('note-body', `note-body-${type}`)}>
                        {children}
                    </div>
                    <div className={cx('note-btn', `note-btn-${type}`)}>
                        <div className="close-btn" onClick={closeNote}>Close</div>
                    </div>
                </div>

            </div>
        )
    }
}

