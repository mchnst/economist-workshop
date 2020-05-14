// core
import ENV from 'core/env';


export default class App
{

    // SETUP -------------------------------------------------------------------

    constructor()
    {
        this._width      = 0.0;
        this._height     = 0.0;

        this._pixelRatio = 0.0;
    }

    setup()
    {
        this._element = document.getElementById('app');
        this._setupEvents();
    }

    _setupEvents()
    {
        if (ENV.touch())
        {
            this._element.addEventListener('touchstart', e => this._onTouchStart(e));
                 document.addEventListener('touchend',   e => this._onTouchEnd(e));
                 document.addEventListener('touchmove',  e => this._onTouchMove(e));

        } else {

            this._element.addEventListener('mousedown',  e => this._onMouseDown(e));
                 document.addEventListener('mouseup',    e => this._onMouseUp(e));
                 document.addEventListener('mousemove',  e => this._onMouseMove(e));
                 document.addEventListener('keydown',    e => this._onKeyDown(e));
                 document.addEventListener('keyup',      e => this._onKeyUp(e));
        }
    }


    // WINDOW ------------------------------------------------------------------

    resize()
    {
        this._width      = document.body.clientWidth;
        this._height     = window.innerHeight;

        this._pixelRatio = window.devicePixelRatio;
    }

    scroll() {}


    // UPDATE ------------------------------------------------------------------

    update()
    {

    }


    // INTERACTION -------------------------------------------------------------

    _move( x, y )
    {

    }

    _down( x, y )
    {
        this._move(x, y);
        //
    }

    _up() {}

    // --

    _onMouseMove( e )
    {
        e.preventDefault();
        this._move(e.clientX, e.clientY);
    }

    _onMouseDown( e )
    {
        e.preventDefault();
        this._down(e.clientX, e.clientY);
    }

    _onMouseUp( e )
    {
        e.preventDefault();
        this._up();
    }

    // --

    _onTouchMove( e )
    {
        this._move(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }

    _onTouchStart( e )
    {
        this._down(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }

    _onTouchEnd( e )
    {
        this._up();
    }

    // --

    _onKeyDown( e ) {}
    _onKeyUp( e ) {}
}