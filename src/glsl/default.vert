precision highp float;

// --

varying vec2 _uv;

// --

void main( void )
{
    _uv         = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}