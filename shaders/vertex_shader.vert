#version 300 es
precision mediump float;

layout(location=0) in vec3 aVertexPosition;
layout(location=1) in vec2 aUV;
layout(location=2) in float aDepth;
layout(location=3) in vec3 aNormal;

out vec2 vUV;
out float vDepth;
out float vBrightness;
out vec3 vNormal;

uniform mat4 uMatWorld;
uniform mat4 uMatViewProj;
uniform vec3 uLightDirection;
uniform mat3 uMatNormal;

void main() {
    vBrightness = max(dot(uLightDirection, normalize(mat3(uMatWorld) * aNormal)), 0.0);
    vUV = aUV;
    vDepth = aDepth;
    vNormal = normalize(uMatNormal * aNormal);
    gl_Position = uMatViewProj * uMatWorld * vec4(aVertexPosition, 1.0);
}
