/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/buffer.ts":
/*!***********************!*\
  !*** ./src/buffer.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createStaticBuffer = createStaticBuffer;
exports.createVAOBuffer = createVAOBuffer;
exports.getBuffer = getBuffer;
const function_1 = __webpack_require__(/*! ./function */ "./src/function.ts");
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
function createStaticBuffer(gl, data, isIndice) {
    const buffer = gl.createBuffer();
    const type = (isIndice == true) ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
    if (!buffer) {
        (0, function_1.showError)("Failed to allocate buffer space");
        return 0;
    }
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, data, gl.STATIC_DRAW);
    gl.bindBuffer(type, null);
    return buffer;
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
function createVAOBuffer(gl, vertexBuffer, indexBuffer, uvBuffer, normalBuffer, posAttrib, uvAttrib, normalAttrib) {
    const vao = gl.createVertexArray();
    if (!vao) {
        (0, function_1.showError)("Failed to allocate VAO buffer.");
        return 0;
    }
    gl.bindVertexArray(vao);
    // 1. Position, format: (x, y, z) (all f32)
    gl.enableVertexAttribArray(posAttrib);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);
    // 2. Normals
    gl.enableVertexAttribArray(normalAttrib);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
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
const SIZES = { SCALAR: 1, VEC2: 2, VEC3: 3 };
/**
 * get correct buffer
 * @param gltf params
 * @param bin params
 * @param id id
 * @returns array
 */
function getBuffer(gltf, bin, id) {
    const accessors = gltf.accessors[id];
    const bufferViews = gltf.bufferViews[accessors.bufferView];
    const offset = (bufferViews.byteOffset || 0) + (accessors.byteOffset || 0);
    const length = accessors.count * SIZES[accessors.type];
    if (accessors.componentType === 5126)
        return new Float32Array(bin, offset, length);
    if (accessors.componentType === 5123)
        return new Uint16Array(bin, offset, length);
    if (accessors.componentType === 5125)
        return new Uint32Array(bin, offset, length);
    return new Float32Array();
}


/***/ }),

/***/ "./src/function.ts":
/*!*************************!*\
  !*** ./src/function.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.showError = showError;
exports.toRadian = toRadian;
/**
 * Display an error message to the HTML Element with id "error".
 * @param msg message
 */
function showError(msg = "No Data") {
    const container = document.getElementById("error");
    if (container === null)
        return console.log("No Element with ID: error");
    const element = document.createElement('p');
    element.innerText = msg;
    container.appendChild(element);
    console.log(msg);
}
/**
 * Convert from degrees to radiant
 * @param angle
 * @returns angle to radiant
 */
function toRadian(angle) {
    return angle * Math.PI / 180;
}


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tweakpane_1 = __webpack_require__(/*! ./tweakpane */ "./src/tweakpane.ts");
const vec3_1 = __webpack_require__(/*! ./vec3 */ "./src/vec3.ts");
const mat4_1 = __webpack_require__(/*! ./mat4 */ "./src/mat4.ts");
const function_1 = __webpack_require__(/*! ./function */ "./src/function.ts");
const buffer_1 = __webpack_require__(/*! ./buffer */ "./src/buffer.ts");
const shader_1 = __webpack_require__(/*! ./shader */ "./src/shader.ts");
const model_1 = __webpack_require__(/*! ./model */ "./src/model.ts");
const UP_VEC = new vec3_1.vec3(0, 1, 0);
const T0 = Date.now();
const TEXTURES = ['./img/texture.png'];
(0, tweakpane_1.init)();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Canvas Element and Rendering Context.
        const canvas = document.getElementById("webgl-canvas");
        const gl = canvas.getContext('webgl2');
        if (!gl) {
            (0, function_1.showError)("No WebGL2 Context !");
            return;
        }
        const vertexSource = yield (0, shader_1.getShaderSource)('./shaders/vertex_shader.vert');
        const fragmentSource = yield (0, shader_1.getShaderSource)('./shaders/fragment_shader.frag');
        const program = (0, shader_1.createProgram)(gl, vertexSource, fragmentSource);
        // Load all images in a Texture Array.
        (0, shader_1.loadTexture)(gl, TEXTURES);
        /* Getting all attributes from the vertex shader file.
         * Attribute locations can be forced in the vertex shader file with (location=<number>).
         * If not forced, WebGL gives them a number, you can get this number with gl.getAttribLocation(<program_name>, <attribute_name>).
         * Because we set manually the attribute location in the vertex shader,
         * we can replace gl.getAttribLocation(<program_name>, <attribute_name>) with location's number.
         */
        const aVertexPosition = 0; //can also use: gl.getAttribLocation(program, 'aVertexPosition');
        const aUV = 1; //can also use: gl.getAttribLocation(program, 'aUV');
        const aDepth = 2; //can also use: gl.getAttribLocation(program, 'aDepth');
        const aNormal = 3; //can also use: gl.getAttribLocation(program, 'aNormal');
        // We can't specify Uniforms locations manually. We need to get them using gl.getUniformLocation(<program_name>, <uniform_name>).
        const uMatWorld = gl.getUniformLocation(program, 'uMatWorld');
        const uMatView = gl.getUniformLocation(program, 'uMatViewProj');
        const uSampler = gl.getUniformLocation(program, 'uSampler');
        const uLightDirection = gl.getUniformLocation(program, 'uLightDirection');
        // Add a light direction to the world.
        let lightDirection = new vec3_1.vec3(tweakpane_1.SETTINGS.light_direction.x, tweakpane_1.SETTINGS.light_direction.y, tweakpane_1.SETTINGS.light_direction.z).normalize();
        // Typescript wants to verify if the variables are set, not the best way to do it.
        if (aVertexPosition < 0
            || aUV < 0
            || aDepth < 0
            || aNormal < 0
            || !uMatWorld
            || !uMatView
            || !uSampler
            || !uLightDirection) {
            (0, function_1.showError)(`Failed to get attribs/uniforms (Max: ${gl.getParameter(gl.MAX_VERTEX_ATTRIBS)}): ` +
                ` pos=${aVertexPosition}` +
                ` uv=${aUV}` +
                ` depth=${aDepth}` +
                ` matWorld=${!!uMatWorld}` +
                ` matViewProj=${!!uMatView}` +
                ` sampler=${!!uSampler}` +
                ` lightDirection=${!!uLightDirection}`);
            return;
        }
        // Control texture array's depth. Allow us to pick the displayed texture.
        gl.vertexAttrib1f(aDepth, 1);
        // Send LightDirection to the shader.
        gl.uniform3fv(uLightDirection, lightDirection.toFloat32Array());
        let models = [];
        let modelsData = [];
        modelsData.push(yield (0, model_1.loadModel)('./models/icosphere.gltf', './models/icosphere.bin'));
        modelsData.push(yield (0, model_1.loadModel)('./models/monkey.gltf', './models/monkey.bin'));
        modelsData.forEach((modelData) => {
            for (const data of modelData) {
                const modelVertexBuffer = (0, buffer_1.createStaticBuffer)(gl, data.vertices, false);
                const modelIndexBuffer = (0, buffer_1.createStaticBuffer)(gl, data.indices, true);
                const modelUVBuffer = (0, buffer_1.createStaticBuffer)(gl, data.uvs, false);
                const modelNormalBuffer = (0, buffer_1.createStaticBuffer)(gl, data.normals, false);
                const modelVAO = (0, buffer_1.createVAOBuffer)(gl, modelVertexBuffer, modelIndexBuffer, modelUVBuffer, modelNormalBuffer, aVertexPosition, aUV, aNormal);
                let position = new vec3_1.vec3(-.5, 0, 0);
                // Monkey "suzanne" model.
                if (data.name == "Suzanne")
                    position = new vec3_1.vec3(.5, 0, 0);
                models.push(new model_1.Model(position, tweakpane_1.SETTINGS.object_size, UP_VEC, (0, function_1.toRadian)(0), modelVAO, data.indices.length));
            }
        });
        let matView = new mat4_1.mat4();
        let matProj = new mat4_1.mat4();
        let matViewProj = new mat4_1.mat4();
        let cameraAngle = 0;
        let lastFrameTime = performance.now();
        const frame = () => __awaiter(this, void 0, void 0, function* () {
            // dt (delta time) represent the time spent between each frame, in milliseconds.
            // Delta time standardize a program, to run at the same speed.
            const thisFrameTime = performance.now();
            const dt = thisFrameTime - lastFrameTime;
            lastFrameTime = thisFrameTime;
            // FPS (Frame Per Seconds) is a frequency, it's the invert of dt.
            tweakpane_1.SETTINGS.benchmark_fps = Math.ceil(1 / (dt / 1000));
            // Allow to change light direction in real time.
            lightDirection = new vec3_1.vec3(tweakpane_1.SETTINGS.light_direction.x, tweakpane_1.SETTINGS.light_direction.y, tweakpane_1.SETTINGS.light_direction.z).normalize();
            gl.uniform3fv(uLightDirection, lightDirection.toFloat32Array());
            // CAMERA
            // TODO: Add camera movement.
            // Each frame adds 10° to the camera angle.
            // cameraAngle += (dt / 1000) * toRadian(10);
            const cameraX = 3 * Math.sin(cameraAngle);
            const cameraZ = 3 * Math.cos(cameraAngle);
            // Make the camera look at the center.
            matView.setLookAt(new vec3_1.vec3(cameraX, -.25, cameraZ), new vec3_1.vec3(0, 0, 0), new vec3_1.vec3(0, 1, 0));
            // Set the camera FOV, screen size, and view distance.
            matProj.setPerspective((0, function_1.toRadian)(tweakpane_1.SETTINGS.camera_fov), // FOV
            canvas.width / canvas.height, // ASPECT RATIO
            0.1, 100.0 // Z-NEAR / Z-FAR
            );
            // END CAMERA
            // GLM: matViewProj = matProj * matView
            matViewProj = matProj.multiply(matView);
            let width = canvas.clientWidth * devicePixelRatio;
            let height = canvas.clientHeight * devicePixelRatio;
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                gl.viewport(0, 0, canvas.width, canvas.height);
            }
            gl.clearColor(0.02, 0.02, 0.02, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl.BACK);
            gl.frontFace(gl.CCW);
            gl.useProgram(program);
            gl.uniformMatrix4fv(uMatView, false, matViewProj.mat);
            models.forEach((model) => {
                model.rotate((dt / 1000) * (0, function_1.toRadian)(tweakpane_1.SETTINGS.object_rotation_speed));
                model.scale = tweakpane_1.SETTINGS.object_size;
                model.draw(gl, uMatWorld);
            });
            // Loop calls, each time the drawing is ready.
            requestAnimationFrame(frame);
        });
        // First call, as soon as the page is loaded.
        requestAnimationFrame(frame);
        tweakpane_1.SETTINGS.benchmark_loading_time = Date.now() - T0;
    });
}
try {
    main().then(() => {
        (0, function_1.showError)(">> No Errors! 🌞");
    })
        .catch((e) => {
        (0, function_1.showError)(`Uncaught async exception: ${e}`);
    });
}
catch (e) {
    (0, function_1.showError)(`Uncaught synchronous exception: ${e}`);
}


/***/ }),

/***/ "./src/mat4.ts":
/*!*********************!*\
  !*** ./src/mat4.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mat4 = void 0;
/**
 * @constructor
 */
class mat4 {
    constructor() {
        this.mat = new Float32Array(16);
        this.identity();
    }
    /**
     * Get identity mat4
     *
     * Structure:
     *
     *  1,  0,  0, 0
     *
     *  0,  1,  0, 0
     *
     *  0,  0,  1, 0
     *
     *  0,  0,  0, 1
     * @returns identity mat4
     */
    identity() {
        this.mat.set([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        return this;
    }
    /**
     * Copy a matrice
     * @param mat matrice to copy from
     * @returns update this mat4
     */
    copyFrom(mat) {
        this.mat.set(mat.mat);
        return this;
    }
    /**
     * Multiply a matrice by another one
     * @param other matrice to multiply by
     *
     * Structure:
     *
     *  x,  0,  0, 0
     *
     *  0,  y,  0, 0
     *
     *  0,  0,  z, 0
     *
     * tx, ty, tz, 1
     */
    multiply(other) {
        const a = this.mat, b = other.mat;
        const out = new Float32Array(16);
        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 4; ++j) {
                out[j * 4 + i] =
                    a[0 * 4 + i] * b[j * 4 + 0] +
                        a[1 * 4 + i] * b[j * 4 + 1] +
                        a[2 * 4 + i] * b[j * 4 + 2] +
                        a[3 * 4 + i] * b[j * 4 + 3];
            }
        }
        this.mat.set(out);
        return this;
    }
    /**
     * @param fovRad FOV in radiant
     * @param aspect Aspect ratio
     * @param near Near plane
     * @param far Far plane
     *
     * Perspective matrice, the factor is calculated from the tan of the FOV divided by 2:
     *
     * We have the near plane and far plane. (objects are drawn in between)
     *
     * Aspect is the aspect ratio, like 16:9 on most screens.
     *
     * We change each vertices x, y and z by the following:
     *
     * 0, 0,  0,  0
     *
     * 0, 5,  0,  0
     *
     * 0, 0, 10, 11
     *
     * 0, 0, 14, 15
     */
    setPerspective(fovRad, aspect, near, far) {
        const f = 1.0 / Math.tan(fovRad / 2);
        const nf = 1 / (near - far);
        const m = this.mat;
        m.set([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, 2 * far * near * nf, 0
        ]);
        return this;
    }
    /**
     * Set look at
     * @param eye
     * @param center
     * @param up
     * @returns update this mat4
     */
    setLookAt(eye, center, up) {
        const z = eye.subtract(center).normalize();
        const x = up.cross(z).normalize();
        const y = z.cross(x);
        const m = this.mat;
        m.set([
            x.x, y.x, z.x, 0,
            x.y, y.y, z.y, 0,
            x.z, y.z, z.z, 0,
            -x.dot(eye), -y.dot(eye), -z.dot(eye), 1
        ]);
        return this;
    }
    /**
     * Set translation scale from rotation
     * @param q quat
     * @param v vector
     * @param s scale
     * @returns update this mat4
     */
    setFromRotationTranslationScale(q, v, s) {
        const x2 = q.x + q.x, y2 = q.y + q.y, z2 = q.z + q.z;
        const xx = q.x * x2, xy = q.x * y2, xz = q.x * z2;
        const yy = q.y * y2, yz = q.y * z2, zz = q.z * z2;
        const wx = q.w * x2, wy = q.w * y2, wz = q.w * z2;
        this.mat.set([
            (1 - (yy + zz)) * s.x, (xy + wz) * s.x, (xz - wy) * s.x, 0,
            (xy - wz) * s.y, (1 - (xx + zz)) * s.y, (yz + wx) * s.y, 0,
            (xz + wy) * s.z, (yz - wx) * s.z, (1 - (xx + yy)) * s.z, 0,
            v.x, v.y, v.z, 1
        ]);
        return this;
    }
    invert() {
        return this;
    }
}
exports.mat4 = mat4;


/***/ }),

/***/ "./src/model.ts":
/*!**********************!*\
  !*** ./src/model.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


//
// CLASS
//
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Model = void 0;
exports.loadModel = loadModel;
const vec3_1 = __webpack_require__(/*! ./vec3 */ "./src/vec3.ts");
const quat_1 = __webpack_require__(/*! ./quat */ "./src/quat.ts");
const mat4_1 = __webpack_require__(/*! ./mat4 */ "./src/mat4.ts");
const function_1 = __webpack_require__(/*! ./function */ "./src/function.ts");
const buffer_1 = __webpack_require__(/*! ./buffer */ "./src/buffer.ts");
class Model {
    constructor(pos, scale, rotationAxis, rotationAngle, vao, numIndices) {
        this.pos = pos;
        this.scale = scale;
        this.rotationAxis = rotationAxis;
        this.rotationAngle = rotationAngle;
        this.vao = vao;
        this.numIndices = numIndices;
        this.matWorld = new mat4_1.mat4();
        this.scaleVec = new vec3_1.vec3();
        this.rotation = new quat_1.quat();
    }
    rotate(angle) {
        this.rotationAngle = this.rotationAngle + angle;
    }
    draw(gl, matWorldUniform) {
        this.rotation.setAxisAngle(this.rotationAxis, this.rotationAngle);
        this.scaleVec.set(this.scale, this.scale, this.scale);
        this.matWorld.setFromRotationTranslationScale(this.rotation, this.pos, this.scaleVec);
        gl.uniformMatrix4fv(matWorldUniform, false, this.matWorld.mat);
        gl.bindVertexArray(this.vao);
        gl.drawElements(gl.TRIANGLES, this.numIndices, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }
}
exports.Model = Model;
/**
 * Load models and return buffers
 * @param url_gltf path to .gltf file
 * @param url_bin path to .bin file
 * @returns buffers
 */
function loadModel(url_gltf, url_bin) {
    return __awaiter(this, void 0, void 0, function* () {
        const gltf = yield fetch(url_gltf).then((response) => {
            if (!response.ok) {
                (0, function_1.showError)(response.statusText);
                throw new Error(response.statusText);
            }
            return response.json();
        });
        const bin = yield fetch(url_bin).then((response) => {
            if (!response.ok) {
                (0, function_1.showError)(response.statusText);
                throw new Error(response.statusText);
            }
            return response.arrayBuffer();
        });
        const models = [];
        for (let mesh of gltf.meshes) {
            let name = mesh.name;
            for (let prim of mesh.primitives) {
                const data = {
                    name: name,
                    vertices: (0, buffer_1.getBuffer)(gltf, bin, prim.attributes.POSITION),
                    normals: (0, buffer_1.getBuffer)(gltf, bin, prim.attributes.NORMAL),
                    uvs: (0, buffer_1.getBuffer)(gltf, bin, prim.attributes.TEXCOORD_0),
                    indices: (0, buffer_1.getBuffer)(gltf, bin, prim.indices)
                };
                models.push(data);
            }
        }
        return models;
    });
}


/***/ }),

/***/ "./src/quat.ts":
/*!*********************!*\
  !*** ./src/quat.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.quat = void 0;
/**
 * @constructor
 * @param x default 0
 * @param y default 0
 * @param z default 0
 * @param w default 1
 * @method setAxisAngle
 */
class quat {
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    /**
     * Set axis angle
     * @param axis vec3
     * @param angle number divided by 2 to get half
     * @returns
     */
    setAxisAngle(axis, angle) {
        const norm = axis.normalize();
        const half = angle / 2;
        const s = Math.sin(half);
        this.x = norm.x * s;
        this.y = norm.y * s;
        this.z = norm.z * s;
        this.w = Math.cos(half);
        return this;
    }
}
exports.quat = quat;


/***/ }),

/***/ "./src/shader.ts":
/*!***********************!*\
  !*** ./src/shader.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getImage = getImage;
exports.getShaderSource = getShaderSource;
exports.createProgram = createProgram;
exports.loadTexture = loadTexture;
const function_1 = __webpack_require__(/*! ./function */ "./src/function.ts");
/**
 * @param url Path to image file
 * @returns Return an image
 * @async
 */
function getImage(url) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            const image = new Image();
            image.src = url;
            image.onload = () => resolve(image);
        });
    });
}
/**
 * @description Get shaders source code
 * @param url Path to shader file
 * @returns Return text
 * @async
 */
function getShaderSource(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error(`Error ${response.statusText} while loading shader code at "${url}"`);
        }
        return response.text();
    });
}
/**
 * @description Create a WebGL program and link the vertex and fragment shader source code to it.
 * @param gl WebGL Rendering Context
 * @param vertexShaderSrc Vertex Shader Source Code
 * @param fragmentShaderSrc Fragment Shader Source Code
 * @returns Return WebGL program
 */
function createProgram(gl, vertexShaderSrc, fragmentShaderSrc) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    gl.shaderSource(vertexShader, vertexShaderSrc);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(vertexShader);
        (0, function_1.showError)(error || "No shader debug log provided.");
        return 0;
    }
    gl.shaderSource(fragmentShader, fragmentShaderSrc);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(fragmentShader);
        (0, function_1.showError)(error || "No shader debug log provided.");
        return 0;
    }
    // Program set up for Uniforms.
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const error = gl.getProgramInfoLog(program);
        (0, function_1.showError)(error || "No program debug log provided.");
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
function loadTexture(gl, textures) {
    return __awaiter(this, void 0, void 0, function* () {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
        gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.RGBA8, 128, 128, textures.length);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        const images = yield Promise.all(textures.map(src => getImage(src)));
        for (let i = 0; i < images.length; i++) {
            gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, i, 128, 128, 1, gl.RGBA, gl.UNSIGNED_BYTE, images[i]);
        }
        gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    });
}


/***/ }),

/***/ "./src/tweakpane.ts":
/*!**************************!*\
  !*** ./src/tweakpane.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SETTINGS = exports.pane = void 0;
exports.init = init;
const tweakpane_1 = __webpack_require__(/*! tweakpane */ "./node_modules/tweakpane/dist/tweakpane.js");
exports.pane = new tweakpane_1.Pane({ title: 'Settings', expanded: true });
exports.SETTINGS = {
    camera_fov: 30.0,
    object_rotation_speed: 10.0,
    object_size: 0.4,
    light_direction: { x: 1.0, y: 1.0, z: 1.0 },
    benchmark_fps: 0.0,
    benchmark_loading_time: 0.0,
    source_github: 'https://github.com/Vahaz/Learning-WebGL',
    source_tweakpane: 'https://tweakpane.github.io/docs/'
};
function init() {
    // CAMERA
    const fCamera = exports.pane.addFolder({ title: 'Camera', expanded: false });
    fCamera.addBinding(exports.SETTINGS, 'camera_fov', {
        label: 'FOV',
        min: 30.0,
        max: 120.0,
        step: 5.0
    });
    // OBJECT
    const fObject = exports.pane.addFolder({ title: 'Object', expanded: false });
    fObject.addBinding(exports.SETTINGS, 'object_rotation_speed', {
        label: 'R. Speed',
        min: 0.0,
        max: 180.0,
        step: 1.0
    });
    fObject.addBinding(exports.SETTINGS, 'object_size', {
        label: 'Size',
        min: 0.1,
        max: 1.0,
        step: 0.1
    });
    // LIGHT
    const fLight = exports.pane.addFolder({ title: 'Light', expanded: false });
    fLight.addBinding(exports.SETTINGS, 'light_direction', {
        label: 'Ambient Light',
        x: { min: -1.0, max: 1.0 },
        y: { min: -1.0, max: 1.0 },
        z: { min: -1.0, max: 1.0 },
        interval: 100
    });
    // BENCHMARK
    const fBenchmark = exports.pane.addFolder({ title: 'Timers', expanded: true });
    fBenchmark.addBinding(exports.SETTINGS, 'benchmark_fps', {
        label: 'FPS',
        readonly: true,
        view: 'text',
        interval: 500
    });
    fBenchmark.addBinding(exports.SETTINGS, 'benchmark_loading_time', {
        label: 'Loading Time',
        readonly: true,
        format: (value) => {
            return value.toFixed(1) + 'ms';
        }
    });
    // SOURCE
    const fSource = exports.pane.addFolder({ title: 'Sources', expanded: false });
    fSource.addButton({ title: 'See Repository', label: 'Github Repository' }).on('click', () => {
        window.open(exports.SETTINGS.source_github, '_blank');
    });
    fSource.addButton({ title: 'See Page', label: 'Tweakpane Docs' }).on('click', () => {
        window.open(exports.SETTINGS.source_tweakpane, '_blank');
    });
}
;


/***/ }),

/***/ "./src/vec3.ts":
/*!*********************!*\
  !*** ./src/vec3.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.vec3 = void 0;
/**
 * @constructor
 * @param x - default 0
 * @param y - default 0
 * @param z - default 0
 */
class vec3 {
    constructor(x = 0.0, y = 0.0, z = 0.0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    /**
     * Add a vector
     * @param v vector to add by
     * @returns new vec3
     */
    add(v) { return new vec3(this.x + v.x, this.y + v.y, this.z + v.z); }
    /**
     * Substract a vector
     * @param v vector to substract by
     * @returns new vec3
     */
    subtract(v) { return new vec3(this.x - v.x, this.y - v.y, this.z - v.z); }
    /**
     * Multiply a vector
     * @param v vector to multiply by
     * @returns new vec3
     */
    multiply(v) { return new vec3(this.x * v.x, this.y * v.y, this.z * v.z); }
    /**
     * Set a coordinate
     * @param x coordinate to change
     * @param y coordinate to change
     * @param z coordinate to change
     * @returns update this vec3
     */
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    /**
     * Normalize a vector
     * @returns new vec3
     */
    normalize() {
        const len = Math.hypot(this.x, this.y, this.z);
        return len > 0 ? new vec3(this.x / len, this.y / len, this.z / len) : new vec3();
    }
    /**
     * Cross product of a vector
     * @param v vector to cross product by
     * @returns new vec3
     */
    cross(v) {
        return new vec3(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    }
    /**
     * Dot product of a vector
     * @param v vector to dot product by
     * @returns update this vec3
     */
    dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }
    /**
     * Convert a vector to a Float32Array
     * @param v vector
     * @returns new Float32Array
     */
    toFloat32Array() { return new Float32Array([this.x, this.y, this.z]); }
    /**
     * Convert a vector to an Array
     * @param v vector
     * @returns new Array number[]
     */
    toArray() { return [this.x, this.y, this.z]; }
}
exports.vec3 = vec3;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkwebgl"] = self["webpackChunkwebgl"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["lib"], () => (__webpack_require__("./src/main.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYmdsLy4vc3JjL2J1ZmZlci50cyIsIndlYnBhY2s6Ly93ZWJnbC8uL3NyYy9mdW5jdGlvbi50cyIsIndlYnBhY2s6Ly93ZWJnbC8uL3NyYy9tYWluLnRzIiwid2VicGFjazovL3dlYmdsLy4vc3JjL21hdDQudHMiLCJ3ZWJwYWNrOi8vd2ViZ2wvLi9zcmMvbW9kZWwudHMiLCJ3ZWJwYWNrOi8vd2ViZ2wvLi9zcmMvcXVhdC50cyIsIndlYnBhY2s6Ly93ZWJnbC8uL3NyYy9zaGFkZXIudHMiLCJ3ZWJwYWNrOi8vd2ViZ2wvLi9zcmMvdHdlYWtwYW5lLnRzIiwid2VicGFjazovL3dlYmdsLy4vc3JjL3ZlYzMudHMiLCJ3ZWJwYWNrOi8vd2ViZ2wvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2ViZ2wvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly93ZWJnbC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2ViZ2wvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93ZWJnbC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3dlYmdsL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL3dlYmdsL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vd2ViZ2wvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3dlYmdsL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzaG93RXJyb3IgfSBmcm9tIFwiLi9mdW5jdGlvblwiO1xyXG5pbXBvcnQgeyBHTFRGIH0gZnJvbSBcIi4vbW9kZWxcIjtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBXZWJHTCBCdWZmZXIgdHlwZS4gKE9wYXF1ZSBIYW5kbGUpXHJcbiAqIC0gU1RBVElDX0RSQVcgOiB3b24ndCB1cGRhdGUgb2Z0ZW4sIGJ1dCBvZnRlbiB1c2VkLlxyXG4gKiAtIEFSUkFZX0JVRkZFUiA6IGluZGljYXRlIHRoZSBwbGFjZSB0byBzdG9yZSB0aGUgQXJyYXkuXHJcbiAqIC0gRUxFTUVOVF9BUlJBWV9CVUZGRVIgOiBVc2VkIGZvciBpbmRpY2VzIHdpdGggY3ViZSBzaGFwZSBkcmF3aW5nLlxyXG4gKiBCaW5kIHRoZSBCdWZmZXIgdG8gdGhlIENQVSwgYWRkIHRoZSBBcnJheSB0byB0aGUgQnVmZmVyIGFuZCBDbGVhciBhZnRlciB1c2UuXHJcbiAqIEBwYXJhbSBnbCAtIFdlYkdMIFJlbmRlcmluZyBDb250ZXh0XHJcbiAqIEBwYXJhbSBkYXRhIC0gQnVmZmVyc1xyXG4gKiBAcGFyYW0gaXNJbmRpY2UgLSBWZXJ0aWNlcyBvciBJbmRpY2VzID9cclxuICogQHJldHVybnMgYnVmZmVyXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3RhdGljQnVmZmVyKFxyXG4gICAgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXHJcbiAgICBkYXRhOiBhbnksXHJcbiAgICBpc0luZGljZTogYm9vbGVhblxyXG4pOiBXZWJHTEJ1ZmZlciB7XHJcbiAgICBjb25zdCBidWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcclxuICAgIGNvbnN0IHR5cGUgPSAoaXNJbmRpY2UgPT0gdHJ1ZSkgPyBnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiA6IGdsLkFSUkFZX0JVRkZFUlxyXG4gICAgaWYoIWJ1ZmZlcikge1xyXG4gICAgICAgIHNob3dFcnJvcihcIkZhaWxlZCB0byBhbGxvY2F0ZSBidWZmZXIgc3BhY2VcIik7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2wuYmluZEJ1ZmZlcih0eXBlLCBidWZmZXIpO1xyXG4gICAgZ2wuYnVmZmVyRGF0YSh0eXBlLCBkYXRhLCBnbC5TVEFUSUNfRFJBVyk7XHJcbiAgICBnbC5iaW5kQnVmZmVyKHR5cGUsIG51bGwpO1xyXG4gICAgcmV0dXJuIGJ1ZmZlclxyXG59XHJcblxyXG4vKipcclxuICogQ3JlYXRlIHZlcnRleCBhcnJheSBvYmplY3QgYnVmZmVycywgaXQgcmVhZHMgdGhlIHZlcnRpY2VzIGZyb20gR1BVIEJ1ZmZlci5cclxuICogVGhlIHZlcnRleCBidWZmZXIgY29udGFpbnMgdGhlIHZlcnRpY2VzJyBjb29yZGluYXRlcyAoY2FuIGFsc28gY29udGFpbiBjb2xvciBhbmQgc2l6ZSkuXHJcbiAqIFRoZSBpbmRleCBidWZmZXIgY29udGFpbnMgd2hpY2ggdmVydGV4IG5lZWRzIHRvIGJlIGRyYXduIG9uIHNjZW5lIHRvIGF2b2lkIGR1cGxpY2F0ZSB2ZXJ0aWNlcy5cclxuICogSW4gY2FzZSBvZiBjb2xvcnMsIGFuIG9mZnNldCBvZiAzIGZsb2F0cyBpcyB1c2VkIGVhY2ggdGltZSB0byBhdm9pZCAoeCwgeSwgeikgY29vcmRpbmF0ZXMuXHJcbiAqIFRoZSB2ZXJ0ZXggc2hhZGVyIHBsYWNlcyB0aGUgdmVydGljZXMgaW4gY2xpcCBzcGFjZSBhbmQgdGhlIGZyYWdtZW50IHNoYWRlciBjb2xvcnMgdGhlIHBpeGVscy4gKERlZmF1bHQ6IDApXHJcbiAqIFZlcnRleEF0dHJpYlBvaW50ZXIgW0luZGV4LCBTaXplLCBUeXBlLCBJc05vcm1hbGl6ZWQsIFN0cmlkZSwgT2Zmc2V0XVxyXG4gKiAtIEluZGV4IChsb2NhdGlvbilcclxuICogLSBTaXplIChDb21wb25lbnQgcGVyIHZlY3RvcilcclxuICogLSBUeXBlXHJcbiAqIC0gSXNOb3JtYWxpemVkIChpbnQgdG8gZmxvYXRzLCBmb3IgY29sb3JzIHRyYW5zZm9ybSBbMCwgMjU1XSB0byBmbG9hdCBbMCwgMV0pXHJcbiAqIC0gU3RyaWRlIChEaXN0YW5jZSBiZXR3ZWVuIGVhY2ggdmVydGV4IGluIHRoZSBidWZmZXIpXHJcbiAqIC0gT2Zmc2V0IChOdW1iZXIgb2Ygc2tpcGVkIGJ5dGVzIGJlZm9yZSByZWFkaW5nIGF0dHJpYnV0ZXMpXHJcbiAqIEBwYXJhbSBnbCAtIFdlYkdMIFJlbmRlcmluZyBDb250ZXh0XHJcbiAqIEBwYXJhbSB2ZXJ0ZXhCdWZmZXIgLSB2ZXJ0aWNlcyBidWZmZXJcclxuICogQHBhcmFtIGluZGV4QnVmZmVyIC0gaW5kZXhlcyBidWZmZXJcclxuICogQHBhcmFtIHV2QnVmZmVyIC0gVVYgYnVmZmVyXHJcbiAqIEBwYXJhbSBub3JtYWxCdWZmZXIgLSBOb3JtYWwgYnVmZmVyXHJcbiAqIEBwYXJhbSBwb3NBdHRyaWIgLSBQb3NpdGlvbiBhdHRyaWJ1dGVzXHJcbiAqIEBwYXJhbSB1dkF0dHJpYiAtIFVWIGF0dHJpYnV0ZXNcclxuICogQHBhcmFtIG5vcm1hbEF0dHJpYiAtIE5vcm1hbHMgYXR0cmlidXRlc1xyXG4gKiBAcmV0dXJucyBWZXJ0ZXggQXJyYXkgT2JqZWN0IChWQU8pXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVkFPQnVmZmVyKFxyXG4gICAgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsXHJcbiAgICB2ZXJ0ZXhCdWZmZXI6IFdlYkdMQnVmZmVyLFxyXG4gICAgaW5kZXhCdWZmZXI6IFdlYkdMQnVmZmVyLFxyXG4gICAgdXZCdWZmZXI6IFdlYkdMQnVmZmVyLFxyXG4gICAgbm9ybWFsQnVmZmVyOiBXZWJHTEJ1ZmZlcixcclxuICAgIHBvc0F0dHJpYjogbnVtYmVyLFxyXG4gICAgdXZBdHRyaWI6IG51bWJlcixcclxuICAgIG5vcm1hbEF0dHJpYjogbnVtYmVyXHJcbik6IFdlYkdMVmVydGV4QXJyYXlPYmplY3Qge1xyXG4gICAgY29uc3QgdmFvID0gZ2wuY3JlYXRlVmVydGV4QXJyYXkoKTtcclxuICAgIGlmKCF2YW8pIHsgc2hvd0Vycm9yKFwiRmFpbGVkIHRvIGFsbG9jYXRlIFZBTyBidWZmZXIuXCIpOyByZXR1cm4gMDsgfVxyXG4gICAgZ2wuYmluZFZlcnRleEFycmF5KHZhbyk7XHJcblxyXG4gICAgLy8gMS4gUG9zaXRpb24sIGZvcm1hdDogKHgsIHksIHopIChhbGwgZjMyKVxyXG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkocG9zQXR0cmliKTtcclxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB2ZXJ0ZXhCdWZmZXIpO1xyXG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihwb3NBdHRyaWIsIDMsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblxyXG4gICAgLy8gMi4gTm9ybWFsc1xyXG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkobm9ybWFsQXR0cmliKTtcclxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBub3JtYWxCdWZmZXIpXHJcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKG5vcm1hbEF0dHJpYiwgMywgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHJcbiAgICAvLyAzLiBVVnNcclxuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHV2QXR0cmliKTtcclxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB1dkJ1ZmZlcik7XHJcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHV2QXR0cmliLCAyLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cclxuXHJcbiAgICAvLyA0LiBJbmRpY2VzXHJcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBpbmRleEJ1ZmZlcik7XHJcblxyXG4gICAgZ2wuYmluZFZlcnRleEFycmF5KG51bGwpO1xyXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIG51bGwpO1xyXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbnVsbCk7XHJcbiAgICByZXR1cm4gdmFvO1xyXG59XHJcblxyXG5jb25zdCBTSVpFUzogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfSA9IHtTQ0FMQVI6IDEsIFZFQzI6IDIsIFZFQzM6IDN9O1xyXG4vKipcclxuICogZ2V0IGNvcnJlY3QgYnVmZmVyXHJcbiAqIEBwYXJhbSBnbHRmIHBhcmFtc1xyXG4gKiBAcGFyYW0gYmluIHBhcmFtc1xyXG4gKiBAcGFyYW0gaWQgaWRcclxuICogQHJldHVybnMgYXJyYXlcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRCdWZmZXIoZ2x0ZjogR0xURiwgYmluOiBBcnJheUJ1ZmZlciwgaWQ6IG51bWJlcikge1xyXG4gICAgY29uc3QgYWNjZXNzb3JzID0gZ2x0Zi5hY2Nlc3NvcnNbaWRdO1xyXG4gICAgY29uc3QgYnVmZmVyVmlld3MgPSBnbHRmLmJ1ZmZlclZpZXdzW2FjY2Vzc29ycy5idWZmZXJWaWV3XTtcclxuICAgIGNvbnN0IG9mZnNldCA9IChidWZmZXJWaWV3cy5ieXRlT2Zmc2V0IHx8IDApICsgKGFjY2Vzc29ycy5ieXRlT2Zmc2V0IHx8IDApO1xyXG4gICAgY29uc3QgbGVuZ3RoID0gYWNjZXNzb3JzLmNvdW50ICogU0laRVNbYWNjZXNzb3JzLnR5cGVdO1xyXG5cclxuICAgIGlmIChhY2Nlc3NvcnMuY29tcG9uZW50VHlwZSA9PT0gNTEyNikgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoYmluLCBvZmZzZXQsIGxlbmd0aCk7XHJcbiAgICBpZiAoYWNjZXNzb3JzLmNvbXBvbmVudFR5cGUgPT09IDUxMjMpIHJldHVybiBuZXcgVWludDE2QXJyYXkoYmluLCBvZmZzZXQsIGxlbmd0aCk7XHJcbiAgICBpZiAoYWNjZXNzb3JzLmNvbXBvbmVudFR5cGUgPT09IDUxMjUpIHJldHVybiBuZXcgVWludDMyQXJyYXkoYmluLCBvZmZzZXQsIGxlbmd0aCk7XHJcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSgpO1xyXG59XHJcbiIsIi8qKlxyXG4gKiBEaXNwbGF5IGFuIGVycm9yIG1lc3NhZ2UgdG8gdGhlIEhUTUwgRWxlbWVudCB3aXRoIGlkIFwiZXJyb3JcIi5cclxuICogQHBhcmFtIG1zZyBtZXNzYWdlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2hvd0Vycm9yKG1zZzogc3RyaW5nID0gXCJObyBEYXRhXCIpOiB2b2lkIHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JcIik7XHJcbiAgICBpZihjb250YWluZXIgPT09IG51bGwpIHJldHVybiBjb25zb2xlLmxvZyhcIk5vIEVsZW1lbnQgd2l0aCBJRDogZXJyb3JcIik7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gICAgZWxlbWVudC5pbm5lclRleHQgPSBtc2c7XHJcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcbiAgICBjb25zb2xlLmxvZyhtc2cpO1xyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydCBmcm9tIGRlZ3JlZXMgdG8gcmFkaWFudFxyXG4gKiBAcGFyYW0gYW5nbGVcclxuICogQHJldHVybnMgYW5nbGUgdG8gcmFkaWFudFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHRvUmFkaWFuKGFuZ2xlOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIGFuZ2xlICogTWF0aC5QSSAvIDE4MDtcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgU0VUVElOR1MsIGluaXQgfSBmcm9tIFwiLi90d2Vha3BhbmVcIjtcclxuaW1wb3J0IHsgdmVjMyB9IGZyb20gXCIuL3ZlYzNcIjtcclxuaW1wb3J0IHsgbWF0NCB9IGZyb20gXCIuL21hdDRcIjtcclxuaW1wb3J0IHsgc2hvd0Vycm9yLCB0b1JhZGlhbiB9IGZyb20gXCIuL2Z1bmN0aW9uXCI7XHJcbmltcG9ydCB7IGNyZWF0ZVN0YXRpY0J1ZmZlciwgY3JlYXRlVkFPQnVmZmVyIH0gZnJvbSBcIi4vYnVmZmVyXCI7XHJcbmltcG9ydCB7IGxvYWRUZXh0dXJlLCBjcmVhdGVQcm9ncmFtLCBnZXRTaGFkZXJTb3VyY2UgfSBmcm9tIFwiLi9zaGFkZXJcIjtcclxuaW1wb3J0IHsgTW9kZWwsIGxvYWRNb2RlbCwgTW9kZWxEYXRhIH0gZnJvbSBcIi4vbW9kZWxcIjtcclxuXHJcbmNvbnN0IFVQX1ZFQyA9IG5ldyB2ZWMzKDAsIDEsIDApO1xyXG5jb25zdCBUMCA9IERhdGUubm93KCk7XHJcbmNvbnN0IFRFWFRVUkVTID0gWyAnLi9pbWcvdGV4dHVyZS5wbmcnIF07XHJcbmluaXQoKTtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIG1haW4oKTogUHJvbWlzZTx2b2lkPiB7XHJcblxyXG4gICAgLy8gQ2FudmFzIEVsZW1lbnQgYW5kIFJlbmRlcmluZyBDb250ZXh0LlxyXG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3ZWJnbC1jYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBjb25zdCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbDInKSBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0O1xyXG4gICAgaWYoIWdsKSB7IHNob3dFcnJvcihcIk5vIFdlYkdMMiBDb250ZXh0ICFcIik7IHJldHVybjsgfVxyXG5cclxuICAgIGNvbnN0IHZlcnRleFNvdXJjZSA9IGF3YWl0IGdldFNoYWRlclNvdXJjZSgnLi9zaGFkZXJzL3ZlcnRleF9zaGFkZXIudmVydCcpO1xyXG4gICAgY29uc3QgZnJhZ21lbnRTb3VyY2UgPSBhd2FpdCBnZXRTaGFkZXJTb3VyY2UoJy4vc2hhZGVycy9mcmFnbWVudF9zaGFkZXIuZnJhZycpO1xyXG4gICAgY29uc3QgcHJvZ3JhbSA9IGNyZWF0ZVByb2dyYW0oZ2wsIHZlcnRleFNvdXJjZSwgZnJhZ21lbnRTb3VyY2UpO1xyXG5cclxuICAgIC8vIExvYWQgYWxsIGltYWdlcyBpbiBhIFRleHR1cmUgQXJyYXkuXHJcbiAgICBsb2FkVGV4dHVyZShnbCwgVEVYVFVSRVMpO1xyXG5cclxuICAgIC8qIEdldHRpbmcgYWxsIGF0dHJpYnV0ZXMgZnJvbSB0aGUgdmVydGV4IHNoYWRlciBmaWxlLlxyXG4gICAgICogQXR0cmlidXRlIGxvY2F0aW9ucyBjYW4gYmUgZm9yY2VkIGluIHRoZSB2ZXJ0ZXggc2hhZGVyIGZpbGUgd2l0aCAobG9jYXRpb249PG51bWJlcj4pLlxyXG4gICAgICogSWYgbm90IGZvcmNlZCwgV2ViR0wgZ2l2ZXMgdGhlbSBhIG51bWJlciwgeW91IGNhbiBnZXQgdGhpcyBudW1iZXIgd2l0aCBnbC5nZXRBdHRyaWJMb2NhdGlvbig8cHJvZ3JhbV9uYW1lPiwgPGF0dHJpYnV0ZV9uYW1lPikuXHJcbiAgICAgKiBCZWNhdXNlIHdlIHNldCBtYW51YWxseSB0aGUgYXR0cmlidXRlIGxvY2F0aW9uIGluIHRoZSB2ZXJ0ZXggc2hhZGVyLFxyXG4gICAgICogd2UgY2FuIHJlcGxhY2UgZ2wuZ2V0QXR0cmliTG9jYXRpb24oPHByb2dyYW1fbmFtZT4sIDxhdHRyaWJ1dGVfbmFtZT4pIHdpdGggbG9jYXRpb24ncyBudW1iZXIuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0IGFWZXJ0ZXhQb3NpdGlvbiA9IDA7ICAvL2NhbiBhbHNvIHVzZTogZ2wuZ2V0QXR0cmliTG9jYXRpb24ocHJvZ3JhbSwgJ2FWZXJ0ZXhQb3NpdGlvbicpO1xyXG4gICAgY29uc3QgYVVWID0gMTsgICAgICAgICAgICAgIC8vY2FuIGFsc28gdXNlOiBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtLCAnYVVWJyk7XHJcbiAgICBjb25zdCBhRGVwdGggPSAyOyAgICAgICAgICAgLy9jYW4gYWxzbyB1c2U6IGdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW0sICdhRGVwdGgnKTtcclxuICAgIGNvbnN0IGFOb3JtYWwgPSAzOyAgICAgICAgICAvL2NhbiBhbHNvIHVzZTogZ2wuZ2V0QXR0cmliTG9jYXRpb24ocHJvZ3JhbSwgJ2FOb3JtYWwnKTtcclxuXHJcbiAgICAvLyBXZSBjYW4ndCBzcGVjaWZ5IFVuaWZvcm1zIGxvY2F0aW9ucyBtYW51YWxseS4gV2UgbmVlZCB0byBnZXQgdGhlbSB1c2luZyBnbC5nZXRVbmlmb3JtTG9jYXRpb24oPHByb2dyYW1fbmFtZT4sIDx1bmlmb3JtX25hbWU+KS5cclxuICAgIGNvbnN0IHVNYXRXb3JsZCA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCAndU1hdFdvcmxkJykgYXMgV2ViR0xVbmlmb3JtTG9jYXRpb247XHJcbiAgICBjb25zdCB1TWF0VmlldyA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCAndU1hdFZpZXdQcm9qJykgYXMgV2ViR0xVbmlmb3JtTG9jYXRpb247XHJcbiAgICBjb25zdCB1U2FtcGxlciA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCAndVNhbXBsZXInKSBhcyBXZWJHTFVuaWZvcm1Mb2NhdGlvbjtcclxuICAgIGNvbnN0IHVMaWdodERpcmVjdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCAndUxpZ2h0RGlyZWN0aW9uJykgYXMgV2ViR0xVbmlmb3JtTG9jYXRpb247XHJcblxyXG4gICAgLy8gQWRkIGEgbGlnaHQgZGlyZWN0aW9uIHRvIHRoZSB3b3JsZC5cclxuICAgIGxldCBsaWdodERpcmVjdGlvbiA9IG5ldyB2ZWMzKFNFVFRJTkdTLmxpZ2h0X2RpcmVjdGlvbi54LCBTRVRUSU5HUy5saWdodF9kaXJlY3Rpb24ueSwgU0VUVElOR1MubGlnaHRfZGlyZWN0aW9uLnopLm5vcm1hbGl6ZSgpO1xyXG5cclxuICAgIC8vIFR5cGVzY3JpcHQgd2FudHMgdG8gdmVyaWZ5IGlmIHRoZSB2YXJpYWJsZXMgYXJlIHNldCwgbm90IHRoZSBiZXN0IHdheSB0byBkbyBpdC5cclxuICAgIGlmKFxyXG4gICAgICAgIGFWZXJ0ZXhQb3NpdGlvbiA8IDBcclxuICAgICAgICB8fCBhVVYgPCAwXHJcbiAgICAgICAgfHwgYURlcHRoIDwgMFxyXG4gICAgICAgIHx8IGFOb3JtYWwgPCAwXHJcbiAgICAgICAgfHwgIXVNYXRXb3JsZFxyXG4gICAgICAgIHx8ICF1TWF0Vmlld1xyXG4gICAgICAgIHx8ICF1U2FtcGxlclxyXG4gICAgICAgIHx8ICF1TGlnaHREaXJlY3Rpb25cclxuICAgICkge1xyXG4gICAgICAgIHNob3dFcnJvcihgRmFpbGVkIHRvIGdldCBhdHRyaWJzL3VuaWZvcm1zIChNYXg6ICR7Z2wuZ2V0UGFyYW1ldGVyKGdsLk1BWF9WRVJURVhfQVRUUklCUyl9KTogYCArXHJcbiAgICAgICAgICAgIGAgcG9zPSR7YVZlcnRleFBvc2l0aW9ufWAgK1xyXG4gICAgICAgICAgICBgIHV2PSR7YVVWfWAgK1xyXG4gICAgICAgICAgICBgIGRlcHRoPSR7YURlcHRofWAgK1xyXG4gICAgICAgICAgICBgIG1hdFdvcmxkPSR7ISF1TWF0V29ybGR9YCArXHJcbiAgICAgICAgICAgIGAgbWF0Vmlld1Byb2o9JHshIXVNYXRWaWV3fWAgK1xyXG4gICAgICAgICAgICBgIHNhbXBsZXI9JHshIXVTYW1wbGVyfWAgK1xyXG4gICAgICAgICAgICBgIGxpZ2h0RGlyZWN0aW9uPSR7ISF1TGlnaHREaXJlY3Rpb259YFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENvbnRyb2wgdGV4dHVyZSBhcnJheSdzIGRlcHRoLiBBbGxvdyB1cyB0byBwaWNrIHRoZSBkaXNwbGF5ZWQgdGV4dHVyZS5cclxuICAgIGdsLnZlcnRleEF0dHJpYjFmKGFEZXB0aCwgMSk7XHJcblxyXG4gICAgLy8gU2VuZCBMaWdodERpcmVjdGlvbiB0byB0aGUgc2hhZGVyLlxyXG4gICAgZ2wudW5pZm9ybTNmdih1TGlnaHREaXJlY3Rpb24sIGxpZ2h0RGlyZWN0aW9uLnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cclxuICAgIGxldCBtb2RlbHM6IE1vZGVsW10gPSBbXTtcclxuICAgIGxldCBtb2RlbHNEYXRhOiBBcnJheTxNb2RlbERhdGE+W10gPSBbXTtcclxuXHJcbiAgICBtb2RlbHNEYXRhLnB1c2goYXdhaXQgbG9hZE1vZGVsKCcuL21vZGVscy9pY29zcGhlcmUuZ2x0ZicsICcuL21vZGVscy9pY29zcGhlcmUuYmluJykpO1xyXG4gICAgbW9kZWxzRGF0YS5wdXNoKGF3YWl0IGxvYWRNb2RlbCgnLi9tb2RlbHMvbW9ua2V5LmdsdGYnLCAnLi9tb2RlbHMvbW9ua2V5LmJpbicpKTtcclxuICAgIG1vZGVsc0RhdGEuZm9yRWFjaCgobW9kZWxEYXRhKSA9PiB7XHJcbiAgICAgICAgZm9yIChjb25zdCBkYXRhIG9mIG1vZGVsRGF0YSkge1xyXG4gICAgICAgICAgICBjb25zdCBtb2RlbFZlcnRleEJ1ZmZlciA9IGNyZWF0ZVN0YXRpY0J1ZmZlcihnbCwgZGF0YS52ZXJ0aWNlcywgZmFsc2UpO1xyXG4gICAgICAgICAgICBjb25zdCBtb2RlbEluZGV4QnVmZmVyID0gY3JlYXRlU3RhdGljQnVmZmVyKGdsLCBkYXRhLmluZGljZXMsIHRydWUpO1xyXG4gICAgICAgICAgICBjb25zdCBtb2RlbFVWQnVmZmVyID0gY3JlYXRlU3RhdGljQnVmZmVyKGdsLCBkYXRhLnV2cywgZmFsc2UpO1xyXG4gICAgICAgICAgICBjb25zdCBtb2RlbE5vcm1hbEJ1ZmZlciA9IGNyZWF0ZVN0YXRpY0J1ZmZlcihnbCwgZGF0YS5ub3JtYWxzLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtb2RlbFZBTyA9IGNyZWF0ZVZBT0J1ZmZlcihcclxuICAgICAgICAgICAgICAgIGdsLFxyXG4gICAgICAgICAgICAgICAgbW9kZWxWZXJ0ZXhCdWZmZXIsXHJcbiAgICAgICAgICAgICAgICBtb2RlbEluZGV4QnVmZmVyLFxyXG4gICAgICAgICAgICAgICAgbW9kZWxVVkJ1ZmZlcixcclxuICAgICAgICAgICAgICAgIG1vZGVsTm9ybWFsQnVmZmVyLFxyXG4gICAgICAgICAgICAgICAgYVZlcnRleFBvc2l0aW9uLFxyXG4gICAgICAgICAgICAgICAgYVVWLFxyXG4gICAgICAgICAgICAgICAgYU5vcm1hbFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gbmV3IHZlYzMoLS41LCAwLCAwKTtcclxuICAgICAgICAgICAgLy8gTW9ua2V5IFwic3V6YW5uZVwiIG1vZGVsLlxyXG4gICAgICAgICAgICBpZiAoZGF0YS5uYW1lID09IFwiU3V6YW5uZVwiKSBwb3NpdGlvbiA9IG5ldyB2ZWMzKC41LCAwLCAwKTtcclxuXHJcbiAgICAgICAgICAgIG1vZGVscy5wdXNoKG5ldyBNb2RlbChcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uLFxyXG4gICAgICAgICAgICAgICAgU0VUVElOR1Mub2JqZWN0X3NpemUsXHJcbiAgICAgICAgICAgICAgICBVUF9WRUMsXHJcbiAgICAgICAgICAgICAgICB0b1JhZGlhbigwKSxcclxuICAgICAgICAgICAgICAgIG1vZGVsVkFPLFxyXG4gICAgICAgICAgICAgICAgZGF0YS5pbmRpY2VzLmxlbmd0aFxyXG4gICAgICAgICAgICApKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIGxldCBtYXRWaWV3ID0gbmV3IG1hdDQoKTtcclxuICAgIGxldCBtYXRQcm9qID0gbmV3IG1hdDQoKTtcclxuICAgIGxldCBtYXRWaWV3UHJvaiA9IG5ldyBtYXQ0KCk7XHJcblxyXG4gICAgbGV0IGNhbWVyYUFuZ2xlID0gMDtcclxuICAgIGxldCBsYXN0RnJhbWVUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblxyXG4gICAgY29uc3QgZnJhbWUgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgLy8gZHQgKGRlbHRhIHRpbWUpIHJlcHJlc2VudCB0aGUgdGltZSBzcGVudCBiZXR3ZWVuIGVhY2ggZnJhbWUsIGluIG1pbGxpc2Vjb25kcy5cclxuICAgICAgICAvLyBEZWx0YSB0aW1lIHN0YW5kYXJkaXplIGEgcHJvZ3JhbSwgdG8gcnVuIGF0IHRoZSBzYW1lIHNwZWVkLlxyXG4gICAgICAgIGNvbnN0IHRoaXNGcmFtZVRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICBjb25zdCBkdCA9IHRoaXNGcmFtZVRpbWUgLSBsYXN0RnJhbWVUaW1lO1xyXG4gICAgICAgIGxhc3RGcmFtZVRpbWUgPSB0aGlzRnJhbWVUaW1lO1xyXG5cclxuICAgICAgICAvLyBGUFMgKEZyYW1lIFBlciBTZWNvbmRzKSBpcyBhIGZyZXF1ZW5jeSwgaXQncyB0aGUgaW52ZXJ0IG9mIGR0LlxyXG4gICAgICAgIFNFVFRJTkdTLmJlbmNobWFya19mcHMgPSBNYXRoLmNlaWwoMSAvIChkdCAvIDEwMDApKTtcclxuXHJcbiAgICAgICAgLy8gQWxsb3cgdG8gY2hhbmdlIGxpZ2h0IGRpcmVjdGlvbiBpbiByZWFsIHRpbWUuXHJcbiAgICAgICAgbGlnaHREaXJlY3Rpb24gPSBuZXcgdmVjMyhTRVRUSU5HUy5saWdodF9kaXJlY3Rpb24ueCwgU0VUVElOR1MubGlnaHRfZGlyZWN0aW9uLnksIFNFVFRJTkdTLmxpZ2h0X2RpcmVjdGlvbi56KS5ub3JtYWxpemUoKTtcclxuICAgICAgICBnbC51bmlmb3JtM2Z2KHVMaWdodERpcmVjdGlvbiwgbGlnaHREaXJlY3Rpb24udG9GbG9hdDMyQXJyYXkoKSk7XHJcblxyXG4gICAgICAgIC8vIENBTUVSQVxyXG4gICAgICAgIC8vIFRPRE86IEFkZCBjYW1lcmEgbW92ZW1lbnQuXHJcbiAgICAgICAgLy8gRWFjaCBmcmFtZSBhZGRzIDEwwrAgdG8gdGhlIGNhbWVyYSBhbmdsZS5cclxuICAgICAgICAvLyBjYW1lcmFBbmdsZSArPSAoZHQgLyAxMDAwKSAqIHRvUmFkaWFuKDEwKTtcclxuICAgICAgICBjb25zdCBjYW1lcmFYID0gMyAqIE1hdGguc2luKGNhbWVyYUFuZ2xlKTtcclxuICAgICAgICBjb25zdCBjYW1lcmFaID0gMyAqIE1hdGguY29zKGNhbWVyYUFuZ2xlKTtcclxuXHJcbiAgICAgICAgLy8gTWFrZSB0aGUgY2FtZXJhIGxvb2sgYXQgdGhlIGNlbnRlci5cclxuICAgICAgICBtYXRWaWV3LnNldExvb2tBdChcclxuICAgICAgICAgICAgbmV3IHZlYzMoY2FtZXJhWCwgLS4yNSwgY2FtZXJhWiksXHJcbiAgICAgICAgICAgIG5ldyB2ZWMzKDAsIDAsIDApLFxyXG4gICAgICAgICAgICBuZXcgdmVjMygwLCAxLCAwKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIFNldCB0aGUgY2FtZXJhIEZPViwgc2NyZWVuIHNpemUsIGFuZCB2aWV3IGRpc3RhbmNlLlxyXG4gICAgICAgIG1hdFByb2ouc2V0UGVyc3BlY3RpdmUoXHJcbiAgICAgICAgICAgIHRvUmFkaWFuKFNFVFRJTkdTLmNhbWVyYV9mb3YpLCAvLyBGT1ZcclxuICAgICAgICAgICAgY2FudmFzLndpZHRoIC8gY2FudmFzLmhlaWdodCwgLy8gQVNQRUNUIFJBVElPXHJcbiAgICAgICAgICAgIDAuMSwgMTAwLjAgLy8gWi1ORUFSIC8gWi1GQVJcclxuICAgICAgICApO1xyXG4gICAgICAgIC8vIEVORCBDQU1FUkFcclxuXHJcbiAgICAgICAgLy8gR0xNOiBtYXRWaWV3UHJvaiA9IG1hdFByb2ogKiBtYXRWaWV3XHJcbiAgICAgICAgbWF0Vmlld1Byb2ogPSBtYXRQcm9qLm11bHRpcGx5KG1hdFZpZXcpO1xyXG5cclxuICAgICAgICBsZXQgd2lkdGggPSBjYW52YXMuY2xpZW50V2lkdGggKiBkZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgICAgIGxldCBoZWlnaHQgPSBjYW52YXMuY2xpZW50SGVpZ2h0ICogZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgICAgICBpZiAoY2FudmFzLndpZHRoICE9PSB3aWR0aCB8fCBjYW52YXMuaGVpZ2h0ICE9PSBoZWlnaHQpIHtcclxuICAgICAgICAgICAgY2FudmFzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgICAgIGdsLnZpZXdwb3J0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnbC5jbGVhckNvbG9yKDAuMDIsIDAuMDIsIDAuMDIsIDEpO1xyXG4gICAgICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUKTtcclxuICAgICAgICBnbC5lbmFibGUoZ2wuREVQVEhfVEVTVCk7XHJcbiAgICAgICAgZ2wuZW5hYmxlKGdsLkNVTExfRkFDRSk7XHJcbiAgICAgICAgZ2wuY3VsbEZhY2UoZ2wuQkFDSyk7XHJcbiAgICAgICAgZ2wuZnJvbnRGYWNlKGdsLkNDVyk7XHJcbiAgICAgICAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtKTtcclxuICAgICAgICBnbC51bmlmb3JtTWF0cml4NGZ2KHVNYXRWaWV3LCBmYWxzZSwgbWF0Vmlld1Byb2oubWF0KTtcclxuXHJcbiAgICAgICAgbW9kZWxzLmZvckVhY2goKG1vZGVsKSA9PiB7XHJcbiAgICAgICAgICAgIG1vZGVsLnJvdGF0ZSgoZHQgLyAxMDAwKSAqIHRvUmFkaWFuKFNFVFRJTkdTLm9iamVjdF9yb3RhdGlvbl9zcGVlZCkpO1xyXG4gICAgICAgICAgICBtb2RlbC5zY2FsZSA9IFNFVFRJTkdTLm9iamVjdF9zaXplO1xyXG4gICAgICAgICAgICBtb2RlbC5kcmF3KGdsLCB1TWF0V29ybGQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBMb29wIGNhbGxzLCBlYWNoIHRpbWUgdGhlIGRyYXdpbmcgaXMgcmVhZHkuXHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZyYW1lKTtcclxuICAgIH07XHJcbiAgICAvLyBGaXJzdCBjYWxsLCBhcyBzb29uIGFzIHRoZSBwYWdlIGlzIGxvYWRlZC5cclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmcmFtZSk7XHJcbiAgICBTRVRUSU5HUy5iZW5jaG1hcmtfbG9hZGluZ190aW1lID0gRGF0ZS5ub3coKSAtIFQwO1xyXG59XHJcblxyXG5cclxuXHJcbnRyeSB7XHJcbiAgICBtYWluKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgc2hvd0Vycm9yKFwiPj4gTm8gRXJyb3JzISDwn4yeXCIpO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaCgoZSkgPT4ge1xyXG4gICAgICAgIHNob3dFcnJvcihgVW5jYXVnaHQgYXN5bmMgZXhjZXB0aW9uOiAke2V9YCk7XHJcbiAgICB9KVxyXG59IGNhdGNoKGUpIHtcclxuICAgIHNob3dFcnJvcihgVW5jYXVnaHQgc3luY2hyb25vdXMgZXhjZXB0aW9uOiAke2V9YCk7XHJcbn1cclxuIiwiaW1wb3J0IHsgdmVjMyB9IGZyb20gXCIuL3ZlYzNcIjtcclxuaW1wb3J0IHsgcXVhdCB9IGZyb20gXCIuL3F1YXRcIjtcclxuXHJcbi8qKlxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmV4cG9ydCBjbGFzcyBtYXQ0IHtcclxuICAgIHB1YmxpYyBtYXQ6IEZsb2F0MzJBcnJheTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLm1hdCA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpO1xyXG4gICAgICAgIHRoaXMuaWRlbnRpdHkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBpZGVudGl0eSBtYXQ0XHJcbiAgICAgKlxyXG4gICAgICogU3RydWN0dXJlOlxyXG4gICAgICpcclxuICAgICAqICAxLCAgMCwgIDAsIDBcclxuICAgICAqXHJcbiAgICAgKiAgMCwgIDEsICAwLCAwXHJcbiAgICAgKlxyXG4gICAgICogIDAsICAwLCAgMSwgMFxyXG4gICAgICpcclxuICAgICAqICAwLCAgMCwgIDAsIDFcclxuICAgICAqIEByZXR1cm5zIGlkZW50aXR5IG1hdDRcclxuICAgICAqL1xyXG4gICAgaWRlbnRpdHkoKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5tYXQuc2V0KFtcclxuICAgICAgICAgICAgMSwgMCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMSwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMSwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMCwgMVxyXG4gICAgICAgIF0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29weSBhIG1hdHJpY2VcclxuICAgICAqIEBwYXJhbSBtYXQgbWF0cmljZSB0byBjb3B5IGZyb21cclxuICAgICAqIEByZXR1cm5zIHVwZGF0ZSB0aGlzIG1hdDRcclxuICAgICAqL1xyXG4gICAgY29weUZyb20obWF0OiBtYXQ0KTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5tYXQuc2V0KG1hdC5tYXQpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTXVsdGlwbHkgYSBtYXRyaWNlIGJ5IGFub3RoZXIgb25lXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIgbWF0cmljZSB0byBtdWx0aXBseSBieVxyXG4gICAgICpcclxuICAgICAqIFN0cnVjdHVyZTpcclxuICAgICAqXHJcbiAgICAgKiAgeCwgIDAsICAwLCAwXHJcbiAgICAgKlxyXG4gICAgICogIDAsICB5LCAgMCwgMFxyXG4gICAgICpcclxuICAgICAqICAwLCAgMCwgIHosIDBcclxuICAgICAqXHJcbiAgICAgKiB0eCwgdHksIHR6LCAxXHJcbiAgICAgKi9cclxuICAgIG11bHRpcGx5KG90aGVyOiBtYXQ0KTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgYSA9IHRoaXMubWF0LCBiID0gb3RoZXIubWF0O1xyXG4gICAgICAgIGNvbnN0IG91dCA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7ICsraSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDQ7ICsraikge1xyXG4gICAgICAgICAgICAgICAgb3V0W2ogKiA0ICsgaV0gPVxyXG4gICAgICAgICAgICAgICAgYVswICogNCArIGldICogYltqICogNCArIDBdICtcclxuICAgICAgICAgICAgICAgIGFbMSAqIDQgKyBpXSAqIGJbaiAqIDQgKyAxXSArXHJcbiAgICAgICAgICAgICAgICBhWzIgKiA0ICsgaV0gKiBiW2ogKiA0ICsgMl0gK1xyXG4gICAgICAgICAgICAgICAgYVszICogNCArIGldICogYltqICogNCArIDNdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm1hdC5zZXQob3V0KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBmb3ZSYWQgRk9WIGluIHJhZGlhbnRcclxuICAgICAqIEBwYXJhbSBhc3BlY3QgQXNwZWN0IHJhdGlvXHJcbiAgICAgKiBAcGFyYW0gbmVhciBOZWFyIHBsYW5lXHJcbiAgICAgKiBAcGFyYW0gZmFyIEZhciBwbGFuZVxyXG4gICAgICpcclxuICAgICAqIFBlcnNwZWN0aXZlIG1hdHJpY2UsIHRoZSBmYWN0b3IgaXMgY2FsY3VsYXRlZCBmcm9tIHRoZSB0YW4gb2YgdGhlIEZPViBkaXZpZGVkIGJ5IDI6XHJcbiAgICAgKlxyXG4gICAgICogV2UgaGF2ZSB0aGUgbmVhciBwbGFuZSBhbmQgZmFyIHBsYW5lLiAob2JqZWN0cyBhcmUgZHJhd24gaW4gYmV0d2VlbilcclxuICAgICAqXHJcbiAgICAgKiBBc3BlY3QgaXMgdGhlIGFzcGVjdCByYXRpbywgbGlrZSAxNjo5IG9uIG1vc3Qgc2NyZWVucy5cclxuICAgICAqXHJcbiAgICAgKiBXZSBjaGFuZ2UgZWFjaCB2ZXJ0aWNlcyB4LCB5IGFuZCB6IGJ5IHRoZSBmb2xsb3dpbmc6XHJcbiAgICAgKlxyXG4gICAgICogMCwgMCwgIDAsICAwXHJcbiAgICAgKlxyXG4gICAgICogMCwgNSwgIDAsICAwXHJcbiAgICAgKlxyXG4gICAgICogMCwgMCwgMTAsIDExXHJcbiAgICAgKlxyXG4gICAgICogMCwgMCwgMTQsIDE1XHJcbiAgICAgKi9cclxuICAgIHNldFBlcnNwZWN0aXZlKGZvdlJhZDogbnVtYmVyLCBhc3BlY3Q6IG51bWJlciwgbmVhcjogbnVtYmVyLCBmYXI6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IGYgPSAxLjAgLyBNYXRoLnRhbihmb3ZSYWQgLyAyKTtcclxuICAgICAgICBjb25zdCBuZiA9IDEgLyAobmVhciAtIGZhcik7XHJcbiAgICAgICAgY29uc3QgbSA9IHRoaXMubWF0O1xyXG4gICAgICAgIG0uc2V0KFtcclxuICAgICAgICAgICAgZiAvIGFzcGVjdCwgICAgIDAsICAgICAgMCwgICAgICAgICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDAsICAgICAgICAgICAgICBmLCAgICAgIDAsICAgICAgICAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAwLCAgICAgICAgICAgICAgMCwgICAgICAoZmFyICsgbmVhcikgKiBuZiwgICAgICAtMSxcclxuICAgICAgICAgICAgMCwgICAgICAgICAgICAgIDAsICAgICAgMipmYXIqbmVhcipuZiwgICAgICAgICAgIDBcclxuICAgICAgICBdKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBsb29rIGF0XHJcbiAgICAgKiBAcGFyYW0gZXllXHJcbiAgICAgKiBAcGFyYW0gY2VudGVyXHJcbiAgICAgKiBAcGFyYW0gdXBcclxuICAgICAqIEByZXR1cm5zIHVwZGF0ZSB0aGlzIG1hdDRcclxuICAgICAqL1xyXG4gICAgc2V0TG9va0F0KGV5ZTogdmVjMywgY2VudGVyOiB2ZWMzLCB1cDogdmVjMyk6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IHogPSBleWUuc3VidHJhY3QoY2VudGVyKS5ub3JtYWxpemUoKTtcclxuICAgICAgICBjb25zdCB4ID0gdXAuY3Jvc3Moeikubm9ybWFsaXplKCk7XHJcbiAgICAgICAgY29uc3QgeSA9IHouY3Jvc3MoeCk7XHJcbiAgICAgICAgY29uc3QgbSA9IHRoaXMubWF0O1xyXG4gICAgICAgIG0uc2V0KFtcclxuICAgICAgICAgICAgeC54LCAgICAgICAgICAgIHkueCwgICAgICAgICAgICB6LngsICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgeC55LCAgICAgICAgICAgIHkueSwgICAgICAgICAgICB6LnksICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgeC56LCAgICAgICAgICAgIHkueiwgICAgICAgICAgICB6LnosICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgLXguZG90KGV5ZSksICAgIC15LmRvdChleWUpLCAgICAtei5kb3QoZXllKSwgICAgMVxyXG4gICAgICAgIF0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHRyYW5zbGF0aW9uIHNjYWxlIGZyb20gcm90YXRpb25cclxuICAgICAqIEBwYXJhbSBxIHF1YXRcclxuICAgICAqIEBwYXJhbSB2IHZlY3RvclxyXG4gICAgICogQHBhcmFtIHMgc2NhbGVcclxuICAgICAqIEByZXR1cm5zIHVwZGF0ZSB0aGlzIG1hdDRcclxuICAgICAqL1xyXG4gICAgc2V0RnJvbVJvdGF0aW9uVHJhbnNsYXRpb25TY2FsZShxOiBxdWF0LCB2OiB2ZWMzLCBzOiB2ZWMzKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgeDIgPSBxLnggKyBxLngsIHkyID0gcS55ICsgcS55LCB6MiA9IHEueiArIHEuejtcclxuICAgICAgICBjb25zdCB4eCA9IHEueCAqIHgyLCB4eSA9IHEueCAqIHkyLCB4eiA9IHEueCAqIHoyO1xyXG4gICAgICAgIGNvbnN0IHl5ID0gcS55ICogeTIsIHl6ID0gcS55ICogejIsIHp6ID0gcS56ICogejI7XHJcbiAgICAgICAgY29uc3Qgd3ggPSBxLncgKiB4Miwgd3kgPSBxLncgKiB5Miwgd3ogPSBxLncgKiB6MjtcclxuXHJcbiAgICAgICAgdGhpcy5tYXQuc2V0KFtcclxuICAgICAgICAgICAgKDEgLSAoeXkgKyB6eikpICogcy54LCAgICAgICh4eSArIHd6KSAqIHMueCwgICAgICAgICh4eiAtIHd5KSAqIHMueCwgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAoeHkgLSB3eikgKiBzLnksICAgICAgICAgICAgKDEgLSAoeHggKyB6eikpICogcy55LCAgKHl6ICsgd3gpICogcy55LCAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICh4eiArIHd5KSAqIHMueiwgICAgICAgICAgICAoeXogLSB3eCkgKiBzLnosICAgICAgICAoMSAtICh4eCArIHl5KSkgKiBzLnosICAgICAgMCxcclxuICAgICAgICAgICAgdi54LCAgICAgICAgICAgICAgICAgICAgICAgIHYueSwgICAgICAgICAgICAgICAgICAgIHYueiwgICAgICAgICAgICAgICAgICAgICAgICAxXHJcbiAgICAgICAgXSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgaW52ZXJ0KCk6IHRoaXMge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG4iLCIvL1xyXG4vLyBDTEFTU1xyXG4vL1xyXG5cclxuaW1wb3J0IHsgdmVjMyB9IGZyb20gXCIuL3ZlYzNcIlxyXG5pbXBvcnQgeyBxdWF0IH0gZnJvbSBcIi4vcXVhdFwiXHJcbmltcG9ydCB7IG1hdDQgfSBmcm9tIFwiLi9tYXQ0XCJcclxuaW1wb3J0IHsgc2hvd0Vycm9yIH0gZnJvbSBcIi4vZnVuY3Rpb25cIlxyXG5pbXBvcnQgeyBnZXRCdWZmZXIgfSBmcm9tIFwiLi9idWZmZXJcIlxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBHTFRGIHtcclxuICAgIG1lc2hlczoge1xyXG4gICAgICAgIG5hbWU6IHN0cmluZyxcclxuICAgICAgICBwcmltaXRpdmVzOiB7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH0sXHJcbiAgICAgICAgICAgIGluZGljZXM/OiBudW1iZXJcclxuICAgICAgICB9W11cclxuICAgIH1bXSxcclxuICAgIGFjY2Vzc29yczoge1xyXG4gICAgICAgIGJ1ZmZlclZpZXc6IG51bWJlcixcclxuICAgICAgICBieXRlT2Zmc2V0PzogbnVtYmVyXHJcbiAgICAgICAgY29tcG9uZW50VHlwZTogbnVtYmVyLFxyXG4gICAgICAgIGNvdW50OiBudW1iZXIsXHJcbiAgICAgICAgdHlwZTogc3RyaW5nXHJcbiAgICB9W10sXHJcbiAgICBidWZmZXJWaWV3czoge1xyXG4gICAgICAgIGJ1ZmZlcjogbnVtYmVyLFxyXG4gICAgICAgIGJ5dGVMZW5ndGg6IG51bWJlcixcclxuICAgICAgICBieXRlT2Zmc2V0OiBudW1iZXJcclxuICAgIH1bXSxcclxuICAgIGJ1ZmZlcnM6IHtcclxuICAgICAgICBieXRlTGVuZ3RoOiBudW1iZXIsXHJcbiAgICAgICAgdXJpOiBzdHJpbmdcclxuICAgIH1bXVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE1vZGVsRGF0YSB7XHJcbiAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICB2ZXJ0aWNlczogRmxvYXQzMkFycmF5LFxyXG4gICAgbm9ybWFsczogRmxvYXQzMkFycmF5LFxyXG4gICAgdXZzOiBGbG9hdDMyQXJyYXksXHJcbiAgICBpbmRpY2VzOiBVaW50MTZBcnJheSB8IFVpbnQzMkFycmF5XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBNb2RlbCB7XHJcbiAgICBwcml2YXRlIG1hdFdvcmxkID0gbmV3IG1hdDQoKTtcclxuICAgIHByaXZhdGUgc2NhbGVWZWMgPSBuZXcgdmVjMygpO1xyXG4gICAgcHJpdmF0ZSByb3RhdGlvbiA9IG5ldyBxdWF0KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBwb3M6IHZlYzMsXHJcbiAgICAgICAgcHVibGljIHNjYWxlOiBudW1iZXIsXHJcbiAgICAgICAgcHJpdmF0ZSByb3RhdGlvbkF4aXM6IHZlYzMsXHJcbiAgICAgICAgcHJpdmF0ZSByb3RhdGlvbkFuZ2xlOiBudW1iZXIsXHJcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IHZhbzogV2ViR0xWZXJ0ZXhBcnJheU9iamVjdCxcclxuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgbnVtSW5kaWNlczogbnVtYmVyXHJcbiAgICApIHsgfVxyXG5cclxuICAgIHJvdGF0ZShhbmdsZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbkFuZ2xlID0gdGhpcy5yb3RhdGlvbkFuZ2xlICsgYW5nbGU7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyhnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCwgbWF0V29ybGRVbmlmb3JtOiBXZWJHTFVuaWZvcm1Mb2NhdGlvbikge1xyXG4gICAgICAgIHRoaXMucm90YXRpb24uc2V0QXhpc0FuZ2xlKHRoaXMucm90YXRpb25BeGlzLCB0aGlzLnJvdGF0aW9uQW5nbGUpO1xyXG4gICAgICAgIHRoaXMuc2NhbGVWZWMuc2V0KHRoaXMuc2NhbGUsIHRoaXMuc2NhbGUsIHRoaXMuc2NhbGUpO1xyXG5cclxuICAgICAgICB0aGlzLm1hdFdvcmxkLnNldEZyb21Sb3RhdGlvblRyYW5zbGF0aW9uU2NhbGUodGhpcy5yb3RhdGlvbiwgdGhpcy5wb3MsIHRoaXMuc2NhbGVWZWMpO1xyXG5cclxuICAgICAgICBnbC51bmlmb3JtTWF0cml4NGZ2KG1hdFdvcmxkVW5pZm9ybSwgZmFsc2UsIHRoaXMubWF0V29ybGQubWF0KTtcclxuICAgICAgICBnbC5iaW5kVmVydGV4QXJyYXkodGhpcy52YW8pO1xyXG4gICAgICAgIGdsLmRyYXdFbGVtZW50cyhnbC5UUklBTkdMRVMsIHRoaXMubnVtSW5kaWNlcywgZ2wuVU5TSUdORURfU0hPUlQsIDApO1xyXG4gICAgICAgIGdsLmJpbmRWZXJ0ZXhBcnJheShudWxsKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogTG9hZCBtb2RlbHMgYW5kIHJldHVybiBidWZmZXJzXHJcbiAqIEBwYXJhbSB1cmxfZ2x0ZiBwYXRoIHRvIC5nbHRmIGZpbGVcclxuICogQHBhcmFtIHVybF9iaW4gcGF0aCB0byAuYmluIGZpbGVcclxuICogQHJldHVybnMgYnVmZmVyc1xyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvYWRNb2RlbCh1cmxfZ2x0Zjogc3RyaW5nLCB1cmxfYmluOiBzdHJpbmcpOiBQcm9taXNlPE1vZGVsRGF0YVtdPiB7XHJcbiAgICBjb25zdCBnbHRmOiBHTFRGID0gYXdhaXQgZmV0Y2godXJsX2dsdGYpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgICBzaG93RXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihyZXNwb25zZS5zdGF0dXNUZXh0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcclxuICAgIH0pO1xyXG4gICAgY29uc3QgYmluOiBBcnJheUJ1ZmZlciA9IGF3YWl0IGZldGNoKHVybF9iaW4pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgICBzaG93RXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihyZXNwb25zZS5zdGF0dXNUZXh0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmFycmF5QnVmZmVyKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBtb2RlbHM6IE1vZGVsRGF0YVtdID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgbWVzaCBvZiBnbHRmLm1lc2hlcykge1xyXG4gICAgICAgIGxldCBuYW1lID0gbWVzaC5uYW1lO1xyXG4gICAgICAgIGZvciAobGV0IHByaW0gb2YgbWVzaC5wcmltaXRpdmVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IE1vZGVsRGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgICAgICAgICAgICB2ZXJ0aWNlczogZ2V0QnVmZmVyKGdsdGYsIGJpbiwgcHJpbS5hdHRyaWJ1dGVzLlBPU0lUSU9OKSBhcyBGbG9hdDMyQXJyYXksXHJcbiAgICAgICAgICAgICAgICBub3JtYWxzOiBnZXRCdWZmZXIoZ2x0ZiwgYmluLCBwcmltLmF0dHJpYnV0ZXMuTk9STUFMKSBhcyBGbG9hdDMyQXJyYXksXHJcbiAgICAgICAgICAgICAgICB1dnM6IGdldEJ1ZmZlcihnbHRmLCBiaW4sIHByaW0uYXR0cmlidXRlcy5URVhDT09SRF8wKSBhcyBGbG9hdDMyQXJyYXksXHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzOiBnZXRCdWZmZXIoZ2x0ZiwgYmluLCBwcmltLmluZGljZXMhKSBhcyBVaW50MTZBcnJheVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1vZGVscy5wdXNoKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbW9kZWxzO1xyXG59XHJcbiIsImltcG9ydCB7IHZlYzMgfSBmcm9tIFwiLi92ZWMzXCI7XHJcblxyXG4vKipcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBwYXJhbSB4IGRlZmF1bHQgMFxyXG4gKiBAcGFyYW0geSBkZWZhdWx0IDBcclxuICogQHBhcmFtIHogZGVmYXVsdCAwXHJcbiAqIEBwYXJhbSB3IGRlZmF1bHQgMVxyXG4gKiBAbWV0aG9kIHNldEF4aXNBbmdsZVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIHF1YXQge1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHVibGljIHg6IG51bWJlciA9IDAsXHJcbiAgICAgICAgcHVibGljIHk6IG51bWJlciA9IDAsXHJcbiAgICAgICAgcHVibGljIHo6IG51bWJlciA9IDAsXHJcbiAgICAgICAgcHVibGljIHc6IG51bWJlciA9IDFcclxuICAgICkge31cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBheGlzIGFuZ2xlXHJcbiAgICAgKiBAcGFyYW0gYXhpcyB2ZWMzXHJcbiAgICAgKiBAcGFyYW0gYW5nbGUgbnVtYmVyIGRpdmlkZWQgYnkgMiB0byBnZXQgaGFsZlxyXG4gICAgICogQHJldHVybnNcclxuICAgICAqL1xyXG4gICAgc2V0QXhpc0FuZ2xlKGF4aXM6IHZlYzMsIGFuZ2xlOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBub3JtID0gYXhpcy5ub3JtYWxpemUoKTtcclxuICAgICAgICBjb25zdCBoYWxmID0gYW5nbGUgLyAyO1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihoYWxmKTtcclxuXHJcbiAgICAgICAgdGhpcy54ID0gbm9ybS54ICogcztcclxuICAgICAgICB0aGlzLnkgPSBub3JtLnkgKiBzO1xyXG4gICAgICAgIHRoaXMueiA9IG5vcm0ueiAqIHM7XHJcbiAgICAgICAgdGhpcy53ID0gTWF0aC5jb3MoaGFsZik7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IHNob3dFcnJvciB9IGZyb20gXCIuL2Z1bmN0aW9uXCI7XHJcblxyXG4vKipcclxuICogQHBhcmFtIHVybCBQYXRoIHRvIGltYWdlIGZpbGVcclxuICogQHJldHVybnMgUmV0dXJuIGFuIGltYWdlXHJcbiAqIEBhc3luY1xyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEltYWdlKHVybDogc3RyaW5nKTogUHJvbWlzZTxIVE1MSW1hZ2VFbGVtZW50PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgIGltYWdlLnNyYyA9IHVybDtcclxuICAgICAgICBpbWFnZS5vbmxvYWQgPSAoKSA9PiByZXNvbHZlKGltYWdlKTtcclxuICAgIH0pXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2V0IHNoYWRlcnMgc291cmNlIGNvZGVcclxuICogQHBhcmFtIHVybCBQYXRoIHRvIHNoYWRlciBmaWxlXHJcbiAqIEByZXR1cm5zIFJldHVybiB0ZXh0XHJcbiAqIEBhc3luY1xyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNoYWRlclNvdXJjZSh1cmw6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCk7XHJcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciAke3Jlc3BvbnNlLnN0YXR1c1RleHR9IHdoaWxlIGxvYWRpbmcgc2hhZGVyIGNvZGUgYXQgXCIke3VybH1cImApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBDcmVhdGUgYSBXZWJHTCBwcm9ncmFtIGFuZCBsaW5rIHRoZSB2ZXJ0ZXggYW5kIGZyYWdtZW50IHNoYWRlciBzb3VyY2UgY29kZSB0byBpdC5cclxuICogQHBhcmFtIGdsIFdlYkdMIFJlbmRlcmluZyBDb250ZXh0XHJcbiAqIEBwYXJhbSB2ZXJ0ZXhTaGFkZXJTcmMgVmVydGV4IFNoYWRlciBTb3VyY2UgQ29kZVxyXG4gKiBAcGFyYW0gZnJhZ21lbnRTaGFkZXJTcmMgRnJhZ21lbnQgU2hhZGVyIFNvdXJjZSBDb2RlXHJcbiAqIEByZXR1cm5zIFJldHVybiBXZWJHTCBwcm9ncmFtXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUHJvZ3JhbShcclxuICAgIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LFxyXG4gICAgdmVydGV4U2hhZGVyU3JjOiBzdHJpbmcsXHJcbiAgICBmcmFnbWVudFNoYWRlclNyYzogc3RyaW5nXHJcbik6IFdlYkdMUHJvZ3JhbSB7XHJcbiAgICBjb25zdCB2ZXJ0ZXhTaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoZ2wuVkVSVEVYX1NIQURFUikgYXMgV2ViR0xTaGFkZXI7XHJcbiAgICBjb25zdCBmcmFnbWVudFNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbC5GUkFHTUVOVF9TSEFERVIpIGFzIFdlYkdMU2hhZGVyO1xyXG4gICAgY29uc3QgcHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcclxuXHJcbiAgICBnbC5zaGFkZXJTb3VyY2UodmVydGV4U2hhZGVyLCB2ZXJ0ZXhTaGFkZXJTcmMpO1xyXG4gICAgZ2wuY29tcGlsZVNoYWRlcih2ZXJ0ZXhTaGFkZXIpO1xyXG4gICAgaWYoIWdsLmdldFNoYWRlclBhcmFtZXRlcih2ZXJ0ZXhTaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSkge1xyXG4gICAgICAgIGNvbnN0IGVycm9yID0gZ2wuZ2V0U2hhZGVySW5mb0xvZyh2ZXJ0ZXhTaGFkZXIpO1xyXG4gICAgICAgIHNob3dFcnJvcihlcnJvciB8fCBcIk5vIHNoYWRlciBkZWJ1ZyBsb2cgcHJvdmlkZWQuXCIpO1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIGdsLnNoYWRlclNvdXJjZShmcmFnbWVudFNoYWRlciwgZnJhZ21lbnRTaGFkZXJTcmMpO1xyXG4gICAgZ2wuY29tcGlsZVNoYWRlcihmcmFnbWVudFNoYWRlcik7XHJcbiAgICBpZighZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKGZyYWdtZW50U2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUykpIHtcclxuICAgICAgICBjb25zdCBlcnJvciA9IGdsLmdldFNoYWRlckluZm9Mb2coZnJhZ21lbnRTaGFkZXIpO1xyXG4gICAgICAgIHNob3dFcnJvcihlcnJvciB8fCBcIk5vIHNoYWRlciBkZWJ1ZyBsb2cgcHJvdmlkZWQuXCIpO1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFByb2dyYW0gc2V0IHVwIGZvciBVbmlmb3Jtcy5cclxuICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCB2ZXJ0ZXhTaGFkZXIpO1xyXG4gICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIGZyYWdtZW50U2hhZGVyKTtcclxuICAgIGdsLmxpbmtQcm9ncmFtKHByb2dyYW0pO1xyXG4gICAgaWYoIWdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpKSB7XHJcbiAgICAgICAgY29uc3QgZXJyb3IgPSBnbC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9ncmFtKTtcclxuICAgICAgICBzaG93RXJyb3IoZXJyb3IgfHwgXCJObyBwcm9ncmFtIGRlYnVnIGxvZyBwcm92aWRlZC5cIik7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcHJvZ3JhbTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBhIFdlYkdMIHRleHR1cmUgYW5kIGJpbmQgaXQgdG8gYSBURVhUVVJFXzJEX0FSUkFZLlxyXG4gKiBTZXQgdGhlIHBhcmFtZXRlcnMgZm9yIHRoZSB0ZXh0dXJlIHN0b3JhZ2UuIChUYXJnZXQsIE1pcG1hcF9MZXZlbHMsIEludGVybmFsX0Zvcm1hdCwgV2lkdGgsIEhlaWdodCwgSW1hZ2VzX0NvdW50KVxyXG4gKiBGbGlwIHRoZSBvcmlnaW4gcG9pbnQgb2YgV2ViR0wuIChQTkcgZm9ybWF0IHN0YXJ0cyBhdCB0aGUgdG9wIGFuZCBXZWJHTCBhdCB0aGUgYm90dG9tKVxyXG4gKiBCZWNhdXNlIHRleFN1YkltYWdlM0QgaXMgYXN5bmMsIHdhaXRpbmcgZm9yIGVhY2ggaW1hZ2UgdG8gbG9hZCBpcyBzbG93LiBTbywgd2UgcHJlbG9hZCBhbGwgaW1hZ2VzIHVzaW5nIGEgUHJvbWlzZS5cclxuICogU2V0IHRoZSBwYXJhbWV0ZXJzIG9uIGhvdyB0byBzdG9yZSBlYWNoIHRleHR1cmUuIChUYXJnZXQsIE1pcG1hcF9MZXZlbCwgSW50ZXJuYWxfRm9ybWF0LCBXaWR0aCwgSGVpZ2h0LCBEZXB0aCwgQm9yZGVyLCBGb3JtYXQsIFR5cGUsIE9mZnNldClcclxuICogQ2hhbmdlIHRoZSBtaW5pbXVtIGFuZCBtYWduaXR1ZGUgZmlsdGVycyB3aGVuIHNjYWxpbmcgdXAgYW5kIGRvd24gdGV4dHVyZXMuXHJcbiAqIEBwYXJhbSBnbCBXZWJHTCBSZW5kZXJpbmcgQ29udGV4dFxyXG4gKiBAcGFyYW0gdGV4dHVyZXMgdGV4dHVyZSBsaXN0XHJcbiAqIEBhc3luY1xyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvYWRUZXh0dXJlKGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LCB0ZXh0dXJlczogc3RyaW5nW10pIHtcclxuICAgIGNvbnN0IHRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJEX0FSUkFZLCB0ZXh0dXJlKTtcclxuICAgIGdsLnRleFN0b3JhZ2UzRChnbC5URVhUVVJFXzJEX0FSUkFZLCAxLCBnbC5SR0JBOCwgMTI4LCAxMjgsIHRleHR1cmVzLmxlbmd0aCk7XHJcbiAgICBnbC5waXhlbFN0b3JlaShnbC5VTlBBQ0tfRkxJUF9ZX1dFQkdMLCB0cnVlKTtcclxuXHJcbiAgICBjb25zdCBpbWFnZXMgPSBhd2FpdCBQcm9taXNlLmFsbCh0ZXh0dXJlcy5tYXAoc3JjID0+IGdldEltYWdlKHNyYykpKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW1hZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZ2wudGV4U3ViSW1hZ2UzRChnbC5URVhUVVJFXzJEX0FSUkFZLCAwLCAwLCAwLCBpLCAxMjgsIDEyOCwgMSwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgaW1hZ2VzW2ldKTtcclxuICAgIH1cclxuXHJcbiAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkRfQVJSQVksIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTkVBUkVTVCk7XHJcbiAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkRfQVJSQVksIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTkVBUkVTVCk7XHJcbn1cclxuIiwiaW1wb3J0IHsgUGFuZSB9IGZyb20gJ3R3ZWFrcGFuZSc7XHJcblxyXG5leHBvcnQgY29uc3QgcGFuZSA9IG5ldyBQYW5lKHt0aXRsZTogJ1NldHRpbmdzJywgZXhwYW5kZWQ6IHRydWV9KTtcclxuXHJcbmV4cG9ydCBjb25zdCBTRVRUSU5HUyA9IHtcclxuXHJcbiAgICBjYW1lcmFfZm92OiAzMC4wLFxyXG5cclxuICAgIG9iamVjdF9yb3RhdGlvbl9zcGVlZDogMTAuMCxcclxuICAgIG9iamVjdF9zaXplOiAwLjQsXHJcblxyXG4gICAgbGlnaHRfZGlyZWN0aW9uOiB7eDogMS4wLCB5OiAxLjAsIHo6IDEuMH0sXHJcblxyXG4gICAgYmVuY2htYXJrX2ZwczogMC4wLFxyXG4gICAgYmVuY2htYXJrX2xvYWRpbmdfdGltZTogMC4wLFxyXG5cclxuICAgIHNvdXJjZV9naXRodWI6ICdodHRwczovL2dpdGh1Yi5jb20vVmFoYXovTGVhcm5pbmctV2ViR0wnLFxyXG4gICAgc291cmNlX3R3ZWFrcGFuZTogJ2h0dHBzOi8vdHdlYWtwYW5lLmdpdGh1Yi5pby9kb2NzLydcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xyXG5cclxuICAgIC8vIENBTUVSQVxyXG5cclxuICAgIGNvbnN0IGZDYW1lcmEgPSBwYW5lLmFkZEZvbGRlcih7dGl0bGU6ICdDYW1lcmEnLCBleHBhbmRlZDogZmFsc2V9KTtcclxuXHJcbiAgICBmQ2FtZXJhLmFkZEJpbmRpbmcoU0VUVElOR1MsICdjYW1lcmFfZm92Jywge1xyXG4gICAgICAgIGxhYmVsOiAnRk9WJyxcclxuICAgICAgICBtaW46IDMwLjAsXHJcbiAgICAgICAgbWF4OiAxMjAuMCxcclxuICAgICAgICBzdGVwOiA1LjBcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIE9CSkVDVFxyXG5cclxuICAgIGNvbnN0IGZPYmplY3QgPSBwYW5lLmFkZEZvbGRlcih7dGl0bGU6ICdPYmplY3QnLCBleHBhbmRlZDogZmFsc2V9KTtcclxuXHJcbiAgICBmT2JqZWN0LmFkZEJpbmRpbmcoU0VUVElOR1MsICdvYmplY3Rfcm90YXRpb25fc3BlZWQnLCB7XHJcbiAgICAgICAgbGFiZWw6ICdSLiBTcGVlZCcsXHJcbiAgICAgICAgbWluOiAwLjAsXHJcbiAgICAgICAgbWF4OiAxODAuMCxcclxuICAgICAgICBzdGVwOiAxLjBcclxuICAgIH0pO1xyXG5cclxuICAgIGZPYmplY3QuYWRkQmluZGluZyhTRVRUSU5HUywgJ29iamVjdF9zaXplJywge1xyXG4gICAgICAgIGxhYmVsOiAnU2l6ZScsXHJcbiAgICAgICAgbWluOiAwLjEsXHJcbiAgICAgICAgbWF4OiAxLjAsXHJcbiAgICAgICAgc3RlcDogMC4xXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBMSUdIVFxyXG5cclxuICAgIGNvbnN0IGZMaWdodCA9IHBhbmUuYWRkRm9sZGVyKHt0aXRsZTogJ0xpZ2h0JywgZXhwYW5kZWQ6IGZhbHNlfSk7XHJcblxyXG4gICAgZkxpZ2h0LmFkZEJpbmRpbmcoU0VUVElOR1MsICdsaWdodF9kaXJlY3Rpb24nLCB7XHJcbiAgICAgICAgbGFiZWw6ICdBbWJpZW50IExpZ2h0JyxcclxuICAgICAgICB4OiB7bWluOiAtMS4wLCBtYXg6IDEuMH0sXHJcbiAgICAgICAgeToge21pbjogLTEuMCwgbWF4OiAxLjB9LFxyXG4gICAgICAgIHo6IHttaW46IC0xLjAsIG1heDogMS4wfSxcclxuICAgICAgICBpbnRlcnZhbDogMTAwXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIEJFTkNITUFSS1xyXG5cclxuICAgIGNvbnN0IGZCZW5jaG1hcmsgPSBwYW5lLmFkZEZvbGRlcih7dGl0bGU6ICdUaW1lcnMnLCBleHBhbmRlZDogdHJ1ZX0pO1xyXG5cclxuICAgIGZCZW5jaG1hcmsuYWRkQmluZGluZyhTRVRUSU5HUywgJ2JlbmNobWFya19mcHMnLCB7XHJcbiAgICAgICAgbGFiZWw6ICdGUFMnLFxyXG4gICAgICAgIHJlYWRvbmx5OiB0cnVlLFxyXG4gICAgICAgIHZpZXc6ICd0ZXh0JyxcclxuICAgICAgICBpbnRlcnZhbDogNTAwXHJcbiAgICB9KTtcclxuXHJcbiAgICBmQmVuY2htYXJrLmFkZEJpbmRpbmcoU0VUVElOR1MsICdiZW5jaG1hcmtfbG9hZGluZ190aW1lJywge1xyXG4gICAgICAgIGxhYmVsOiAnTG9hZGluZyBUaW1lJyxcclxuICAgICAgICByZWFkb25seTogdHJ1ZSxcclxuICAgICAgICBmb3JtYXQ6ICh2YWx1ZTogbnVtYmVyKTogc3RyaW5nID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRvRml4ZWQoMSkgKyAnbXMnO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFNPVVJDRVxyXG5cclxuICAgIGNvbnN0IGZTb3VyY2UgPSBwYW5lLmFkZEZvbGRlcih7dGl0bGU6ICdTb3VyY2VzJywgZXhwYW5kZWQ6IGZhbHNlfSk7XHJcblxyXG4gICAgZlNvdXJjZS5hZGRCdXR0b24oe3RpdGxlOiAnU2VlIFJlcG9zaXRvcnknLCBsYWJlbDogJ0dpdGh1YiBSZXBvc2l0b3J5J30pLm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICB3aW5kb3cub3BlbihTRVRUSU5HUy5zb3VyY2VfZ2l0aHViLCAnX2JsYW5rJyk7XHJcbiAgICB9KTtcclxuICAgIGZTb3VyY2UuYWRkQnV0dG9uKHt0aXRsZTogJ1NlZSBQYWdlJywgbGFiZWw6ICdUd2Vha3BhbmUgRG9jcyd9KS5vbignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgd2luZG93Lm9wZW4oU0VUVElOR1Muc291cmNlX3R3ZWFrcGFuZSwgJ19ibGFuaycpO1xyXG4gICAgfSk7XHJcbn07XHJcbiIsIi8qKlxyXG4gKiBAY29uc3RydWN0b3JcclxuICogQHBhcmFtIHggLSBkZWZhdWx0IDBcclxuICogQHBhcmFtIHkgLSBkZWZhdWx0IDBcclxuICogQHBhcmFtIHogLSBkZWZhdWx0IDBcclxuICovXHJcbmV4cG9ydCBjbGFzcyB2ZWMzIHtcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHB1YmxpYyB4OiBudW1iZXIgPSAwLjAsXHJcbiAgICAgICAgcHVibGljIHk6IG51bWJlciA9IDAuMCxcclxuICAgICAgICBwdWJsaWMgejogbnVtYmVyID0gMC4wXHJcbiAgICApIHt9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSB2ZWN0b3JcclxuICAgICAqIEBwYXJhbSB2IHZlY3RvciB0byBhZGQgYnlcclxuICAgICAqIEByZXR1cm5zIG5ldyB2ZWMzXHJcbiAgICAgKi9cclxuICAgIGFkZCh2OiB2ZWMzKTogdmVjMyB7IHJldHVybiBuZXcgdmVjMyh0aGlzLnggKyB2LngsIHRoaXMueSArIHYueSwgdGhpcy56ICsgdi56KSB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTdWJzdHJhY3QgYSB2ZWN0b3JcclxuICAgICAqIEBwYXJhbSB2IHZlY3RvciB0byBzdWJzdHJhY3QgYnlcclxuICAgICAqIEByZXR1cm5zIG5ldyB2ZWMzXHJcbiAgICAgKi9cclxuICAgIHN1YnRyYWN0KHY6IHZlYzMpOiB2ZWMzIHsgcmV0dXJuIG5ldyB2ZWMzKHRoaXMueCAtIHYueCwgdGhpcy55IC0gdi55LCB0aGlzLnogLSB2LnopIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE11bHRpcGx5IGEgdmVjdG9yXHJcbiAgICAgKiBAcGFyYW0gdiB2ZWN0b3IgdG8gbXVsdGlwbHkgYnlcclxuICAgICAqIEByZXR1cm5zIG5ldyB2ZWMzXHJcbiAgICAgKi9cclxuICAgIG11bHRpcGx5KHY6IHZlYzMpOiB2ZWMzIHsgcmV0dXJuIG5ldyB2ZWMzKHRoaXMueCAqIHYueCwgdGhpcy55ICogdi55LCB0aGlzLnogKiB2LnopIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBhIGNvb3JkaW5hdGVcclxuICAgICAqIEBwYXJhbSB4IGNvb3JkaW5hdGUgdG8gY2hhbmdlXHJcbiAgICAgKiBAcGFyYW0geSBjb29yZGluYXRlIHRvIGNoYW5nZVxyXG4gICAgICogQHBhcmFtIHogY29vcmRpbmF0ZSB0byBjaGFuZ2VcclxuICAgICAqIEByZXR1cm5zIHVwZGF0ZSB0aGlzIHZlYzNcclxuICAgICAqL1xyXG4gICAgc2V0KHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy56ID0gejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE5vcm1hbGl6ZSBhIHZlY3RvclxyXG4gICAgICogQHJldHVybnMgbmV3IHZlYzNcclxuICAgICAqL1xyXG4gICAgbm9ybWFsaXplKCk6IHZlYzMge1xyXG4gICAgICAgIGNvbnN0IGxlbiA9IE1hdGguaHlwb3QodGhpcy54LCB0aGlzLnksIHRoaXMueik7XHJcbiAgICAgICAgcmV0dXJuIGxlbiA+IDAgPyBuZXcgdmVjMyh0aGlzLnggLyBsZW4sIHRoaXMueSAvIGxlbiwgdGhpcy56IC8gbGVuKSA6IG5ldyB2ZWMzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcm9zcyBwcm9kdWN0IG9mIGEgdmVjdG9yXHJcbiAgICAgKiBAcGFyYW0gdiB2ZWN0b3IgdG8gY3Jvc3MgcHJvZHVjdCBieVxyXG4gICAgICogQHJldHVybnMgbmV3IHZlYzNcclxuICAgICAqL1xyXG4gICAgY3Jvc3ModjogdmVjMyk6IHZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgdmVjMyhcclxuICAgICAgICAgICAgdGhpcy55ICogdi56IC0gdGhpcy56ICogdi55LFxyXG4gICAgICAgICAgICB0aGlzLnogKiB2LnggLSB0aGlzLnggKiB2LnosXHJcbiAgICAgICAgICAgIHRoaXMueCAqIHYueSAtIHRoaXMueSAqIHYueFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEb3QgcHJvZHVjdCBvZiBhIHZlY3RvclxyXG4gICAgICogQHBhcmFtIHYgdmVjdG9yIHRvIGRvdCBwcm9kdWN0IGJ5XHJcbiAgICAgKiBAcmV0dXJucyB1cGRhdGUgdGhpcyB2ZWMzXHJcbiAgICAgKi9cclxuICAgIGRvdCh2OiB2ZWMzKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMueCAqIHYueCArIHRoaXMueSAqIHYueSArIHRoaXMueiAqIHYueiB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0IGEgdmVjdG9yIHRvIGEgRmxvYXQzMkFycmF5XHJcbiAgICAgKiBAcGFyYW0gdiB2ZWN0b3JcclxuICAgICAqIEByZXR1cm5zIG5ldyBGbG9hdDMyQXJyYXlcclxuICAgICAqL1xyXG4gICAgdG9GbG9hdDMyQXJyYXkoKTogRmxvYXQzMkFycmF5IHsgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3RoaXMueCwgdGhpcy55LCB0aGlzLnpdKTsgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydCBhIHZlY3RvciB0byBhbiBBcnJheVxyXG4gICAgICogQHBhcmFtIHYgdmVjdG9yXHJcbiAgICAgKiBAcmV0dXJucyBuZXcgQXJyYXkgbnVtYmVyW11cclxuICAgICAqL1xyXG4gICAgdG9BcnJheSgpOiBudW1iZXJbXSB7IHJldHVybiBbdGhpcy54LCB0aGlzLnksIHRoaXMuel0gfVxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rd2ViZ2xcIl0gPSBzZWxmW1wid2VicGFja0NodW5rd2ViZ2xcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcImxpYlwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9tYWluLnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9