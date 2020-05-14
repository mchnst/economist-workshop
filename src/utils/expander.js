export default class Expander
{
    constructor( element )
    {
        this._expander           = document.createElement('div');
        this._expander.classList = 'expander';

        element.appendChild(this._expander);
    }

    expand( height )
    {
        this._expander.style.height = height + 'px';
    }
}