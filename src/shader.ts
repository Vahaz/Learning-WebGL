import { showError } from "./function";

/**
 * @param url Path to image file
 * @returns Return an image
 * @async
 */
export async function getImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
        const image = new Image();
        image.src = url;
        image.onload = () => resolve(image);
    })
}

/**
 * @description Get shaders source code
 * @param url Path to shader file
 * @returns Return text
 * @async
 */
export async function getShaderSource(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error ${response.statusText} while loading shader code at "${url}"`);
    }
    return response.text();
}

/**
 * @description Create a WebGL program and link the vertex and fragment shader source code to it.
 * @param gl WebGL Rendering Context
 * @param vertexShaderSrc Vertex Shader Source Code
 * @param fragmentShaderSrc Fragment Shader Source Code
 * @returns Return WebGL program
 */
export function createProgram(
    gl: WebGL2RenderingContext,
    vertexShaderSrc: string,
    fragmentShaderSrc: string
): WebGLProgram {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
    const program = gl.createProgram();

    gl.shaderSource(vertexShader, vertexShaderSrc);
    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(vertexShader);
        showError(error || "No shader debug log provided.");
        return 0;
    }

    gl.shaderSource(fragmentShader, fragmentShaderSrc);
    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(fragmentShader);
        showError(error || "No shader debug log provided.");
        return 0;
    }

    // Program set up for Uniforms.
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const error = gl.getProgramInfoLog(program);
        showError(error || "No program debug log provided.");
        return 0;
    }
    return program;
}

/**
 * Create a WebGL texture and bind it to a TEXTURE_2D_ARRAY.
 * Set the parameters for the texture storage. (Target, Mipmap_Levels, Internal_Format, Width, Height, Images_Count)
 * Flip the origin point of WebGL. (PNG format starts at the top and WebGL at the bottom)
 * Because texSubImage3D is async, waiting for each image to load is slow. So, we preload all images using a Promise.
 * Set the parameters on how to store each texture. (Target, Mipmap_Level, Internal_Format, Width, Height, Depth, Border, Format, Type, Offset)
 * Change the minimum and magnitude filters when scaling up and down textures.
 * @param gl WebGL Rendering Context
 * @param textures texture list
 * @async
 */
export async function loadTexture(gl: WebGL2RenderingContext, textures: string[]) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
    gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.RGBA8, 128, 128, textures.length);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const images = await Promise.all(textures.map(src => getImage(src)));
    for (let i = 0; i < images.length; i++) {
        gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, i, 128, 128, 1, gl.RGBA, gl.UNSIGNED_BYTE, images[i]);
    }

    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}
