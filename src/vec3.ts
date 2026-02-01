/**
 * @constructor
 * @param x - default 0
 * @param y - default 0
 * @param z - default 0
 */
export class vec3 {
    constructor(
        public x: number = 0.0,
        public y: number = 0.0,
        public z: number = 0.0
    ) {}

    /**
     * Add a vector
     * @param v vector to add by
     * @returns new vec3
     */
    add(v: vec3): vec3 { return new vec3(this.x + v.x, this.y + v.y, this.z + v.z) }

    /**
     * Substract a vector
     * @param v vector to substract by
     * @returns new vec3
     */
    subtract(v: vec3): vec3 { return new vec3(this.x - v.x, this.y - v.y, this.z - v.z) }

    /**
     * Multiply a vector
     * @param v vector to multiply by
     * @returns new vec3
     */
    multiply(v: vec3): vec3 { return new vec3(this.x * v.x, this.y * v.y, this.z * v.z) }

    /**
     * Set a coordinate
     * @param x coordinate to change
     * @param y coordinate to change
     * @param z coordinate to change
     * @returns update this vec3
     */
    set(x: number, y: number, z: number): this {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    /**
     * Normalize a vector
     * @returns new vec3
     */
    normalize(): vec3 {
        const len = Math.hypot(this.x, this.y, this.z);
        return len > 0 ? new vec3(this.x / len, this.y / len, this.z / len) : new vec3();
    }

    /**
     * Cross product of a vector
     * @param v vector to cross product by
     * @returns new vec3
     */
    cross(v: vec3): vec3 {
        return new vec3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    /**
     * Dot product of a vector
     * @param v vector to dot product by
     * @returns update this vec3
     */
    dot(v: vec3): number { return this.x * v.x + this.y * v.y + this.z * v.z }

    /**
     * Convert a vector to a Float32Array
     * @param v vector
     * @returns new Float32Array
     */
    toFloat32Array(): Float32Array { return new Float32Array([this.x, this.y, this.z]); }

    /**
     * Convert a vector to an Array
     * @param v vector
     * @returns new Array number[]
     */
    toArray(): number[] { return [this.x, this.y, this.z] }
}
