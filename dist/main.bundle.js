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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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WyJ3ZWJwYWNrOi8vd2ViZ2wvLi9zcmMvYnVmZmVyLnRzIiwid2VicGFjazovL3dlYmdsLy4vc3JjL2Z1bmN0aW9uLnRzIiwid2VicGFjazovL3dlYmdsLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vd2ViZ2wvLi9zcmMvbWF0NC50cyIsIndlYnBhY2s6Ly93ZWJnbC8uL3NyYy9tb2RlbC50cyIsIndlYnBhY2s6Ly93ZWJnbC8uL3NyYy9xdWF0LnRzIiwid2VicGFjazovL3dlYmdsLy4vc3JjL3NoYWRlci50cyIsIndlYnBhY2s6Ly93ZWJnbC8uL3NyYy90d2Vha3BhbmUudHMiLCJ3ZWJwYWNrOi8vd2ViZ2wvLi9zcmMvdmVjMy50cyIsIndlYnBhY2s6Ly93ZWJnbC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly93ZWJnbC93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL3dlYmdsL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWJnbC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYmdsL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2ViZ2wvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vd2ViZ2wvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly93ZWJnbC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vd2ViZ2wvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNob3dFcnJvciB9IGZyb20gXCIuL2Z1bmN0aW9uXCI7XHJcbmltcG9ydCB7IEdMVEYgfSBmcm9tIFwiLi9tb2RlbFwiO1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBhIFdlYkdMIEJ1ZmZlciB0eXBlLiAoT3BhcXVlIEhhbmRsZSlcclxuICogLSBTVEFUSUNfRFJBVyA6IHdvbid0IHVwZGF0ZSBvZnRlbiwgYnV0IG9mdGVuIHVzZWQuXHJcbiAqIC0gQVJSQVlfQlVGRkVSIDogaW5kaWNhdGUgdGhlIHBsYWNlIHRvIHN0b3JlIHRoZSBBcnJheS5cclxuICogLSBFTEVNRU5UX0FSUkFZX0JVRkZFUiA6IFVzZWQgZm9yIGluZGljZXMgd2l0aCBjdWJlIHNoYXBlIGRyYXdpbmcuXHJcbiAqIEJpbmQgdGhlIEJ1ZmZlciB0byB0aGUgQ1BVLCBhZGQgdGhlIEFycmF5IHRvIHRoZSBCdWZmZXIgYW5kIENsZWFyIGFmdGVyIHVzZS5cclxuICogQHBhcmFtIGdsIC0gV2ViR0wgUmVuZGVyaW5nIENvbnRleHRcclxuICogQHBhcmFtIGRhdGEgLSBCdWZmZXJzXHJcbiAqIEBwYXJhbSBpc0luZGljZSAtIFZlcnRpY2VzIG9yIEluZGljZXMgP1xyXG4gKiBAcmV0dXJucyBidWZmZXJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTdGF0aWNCdWZmZXIoXHJcbiAgICBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcclxuICAgIGRhdGE6IGFueSxcclxuICAgIGlzSW5kaWNlOiBib29sZWFuXHJcbik6IFdlYkdMQnVmZmVyIHtcclxuICAgIGNvbnN0IGJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgY29uc3QgdHlwZSA9IChpc0luZGljZSA9PSB0cnVlKSA/IGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSIDogZ2wuQVJSQVlfQlVGRkVSXHJcbiAgICBpZighYnVmZmVyKSB7XHJcbiAgICAgICAgc2hvd0Vycm9yKFwiRmFpbGVkIHRvIGFsbG9jYXRlIGJ1ZmZlciBzcGFjZVwiKTtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICBnbC5iaW5kQnVmZmVyKHR5cGUsIGJ1ZmZlcik7XHJcbiAgICBnbC5idWZmZXJEYXRhKHR5cGUsIGRhdGEsIGdsLlNUQVRJQ19EUkFXKTtcclxuICAgIGdsLmJpbmRCdWZmZXIodHlwZSwgbnVsbCk7XHJcbiAgICByZXR1cm4gYnVmZmVyXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgdmVydGV4IGFycmF5IG9iamVjdCBidWZmZXJzLCBpdCByZWFkcyB0aGUgdmVydGljZXMgZnJvbSBHUFUgQnVmZmVyLlxyXG4gKiBUaGUgdmVydGV4IGJ1ZmZlciBjb250YWlucyB0aGUgdmVydGljZXMnIGNvb3JkaW5hdGVzIChjYW4gYWxzbyBjb250YWluIGNvbG9yIGFuZCBzaXplKS5cclxuICogVGhlIGluZGV4IGJ1ZmZlciBjb250YWlucyB3aGljaCB2ZXJ0ZXggbmVlZHMgdG8gYmUgZHJhd24gb24gc2NlbmUgdG8gYXZvaWQgZHVwbGljYXRlIHZlcnRpY2VzLlxyXG4gKiBJbiBjYXNlIG9mIGNvbG9ycywgYW4gb2Zmc2V0IG9mIDMgZmxvYXRzIGlzIHVzZWQgZWFjaCB0aW1lIHRvIGF2b2lkICh4LCB5LCB6KSBjb29yZGluYXRlcy5cclxuICogVGhlIHZlcnRleCBzaGFkZXIgcGxhY2VzIHRoZSB2ZXJ0aWNlcyBpbiBjbGlwIHNwYWNlIGFuZCB0aGUgZnJhZ21lbnQgc2hhZGVyIGNvbG9ycyB0aGUgcGl4ZWxzLiAoRGVmYXVsdDogMClcclxuICogVmVydGV4QXR0cmliUG9pbnRlciBbSW5kZXgsIFNpemUsIFR5cGUsIElzTm9ybWFsaXplZCwgU3RyaWRlLCBPZmZzZXRdXHJcbiAqIC0gSW5kZXggKGxvY2F0aW9uKVxyXG4gKiAtIFNpemUgKENvbXBvbmVudCBwZXIgdmVjdG9yKVxyXG4gKiAtIFR5cGVcclxuICogLSBJc05vcm1hbGl6ZWQgKGludCB0byBmbG9hdHMsIGZvciBjb2xvcnMgdHJhbnNmb3JtIFswLCAyNTVdIHRvIGZsb2F0IFswLCAxXSlcclxuICogLSBTdHJpZGUgKERpc3RhbmNlIGJldHdlZW4gZWFjaCB2ZXJ0ZXggaW4gdGhlIGJ1ZmZlcilcclxuICogLSBPZmZzZXQgKE51bWJlciBvZiBza2lwZWQgYnl0ZXMgYmVmb3JlIHJlYWRpbmcgYXR0cmlidXRlcylcclxuICogQHBhcmFtIGdsIC0gV2ViR0wgUmVuZGVyaW5nIENvbnRleHRcclxuICogQHBhcmFtIHZlcnRleEJ1ZmZlciAtIHZlcnRpY2VzIGJ1ZmZlclxyXG4gKiBAcGFyYW0gaW5kZXhCdWZmZXIgLSBpbmRleGVzIGJ1ZmZlclxyXG4gKiBAcGFyYW0gdXZCdWZmZXIgLSBVViBidWZmZXJcclxuICogQHBhcmFtIG5vcm1hbEJ1ZmZlciAtIE5vcm1hbCBidWZmZXJcclxuICogQHBhcmFtIHBvc0F0dHJpYiAtIFBvc2l0aW9uIGF0dHJpYnV0ZXNcclxuICogQHBhcmFtIHV2QXR0cmliIC0gVVYgYXR0cmlidXRlc1xyXG4gKiBAcGFyYW0gbm9ybWFsQXR0cmliIC0gTm9ybWFscyBhdHRyaWJ1dGVzXHJcbiAqIEByZXR1cm5zIFZlcnRleCBBcnJheSBPYmplY3QgKFZBTylcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVWQU9CdWZmZXIoXHJcbiAgICBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcclxuICAgIHZlcnRleEJ1ZmZlcjogV2ViR0xCdWZmZXIsXHJcbiAgICBpbmRleEJ1ZmZlcjogV2ViR0xCdWZmZXIsXHJcbiAgICB1dkJ1ZmZlcjogV2ViR0xCdWZmZXIsXHJcbiAgICBub3JtYWxCdWZmZXI6IFdlYkdMQnVmZmVyLFxyXG4gICAgcG9zQXR0cmliOiBudW1iZXIsXHJcbiAgICB1dkF0dHJpYjogbnVtYmVyLFxyXG4gICAgbm9ybWFsQXR0cmliOiBudW1iZXJcclxuKTogV2ViR0xWZXJ0ZXhBcnJheU9iamVjdCB7XHJcbiAgICBjb25zdCB2YW8gPSBnbC5jcmVhdGVWZXJ0ZXhBcnJheSgpO1xyXG4gICAgaWYoIXZhbykgeyBzaG93RXJyb3IoXCJGYWlsZWQgdG8gYWxsb2NhdGUgVkFPIGJ1ZmZlci5cIik7IHJldHVybiAwOyB9XHJcbiAgICBnbC5iaW5kVmVydGV4QXJyYXkodmFvKTtcclxuXHJcbiAgICAvLyAxLiBQb3NpdGlvbiwgZm9ybWF0OiAoeCwgeSwgeikgKGFsbCBmMzIpXHJcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShwb3NBdHRyaWIpO1xyXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHZlcnRleEJ1ZmZlcik7XHJcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHBvc0F0dHJpYiwgMywgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHJcbiAgICAvLyAyLiBOb3JtYWxzXHJcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShub3JtYWxBdHRyaWIpO1xyXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIG5vcm1hbEJ1ZmZlcilcclxuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIobm9ybWFsQXR0cmliLCAzLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cclxuICAgIC8vIDMuIFVWc1xyXG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodXZBdHRyaWIpO1xyXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHV2QnVmZmVyKTtcclxuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodXZBdHRyaWIsIDIsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblxyXG5cclxuICAgIC8vIDQuIEluZGljZXNcclxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGluZGV4QnVmZmVyKTtcclxuXHJcbiAgICBnbC5iaW5kVmVydGV4QXJyYXkobnVsbCk7XHJcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgbnVsbCk7XHJcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBudWxsKTtcclxuICAgIHJldHVybiB2YW87XHJcbn1cclxuXHJcbmNvbnN0IFNJWkVTOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9ID0ge1NDQUxBUjogMSwgVkVDMjogMiwgVkVDMzogM307XHJcbi8qKlxyXG4gKiBnZXQgY29ycmVjdCBidWZmZXJcclxuICogQHBhcmFtIGdsdGYgcGFyYW1zXHJcbiAqIEBwYXJhbSBiaW4gcGFyYW1zXHJcbiAqIEBwYXJhbSBpZCBpZFxyXG4gKiBAcmV0dXJucyBhcnJheVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEJ1ZmZlcihnbHRmOiBHTFRGLCBiaW46IEFycmF5QnVmZmVyLCBpZDogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBhY2Nlc3NvcnMgPSBnbHRmLmFjY2Vzc29yc1tpZF07XHJcbiAgICBjb25zdCBidWZmZXJWaWV3cyA9IGdsdGYuYnVmZmVyVmlld3NbYWNjZXNzb3JzLmJ1ZmZlclZpZXddO1xyXG4gICAgY29uc3Qgb2Zmc2V0ID0gKGJ1ZmZlclZpZXdzLmJ5dGVPZmZzZXQgfHwgMCkgKyAoYWNjZXNzb3JzLmJ5dGVPZmZzZXQgfHwgMCk7XHJcbiAgICBjb25zdCBsZW5ndGggPSBhY2Nlc3NvcnMuY291bnQgKiBTSVpFU1thY2Nlc3NvcnMudHlwZV07XHJcblxyXG4gICAgaWYgKGFjY2Vzc29ycy5jb21wb25lbnRUeXBlID09PSA1MTI2KSByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShiaW4sIG9mZnNldCwgbGVuZ3RoKTtcclxuICAgIGlmIChhY2Nlc3NvcnMuY29tcG9uZW50VHlwZSA9PT0gNTEyMykgcmV0dXJuIG5ldyBVaW50MTZBcnJheShiaW4sIG9mZnNldCwgbGVuZ3RoKTtcclxuICAgIGlmIChhY2Nlc3NvcnMuY29tcG9uZW50VHlwZSA9PT0gNTEyNSkgcmV0dXJuIG5ldyBVaW50MzJBcnJheShiaW4sIG9mZnNldCwgbGVuZ3RoKTtcclxuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KCk7XHJcbn1cclxuIiwiLyoqXHJcbiAqIERpc3BsYXkgYW4gZXJyb3IgbWVzc2FnZSB0byB0aGUgSFRNTCBFbGVtZW50IHdpdGggaWQgXCJlcnJvclwiLlxyXG4gKiBAcGFyYW0gbXNnIG1lc3NhZ2VcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzaG93RXJyb3IobXNnOiBzdHJpbmcgPSBcIk5vIERhdGFcIik6IHZvaWQge1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvclwiKTtcclxuICAgIGlmKGNvbnRhaW5lciA9PT0gbnVsbCkgcmV0dXJuIGNvbnNvbGUubG9nKFwiTm8gRWxlbWVudCB3aXRoIElEOiBlcnJvclwiKTtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgICBlbGVtZW50LmlubmVyVGV4dCA9IG1zZztcclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuICAgIGNvbnNvbGUubG9nKG1zZyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0IGZyb20gZGVncmVlcyB0byByYWRpYW50XHJcbiAqIEBwYXJhbSBhbmdsZVxyXG4gKiBAcmV0dXJucyBhbmdsZSB0byByYWRpYW50XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gdG9SYWRpYW4oYW5nbGU6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gYW5nbGUgKiBNYXRoLlBJIC8gMTgwO1xyXG59XHJcblxyXG4iLCJpbXBvcnQgeyBTRVRUSU5HUywgaW5pdCB9IGZyb20gXCIuL3R3ZWFrcGFuZVwiO1xyXG5pbXBvcnQgeyB2ZWMzIH0gZnJvbSBcIi4vdmVjM1wiO1xyXG5pbXBvcnQgeyBtYXQ0IH0gZnJvbSBcIi4vbWF0NFwiO1xyXG5pbXBvcnQgeyBzaG93RXJyb3IsIHRvUmFkaWFuIH0gZnJvbSBcIi4vZnVuY3Rpb25cIjtcclxuaW1wb3J0IHsgY3JlYXRlU3RhdGljQnVmZmVyLCBjcmVhdGVWQU9CdWZmZXIgfSBmcm9tIFwiLi9idWZmZXJcIjtcclxuaW1wb3J0IHsgbG9hZFRleHR1cmUsIGNyZWF0ZVByb2dyYW0sIGdldFNoYWRlclNvdXJjZSB9IGZyb20gXCIuL3NoYWRlclwiO1xyXG5pbXBvcnQgeyBNb2RlbCwgbG9hZE1vZGVsLCBNb2RlbERhdGEgfSBmcm9tIFwiLi9tb2RlbFwiO1xyXG5cclxuY29uc3QgVVBfVkVDID0gbmV3IHZlYzMoMCwgMSwgMCk7XHJcbmNvbnN0IFQwID0gRGF0ZS5ub3coKTtcclxuY29uc3QgVEVYVFVSRVMgPSBbICcuL2ltZy90ZXh0dXJlLnBuZycgXTtcclxuaW5pdCgpO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gbWFpbigpOiBQcm9taXNlPHZvaWQ+IHtcclxuXHJcbiAgICAvLyBDYW52YXMgRWxlbWVudCBhbmQgUmVuZGVyaW5nIENvbnRleHQuXHJcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndlYmdsLWNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIGNvbnN0IGdsID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdsMicpIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQ7XHJcbiAgICBpZighZ2wpIHsgc2hvd0Vycm9yKFwiTm8gV2ViR0wyIENvbnRleHQgIVwiKTsgcmV0dXJuOyB9XHJcblxyXG4gICAgY29uc3QgdmVydGV4U291cmNlID0gYXdhaXQgZ2V0U2hhZGVyU291cmNlKCcuL3NoYWRlcnMvdmVydGV4X3NoYWRlci52ZXJ0Jyk7XHJcbiAgICBjb25zdCBmcmFnbWVudFNvdXJjZSA9IGF3YWl0IGdldFNoYWRlclNvdXJjZSgnLi9zaGFkZXJzL2ZyYWdtZW50X3NoYWRlci5mcmFnJyk7XHJcbiAgICBjb25zdCBwcm9ncmFtID0gY3JlYXRlUHJvZ3JhbShnbCwgdmVydGV4U291cmNlLCBmcmFnbWVudFNvdXJjZSk7XHJcblxyXG4gICAgLy8gTG9hZCBhbGwgaW1hZ2VzIGluIGEgVGV4dHVyZSBBcnJheS5cclxuICAgIGxvYWRUZXh0dXJlKGdsLCBURVhUVVJFUyk7XHJcblxyXG4gICAgLyogR2V0dGluZyBhbGwgYXR0cmlidXRlcyBmcm9tIHRoZSB2ZXJ0ZXggc2hhZGVyIGZpbGUuXHJcbiAgICAgKiBBdHRyaWJ1dGUgbG9jYXRpb25zIGNhbiBiZSBmb3JjZWQgaW4gdGhlIHZlcnRleCBzaGFkZXIgZmlsZSB3aXRoIChsb2NhdGlvbj08bnVtYmVyPikuXHJcbiAgICAgKiBJZiBub3QgZm9yY2VkLCBXZWJHTCBnaXZlcyB0aGVtIGEgbnVtYmVyLCB5b3UgY2FuIGdldCB0aGlzIG51bWJlciB3aXRoIGdsLmdldEF0dHJpYkxvY2F0aW9uKDxwcm9ncmFtX25hbWU+LCA8YXR0cmlidXRlX25hbWU+KS5cclxuICAgICAqIEJlY2F1c2Ugd2Ugc2V0IG1hbnVhbGx5IHRoZSBhdHRyaWJ1dGUgbG9jYXRpb24gaW4gdGhlIHZlcnRleCBzaGFkZXIsXHJcbiAgICAgKiB3ZSBjYW4gcmVwbGFjZSBnbC5nZXRBdHRyaWJMb2NhdGlvbig8cHJvZ3JhbV9uYW1lPiwgPGF0dHJpYnV0ZV9uYW1lPikgd2l0aCBsb2NhdGlvbidzIG51bWJlci5cclxuICAgICAqL1xyXG4gICAgY29uc3QgYVZlcnRleFBvc2l0aW9uID0gMDsgIC8vY2FuIGFsc28gdXNlOiBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtLCAnYVZlcnRleFBvc2l0aW9uJyk7XHJcbiAgICBjb25zdCBhVVYgPSAxOyAgICAgICAgICAgICAgLy9jYW4gYWxzbyB1c2U6IGdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW0sICdhVVYnKTtcclxuICAgIGNvbnN0IGFEZXB0aCA9IDI7ICAgICAgICAgICAvL2NhbiBhbHNvIHVzZTogZ2wuZ2V0QXR0cmliTG9jYXRpb24ocHJvZ3JhbSwgJ2FEZXB0aCcpO1xyXG4gICAgY29uc3QgYU5vcm1hbCA9IDM7ICAgICAgICAgIC8vY2FuIGFsc28gdXNlOiBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtLCAnYU5vcm1hbCcpO1xyXG5cclxuICAgIC8vIFdlIGNhbid0IHNwZWNpZnkgVW5pZm9ybXMgbG9jYXRpb25zIG1hbnVhbGx5LiBXZSBuZWVkIHRvIGdldCB0aGVtIHVzaW5nIGdsLmdldFVuaWZvcm1Mb2NhdGlvbig8cHJvZ3JhbV9uYW1lPiwgPHVuaWZvcm1fbmFtZT4pLlxyXG4gICAgY29uc3QgdU1hdFdvcmxkID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sICd1TWF0V29ybGQnKSBhcyBXZWJHTFVuaWZvcm1Mb2NhdGlvbjtcclxuICAgIGNvbnN0IHVNYXRWaWV3ID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sICd1TWF0Vmlld1Byb2onKSBhcyBXZWJHTFVuaWZvcm1Mb2NhdGlvbjtcclxuICAgIGNvbnN0IHVTYW1wbGVyID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sICd1U2FtcGxlcicpIGFzIFdlYkdMVW5pZm9ybUxvY2F0aW9uO1xyXG4gICAgY29uc3QgdUxpZ2h0RGlyZWN0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sICd1TGlnaHREaXJlY3Rpb24nKSBhcyBXZWJHTFVuaWZvcm1Mb2NhdGlvbjtcclxuXHJcbiAgICAvLyBBZGQgYSBsaWdodCBkaXJlY3Rpb24gdG8gdGhlIHdvcmxkLlxyXG4gICAgbGV0IGxpZ2h0RGlyZWN0aW9uID0gbmV3IHZlYzMoU0VUVElOR1MubGlnaHRfZGlyZWN0aW9uLngsIFNFVFRJTkdTLmxpZ2h0X2RpcmVjdGlvbi55LCBTRVRUSU5HUy5saWdodF9kaXJlY3Rpb24ueikubm9ybWFsaXplKCk7XHJcblxyXG4gICAgLy8gVHlwZXNjcmlwdCB3YW50cyB0byB2ZXJpZnkgaWYgdGhlIHZhcmlhYmxlcyBhcmUgc2V0LCBub3QgdGhlIGJlc3Qgd2F5IHRvIGRvIGl0LlxyXG4gICAgaWYoXHJcbiAgICAgICAgYVZlcnRleFBvc2l0aW9uIDwgMFxyXG4gICAgICAgIHx8IGFVViA8IDBcclxuICAgICAgICB8fCBhRGVwdGggPCAwXHJcbiAgICAgICAgfHwgYU5vcm1hbCA8IDBcclxuICAgICAgICB8fCAhdU1hdFdvcmxkXHJcbiAgICAgICAgfHwgIXVNYXRWaWV3XHJcbiAgICAgICAgfHwgIXVTYW1wbGVyXHJcbiAgICAgICAgfHwgIXVMaWdodERpcmVjdGlvblxyXG4gICAgKSB7XHJcbiAgICAgICAgc2hvd0Vycm9yKGBGYWlsZWQgdG8gZ2V0IGF0dHJpYnMvdW5pZm9ybXMgKE1heDogJHtnbC5nZXRQYXJhbWV0ZXIoZ2wuTUFYX1ZFUlRFWF9BVFRSSUJTKX0pOiBgICtcclxuICAgICAgICAgICAgYCBwb3M9JHthVmVydGV4UG9zaXRpb259YCArXHJcbiAgICAgICAgICAgIGAgdXY9JHthVVZ9YCArXHJcbiAgICAgICAgICAgIGAgZGVwdGg9JHthRGVwdGh9YCArXHJcbiAgICAgICAgICAgIGAgbWF0V29ybGQ9JHshIXVNYXRXb3JsZH1gICtcclxuICAgICAgICAgICAgYCBtYXRWaWV3UHJvaj0keyEhdU1hdFZpZXd9YCArXHJcbiAgICAgICAgICAgIGAgc2FtcGxlcj0keyEhdVNhbXBsZXJ9YCArXHJcbiAgICAgICAgICAgIGAgbGlnaHREaXJlY3Rpb249JHshIXVMaWdodERpcmVjdGlvbn1gXHJcbiAgICAgICAgKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ29udHJvbCB0ZXh0dXJlIGFycmF5J3MgZGVwdGguIEFsbG93IHVzIHRvIHBpY2sgdGhlIGRpc3BsYXllZCB0ZXh0dXJlLlxyXG4gICAgZ2wudmVydGV4QXR0cmliMWYoYURlcHRoLCAxKTtcclxuXHJcbiAgICAvLyBTZW5kIExpZ2h0RGlyZWN0aW9uIHRvIHRoZSBzaGFkZXIuXHJcbiAgICBnbC51bmlmb3JtM2Z2KHVMaWdodERpcmVjdGlvbiwgbGlnaHREaXJlY3Rpb24udG9GbG9hdDMyQXJyYXkoKSk7XHJcblxyXG4gICAgbGV0IG1vZGVsczogTW9kZWxbXSA9IFtdO1xyXG4gICAgbGV0IG1vZGVsc0RhdGE6IEFycmF5PE1vZGVsRGF0YT5bXSA9IFtdO1xyXG5cclxuICAgIG1vZGVsc0RhdGEucHVzaChhd2FpdCBsb2FkTW9kZWwoJy4vbW9kZWxzL2ljb3NwaGVyZS5nbHRmJywgJy4vbW9kZWxzL2ljb3NwaGVyZS5iaW4nKSk7XHJcbiAgICBtb2RlbHNEYXRhLnB1c2goYXdhaXQgbG9hZE1vZGVsKCcuL21vZGVscy9tb25rZXkuZ2x0ZicsICcuL21vZGVscy9tb25rZXkuYmluJykpO1xyXG4gICAgbW9kZWxzRGF0YS5mb3JFYWNoKChtb2RlbERhdGEpID0+IHtcclxuICAgICAgICBmb3IgKGNvbnN0IGRhdGEgb2YgbW9kZWxEYXRhKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsVmVydGV4QnVmZmVyID0gY3JlYXRlU3RhdGljQnVmZmVyKGdsLCBkYXRhLnZlcnRpY2VzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsSW5kZXhCdWZmZXIgPSBjcmVhdGVTdGF0aWNCdWZmZXIoZ2wsIGRhdGEuaW5kaWNlcywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsVVZCdWZmZXIgPSBjcmVhdGVTdGF0aWNCdWZmZXIoZ2wsIGRhdGEudXZzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsTm9ybWFsQnVmZmVyID0gY3JlYXRlU3RhdGljQnVmZmVyKGdsLCBkYXRhLm5vcm1hbHMsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsVkFPID0gY3JlYXRlVkFPQnVmZmVyKFxyXG4gICAgICAgICAgICAgICAgZ2wsXHJcbiAgICAgICAgICAgICAgICBtb2RlbFZlcnRleEJ1ZmZlcixcclxuICAgICAgICAgICAgICAgIG1vZGVsSW5kZXhCdWZmZXIsXHJcbiAgICAgICAgICAgICAgICBtb2RlbFVWQnVmZmVyLFxyXG4gICAgICAgICAgICAgICAgbW9kZWxOb3JtYWxCdWZmZXIsXHJcbiAgICAgICAgICAgICAgICBhVmVydGV4UG9zaXRpb24sXHJcbiAgICAgICAgICAgICAgICBhVVYsXHJcbiAgICAgICAgICAgICAgICBhTm9ybWFsXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBsZXQgcG9zaXRpb24gPSBuZXcgdmVjMygtLjUsIDAsIDApO1xyXG4gICAgICAgICAgICAvLyBNb25rZXkgXCJzdXphbm5lXCIgbW9kZWwuXHJcbiAgICAgICAgICAgIGlmIChkYXRhLm5hbWUgPT0gXCJTdXphbm5lXCIpIHBvc2l0aW9uID0gbmV3IHZlYzMoLjUsIDAsIDApO1xyXG5cclxuICAgICAgICAgICAgbW9kZWxzLnB1c2gobmV3IE1vZGVsKFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb24sXHJcbiAgICAgICAgICAgICAgICBTRVRUSU5HUy5vYmplY3Rfc2l6ZSxcclxuICAgICAgICAgICAgICAgIFVQX1ZFQyxcclxuICAgICAgICAgICAgICAgIHRvUmFkaWFuKDApLFxyXG4gICAgICAgICAgICAgICAgbW9kZWxWQU8sXHJcbiAgICAgICAgICAgICAgICBkYXRhLmluZGljZXMubGVuZ3RoXHJcbiAgICAgICAgICAgICkpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgbGV0IG1hdFZpZXcgPSBuZXcgbWF0NCgpO1xyXG4gICAgbGV0IG1hdFByb2ogPSBuZXcgbWF0NCgpO1xyXG4gICAgbGV0IG1hdFZpZXdQcm9qID0gbmV3IG1hdDQoKTtcclxuXHJcbiAgICBsZXQgY2FtZXJhQW5nbGUgPSAwO1xyXG4gICAgbGV0IGxhc3RGcmFtZVRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICBjb25zdCBmcmFtZSA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICAvLyBkdCAoZGVsdGEgdGltZSkgcmVwcmVzZW50IHRoZSB0aW1lIHNwZW50IGJldHdlZW4gZWFjaCBmcmFtZSwgaW4gbWlsbGlzZWNvbmRzLlxyXG4gICAgICAgIC8vIERlbHRhIHRpbWUgc3RhbmRhcmRpemUgYSBwcm9ncmFtLCB0byBydW4gYXQgdGhlIHNhbWUgc3BlZWQuXHJcbiAgICAgICAgY29uc3QgdGhpc0ZyYW1lVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIGNvbnN0IGR0ID0gdGhpc0ZyYW1lVGltZSAtIGxhc3RGcmFtZVRpbWU7XHJcbiAgICAgICAgbGFzdEZyYW1lVGltZSA9IHRoaXNGcmFtZVRpbWU7XHJcblxyXG4gICAgICAgIC8vIEZQUyAoRnJhbWUgUGVyIFNlY29uZHMpIGlzIGEgZnJlcXVlbmN5LCBpdCdzIHRoZSBpbnZlcnQgb2YgZHQuXHJcbiAgICAgICAgU0VUVElOR1MuYmVuY2htYXJrX2ZwcyA9IE1hdGguY2VpbCgxIC8gKGR0IC8gMTAwMCkpO1xyXG5cclxuICAgICAgICAvLyBBbGxvdyB0byBjaGFuZ2UgbGlnaHQgZGlyZWN0aW9uIGluIHJlYWwgdGltZS5cclxuICAgICAgICBsaWdodERpcmVjdGlvbiA9IG5ldyB2ZWMzKFNFVFRJTkdTLmxpZ2h0X2RpcmVjdGlvbi54LCBTRVRUSU5HUy5saWdodF9kaXJlY3Rpb24ueSwgU0VUVElOR1MubGlnaHRfZGlyZWN0aW9uLnopLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgIGdsLnVuaWZvcm0zZnYodUxpZ2h0RGlyZWN0aW9uLCBsaWdodERpcmVjdGlvbi50b0Zsb2F0MzJBcnJheSgpKTtcclxuXHJcbiAgICAgICAgLy8gQ0FNRVJBXHJcbiAgICAgICAgLy8gVE9ETzogQWRkIGNhbWVyYSBtb3ZlbWVudC5cclxuICAgICAgICAvLyBFYWNoIGZyYW1lIGFkZHMgMTDCsCB0byB0aGUgY2FtZXJhIGFuZ2xlLlxyXG4gICAgICAgIC8vIGNhbWVyYUFuZ2xlICs9IChkdCAvIDEwMDApICogdG9SYWRpYW4oMTApO1xyXG4gICAgICAgIGNvbnN0IGNhbWVyYVggPSAzICogTWF0aC5zaW4oY2FtZXJhQW5nbGUpO1xyXG4gICAgICAgIGNvbnN0IGNhbWVyYVogPSAzICogTWF0aC5jb3MoY2FtZXJhQW5nbGUpO1xyXG5cclxuICAgICAgICAvLyBNYWtlIHRoZSBjYW1lcmEgbG9vayBhdCB0aGUgY2VudGVyLlxyXG4gICAgICAgIG1hdFZpZXcuc2V0TG9va0F0KFxyXG4gICAgICAgICAgICBuZXcgdmVjMyhjYW1lcmFYLCAtLjI1LCBjYW1lcmFaKSxcclxuICAgICAgICAgICAgbmV3IHZlYzMoMCwgMCwgMCksXHJcbiAgICAgICAgICAgIG5ldyB2ZWMzKDAsIDEsIDApXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gU2V0IHRoZSBjYW1lcmEgRk9WLCBzY3JlZW4gc2l6ZSwgYW5kIHZpZXcgZGlzdGFuY2UuXHJcbiAgICAgICAgbWF0UHJvai5zZXRQZXJzcGVjdGl2ZShcclxuICAgICAgICAgICAgdG9SYWRpYW4oU0VUVElOR1MuY2FtZXJhX2ZvdiksIC8vIEZPVlxyXG4gICAgICAgICAgICBjYW52YXMud2lkdGggLyBjYW52YXMuaGVpZ2h0LCAvLyBBU1BFQ1QgUkFUSU9cclxuICAgICAgICAgICAgMC4xLCAxMDAuMCAvLyBaLU5FQVIgLyBaLUZBUlxyXG4gICAgICAgICk7XHJcbiAgICAgICAgLy8gRU5EIENBTUVSQVxyXG5cclxuICAgICAgICAvLyBHTE06IG1hdFZpZXdQcm9qID0gbWF0UHJvaiAqIG1hdFZpZXdcclxuICAgICAgICBtYXRWaWV3UHJvaiA9IG1hdFByb2oubXVsdGlwbHkobWF0Vmlldyk7XHJcblxyXG4gICAgICAgIGxldCB3aWR0aCA9IGNhbnZhcy5jbGllbnRXaWR0aCAqIGRldmljZVBpeGVsUmF0aW87XHJcbiAgICAgICAgbGV0IGhlaWdodCA9IGNhbnZhcy5jbGllbnRIZWlnaHQgKiBkZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgICAgIGlmIChjYW52YXMud2lkdGggIT09IHdpZHRoIHx8IGNhbnZhcy5oZWlnaHQgIT09IGhlaWdodCkge1xyXG4gICAgICAgICAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICAgICAgZ2wudmlld3BvcnQoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdsLmNsZWFyQ29sb3IoMC4wMiwgMC4wMiwgMC4wMiwgMSk7XHJcbiAgICAgICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQpO1xyXG4gICAgICAgIGdsLmVuYWJsZShnbC5ERVBUSF9URVNUKTtcclxuICAgICAgICBnbC5lbmFibGUoZ2wuQ1VMTF9GQUNFKTtcclxuICAgICAgICBnbC5jdWxsRmFjZShnbC5CQUNLKTtcclxuICAgICAgICBnbC5mcm9udEZhY2UoZ2wuQ0NXKTtcclxuICAgICAgICBnbC51c2VQcm9ncmFtKHByb2dyYW0pO1xyXG4gICAgICAgIGdsLnVuaWZvcm1NYXRyaXg0ZnYodU1hdFZpZXcsIGZhbHNlLCBtYXRWaWV3UHJvai5tYXQpO1xyXG5cclxuICAgICAgICBtb2RlbHMuZm9yRWFjaCgobW9kZWwpID0+IHtcclxuICAgICAgICAgICAgbW9kZWwucm90YXRlKChkdCAvIDEwMDApICogdG9SYWRpYW4oU0VUVElOR1Mub2JqZWN0X3JvdGF0aW9uX3NwZWVkKSk7XHJcbiAgICAgICAgICAgIG1vZGVsLnNjYWxlID0gU0VUVElOR1Mub2JqZWN0X3NpemU7XHJcbiAgICAgICAgICAgIG1vZGVsLmRyYXcoZ2wsIHVNYXRXb3JsZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIExvb3AgY2FsbHMsIGVhY2ggdGltZSB0aGUgZHJhd2luZyBpcyByZWFkeS5cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnJhbWUpO1xyXG4gICAgfTtcclxuICAgIC8vIEZpcnN0IGNhbGwsIGFzIHNvb24gYXMgdGhlIHBhZ2UgaXMgbG9hZGVkLlxyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZyYW1lKTtcclxuICAgIFNFVFRJTkdTLmJlbmNobWFya19sb2FkaW5nX3RpbWUgPSBEYXRlLm5vdygpIC0gVDA7XHJcbn1cclxuXHJcblxyXG5cclxudHJ5IHtcclxuICAgIG1haW4oKS50aGVuKCgpID0+IHtcclxuICAgICAgICBzaG93RXJyb3IoXCI+PiBObyBFcnJvcnMhIPCfjJ5cIik7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKChlKSA9PiB7XHJcbiAgICAgICAgc2hvd0Vycm9yKGBVbmNhdWdodCBhc3luYyBleGNlcHRpb246ICR7ZX1gKTtcclxuICAgIH0pXHJcbn0gY2F0Y2goZSkge1xyXG4gICAgc2hvd0Vycm9yKGBVbmNhdWdodCBzeW5jaHJvbm91cyBleGNlcHRpb246ICR7ZX1gKTtcclxufVxyXG4iLCJpbXBvcnQgeyB2ZWMzIH0gZnJvbSBcIi4vdmVjM1wiO1xyXG5pbXBvcnQgeyBxdWF0IH0gZnJvbSBcIi4vcXVhdFwiO1xyXG5cclxuLyoqXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIG1hdDQge1xyXG4gICAgcHVibGljIG1hdDogRmxvYXQzMkFycmF5O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMubWF0ID0gbmV3IEZsb2F0MzJBcnJheSgxNik7XHJcbiAgICAgICAgdGhpcy5pZGVudGl0eSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGlkZW50aXR5IG1hdDRcclxuICAgICAqXHJcbiAgICAgKiBTdHJ1Y3R1cmU6XHJcbiAgICAgKlxyXG4gICAgICogIDEsICAwLCAgMCwgMFxyXG4gICAgICpcclxuICAgICAqICAwLCAgMSwgIDAsIDBcclxuICAgICAqXHJcbiAgICAgKiAgMCwgIDAsICAxLCAwXHJcbiAgICAgKlxyXG4gICAgICogIDAsICAwLCAgMCwgMVxyXG4gICAgICogQHJldHVybnMgaWRlbnRpdHkgbWF0NFxyXG4gICAgICovXHJcbiAgICBpZGVudGl0eSgpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLm1hdC5zZXQoW1xyXG4gICAgICAgICAgICAxLCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAxLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAxLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAwLCAxXHJcbiAgICAgICAgXSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb3B5IGEgbWF0cmljZVxyXG4gICAgICogQHBhcmFtIG1hdCBtYXRyaWNlIHRvIGNvcHkgZnJvbVxyXG4gICAgICogQHJldHVybnMgdXBkYXRlIHRoaXMgbWF0NFxyXG4gICAgICovXHJcbiAgICBjb3B5RnJvbShtYXQ6IG1hdDQpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLm1hdC5zZXQobWF0Lm1hdCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNdWx0aXBseSBhIG1hdHJpY2UgYnkgYW5vdGhlciBvbmVcclxuICAgICAqIEBwYXJhbSBvdGhlciBtYXRyaWNlIHRvIG11bHRpcGx5IGJ5XHJcbiAgICAgKlxyXG4gICAgICogU3RydWN0dXJlOlxyXG4gICAgICpcclxuICAgICAqICB4LCAgMCwgIDAsIDBcclxuICAgICAqXHJcbiAgICAgKiAgMCwgIHksICAwLCAwXHJcbiAgICAgKlxyXG4gICAgICogIDAsICAwLCAgeiwgMFxyXG4gICAgICpcclxuICAgICAqIHR4LCB0eSwgdHosIDFcclxuICAgICAqL1xyXG4gICAgbXVsdGlwbHkob3RoZXI6IG1hdDQpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBhID0gdGhpcy5tYXQsIGIgPSBvdGhlci5tYXQ7XHJcbiAgICAgICAgY29uc3Qgb3V0ID0gbmV3IEZsb2F0MzJBcnJheSgxNik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgKytpKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgNDsgKytqKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRbaiAqIDQgKyBpXSA9XHJcbiAgICAgICAgICAgICAgICBhWzAgKiA0ICsgaV0gKiBiW2ogKiA0ICsgMF0gK1xyXG4gICAgICAgICAgICAgICAgYVsxICogNCArIGldICogYltqICogNCArIDFdICtcclxuICAgICAgICAgICAgICAgIGFbMiAqIDQgKyBpXSAqIGJbaiAqIDQgKyAyXSArXHJcbiAgICAgICAgICAgICAgICBhWzMgKiA0ICsgaV0gKiBiW2ogKiA0ICsgM107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubWF0LnNldChvdXQpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIGZvdlJhZCBGT1YgaW4gcmFkaWFudFxyXG4gICAgICogQHBhcmFtIGFzcGVjdCBBc3BlY3QgcmF0aW9cclxuICAgICAqIEBwYXJhbSBuZWFyIE5lYXIgcGxhbmVcclxuICAgICAqIEBwYXJhbSBmYXIgRmFyIHBsYW5lXHJcbiAgICAgKlxyXG4gICAgICogUGVyc3BlY3RpdmUgbWF0cmljZSwgdGhlIGZhY3RvciBpcyBjYWxjdWxhdGVkIGZyb20gdGhlIHRhbiBvZiB0aGUgRk9WIGRpdmlkZWQgYnkgMjpcclxuICAgICAqXHJcbiAgICAgKiBXZSBoYXZlIHRoZSBuZWFyIHBsYW5lIGFuZCBmYXIgcGxhbmUuIChvYmplY3RzIGFyZSBkcmF3biBpbiBiZXR3ZWVuKVxyXG4gICAgICpcclxuICAgICAqIEFzcGVjdCBpcyB0aGUgYXNwZWN0IHJhdGlvLCBsaWtlIDE2Ojkgb24gbW9zdCBzY3JlZW5zLlxyXG4gICAgICpcclxuICAgICAqIFdlIGNoYW5nZSBlYWNoIHZlcnRpY2VzIHgsIHkgYW5kIHogYnkgdGhlIGZvbGxvd2luZzpcclxuICAgICAqXHJcbiAgICAgKiAwLCAwLCAgMCwgIDBcclxuICAgICAqXHJcbiAgICAgKiAwLCA1LCAgMCwgIDBcclxuICAgICAqXHJcbiAgICAgKiAwLCAwLCAxMCwgMTFcclxuICAgICAqXHJcbiAgICAgKiAwLCAwLCAxNCwgMTVcclxuICAgICAqL1xyXG4gICAgc2V0UGVyc3BlY3RpdmUoZm92UmFkOiBudW1iZXIsIGFzcGVjdDogbnVtYmVyLCBuZWFyOiBudW1iZXIsIGZhcjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgZiA9IDEuMCAvIE1hdGgudGFuKGZvdlJhZCAvIDIpO1xyXG4gICAgICAgIGNvbnN0IG5mID0gMSAvIChuZWFyIC0gZmFyKTtcclxuICAgICAgICBjb25zdCBtID0gdGhpcy5tYXQ7XHJcbiAgICAgICAgbS5zZXQoW1xyXG4gICAgICAgICAgICBmIC8gYXNwZWN0LCAgICAgMCwgICAgICAwLCAgICAgICAgICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgMCwgICAgICAgICAgICAgIGYsICAgICAgMCwgICAgICAgICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDAsICAgICAgICAgICAgICAwLCAgICAgIChmYXIgKyBuZWFyKSAqIG5mLCAgICAgIC0xLFxyXG4gICAgICAgICAgICAwLCAgICAgICAgICAgICAgMCwgICAgICAyKmZhcipuZWFyKm5mLCAgICAgICAgICAgMFxyXG4gICAgICAgIF0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IGxvb2sgYXRcclxuICAgICAqIEBwYXJhbSBleWVcclxuICAgICAqIEBwYXJhbSBjZW50ZXJcclxuICAgICAqIEBwYXJhbSB1cFxyXG4gICAgICogQHJldHVybnMgdXBkYXRlIHRoaXMgbWF0NFxyXG4gICAgICovXHJcbiAgICBzZXRMb29rQXQoZXllOiB2ZWMzLCBjZW50ZXI6IHZlYzMsIHVwOiB2ZWMzKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgeiA9IGV5ZS5zdWJ0cmFjdChjZW50ZXIpLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgIGNvbnN0IHggPSB1cC5jcm9zcyh6KS5ub3JtYWxpemUoKTtcclxuICAgICAgICBjb25zdCB5ID0gei5jcm9zcyh4KTtcclxuICAgICAgICBjb25zdCBtID0gdGhpcy5tYXQ7XHJcbiAgICAgICAgbS5zZXQoW1xyXG4gICAgICAgICAgICB4LngsICAgICAgICAgICAgeS54LCAgICAgICAgICAgIHoueCwgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB4LnksICAgICAgICAgICAgeS55LCAgICAgICAgICAgIHoueSwgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB4LnosICAgICAgICAgICAgeS56LCAgICAgICAgICAgIHoueiwgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAteC5kb3QoZXllKSwgICAgLXkuZG90KGV5ZSksICAgIC16LmRvdChleWUpLCAgICAxXHJcbiAgICAgICAgXSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgdHJhbnNsYXRpb24gc2NhbGUgZnJvbSByb3RhdGlvblxyXG4gICAgICogQHBhcmFtIHEgcXVhdFxyXG4gICAgICogQHBhcmFtIHYgdmVjdG9yXHJcbiAgICAgKiBAcGFyYW0gcyBzY2FsZVxyXG4gICAgICogQHJldHVybnMgdXBkYXRlIHRoaXMgbWF0NFxyXG4gICAgICovXHJcbiAgICBzZXRGcm9tUm90YXRpb25UcmFuc2xhdGlvblNjYWxlKHE6IHF1YXQsIHY6IHZlYzMsIHM6IHZlYzMpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCB4MiA9IHEueCArIHEueCwgeTIgPSBxLnkgKyBxLnksIHoyID0gcS56ICsgcS56O1xyXG4gICAgICAgIGNvbnN0IHh4ID0gcS54ICogeDIsIHh5ID0gcS54ICogeTIsIHh6ID0gcS54ICogejI7XHJcbiAgICAgICAgY29uc3QgeXkgPSBxLnkgKiB5MiwgeXogPSBxLnkgKiB6MiwgenogPSBxLnogKiB6MjtcclxuICAgICAgICBjb25zdCB3eCA9IHEudyAqIHgyLCB3eSA9IHEudyAqIHkyLCB3eiA9IHEudyAqIHoyO1xyXG5cclxuICAgICAgICB0aGlzLm1hdC5zZXQoW1xyXG4gICAgICAgICAgICAoMSAtICh5eSArIHp6KSkgKiBzLngsICAgICAgKHh5ICsgd3opICogcy54LCAgICAgICAgKHh6IC0gd3kpICogcy54LCAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICh4eSAtIHd6KSAqIHMueSwgICAgICAgICAgICAoMSAtICh4eCArIHp6KSkgKiBzLnksICAoeXogKyB3eCkgKiBzLnksICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgKHh6ICsgd3kpICogcy56LCAgICAgICAgICAgICh5eiAtIHd4KSAqIHMueiwgICAgICAgICgxIC0gKHh4ICsgeXkpKSAqIHMueiwgICAgICAwLFxyXG4gICAgICAgICAgICB2LngsICAgICAgICAgICAgICAgICAgICAgICAgdi55LCAgICAgICAgICAgICAgICAgICAgdi56LCAgICAgICAgICAgICAgICAgICAgICAgIDFcclxuICAgICAgICBdKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBpbnZlcnQoKTogdGhpcyB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IHZlYzMgfSBmcm9tIFwiLi92ZWMzXCJcclxuaW1wb3J0IHsgcXVhdCB9IGZyb20gXCIuL3F1YXRcIlxyXG5pbXBvcnQgeyBtYXQ0IH0gZnJvbSBcIi4vbWF0NFwiXHJcbmltcG9ydCB7IHNob3dFcnJvciB9IGZyb20gXCIuL2Z1bmN0aW9uXCJcclxuaW1wb3J0IHsgZ2V0QnVmZmVyIH0gZnJvbSBcIi4vYnVmZmVyXCJcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgR0xURiB7XHJcbiAgICBtZXNoZXM6IHtcclxuICAgICAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICAgICAgcHJpbWl0aXZlczoge1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9LFxyXG4gICAgICAgICAgICBpbmRpY2VzPzogbnVtYmVyXHJcbiAgICAgICAgfVtdXHJcbiAgICB9W10sXHJcbiAgICBhY2Nlc3NvcnM6IHtcclxuICAgICAgICBidWZmZXJWaWV3OiBudW1iZXIsXHJcbiAgICAgICAgYnl0ZU9mZnNldD86IG51bWJlclxyXG4gICAgICAgIGNvbXBvbmVudFR5cGU6IG51bWJlcixcclxuICAgICAgICBjb3VudDogbnVtYmVyLFxyXG4gICAgICAgIHR5cGU6IHN0cmluZ1xyXG4gICAgfVtdLFxyXG4gICAgYnVmZmVyVmlld3M6IHtcclxuICAgICAgICBidWZmZXI6IG51bWJlcixcclxuICAgICAgICBieXRlTGVuZ3RoOiBudW1iZXIsXHJcbiAgICAgICAgYnl0ZU9mZnNldDogbnVtYmVyXHJcbiAgICB9W10sXHJcbiAgICBidWZmZXJzOiB7XHJcbiAgICAgICAgYnl0ZUxlbmd0aDogbnVtYmVyLFxyXG4gICAgICAgIHVyaTogc3RyaW5nXHJcbiAgICB9W11cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBNb2RlbERhdGEge1xyXG4gICAgbmFtZTogc3RyaW5nLFxyXG4gICAgdmVydGljZXM6IEZsb2F0MzJBcnJheSxcclxuICAgIG5vcm1hbHM6IEZsb2F0MzJBcnJheSxcclxuICAgIHV2czogRmxvYXQzMkFycmF5LFxyXG4gICAgaW5kaWNlczogVWludDE2QXJyYXkgfCBVaW50MzJBcnJheVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTW9kZWwge1xyXG4gICAgcHJpdmF0ZSBtYXRXb3JsZCA9IG5ldyBtYXQ0KCk7XHJcbiAgICBwcml2YXRlIHNjYWxlVmVjID0gbmV3IHZlYzMoKTtcclxuICAgIHByaXZhdGUgcm90YXRpb24gPSBuZXcgcXVhdCgpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgcG9zOiB2ZWMzLFxyXG4gICAgICAgIHB1YmxpYyBzY2FsZTogbnVtYmVyLFxyXG4gICAgICAgIHByaXZhdGUgcm90YXRpb25BeGlzOiB2ZWMzLFxyXG4gICAgICAgIHByaXZhdGUgcm90YXRpb25BbmdsZTogbnVtYmVyLFxyXG4gICAgICAgIHB1YmxpYyByZWFkb25seSB2YW86IFdlYkdMVmVydGV4QXJyYXlPYmplY3QsXHJcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IG51bUluZGljZXM6IG51bWJlclxyXG4gICAgKSB7IH1cclxuXHJcbiAgICByb3RhdGUoYW5nbGU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMucm90YXRpb25BbmdsZSA9IHRoaXMucm90YXRpb25BbmdsZSArIGFuZ2xlO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsIG1hdFdvcmxkVW5pZm9ybTogV2ViR0xVbmlmb3JtTG9jYXRpb24pIHtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uLnNldEF4aXNBbmdsZSh0aGlzLnJvdGF0aW9uQXhpcywgdGhpcy5yb3RhdGlvbkFuZ2xlKTtcclxuICAgICAgICB0aGlzLnNjYWxlVmVjLnNldCh0aGlzLnNjYWxlLCB0aGlzLnNjYWxlLCB0aGlzLnNjYWxlKTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXRXb3JsZC5zZXRGcm9tUm90YXRpb25UcmFuc2xhdGlvblNjYWxlKHRoaXMucm90YXRpb24sIHRoaXMucG9zLCB0aGlzLnNjYWxlVmVjKTtcclxuXHJcbiAgICAgICAgZ2wudW5pZm9ybU1hdHJpeDRmdihtYXRXb3JsZFVuaWZvcm0sIGZhbHNlLCB0aGlzLm1hdFdvcmxkLm1hdCk7XHJcbiAgICAgICAgZ2wuYmluZFZlcnRleEFycmF5KHRoaXMudmFvKTtcclxuICAgICAgICBnbC5kcmF3RWxlbWVudHMoZ2wuVFJJQU5HTEVTLCB0aGlzLm51bUluZGljZXMsIGdsLlVOU0lHTkVEX1NIT1JULCAwKTtcclxuICAgICAgICBnbC5iaW5kVmVydGV4QXJyYXkobnVsbCk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIExvYWQgbW9kZWxzIGFuZCByZXR1cm4gYnVmZmVyc1xyXG4gKiBAcGFyYW0gdXJsX2dsdGYgcGF0aCB0byAuZ2x0ZiBmaWxlXHJcbiAqIEBwYXJhbSB1cmxfYmluIHBhdGggdG8gLmJpbiBmaWxlXHJcbiAqIEByZXR1cm5zIGJ1ZmZlcnNcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkTW9kZWwodXJsX2dsdGY6IHN0cmluZywgdXJsX2Jpbjogc3RyaW5nKTogUHJvbWlzZTxNb2RlbERhdGFbXT4ge1xyXG4gICAgY29uc3QgZ2x0ZjogR0xURiA9IGF3YWl0IGZldGNoKHVybF9nbHRmKS50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICAgICAgc2hvd0Vycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IGJpbjogQXJyYXlCdWZmZXIgPSBhd2FpdCBmZXRjaCh1cmxfYmluKS50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICAgICAgc2hvd0Vycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXNwb25zZS5hcnJheUJ1ZmZlcigpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgbW9kZWxzOiBNb2RlbERhdGFbXSA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IG1lc2ggb2YgZ2x0Zi5tZXNoZXMpIHtcclxuICAgICAgICBsZXQgbmFtZSA9IG1lc2gubmFtZTtcclxuICAgICAgICBmb3IgKGxldCBwcmltIG9mIG1lc2gucHJpbWl0aXZlcykge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhOiBNb2RlbERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgdmVydGljZXM6IGdldEJ1ZmZlcihnbHRmLCBiaW4sIHByaW0uYXR0cmlidXRlcy5QT1NJVElPTikgYXMgRmxvYXQzMkFycmF5LFxyXG4gICAgICAgICAgICAgICAgbm9ybWFsczogZ2V0QnVmZmVyKGdsdGYsIGJpbiwgcHJpbS5hdHRyaWJ1dGVzLk5PUk1BTCkgYXMgRmxvYXQzMkFycmF5LFxyXG4gICAgICAgICAgICAgICAgdXZzOiBnZXRCdWZmZXIoZ2x0ZiwgYmluLCBwcmltLmF0dHJpYnV0ZXMuVEVYQ09PUkRfMCkgYXMgRmxvYXQzMkFycmF5LFxyXG4gICAgICAgICAgICAgICAgaW5kaWNlczogZ2V0QnVmZmVyKGdsdGYsIGJpbiwgcHJpbS5pbmRpY2VzISkgYXMgVWludDE2QXJyYXlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtb2RlbHMucHVzaChkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1vZGVscztcclxufVxyXG4iLCJpbXBvcnQgeyB2ZWMzIH0gZnJvbSBcIi4vdmVjM1wiO1xyXG5cclxuLyoqXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAcGFyYW0geCBkZWZhdWx0IDBcclxuICogQHBhcmFtIHkgZGVmYXVsdCAwXHJcbiAqIEBwYXJhbSB6IGRlZmF1bHQgMFxyXG4gKiBAcGFyYW0gdyBkZWZhdWx0IDFcclxuICogQG1ldGhvZCBzZXRBeGlzQW5nbGVcclxuICovXHJcbmV4cG9ydCBjbGFzcyBxdWF0IHtcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHB1YmxpYyB4OiBudW1iZXIgPSAwLFxyXG4gICAgICAgIHB1YmxpYyB5OiBudW1iZXIgPSAwLFxyXG4gICAgICAgIHB1YmxpYyB6OiBudW1iZXIgPSAwLFxyXG4gICAgICAgIHB1YmxpYyB3OiBudW1iZXIgPSAxXHJcbiAgICApIHt9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgYXhpcyBhbmdsZVxyXG4gICAgICogQHBhcmFtIGF4aXMgdmVjM1xyXG4gICAgICogQHBhcmFtIGFuZ2xlIG51bWJlciBkaXZpZGVkIGJ5IDIgdG8gZ2V0IGhhbGZcclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKi9cclxuICAgIHNldEF4aXNBbmdsZShheGlzOiB2ZWMzLCBhbmdsZTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3Qgbm9ybSA9IGF4aXMubm9ybWFsaXplKCk7XHJcbiAgICAgICAgY29uc3QgaGFsZiA9IGFuZ2xlIC8gMjtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oaGFsZik7XHJcblxyXG4gICAgICAgIHRoaXMueCA9IG5vcm0ueCAqIHM7XHJcbiAgICAgICAgdGhpcy55ID0gbm9ybS55ICogcztcclxuICAgICAgICB0aGlzLnogPSBub3JtLnogKiBzO1xyXG4gICAgICAgIHRoaXMudyA9IE1hdGguY29zKGhhbGYpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBzaG93RXJyb3IgfSBmcm9tIFwiLi9mdW5jdGlvblwiO1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB1cmwgUGF0aCB0byBpbWFnZSBmaWxlXHJcbiAqIEByZXR1cm5zIFJldHVybiBhbiBpbWFnZVxyXG4gKiBAYXN5bmNcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRJbWFnZSh1cmw6IHN0cmluZyk6IFByb21pc2U8SFRNTEltYWdlRWxlbWVudD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICBpbWFnZS5zcmMgPSB1cmw7XHJcbiAgICAgICAgaW1hZ2Uub25sb2FkID0gKCkgPT4gcmVzb2x2ZShpbWFnZSk7XHJcbiAgICB9KVxyXG59XHJcblxyXG4vKipcclxuICogQGRlc2NyaXB0aW9uIEdldCBzaGFkZXJzIHNvdXJjZSBjb2RlXHJcbiAqIEBwYXJhbSB1cmwgUGF0aCB0byBzaGFkZXIgZmlsZVxyXG4gKiBAcmV0dXJucyBSZXR1cm4gdGV4dFxyXG4gKiBAYXN5bmNcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTaGFkZXJTb3VyY2UodXJsOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xyXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3IgJHtyZXNwb25zZS5zdGF0dXNUZXh0fSB3aGlsZSBsb2FkaW5nIHNoYWRlciBjb2RlIGF0IFwiJHt1cmx9XCJgKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXNwb25zZS50ZXh0KCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gQ3JlYXRlIGEgV2ViR0wgcHJvZ3JhbSBhbmQgbGluayB0aGUgdmVydGV4IGFuZCBmcmFnbWVudCBzaGFkZXIgc291cmNlIGNvZGUgdG8gaXQuXHJcbiAqIEBwYXJhbSBnbCBXZWJHTCBSZW5kZXJpbmcgQ29udGV4dFxyXG4gKiBAcGFyYW0gdmVydGV4U2hhZGVyU3JjIFZlcnRleCBTaGFkZXIgU291cmNlIENvZGVcclxuICogQHBhcmFtIGZyYWdtZW50U2hhZGVyU3JjIEZyYWdtZW50IFNoYWRlciBTb3VyY2UgQ29kZVxyXG4gKiBAcmV0dXJucyBSZXR1cm4gV2ViR0wgcHJvZ3JhbVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVByb2dyYW0oXHJcbiAgICBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCxcclxuICAgIHZlcnRleFNoYWRlclNyYzogc3RyaW5nLFxyXG4gICAgZnJhZ21lbnRTaGFkZXJTcmM6IHN0cmluZ1xyXG4pOiBXZWJHTFByb2dyYW0ge1xyXG4gICAgY29uc3QgdmVydGV4U2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsLlZFUlRFWF9TSEFERVIpIGFzIFdlYkdMU2hhZGVyO1xyXG4gICAgY29uc3QgZnJhZ21lbnRTaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoZ2wuRlJBR01FTlRfU0hBREVSKSBhcyBXZWJHTFNoYWRlcjtcclxuICAgIGNvbnN0IHByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XHJcblxyXG4gICAgZ2wuc2hhZGVyU291cmNlKHZlcnRleFNoYWRlciwgdmVydGV4U2hhZGVyU3JjKTtcclxuICAgIGdsLmNvbXBpbGVTaGFkZXIodmVydGV4U2hhZGVyKTtcclxuICAgIGlmKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIodmVydGV4U2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUykpIHtcclxuICAgICAgICBjb25zdCBlcnJvciA9IGdsLmdldFNoYWRlckluZm9Mb2codmVydGV4U2hhZGVyKTtcclxuICAgICAgICBzaG93RXJyb3IoZXJyb3IgfHwgXCJObyBzaGFkZXIgZGVidWcgbG9nIHByb3ZpZGVkLlwiKTtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICBnbC5zaGFkZXJTb3VyY2UoZnJhZ21lbnRTaGFkZXIsIGZyYWdtZW50U2hhZGVyU3JjKTtcclxuICAgIGdsLmNvbXBpbGVTaGFkZXIoZnJhZ21lbnRTaGFkZXIpO1xyXG4gICAgaWYoIWdsLmdldFNoYWRlclBhcmFtZXRlcihmcmFnbWVudFNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpKSB7XHJcbiAgICAgICAgY29uc3QgZXJyb3IgPSBnbC5nZXRTaGFkZXJJbmZvTG9nKGZyYWdtZW50U2hhZGVyKTtcclxuICAgICAgICBzaG93RXJyb3IoZXJyb3IgfHwgXCJObyBzaGFkZXIgZGVidWcgbG9nIHByb3ZpZGVkLlwiKTtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQcm9ncmFtIHNldCB1cCBmb3IgVW5pZm9ybXMuXHJcbiAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgdmVydGV4U2hhZGVyKTtcclxuICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBmcmFnbWVudFNoYWRlcik7XHJcbiAgICBnbC5saW5rUHJvZ3JhbShwcm9ncmFtKTtcclxuICAgIGlmKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sIGdsLkxJTktfU1RBVFVTKSkge1xyXG4gICAgICAgIGNvbnN0IGVycm9yID0gZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJvZ3JhbSk7XHJcbiAgICAgICAgc2hvd0Vycm9yKGVycm9yIHx8IFwiTm8gcHJvZ3JhbSBkZWJ1ZyBsb2cgcHJvdmlkZWQuXCIpO1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHByb2dyYW07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBXZWJHTCB0ZXh0dXJlIGFuZCBiaW5kIGl0IHRvIGEgVEVYVFVSRV8yRF9BUlJBWS5cclxuICogU2V0IHRoZSBwYXJhbWV0ZXJzIGZvciB0aGUgdGV4dHVyZSBzdG9yYWdlLiAoVGFyZ2V0LCBNaXBtYXBfTGV2ZWxzLCBJbnRlcm5hbF9Gb3JtYXQsIFdpZHRoLCBIZWlnaHQsIEltYWdlc19Db3VudClcclxuICogRmxpcCB0aGUgb3JpZ2luIHBvaW50IG9mIFdlYkdMLiAoUE5HIGZvcm1hdCBzdGFydHMgYXQgdGhlIHRvcCBhbmQgV2ViR0wgYXQgdGhlIGJvdHRvbSlcclxuICogQmVjYXVzZSB0ZXhTdWJJbWFnZTNEIGlzIGFzeW5jLCB3YWl0aW5nIGZvciBlYWNoIGltYWdlIHRvIGxvYWQgaXMgc2xvdy4gU28sIHdlIHByZWxvYWQgYWxsIGltYWdlcyB1c2luZyBhIFByb21pc2UuXHJcbiAqIFNldCB0aGUgcGFyYW1ldGVycyBvbiBob3cgdG8gc3RvcmUgZWFjaCB0ZXh0dXJlLiAoVGFyZ2V0LCBNaXBtYXBfTGV2ZWwsIEludGVybmFsX0Zvcm1hdCwgV2lkdGgsIEhlaWdodCwgRGVwdGgsIEJvcmRlciwgRm9ybWF0LCBUeXBlLCBPZmZzZXQpXHJcbiAqIENoYW5nZSB0aGUgbWluaW11bSBhbmQgbWFnbml0dWRlIGZpbHRlcnMgd2hlbiBzY2FsaW5nIHVwIGFuZCBkb3duIHRleHR1cmVzLlxyXG4gKiBAcGFyYW0gZ2wgV2ViR0wgUmVuZGVyaW5nIENvbnRleHRcclxuICogQHBhcmFtIHRleHR1cmVzIHRleHR1cmUgbGlzdFxyXG4gKiBAYXN5bmNcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkVGV4dHVyZShnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCwgdGV4dHVyZXM6IHN0cmluZ1tdKSB7XHJcbiAgICBjb25zdCB0ZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRF9BUlJBWSwgdGV4dHVyZSk7XHJcbiAgICBnbC50ZXhTdG9yYWdlM0QoZ2wuVEVYVFVSRV8yRF9BUlJBWSwgMSwgZ2wuUkdCQTgsIDEyOCwgMTI4LCB0ZXh0dXJlcy5sZW5ndGgpO1xyXG4gICAgZ2wucGl4ZWxTdG9yZWkoZ2wuVU5QQUNLX0ZMSVBfWV9XRUJHTCwgdHJ1ZSk7XHJcblxyXG4gICAgY29uc3QgaW1hZ2VzID0gYXdhaXQgUHJvbWlzZS5hbGwodGV4dHVyZXMubWFwKHNyYyA9PiBnZXRJbWFnZShzcmMpKSk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGltYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGdsLnRleFN1YkltYWdlM0QoZ2wuVEVYVFVSRV8yRF9BUlJBWSwgMCwgMCwgMCwgaSwgMTI4LCAxMjgsIDEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIGltYWdlc1tpXSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJEX0FSUkFZLCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLk5FQVJFU1QpO1xyXG4gICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJEX0FSUkFZLCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLk5FQVJFU1QpO1xyXG59XHJcbiIsImltcG9ydCB7IFBhbmUgfSBmcm9tICd0d2Vha3BhbmUnO1xyXG5cclxuZXhwb3J0IGNvbnN0IHBhbmUgPSBuZXcgUGFuZSh7dGl0bGU6ICdTZXR0aW5ncycsIGV4cGFuZGVkOiB0cnVlfSk7XHJcblxyXG5leHBvcnQgY29uc3QgU0VUVElOR1MgPSB7XHJcblxyXG4gICAgY2FtZXJhX2ZvdjogMzAuMCxcclxuXHJcbiAgICBvYmplY3Rfcm90YXRpb25fc3BlZWQ6IDEwLjAsXHJcbiAgICBvYmplY3Rfc2l6ZTogMC40LFxyXG5cclxuICAgIGxpZ2h0X2RpcmVjdGlvbjoge3g6IDEuMCwgeTogMS4wLCB6OiAxLjB9LFxyXG5cclxuICAgIGJlbmNobWFya19mcHM6IDAuMCxcclxuICAgIGJlbmNobWFya19sb2FkaW5nX3RpbWU6IDAuMCxcclxuXHJcbiAgICBzb3VyY2VfZ2l0aHViOiAnaHR0cHM6Ly9naXRodWIuY29tL1ZhaGF6L0xlYXJuaW5nLVdlYkdMJyxcclxuICAgIHNvdXJjZV90d2Vha3BhbmU6ICdodHRwczovL3R3ZWFrcGFuZS5naXRodWIuaW8vZG9jcy8nXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICAvLyBDQU1FUkFcclxuXHJcbiAgICBjb25zdCBmQ2FtZXJhID0gcGFuZS5hZGRGb2xkZXIoe3RpdGxlOiAnQ2FtZXJhJywgZXhwYW5kZWQ6IGZhbHNlfSk7XHJcblxyXG4gICAgZkNhbWVyYS5hZGRCaW5kaW5nKFNFVFRJTkdTLCAnY2FtZXJhX2ZvdicsIHtcclxuICAgICAgICBsYWJlbDogJ0ZPVicsXHJcbiAgICAgICAgbWluOiAzMC4wLFxyXG4gICAgICAgIG1heDogMTIwLjAsXHJcbiAgICAgICAgc3RlcDogNS4wXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBPQkpFQ1RcclxuXHJcbiAgICBjb25zdCBmT2JqZWN0ID0gcGFuZS5hZGRGb2xkZXIoe3RpdGxlOiAnT2JqZWN0JywgZXhwYW5kZWQ6IGZhbHNlfSk7XHJcblxyXG4gICAgZk9iamVjdC5hZGRCaW5kaW5nKFNFVFRJTkdTLCAnb2JqZWN0X3JvdGF0aW9uX3NwZWVkJywge1xyXG4gICAgICAgIGxhYmVsOiAnUi4gU3BlZWQnLFxyXG4gICAgICAgIG1pbjogMC4wLFxyXG4gICAgICAgIG1heDogMTgwLjAsXHJcbiAgICAgICAgc3RlcDogMS4wXHJcbiAgICB9KTtcclxuXHJcbiAgICBmT2JqZWN0LmFkZEJpbmRpbmcoU0VUVElOR1MsICdvYmplY3Rfc2l6ZScsIHtcclxuICAgICAgICBsYWJlbDogJ1NpemUnLFxyXG4gICAgICAgIG1pbjogMC4xLFxyXG4gICAgICAgIG1heDogMS4wLFxyXG4gICAgICAgIHN0ZXA6IDAuMVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gTElHSFRcclxuXHJcbiAgICBjb25zdCBmTGlnaHQgPSBwYW5lLmFkZEZvbGRlcih7dGl0bGU6ICdMaWdodCcsIGV4cGFuZGVkOiBmYWxzZX0pO1xyXG5cclxuICAgIGZMaWdodC5hZGRCaW5kaW5nKFNFVFRJTkdTLCAnbGlnaHRfZGlyZWN0aW9uJywge1xyXG4gICAgICAgIGxhYmVsOiAnQW1iaWVudCBMaWdodCcsXHJcbiAgICAgICAgeDoge21pbjogLTEuMCwgbWF4OiAxLjB9LFxyXG4gICAgICAgIHk6IHttaW46IC0xLjAsIG1heDogMS4wfSxcclxuICAgICAgICB6OiB7bWluOiAtMS4wLCBtYXg6IDEuMH0sXHJcbiAgICAgICAgaW50ZXJ2YWw6IDEwMFxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBCRU5DSE1BUktcclxuXHJcbiAgICBjb25zdCBmQmVuY2htYXJrID0gcGFuZS5hZGRGb2xkZXIoe3RpdGxlOiAnVGltZXJzJywgZXhwYW5kZWQ6IHRydWV9KTtcclxuXHJcbiAgICBmQmVuY2htYXJrLmFkZEJpbmRpbmcoU0VUVElOR1MsICdiZW5jaG1hcmtfZnBzJywge1xyXG4gICAgICAgIGxhYmVsOiAnRlBTJyxcclxuICAgICAgICByZWFkb25seTogdHJ1ZSxcclxuICAgICAgICB2aWV3OiAndGV4dCcsXHJcbiAgICAgICAgaW50ZXJ2YWw6IDUwMFxyXG4gICAgfSk7XHJcblxyXG4gICAgZkJlbmNobWFyay5hZGRCaW5kaW5nKFNFVFRJTkdTLCAnYmVuY2htYXJrX2xvYWRpbmdfdGltZScsIHtcclxuICAgICAgICBsYWJlbDogJ0xvYWRpbmcgVGltZScsXHJcbiAgICAgICAgcmVhZG9ubHk6IHRydWUsXHJcbiAgICAgICAgZm9ybWF0OiAodmFsdWU6IG51bWJlcik6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS50b0ZpeGVkKDEpICsgJ21zJztcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBTT1VSQ0VcclxuXHJcbiAgICBjb25zdCBmU291cmNlID0gcGFuZS5hZGRGb2xkZXIoe3RpdGxlOiAnU291cmNlcycsIGV4cGFuZGVkOiBmYWxzZX0pO1xyXG5cclxuICAgIGZTb3VyY2UuYWRkQnV0dG9uKHt0aXRsZTogJ1NlZSBSZXBvc2l0b3J5JywgbGFiZWw6ICdHaXRodWIgUmVwb3NpdG9yeSd9KS5vbignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgd2luZG93Lm9wZW4oU0VUVElOR1Muc291cmNlX2dpdGh1YiwgJ19ibGFuaycpO1xyXG4gICAgfSk7XHJcbiAgICBmU291cmNlLmFkZEJ1dHRvbih7dGl0bGU6ICdTZWUgUGFnZScsIGxhYmVsOiAnVHdlYWtwYW5lIERvY3MnfSkub24oJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5vcGVuKFNFVFRJTkdTLnNvdXJjZV90d2Vha3BhbmUsICdfYmxhbmsnKTtcclxuICAgIH0pO1xyXG59O1xyXG4iLCIvKipcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBwYXJhbSB4IC0gZGVmYXVsdCAwXHJcbiAqIEBwYXJhbSB5IC0gZGVmYXVsdCAwXHJcbiAqIEBwYXJhbSB6IC0gZGVmYXVsdCAwXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgdmVjMyB7XHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwdWJsaWMgeDogbnVtYmVyID0gMC4wLFxyXG4gICAgICAgIHB1YmxpYyB5OiBudW1iZXIgPSAwLjAsXHJcbiAgICAgICAgcHVibGljIHo6IG51bWJlciA9IDAuMFxyXG4gICAgKSB7fVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgdmVjdG9yXHJcbiAgICAgKiBAcGFyYW0gdiB2ZWN0b3IgdG8gYWRkIGJ5XHJcbiAgICAgKiBAcmV0dXJucyBuZXcgdmVjM1xyXG4gICAgICovXHJcbiAgICBhZGQodjogdmVjMyk6IHZlYzMgeyByZXR1cm4gbmV3IHZlYzModGhpcy54ICsgdi54LCB0aGlzLnkgKyB2LnksIHRoaXMueiArIHYueikgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3Vic3RyYWN0IGEgdmVjdG9yXHJcbiAgICAgKiBAcGFyYW0gdiB2ZWN0b3IgdG8gc3Vic3RyYWN0IGJ5XHJcbiAgICAgKiBAcmV0dXJucyBuZXcgdmVjM1xyXG4gICAgICovXHJcbiAgICBzdWJ0cmFjdCh2OiB2ZWMzKTogdmVjMyB7IHJldHVybiBuZXcgdmVjMyh0aGlzLnggLSB2LngsIHRoaXMueSAtIHYueSwgdGhpcy56IC0gdi56KSB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNdWx0aXBseSBhIHZlY3RvclxyXG4gICAgICogQHBhcmFtIHYgdmVjdG9yIHRvIG11bHRpcGx5IGJ5XHJcbiAgICAgKiBAcmV0dXJucyBuZXcgdmVjM1xyXG4gICAgICovXHJcbiAgICBtdWx0aXBseSh2OiB2ZWMzKTogdmVjMyB7IHJldHVybiBuZXcgdmVjMyh0aGlzLnggKiB2LngsIHRoaXMueSAqIHYueSwgdGhpcy56ICogdi56KSB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgYSBjb29yZGluYXRlXHJcbiAgICAgKiBAcGFyYW0geCBjb29yZGluYXRlIHRvIGNoYW5nZVxyXG4gICAgICogQHBhcmFtIHkgY29vcmRpbmF0ZSB0byBjaGFuZ2VcclxuICAgICAqIEBwYXJhbSB6IGNvb3JkaW5hdGUgdG8gY2hhbmdlXHJcbiAgICAgKiBAcmV0dXJucyB1cGRhdGUgdGhpcyB2ZWMzXHJcbiAgICAgKi9cclxuICAgIHNldCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMueiA9IHo7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBOb3JtYWxpemUgYSB2ZWN0b3JcclxuICAgICAqIEByZXR1cm5zIG5ldyB2ZWMzXHJcbiAgICAgKi9cclxuICAgIG5vcm1hbGl6ZSgpOiB2ZWMzIHtcclxuICAgICAgICBjb25zdCBsZW4gPSBNYXRoLmh5cG90KHRoaXMueCwgdGhpcy55LCB0aGlzLnopO1xyXG4gICAgICAgIHJldHVybiBsZW4gPiAwID8gbmV3IHZlYzModGhpcy54IC8gbGVuLCB0aGlzLnkgLyBsZW4sIHRoaXMueiAvIGxlbikgOiBuZXcgdmVjMygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3Jvc3MgcHJvZHVjdCBvZiBhIHZlY3RvclxyXG4gICAgICogQHBhcmFtIHYgdmVjdG9yIHRvIGNyb3NzIHByb2R1Y3QgYnlcclxuICAgICAqIEByZXR1cm5zIG5ldyB2ZWMzXHJcbiAgICAgKi9cclxuICAgIGNyb3NzKHY6IHZlYzMpOiB2ZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IHZlYzMoXHJcbiAgICAgICAgICAgIHRoaXMueSAqIHYueiAtIHRoaXMueiAqIHYueSxcclxuICAgICAgICAgICAgdGhpcy56ICogdi54IC0gdGhpcy54ICogdi56LFxyXG4gICAgICAgICAgICB0aGlzLnggKiB2LnkgLSB0aGlzLnkgKiB2LnhcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRG90IHByb2R1Y3Qgb2YgYSB2ZWN0b3JcclxuICAgICAqIEBwYXJhbSB2IHZlY3RvciB0byBkb3QgcHJvZHVjdCBieVxyXG4gICAgICogQHJldHVybnMgdXBkYXRlIHRoaXMgdmVjM1xyXG4gICAgICovXHJcbiAgICBkb3QodjogdmVjMyk6IG51bWJlciB7IHJldHVybiB0aGlzLnggKiB2LnggKyB0aGlzLnkgKiB2LnkgKyB0aGlzLnogKiB2LnogfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydCBhIHZlY3RvciB0byBhIEZsb2F0MzJBcnJheVxyXG4gICAgICogQHBhcmFtIHYgdmVjdG9yXHJcbiAgICAgKiBAcmV0dXJucyBuZXcgRmxvYXQzMkFycmF5XHJcbiAgICAgKi9cclxuICAgIHRvRmxvYXQzMkFycmF5KCk6IEZsb2F0MzJBcnJheSB7IHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt0aGlzLngsIHRoaXMueSwgdGhpcy56XSk7IH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnQgYSB2ZWN0b3IgdG8gYW4gQXJyYXlcclxuICAgICAqIEBwYXJhbSB2IHZlY3RvclxyXG4gICAgICogQHJldHVybnMgbmV3IEFycmF5IG51bWJlcltdXHJcbiAgICAgKi9cclxuICAgIHRvQXJyYXkoKTogbnVtYmVyW10geyByZXR1cm4gW3RoaXMueCwgdGhpcy55LCB0aGlzLnpdIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua3dlYmdsXCJdID0gc2VsZltcIndlYnBhY2tDaHVua3dlYmdsXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJsaWJcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvbWFpbi50c1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==