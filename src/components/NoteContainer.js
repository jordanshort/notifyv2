import React, { Component, isValidElement, cloneElement } from 'react';
import eventManager from '../scripts/helpers/eventManager';
import { POSITION, ACTION } from '../scripts/helpers/constant';
import { Bounce } from './Transition';
import Note from './Note';
import cx from 'classnames';
import TransitionGroup from 'react-transition-group/TransitionGroup';


export default class NoteContainer extends Component{

    static defaultProps = {
        position: POSITION.TOP_RIGHT,
        transition: Bounce,
        className: null,
    }

    // Hold note id's
    state = {
        notes: [] 
    };

    noteKey = 1;

    // Hold note's information:
    collection = {};

    componentDidMount(){
        eventManager
            .on(ACTION.SHOW, (content, options) => this.show(content, options))
            .on(ACTION.CLEAR, id => (!id ? this.clear() : this.removeNote(id)))
            .emit(ACTION.DID_MOUNT, this);
    }

    componentWillUnmount(){
        eventManager
            .off(ACTION.SHOW)
            .off(ACTION.CLEAR)
            .emit(ACTION.WILL_UNMOUNT);
    }

    isNoteActive = id => this.state.notes.indexOf(id) !== -1;

    removeNote(id){
        this.setState({ notes: this.state.notes.filter(n => n !== id)}, this.dispatchChange);
    }

    dispatchChange(){
        eventManager.emit(ACTION.ON_CHANGE, this.state.notes.length);
    }

    show(content, options){
        const noteId = options.noteId;
        const closeNote = () => this.removeNote(noteId);
        const noteOptions = {
            id: noteId,
            key: options.key || this.noteKey++,
            type: options.type,
            closeNote: closeNote,
            updateId: options.updateId,
            position: options.position || this.props.position,
            transition: options.transition || this.props.transition,
            className: options.className || this.props.noteClassName,
        };

        if (isValidElement(content) && typeof content.type !== 'string' && typeof content.type !== 'number'){
            content = cloneElement(content, { closeNote });
        } else if (typeof content === 'function'){
            content = content({ closeNote });
        }

        this.collection = {
            ...this.collection,
            [noteId]: {
                position: noteOptions.position,
                options: noteOptions,
                content: content
            }
        };

        this.setState({
            notes: (noteOptions.updateId 
                ? [...this.state.notes]
                : [...this.state.notes, noteId]
            ).filter(id => id !== options.staleNoteId)
        },
        this.dispatchChange);
    }

    makeNote(content, options){
        return(
            <Note {...options} key={`note-${options.key}`}>{content}</Note>
        )
    }

    renderNotes(){
        const notesToRender = {};
        //creating array of collection property names
        const collection = Object.keys(this.collection);

        //group by note position
        collection.forEach(noteId => {
            const { position, options, content } = this.collection[noteId];
            notesToRender[position] || (notesToRender[position] = []);

            if (this.state.notes.indexOf(options.id) !== -1){
                notesToRender[position].push(this.makeNote(content, options));
            } else {
                notesToRender[position].push(null);
                delete this.collection[noteId];
            }
        });

        return Object.keys(notesToRender).map(position => {
            //TO DO: determine classNames and how they'll get here
            const props = {
                className: cx(
                    'notify-container',
                    `container-${position}`
                )
            };

            return (
                <div {...props} key={`container-${position}`}>
                    {notesToRender[position]}
                </div>
            );
        });
    }

    render(){
        return(
            <div>{this.renderNotes()}</div>
        )
    }
}