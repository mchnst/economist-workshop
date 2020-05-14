// libs
import MobileDetect from 'mobile-detect';


export default
{
    _detect : new MobileDetect(window.navigator.userAgent),

    // --

    touch()
    {
        this.touch = this._touch;

                  return this._TOUCH = this._detect.mobile();
    }, _touch() { return this._TOUCH; },

    phone()
    {
        this.phone = this._phone;

                  return this._PHONE = this._detect.phone();
    }, _phone() { return this._PHONE; },

    tablet()
    {
        this.tablet = this._tablet;

                   return this._TABLET = this._detect.tablet();
    }, _tablet() { return this._TABLET; }
};