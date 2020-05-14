// core
import App from 'core/app';


// SETUP -----------------------------------------------------------------------

const _app = new App();

// --

window.onload = () =>
{
    _app.setup();
    _app.resize();

    window.onresize            = resize;
    window.onorientationchange = resize;
    window.onscroll            = scroll;

    window.requestAnimationFrame(update);
};


// WINDOW ----------------------------------------------------------------------

const resize = () =>
{
    _app.resize();
};

const scroll = () =>
{
    _app.scroll();
};


// UPDATE ----------------------------------------------------------------------

const update = () =>
{
    _app.update();
    window.requestAnimationFrame(update);
};