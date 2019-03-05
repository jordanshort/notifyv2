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
        //TO DO: assign classNames after creating them
        const noteProps = {
            className: cx()
        }
        return(
            <Transition
                in={this.props.in}
                unmountOnExit
                position={position}
                preventExitTransition={this.state.preventExitTransition}
            >
                <div {...noteProps}>
                    <div>
                        {children}
                    </div>
                    <div>
                        <button type="button" onClick={closeNote}>X</button>
                    </div>
                </div>

            </Transition>
        )
    }
}

