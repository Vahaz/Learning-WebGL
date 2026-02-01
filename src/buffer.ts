import { showError } from "./function";
import { GLTF } from "./model";

/**
 * Create a WebGL Buffer type. (Opaque Handle)
 * - STATIC_DRAW : won't update often, but often used.
 * - ARRAY_BUFFER : indicate the place to store the Array.
 * - ELEMENT_ARRAY_BUFFER : Used for indices with cube shape drawing.
 * Bind the Buffer to the CPU, add the Array to the Buffer and Clear after use.
 * @param gl - WebGL Rendering Context
 * @param data - Buffers
 * @param isIndice - Vertices or Indices ?
 * @returns buffer
 */
export function createStaticBuffer(
    gl: WebGL2RenderingContext,
    data: any,
    isIndice: boolean
): WebGLBuffer {
    const buffer = gl.createBuffer();
    const type = (isIndice == true) ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER
    if(!buffer) {
        showError("Failed to allocate buffer space");
        return 0;
    }

    gl.bindBuffer(type, buffer);
    gl.bufferData(type, data, gl.STATIC_DRAW);
    gl.bindBuffer(type, null);
    return buffer
}

/**
 * Create vertex array object buffers, it reads the vertices from GPU Buffer.
 * The vertex buffer contains the vertices' coordinates (can also contain color and size).
 * The index buffer contains which vertex needs to be drawn on scene to avoid duplicate vertices.
 * In case of colors, an offset of 3 floats is used each time to avoid (x, y, z) coordinates.
 * The vertex shader places the vertices in clip space and the fragment shader colors the pixels. (Default: 0)
 * VertexAttribPointer [Index, Size, Type, IsNormalized, Stride, Offset]
 * - Index (location)
 * - Size (Component per vector)
 * - Type
 * - IsNormalized (int to floats, for colors transform [0, 255] to float [0, 1])
 * - Stride (Distance between each vertex in the buffer)
 * - Offset (Number of skiped bytes before reading attributes)
 * @param gl - WebGL Rendering Context
 * @param vertexBuffer - vertices buffer
 * @param indexBuffer - indexes buffer
 * @param uvBuffer - UV buffer
 * @param normalBuffer - Normal buffer
 * @param posAttrib - Position attributes
 * @param uvAttrib - UV attributes
 * @param normalAttrib - Normals attributes
 * @returns Vertex Array Object (VAO)
 */
export function createVAOBuffer(
    gl: WebGL2RenderingContext,
    vertexBuffer: WebGLBuffer,
    indexBuffer: WebGLBuffer,
    uvBuffer: WebGLBuffer,
    normalBuffer: WebGLBuffer,
    posAttrib: number,
    uvAttrib: number,
    normalAttrib: number
): WebGLVertexArrayObject {
    const vao = gl.createVertexArray();
    if(!vao) { showError("Failed to allocate VAO buffer."); return 0; }
    gl.bindVertexArray(vao);

    // 1. Position, format: (x, y, z) (all f32)
    gl.enableVertexAttribArray(posAttrib);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);

    // 2. Normals
    gl.enableVertexAttribArray(normalAttrib);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
    gl.vertexAttribPointer(normalAttrib, 3, gl.FLOAT, false, 0, 0);

    // 3. UVs
    gl.enableVertexAttribArray(uvAttrib);
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.vertexAttribPointer(uvAttrib, 2, gl.FLOAT, false, 0, 0);


    // 4. Indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return vao;
}

const SIZES: { [key: string]: number } = {SCALAR: 1, VEC2: 2, VEC3: 3};
/**
 * get correct buffer
 * @param gltf params
 * @param bin params
 * @param id id
 * @returns array
 */
export function getBuffer(gltf: GLTF, bin: ArrayBuffer, id: number) {
    const accessors = gltf.accessors[id];
    const bufferViews = gltf.bufferViews[accessors.bufferView];
    const offset = (bufferViews.byteOffset || 0) + (accessors.byteOffset || 0);
    const length = accessors.count * SIZES[accessors.type];

    if (accessors.componentType === 5126) return new Float32Array(bin, offset, length);
    if (accessors.componentType === 5123) return new Uint16Array(bin, offset, length);
    if (accessors.componentType === 5125) return new Uint32Array(bin, offset, length);
    return new Float32Array();
}
