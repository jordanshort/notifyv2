import cssTransition from '../scripts/helpers/cssTransition';

const Bounce = cssTransition({
    enter: '',
    exit: '',
    appendPosition: true
});

const Slide = cssTransition({
    enter: '',
    exit: '',
    duration: [450, 750],
    appendPosition: true
});

const Zoom = cssTransition({
    enter: '',
    exit: '',
});

const Flip = cssTransition({
    enter: '',
    exit: ''
})

export { Bounce, Slide, Zoom, Flip };