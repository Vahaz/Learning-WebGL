#version 300 es
precision mediump float;
precision mediump sampler2DArray;

in vec2 vUV;
in float vDepth;
in float vBrightness;

uniform sampler2DArray uSampler;

out vec4 fragColor;

void main() {
    vec4 texture = texture(uSampler, vec3(vUV, vDepth));
    fragColor = (texture * .4) + (texture * vBrightness * .6);
    fragColor.a = 1.0;
}
