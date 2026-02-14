import { vec3 } from "./vec3"
import { quat } from "./quat"
import { mat4 } from "./mat4"
import { showError } from "./function"
import { getBuffer } from "./buffer"

export interface GLTF {
    meshes: {
        name: string,
        primitives: {
            attributes: { [key: string]: number },
            indices?: number
        }[]
    }[],
    accessors: {
        bufferView: number,
        byteOffset?: number
        componentType: number,
        count: number,
        type: string
    }[],
    bufferViews: {
        buffer: number,
        byteLength: number,
        byteOffset: number
    }[],
    buffers: {
        byteLength: number,
        uri: string
    }[]
}

export interface ModelData {
    name: string,
    vertices: Float32Array,
    normals: Float32Array,
    uvs: Float32Array,
    indices: Uint16Array | Uint32Array
}

export class Model {
    private matWorld = new mat4();
    private scaleVec = new vec3();
    private rotation = new quat();

    constructor(
        private pos: vec3,
        public scale: number,
        private rotationAxis: vec3,
        private rotationAngle: number,
        public readonly vao: WebGLVertexArrayObject,
        public readonly numIndices: number
    ) { }

    rotate(angle: number) {
        this.rotationAngle = this.rotationAngle + angle;
    }

    draw(gl: WebGL2RenderingContext, matWorldUniform: WebGLUniformLocation) {
        this.rotation.setAxisAngle(this.rotationAxis, this.rotationAngle);
        this.scaleVec.set(this.scale, this.scale, this.scale);

        this.matWorld.setFromRotationTranslationScale(this.rotation, this.pos, this.scaleVec);

        gl.uniformMatrix4fv(matWorldUniform, false, this.matWorld.mat);
        gl.bindVertexArray(this.vao);
        gl.drawElements(gl.TRIANGLES, this.numIndices, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }
}
/**
 * Load models and return buffers
 * @param url_gltf path to .gltf file
 * @param url_bin path to .bin file
 * @returns buffers
 */
export async function loadModel(url_gltf: string, url_bin: string): Promise<ModelData[]> {
    const gltf: GLTF = await fetch(url_gltf).then((response) => {
        if (!response.ok) {
            showError(response.statusText);
            throw new Error(response.statusText);
        }
        return response.json();
    });
    const bin: ArrayBuffer = await fetch(url_bin).then((response) => {
        if (!response.ok) {
            showError(response.statusText);
            throw new Error(response.statusText);
        }
        return response.arrayBuffer();
    });

    const models: ModelData[] = [];

    for (let mesh of gltf.meshes) {
        let name = mesh.name;
        for (let prim of mesh.primitives) {
            const data: ModelData = {
                name: name,
                vertices: getBuffer(gltf, bin, prim.attributes.POSITION) as Float32Array,
                normals: getBuffer(gltf, bin, prim.attributes.NORMAL) as Float32Array,
                uvs: getBuffer(gltf, bin, prim.attributes.TEXCOORD_0) as Float32Array,
                indices: getBuffer(gltf, bin, prim.indices!) as Uint16Array
            }
            models.push(data);
        }
    }

    return models;
}
