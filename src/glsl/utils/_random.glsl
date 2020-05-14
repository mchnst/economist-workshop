highp float random( vec2 position )
{
    highp float a  = 12.9898;
    highp float b  = 78.233;
    highp float c  = 43758.5453;
    highp float dt = dot(position.xy, vec2(a, b));
    highp float sn = mod(dt, 3.14);

    return fract(sin(sn) * c);
}

#pragma glslify: export(random)