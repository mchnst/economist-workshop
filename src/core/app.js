// core
import ENV from 'core/env';

// utils
import Expander from 'utils/expander';
import { init2D, resize2D } from 'utils/canvas';

// libs
import { TweenLite } from 'gsap';


export default class App
{

    // SETUP -------------------------------------------------------------------

    constructor()
    {
        this._width      = 0.0;
        this._height     = 0.0;

        this._pixelRatio = 0.0;

        // --

        this._mouseX     = 0.0;
        this._mouseY     = 0.0;
    }

    setup()
    {
        this._element = document.getElementById('app');

        // set up scroll
        this._expander = new Expander(this._element);
        this._expander.expand(10000.0);

        // set up canvas
        this._context = init2D();
        this._element.querySelector('.background').appendChild(this._context.canvas);

        // set up events
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
        this._width       = document.body.clientWidth;
        this._height      = window.innerHeight;

        this._pixelRatio  = window.devicePixelRatio;


        // resize other values ...


        // resize canvas
        resize2D(this._context, this._width, this._height, 2.0);

        // scroll
        this._totalScroll = 10000.0 - this._height;
        this.scroll();
    }

    scroll()
    {
        this._scroll = window.pageYOffset / this._totalScroll;
        console.log('Scroll:', this._scroll);
    }


    // UPDATE ------------------------------------------------------------------

    update()
    {
        this._render();
    }

    _render()
    {
        // render ...
    }


    // INTERACTION -------------------------------------------------------------

    _move( x, y )
    {
        this._mouseX = x;
        this._mouseY = y;
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