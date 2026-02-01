import { SETTINGS, init } from "./tweakpane";
import { vec3 } from "./vec3";
import { mat4 } from "./mat4";
import { showError, toRadian } from "./function";
import { createStaticBuffer, createVAOBuffer } from "./buffer";
import { loadTexture, createProgram, getShaderSource } from "./shader";
import { Model, loadModel, ModelData } from "./model";

const UP_VEC = new vec3(0, 1, 0);
const T0 = Date.now();
const TEXTURES = [ './img/texture.png' ];
init();

async function main(): Promise<void> {

    // Canvas Element and Rendering Context.
    const canvas = document.getElementById("webgl-canvas") as HTMLCanvasElement;
    const gl = canvas.getContext('webgl2') as WebGL2RenderingContext;
    if(!gl) { showError("No WebGL2 Context !"); return; }

    const vertexSource = await getShaderSource('./shaders/vertex_shader.vert');
    const fragmentSource = await getShaderSource('./shaders/fragment_shader.frag');
    const program = createProgram(gl, vertexSource, fragmentSource);

    // Load all images in a Texture Array.
    loadTexture(gl, TEXTURES);

    /* Getting all attributes from the vertex shader file.
     * Attribute locations can be forced in the vertex shader file with (location=<number>).
     * If not forced, WebGL gives them a number, you can get this number with gl.getAttribLocation(<program_name>, <attribute_name>).
     * Because we set manually the attribute location in the vertex shader,
     * we can replace gl.getAttribLocation(<program_name>, <attribute_name>) with location's number.
     */
    const aVertexPosition = 0;  //can also use: gl.getAttribLocation(program, 'aVertexPosition');
    const aUV = 1;              //can also use: gl.getAttribLocation(program, 'aUV');
    const aDepth = 2;           //can also use: gl.getAttribLocation(program, 'aDepth');
    const aNormal = 3;          //can also use: gl.getAttribLocation(program, 'aNormal');

    // We can't specify Uniforms locations manually. We need to get them using gl.getUniformLocation(<program_name>, <uniform_name>).
    const uMatWorld = gl.getUniformLocation(program, 'uMatWorld') as WebGLUniformLocation;
    const uMatView = gl.getUniformLocation(program, 'uMatViewProj') as WebGLUniformLocation;
    const uSampler = gl.getUniformLocation(program, 'uSampler') as WebGLUniformLocation;
    const uLightDirection = gl.getUniformLocation(program, 'uLightDirection') as WebGLUniformLocation;

    // Add a light direction to the world.
    let lightDirection = new vec3(SETTINGS.light_direction.x, SETTINGS.light_direction.y, SETTINGS.light_direction.z).normalize();

    // Typescript wants to verify if the variables are set, not the best way to do it.
    if(
        aVertexPosition < 0
        || aUV < 0
        || aDepth < 0
        || aNormal < 0
        || !uMatWorld
        || !uMatView
        || !uSampler
        || !uLightDirection
    ) {
        showError(`Failed to get attribs/uniforms (Max: ${gl.getParameter(gl.MAX_VERTEX_ATTRIBS)}): ` +
            ` pos=${aVertexPosition}` +
            ` uv=${aUV}` +
            ` depth=${aDepth}` +
            ` matWorld=${!!uMatWorld}` +
            ` matViewProj=${!!uMatView}` +
            ` sampler=${!!uSampler}` +
            ` lightDirection=${!!uLightDirection}`
        );
        return;
    }

    // Control texture array's depth. Allow us to pick the displayed texture.
    gl.vertexAttrib1f(aDepth, 1);

    // Send LightDirection to the shader.
    gl.uniform3fv(uLightDirection, lightDirection.toFloat32Array());

    let models: Model[] = [];
    let modelsData: Array<ModelData>[] = [];

    modelsData.push(await loadModel('./models/icosphere.gltf', './models/icosphere.bin'));
    modelsData.push(await loadModel('./models/monkey.gltf', './models/monkey.bin'));
    modelsData.forEach((modelData) => {
        for (const data of modelData) {
            const modelVertexBuffer = createStaticBuffer(gl, data.vertices, false);
            const modelIndexBuffer = createStaticBuffer(gl, data.indices, true);
            const modelUVBuffer = createStaticBuffer(gl, data.uvs, false);
            const modelNormalBuffer = createStaticBuffer(gl, data.normals, false);

            const modelVAO = createVAOBuffer(
                gl,
                modelVertexBuffer,
                modelIndexBuffer,
                modelUVBuffer,
                modelNormalBuffer,
                aVertexPosition,
                aUV,
                aNormal
            );

            let position = new vec3(-.5, 0, 0);
            // Monkey "suzanne" model.
            if (data.name == "Suzanne") position = new vec3(.5, 0, 0);

            models.push(new Model(
                position,
                SETTINGS.object_size,
                UP_VEC,
                toRadian(0),
                modelVAO,
                data.indices.length
            ));
        }
    })

    let matView = new mat4();
    let matProj = new mat4();
    let matViewProj = new mat4();

    let cameraAngle = 0;
    let lastFrameTime = performance.now();

    const frame = async () => {
        // dt (delta time) represent the time spent between each frame, in milliseconds.
        // Delta time standardize a program, to run at the same speed.
        const thisFrameTime = performance.now();
        const dt = thisFrameTime - lastFrameTime;
        lastFrameTime = thisFrameTime;

        // FPS (Frame Per Seconds) is a frequency, it's the invert of dt.
        SETTINGS.benchmark_fps = Math.ceil(1 / (dt / 1000));

        // Allow to change light direction in real time.
        lightDirection = new vec3(SETTINGS.light_direction.x, SETTINGS.light_direction.y, SETTINGS.light_direction.z).normalize();
        gl.uniform3fv(uLightDirection, lightDirection.toFloat32Array());

        // CAMERA
        // TODO: Add camera movement.
        // Each frame adds 10° to the camera angle.
        // cameraAngle += (dt / 1000) * toRadian(10);
        const cameraX = 3 * Math.sin(cameraAngle);
        const cameraZ = 3 * Math.cos(cameraAngle);

        // Make the camera look at the center.
        matView.setLookAt(
            new vec3(cameraX, -.25, cameraZ),
            new vec3(0, 0, 0),
            new vec3(0, 1, 0)
        );

        // Set the camera FOV, screen size, and view distance.
        matProj.setPerspective(
            toRadian(SETTINGS.camera_fov), // FOV
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
            model.rotate((dt / 1000) * toRadian(SETTINGS.object_rotation_speed));
            model.scale = SETTINGS.object_size;
            model.draw(gl, uMatWorld);
        });

        // Loop calls, each time the drawing is ready.
        requestAnimationFrame(frame);
    };
    // First call, as soon as the page is loaded.
    requestAnimationFrame(frame);
    SETTINGS.benchmark_loading_time = Date.now() - T0;
}



try {
    main().then(() => {
        showError(">> No Errors! 🌞");
    })
    .catch((e) => {
        showError(`Uncaught async exception: ${e}`);
    })
} catch(e) {
    showError(`Uncaught synchronous exception: ${e}`);
}
