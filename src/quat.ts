import { vec3 } from "./vec3";

/**
 * @constructor
 * @param x default 0
 * @param y default 0
 * @param z default 0
 * @param w default 1
 * @method setAxisAngle
 */
export class quat {
    constructor(
        public x: number = 0,
        public y: number = 0,
        public z: number = 0,
        public w: number = 1
    ) {}

    /**
     * Set axis angle
     * @param axis vec3
     * @param angle number divided by 2 to get half
     * @returns
     */
    setAxisAngle(axis: vec3, angle: number): this {
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
