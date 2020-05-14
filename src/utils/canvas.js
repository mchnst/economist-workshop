export function init2D( canvas = document.createElement('canvas') )
{
    return canvas.getContext('2d');
}

// --

export function resize2D( context, width, height, maxDPI = 1.0, minDPI = 1.0 )
{
    const dpi = Math.min(Math.max(minDPI, window.devicePixelRatio || 1.0), maxDPI);

    // --

    const canvas = context.canvas;

          canvas.width  = width  * dpi;
          canvas.height = height * dpi;

          canvas.style.width  = width  + 'px';
          canvas.style.height = height + 'px';

    // --

    context.scale(dpi, dpi);

    // --

    return context;
}