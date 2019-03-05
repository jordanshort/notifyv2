import eventManager from './eventManager';
import { POSITION, TYPE, ACTION } from './constant';

let container = null;
let queue = [];
const noop = () => false;

//Merge provided options with the default options and generate note id
function mergeOptions(options, type){
    return { ...options, type, noteId: getNoteId(options) };
}

//generate random note id
function generateNoteId(){
    return (Math.random().toString(36) + Date.now().toString(36)).substring(2, 10);
}

//if note id is provided when notify is called, use that otherwise generate a note id
function getNoteId(options){
    if (options && typeof options.noteId === 'string' || (options && typeof options.noteId === 'number' && !NaN(options.noteId))){
        return options.noteId;
    }

    return generateNoteId();
}

//dispatch the note, if the container is not mounted yet, it is queued
function emitEvent(content, options){
    if (container !== null){
        eventManager.emit(ACTION.SHOW, content, options);
    } else {
        queue.push({action: ACTION.SHOW, content, options});
    }

    return options.noteId;
}

const notify = Object.assign(
    (content, options) => emitEvent(content, mergeOptions(options, (options && options.type) || TYPE.INFO)),
    {
        success: (content, options) => emitEvent(content, mergeOptions(options, TYPE.SUCCESS)),
        alert: (content, options) => emitEvent(content, mergeOptions(options, TYPE.ALERT)),
        info: (content, options) => emitEvent(content, mergeOptions(options, TYPE.INFO)),
        warning: (content, options) => emitEvent(content, mergeOptions(options, TYPE.WARNING)),
        dismiss: (id = null) => container && eventManager.emit(ACTION.CLEAR, id),
        isActive: noop,
        update(noteId, options){
            setTimeout(() => {
                if (container && typeof container.collection[noteId] !== 'undefined'){
                    const {
                        options: oldOptions,
                        content: oldContent
                    } = container.collection[noteId];

                    const nextOptions = {
                        ...oldOptions,
                        ...options,
                        noteId: options.noteId || noteId
                    };

                    if (!options.noteId || options.noteId === noteId){
                        nextOptions.updateId = generateNoteId();
                    } else {
                        nextOptions.stateNoteId = noteId;
                    }

                    const content = 
                    typeof nextOptions.render !== 'undefined'
                        ? nextOptions.render
                        : oldContent;
                    delete nextOptions.render;
                    emitEvent(content, nextOptions);
                }
            }, 0);
        },
        onChange(callback){
            if (typeof callback === 'function'){
                eventManager.on(ACTION.ON_CHANGE, callback);
            }
        },
        POSITION,
        TYPE
    }
);

eventManager
    .on(ACTION.DID_MOUNT, containerInstance => {
        container = containerInstance;
        notify.isActive = id => container.isNoteActive(id);

        queue.forEach(item => {
            eventManager.emit(item.action, item.content, item.options);
        });

        queue = [];
    })
    .on(ACTION.WILL_UNMOUNT, () => {
        container = null;
        notify.isActive = noop;
    });

export default notify;

