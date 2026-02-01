import { vec3 } from "./vec3";
import { quat } from "./quat";

/**
 * @constructor
 */
export class mat4 {
    public mat: Float32Array;

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
    identity(): this {
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
    copyFrom(mat: mat4): this {
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
    multiply(other: mat4): this {
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
    setPerspective(fovRad: number, aspect: number, near: number, far: number): this {
        const f = 1.0 / Math.tan(fovRad / 2);
        const nf = 1 / (near - far);
        const m = this.mat;
        m.set([
            f / aspect,     0,      0,                       0,
            0,              f,      0,                       0,
            0,              0,      (far + near) * nf,      -1,
            0,              0,      2*far*near*nf,           0
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
    setLookAt(eye: vec3, center: vec3, up: vec3): this {
        const z = eye.subtract(center).normalize();
        const x = up.cross(z).normalize();
        const y = z.cross(x);
        const m = this.mat;
        m.set([
            x.x,            y.x,            z.x,            0,
            x.y,            y.y,            z.y,            0,
            x.z,            y.z,            z.z,            0,
            -x.dot(eye),    -y.dot(eye),    -z.dot(eye),    1
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
    setFromRotationTranslationScale(q: quat, v: vec3, s: vec3): this {
        const x2 = q.x + q.x, y2 = q.y + q.y, z2 = q.z + q.z;
        const xx = q.x * x2, xy = q.x * y2, xz = q.x * z2;
        const yy = q.y * y2, yz = q.y * z2, zz = q.z * z2;
        const wx = q.w * x2, wy = q.w * y2, wz = q.w * z2;

        this.mat.set([
            (1 - (yy + zz)) * s.x,      (xy + wz) * s.x,        (xz - wy) * s.x,            0,
            (xy - wz) * s.y,            (1 - (xx + zz)) * s.y,  (yz + wx) * s.y,            0,
            (xz + wy) * s.z,            (yz - wx) * s.z,        (1 - (xx + yy)) * s.z,      0,
            v.x,                        v.y,                    v.z,                        1
        ]);
        return this;
    }

    invert(): this {

        return this;
    }
}
