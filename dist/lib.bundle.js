"use strict";
(self["webpackChunkwebgl"] = self["webpackChunkwebgl"] || []).push([["lib"],{

/***/ "./node_modules/tweakpane/dist/tweakpane.js":
/*!**************************************************!*\
  !*** ./node_modules/tweakpane/dist/tweakpane.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BladeApi: () => (/* binding */ BladeApi),
/* harmony export */   ButtonApi: () => (/* binding */ ButtonApi),
/* harmony export */   FolderApi: () => (/* binding */ FolderApi),
/* harmony export */   ListBladeApi: () => (/* binding */ ListBladeApi),
/* harmony export */   ListInputBindingApi: () => (/* binding */ ListInputBindingApi),
/* harmony export */   Pane: () => (/* binding */ Pane),
/* harmony export */   Semver: () => (/* binding */ Semver),
/* harmony export */   SeparatorBladeApi: () => (/* binding */ SeparatorBladeApi),
/* harmony export */   SliderBladeApi: () => (/* binding */ SliderBladeApi),
/* harmony export */   SliderInputBindingApi: () => (/* binding */ SliderInputBindingApi),
/* harmony export */   TabApi: () => (/* binding */ TabApi),
/* harmony export */   TabPageApi: () => (/* binding */ TabPageApi),
/* harmony export */   TextBladeApi: () => (/* binding */ TextBladeApi),
/* harmony export */   TpChangeEvent: () => (/* binding */ TpChangeEvent),
/* harmony export */   VERSION: () => (/* binding */ VERSION)
/* harmony export */ });
/*! Tweakpane 4.0.5 (c) 2016 cocopon, licensed under the MIT license. */
function forceCast(v) {
    return v;
}
function isEmpty(value) {
    return value === null || value === undefined;
}
function isObject$1(value) {
    return value !== null && typeof value === 'object';
}
function isRecord(value) {
    return value !== null && typeof value === 'object';
}
function deepEqualsArray(a1, a2) {
    if (a1.length !== a2.length) {
        return false;
    }
    for (let i = 0; i < a1.length; i++) {
        if (a1[i] !== a2[i]) {
            return false;
        }
    }
    return true;
}
function deepMerge(r1, r2) {
    const keys = Array.from(new Set([...Object.keys(r1), ...Object.keys(r2)]));
    return keys.reduce((result, key) => {
        const v1 = r1[key];
        const v2 = r2[key];
        return isRecord(v1) && isRecord(v2)
            ? Object.assign(Object.assign({}, result), { [key]: deepMerge(v1, v2) }) : Object.assign(Object.assign({}, result), { [key]: key in r2 ? v2 : v1 });
    }, {});
}

function isBinding(value) {
    if (!isObject$1(value)) {
        return false;
    }
    return 'target' in value;
}

const CREATE_MESSAGE_MAP = {
    alreadydisposed: () => 'View has been already disposed',
    invalidparams: (context) => `Invalid parameters for '${context.name}'`,
    nomatchingcontroller: (context) => `No matching controller for '${context.key}'`,
    nomatchingview: (context) => `No matching view for '${JSON.stringify(context.params)}'`,
    notbindable: () => `Value is not bindable`,
    notcompatible: (context) => `Not compatible with  plugin '${context.id}'`,
    propertynotfound: (context) => `Property '${context.name}' not found`,
    shouldneverhappen: () => 'This error should never happen',
};
class TpError {
    static alreadyDisposed() {
        return new TpError({ type: 'alreadydisposed' });
    }
    static notBindable() {
        return new TpError({
            type: 'notbindable',
        });
    }
    static notCompatible(bundleId, id) {
        return new TpError({
            type: 'notcompatible',
            context: {
                id: `${bundleId}.${id}`,
            },
        });
    }
    static propertyNotFound(name) {
        return new TpError({
            type: 'propertynotfound',
            context: {
                name: name,
            },
        });
    }
    static shouldNeverHappen() {
        return new TpError({ type: 'shouldneverhappen' });
    }
    constructor(config) {
        var _a;
        this.message =
            (_a = CREATE_MESSAGE_MAP[config.type](forceCast(config.context))) !== null && _a !== void 0 ? _a : 'Unexpected error';
        this.name = this.constructor.name;
        this.stack = new Error(this.message).stack;
        this.type = config.type;
    }
    toString() {
        return this.message;
    }
}

class BindingTarget {
    constructor(obj, key) {
        this.obj_ = obj;
        this.key = key;
    }
    static isBindable(obj) {
        if (obj === null) {
            return false;
        }
        if (typeof obj !== 'object' && typeof obj !== 'function') {
            return false;
        }
        return true;
    }
    read() {
        return this.obj_[this.key];
    }
    write(value) {
        this.obj_[this.key] = value;
    }
    writeProperty(name, value) {
        const valueObj = this.read();
        if (!BindingTarget.isBindable(valueObj)) {
            throw TpError.notBindable();
        }
        if (!(name in valueObj)) {
            throw TpError.propertyNotFound(name);
        }
        valueObj[name] = value;
    }
}

class Emitter {
    constructor() {
        this.observers_ = {};
    }
    on(eventName, handler, opt_options) {
        var _a;
        let observers = this.observers_[eventName];
        if (!observers) {
            observers = this.observers_[eventName] = [];
        }
        observers.push({
            handler: handler,
            key: (_a = opt_options === null || opt_options === void 0 ? void 0 : opt_options.key) !== null && _a !== void 0 ? _a : handler,
        });
        return this;
    }
    off(eventName, key) {
        const observers = this.observers_[eventName];
        if (observers) {
            this.observers_[eventName] = observers.filter((observer) => {
                return observer.key !== key;
            });
        }
        return this;
    }
    emit(eventName, event) {
        const observers = this.observers_[eventName];
        if (!observers) {
            return;
        }
        observers.forEach((observer) => {
            observer.handler(event);
        });
    }
}

class ComplexValue {
    constructor(initialValue, config) {
        var _a;
        this.constraint_ = config === null || config === void 0 ? void 0 : config.constraint;
        this.equals_ = (_a = config === null || config === void 0 ? void 0 : config.equals) !== null && _a !== void 0 ? _a : ((v1, v2) => v1 === v2);
        this.emitter = new Emitter();
        this.rawValue_ = initialValue;
    }
    get constraint() {
        return this.constraint_;
    }
    get rawValue() {
        return this.rawValue_;
    }
    set rawValue(rawValue) {
        this.setRawValue(rawValue, {
            forceEmit: false,
            last: true,
        });
    }
    setRawValue(rawValue, options) {
        const opts = options !== null && options !== void 0 ? options : {
            forceEmit: false,
            last: true,
        };
        const constrainedValue = this.constraint_
            ? this.constraint_.constrain(rawValue)
            : rawValue;
        const prevValue = this.rawValue_;
        const changed = !this.equals_(prevValue, constrainedValue);
        if (!changed && !opts.forceEmit) {
            return;
        }
        this.emitter.emit('beforechange', {
            sender: this,
        });
        this.rawValue_ = constrainedValue;
        this.emitter.emit('change', {
            options: opts,
            previousRawValue: prevValue,
            rawValue: constrainedValue,
            sender: this,
        });
    }
}

class PrimitiveValue {
    constructor(initialValue) {
        this.emitter = new Emitter();
        this.value_ = initialValue;
    }
    get rawValue() {
        return this.value_;
    }
    set rawValue(value) {
        this.setRawValue(value, {
            forceEmit: false,
            last: true,
        });
    }
    setRawValue(value, options) {
        const opts = options !== null && options !== void 0 ? options : {
            forceEmit: false,
            last: true,
        };
        const prevValue = this.value_;
        if (prevValue === value && !opts.forceEmit) {
            return;
        }
        this.emitter.emit('beforechange', {
            sender: this,
        });
        this.value_ = value;
        this.emitter.emit('change', {
            options: opts,
            previousRawValue: prevValue,
            rawValue: this.value_,
            sender: this,
        });
    }
}

class ReadonlyPrimitiveValue {
    constructor(value) {
        this.emitter = new Emitter();
        this.onValueBeforeChange_ = this.onValueBeforeChange_.bind(this);
        this.onValueChange_ = this.onValueChange_.bind(this);
        this.value_ = value;
        this.value_.emitter.on('beforechange', this.onValueBeforeChange_);
        this.value_.emitter.on('change', this.onValueChange_);
    }
    get rawValue() {
        return this.value_.rawValue;
    }
    onValueBeforeChange_(ev) {
        this.emitter.emit('beforechange', Object.assign(Object.assign({}, ev), { sender: this }));
    }
    onValueChange_(ev) {
        this.emitter.emit('change', Object.assign(Object.assign({}, ev), { sender: this }));
    }
}

function createValue(initialValue, config) {
    const constraint = config === null || config === void 0 ? void 0 : config.constraint;
    const equals = config === null || config === void 0 ? void 0 : config.equals;
    if (!constraint && !equals) {
        return new PrimitiveValue(initialValue);
    }
    return new ComplexValue(initialValue, config);
}
function createReadonlyValue(value) {
    return [
        new ReadonlyPrimitiveValue(value),
        (rawValue, options) => {
            value.setRawValue(rawValue, options);
        },
    ];
}

class ValueMap {
    constructor(valueMap) {
        this.emitter = new Emitter();
        this.valMap_ = valueMap;
        for (const key in this.valMap_) {
            const v = this.valMap_[key];
            v.emitter.on('change', () => {
                this.emitter.emit('change', {
                    key: key,
                    sender: this,
                });
            });
        }
    }
    static createCore(initialValue) {
        const keys = Object.keys(initialValue);
        return keys.reduce((o, key) => {
            return Object.assign(o, {
                [key]: createValue(initialValue[key]),
            });
        }, {});
    }
    static fromObject(initialValue) {
        const core = this.createCore(initialValue);
        return new ValueMap(core);
    }
    get(key) {
        return this.valMap_[key].rawValue;
    }
    set(key, value) {
        this.valMap_[key].rawValue = value;
    }
    value(key) {
        return this.valMap_[key];
    }
}

class DefiniteRangeConstraint {
    constructor(config) {
        this.values = ValueMap.fromObject({
            max: config.max,
            min: config.min,
        });
    }
    constrain(value) {
        const max = this.values.get('max');
        const min = this.values.get('min');
        return Math.min(Math.max(value, min), max);
    }
}

class RangeConstraint {
    constructor(config) {
        this.values = ValueMap.fromObject({
            max: config.max,
            min: config.min,
        });
    }
    constrain(value) {
        const max = this.values.get('max');
        const min = this.values.get('min');
        let result = value;
        if (!isEmpty(min)) {
            result = Math.max(result, min);
        }
        if (!isEmpty(max)) {
            result = Math.min(result, max);
        }
        return result;
    }
}

class StepConstraint {
    constructor(step, origin = 0) {
        this.step = step;
        this.origin = origin;
    }
    constrain(value) {
        const o = this.origin % this.step;
        const r = Math.round((value - o) / this.step);
        return o + r * this.step;
    }
}

class NumberLiteralNode {
    constructor(text) {
        this.text = text;
    }
    evaluate() {
        return Number(this.text);
    }
    toString() {
        return this.text;
    }
}
const BINARY_OPERATION_MAP = {
    '**': (v1, v2) => Math.pow(v1, v2),
    '*': (v1, v2) => v1 * v2,
    '/': (v1, v2) => v1 / v2,
    '%': (v1, v2) => v1 % v2,
    '+': (v1, v2) => v1 + v2,
    '-': (v1, v2) => v1 - v2,
    '<<': (v1, v2) => v1 << v2,
    '>>': (v1, v2) => v1 >> v2,
    '>>>': (v1, v2) => v1 >>> v2,
    '&': (v1, v2) => v1 & v2,
    '^': (v1, v2) => v1 ^ v2,
    '|': (v1, v2) => v1 | v2,
};
class BinaryOperationNode {
    constructor(operator, left, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    evaluate() {
        const op = BINARY_OPERATION_MAP[this.operator];
        if (!op) {
            throw new Error(`unexpected binary operator: '${this.operator}`);
        }
        return op(this.left.evaluate(), this.right.evaluate());
    }
    toString() {
        return [
            'b(',
            this.left.toString(),
            this.operator,
            this.right.toString(),
            ')',
        ].join(' ');
    }
}
const UNARY_OPERATION_MAP = {
    '+': (v) => v,
    '-': (v) => -v,
    '~': (v) => ~v,
};
class UnaryOperationNode {
    constructor(operator, expr) {
        this.operator = operator;
        this.expression = expr;
    }
    evaluate() {
        const op = UNARY_OPERATION_MAP[this.operator];
        if (!op) {
            throw new Error(`unexpected unary operator: '${this.operator}`);
        }
        return op(this.expression.evaluate());
    }
    toString() {
        return ['u(', this.operator, this.expression.toString(), ')'].join(' ');
    }
}

function combineReader(parsers) {
    return (text, cursor) => {
        for (let i = 0; i < parsers.length; i++) {
            const result = parsers[i](text, cursor);
            if (result !== '') {
                return result;
            }
        }
        return '';
    };
}
function readWhitespace(text, cursor) {
    var _a;
    const m = text.substr(cursor).match(/^\s+/);
    return (_a = (m && m[0])) !== null && _a !== void 0 ? _a : '';
}
function readNonZeroDigit(text, cursor) {
    const ch = text.substr(cursor, 1);
    return ch.match(/^[1-9]$/) ? ch : '';
}
function readDecimalDigits(text, cursor) {
    var _a;
    const m = text.substr(cursor).match(/^[0-9]+/);
    return (_a = (m && m[0])) !== null && _a !== void 0 ? _a : '';
}
function readSignedInteger(text, cursor) {
    const ds = readDecimalDigits(text, cursor);
    if (ds !== '') {
        return ds;
    }
    const sign = text.substr(cursor, 1);
    cursor += 1;
    if (sign !== '-' && sign !== '+') {
        return '';
    }
    const sds = readDecimalDigits(text, cursor);
    if (sds === '') {
        return '';
    }
    return sign + sds;
}
function readExponentPart(text, cursor) {
    const e = text.substr(cursor, 1);
    cursor += 1;
    if (e.toLowerCase() !== 'e') {
        return '';
    }
    const si = readSignedInteger(text, cursor);
    if (si === '') {
        return '';
    }
    return e + si;
}
function readDecimalIntegerLiteral(text, cursor) {
    const ch = text.substr(cursor, 1);
    if (ch === '0') {
        return ch;
    }
    const nzd = readNonZeroDigit(text, cursor);
    cursor += nzd.length;
    if (nzd === '') {
        return '';
    }
    return nzd + readDecimalDigits(text, cursor);
}
function readDecimalLiteral1(text, cursor) {
    const dil = readDecimalIntegerLiteral(text, cursor);
    cursor += dil.length;
    if (dil === '') {
        return '';
    }
    const dot = text.substr(cursor, 1);
    cursor += dot.length;
    if (dot !== '.') {
        return '';
    }
    const dds = readDecimalDigits(text, cursor);
    cursor += dds.length;
    return dil + dot + dds + readExponentPart(text, cursor);
}
function readDecimalLiteral2(text, cursor) {
    const dot = text.substr(cursor, 1);
    cursor += dot.length;
    if (dot !== '.') {
        return '';
    }
    const dds = readDecimalDigits(text, cursor);
    cursor += dds.length;
    if (dds === '') {
        return '';
    }
    return dot + dds + readExponentPart(text, cursor);
}
function readDecimalLiteral3(text, cursor) {
    const dil = readDecimalIntegerLiteral(text, cursor);
    cursor += dil.length;
    if (dil === '') {
        return '';
    }
    return dil + readExponentPart(text, cursor);
}
const readDecimalLiteral = combineReader([
    readDecimalLiteral1,
    readDecimalLiteral2,
    readDecimalLiteral3,
]);
function parseBinaryDigits(text, cursor) {
    var _a;
    const m = text.substr(cursor).match(/^[01]+/);
    return (_a = (m && m[0])) !== null && _a !== void 0 ? _a : '';
}
function readBinaryIntegerLiteral(text, cursor) {
    const prefix = text.substr(cursor, 2);
    cursor += prefix.length;
    if (prefix.toLowerCase() !== '0b') {
        return '';
    }
    const bds = parseBinaryDigits(text, cursor);
    if (bds === '') {
        return '';
    }
    return prefix + bds;
}
function readOctalDigits(text, cursor) {
    var _a;
    const m = text.substr(cursor).match(/^[0-7]+/);
    return (_a = (m && m[0])) !== null && _a !== void 0 ? _a : '';
}
function readOctalIntegerLiteral(text, cursor) {
    const prefix = text.substr(cursor, 2);
    cursor += prefix.length;
    if (prefix.toLowerCase() !== '0o') {
        return '';
    }
    const ods = readOctalDigits(text, cursor);
    if (ods === '') {
        return '';
    }
    return prefix + ods;
}
function readHexDigits(text, cursor) {
    var _a;
    const m = text.substr(cursor).match(/^[0-9a-f]+/i);
    return (_a = (m && m[0])) !== null && _a !== void 0 ? _a : '';
}
function readHexIntegerLiteral(text, cursor) {
    const prefix = text.substr(cursor, 2);
    cursor += prefix.length;
    if (prefix.toLowerCase() !== '0x') {
        return '';
    }
    const hds = readHexDigits(text, cursor);
    if (hds === '') {
        return '';
    }
    return prefix + hds;
}
const readNonDecimalIntegerLiteral = combineReader([
    readBinaryIntegerLiteral,
    readOctalIntegerLiteral,
    readHexIntegerLiteral,
]);
const readNumericLiteral = combineReader([
    readNonDecimalIntegerLiteral,
    readDecimalLiteral,
]);

function parseLiteral(text, cursor) {
    const num = readNumericLiteral(text, cursor);
    cursor += num.length;
    if (num === '') {
        return null;
    }
    return {
        evaluable: new NumberLiteralNode(num),
        cursor: cursor,
    };
}
function parseParenthesizedExpression(text, cursor) {
    const op = text.substr(cursor, 1);
    cursor += op.length;
    if (op !== '(') {
        return null;
    }
    const expr = parseExpression(text, cursor);
    if (!expr) {
        return null;
    }
    cursor = expr.cursor;
    cursor += readWhitespace(text, cursor).length;
    const cl = text.substr(cursor, 1);
    cursor += cl.length;
    if (cl !== ')') {
        return null;
    }
    return {
        evaluable: expr.evaluable,
        cursor: cursor,
    };
}
function parsePrimaryExpression(text, cursor) {
    var _a;
    return ((_a = parseLiteral(text, cursor)) !== null && _a !== void 0 ? _a : parseParenthesizedExpression(text, cursor));
}
function parseUnaryExpression(text, cursor) {
    const expr = parsePrimaryExpression(text, cursor);
    if (expr) {
        return expr;
    }
    const op = text.substr(cursor, 1);
    cursor += op.length;
    if (op !== '+' && op !== '-' && op !== '~') {
        return null;
    }
    const num = parseUnaryExpression(text, cursor);
    if (!num) {
        return null;
    }
    cursor = num.cursor;
    return {
        cursor: cursor,
        evaluable: new UnaryOperationNode(op, num.evaluable),
    };
}
function readBinaryOperator(ops, text, cursor) {
    cursor += readWhitespace(text, cursor).length;
    const op = ops.filter((op) => text.startsWith(op, cursor))[0];
    if (!op) {
        return null;
    }
    cursor += op.length;
    cursor += readWhitespace(text, cursor).length;
    return {
        cursor: cursor,
        operator: op,
    };
}
function createBinaryOperationExpressionParser(exprParser, ops) {
    return (text, cursor) => {
        const firstExpr = exprParser(text, cursor);
        if (!firstExpr) {
            return null;
        }
        cursor = firstExpr.cursor;
        let expr = firstExpr.evaluable;
        for (;;) {
            const op = readBinaryOperator(ops, text, cursor);
            if (!op) {
                break;
            }
            cursor = op.cursor;
            const nextExpr = exprParser(text, cursor);
            if (!nextExpr) {
                return null;
            }
            cursor = nextExpr.cursor;
            expr = new BinaryOperationNode(op.operator, expr, nextExpr.evaluable);
        }
        return expr
            ? {
                cursor: cursor,
                evaluable: expr,
            }
            : null;
    };
}
const parseBinaryOperationExpression = [
    ['**'],
    ['*', '/', '%'],
    ['+', '-'],
    ['<<', '>>>', '>>'],
    ['&'],
    ['^'],
    ['|'],
].reduce((parser, ops) => {
    return createBinaryOperationExpressionParser(parser, ops);
}, parseUnaryExpression);
function parseExpression(text, cursor) {
    cursor += readWhitespace(text, cursor).length;
    return parseBinaryOperationExpression(text, cursor);
}
function parseEcmaNumberExpression(text) {
    const expr = parseExpression(text, 0);
    if (!expr) {
        return null;
    }
    const cursor = expr.cursor + readWhitespace(text, expr.cursor).length;
    if (cursor !== text.length) {
        return null;
    }
    return expr.evaluable;
}

function parseNumber(text) {
    var _a;
    const r = parseEcmaNumberExpression(text);
    return (_a = r === null || r === void 0 ? void 0 : r.evaluate()) !== null && _a !== void 0 ? _a : null;
}
function numberFromUnknown(value) {
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'string') {
        const pv = parseNumber(value);
        if (!isEmpty(pv)) {
            return pv;
        }
    }
    return 0;
}
function numberToString(value) {
    return String(value);
}
function createNumberFormatter(digits) {
    return (value) => {
        return value.toFixed(Math.max(Math.min(digits, 20), 0));
    };
}

function mapRange(value, start1, end1, start2, end2) {
    const p = (value - start1) / (end1 - start1);
    return start2 + p * (end2 - start2);
}
function getDecimalDigits(value) {
    const text = String(value.toFixed(10));
    const frac = text.split('.')[1];
    return frac.replace(/0+$/, '').length;
}
function constrainRange(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
function loopRange(value, max) {
    return ((value % max) + max) % max;
}
function getSuitableDecimalDigits(params, rawValue) {
    return !isEmpty(params.step)
        ? getDecimalDigits(params.step)
        : Math.max(getDecimalDigits(rawValue), 2);
}
function getSuitableKeyScale(params) {
    var _a;
    return (_a = params.step) !== null && _a !== void 0 ? _a : 1;
}
function getSuitablePointerScale(params, rawValue) {
    var _a;
    const base = Math.abs((_a = params.step) !== null && _a !== void 0 ? _a : rawValue);
    return base === 0 ? 0.1 : Math.pow(10, Math.floor(Math.log10(base)) - 1);
}
function createStepConstraint(params, initialValue) {
    if (!isEmpty(params.step)) {
        return new StepConstraint(params.step, initialValue);
    }
    return null;
}
function createRangeConstraint(params) {
    if (!isEmpty(params.max) && !isEmpty(params.min)) {
        return new DefiniteRangeConstraint({
            max: params.max,
            min: params.min,
        });
    }
    if (!isEmpty(params.max) || !isEmpty(params.min)) {
        return new RangeConstraint({
            max: params.max,
            min: params.min,
        });
    }
    return null;
}
function createNumberTextPropsObject(params, initialValue) {
    var _a, _b, _c;
    return {
        formatter: (_a = params.format) !== null && _a !== void 0 ? _a : createNumberFormatter(getSuitableDecimalDigits(params, initialValue)),
        keyScale: (_b = params.keyScale) !== null && _b !== void 0 ? _b : getSuitableKeyScale(params),
        pointerScale: (_c = params.pointerScale) !== null && _c !== void 0 ? _c : getSuitablePointerScale(params, initialValue),
    };
}
function createNumberTextInputParamsParser(p) {
    return {
        format: p.optional.function,
        keyScale: p.optional.number,
        max: p.optional.number,
        min: p.optional.number,
        pointerScale: p.optional.number,
        step: p.optional.number,
    };
}

function createPointAxis(config) {
    return {
        constraint: config.constraint,
        textProps: ValueMap.fromObject(createNumberTextPropsObject(config.params, config.initialValue)),
    };
}

class BladeApi {
    constructor(controller) {
        this.controller = controller;
    }
    get element() {
        return this.controller.view.element;
    }
    get disabled() {
        return this.controller.viewProps.get('disabled');
    }
    set disabled(disabled) {
        this.controller.viewProps.set('disabled', disabled);
    }
    get hidden() {
        return this.controller.viewProps.get('hidden');
    }
    set hidden(hidden) {
        this.controller.viewProps.set('hidden', hidden);
    }
    dispose() {
        this.controller.viewProps.set('disposed', true);
    }
    importState(state) {
        return this.controller.importState(state);
    }
    exportState() {
        return this.controller.exportState();
    }
}

class TpEvent {
    constructor(target) {
        this.target = target;
    }
}
class TpChangeEvent extends TpEvent {
    constructor(target, value, last) {
        super(target);
        this.value = value;
        this.last = last !== null && last !== void 0 ? last : true;
    }
}
class TpFoldEvent extends TpEvent {
    constructor(target, expanded) {
        super(target);
        this.expanded = expanded;
    }
}
class TpTabSelectEvent extends TpEvent {
    constructor(target, index) {
        super(target);
        this.index = index;
    }
}
class TpMouseEvent extends TpEvent {
    constructor(target, nativeEvent) {
        super(target);
        this.native = nativeEvent;
    }
}

class BindingApi extends BladeApi {
    constructor(controller) {
        super(controller);
        this.onValueChange_ = this.onValueChange_.bind(this);
        this.emitter_ = new Emitter();
        this.controller.value.emitter.on('change', this.onValueChange_);
    }
    get label() {
        return this.controller.labelController.props.get('label');
    }
    set label(label) {
        this.controller.labelController.props.set('label', label);
    }
    get key() {
        return this.controller.value.binding.target.key;
    }
    get tag() {
        return this.controller.tag;
    }
    set tag(tag) {
        this.controller.tag = tag;
    }
    on(eventName, handler) {
        const bh = handler.bind(this);
        this.emitter_.on(eventName, (ev) => {
            bh(ev);
        }, {
            key: handler,
        });
        return this;
    }
    off(eventName, handler) {
        this.emitter_.off(eventName, handler);
        return this;
    }
    refresh() {
        this.controller.value.fetch();
    }
    onValueChange_(ev) {
        const value = this.controller.value;
        this.emitter_.emit('change', new TpChangeEvent(this, forceCast(value.binding.target.read()), ev.options.last));
    }
}

class InputBindingValue {
    constructor(value, binding) {
        this.onValueBeforeChange_ = this.onValueBeforeChange_.bind(this);
        this.onValueChange_ = this.onValueChange_.bind(this);
        this.binding = binding;
        this.value_ = value;
        this.value_.emitter.on('beforechange', this.onValueBeforeChange_);
        this.value_.emitter.on('change', this.onValueChange_);
        this.emitter = new Emitter();
    }
    get rawValue() {
        return this.value_.rawValue;
    }
    set rawValue(rawValue) {
        this.value_.rawValue = rawValue;
    }
    setRawValue(rawValue, options) {
        this.value_.setRawValue(rawValue, options);
    }
    fetch() {
        this.value_.rawValue = this.binding.read();
    }
    push() {
        this.binding.write(this.value_.rawValue);
    }
    onValueBeforeChange_(ev) {
        this.emitter.emit('beforechange', Object.assign(Object.assign({}, ev), { sender: this }));
    }
    onValueChange_(ev) {
        this.push();
        this.emitter.emit('change', Object.assign(Object.assign({}, ev), { sender: this }));
    }
}
function isInputBindingValue(v) {
    if (!('binding' in v)) {
        return false;
    }
    const b = v['binding'];
    return isBinding(b) && 'read' in b && 'write' in b;
}

function parseObject(value, keyToParserMap) {
    const keys = Object.keys(keyToParserMap);
    const result = keys.reduce((tmp, key) => {
        if (tmp === undefined) {
            return undefined;
        }
        const parser = keyToParserMap[key];
        const result = parser(value[key]);
        return result.succeeded
            ? Object.assign(Object.assign({}, tmp), { [key]: result.value }) : undefined;
    }, {});
    return forceCast(result);
}
function parseArray(value, parseItem) {
    return value.reduce((tmp, item) => {
        if (tmp === undefined) {
            return undefined;
        }
        const result = parseItem(item);
        if (!result.succeeded || result.value === undefined) {
            return undefined;
        }
        return [...tmp, result.value];
    }, []);
}
function isObject(value) {
    if (value === null) {
        return false;
    }
    return typeof value === 'object';
}
function createMicroParserBuilder(parse) {
    return (optional) => (v) => {
        if (!optional && v === undefined) {
            return {
                succeeded: false,
                value: undefined,
            };
        }
        if (optional && v === undefined) {
            return {
                succeeded: true,
                value: undefined,
            };
        }
        const result = parse(v);
        return result !== undefined
            ? {
                succeeded: true,
                value: result,
            }
            : {
                succeeded: false,
                value: undefined,
            };
    };
}
function createMicroParserBuilders(optional) {
    return {
        custom: (parse) => createMicroParserBuilder(parse)(optional),
        boolean: createMicroParserBuilder((v) => typeof v === 'boolean' ? v : undefined)(optional),
        number: createMicroParserBuilder((v) => typeof v === 'number' ? v : undefined)(optional),
        string: createMicroParserBuilder((v) => typeof v === 'string' ? v : undefined)(optional),
        function: createMicroParserBuilder((v) =>
        typeof v === 'function' ? v : undefined)(optional),
        constant: (value) => createMicroParserBuilder((v) => (v === value ? value : undefined))(optional),
        raw: createMicroParserBuilder((v) => v)(optional),
        object: (keyToParserMap) => createMicroParserBuilder((v) => {
            if (!isObject(v)) {
                return undefined;
            }
            return parseObject(v, keyToParserMap);
        })(optional),
        array: (itemParser) => createMicroParserBuilder((v) => {
            if (!Array.isArray(v)) {
                return undefined;
            }
            return parseArray(v, itemParser);
        })(optional),
    };
}
const MicroParsers = {
    optional: createMicroParserBuilders(true),
    required: createMicroParserBuilders(false),
};
function parseRecord(value, keyToParserMap) {
    const map = keyToParserMap(MicroParsers);
    const result = MicroParsers.required.object(map)(value);
    return result.succeeded ? result.value : undefined;
}

function importBladeState(state, superImport, parser, callback) {
    if (superImport && !superImport(state)) {
        return false;
    }
    const result = parseRecord(state, parser);
    return result ? callback(result) : false;
}
function exportBladeState(superExport, thisState) {
    var _a;
    return deepMerge((_a = superExport === null || superExport === void 0 ? void 0 : superExport()) !== null && _a !== void 0 ? _a : {}, thisState);
}

function isValueBladeController(bc) {
    return 'value' in bc;
}

function isBindingValue(v) {
    if (!isObject$1(v) || !('binding' in v)) {
        return false;
    }
    const b = v.binding;
    return isBinding(b);
}

const SVG_NS = 'http://www.w3.org/2000/svg';
function forceReflow(element) {
    element.offsetHeight;
}
function disableTransitionTemporarily(element, callback) {
    const t = element.style.transition;
    element.style.transition = 'none';
    callback();
    element.style.transition = t;
}
function supportsTouch(doc) {
    return doc.ontouchstart !== undefined;
}
function getGlobalObject() {
    return globalThis;
}
function getWindowDocument() {
    const globalObj = forceCast(getGlobalObject());
    return globalObj.document;
}
function getCanvasContext(canvasElement) {
    const win = canvasElement.ownerDocument.defaultView;
    if (!win) {
        return null;
    }
    const isBrowser = 'document' in win;
    return isBrowser
        ? canvasElement.getContext('2d', {
            willReadFrequently: true,
        })
        : null;
}
const ICON_ID_TO_INNER_HTML_MAP = {
    check: '<path d="M2 8l4 4l8 -8"/>',
    dropdown: '<path d="M5 7h6l-3 3 z"/>',
    p2dpad: '<path d="M8 4v8"/><path d="M4 8h8"/><circle cx="12" cy="12" r="1.2"/>',
};
function createSvgIconElement(document, iconId) {
    const elem = document.createElementNS(SVG_NS, 'svg');
    elem.innerHTML = ICON_ID_TO_INNER_HTML_MAP[iconId];
    return elem;
}
function insertElementAt(parentElement, element, index) {
    parentElement.insertBefore(element, parentElement.children[index]);
}
function removeElement(element) {
    if (element.parentElement) {
        element.parentElement.removeChild(element);
    }
}
function removeChildElements(element) {
    while (element.children.length > 0) {
        element.removeChild(element.children[0]);
    }
}
function removeChildNodes(element) {
    while (element.childNodes.length > 0) {
        element.removeChild(element.childNodes[0]);
    }
}
function findNextTarget(ev) {
    if (ev.relatedTarget) {
        return forceCast(ev.relatedTarget);
    }
    if ('explicitOriginalTarget' in ev) {
        return ev.explicitOriginalTarget;
    }
    return null;
}

function bindValue(value, applyValue) {
    value.emitter.on('change', (ev) => {
        applyValue(ev.rawValue);
    });
    applyValue(value.rawValue);
}
function bindValueMap(valueMap, key, applyValue) {
    bindValue(valueMap.value(key), applyValue);
}

const PREFIX = 'tp';
function ClassName(viewName) {
    const fn = (opt_elementName, opt_modifier) => {
        return [
            PREFIX,
            '-',
            viewName,
            'v',
            opt_elementName ? `_${opt_elementName}` : '',
            opt_modifier ? `-${opt_modifier}` : '',
        ].join('');
    };
    return fn;
}

const cn$r = ClassName('lbl');
function createLabelNode(doc, label) {
    const frag = doc.createDocumentFragment();
    const lineNodes = label.split('\n').map((line) => {
        return doc.createTextNode(line);
    });
    lineNodes.forEach((lineNode, index) => {
        if (index > 0) {
            frag.appendChild(doc.createElement('br'));
        }
        frag.appendChild(lineNode);
    });
    return frag;
}
class LabelView {
    constructor(doc, config) {
        this.element = doc.createElement('div');
        this.element.classList.add(cn$r());
        config.viewProps.bindClassModifiers(this.element);
        const labelElem = doc.createElement('div');
        labelElem.classList.add(cn$r('l'));
        bindValueMap(config.props, 'label', (value) => {
            if (isEmpty(value)) {
                this.element.classList.add(cn$r(undefined, 'nol'));
            }
            else {
                this.element.classList.remove(cn$r(undefined, 'nol'));
                removeChildNodes(labelElem);
                labelElem.appendChild(createLabelNode(doc, value));
            }
        });
        this.element.appendChild(labelElem);
        this.labelElement = labelElem;
        const valueElem = doc.createElement('div');
        valueElem.classList.add(cn$r('v'));
        this.element.appendChild(valueElem);
        this.valueElement = valueElem;
    }
}

class LabelController {
    constructor(doc, config) {
        this.props = config.props;
        this.valueController = config.valueController;
        this.viewProps = config.valueController.viewProps;
        this.view = new LabelView(doc, {
            props: config.props,
            viewProps: this.viewProps,
        });
        this.view.valueElement.appendChild(this.valueController.view.element);
    }
    importProps(state) {
        return importBladeState(state, null, (p) => ({
            label: p.optional.string,
        }), (result) => {
            this.props.set('label', result.label);
            return true;
        });
    }
    exportProps() {
        return exportBladeState(null, {
            label: this.props.get('label'),
        });
    }
}

function getAllBladePositions() {
    return ['veryfirst', 'first', 'last', 'verylast'];
}

const cn$q = ClassName('');
const POS_TO_CLASS_NAME_MAP = {
    veryfirst: 'vfst',
    first: 'fst',
    last: 'lst',
    verylast: 'vlst',
};
class BladeController {
    constructor(config) {
        this.parent_ = null;
        this.blade = config.blade;
        this.view = config.view;
        this.viewProps = config.viewProps;
        const elem = this.view.element;
        this.blade.value('positions').emitter.on('change', () => {
            getAllBladePositions().forEach((pos) => {
                elem.classList.remove(cn$q(undefined, POS_TO_CLASS_NAME_MAP[pos]));
            });
            this.blade.get('positions').forEach((pos) => {
                elem.classList.add(cn$q(undefined, POS_TO_CLASS_NAME_MAP[pos]));
            });
        });
        this.viewProps.handleDispose(() => {
            removeElement(elem);
        });
    }
    get parent() {
        return this.parent_;
    }
    set parent(parent) {
        this.parent_ = parent;
        this.viewProps.set('parent', this.parent_ ? this.parent_.viewProps : null);
    }
    importState(state) {
        return importBladeState(state, null, (p) => ({
            disabled: p.required.boolean,
            hidden: p.required.boolean,
        }), (result) => {
            this.viewProps.importState(result);
            return true;
        });
    }
    exportState() {
        return exportBladeState(null, Object.assign({}, this.viewProps.exportState()));
    }
}

class LabeledValueBladeController extends BladeController {
    constructor(doc, config) {
        if (config.value !== config.valueController.value) {
            throw TpError.shouldNeverHappen();
        }
        const viewProps = config.valueController.viewProps;
        const lc = new LabelController(doc, {
            blade: config.blade,
            props: config.props,
            valueController: config.valueController,
        });
        super(Object.assign(Object.assign({}, config), { view: new LabelView(doc, {
                props: config.props,
                viewProps: viewProps,
            }), viewProps: viewProps }));
        this.labelController = lc;
        this.value = config.value;
        this.valueController = config.valueController;
        this.view.valueElement.appendChild(this.valueController.view.element);
    }
    importState(state) {
        return importBladeState(state, (s) => {
            var _a, _b, _c;
            return super.importState(s) &&
                this.labelController.importProps(s) &&
                ((_c = (_b = (_a = this.valueController).importProps) === null || _b === void 0 ? void 0 : _b.call(_a, state)) !== null && _c !== void 0 ? _c : true);
        }, (p) => ({
            value: p.optional.raw,
        }), (result) => {
            if (result.value) {
                this.value.rawValue = result.value;
            }
            return true;
        });
    }
    exportState() {
        var _a, _b, _c;
        return exportBladeState(() => super.exportState(), Object.assign(Object.assign({ value: this.value.rawValue }, this.labelController.exportProps()), ((_c = (_b = (_a = this.valueController).exportProps) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : {})));
    }
}

function excludeValue(state) {
    const result = Object.assign({}, state);
    delete result.value;
    return result;
}
class BindingController extends LabeledValueBladeController {
    constructor(doc, config) {
        super(doc, config);
        this.tag = config.tag;
    }
    importState(state) {
        return importBladeState(state,
        (_s) => super.importState(excludeValue(state)), (p) => ({
            tag: p.optional.string,
        }), (result) => {
            this.tag = result.tag;
            return true;
        });
    }
    exportState() {
        return exportBladeState(() => excludeValue(super.exportState()), {
            binding: {
                key: this.value.binding.target.key,
                value: this.value.binding.target.read(),
            },
            tag: this.tag,
        });
    }
}
function isBindingController(bc) {
    return isValueBladeController(bc) && isBindingValue(bc.value);
}

class InputBindingController extends BindingController {
    importState(state) {
        return importBladeState(state, (s) => super.importState(s), (p) => ({
            binding: p.required.object({
                value: p.required.raw,
            }),
        }), (result) => {
            this.value.binding.inject(result.binding.value);
            this.value.fetch();
            return true;
        });
    }
}
function isInputBindingController(bc) {
    return isValueBladeController(bc) && isInputBindingValue(bc.value);
}

function fillBuffer(buffer, bufferSize) {
    while (buffer.length < bufferSize) {
        buffer.push(undefined);
    }
}
function initializeBuffer(bufferSize) {
    const buffer = [];
    fillBuffer(buffer, bufferSize);
    return buffer;
}
function createTrimmedBuffer(buffer) {
    const index = buffer.indexOf(undefined);
    return forceCast(index < 0 ? buffer : buffer.slice(0, index));
}
function createPushedBuffer(buffer, newValue) {
    const newBuffer = [...createTrimmedBuffer(buffer), newValue];
    if (newBuffer.length > buffer.length) {
        newBuffer.splice(0, newBuffer.length - buffer.length);
    }
    else {
        fillBuffer(newBuffer, buffer.length);
    }
    return newBuffer;
}

class MonitorBindingValue {
    constructor(config) {
        this.emitter = new Emitter();
        this.onTick_ = this.onTick_.bind(this);
        this.onValueBeforeChange_ = this.onValueBeforeChange_.bind(this);
        this.onValueChange_ = this.onValueChange_.bind(this);
        this.binding = config.binding;
        this.value_ = createValue(initializeBuffer(config.bufferSize));
        this.value_.emitter.on('beforechange', this.onValueBeforeChange_);
        this.value_.emitter.on('change', this.onValueChange_);
        this.ticker = config.ticker;
        this.ticker.emitter.on('tick', this.onTick_);
        this.fetch();
    }
    get rawValue() {
        return this.value_.rawValue;
    }
    set rawValue(rawValue) {
        this.value_.rawValue = rawValue;
    }
    setRawValue(rawValue, options) {
        this.value_.setRawValue(rawValue, options);
    }
    fetch() {
        this.value_.rawValue = createPushedBuffer(this.value_.rawValue, this.binding.read());
    }
    onTick_() {
        this.fetch();
    }
    onValueBeforeChange_(ev) {
        this.emitter.emit('beforechange', Object.assign(Object.assign({}, ev), { sender: this }));
    }
    onValueChange_(ev) {
        this.emitter.emit('change', Object.assign(Object.assign({}, ev), { sender: this }));
    }
}
function isMonitorBindingValue(v) {
    if (!('binding' in v)) {
        return false;
    }
    const b = v['binding'];
    return isBinding(b) && 'read' in b && !('write' in b);
}

class MonitorBindingController extends BindingController {
    exportState() {
        return exportBladeState(() => super.exportState(), {
            binding: {
                readonly: true,
            },
        });
    }
}
function isMonitorBindingController(bc) {
    return (isValueBladeController(bc) &&
        isMonitorBindingValue(bc.value));
}

class ButtonApi extends BladeApi {
    get label() {
        return this.controller.labelController.props.get('label');
    }
    set label(label) {
        this.controller.labelController.props.set('label', label);
    }
    get title() {
        var _a;
        return (_a = this.controller.buttonController.props.get('title')) !== null && _a !== void 0 ? _a : '';
    }
    set title(title) {
        this.controller.buttonController.props.set('title', title);
    }
    on(eventName, handler) {
        const bh = handler.bind(this);
        const emitter = this.controller.buttonController.emitter;
        emitter.on(eventName, (ev) => {
            bh(new TpMouseEvent(this, ev.nativeEvent));
        });
        return this;
    }
    off(eventName, handler) {
        const emitter = this.controller.buttonController.emitter;
        emitter.off(eventName, handler);
        return this;
    }
}

function applyClass(elem, className, active) {
    if (active) {
        elem.classList.add(className);
    }
    else {
        elem.classList.remove(className);
    }
}
function valueToClassName(elem, className) {
    return (value) => {
        applyClass(elem, className, value);
    };
}
function bindValueToTextContent(value, elem) {
    bindValue(value, (text) => {
        elem.textContent = text !== null && text !== void 0 ? text : '';
    });
}

const cn$p = ClassName('btn');
class ButtonView {
    constructor(doc, config) {
        this.element = doc.createElement('div');
        this.element.classList.add(cn$p());
        config.viewProps.bindClassModifiers(this.element);
        const buttonElem = doc.createElement('button');
        buttonElem.classList.add(cn$p('b'));
        config.viewProps.bindDisabled(buttonElem);
        this.element.appendChild(buttonElem);
        this.buttonElement = buttonElem;
        const titleElem = doc.createElement('div');
        titleElem.classList.add(cn$p('t'));
        bindValueToTextContent(config.props.value('title'), titleElem);
        this.buttonElement.appendChild(titleElem);
    }
}

class ButtonController {
    constructor(doc, config) {
        this.emitter = new Emitter();
        this.onClick_ = this.onClick_.bind(this);
        this.props = config.props;
        this.viewProps = config.viewProps;
        this.view = new ButtonView(doc, {
            props: this.props,
            viewProps: this.viewProps,
        });
        this.view.buttonElement.addEventListener('click', this.onClick_);
    }
    importProps(state) {
        return importBladeState(state, null, (p) => ({
            title: p.optional.string,
        }), (result) => {
            this.props.set('title', result.title);
            return true;
        });
    }
    exportProps() {
        return exportBladeState(null, {
            title: this.props.get('title'),
        });
    }
    onClick_(ev) {
        this.emitter.emit('click', {
            nativeEvent: ev,
            sender: this,
        });
    }
}

class ButtonBladeController extends BladeController {
    constructor(doc, config) {
        const bc = new ButtonController(doc, {
            props: config.buttonProps,
            viewProps: config.viewProps,
        });
        const lc = new LabelController(doc, {
            blade: config.blade,
            props: config.labelProps,
            valueController: bc,
        });
        super({
            blade: config.blade,
            view: lc.view,
            viewProps: config.viewProps,
        });
        this.buttonController = bc;
        this.labelController = lc;
    }
    importState(state) {
        return importBladeState(state, (s) => super.importState(s) &&
            this.buttonController.importProps(s) &&
            this.labelController.importProps(s), () => ({}), () => true);
    }
    exportState() {
        return exportBladeState(() => super.exportState(), Object.assign(Object.assign({}, this.buttonController.exportProps()), this.labelController.exportProps()));
    }
}

class Semver {
    constructor(text) {
        const [core, prerelease] = text.split('-');
        const coreComps = core.split('.');
        this.major = parseInt(coreComps[0], 10);
        this.minor = parseInt(coreComps[1], 10);
        this.patch = parseInt(coreComps[2], 10);
        this.prerelease = prerelease !== null && prerelease !== void 0 ? prerelease : null;
    }
    toString() {
        const core = [this.major, this.minor, this.patch].join('.');
        return this.prerelease !== null ? [core, this.prerelease].join('-') : core;
    }
}

const VERSION$1 = new Semver('2.0.5');

function createPlugin(plugin) {
    return Object.assign({ core: VERSION$1 }, plugin);
}

const ButtonBladePlugin = createPlugin({
    id: 'button',
    type: 'blade',
    accept(params) {
        const result = parseRecord(params, (p) => ({
            title: p.required.string,
            view: p.required.constant('button'),
            label: p.optional.string,
        }));
        return result ? { params: result } : null;
    },
    controller(args) {
        return new ButtonBladeController(args.document, {
            blade: args.blade,
            buttonProps: ValueMap.fromObject({
                title: args.params.title,
            }),
            labelProps: ValueMap.fromObject({
                label: args.params.label,
            }),
            viewProps: args.viewProps,
        });
    },
    api(args) {
        if (args.controller instanceof ButtonBladeController) {
            return new ButtonApi(args.controller);
        }
        return null;
    },
});

function addButtonAsBlade(api, params) {
    return api.addBlade(Object.assign(Object.assign({}, params), { view: 'button' }));
}
function addFolderAsBlade(api, params) {
    return api.addBlade(Object.assign(Object.assign({}, params), { view: 'folder' }));
}
function addTabAsBlade(api, params) {
    return api.addBlade(Object.assign(Object.assign({}, params), { view: 'tab' }));
}

function isRefreshable(value) {
    if (!isObject$1(value)) {
        return false;
    }
    return 'refresh' in value && typeof value.refresh === 'function';
}

function createBindingTarget(obj, key) {
    if (!BindingTarget.isBindable(obj)) {
        throw TpError.notBindable();
    }
    return new BindingTarget(obj, key);
}
class RackApi {
    constructor(controller, pool) {
        this.onRackValueChange_ = this.onRackValueChange_.bind(this);
        this.controller_ = controller;
        this.emitter_ = new Emitter();
        this.pool_ = pool;
        const rack = this.controller_.rack;
        rack.emitter.on('valuechange', this.onRackValueChange_);
    }
    get children() {
        return this.controller_.rack.children.map((bc) => this.pool_.createApi(bc));
    }
    addBinding(object, key, opt_params) {
        const params = opt_params !== null && opt_params !== void 0 ? opt_params : {};
        const doc = this.controller_.element.ownerDocument;
        const bc = this.pool_.createBinding(doc, createBindingTarget(object, key), params);
        const api = this.pool_.createBindingApi(bc);
        return this.add(api, params.index);
    }
    addFolder(params) {
        return addFolderAsBlade(this, params);
    }
    addButton(params) {
        return addButtonAsBlade(this, params);
    }
    addTab(params) {
        return addTabAsBlade(this, params);
    }
    add(api, opt_index) {
        const bc = api.controller;
        this.controller_.rack.add(bc, opt_index);
        return api;
    }
    remove(api) {
        this.controller_.rack.remove(api.controller);
    }
    addBlade(params) {
        const doc = this.controller_.element.ownerDocument;
        const bc = this.pool_.createBlade(doc, params);
        const api = this.pool_.createApi(bc);
        return this.add(api, params.index);
    }
    on(eventName, handler) {
        const bh = handler.bind(this);
        this.emitter_.on(eventName, (ev) => {
            bh(ev);
        }, {
            key: handler,
        });
        return this;
    }
    off(eventName, handler) {
        this.emitter_.off(eventName, handler);
        return this;
    }
    refresh() {
        this.children.forEach((c) => {
            if (isRefreshable(c)) {
                c.refresh();
            }
        });
    }
    onRackValueChange_(ev) {
        const bc = ev.bladeController;
        const api = this.pool_.createApi(bc);
        const binding = isBindingValue(bc.value) ? bc.value.binding : null;
        this.emitter_.emit('change', new TpChangeEvent(api, binding ? binding.target.read() : bc.value.rawValue, ev.options.last));
    }
}

class ContainerBladeApi extends BladeApi {
    constructor(controller, pool) {
        super(controller);
        this.rackApi_ = new RackApi(controller.rackController, pool);
    }
    refresh() {
        this.rackApi_.refresh();
    }
}

class ContainerBladeController extends BladeController {
    constructor(config) {
        super({
            blade: config.blade,
            view: config.view,
            viewProps: config.rackController.viewProps,
        });
        this.rackController = config.rackController;
    }
    importState(state) {
        return importBladeState(state, (s) => super.importState(s), (p) => ({
            children: p.required.array(p.required.raw),
        }), (result) => {
            return this.rackController.rack.children.every((c, index) => {
                return c.importState(result.children[index]);
            });
        });
    }
    exportState() {
        return exportBladeState(() => super.exportState(), {
            children: this.rackController.rack.children.map((c) => c.exportState()),
        });
    }
}
function isContainerBladeController(bc) {
    return 'rackController' in bc;
}

class NestedOrderedSet {
    constructor(extract) {
        this.emitter = new Emitter();
        this.items_ = [];
        this.cache_ = new Set();
        this.onSubListAdd_ = this.onSubListAdd_.bind(this);
        this.onSubListRemove_ = this.onSubListRemove_.bind(this);
        this.extract_ = extract;
    }
    get items() {
        return this.items_;
    }
    allItems() {
        return Array.from(this.cache_);
    }
    find(callback) {
        for (const item of this.allItems()) {
            if (callback(item)) {
                return item;
            }
        }
        return null;
    }
    includes(item) {
        return this.cache_.has(item);
    }
    add(item, opt_index) {
        if (this.includes(item)) {
            throw TpError.shouldNeverHappen();
        }
        const index = opt_index !== undefined ? opt_index : this.items_.length;
        this.items_.splice(index, 0, item);
        this.cache_.add(item);
        const subList = this.extract_(item);
        if (subList) {
            subList.emitter.on('add', this.onSubListAdd_);
            subList.emitter.on('remove', this.onSubListRemove_);
            subList.allItems().forEach((i) => {
                this.cache_.add(i);
            });
        }
        this.emitter.emit('add', {
            index: index,
            item: item,
            root: this,
            target: this,
        });
    }
    remove(item) {
        const index = this.items_.indexOf(item);
        if (index < 0) {
            return;
        }
        this.items_.splice(index, 1);
        this.cache_.delete(item);
        const subList = this.extract_(item);
        if (subList) {
            subList.allItems().forEach((i) => {
                this.cache_.delete(i);
            });
            subList.emitter.off('add', this.onSubListAdd_);
            subList.emitter.off('remove', this.onSubListRemove_);
        }
        this.emitter.emit('remove', {
            index: index,
            item: item,
            root: this,
            target: this,
        });
    }
    onSubListAdd_(ev) {
        this.cache_.add(ev.item);
        this.emitter.emit('add', {
            index: ev.index,
            item: ev.item,
            root: this,
            target: ev.target,
        });
    }
    onSubListRemove_(ev) {
        this.cache_.delete(ev.item);
        this.emitter.emit('remove', {
            index: ev.index,
            item: ev.item,
            root: this,
            target: ev.target,
        });
    }
}

function findValueBladeController(bcs, v) {
    for (let i = 0; i < bcs.length; i++) {
        const bc = bcs[i];
        if (isValueBladeController(bc) && bc.value === v) {
            return bc;
        }
    }
    return null;
}
function findSubBladeControllerSet(bc) {
    return isContainerBladeController(bc)
        ? bc.rackController.rack['bcSet_']
        : null;
}
class Rack {
    constructor(config) {
        var _a, _b;
        this.emitter = new Emitter();
        this.onBladePositionsChange_ = this.onBladePositionsChange_.bind(this);
        this.onSetAdd_ = this.onSetAdd_.bind(this);
        this.onSetRemove_ = this.onSetRemove_.bind(this);
        this.onChildDispose_ = this.onChildDispose_.bind(this);
        this.onChildPositionsChange_ = this.onChildPositionsChange_.bind(this);
        this.onChildValueChange_ = this.onChildValueChange_.bind(this);
        this.onChildViewPropsChange_ = this.onChildViewPropsChange_.bind(this);
        this.onRackLayout_ = this.onRackLayout_.bind(this);
        this.onRackValueChange_ = this.onRackValueChange_.bind(this);
        this.blade_ = (_a = config.blade) !== null && _a !== void 0 ? _a : null;
        (_b = this.blade_) === null || _b === void 0 ? void 0 : _b.value('positions').emitter.on('change', this.onBladePositionsChange_);
        this.viewProps = config.viewProps;
        this.bcSet_ = new NestedOrderedSet(findSubBladeControllerSet);
        this.bcSet_.emitter.on('add', this.onSetAdd_);
        this.bcSet_.emitter.on('remove', this.onSetRemove_);
    }
    get children() {
        return this.bcSet_.items;
    }
    add(bc, opt_index) {
        var _a;
        (_a = bc.parent) === null || _a === void 0 ? void 0 : _a.remove(bc);
        bc.parent = this;
        this.bcSet_.add(bc, opt_index);
    }
    remove(bc) {
        bc.parent = null;
        this.bcSet_.remove(bc);
    }
    find(finder) {
        return this.bcSet_.allItems().filter(finder);
    }
    onSetAdd_(ev) {
        this.updatePositions_();
        const root = ev.target === ev.root;
        this.emitter.emit('add', {
            bladeController: ev.item,
            index: ev.index,
            root: root,
            sender: this,
        });
        if (!root) {
            return;
        }
        const bc = ev.item;
        bc.viewProps.emitter.on('change', this.onChildViewPropsChange_);
        bc.blade
            .value('positions')
            .emitter.on('change', this.onChildPositionsChange_);
        bc.viewProps.handleDispose(this.onChildDispose_);
        if (isValueBladeController(bc)) {
            bc.value.emitter.on('change', this.onChildValueChange_);
        }
        else if (isContainerBladeController(bc)) {
            const rack = bc.rackController.rack;
            if (rack) {
                const emitter = rack.emitter;
                emitter.on('layout', this.onRackLayout_);
                emitter.on('valuechange', this.onRackValueChange_);
            }
        }
    }
    onSetRemove_(ev) {
        this.updatePositions_();
        const root = ev.target === ev.root;
        this.emitter.emit('remove', {
            bladeController: ev.item,
            root: root,
            sender: this,
        });
        if (!root) {
            return;
        }
        const bc = ev.item;
        if (isValueBladeController(bc)) {
            bc.value.emitter.off('change', this.onChildValueChange_);
        }
        else if (isContainerBladeController(bc)) {
            const rack = bc.rackController.rack;
            if (rack) {
                const emitter = rack.emitter;
                emitter.off('layout', this.onRackLayout_);
                emitter.off('valuechange', this.onRackValueChange_);
            }
        }
    }
    updatePositions_() {
        const visibleItems = this.bcSet_.items.filter((bc) => !bc.viewProps.get('hidden'));
        const firstVisibleItem = visibleItems[0];
        const lastVisibleItem = visibleItems[visibleItems.length - 1];
        this.bcSet_.items.forEach((bc) => {
            const ps = [];
            if (bc === firstVisibleItem) {
                ps.push('first');
                if (!this.blade_ ||
                    this.blade_.get('positions').includes('veryfirst')) {
                    ps.push('veryfirst');
                }
            }
            if (bc === lastVisibleItem) {
                ps.push('last');
                if (!this.blade_ || this.blade_.get('positions').includes('verylast')) {
                    ps.push('verylast');
                }
            }
            bc.blade.set('positions', ps);
        });
    }
    onChildPositionsChange_() {
        this.updatePositions_();
        this.emitter.emit('layout', {
            sender: this,
        });
    }
    onChildViewPropsChange_(_ev) {
        this.updatePositions_();
        this.emitter.emit('layout', {
            sender: this,
        });
    }
    onChildDispose_() {
        const disposedUcs = this.bcSet_.items.filter((bc) => {
            return bc.viewProps.get('disposed');
        });
        disposedUcs.forEach((bc) => {
            this.bcSet_.remove(bc);
        });
    }
    onChildValueChange_(ev) {
        const bc = findValueBladeController(this.find(isValueBladeController), ev.sender);
        if (!bc) {
            throw TpError.alreadyDisposed();
        }
        this.emitter.emit('valuechange', {
            bladeController: bc,
            options: ev.options,
            sender: this,
        });
    }
    onRackLayout_(_) {
        this.updatePositions_();
        this.emitter.emit('layout', {
            sender: this,
        });
    }
    onRackValueChange_(ev) {
        this.emitter.emit('valuechange', {
            bladeController: ev.bladeController,
            options: ev.options,
            sender: this,
        });
    }
    onBladePositionsChange_() {
        this.updatePositions_();
    }
}

class RackController {
    constructor(config) {
        this.onRackAdd_ = this.onRackAdd_.bind(this);
        this.onRackRemove_ = this.onRackRemove_.bind(this);
        this.element = config.element;
        this.viewProps = config.viewProps;
        const rack = new Rack({
            blade: config.root ? undefined : config.blade,
            viewProps: config.viewProps,
        });
        rack.emitter.on('add', this.onRackAdd_);
        rack.emitter.on('remove', this.onRackRemove_);
        this.rack = rack;
        this.viewProps.handleDispose(() => {
            for (let i = this.rack.children.length - 1; i >= 0; i--) {
                const bc = this.rack.children[i];
                bc.viewProps.set('disposed', true);
            }
        });
    }
    onRackAdd_(ev) {
        if (!ev.root) {
            return;
        }
        insertElementAt(this.element, ev.bladeController.view.element, ev.index);
    }
    onRackRemove_(ev) {
        if (!ev.root) {
            return;
        }
        removeElement(ev.bladeController.view.element);
    }
}

function createBlade() {
    return new ValueMap({
        positions: createValue([], {
            equals: deepEqualsArray,
        }),
    });
}

class Foldable extends ValueMap {
    constructor(valueMap) {
        super(valueMap);
    }
    static create(expanded) {
        const coreObj = {
            completed: true,
            expanded: expanded,
            expandedHeight: null,
            shouldFixHeight: false,
            temporaryExpanded: null,
        };
        const core = ValueMap.createCore(coreObj);
        return new Foldable(core);
    }
    get styleExpanded() {
        var _a;
        return (_a = this.get('temporaryExpanded')) !== null && _a !== void 0 ? _a : this.get('expanded');
    }
    get styleHeight() {
        if (!this.styleExpanded) {
            return '0';
        }
        const exHeight = this.get('expandedHeight');
        if (this.get('shouldFixHeight') && !isEmpty(exHeight)) {
            return `${exHeight}px`;
        }
        return 'auto';
    }
    bindExpandedClass(elem, expandedClassName) {
        const onExpand = () => {
            const expanded = this.styleExpanded;
            if (expanded) {
                elem.classList.add(expandedClassName);
            }
            else {
                elem.classList.remove(expandedClassName);
            }
        };
        bindValueMap(this, 'expanded', onExpand);
        bindValueMap(this, 'temporaryExpanded', onExpand);
    }
    cleanUpTransition() {
        this.set('shouldFixHeight', false);
        this.set('expandedHeight', null);
        this.set('completed', true);
    }
}
function computeExpandedFolderHeight(folder, containerElement) {
    let height = 0;
    disableTransitionTemporarily(containerElement, () => {
        folder.set('expandedHeight', null);
        folder.set('temporaryExpanded', true);
        forceReflow(containerElement);
        height = containerElement.clientHeight;
        folder.set('temporaryExpanded', null);
        forceReflow(containerElement);
    });
    return height;
}
function applyHeight(foldable, elem) {
    elem.style.height = foldable.styleHeight;
}
function bindFoldable(foldable, elem) {
    foldable.value('expanded').emitter.on('beforechange', () => {
        foldable.set('completed', false);
        if (isEmpty(foldable.get('expandedHeight'))) {
            const h = computeExpandedFolderHeight(foldable, elem);
            if (h > 0) {
                foldable.set('expandedHeight', h);
            }
        }
        foldable.set('shouldFixHeight', true);
        forceReflow(elem);
    });
    foldable.emitter.on('change', () => {
        applyHeight(foldable, elem);
    });
    applyHeight(foldable, elem);
    elem.addEventListener('transitionend', (ev) => {
        if (ev.propertyName !== 'height') {
            return;
        }
        foldable.cleanUpTransition();
    });
}

class FolderApi extends ContainerBladeApi {
    constructor(controller, pool) {
        super(controller, pool);
        this.emitter_ = new Emitter();
        this.controller.foldable
            .value('expanded')
            .emitter.on('change', (ev) => {
            this.emitter_.emit('fold', new TpFoldEvent(this, ev.sender.rawValue));
        });
        this.rackApi_.on('change', (ev) => {
            this.emitter_.emit('change', ev);
        });
    }
    get expanded() {
        return this.controller.foldable.get('expanded');
    }
    set expanded(expanded) {
        this.controller.foldable.set('expanded', expanded);
    }
    get title() {
        return this.controller.props.get('title');
    }
    set title(title) {
        this.controller.props.set('title', title);
    }
    get children() {
        return this.rackApi_.children;
    }
    addBinding(object, key, opt_params) {
        return this.rackApi_.addBinding(object, key, opt_params);
    }
    addFolder(params) {
        return this.rackApi_.addFolder(params);
    }
    addButton(params) {
        return this.rackApi_.addButton(params);
    }
    addTab(params) {
        return this.rackApi_.addTab(params);
    }
    add(api, opt_index) {
        return this.rackApi_.add(api, opt_index);
    }
    remove(api) {
        this.rackApi_.remove(api);
    }
    addBlade(params) {
        return this.rackApi_.addBlade(params);
    }
    on(eventName, handler) {
        const bh = handler.bind(this);
        this.emitter_.on(eventName, (ev) => {
            bh(ev);
        }, {
            key: handler,
        });
        return this;
    }
    off(eventName, handler) {
        this.emitter_.off(eventName, handler);
        return this;
    }
}

const bladeContainerClassName = ClassName('cnt');

class FolderView {
    constructor(doc, config) {
        var _a;
        this.className_ = ClassName((_a = config.viewName) !== null && _a !== void 0 ? _a : 'fld');
        this.element = doc.createElement('div');
        this.element.classList.add(this.className_(), bladeContainerClassName());
        config.viewProps.bindClassModifiers(this.element);
        this.foldable_ = config.foldable;
        this.foldable_.bindExpandedClass(this.element, this.className_(undefined, 'expanded'));
        bindValueMap(this.foldable_, 'completed', valueToClassName(this.element, this.className_(undefined, 'cpl')));
        const buttonElem = doc.createElement('button');
        buttonElem.classList.add(this.className_('b'));
        bindValueMap(config.props, 'title', (title) => {
            if (isEmpty(title)) {
                this.element.classList.add(this.className_(undefined, 'not'));
            }
            else {
                this.element.classList.remove(this.className_(undefined, 'not'));
            }
        });
        config.viewProps.bindDisabled(buttonElem);
        this.element.appendChild(buttonElem);
        this.buttonElement = buttonElem;
        const indentElem = doc.createElement('div');
        indentElem.classList.add(this.className_('i'));
        this.element.appendChild(indentElem);
        const titleElem = doc.createElement('div');
        titleElem.classList.add(this.className_('t'));
        bindValueToTextContent(config.props.value('title'), titleElem);
        this.buttonElement.appendChild(titleElem);
        this.titleElement = titleElem;
        const markElem = doc.createElement('div');
        markElem.classList.add(this.className_('m'));
        this.buttonElement.appendChild(markElem);
        const containerElem = doc.createElement('div');
        containerElem.classList.add(this.className_('c'));
        this.element.appendChild(containerElem);
        this.containerElement = containerElem;
    }
}

class FolderController extends ContainerBladeController {
    constructor(doc, config) {
        var _a;
        const foldable = Foldable.create((_a = config.expanded) !== null && _a !== void 0 ? _a : true);
        const view = new FolderView(doc, {
            foldable: foldable,
            props: config.props,
            viewName: config.root ? 'rot' : undefined,
            viewProps: config.viewProps,
        });
        super(Object.assign(Object.assign({}, config), { rackController: new RackController({
                blade: config.blade,
                element: view.containerElement,
                root: config.root,
                viewProps: config.viewProps,
            }), view: view }));
        this.onTitleClick_ = this.onTitleClick_.bind(this);
        this.props = config.props;
        this.foldable = foldable;
        bindFoldable(this.foldable, this.view.containerElement);
        this.rackController.rack.emitter.on('add', () => {
            this.foldable.cleanUpTransition();
        });
        this.rackController.rack.emitter.on('remove', () => {
            this.foldable.cleanUpTransition();
        });
        this.view.buttonElement.addEventListener('click', this.onTitleClick_);
    }
    get document() {
        return this.view.element.ownerDocument;
    }
    importState(state) {
        return importBladeState(state, (s) => super.importState(s), (p) => ({
            expanded: p.required.boolean,
            title: p.optional.string,
        }), (result) => {
            this.foldable.set('expanded', result.expanded);
            this.props.set('title', result.title);
            return true;
        });
    }
    exportState() {
        return exportBladeState(() => super.exportState(), {
            expanded: this.foldable.get('expanded'),
            title: this.props.get('title'),
        });
    }
    onTitleClick_() {
        this.foldable.set('expanded', !this.foldable.get('expanded'));
    }
}

const FolderBladePlugin = createPlugin({
    id: 'folder',
    type: 'blade',
    accept(params) {
        const result = parseRecord(params, (p) => ({
            title: p.required.string,
            view: p.required.constant('folder'),
            expanded: p.optional.boolean,
        }));
        return result ? { params: result } : null;
    },
    controller(args) {
        return new FolderController(args.document, {
            blade: args.blade,
            expanded: args.params.expanded,
            props: ValueMap.fromObject({
                title: args.params.title,
            }),
            viewProps: args.viewProps,
        });
    },
    api(args) {
        if (!(args.controller instanceof FolderController)) {
            return null;
        }
        return new FolderApi(args.controller, args.pool);
    },
});

const cn$o = ClassName('');
function valueToModifier(elem, modifier) {
    return valueToClassName(elem, cn$o(undefined, modifier));
}
class ViewProps extends ValueMap {
    constructor(valueMap) {
        var _a;
        super(valueMap);
        this.onDisabledChange_ = this.onDisabledChange_.bind(this);
        this.onParentChange_ = this.onParentChange_.bind(this);
        this.onParentGlobalDisabledChange_ =
            this.onParentGlobalDisabledChange_.bind(this);
        [this.globalDisabled_, this.setGlobalDisabled_] = createReadonlyValue(createValue(this.getGlobalDisabled_()));
        this.value('disabled').emitter.on('change', this.onDisabledChange_);
        this.value('parent').emitter.on('change', this.onParentChange_);
        (_a = this.get('parent')) === null || _a === void 0 ? void 0 : _a.globalDisabled.emitter.on('change', this.onParentGlobalDisabledChange_);
    }
    static create(opt_initialValue) {
        var _a, _b, _c;
        const initialValue = opt_initialValue !== null && opt_initialValue !== void 0 ? opt_initialValue : {};
        return new ViewProps(ValueMap.createCore({
            disabled: (_a = initialValue.disabled) !== null && _a !== void 0 ? _a : false,
            disposed: false,
            hidden: (_b = initialValue.hidden) !== null && _b !== void 0 ? _b : false,
            parent: (_c = initialValue.parent) !== null && _c !== void 0 ? _c : null,
        }));
    }
    get globalDisabled() {
        return this.globalDisabled_;
    }
    bindClassModifiers(elem) {
        bindValue(this.globalDisabled_, valueToModifier(elem, 'disabled'));
        bindValueMap(this, 'hidden', valueToModifier(elem, 'hidden'));
    }
    bindDisabled(target) {
        bindValue(this.globalDisabled_, (disabled) => {
            target.disabled = disabled;
        });
    }
    bindTabIndex(elem) {
        bindValue(this.globalDisabled_, (disabled) => {
            elem.tabIndex = disabled ? -1 : 0;
        });
    }
    handleDispose(callback) {
        this.value('disposed').emitter.on('change', (disposed) => {
            if (disposed) {
                callback();
            }
        });
    }
    importState(state) {
        this.set('disabled', state.disabled);
        this.set('hidden', state.hidden);
    }
    exportState() {
        return {
            disabled: this.get('disabled'),
            hidden: this.get('hidden'),
        };
    }
    getGlobalDisabled_() {
        const parent = this.get('parent');
        const parentDisabled = parent ? parent.globalDisabled.rawValue : false;
        return parentDisabled || this.get('disabled');
    }
    updateGlobalDisabled_() {
        this.setGlobalDisabled_(this.getGlobalDisabled_());
    }
    onDisabledChange_() {
        this.updateGlobalDisabled_();
    }
    onParentGlobalDisabledChange_() {
        this.updateGlobalDisabled_();
    }
    onParentChange_(ev) {
        var _a;
        const prevParent = ev.previousRawValue;
        prevParent === null || prevParent === void 0 ? void 0 : prevParent.globalDisabled.emitter.off('change', this.onParentGlobalDisabledChange_);
        (_a = this.get('parent')) === null || _a === void 0 ? void 0 : _a.globalDisabled.emitter.on('change', this.onParentGlobalDisabledChange_);
        this.updateGlobalDisabled_();
    }
}

const cn$n = ClassName('tbp');
class TabPageView {
    constructor(doc, config) {
        this.element = doc.createElement('div');
        this.element.classList.add(cn$n());
        config.viewProps.bindClassModifiers(this.element);
        const containerElem = doc.createElement('div');
        containerElem.classList.add(cn$n('c'));
        this.element.appendChild(containerElem);
        this.containerElement = containerElem;
    }
}

const cn$m = ClassName('tbi');
class TabItemView {
    constructor(doc, config) {
        this.element = doc.createElement('div');
        this.element.classList.add(cn$m());
        config.viewProps.bindClassModifiers(this.element);
        bindValueMap(config.props, 'selected', (selected) => {
            if (selected) {
                this.element.classList.add(cn$m(undefined, 'sel'));
            }
            else {
                this.element.classList.remove(cn$m(undefined, 'sel'));
            }
        });
        const buttonElem = doc.createElement('button');
        buttonElem.classList.add(cn$m('b'));
        config.viewProps.bindDisabled(buttonElem);
        this.element.appendChild(buttonElem);
        this.buttonElement = buttonElem;
        const titleElem = doc.createElement('div');
        titleElem.classList.add(cn$m('t'));
        bindValueToTextContent(config.props.value('title'), titleElem);
        this.buttonElement.appendChild(titleElem);
        this.titleElement = titleElem;
    }
}

class TabItemController {
    constructor(doc, config) {
        this.emitter = new Emitter();
        this.onClick_ = this.onClick_.bind(this);
        this.props = config.props;
        this.viewProps = config.viewProps;
        this.view = new TabItemView(doc, {
            props: config.props,
            viewProps: config.viewProps,
        });
        this.view.buttonElement.addEventListener('click', this.onClick_);
    }
    onClick_() {
        this.emitter.emit('click', {
            sender: this,
        });
    }
}

class TabPageController extends ContainerBladeController {
    constructor(doc, config) {
        const view = new TabPageView(doc, {
            viewProps: config.viewProps,
        });
        super(Object.assign(Object.assign({}, config), { rackController: new RackController({
                blade: config.blade,
                element: view.containerElement,
                viewProps: config.viewProps,
            }), view: view }));
        this.onItemClick_ = this.onItemClick_.bind(this);
        this.ic_ = new TabItemController(doc, {
            props: config.itemProps,
            viewProps: ViewProps.create(),
        });
        this.ic_.emitter.on('click', this.onItemClick_);
        this.props = config.props;
        bindValueMap(this.props, 'selected', (selected) => {
            this.itemController.props.set('selected', selected);
            this.viewProps.set('hidden', !selected);
        });
    }
    get itemController() {
        return this.ic_;
    }
    importState(state) {
        return importBladeState(state, (s) => super.importState(s), (p) => ({
            selected: p.required.boolean,
            title: p.required.string,
        }), (result) => {
            this.ic_.props.set('selected', result.selected);
            this.ic_.props.set('title', result.title);
            return true;
        });
    }
    exportState() {
        return exportBladeState(() => super.exportState(), {
            selected: this.ic_.props.get('selected'),
            title: this.ic_.props.get('title'),
        });
    }
    onItemClick_() {
        this.props.set('selected', true);
    }
}

class TabApi extends ContainerBladeApi {
    constructor(controller, pool) {
        super(controller, pool);
        this.emitter_ = new Emitter();
        this.onSelect_ = this.onSelect_.bind(this);
        this.pool_ = pool;
        this.rackApi_.on('change', (ev) => {
            this.emitter_.emit('change', ev);
        });
        this.controller.tab.selectedIndex.emitter.on('change', this.onSelect_);
    }
    get pages() {
        return this.rackApi_.children;
    }
    addPage(params) {
        const doc = this.controller.view.element.ownerDocument;
        const pc = new TabPageController(doc, {
            blade: createBlade(),
            itemProps: ValueMap.fromObject({
                selected: false,
                title: params.title,
            }),
            props: ValueMap.fromObject({
                selected: false,
            }),
            viewProps: ViewProps.create(),
        });
        const papi = this.pool_.createApi(pc);
        return this.rackApi_.add(papi, params.index);
    }
    removePage(index) {
        this.rackApi_.remove(this.rackApi_.children[index]);
    }
    on(eventName, handler) {
        const bh = handler.bind(this);
        this.emitter_.on(eventName, (ev) => {
            bh(ev);
        }, {
            key: handler,
        });
        return this;
    }
    off(eventName, handler) {
        this.emitter_.off(eventName, handler);
        return this;
    }
    onSelect_(ev) {
        this.emitter_.emit('select', new TpTabSelectEvent(this, ev.rawValue));
    }
}

class TabPageApi extends ContainerBladeApi {
    get title() {
        var _a;
        return (_a = this.controller.itemController.props.get('title')) !== null && _a !== void 0 ? _a : '';
    }
    set title(title) {
        this.controller.itemController.props.set('title', title);
    }
    get selected() {
        return this.controller.props.get('selected');
    }
    set selected(selected) {
        this.controller.props.set('selected', selected);
    }
    get children() {
        return this.rackApi_.children;
    }
    addButton(params) {
        return this.rackApi_.addButton(params);
    }
    addFolder(params) {
        return this.rackApi_.addFolder(params);
    }
    addTab(params) {
        return this.rackApi_.addTab(params);
    }
    add(api, opt_index) {
        this.rackApi_.add(api, opt_index);
    }
    remove(api) {
        this.rackApi_.remove(api);
    }
    addBinding(object, key, opt_params) {
        return this.rackApi_.addBinding(object, key, opt_params);
    }
    addBlade(params) {
        return this.rackApi_.addBlade(params);
    }
}

const INDEX_NOT_SELECTED = -1;
class Tab {
    constructor() {
        this.onItemSelectedChange_ = this.onItemSelectedChange_.bind(this);
        this.empty = createValue(true);
        this.selectedIndex = createValue(INDEX_NOT_SELECTED);
        this.items_ = [];
    }
    add(item, opt_index) {
        const index = opt_index !== null && opt_index !== void 0 ? opt_index : this.items_.length;
        this.items_.splice(index, 0, item);
        item.emitter.on('change', this.onItemSelectedChange_);
        this.keepSelection_();
    }
    remove(item) {
        const index = this.items_.indexOf(item);
        if (index < 0) {
            return;
        }
        this.items_.splice(index, 1);
        item.emitter.off('change', this.onItemSelectedChange_);
        this.keepSelection_();
    }
    keepSelection_() {
        if (this.items_.length === 0) {
            this.selectedIndex.rawValue = INDEX_NOT_SELECTED;
            this.empty.rawValue = true;
            return;
        }
        const firstSelIndex = this.items_.findIndex((s) => s.rawValue);
        if (firstSelIndex < 0) {
            this.items_.forEach((s, i) => {
                s.rawValue = i === 0;
            });
            this.selectedIndex.rawValue = 0;
        }
        else {
            this.items_.forEach((s, i) => {
                s.rawValue = i === firstSelIndex;
            });
            this.selectedIndex.rawValue = firstSelIndex;
        }
        this.empty.rawValue = false;
    }
    onItemSelectedChange_(ev) {
        if (ev.rawValue) {
            const index = this.items_.findIndex((s) => s === ev.sender);
            this.items_.forEach((s, i) => {
                s.rawValue = i === index;
            });
            this.selectedIndex.rawValue = index;
        }
        else {
            this.keepSelection_();
        }
    }
}

const cn$l = ClassName('tab');
class TabView {
    constructor(doc, config) {
        this.element = doc.createElement('div');
        this.element.classList.add(cn$l(), bladeContainerClassName());
        config.viewProps.bindClassModifiers(this.element);
        bindValue(config.empty, valueToClassName(this.element, cn$l(undefined, 'nop')));
        const titleElem = doc.createElement('div');
        titleElem.classList.add(cn$l('t'));
        this.element.appendChild(titleElem);
        this.itemsElement = titleElem;
        const indentElem = doc.createElement('div');
        indentElem.classList.add(cn$l('i'));
        this.element.appendChild(indentElem);
        const contentsElem = doc.createElement('div');
        contentsElem.classList.add(cn$l('c'));
        this.element.appendChild(contentsElem);
        this.contentsElement = contentsElem;
    }
}

class TabController extends ContainerBladeController {
    constructor(doc, config) {
        const tab = new Tab();
        const view = new TabView(doc, {
            empty: tab.empty,
            viewProps: config.viewProps,
        });
        super({
            blade: config.blade,
            rackController: new RackController({
                blade: config.blade,
                element: view.contentsElement,
                viewProps: config.viewProps,
            }),
            view: view,
        });
        this.onRackAdd_ = this.onRackAdd_.bind(this);
        this.onRackRemove_ = this.onRackRemove_.bind(this);
        const rack = this.rackController.rack;
        rack.emitter.on('add', this.onRackAdd_);
        rack.emitter.on('remove', this.onRackRemove_);
        this.tab = tab;
    }
    add(pc, opt_index) {
        this.rackController.rack.add(pc, opt_index);
    }
    remove(index) {
        this.rackController.rack.remove(this.rackController.rack.children[index]);
    }
    onRackAdd_(ev) {
        if (!ev.root) {
            return;
        }
        const pc = ev.bladeController;
        insertElementAt(this.view.itemsElement, pc.itemController.view.element, ev.index);
        pc.itemController.viewProps.set('parent', this.viewProps);
        this.tab.add(pc.props.value('selected'));
    }
    onRackRemove_(ev) {
        if (!ev.root) {
            return;
        }
        const pc = ev.bladeController;
        removeElement(pc.itemController.view.element);
        pc.itemController.viewProps.set('parent', null);
        this.tab.remove(pc.props.value('selected'));
    }
}

const TabBladePlugin = createPlugin({
    id: 'tab',
    type: 'blade',
    accept(params) {
        const result = parseRecord(params, (p) => ({
            pages: p.required.array(p.required.object({ title: p.required.string })),
            view: p.required.constant('tab'),
        }));
        if (!result || result.pages.length === 0) {
            return null;
        }
        return { params: result };
    },
    controller(args) {
        const c = new TabController(args.document, {
            blade: args.blade,
            viewProps: args.viewProps,
        });
        args.params.pages.forEach((p) => {
            const pc = new TabPageController(args.document, {
                blade: createBlade(),
                itemProps: ValueMap.fromObject({
                    selected: false,
                    title: p.title,
                }),
                props: ValueMap.fromObject({
                    selected: false,
                }),
                viewProps: ViewProps.create(),
            });
            c.add(pc);
        });
        return c;
    },
    api(args) {
        if (args.controller instanceof TabController) {
            return new TabApi(args.controller, args.pool);
        }
        if (args.controller instanceof TabPageController) {
            return new TabPageApi(args.controller, args.pool);
        }
        return null;
    },
});

function createBladeController(plugin, args) {
    const ac = plugin.accept(args.params);
    if (!ac) {
        return null;
    }
    const params = parseRecord(args.params, (p) => ({
        disabled: p.optional.boolean,
        hidden: p.optional.boolean,
    }));
    return plugin.controller({
        blade: createBlade(),
        document: args.document,
        params: forceCast(Object.assign(Object.assign({}, ac.params), { disabled: params === null || params === void 0 ? void 0 : params.disabled, hidden: params === null || params === void 0 ? void 0 : params.hidden })),
        viewProps: ViewProps.create({
            disabled: params === null || params === void 0 ? void 0 : params.disabled,
            hidden: params === null || params === void 0 ? void 0 : params.hidden,
        }),
    });
}

class ListInputBindingApi extends BindingApi {
    get options() {
        return this.controller.valueController.props.get('options');
    }
    set options(options) {
        this.controller.valueController.props.set('options', options);
    }
}

class ManualTicker {
    constructor() {
        this.disabled = false;
        this.emitter = new Emitter();
    }
    dispose() { }
    tick() {
        if (this.disabled) {
            return;
        }
        this.emitter.emit('tick', {
            sender: this,
        });
    }
}

class IntervalTicker {
    constructor(doc, interval) {
        this.disabled_ = false;
        this.timerId_ = null;
        this.onTick_ = this.onTick_.bind(this);
        this.doc_ = doc;
        this.emitter = new Emitter();
        this.interval_ = interval;
        this.setTimer_();
    }
    get disabled() {
        return this.disabled_;
    }
    set disabled(inactive) {
        this.disabled_ = inactive;
        if (this.disabled_) {
            this.clearTimer_();
        }
        else {
            this.setTimer_();
        }
    }
    dispose() {
        this.clearTimer_();
    }
    clearTimer_() {
        if (this.timerId_ === null) {
            return;
        }
        const win = this.doc_.defaultView;
        if (win) {
            win.clearInterval(this.timerId_);
        }
        this.timerId_ = null;
    }
    setTimer_() {
        this.clearTimer_();
        if (this.interval_ <= 0) {
            return;
        }
        const win = this.doc_.defaultView;
        if (win) {
            this.timerId_ = win.setInterval(this.onTick_, this.interval_);
        }
    }
    onTick_() {
        if (this.disabled_) {
            return;
        }
        this.emitter.emit('tick', {
            sender: this,
        });
    }
}

class CompositeConstraint {
    constructor(constraints) {
        this.constraints = constraints;
    }
    constrain(value) {
        return this.constraints.reduce((result, c) => {
            return c.constrain(result);
        }, value);
    }
}
function findConstraint(c, constraintClass) {
    if (c instanceof constraintClass) {
        return c;
    }
    if (c instanceof CompositeConstraint) {
        const result = c.constraints.reduce((tmpResult, sc) => {
            if (tmpResult) {
                return tmpResult;
            }
            return sc instanceof constraintClass ? sc : null;
        }, null);
        if (result) {
            return result;
        }
    }
    return null;
}

class ListConstraint {
    constructor(options) {
        this.values = ValueMap.fromObject({
            options: options,
        });
    }
    constrain(value) {
        const opts = this.values.get('options');
        if (opts.length === 0) {
            return value;
        }
        const matched = opts.filter((item) => {
            return item.value === value;
        }).length > 0;
        return matched ? value : opts[0].value;
    }
}

function parseListOptions(value) {
    var _a;
    const p = MicroParsers;
    if (Array.isArray(value)) {
        return (_a = parseRecord({ items: value }, (p) => ({
            items: p.required.array(p.required.object({
                text: p.required.string,
                value: p.required.raw,
            })),
        }))) === null || _a === void 0 ? void 0 : _a.items;
    }
    if (typeof value === 'object') {
        return p.required.raw(value)
            .value;
    }
    return undefined;
}
function normalizeListOptions(options) {
    if (Array.isArray(options)) {
        return options;
    }
    const items = [];
    Object.keys(options).forEach((text) => {
        items.push({ text: text, value: options[text] });
    });
    return items;
}
function createListConstraint(options) {
    return !isEmpty(options)
        ? new ListConstraint(normalizeListOptions(forceCast(options)))
        : null;
}

const cn$k = ClassName('lst');
class ListView {
    constructor(doc, config) {
        this.onValueChange_ = this.onValueChange_.bind(this);
        this.props_ = config.props;
        this.element = doc.createElement('div');
        this.element.classList.add(cn$k());
        config.viewProps.bindClassModifiers(this.element);
        const selectElem = doc.createElement('select');
        selectElem.classList.add(cn$k('s'));
        config.viewProps.bindDisabled(selectElem);
        this.element.appendChild(selectElem);
        this.selectElement = selectElem;
        const markElem = doc.createElement('div');
        markElem.classList.add(cn$k('m'));
        markElem.appendChild(createSvgIconElement(doc, 'dropdown'));
        this.element.appendChild(markElem);
        config.value.emitter.on('change', this.onValueChange_);
        this.value_ = config.value;
        bindValueMap(this.props_, 'options', (opts) => {
            removeChildElements(this.selectElement);
            opts.forEach((item) => {
                const optionElem = doc.createElement('option');
                optionElem.textContent = item.text;
                this.selectElement.appendChild(optionElem);
            });
            this.update_();
        });
    }
    update_() {
        const values = this.props_.get('options').map((o) => o.value);
        this.selectElement.selectedIndex = values.indexOf(this.value_.rawValue);
    }
    onValueChange_() {
        this.update_();
    }
}

class ListController {
    constructor(doc, config) {
        this.onSelectChange_ = this.onSelectChange_.bind(this);
        this.props = config.props;
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new ListView(doc, {
            props: this.props,
            value: this.value,
            viewProps: this.viewProps,
        });
        this.view.selectElement.addEventListener('change', this.onSelectChange_);
    }
    onSelectChange_(e) {
        const selectElem = forceCast(e.currentTarget);
        this.value.rawValue =
            this.props.get('options')[selectElem.selectedIndex].value;
    }
    importProps(state) {
        return importBladeState(state, null, (p) => ({
            options: p.required.custom(parseListOptions),
        }), (result) => {
            this.props.set('options', normalizeListOptions(result.options));
            return true;
        });
    }
    exportProps() {
        return exportBladeState(null, {
            options: this.props.get('options'),
        });
    }
}

const cn$j = ClassName('pop');
class PopupView {
    constructor(doc, config) {
        this.element = doc.createElement('div');
        this.element.classList.add(cn$j());
        config.viewProps.bindClassModifiers(this.element);
        bindValue(config.shows, valueToClassName(this.element, cn$j(undefined, 'v')));
    }
}

class PopupController {
    constructor(doc, config) {
        this.shows = createValue(false);
        this.viewProps = config.viewProps;
        this.view = new PopupView(doc, {
            shows: this.shows,
            viewProps: this.viewProps,
        });
    }
}

const cn$i = ClassName('txt');
class TextView {
    constructor(doc, config) {
        this.onChange_ = this.onChange_.bind(this);
        this.element = doc.createElement('div');
        this.element.classList.add(cn$i());
        config.viewProps.bindClassModifiers(this.element);
        this.props_ = config.props;
        this.props_.emitter.on('change', this.onChange_);
        const inputElem = doc.createElement('input');
        inputElem.classList.add(cn$i('i'));
        inputElem.type = 'text';
        config.viewProps.bindDisabled(inputElem);
        this.element.appendChild(inputElem);
        this.inputElement = inputElem;
        config.value.emitter.on('change', this.onChange_);
        this.value_ = config.value;
        this.refresh();
    }
    refresh() {
        const formatter = this.props_.get('formatter');
        this.inputElement.value = formatter(this.value_.rawValue);
    }
    onChange_() {
        this.refresh();
    }
}

class TextController {
    constructor(doc, config) {
        this.onInputChange_ = this.onInputChange_.bind(this);
        this.parser_ = config.parser;
        this.props = config.props;
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new TextView(doc, {
            props: config.props,
            value: this.value,
            viewProps: this.viewProps,
        });
        this.view.inputElement.addEventListener('change', this.onInputChange_);
    }
    onInputChange_(e) {
        const inputElem = forceCast(e.currentTarget);
        const value = inputElem.value;
        const parsedValue = this.parser_(value);
        if (!isEmpty(parsedValue)) {
            this.value.rawValue = parsedValue;
        }
        this.view.refresh();
    }
}

function boolToString(value) {
    return String(value);
}
function boolFromUnknown(value) {
    if (value === 'false') {
        return false;
    }
    return !!value;
}
function BooleanFormatter(value) {
    return boolToString(value);
}

function composeParsers(parsers) {
    return (text) => {
        return parsers.reduce((result, parser) => {
            if (result !== null) {
                return result;
            }
            return parser(text);
        }, null);
    };
}

const innerFormatter = createNumberFormatter(0);
function formatPercentage(value) {
    return innerFormatter(value) + '%';
}

function stringFromUnknown(value) {
    return String(value);
}
function formatString(value) {
    return value;
}

function connectValues({ primary, secondary, forward, backward, }) {
    let changing = false;
    function preventFeedback(callback) {
        if (changing) {
            return;
        }
        changing = true;
        callback();
        changing = false;
    }
    primary.emitter.on('change', (ev) => {
        preventFeedback(() => {
            secondary.setRawValue(forward(primary.rawValue, secondary.rawValue), ev.options);
        });
    });
    secondary.emitter.on('change', (ev) => {
        preventFeedback(() => {
            primary.setRawValue(backward(primary.rawValue, secondary.rawValue), ev.options);
        });
        preventFeedback(() => {
            secondary.setRawValue(forward(primary.rawValue, secondary.rawValue), ev.options);
        });
    });
    preventFeedback(() => {
        secondary.setRawValue(forward(primary.rawValue, secondary.rawValue), {
            forceEmit: false,
            last: true,
        });
    });
}

function getStepForKey(keyScale, keys) {
    const step = keyScale * (keys.altKey ? 0.1 : 1) * (keys.shiftKey ? 10 : 1);
    if (keys.upKey) {
        return +step;
    }
    else if (keys.downKey) {
        return -step;
    }
    return 0;
}
function getVerticalStepKeys(ev) {
    return {
        altKey: ev.altKey,
        downKey: ev.key === 'ArrowDown',
        shiftKey: ev.shiftKey,
        upKey: ev.key === 'ArrowUp',
    };
}
function getHorizontalStepKeys(ev) {
    return {
        altKey: ev.altKey,
        downKey: ev.key === 'ArrowLeft',
        shiftKey: ev.shiftKey,
        upKey: ev.key === 'ArrowRight',
    };
}
function isVerticalArrowKey(key) {
    return key === 'ArrowUp' || key === 'ArrowDown';
}
function isArrowKey(key) {
    return isVerticalArrowKey(key) || key === 'ArrowLeft' || key === 'ArrowRight';
}

function computeOffset$1(ev, elem) {
    var _a, _b;
    const win = elem.ownerDocument.defaultView;
    const rect = elem.getBoundingClientRect();
    return {
        x: ev.pageX - (((_a = (win && win.scrollX)) !== null && _a !== void 0 ? _a : 0) + rect.left),
        y: ev.pageY - (((_b = (win && win.scrollY)) !== null && _b !== void 0 ? _b : 0) + rect.top),
    };
}
class PointerHandler {
    constructor(element) {
        this.lastTouch_ = null;
        this.onDocumentMouseMove_ = this.onDocumentMouseMove_.bind(this);
        this.onDocumentMouseUp_ = this.onDocumentMouseUp_.bind(this);
        this.onMouseDown_ = this.onMouseDown_.bind(this);
        this.onTouchEnd_ = this.onTouchEnd_.bind(this);
        this.onTouchMove_ = this.onTouchMove_.bind(this);
        this.onTouchStart_ = this.onTouchStart_.bind(this);
        this.elem_ = element;
        this.emitter = new Emitter();
        element.addEventListener('touchstart', this.onTouchStart_, {
            passive: false,
        });
        element.addEventListener('touchmove', this.onTouchMove_, {
            passive: true,
        });
        element.addEventListener('touchend', this.onTouchEnd_);
        element.addEventListener('mousedown', this.onMouseDown_);
    }
    computePosition_(offset) {
        const rect = this.elem_.getBoundingClientRect();
        return {
            bounds: {
                width: rect.width,
                height: rect.height,
            },
            point: offset
                ? {
                    x: offset.x,
                    y: offset.y,
                }
                : null,
        };
    }
    onMouseDown_(ev) {
        var _a;
        ev.preventDefault();
        (_a = ev.currentTarget) === null || _a === void 0 ? void 0 : _a.focus();
        const doc = this.elem_.ownerDocument;
        doc.addEventListener('mousemove', this.onDocumentMouseMove_);
        doc.addEventListener('mouseup', this.onDocumentMouseUp_);
        this.emitter.emit('down', {
            altKey: ev.altKey,
            data: this.computePosition_(computeOffset$1(ev, this.elem_)),
            sender: this,
            shiftKey: ev.shiftKey,
        });
    }
    onDocumentMouseMove_(ev) {
        this.emitter.emit('move', {
            altKey: ev.altKey,
            data: this.computePosition_(computeOffset$1(ev, this.elem_)),
            sender: this,
            shiftKey: ev.shiftKey,
        });
    }
    onDocumentMouseUp_(ev) {
        const doc = this.elem_.ownerDocument;
        doc.removeEventListener('mousemove', this.onDocumentMouseMove_);
        doc.removeEventListener('mouseup', this.onDocumentMouseUp_);
        this.emitter.emit('up', {
            altKey: ev.altKey,
            data: this.computePosition_(computeOffset$1(ev, this.elem_)),
            sender: this,
            shiftKey: ev.shiftKey,
        });
    }
    onTouchStart_(ev) {
        ev.preventDefault();
        const touch = ev.targetTouches.item(0);
        const rect = this.elem_.getBoundingClientRect();
        this.emitter.emit('down', {
            altKey: ev.altKey,
            data: this.computePosition_(touch
                ? {
                    x: touch.clientX - rect.left,
                    y: touch.clientY - rect.top,
                }
                : undefined),
            sender: this,
            shiftKey: ev.shiftKey,
        });
        this.lastTouch_ = touch;
    }
    onTouchMove_(ev) {
        const touch = ev.targetTouches.item(0);
        const rect = this.elem_.getBoundingClientRect();
        this.emitter.emit('move', {
            altKey: ev.altKey,
            data: this.computePosition_(touch
                ? {
                    x: touch.clientX - rect.left,
                    y: touch.clientY - rect.top,
                }
                : undefined),
            sender: this,
            shiftKey: ev.shiftKey,
        });
        this.lastTouch_ = touch;
    }
    onTouchEnd_(ev) {
        var _a;
        const touch = (_a = ev.targetTouches.item(0)) !== null && _a !== void 0 ? _a : this.lastTouch_;
        const rect = this.elem_.getBoundingClientRect();
        this.emitter.emit('up', {
            altKey: ev.altKey,
            data: this.computePosition_(touch
                ? {
                    x: touch.clientX - rect.left,
                    y: touch.clientY - rect.top,
                }
                : undefined),
            sender: this,
            shiftKey: ev.shiftKey,
        });
    }
}

const cn$h = ClassName('txt');
class NumberTextView {
    constructor(doc, config) {
        this.onChange_ = this.onChange_.bind(this);
        this.props_ = config.props;
        this.props_.emitter.on('change', this.onChange_);
        this.element = doc.createElement('div');
        this.element.classList.add(cn$h(), cn$h(undefined, 'num'));
        if (config.arrayPosition) {
            this.element.classList.add(cn$h(undefined, config.arrayPosition));
        }
        config.viewProps.bindClassModifiers(this.element);
        const inputElem = doc.createElement('input');
        inputElem.classList.add(cn$h('i'));
        inputElem.type = 'text';
        config.viewProps.bindDisabled(inputElem);
        this.element.appendChild(inputElem);
        this.inputElement = inputElem;
        this.onDraggingChange_ = this.onDraggingChange_.bind(this);
        this.dragging_ = config.dragging;
        this.dragging_.emitter.on('change', this.onDraggingChange_);
        this.element.classList.add(cn$h());
        this.inputElement.classList.add(cn$h('i'));
        const knobElem = doc.createElement('div');
        knobElem.classList.add(cn$h('k'));
        this.element.appendChild(knobElem);
        this.knobElement = knobElem;
        const guideElem = doc.createElementNS(SVG_NS, 'svg');
        guideElem.classList.add(cn$h('g'));
        this.knobElement.appendChild(guideElem);
        const bodyElem = doc.createElementNS(SVG_NS, 'path');
        bodyElem.classList.add(cn$h('gb'));
        guideElem.appendChild(bodyElem);
        this.guideBodyElem_ = bodyElem;
        const headElem = doc.createElementNS(SVG_NS, 'path');
        headElem.classList.add(cn$h('gh'));
        guideElem.appendChild(headElem);
        this.guideHeadElem_ = headElem;
        const tooltipElem = doc.createElement('div');
        tooltipElem.classList.add(ClassName('tt')());
        this.knobElement.appendChild(tooltipElem);
        this.tooltipElem_ = tooltipElem;
        config.value.emitter.on('change', this.onChange_);
        this.value = config.value;
        this.refresh();
    }
    onDraggingChange_(ev) {
        if (ev.rawValue === null) {
            this.element.classList.remove(cn$h(undefined, 'drg'));
            return;
        }
        this.element.classList.add(cn$h(undefined, 'drg'));
        const x = ev.rawValue / this.props_.get('pointerScale');
        const aox = x + (x > 0 ? -1 : x < 0 ? +1 : 0);
        const adx = constrainRange(-aox, -4, +4);
        this.guideHeadElem_.setAttributeNS(null, 'd', [`M ${aox + adx},0 L${aox},4 L${aox + adx},8`, `M ${x},-1 L${x},9`].join(' '));
        this.guideBodyElem_.setAttributeNS(null, 'd', `M 0,4 L${x},4`);
        const formatter = this.props_.get('formatter');
        this.tooltipElem_.textContent = formatter(this.value.rawValue);
        this.tooltipElem_.style.left = `${x}px`;
    }
    refresh() {
        const formatter = this.props_.get('formatter');
        this.inputElement.value = formatter(this.value.rawValue);
    }
    onChange_() {
        this.refresh();
    }
}

class NumberTextController {
    constructor(doc, config) {
        var _a;
        this.originRawValue_ = 0;
        this.onInputChange_ = this.onInputChange_.bind(this);
        this.onInputKeyDown_ = this.onInputKeyDown_.bind(this);
        this.onInputKeyUp_ = this.onInputKeyUp_.bind(this);
        this.onPointerDown_ = this.onPointerDown_.bind(this);
        this.onPointerMove_ = this.onPointerMove_.bind(this);
        this.onPointerUp_ = this.onPointerUp_.bind(this);
        this.parser_ = config.parser;
        this.props = config.props;
        this.sliderProps_ = (_a = config.sliderProps) !== null && _a !== void 0 ? _a : null;
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.dragging_ = createValue(null);
        this.view = new NumberTextView(doc, {
            arrayPosition: config.arrayPosition,
            dragging: this.dragging_,
            props: this.props,
            value: this.value,
            viewProps: this.viewProps,
        });
        this.view.inputElement.addEventListener('change', this.onInputChange_);
        this.view.inputElement.addEventListener('keydown', this.onInputKeyDown_);
        this.view.inputElement.addEventListener('keyup', this.onInputKeyUp_);
        const ph = new PointerHandler(this.view.knobElement);
        ph.emitter.on('down', this.onPointerDown_);
        ph.emitter.on('move', this.onPointerMove_);
        ph.emitter.on('up', this.onPointerUp_);
    }
    constrainValue_(value) {
        var _a, _b;
        const min = (_a = this.sliderProps_) === null || _a === void 0 ? void 0 : _a.get('min');
        const max = (_b = this.sliderProps_) === null || _b === void 0 ? void 0 : _b.get('max');
        let v = value;
        if (min !== undefined) {
            v = Math.max(v, min);
        }
        if (max !== undefined) {
            v = Math.min(v, max);
        }
        return v;
    }
    onInputChange_(e) {
        const inputElem = forceCast(e.currentTarget);
        const value = inputElem.value;
        const parsedValue = this.parser_(value);
        if (!isEmpty(parsedValue)) {
            this.value.rawValue = this.constrainValue_(parsedValue);
        }
        this.view.refresh();
    }
    onInputKeyDown_(ev) {
        const step = getStepForKey(this.props.get('keyScale'), getVerticalStepKeys(ev));
        if (step === 0) {
            return;
        }
        this.value.setRawValue(this.constrainValue_(this.value.rawValue + step), {
            forceEmit: false,
            last: false,
        });
    }
    onInputKeyUp_(ev) {
        const step = getStepForKey(this.props.get('keyScale'), getVerticalStepKeys(ev));
        if (step === 0) {
            return;
        }
        this.value.setRawValue(this.value.rawValue, {
            forceEmit: true,
            last: true,
        });
    }
    onPointerDown_() {
        this.originRawValue_ = this.value.rawValue;
        this.dragging_.rawValue = 0;
    }
    computeDraggingValue_(data) {
        if (!data.point) {
            return null;
        }
        const dx = data.point.x - data.bounds.width / 2;
        return this.constrainValue_(this.originRawValue_ + dx * this.props.get('pointerScale'));
    }
    onPointerMove_(ev) {
        const v = this.computeDraggingValue_(ev.data);
        if (v === null) {
            return;
        }
        this.value.setRawValue(v, {
            forceEmit: false,
            last: false,
        });
        this.dragging_.rawValue = this.value.rawValue - this.originRawValue_;
    }
    onPointerUp_(ev) {
        const v = this.computeDraggingValue_(ev.data);
        if (v === null) {
            return;
        }
        this.value.setRawValue(v, {
            forceEmit: true,
            last: true,
        });
        this.dragging_.rawValue = null;
    }
}

const cn$g = ClassName('sld');
class SliderView {
    constructor(doc, config) {
        this.onChange_ = this.onChange_.bind(this);
        this.props_ = config.props;
        this.props_.emitter.on('change', this.onChange_);
        this.element = doc.createElement('div');
        this.element.classList.add(cn$g());
        config.viewProps.bindClassModifiers(this.element);
        const trackElem = doc.createElement('div');
        trackElem.classList.add(cn$g('t'));
        config.viewProps.bindTabIndex(trackElem);
        this.element.appendChild(trackElem);
        this.trackElement = trackElem;
        const knobElem = doc.createElement('div');
        knobElem.classList.add(cn$g('k'));
        this.trackElement.appendChild(knobElem);
        this.knobElement = knobElem;
        config.value.emitter.on('change', this.onChange_);
        this.value = config.value;
        this.update_();
    }
    update_() {
        const p = constrainRange(mapRange(this.value.rawValue, this.props_.get('min'), this.props_.get('max'), 0, 100), 0, 100);
        this.knobElement.style.width = `${p}%`;
    }
    onChange_() {
        this.update_();
    }
}

class SliderController {
    constructor(doc, config) {
        this.onKeyDown_ = this.onKeyDown_.bind(this);
        this.onKeyUp_ = this.onKeyUp_.bind(this);
        this.onPointerDownOrMove_ = this.onPointerDownOrMove_.bind(this);
        this.onPointerUp_ = this.onPointerUp_.bind(this);
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.props = config.props;
        this.view = new SliderView(doc, {
            props: this.props,
            value: this.value,
            viewProps: this.viewProps,
        });
        this.ptHandler_ = new PointerHandler(this.view.trackElement);
        this.ptHandler_.emitter.on('down', this.onPointerDownOrMove_);
        this.ptHandler_.emitter.on('move', this.onPointerDownOrMove_);
        this.ptHandler_.emitter.on('up', this.onPointerUp_);
        this.view.trackElement.addEventListener('keydown', this.onKeyDown_);
        this.view.trackElement.addEventListener('keyup', this.onKeyUp_);
    }
    handlePointerEvent_(d, opts) {
        if (!d.point) {
            return;
        }
        this.value.setRawValue(mapRange(constrainRange(d.point.x, 0, d.bounds.width), 0, d.bounds.width, this.props.get('min'), this.props.get('max')), opts);
    }
    onPointerDownOrMove_(ev) {
        this.handlePointerEvent_(ev.data, {
            forceEmit: false,
            last: false,
        });
    }
    onPointerUp_(ev) {
        this.handlePointerEvent_(ev.data, {
            forceEmit: true,
            last: true,
        });
    }
    onKeyDown_(ev) {
        const step = getStepForKey(this.props.get('keyScale'), getHorizontalStepKeys(ev));
        if (step === 0) {
            return;
        }
        this.value.setRawValue(this.value.rawValue + step, {
            forceEmit: false,
            last: false,
        });
    }
    onKeyUp_(ev) {
        const step = getStepForKey(this.props.get('keyScale'), getHorizontalStepKeys(ev));
        if (step === 0) {
            return;
        }
        this.value.setRawValue(this.value.rawValue, {
            forceEmit: true,
            last: true,
        });
    }
}

const cn$f = ClassName('sldtxt');
class SliderTextView {
    constructor(doc, config) {
        this.element = doc.createElement('div');
        this.element.classList.add(cn$f());
        const sliderElem = doc.createElement('div');
        sliderElem.classList.add(cn$f('s'));
        this.sliderView_ = config.sliderView;
        sliderElem.appendChild(this.sliderView_.element);
        this.element.appendChild(sliderElem);
        const textElem = doc.createElement('div');
        textElem.classList.add(cn$f('t'));
        this.textView_ = config.textView;
        textElem.appendChild(this.textView_.element);
        this.element.appendChild(textElem);
    }
}

class SliderTextController {
    constructor(doc, config) {
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.sliderC_ = new SliderController(doc, {
            props: config.sliderProps,
            value: config.value,
            viewProps: this.viewProps,
        });
        this.textC_ = new NumberTextController(doc, {
            parser: config.parser,
            props: config.textProps,
            sliderProps: config.sliderProps,
            value: config.value,
            viewProps: config.viewProps,
        });
        this.view = new SliderTextView(doc, {
            sliderView: this.sliderC_.view,
            textView: this.textC_.view,
        });
    }
    get sliderController() {
        return this.sliderC_;
    }
    get textController() {
        return this.textC_;
    }
    importProps(state) {
        return importBladeState(state, null, (p) => ({
            max: p.required.number,
            min: p.required.number,
        }), (result) => {
            const sliderProps = this.sliderC_.props;
            sliderProps.set('max', result.max);
            sliderProps.set('min', result.min);
            return true;
        });
    }
    exportProps() {
        const sliderProps = this.sliderC_.props;
        return exportBladeState(null, {
            max: sliderProps.get('max'),
            min: sliderProps.get('min'),
        });
    }
}
function createSliderTextProps(config) {
    return {
        sliderProps: new ValueMap({
            keyScale: config.keyScale,
            max: config.max,
            min: config.min,
        }),
        textProps: new ValueMap({
            formatter: createValue(config.formatter),
            keyScale: config.keyScale,
            pointerScale: createValue(config.pointerScale),
        }),
    };
}

const CSS_VAR_MAP = {
    containerUnitSize: 'cnt-usz',
};
function getCssVar(key) {
    return `--${CSS_VAR_MAP[key]}`;
}

function createPointDimensionParser(p) {
    return createNumberTextInputParamsParser(p);
}
function parsePointDimensionParams(value) {
    if (!isRecord(value)) {
        return undefined;
    }
    return parseRecord(value, createPointDimensionParser);
}
function createDimensionConstraint(params, initialValue) {
    if (!params) {
        return undefined;
    }
    const constraints = [];
    const cs = createStepConstraint(params, initialValue);
    if (cs) {
        constraints.push(cs);
    }
    const rs = createRangeConstraint(params);
    if (rs) {
        constraints.push(rs);
    }
    return new CompositeConstraint(constraints);
}

function isCompatible(ver) {
    if (!ver) {
        return false;
    }
    return ver.major === VERSION$1.major;
}

function parsePickerLayout(value) {
    if (value === 'inline' || value === 'popup') {
        return value;
    }
    return undefined;
}

function writePrimitive(target, value) {
    target.write(value);
}

const cn$e = ClassName('ckb');
class CheckboxView {
    constructor(doc, config) {
        this.onValueChange_ = this.onValueChange_.bind(this);
        this.element = doc.createElement('div');
        this.element.classList.add(cn$e());
        config.viewProps.bindClassModifiers(this.element);
        const labelElem = doc.createElement('label');
        labelElem.classList.add(cn$e('l'));
        this.element.appendChild(labelElem);
        this.labelElement = labelElem;
        const inputElem = doc.createElement('input');
        inputElem.classList.add(cn$e('i'));
        inputElem.type = 'checkbox';
        this.labelElement.appendChild(inputElem);
        this.inputElement = inputElem;
        config.viewProps.bindDisabled(this.inputElement);
        const wrapperElem = doc.createElement('div');
        wrapperElem.classList.add(cn$e('w'));
        this.labelElement.appendChild(wrapperElem);
        const markElem = createSvgIconElement(doc, 'check');
        wrapperElem.appendChild(markElem);
        config.value.emitter.on('change', this.onValueChange_);
        this.value = config.value;
        this.update_();
    }
    update_() {
        this.inputElement.checked = this.value.rawValue;
    }
    onValueChange_() {
        this.update_();
    }
}

class CheckboxController {
    constructor(doc, config) {
        this.onInputChange_ = this.onInputChange_.bind(this);
        this.onLabelMouseDown_ = this.onLabelMouseDown_.bind(this);
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new CheckboxView(doc, {
            value: this.value,
            viewProps: this.viewProps,
        });
        this.view.inputElement.addEventListener('change', this.onInputChange_);
        this.view.labelElement.addEventListener('mousedown', this.onLabelMouseDown_);
    }
    onInputChange_(ev) {
        const inputElem = forceCast(ev.currentTarget);
        this.value.rawValue = inputElem.checked;
        ev.preventDefault();
        ev.stopPropagation();
    }
    onLabelMouseDown_(ev) {
        ev.preventDefault();
    }
}

function createConstraint$6(params) {
    const constraints = [];
    const lc = createListConstraint(params.options);
    if (lc) {
        constraints.push(lc);
    }
    return new CompositeConstraint(constraints);
}
const BooleanInputPlugin = createPlugin({
    id: 'input-bool',
    type: 'input',
    accept: (value, params) => {
        if (typeof value !== 'boolean') {
            return null;
        }
        const result = parseRecord(params, (p) => ({
            options: p.optional.custom(parseListOptions),
            readonly: p.optional.constant(false),
        }));
        return result
            ? {
                initialValue: value,
                params: result,
            }
            : null;
    },
    binding: {
        reader: (_args) => boolFromUnknown,
        constraint: (args) => createConstraint$6(args.params),
        writer: (_args) => writePrimitive,
    },
    controller: (args) => {
        const doc = args.document;
        const value = args.value;
        const c = args.constraint;
        const lc = c && findConstraint(c, ListConstraint);
        if (lc) {
            return new ListController(doc, {
                props: new ValueMap({
                    options: lc.values.value('options'),
                }),
                value: value,
                viewProps: args.viewProps,
            });
        }
        return new CheckboxController(doc, {
            value: value,
            viewProps: args.viewProps,
        });
    },
    api(args) {
        if (typeof args.controller.value.rawValue !== 'boolean') {
            return null;
        }
        if (args.controller.valueController instanceof ListController) {
            return new ListInputBindingApi(args.controller);
        }
        return null;
    },
});

const cn$d = ClassName('col');
class ColorView {
    constructor(doc, config) {
        this.element = doc.createElement('div');
        this.element.classList.add(cn$d());
        config.foldable.bindExpandedClass(this.element, cn$d(undefined, 'expanded'));
        bindValueMap(config.foldable, 'completed', valueToClassName(this.element, cn$d(undefined, 'cpl')));
        const headElem = doc.createElement('div');
        headElem.classList.add(cn$d('h'));
        this.element.appendChild(headElem);
        const swatchElem = doc.createElement('div');
        swatchElem.classList.add(cn$d('s'));
        headElem.appendChild(swatchElem);
        this.swatchElement = swatchElem;
        const textElem = doc.createElement('div');
        textElem.classList.add(cn$d('t'));
        headElem.appendChild(textElem);
        this.textElement = textElem;
        if (config.pickerLayout === 'inline') {
            const pickerElem = doc.createElement('div');
            pickerElem.classList.add(cn$d('p'));
            this.element.appendChild(pickerElem);
            this.pickerElement = pickerElem;
        }
        else {
            this.pickerElement = null;
        }
    }
}

function rgbToHslInt(r, g, b) {
    const rp = constrainRange(r / 255, 0, 1);
    const gp = constrainRange(g / 255, 0, 1);
    const bp = constrainRange(b / 255, 0, 1);
    const cmax = Math.max(rp, gp, bp);
    const cmin = Math.min(rp, gp, bp);
    const c = cmax - cmin;
    let h = 0;
    let s = 0;
    const l = (cmin + cmax) / 2;
    if (c !== 0) {
        s = c / (1 - Math.abs(cmax + cmin - 1));
        if (rp === cmax) {
            h = (gp - bp) / c;
        }
        else if (gp === cmax) {
            h = 2 + (bp - rp) / c;
        }
        else {
            h = 4 + (rp - gp) / c;
        }
        h = h / 6 + (h < 0 ? 1 : 0);
    }
    return [h * 360, s * 100, l * 100];
}
function hslToRgbInt(h, s, l) {
    const hp = ((h % 360) + 360) % 360;
    const sp = constrainRange(s / 100, 0, 1);
    const lp = constrainRange(l / 100, 0, 1);
    const c = (1 - Math.abs(2 * lp - 1)) * sp;
    const x = c * (1 - Math.abs(((hp / 60) % 2) - 1));
    const m = lp - c / 2;
    let rp, gp, bp;
    if (hp >= 0 && hp < 60) {
        [rp, gp, bp] = [c, x, 0];
    }
    else if (hp >= 60 && hp < 120) {
        [rp, gp, bp] = [x, c, 0];
    }
    else if (hp >= 120 && hp < 180) {
        [rp, gp, bp] = [0, c, x];
    }
    else if (hp >= 180 && hp < 240) {
        [rp, gp, bp] = [0, x, c];
    }
    else if (hp >= 240 && hp < 300) {
        [rp, gp, bp] = [x, 0, c];
    }
    else {
        [rp, gp, bp] = [c, 0, x];
    }
    return [(rp + m) * 255, (gp + m) * 255, (bp + m) * 255];
}
function rgbToHsvInt(r, g, b) {
    const rp = constrainRange(r / 255, 0, 1);
    const gp = constrainRange(g / 255, 0, 1);
    const bp = constrainRange(b / 255, 0, 1);
    const cmax = Math.max(rp, gp, bp);
    const cmin = Math.min(rp, gp, bp);
    const d = cmax - cmin;
    let h;
    if (d === 0) {
        h = 0;
    }
    else if (cmax === rp) {
        h = 60 * (((((gp - bp) / d) % 6) + 6) % 6);
    }
    else if (cmax === gp) {
        h = 60 * ((bp - rp) / d + 2);
    }
    else {
        h = 60 * ((rp - gp) / d + 4);
    }
    const s = cmax === 0 ? 0 : d / cmax;
    const v = cmax;
    return [h, s * 100, v * 100];
}
function hsvToRgbInt(h, s, v) {
    const hp = loopRange(h, 360);
    const sp = constrainRange(s / 100, 0, 1);
    const vp = constrainRange(v / 100, 0, 1);
    const c = vp * sp;
    const x = c * (1 - Math.abs(((hp / 60) % 2) - 1));
    const m = vp - c;
    let rp, gp, bp;
    if (hp >= 0 && hp < 60) {
        [rp, gp, bp] = [c, x, 0];
    }
    else if (hp >= 60 && hp < 120) {
        [rp, gp, bp] = [x, c, 0];
    }
    else if (hp >= 120 && hp < 180) {
        [rp, gp, bp] = [0, c, x];
    }
    else if (hp >= 180 && hp < 240) {
        [rp, gp, bp] = [0, x, c];
    }
    else if (hp >= 240 && hp < 300) {
        [rp, gp, bp] = [x, 0, c];
    }
    else {
        [rp, gp, bp] = [c, 0, x];
    }
    return [(rp + m) * 255, (gp + m) * 255, (bp + m) * 255];
}
function hslToHsvInt(h, s, l) {
    const sd = l + (s * (100 - Math.abs(2 * l - 100))) / (2 * 100);
    return [
        h,
        sd !== 0 ? (s * (100 - Math.abs(2 * l - 100))) / sd : 0,
        l + (s * (100 - Math.abs(2 * l - 100))) / (2 * 100),
    ];
}
function hsvToHslInt(h, s, v) {
    const sd = 100 - Math.abs((v * (200 - s)) / 100 - 100);
    return [h, sd !== 0 ? (s * v) / sd : 0, (v * (200 - s)) / (2 * 100)];
}
function removeAlphaComponent(comps) {
    return [comps[0], comps[1], comps[2]];
}
function appendAlphaComponent(comps, alpha) {
    return [comps[0], comps[1], comps[2], alpha];
}
const MODE_CONVERTER_MAP = {
    hsl: {
        hsl: (h, s, l) => [h, s, l],
        hsv: hslToHsvInt,
        rgb: hslToRgbInt,
    },
    hsv: {
        hsl: hsvToHslInt,
        hsv: (h, s, v) => [h, s, v],
        rgb: hsvToRgbInt,
    },
    rgb: {
        hsl: rgbToHslInt,
        hsv: rgbToHsvInt,
        rgb: (r, g, b) => [r, g, b],
    },
};
function getColorMaxComponents(mode, type) {
    return [
        type === 'float' ? 1 : mode === 'rgb' ? 255 : 360,
        type === 'float' ? 1 : mode === 'rgb' ? 255 : 100,
        type === 'float' ? 1 : mode === 'rgb' ? 255 : 100,
    ];
}
function loopHueRange(hue, max) {
    return hue === max ? max : loopRange(hue, max);
}
function constrainColorComponents(components, mode, type) {
    var _a;
    const ms = getColorMaxComponents(mode, type);
    return [
        mode === 'rgb'
            ? constrainRange(components[0], 0, ms[0])
            : loopHueRange(components[0], ms[0]),
        constrainRange(components[1], 0, ms[1]),
        constrainRange(components[2], 0, ms[2]),
        constrainRange((_a = components[3]) !== null && _a !== void 0 ? _a : 1, 0, 1),
    ];
}
function convertColorType(comps, mode, from, to) {
    const fms = getColorMaxComponents(mode, from);
    const tms = getColorMaxComponents(mode, to);
    return comps.map((c, index) => (c / fms[index]) * tms[index]);
}
function convertColor(components, from, to) {
    const intComps = convertColorType(components, from.mode, from.type, 'int');
    const result = MODE_CONVERTER_MAP[from.mode][to.mode](...intComps);
    return convertColorType(result, to.mode, 'int', to.type);
}

class IntColor {
    static black() {
        return new IntColor([0, 0, 0], 'rgb');
    }
    constructor(comps, mode) {
        this.type = 'int';
        this.mode = mode;
        this.comps_ = constrainColorComponents(comps, mode, this.type);
    }
    getComponents(opt_mode) {
        return appendAlphaComponent(convertColor(removeAlphaComponent(this.comps_), { mode: this.mode, type: this.type }, { mode: opt_mode !== null && opt_mode !== void 0 ? opt_mode : this.mode, type: this.type }), this.comps_[3]);
    }
    toRgbaObject() {
        const rgbComps = this.getComponents('rgb');
        return {
            r: rgbComps[0],
            g: rgbComps[1],
            b: rgbComps[2],
            a: rgbComps[3],
        };
    }
}

const cn$c = ClassName('colp');
class ColorPickerView {
    constructor(doc, config) {
        this.alphaViews_ = null;
        this.element = doc.createElement('div');
        this.element.classList.add(cn$c());
        config.viewProps.bindClassModifiers(this.element);
        const hsvElem = doc.createElement('div');
        hsvElem.classList.add(cn$c('hsv'));
        const svElem = doc.createElement('div');
        svElem.classList.add(cn$c('sv'));
        this.svPaletteView_ = config.svPaletteView;
        svElem.appendChild(this.svPaletteView_.element);
        hsvElem.appendChild(svElem);
        const hElem = doc.createElement('div');
        hElem.classList.add(cn$c('h'));
        this.hPaletteView_ = config.hPaletteView;
        hElem.appendChild(this.hPaletteView_.element);
        hsvElem.appendChild(hElem);
        this.element.appendChild(hsvElem);
        const rgbElem = doc.createElement('div');
        rgbElem.classList.add(cn$c('rgb'));
        this.textsView_ = config.textsView;
        rgbElem.appendChild(this.textsView_.element);
        this.element.appendChild(rgbElem);
        if (config.alphaViews) {
            this.alphaViews_ = {
                palette: config.alphaViews.palette,
                text: config.alphaViews.text,
            };
            const aElem = doc.createElement('div');
            aElem.classList.add(cn$c('a'));
            const apElem = doc.createElement('div');
            apElem.classList.add(cn$c('ap'));
            apElem.appendChild(this.alphaViews_.palette.element);
            aElem.appendChild(apElem);
            const atElem = doc.createElement('div');
            atElem.classList.add(cn$c('at'));
            atElem.appendChild(this.alphaViews_.text.element);
            aElem.appendChild(atElem);
            this.element.appendChild(aElem);
        }
    }
    get allFocusableElements() {
        const elems = [
            this.svPaletteView_.element,
            this.hPaletteView_.element,
            this.textsView_.modeSelectElement,
            ...this.textsView_.inputViews.map((v) => v.inputElement),
        ];
        if (this.alphaViews_) {
            elems.push(this.alphaViews_.palette.element, this.alphaViews_.text.inputElement);
        }
        return elems;
    }
}

function parseColorType(value) {
    return value === 'int' ? 'int' : value === 'float' ? 'float' : undefined;
}
function parseColorInputParams(params) {
    return parseRecord(params, (p) => ({
        color: p.optional.object({
            alpha: p.optional.boolean,
            type: p.optional.custom(parseColorType),
        }),
        expanded: p.optional.boolean,
        picker: p.optional.custom(parsePickerLayout),
        readonly: p.optional.constant(false),
    }));
}
function getKeyScaleForColor(forAlpha) {
    return forAlpha ? 0.1 : 1;
}
function extractColorType(params) {
    var _a;
    return (_a = params.color) === null || _a === void 0 ? void 0 : _a.type;
}

class FloatColor {
    constructor(comps, mode) {
        this.type = 'float';
        this.mode = mode;
        this.comps_ = constrainColorComponents(comps, mode, this.type);
    }
    getComponents(opt_mode) {
        return appendAlphaComponent(convertColor(removeAlphaComponent(this.comps_), { mode: this.mode, type: this.type }, { mode: opt_mode !== null && opt_mode !== void 0 ? opt_mode : this.mode, type: this.type }), this.comps_[3]);
    }
    toRgbaObject() {
        const rgbComps = this.getComponents('rgb');
        return {
            r: rgbComps[0],
            g: rgbComps[1],
            b: rgbComps[2],
            a: rgbComps[3],
        };
    }
}

const TYPE_TO_CONSTRUCTOR_MAP = {
    int: (comps, mode) => new IntColor(comps, mode),
    float: (comps, mode) => new FloatColor(comps, mode),
};
function createColor(comps, mode, type) {
    return TYPE_TO_CONSTRUCTOR_MAP[type](comps, mode);
}
function isFloatColor(c) {
    return c.type === 'float';
}
function isIntColor(c) {
    return c.type === 'int';
}
function convertFloatToInt(cf) {
    const comps = cf.getComponents();
    const ms = getColorMaxComponents(cf.mode, 'int');
    return new IntColor([
        Math.round(mapRange(comps[0], 0, 1, 0, ms[0])),
        Math.round(mapRange(comps[1], 0, 1, 0, ms[1])),
        Math.round(mapRange(comps[2], 0, 1, 0, ms[2])),
        comps[3],
    ], cf.mode);
}
function convertIntToFloat(ci) {
    const comps = ci.getComponents();
    const ms = getColorMaxComponents(ci.mode, 'int');
    return new FloatColor([
        mapRange(comps[0], 0, ms[0], 0, 1),
        mapRange(comps[1], 0, ms[1], 0, 1),
        mapRange(comps[2], 0, ms[2], 0, 1),
        comps[3],
    ], ci.mode);
}
function mapColorType(c, type) {
    if (c.type === type) {
        return c;
    }
    if (isIntColor(c) && type === 'float') {
        return convertIntToFloat(c);
    }
    if (isFloatColor(c) && type === 'int') {
        return convertFloatToInt(c);
    }
    throw TpError.shouldNeverHappen();
}

function equalsStringColorFormat(f1, f2) {
    return (f1.alpha === f2.alpha &&
        f1.mode === f2.mode &&
        f1.notation === f2.notation &&
        f1.type === f2.type);
}
function parseCssNumberOrPercentage(text, max) {
    const m = text.match(/^(.+)%$/);
    if (!m) {
        return Math.min(parseFloat(text), max);
    }
    return Math.min(parseFloat(m[1]) * 0.01 * max, max);
}
const ANGLE_TO_DEG_MAP = {
    deg: (angle) => angle,
    grad: (angle) => (angle * 360) / 400,
    rad: (angle) => (angle * 360) / (2 * Math.PI),
    turn: (angle) => angle * 360,
};
function parseCssNumberOrAngle(text) {
    const m = text.match(/^([0-9.]+?)(deg|grad|rad|turn)$/);
    if (!m) {
        return parseFloat(text);
    }
    const angle = parseFloat(m[1]);
    const unit = m[2];
    return ANGLE_TO_DEG_MAP[unit](angle);
}
function parseFunctionalRgbColorComponents(text) {
    const m = text.match(/^rgb\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
    if (!m) {
        return null;
    }
    const comps = [
        parseCssNumberOrPercentage(m[1], 255),
        parseCssNumberOrPercentage(m[2], 255),
        parseCssNumberOrPercentage(m[3], 255),
    ];
    if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
        return null;
    }
    return comps;
}
function parseFunctionalRgbColor(text) {
    const comps = parseFunctionalRgbColorComponents(text);
    return comps ? new IntColor(comps, 'rgb') : null;
}
function parseFunctionalRgbaColorComponents(text) {
    const m = text.match(/^rgba\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
    if (!m) {
        return null;
    }
    const comps = [
        parseCssNumberOrPercentage(m[1], 255),
        parseCssNumberOrPercentage(m[2], 255),
        parseCssNumberOrPercentage(m[3], 255),
        parseCssNumberOrPercentage(m[4], 1),
    ];
    if (isNaN(comps[0]) ||
        isNaN(comps[1]) ||
        isNaN(comps[2]) ||
        isNaN(comps[3])) {
        return null;
    }
    return comps;
}
function parseFunctionalRgbaColor(text) {
    const comps = parseFunctionalRgbaColorComponents(text);
    return comps ? new IntColor(comps, 'rgb') : null;
}
function parseFunctionalHslColorComponents(text) {
    const m = text.match(/^hsl\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
    if (!m) {
        return null;
    }
    const comps = [
        parseCssNumberOrAngle(m[1]),
        parseCssNumberOrPercentage(m[2], 100),
        parseCssNumberOrPercentage(m[3], 100),
    ];
    if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
        return null;
    }
    return comps;
}
function parseFunctionalHslColor(text) {
    const comps = parseFunctionalHslColorComponents(text);
    return comps ? new IntColor(comps, 'hsl') : null;
}
function parseHslaColorComponents(text) {
    const m = text.match(/^hsla\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
    if (!m) {
        return null;
    }
    const comps = [
        parseCssNumberOrAngle(m[1]),
        parseCssNumberOrPercentage(m[2], 100),
        parseCssNumberOrPercentage(m[3], 100),
        parseCssNumberOrPercentage(m[4], 1),
    ];
    if (isNaN(comps[0]) ||
        isNaN(comps[1]) ||
        isNaN(comps[2]) ||
        isNaN(comps[3])) {
        return null;
    }
    return comps;
}
function parseFunctionalHslaColor(text) {
    const comps = parseHslaColorComponents(text);
    return comps ? new IntColor(comps, 'hsl') : null;
}
function parseHexRgbColorComponents(text) {
    const mRgb = text.match(/^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
    if (mRgb) {
        return [
            parseInt(mRgb[1] + mRgb[1], 16),
            parseInt(mRgb[2] + mRgb[2], 16),
            parseInt(mRgb[3] + mRgb[3], 16),
        ];
    }
    const mRrggbb = text.match(/^(?:#|0x)([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
    if (mRrggbb) {
        return [
            parseInt(mRrggbb[1], 16),
            parseInt(mRrggbb[2], 16),
            parseInt(mRrggbb[3], 16),
        ];
    }
    return null;
}
function parseHexRgbColor(text) {
    const comps = parseHexRgbColorComponents(text);
    return comps ? new IntColor(comps, 'rgb') : null;
}
function parseHexRgbaColorComponents(text) {
    const mRgb = text.match(/^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
    if (mRgb) {
        return [
            parseInt(mRgb[1] + mRgb[1], 16),
            parseInt(mRgb[2] + mRgb[2], 16),
            parseInt(mRgb[3] + mRgb[3], 16),
            mapRange(parseInt(mRgb[4] + mRgb[4], 16), 0, 255, 0, 1),
        ];
    }
    const mRrggbb = text.match(/^(?:#|0x)?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
    if (mRrggbb) {
        return [
            parseInt(mRrggbb[1], 16),
            parseInt(mRrggbb[2], 16),
            parseInt(mRrggbb[3], 16),
            mapRange(parseInt(mRrggbb[4], 16), 0, 255, 0, 1),
        ];
    }
    return null;
}
function parseHexRgbaColor(text) {
    const comps = parseHexRgbaColorComponents(text);
    return comps ? new IntColor(comps, 'rgb') : null;
}
function parseObjectRgbColorComponents(text) {
    const m = text.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);
    if (!m) {
        return null;
    }
    const comps = [
        parseFloat(m[1]),
        parseFloat(m[2]),
        parseFloat(m[3]),
    ];
    if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
        return null;
    }
    return comps;
}
function createObjectRgbColorParser(type) {
    return (text) => {
        const comps = parseObjectRgbColorComponents(text);
        return comps ? createColor(comps, 'rgb', type) : null;
    };
}
function parseObjectRgbaColorComponents(text) {
    const m = text.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*a\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);
    if (!m) {
        return null;
    }
    const comps = [
        parseFloat(m[1]),
        parseFloat(m[2]),
        parseFloat(m[3]),
        parseFloat(m[4]),
    ];
    if (isNaN(comps[0]) ||
        isNaN(comps[1]) ||
        isNaN(comps[2]) ||
        isNaN(comps[3])) {
        return null;
    }
    return comps;
}
function createObjectRgbaColorParser(type) {
    return (text) => {
        const comps = parseObjectRgbaColorComponents(text);
        return comps ? createColor(comps, 'rgb', type) : null;
    };
}
const PARSER_AND_RESULT = [
    {
        parser: parseHexRgbColorComponents,
        result: {
            alpha: false,
            mode: 'rgb',
            notation: 'hex',
        },
    },
    {
        parser: parseHexRgbaColorComponents,
        result: {
            alpha: true,
            mode: 'rgb',
            notation: 'hex',
        },
    },
    {
        parser: parseFunctionalRgbColorComponents,
        result: {
            alpha: false,
            mode: 'rgb',
            notation: 'func',
        },
    },
    {
        parser: parseFunctionalRgbaColorComponents,
        result: {
            alpha: true,
            mode: 'rgb',
            notation: 'func',
        },
    },
    {
        parser: parseFunctionalHslColorComponents,
        result: {
            alpha: false,
            mode: 'hsl',
            notation: 'func',
        },
    },
    {
        parser: parseHslaColorComponents,
        result: {
            alpha: true,
            mode: 'hsl',
            notation: 'func',
        },
    },
    {
        parser: parseObjectRgbColorComponents,
        result: {
            alpha: false,
            mode: 'rgb',
            notation: 'object',
        },
    },
    {
        parser: parseObjectRgbaColorComponents,
        result: {
            alpha: true,
            mode: 'rgb',
            notation: 'object',
        },
    },
];
function detectStringColor(text) {
    return PARSER_AND_RESULT.reduce((prev, { parser, result: detection }) => {
        if (prev) {
            return prev;
        }
        return parser(text) ? detection : null;
    }, null);
}
function detectStringColorFormat(text, type = 'int') {
    const r = detectStringColor(text);
    if (!r) {
        return null;
    }
    if (r.notation === 'hex' && type !== 'float') {
        return Object.assign(Object.assign({}, r), { type: 'int' });
    }
    if (r.notation === 'func') {
        return Object.assign(Object.assign({}, r), { type: type });
    }
    return null;
}
function createColorStringParser(type) {
    const parsers = [
        parseHexRgbColor,
        parseHexRgbaColor,
        parseFunctionalRgbColor,
        parseFunctionalRgbaColor,
        parseFunctionalHslColor,
        parseFunctionalHslaColor,
    ];
    if (type === 'int') {
        parsers.push(createObjectRgbColorParser('int'), createObjectRgbaColorParser('int'));
    }
    if (type === 'float') {
        parsers.push(createObjectRgbColorParser('float'), createObjectRgbaColorParser('float'));
    }
    const parser = composeParsers(parsers);
    return (text) => {
        const result = parser(text);
        return result ? mapColorType(result, type) : null;
    };
}
function readIntColorString(value) {
    const parser = createColorStringParser('int');
    if (typeof value !== 'string') {
        return IntColor.black();
    }
    const result = parser(value);
    return result !== null && result !== void 0 ? result : IntColor.black();
}
function zerofill(comp) {
    const hex = constrainRange(Math.floor(comp), 0, 255).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
}
function colorToHexRgbString(value, prefix = '#') {
    const hexes = removeAlphaComponent(value.getComponents('rgb'))
        .map(zerofill)
        .join('');
    return `${prefix}${hexes}`;
}
function colorToHexRgbaString(value, prefix = '#') {
    const rgbaComps = value.getComponents('rgb');
    const hexes = [rgbaComps[0], rgbaComps[1], rgbaComps[2], rgbaComps[3] * 255]
        .map(zerofill)
        .join('');
    return `${prefix}${hexes}`;
}
function colorToFunctionalRgbString(value) {
    const formatter = createNumberFormatter(0);
    const ci = mapColorType(value, 'int');
    const comps = removeAlphaComponent(ci.getComponents('rgb')).map((comp) => formatter(comp));
    return `rgb(${comps.join(', ')})`;
}
function colorToFunctionalRgbaString(value) {
    const aFormatter = createNumberFormatter(2);
    const rgbFormatter = createNumberFormatter(0);
    const ci = mapColorType(value, 'int');
    const comps = ci.getComponents('rgb').map((comp, index) => {
        const formatter = index === 3 ? aFormatter : rgbFormatter;
        return formatter(comp);
    });
    return `rgba(${comps.join(', ')})`;
}
function colorToFunctionalHslString(value) {
    const formatters = [
        createNumberFormatter(0),
        formatPercentage,
        formatPercentage,
    ];
    const ci = mapColorType(value, 'int');
    const comps = removeAlphaComponent(ci.getComponents('hsl')).map((comp, index) => formatters[index](comp));
    return `hsl(${comps.join(', ')})`;
}
function colorToFunctionalHslaString(value) {
    const formatters = [
        createNumberFormatter(0),
        formatPercentage,
        formatPercentage,
        createNumberFormatter(2),
    ];
    const ci = mapColorType(value, 'int');
    const comps = ci
        .getComponents('hsl')
        .map((comp, index) => formatters[index](comp));
    return `hsla(${comps.join(', ')})`;
}
function colorToObjectRgbString(value, type) {
    const formatter = createNumberFormatter(type === 'float' ? 2 : 0);
    const names = ['r', 'g', 'b'];
    const cc = mapColorType(value, type);
    const comps = removeAlphaComponent(cc.getComponents('rgb')).map((comp, index) => `${names[index]}: ${formatter(comp)}`);
    return `{${comps.join(', ')}}`;
}
function createObjectRgbColorFormatter(type) {
    return (value) => colorToObjectRgbString(value, type);
}
function colorToObjectRgbaString(value, type) {
    const aFormatter = createNumberFormatter(2);
    const rgbFormatter = createNumberFormatter(type === 'float' ? 2 : 0);
    const names = ['r', 'g', 'b', 'a'];
    const cc = mapColorType(value, type);
    const comps = cc.getComponents('rgb').map((comp, index) => {
        const formatter = index === 3 ? aFormatter : rgbFormatter;
        return `${names[index]}: ${formatter(comp)}`;
    });
    return `{${comps.join(', ')}}`;
}
function createObjectRgbaColorFormatter(type) {
    return (value) => colorToObjectRgbaString(value, type);
}
const FORMAT_AND_STRINGIFIERS = [
    {
        format: {
            alpha: false,
            mode: 'rgb',
            notation: 'hex',
            type: 'int',
        },
        stringifier: colorToHexRgbString,
    },
    {
        format: {
            alpha: true,
            mode: 'rgb',
            notation: 'hex',
            type: 'int',
        },
        stringifier: colorToHexRgbaString,
    },
    {
        format: {
            alpha: false,
            mode: 'rgb',
            notation: 'func',
            type: 'int',
        },
        stringifier: colorToFunctionalRgbString,
    },
    {
        format: {
            alpha: true,
            mode: 'rgb',
            notation: 'func',
            type: 'int',
        },
        stringifier: colorToFunctionalRgbaString,
    },
    {
        format: {
            alpha: false,
            mode: 'hsl',
            notation: 'func',
            type: 'int',
        },
        stringifier: colorToFunctionalHslString,
    },
    {
        format: {
            alpha: true,
            mode: 'hsl',
            notation: 'func',
            type: 'int',
        },
        stringifier: colorToFunctionalHslaString,
    },
    ...['int', 'float'].reduce((prev, type) => {
        return [
            ...prev,
            {
                format: {
                    alpha: false,
                    mode: 'rgb',
                    notation: 'object',
                    type: type,
                },
                stringifier: createObjectRgbColorFormatter(type),
            },
            {
                format: {
                    alpha: true,
                    mode: 'rgb',
                    notation: 'object',
                    type: type,
                },
                stringifier: createObjectRgbaColorFormatter(type),
            },
        ];
    }, []),
];
function findColorStringifier(format) {
    return FORMAT_AND_STRINGIFIERS.reduce((prev, fas) => {
        if (prev) {
            return prev;
        }
        return equalsStringColorFormat(fas.format, format)
            ? fas.stringifier
            : null;
    }, null);
}

const cn$b = ClassName('apl');
class APaletteView {
    constructor(doc, config) {
        this.onValueChange_ = this.onValueChange_.bind(this);
        this.value = config.value;
        this.value.emitter.on('change', this.onValueChange_);
        this.element = doc.createElement('div');
        this.element.classList.add(cn$b());
        config.viewProps.bindClassModifiers(this.element);
        config.viewProps.bindTabIndex(this.element);
        const barElem = doc.createElement('div');
        barElem.classList.add(cn$b('b'));
        this.element.appendChild(barElem);
        const colorElem = doc.createElement('div');
        colorElem.classList.add(cn$b('c'));
        barElem.appendChild(colorElem);
        this.colorElem_ = colorElem;
        const markerElem = doc.createElement('div');
        markerElem.classList.add(cn$b('m'));
        this.element.appendChild(markerElem);
        this.markerElem_ = markerElem;
        const previewElem = doc.createElement('div');
        previewElem.classList.add(cn$b('p'));
        this.markerElem_.appendChild(previewElem);
        this.previewElem_ = previewElem;
        this.update_();
    }
    update_() {
        const c = this.value.rawValue;
        const rgbaComps = c.getComponents('rgb');
        const leftColor = new IntColor([rgbaComps[0], rgbaComps[1], rgbaComps[2], 0], 'rgb');
        const rightColor = new IntColor([rgbaComps[0], rgbaComps[1], rgbaComps[2], 255], 'rgb');
        const gradientComps = [
            'to right',
            colorToFunctionalRgbaString(leftColor),
            colorToFunctionalRgbaString(rightColor),
        ];
        this.colorElem_.style.background = `linear-gradient(${gradientComps.join(',')})`;
        this.previewElem_.style.backgroundColor = colorToFunctionalRgbaString(c);
        const left = mapRange(rgbaComps[3], 0, 1, 0, 100);
        this.markerElem_.style.left = `${left}%`;
    }
    onValueChange_() {
        this.update_();
    }
}

class APaletteController {
    constructor(doc, config) {
        this.onKeyDown_ = this.onKeyDown_.bind(this);
        this.onKeyUp_ = this.onKeyUp_.bind(this);
        this.onPointerDown_ = this.onPointerDown_.bind(this);
        this.onPointerMove_ = this.onPointerMove_.bind(this);
        this.onPointerUp_ = this.onPointerUp_.bind(this);
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new APaletteView(doc, {
            value: this.value,
            viewProps: this.viewProps,
        });
        this.ptHandler_ = new PointerHandler(this.view.element);
        this.ptHandler_.emitter.on('down', this.onPointerDown_);
        this.ptHandler_.emitter.on('move', this.onPointerMove_);
        this.ptHandler_.emitter.on('up', this.onPointerUp_);
        this.view.element.addEventListener('keydown', this.onKeyDown_);
        this.view.element.addEventListener('keyup', this.onKeyUp_);
    }
    handlePointerEvent_(d, opts) {
        if (!d.point) {
            return;
        }
        const alpha = d.point.x / d.bounds.width;
        const c = this.value.rawValue;
        const [h, s, v] = c.getComponents('hsv');
        this.value.setRawValue(new IntColor([h, s, v, alpha], 'hsv'), opts);
    }
    onPointerDown_(ev) {
        this.handlePointerEvent_(ev.data, {
            forceEmit: false,
            last: false,
        });
    }
    onPointerMove_(ev) {
        this.handlePointerEvent_(ev.data, {
            forceEmit: false,
            last: false,
        });
    }
    onPointerUp_(ev) {
        this.handlePointerEvent_(ev.data, {
            forceEmit: true,
            last: true,
        });
    }
    onKeyDown_(ev) {
        const step = getStepForKey(getKeyScaleForColor(true), getHorizontalStepKeys(ev));
        if (step === 0) {
            return;
        }
        const c = this.value.rawValue;
        const [h, s, v, a] = c.getComponents('hsv');
        this.value.setRawValue(new IntColor([h, s, v, a + step], 'hsv'), {
            forceEmit: false,
            last: false,
        });
    }
    onKeyUp_(ev) {
        const step = getStepForKey(getKeyScaleForColor(true), getHorizontalStepKeys(ev));
        if (step === 0) {
            return;
        }
        this.value.setRawValue(this.value.rawValue, {
            forceEmit: true,
            last: true,
        });
    }
}

const cn$a = ClassName('coltxt');
function createModeSelectElement(doc) {
    const selectElem = doc.createElement('select');
    const items = [
        { text: 'RGB', value: 'rgb' },
        { text: 'HSL', value: 'hsl' },
        { text: 'HSV', value: 'hsv' },
        { text: 'HEX', value: 'hex' },
    ];
    selectElem.appendChild(items.reduce((frag, item) => {
        const optElem = doc.createElement('option');
        optElem.textContent = item.text;
        optElem.value = item.value;
        frag.appendChild(optElem);
        return frag;
    }, doc.createDocumentFragment()));
    return selectElem;
}
class ColorTextsView {
    constructor(doc, config) {
        this.element = doc.createElement('div');
        this.element.classList.add(cn$a());
        config.viewProps.bindClassModifiers(this.element);
        const modeElem = doc.createElement('div');
        modeElem.classList.add(cn$a('m'));
        this.modeElem_ = createModeSelectElement(doc);
        this.modeElem_.classList.add(cn$a('ms'));
        modeElem.appendChild(this.modeSelectElement);
        config.viewProps.bindDisabled(this.modeElem_);
        const modeMarkerElem = doc.createElement('div');
        modeMarkerElem.classList.add(cn$a('mm'));
        modeMarkerElem.appendChild(createSvgIconElement(doc, 'dropdown'));
        modeElem.appendChild(modeMarkerElem);
        this.element.appendChild(modeElem);
        const inputsElem = doc.createElement('div');
        inputsElem.classList.add(cn$a('w'));
        this.element.appendChild(inputsElem);
        this.inputsElem_ = inputsElem;
        this.inputViews_ = config.inputViews;
        this.applyInputViews_();
        bindValue(config.mode, (mode) => {
            this.modeElem_.value = mode;
        });
    }
    get modeSelectElement() {
        return this.modeElem_;
    }
    get inputViews() {
        return this.inputViews_;
    }
    set inputViews(inputViews) {
        this.inputViews_ = inputViews;
        this.applyInputViews_();
    }
    applyInputViews_() {
        removeChildElements(this.inputsElem_);
        const doc = this.element.ownerDocument;
        this.inputViews_.forEach((v) => {
            const compElem = doc.createElement('div');
            compElem.classList.add(cn$a('c'));
            compElem.appendChild(v.element);
            this.inputsElem_.appendChild(compElem);
        });
    }
}

function createFormatter$2(type) {
    return createNumberFormatter(type === 'float' ? 2 : 0);
}
function createConstraint$5(mode, type, index) {
    const max = getColorMaxComponents(mode, type)[index];
    return new DefiniteRangeConstraint({
        min: 0,
        max: max,
    });
}
function createComponentController(doc, config, index) {
    return new NumberTextController(doc, {
        arrayPosition: index === 0 ? 'fst' : index === 3 - 1 ? 'lst' : 'mid',
        parser: config.parser,
        props: ValueMap.fromObject({
            formatter: createFormatter$2(config.colorType),
            keyScale: getKeyScaleForColor(false),
            pointerScale: config.colorType === 'float' ? 0.01 : 1,
        }),
        value: createValue(0, {
            constraint: createConstraint$5(config.colorMode, config.colorType, index),
        }),
        viewProps: config.viewProps,
    });
}
function createComponentControllers(doc, config) {
    const cc = {
        colorMode: config.colorMode,
        colorType: config.colorType,
        parser: parseNumber,
        viewProps: config.viewProps,
    };
    return [0, 1, 2].map((i) => {
        const c = createComponentController(doc, cc, i);
        connectValues({
            primary: config.value,
            secondary: c.value,
            forward(p) {
                const mc = mapColorType(p, config.colorType);
                return mc.getComponents(config.colorMode)[i];
            },
            backward(p, s) {
                const pickedMode = config.colorMode;
                const mc = mapColorType(p, config.colorType);
                const comps = mc.getComponents(pickedMode);
                comps[i] = s;
                const c = createColor(appendAlphaComponent(removeAlphaComponent(comps), comps[3]), pickedMode, config.colorType);
                return mapColorType(c, 'int');
            },
        });
        return c;
    });
}
function createHexController(doc, config) {
    const c = new TextController(doc, {
        parser: createColorStringParser('int'),
        props: ValueMap.fromObject({
            formatter: colorToHexRgbString,
        }),
        value: createValue(IntColor.black()),
        viewProps: config.viewProps,
    });
    connectValues({
        primary: config.value,
        secondary: c.value,
        forward: (p) => new IntColor(removeAlphaComponent(p.getComponents()), p.mode),
        backward: (p, s) => new IntColor(appendAlphaComponent(removeAlphaComponent(s.getComponents(p.mode)), p.getComponents()[3]), p.mode),
    });
    return [c];
}
function isColorMode(mode) {
    return mode !== 'hex';
}
class ColorTextsController {
    constructor(doc, config) {
        this.onModeSelectChange_ = this.onModeSelectChange_.bind(this);
        this.colorType_ = config.colorType;
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.colorMode = createValue(this.value.rawValue.mode);
        this.ccs_ = this.createComponentControllers_(doc);
        this.view = new ColorTextsView(doc, {
            mode: this.colorMode,
            inputViews: [this.ccs_[0].view, this.ccs_[1].view, this.ccs_[2].view],
            viewProps: this.viewProps,
        });
        this.view.modeSelectElement.addEventListener('change', this.onModeSelectChange_);
    }
    createComponentControllers_(doc) {
        const mode = this.colorMode.rawValue;
        if (isColorMode(mode)) {
            return createComponentControllers(doc, {
                colorMode: mode,
                colorType: this.colorType_,
                value: this.value,
                viewProps: this.viewProps,
            });
        }
        return createHexController(doc, {
            value: this.value,
            viewProps: this.viewProps,
        });
    }
    onModeSelectChange_(ev) {
        const selectElem = ev.currentTarget;
        this.colorMode.rawValue = selectElem.value;
        this.ccs_ = this.createComponentControllers_(this.view.element.ownerDocument);
        this.view.inputViews = this.ccs_.map((cc) => cc.view);
    }
}

const cn$9 = ClassName('hpl');
class HPaletteView {
    constructor(doc, config) {
        this.onValueChange_ = this.onValueChange_.bind(this);
        this.value = config.value;
        this.value.emitter.on('change', this.onValueChange_);
        this.element = doc.createElement('div');
        this.element.classList.add(cn$9());
        config.viewProps.bindClassModifiers(this.element);
        config.viewProps.bindTabIndex(this.element);
        const colorElem = doc.createElement('div');
        colorElem.classList.add(cn$9('c'));
        this.element.appendChild(colorElem);
        const markerElem = doc.createElement('div');
        markerElem.classList.add(cn$9('m'));
        this.element.appendChild(markerElem);
        this.markerElem_ = markerElem;
        this.update_();
    }
    update_() {
        const c = this.value.rawValue;
        const [h] = c.getComponents('hsv');
        this.markerElem_.style.backgroundColor = colorToFunctionalRgbString(new IntColor([h, 100, 100], 'hsv'));
        const left = mapRange(h, 0, 360, 0, 100);
        this.markerElem_.style.left = `${left}%`;
    }
    onValueChange_() {
        this.update_();
    }
}

class HPaletteController {
    constructor(doc, config) {
        this.onKeyDown_ = this.onKeyDown_.bind(this);
        this.onKeyUp_ = this.onKeyUp_.bind(this);
        this.onPointerDown_ = this.onPointerDown_.bind(this);
        this.onPointerMove_ = this.onPointerMove_.bind(this);
        this.onPointerUp_ = this.onPointerUp_.bind(this);
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new HPaletteView(doc, {
            value: this.value,
            viewProps: this.viewProps,
        });
        this.ptHandler_ = new PointerHandler(this.view.element);
        this.ptHandler_.emitter.on('down', this.onPointerDown_);
        this.ptHandler_.emitter.on('move', this.onPointerMove_);
        this.ptHandler_.emitter.on('up', this.onPointerUp_);
        this.view.element.addEventListener('keydown', this.onKeyDown_);
        this.view.element.addEventListener('keyup', this.onKeyUp_);
    }
    handlePointerEvent_(d, opts) {
        if (!d.point) {
            return;
        }
        const hue = mapRange(constrainRange(d.point.x, 0, d.bounds.width), 0, d.bounds.width, 0, 360);
        const c = this.value.rawValue;
        const [, s, v, a] = c.getComponents('hsv');
        this.value.setRawValue(new IntColor([hue, s, v, a], 'hsv'), opts);
    }
    onPointerDown_(ev) {
        this.handlePointerEvent_(ev.data, {
            forceEmit: false,
            last: false,
        });
    }
    onPointerMove_(ev) {
        this.handlePointerEvent_(ev.data, {
            forceEmit: false,
            last: false,
        });
    }
    onPointerUp_(ev) {
        this.handlePointerEvent_(ev.data, {
            forceEmit: true,
            last: true,
        });
    }
    onKeyDown_(ev) {
        const step = getStepForKey(getKeyScaleForColor(false), getHorizontalStepKeys(ev));
        if (step === 0) {
            return;
        }
        const c = this.value.rawValue;
        const [h, s, v, a] = c.getComponents('hsv');
        this.value.setRawValue(new IntColor([h + step, s, v, a], 'hsv'), {
            forceEmit: false,
            last: false,
        });
    }
    onKeyUp_(ev) {
        const step = getStepForKey(getKeyScaleForColor(false), getHorizontalStepKeys(ev));
        if (step === 0) {
            return;
        }
        this.value.setRawValue(this.value.rawValue, {
            forceEmit: true,
            last: true,
        });
    }
}

const cn$8 = ClassName('svp');
const CANVAS_RESOL = 64;
class SvPaletteView {
    constructor(doc, config) {
        this.onValueChange_ = this.onValueChange_.bind(this);
        this.value = config.value;
        this.value.emitter.on('change', this.onValueChange_);
        this.element = doc.createElement('div');
        this.element.classList.add(cn$8());
        config.viewProps.bindClassModifiers(this.element);
        config.viewProps.bindTabIndex(this.element);
        const canvasElem = doc.createElement('canvas');
        canvasElem.height = CANVAS_RESOL;
        canvasElem.width = CANVAS_RESOL;
        canvasElem.classList.add(cn$8('c'));
        this.element.appendChild(canvasElem);
        this.canvasElement = canvasElem;
        const markerElem = doc.createElement('div');
        markerElem.classList.add(cn$8('m'));
        this.element.appendChild(markerElem);
        this.markerElem_ = markerElem;
        this.update_();
    }
    update_() {
        const ctx = getCanvasContext(this.canvasElement);
        if (!ctx) {
            return;
        }
        const c = this.value.rawValue;
        const hsvComps = c.getComponents('hsv');
        const width = this.canvasElement.width;
        const height = this.canvasElement.height;
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        for (let iy = 0; iy < height; iy++) {
            for (let ix = 0; ix < width; ix++) {
                const s = mapRange(ix, 0, width, 0, 100);
                const v = mapRange(iy, 0, height, 100, 0);
                const rgbComps = hsvToRgbInt(hsvComps[0], s, v);
                const i = (iy * width + ix) * 4;
                data[i] = rgbComps[0];
                data[i + 1] = rgbComps[1];
                data[i + 2] = rgbComps[2];
                data[i + 3] = 255;
            }
        }
        ctx.putImageData(imgData, 0, 0);
        const left = mapRange(hsvComps[1], 0, 100, 0, 100);
        this.markerElem_.style.left = `${left}%`;
        const top = mapRange(hsvComps[2], 0, 100, 100, 0);
        this.markerElem_.style.top = `${top}%`;
    }
    onValueChange_() {
        this.update_();
    }
}

class SvPaletteController {
    constructor(doc, config) {
        this.onKeyDown_ = this.onKeyDown_.bind(this);
        this.onKeyUp_ = this.onKeyUp_.bind(this);
        this.onPointerDown_ = this.onPointerDown_.bind(this);
        this.onPointerMove_ = this.onPointerMove_.bind(this);
        this.onPointerUp_ = this.onPointerUp_.bind(this);
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new SvPaletteView(doc, {
            value: this.value,
            viewProps: this.viewProps,
        });
        this.ptHandler_ = new PointerHandler(this.view.element);
        this.ptHandler_.emitter.on('down', this.onPointerDown_);
        this.ptHandler_.emitter.on('move', this.onPointerMove_);
        this.ptHandler_.emitter.on('up', this.onPointerUp_);
        this.view.element.addEventListener('keydown', this.onKeyDown_);
        this.view.element.addEventListener('keyup', this.onKeyUp_);
    }
    handlePointerEvent_(d, opts) {
        if (!d.point) {
            return;
        }
        const saturation = mapRange(d.point.x, 0, d.bounds.width, 0, 100);
        const value = mapRange(d.point.y, 0, d.bounds.height, 100, 0);
        const [h, , , a] = this.value.rawValue.getComponents('hsv');
        this.value.setRawValue(new IntColor([h, saturation, value, a], 'hsv'), opts);
    }
    onPointerDown_(ev) {
        this.handlePointerEvent_(ev.data, {
            forceEmit: false,
            last: false,
        });
    }
    onPointerMove_(ev) {
        this.handlePointerEvent_(ev.data, {
            forceEmit: false,
            last: false,
        });
    }
    onPointerUp_(ev) {
        this.handlePointerEvent_(ev.data, {
            forceEmit: true,
            last: true,
        });
    }
    onKeyDown_(ev) {
        if (isArrowKey(ev.key)) {
            ev.preventDefault();
        }
        const [h, s, v, a] = this.value.rawValue.getComponents('hsv');
        const keyScale = getKeyScaleForColor(false);
        const ds = getStepForKey(keyScale, getHorizontalStepKeys(ev));
        const dv = getStepForKey(keyScale, getVerticalStepKeys(ev));
        if (ds === 0 && dv === 0) {
            return;
        }
        this.value.setRawValue(new IntColor([h, s + ds, v + dv, a], 'hsv'), {
            forceEmit: false,
            last: false,
        });
    }
    onKeyUp_(ev) {
        const keyScale = getKeyScaleForColor(false);
        const ds = getStepForKey(keyScale, getHorizontalStepKeys(ev));
        const dv = getStepForKey(keyScale, getVerticalStepKeys(ev));
        if (ds === 0 && dv === 0) {
            return;
        }
        this.value.setRawValue(this.value.rawValue, {
            forceEmit: true,
            last: true,
        });
    }
}

class ColorPickerController {
    constructor(doc, config) {
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.hPaletteC_ = new HPaletteController(doc, {
            value: this.value,
            viewProps: this.viewProps,
        });
        this.svPaletteC_ = new SvPaletteController(doc, {
            value: this.value,
            viewProps: this.viewProps,
        });
        this.alphaIcs_ = config.supportsAlpha
            ? {
                palette: new APaletteController(doc, {
                    value: this.value,
                    viewProps: this.viewProps,
                }),
                text: new NumberTextController(doc, {
                    parser: parseNumber,
                    props: ValueMap.fromObject({
                        pointerScale: 0.01,
                        keyScale: 0.1,
                        formatter: createNumberFormatter(2),
                    }),
                    value: createValue(0, {
                        constraint: new DefiniteRangeConstraint({ min: 0, max: 1 }),
                    }),
                    viewProps: this.viewProps,
                }),
            }
            : null;
        if (this.alphaIcs_) {
            connectValues({
                primary: this.value,
                secondary: this.alphaIcs_.text.value,
                forward: (p) => p.getComponents()[3],
                backward: (p, s) => {
                    const comps = p.getComponents();
                    comps[3] = s;
                    return new IntColor(comps, p.mode);
                },
            });
        }
        this.textsC_ = new ColorTextsController(doc, {
            colorType: config.colorType,
            value: this.value,
            viewProps: this.viewProps,
        });
        this.view = new ColorPickerView(doc, {
            alphaViews: this.alphaIcs_
                ? {
                    palette: this.alphaIcs_.palette.view,
                    text: this.alphaIcs_.text.view,
                }
                : null,
            hPaletteView: this.hPaletteC_.view,
            supportsAlpha: config.supportsAlpha,
            svPaletteView: this.svPaletteC_.view,
            textsView: this.textsC_.view,
            viewProps: this.viewProps,
        });
    }
    get textsController() {
        return this.textsC_;
    }
}

const cn$7 = ClassName('colsw');
class ColorSwatchView {
    constructor(doc, config) {
        this.onValueChange_ = this.onValueChange_.bind(this);
        config.value.emitter.on('change', this.onValueChange_);
        this.value = config.value;
        this.element = doc.createElement('div');
        this.element.classList.add(cn$7());
        config.viewProps.bindClassModifiers(this.element);
        const swatchElem = doc.createElement('div');
        swatchElem.classList.add(cn$7('sw'));
        this.element.appendChild(swatchElem);
        this.swatchElem_ = swatchElem;
        const buttonElem = doc.createElement('button');
        buttonElem.classList.add(cn$7('b'));
        config.viewProps.bindDisabled(buttonElem);
        this.element.appendChild(buttonElem);
        this.buttonElement = buttonElem;
        this.update_();
    }
    update_() {
        const value = this.value.rawValue;
        this.swatchElem_.style.backgroundColor = colorToHexRgbaString(value);
    }
    onValueChange_() {
        this.update_();
    }
}

class ColorSwatchController {
    constructor(doc, config) {
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new ColorSwatchView(doc, {
            value: this.value,
            viewProps: this.viewProps,
        });
    }
}

class ColorController {
    constructor(doc, config) {
        this.onButtonBlur_ = this.onButtonBlur_.bind(this);
        this.onButtonClick_ = this.onButtonClick_.bind(this);
        this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this);
        this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this);
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.foldable_ = Foldable.create(config.expanded);
        this.swatchC_ = new ColorSwatchController(doc, {
            value: this.value,
            viewProps: this.viewProps,
        });
        const buttonElem = this.swatchC_.view.buttonElement;
        buttonElem.addEventListener('blur', this.onButtonBlur_);
        buttonElem.addEventListener('click', this.onButtonClick_);
        this.textC_ = new TextController(doc, {
            parser: config.parser,
            props: ValueMap.fromObject({
                formatter: config.formatter,
            }),
            value: this.value,
            viewProps: this.viewProps,
        });
        this.view = new ColorView(doc, {
            foldable: this.foldable_,
            pickerLayout: config.pickerLayout,
        });
        this.view.swatchElement.appendChild(this.swatchC_.view.element);
        this.view.textElement.appendChild(this.textC_.view.element);
        this.popC_ =
            config.pickerLayout === 'popup'
                ? new PopupController(doc, {
                    viewProps: this.viewProps,
                })
                : null;
        const pickerC = new ColorPickerController(doc, {
            colorType: config.colorType,
            supportsAlpha: config.supportsAlpha,
            value: this.value,
            viewProps: this.viewProps,
        });
        pickerC.view.allFocusableElements.forEach((elem) => {
            elem.addEventListener('blur', this.onPopupChildBlur_);
            elem.addEventListener('keydown', this.onPopupChildKeydown_);
        });
        this.pickerC_ = pickerC;
        if (this.popC_) {
            this.view.element.appendChild(this.popC_.view.element);
            this.popC_.view.element.appendChild(pickerC.view.element);
            connectValues({
                primary: this.foldable_.value('expanded'),
                secondary: this.popC_.shows,
                forward: (p) => p,
                backward: (_, s) => s,
            });
        }
        else if (this.view.pickerElement) {
            this.view.pickerElement.appendChild(this.pickerC_.view.element);
            bindFoldable(this.foldable_, this.view.pickerElement);
        }
    }
    get textController() {
        return this.textC_;
    }
    onButtonBlur_(e) {
        if (!this.popC_) {
            return;
        }
        const elem = this.view.element;
        const nextTarget = forceCast(e.relatedTarget);
        if (!nextTarget || !elem.contains(nextTarget)) {
            this.popC_.shows.rawValue = false;
        }
    }
    onButtonClick_() {
        this.foldable_.set('expanded', !this.foldable_.get('expanded'));
        if (this.foldable_.get('expanded')) {
            this.pickerC_.view.allFocusableElements[0].focus();
        }
    }
    onPopupChildBlur_(ev) {
        if (!this.popC_) {
            return;
        }
        const elem = this.popC_.view.element;
        const nextTarget = findNextTarget(ev);
        if (nextTarget && elem.contains(nextTarget)) {
            return;
        }
        if (nextTarget &&
            nextTarget === this.swatchC_.view.buttonElement &&
            !supportsTouch(elem.ownerDocument)) {
            return;
        }
        this.popC_.shows.rawValue = false;
    }
    onPopupChildKeydown_(ev) {
        if (this.popC_) {
            if (ev.key === 'Escape') {
                this.popC_.shows.rawValue = false;
            }
        }
        else if (this.view.pickerElement) {
            if (ev.key === 'Escape') {
                this.swatchC_.view.buttonElement.focus();
            }
        }
    }
}

function colorToRgbNumber(value) {
    return removeAlphaComponent(value.getComponents('rgb')).reduce((result, comp) => {
        return (result << 8) | (Math.floor(comp) & 0xff);
    }, 0);
}
function colorToRgbaNumber(value) {
    return (value.getComponents('rgb').reduce((result, comp, index) => {
        const hex = Math.floor(index === 3 ? comp * 255 : comp) & 0xff;
        return (result << 8) | hex;
    }, 0) >>> 0);
}
function numberToRgbColor(num) {
    return new IntColor([(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff], 'rgb');
}
function numberToRgbaColor(num) {
    return new IntColor([
        (num >> 24) & 0xff,
        (num >> 16) & 0xff,
        (num >> 8) & 0xff,
        mapRange(num & 0xff, 0, 255, 0, 1),
    ], 'rgb');
}
function colorFromRgbNumber(value) {
    if (typeof value !== 'number') {
        return IntColor.black();
    }
    return numberToRgbColor(value);
}
function colorFromRgbaNumber(value) {
    if (typeof value !== 'number') {
        return IntColor.black();
    }
    return numberToRgbaColor(value);
}

function isRgbColorComponent(obj, key) {
    if (typeof obj !== 'object' || isEmpty(obj)) {
        return false;
    }
    return key in obj && typeof obj[key] === 'number';
}
function isRgbColorObject(obj) {
    return (isRgbColorComponent(obj, 'r') &&
        isRgbColorComponent(obj, 'g') &&
        isRgbColorComponent(obj, 'b'));
}
function isRgbaColorObject(obj) {
    return isRgbColorObject(obj) && isRgbColorComponent(obj, 'a');
}
function isColorObject(obj) {
    return isRgbColorObject(obj);
}
function equalsColor(v1, v2) {
    if (v1.mode !== v2.mode) {
        return false;
    }
    if (v1.type !== v2.type) {
        return false;
    }
    const comps1 = v1.getComponents();
    const comps2 = v2.getComponents();
    for (let i = 0; i < comps1.length; i++) {
        if (comps1[i] !== comps2[i]) {
            return false;
        }
    }
    return true;
}
function createColorComponentsFromRgbObject(obj) {
    return 'a' in obj ? [obj.r, obj.g, obj.b, obj.a] : [obj.r, obj.g, obj.b];
}

function createColorStringWriter(format) {
    const stringify = findColorStringifier(format);
    return stringify
        ? (target, value) => {
            writePrimitive(target, stringify(value));
        }
        : null;
}
function createColorNumberWriter(supportsAlpha) {
    const colorToNumber = supportsAlpha ? colorToRgbaNumber : colorToRgbNumber;
    return (target, value) => {
        writePrimitive(target, colorToNumber(value));
    };
}
function writeRgbaColorObject(target, value, type) {
    const cc = mapColorType(value, type);
    const obj = cc.toRgbaObject();
    target.writeProperty('r', obj.r);
    target.writeProperty('g', obj.g);
    target.writeProperty('b', obj.b);
    target.writeProperty('a', obj.a);
}
function writeRgbColorObject(target, value, type) {
    const cc = mapColorType(value, type);
    const obj = cc.toRgbaObject();
    target.writeProperty('r', obj.r);
    target.writeProperty('g', obj.g);
    target.writeProperty('b', obj.b);
}
function createColorObjectWriter(supportsAlpha, type) {
    return (target, inValue) => {
        if (supportsAlpha) {
            writeRgbaColorObject(target, inValue, type);
        }
        else {
            writeRgbColorObject(target, inValue, type);
        }
    };
}

function shouldSupportAlpha$1(inputParams) {
    var _a;
    if ((_a = inputParams === null || inputParams === void 0 ? void 0 : inputParams.color) === null || _a === void 0 ? void 0 : _a.alpha) {
        return true;
    }
    return false;
}
function createFormatter$1(supportsAlpha) {
    return supportsAlpha
        ? (v) => colorToHexRgbaString(v, '0x')
        : (v) => colorToHexRgbString(v, '0x');
}
function isForColor(params) {
    if ('color' in params) {
        return true;
    }
    if (params.view === 'color') {
        return true;
    }
    return false;
}
const NumberColorInputPlugin = createPlugin({
    id: 'input-color-number',
    type: 'input',
    accept: (value, params) => {
        if (typeof value !== 'number') {
            return null;
        }
        if (!isForColor(params)) {
            return null;
        }
        const result = parseColorInputParams(params);
        return result
            ? {
                initialValue: value,
                params: Object.assign(Object.assign({}, result), { supportsAlpha: shouldSupportAlpha$1(params) }),
            }
            : null;
    },
    binding: {
        reader: (args) => {
            return args.params.supportsAlpha
                ? colorFromRgbaNumber
                : colorFromRgbNumber;
        },
        equals: equalsColor,
        writer: (args) => {
            return createColorNumberWriter(args.params.supportsAlpha);
        },
    },
    controller: (args) => {
        var _a, _b;
        return new ColorController(args.document, {
            colorType: 'int',
            expanded: (_a = args.params.expanded) !== null && _a !== void 0 ? _a : false,
            formatter: createFormatter$1(args.params.supportsAlpha),
            parser: createColorStringParser('int'),
            pickerLayout: (_b = args.params.picker) !== null && _b !== void 0 ? _b : 'popup',
            supportsAlpha: args.params.supportsAlpha,
            value: args.value,
            viewProps: args.viewProps,
        });
    },
});

function colorFromObject(value, type) {
    if (!isColorObject(value)) {
        return mapColorType(IntColor.black(), type);
    }
    if (type === 'int') {
        const comps = createColorComponentsFromRgbObject(value);
        return new IntColor(comps, 'rgb');
    }
    if (type === 'float') {
        const comps = createColorComponentsFromRgbObject(value);
        return new FloatColor(comps, 'rgb');
    }
    return mapColorType(IntColor.black(), 'int');
}

function shouldSupportAlpha(initialValue) {
    return isRgbaColorObject(initialValue);
}
function createColorObjectBindingReader(type) {
    return (value) => {
        const c = colorFromObject(value, type);
        return mapColorType(c, 'int');
    };
}
function createColorObjectFormatter(supportsAlpha, type) {
    return (value) => {
        if (supportsAlpha) {
            return colorToObjectRgbaString(value, type);
        }
        return colorToObjectRgbString(value, type);
    };
}
const ObjectColorInputPlugin = createPlugin({
    id: 'input-color-object',
    type: 'input',
    accept: (value, params) => {
        var _a;
        if (!isColorObject(value)) {
            return null;
        }
        const result = parseColorInputParams(params);
        return result
            ? {
                initialValue: value,
                params: Object.assign(Object.assign({}, result), { colorType: (_a = extractColorType(params)) !== null && _a !== void 0 ? _a : 'int' }),
            }
            : null;
    },
    binding: {
        reader: (args) => createColorObjectBindingReader(args.params.colorType),
        equals: equalsColor,
        writer: (args) => createColorObjectWriter(shouldSupportAlpha(args.initialValue), args.params.colorType),
    },
    controller: (args) => {
        var _a, _b;
        const supportsAlpha = isRgbaColorObject(args.initialValue);
        return new ColorController(args.document, {
            colorType: args.params.colorType,
            expanded: (_a = args.params.expanded) !== null && _a !== void 0 ? _a : false,
            formatter: createColorObjectFormatter(supportsAlpha, args.params.colorType),
            parser: createColorStringParser('int'),
            pickerLayout: (_b = args.params.picker) !== null && _b !== void 0 ? _b : 'popup',
            supportsAlpha: supportsAlpha,
            value: args.value,
            viewProps: args.viewProps,
        });
    },
});

const StringColorInputPlugin = createPlugin({
    id: 'input-color-string',
    type: 'input',
    accept: (value, params) => {
        if (typeof value !== 'string') {
            return null;
        }
        if (params.view === 'text') {
            return null;
        }
        const format = detectStringColorFormat(value, extractColorType(params));
        if (!format) {
            return null;
        }
        const stringifier = findColorStringifier(format);
        if (!stringifier) {
            return null;
        }
        const result = parseColorInputParams(params);
        return result
            ? {
                initialValue: value,
                params: Object.assign(Object.assign({}, result), { format: format, stringifier: stringifier }),
            }
            : null;
    },
    binding: {
        reader: () => readIntColorString,
        equals: equalsColor,
        writer: (args) => {
            const writer = createColorStringWriter(args.params.format);
            if (!writer) {
                throw TpError.notBindable();
            }
            return writer;
        },
    },
    controller: (args) => {
        var _a, _b;
        return new ColorController(args.document, {
            colorType: args.params.format.type,
            expanded: (_a = args.params.expanded) !== null && _a !== void 0 ? _a : false,
            formatter: args.params.stringifier,
            parser: createColorStringParser('int'),
            pickerLayout: (_b = args.params.picker) !== null && _b !== void 0 ? _b : 'popup',
            supportsAlpha: args.params.format.alpha,
            value: args.value,
            viewProps: args.viewProps,
        });
    },
});

class PointNdConstraint {
    constructor(config) {
        this.components = config.components;
        this.asm_ = config.assembly;
    }
    constrain(value) {
        const comps = this.asm_
            .toComponents(value)
            .map((comp, index) => { var _a, _b; return (_b = (_a = this.components[index]) === null || _a === void 0 ? void 0 : _a.constrain(comp)) !== null && _b !== void 0 ? _b : comp; });
        return this.asm_.fromComponents(comps);
    }
}

const cn$6 = ClassName('pndtxt');
class PointNdTextView {
    constructor(doc, config) {
        this.textViews = config.textViews;
        this.element = doc.createElement('div');
        this.element.classList.add(cn$6());
        this.textViews.forEach((v) => {
            const axisElem = doc.createElement('div');
            axisElem.classList.add(cn$6('a'));
            axisElem.appendChild(v.element);
            this.element.appendChild(axisElem);
        });
    }
}

function createAxisController(doc, config, index) {
    return new NumberTextController(doc, {
        arrayPosition: index === 0 ? 'fst' : index === config.axes.length - 1 ? 'lst' : 'mid',
        parser: config.parser,
        props: config.axes[index].textProps,
        value: createValue(0, {
            constraint: config.axes[index].constraint,
        }),
        viewProps: config.viewProps,
    });
}
class PointNdTextController {
    constructor(doc, config) {
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.acs_ = config.axes.map((_, index) => createAxisController(doc, config, index));
        this.acs_.forEach((c, index) => {
            connectValues({
                primary: this.value,
                secondary: c.value,
                forward: (p) => config.assembly.toComponents(p)[index],
                backward: (p, s) => {
                    const comps = config.assembly.toComponents(p);
                    comps[index] = s;
                    return config.assembly.fromComponents(comps);
                },
            });
        });
        this.view = new PointNdTextView(doc, {
            textViews: this.acs_.map((ac) => ac.view),
        });
    }
    get textControllers() {
        return this.acs_;
    }
}

class SliderInputBindingApi extends BindingApi {
    get max() {
        return this.controller.valueController.sliderController.props.get('max');
    }
    set max(max) {
        this.controller.valueController.sliderController.props.set('max', max);
    }
    get min() {
        return this.controller.valueController.sliderController.props.get('min');
    }
    set min(max) {
        this.controller.valueController.sliderController.props.set('min', max);
    }
}

function createConstraint$4(params, initialValue) {
    const constraints = [];
    const sc = createStepConstraint(params, initialValue);
    if (sc) {
        constraints.push(sc);
    }
    const rc = createRangeConstraint(params);
    if (rc) {
        constraints.push(rc);
    }
    const lc = createListConstraint(params.options);
    if (lc) {
        constraints.push(lc);
    }
    return new CompositeConstraint(constraints);
}
const NumberInputPlugin = createPlugin({
    id: 'input-number',
    type: 'input',
    accept: (value, params) => {
        if (typeof value !== 'number') {
            return null;
        }
        const result = parseRecord(params, (p) => (Object.assign(Object.assign({}, createNumberTextInputParamsParser(p)), { options: p.optional.custom(parseListOptions), readonly: p.optional.constant(false) })));
        return result
            ? {
                initialValue: value,
                params: result,
            }
            : null;
    },
    binding: {
        reader: (_args) => numberFromUnknown,
        constraint: (args) => createConstraint$4(args.params, args.initialValue),
        writer: (_args) => writePrimitive,
    },
    controller: (args) => {
        const value = args.value;
        const c = args.constraint;
        const lc = c && findConstraint(c, ListConstraint);
        if (lc) {
            return new ListController(args.document, {
                props: new ValueMap({
                    options: lc.values.value('options'),
                }),
                value: value,
                viewProps: args.viewProps,
            });
        }
        const textPropsObj = createNumberTextPropsObject(args.params, value.rawValue);
        const drc = c && findConstraint(c, DefiniteRangeConstraint);
        if (drc) {
            return new SliderTextController(args.document, Object.assign(Object.assign({}, createSliderTextProps(Object.assign(Object.assign({}, textPropsObj), { keyScale: createValue(textPropsObj.keyScale), max: drc.values.value('max'), min: drc.values.value('min') }))), { parser: parseNumber, value: value, viewProps: args.viewProps }));
        }
        return new NumberTextController(args.document, {
            parser: parseNumber,
            props: ValueMap.fromObject(textPropsObj),
            value: value,
            viewProps: args.viewProps,
        });
    },
    api(args) {
        if (typeof args.controller.value.rawValue !== 'number') {
            return null;
        }
        if (args.controller.valueController instanceof SliderTextController) {
            return new SliderInputBindingApi(args.controller);
        }
        if (args.controller.valueController instanceof ListController) {
            return new ListInputBindingApi(args.controller);
        }
        return null;
    },
});

class Point2d {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    getComponents() {
        return [this.x, this.y];
    }
    static isObject(obj) {
        if (isEmpty(obj)) {
            return false;
        }
        const x = obj.x;
        const y = obj.y;
        if (typeof x !== 'number' || typeof y !== 'number') {
            return false;
        }
        return true;
    }
    static equals(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y;
    }
    toObject() {
        return {
            x: this.x,
            y: this.y,
        };
    }
}
const Point2dAssembly = {
    toComponents: (p) => p.getComponents(),
    fromComponents: (comps) => new Point2d(...comps),
};

const cn$5 = ClassName('p2d');
class Point2dView {
    constructor(doc, config) {
        this.element = doc.createElement('div');
        this.element.classList.add(cn$5());
        config.viewProps.bindClassModifiers(this.element);
        bindValue(config.expanded, valueToClassName(this.element, cn$5(undefined, 'expanded')));
        const headElem = doc.createElement('div');
        headElem.classList.add(cn$5('h'));
        this.element.appendChild(headElem);
        const buttonElem = doc.createElement('button');
        buttonElem.classList.add(cn$5('b'));
        buttonElem.appendChild(createSvgIconElement(doc, 'p2dpad'));
        config.viewProps.bindDisabled(buttonElem);
        headElem.appendChild(buttonElem);
        this.buttonElement = buttonElem;
        const textElem = doc.createElement('div');
        textElem.classList.add(cn$5('t'));
        headElem.appendChild(textElem);
        this.textElement = textElem;
        if (config.pickerLayout === 'inline') {
            const pickerElem = doc.createElement('div');
            pickerElem.classList.add(cn$5('p'));
            this.element.appendChild(pickerElem);
            this.pickerElement = pickerElem;
        }
        else {
            this.pickerElement = null;
        }
    }
}

const cn$4 = ClassName('p2dp');
class Point2dPickerView {
    constructor(doc, config) {
        this.onFoldableChange_ = this.onFoldableChange_.bind(this);
        this.onPropsChange_ = this.onPropsChange_.bind(this);
        this.onValueChange_ = this.onValueChange_.bind(this);
        this.props_ = config.props;
        this.props_.emitter.on('change', this.onPropsChange_);
        this.element = doc.createElement('div');
        this.element.classList.add(cn$4());
        if (config.layout === 'popup') {
            this.element.classList.add(cn$4(undefined, 'p'));
        }
        config.viewProps.bindClassModifiers(this.element);
        const padElem = doc.createElement('div');
        padElem.classList.add(cn$4('p'));
        config.viewProps.bindTabIndex(padElem);
        this.element.appendChild(padElem);
        this.padElement = padElem;
        const svgElem = doc.createElementNS(SVG_NS, 'svg');
        svgElem.classList.add(cn$4('g'));
        this.padElement.appendChild(svgElem);
        this.svgElem_ = svgElem;
        const xAxisElem = doc.createElementNS(SVG_NS, 'line');
        xAxisElem.classList.add(cn$4('ax'));
        xAxisElem.setAttributeNS(null, 'x1', '0');
        xAxisElem.setAttributeNS(null, 'y1', '50%');
        xAxisElem.setAttributeNS(null, 'x2', '100%');
        xAxisElem.setAttributeNS(null, 'y2', '50%');
        this.svgElem_.appendChild(xAxisElem);
        const yAxisElem = doc.createElementNS(SVG_NS, 'line');
        yAxisElem.classList.add(cn$4('ax'));
        yAxisElem.setAttributeNS(null, 'x1', '50%');
        yAxisElem.setAttributeNS(null, 'y1', '0');
        yAxisElem.setAttributeNS(null, 'x2', '50%');
        yAxisElem.setAttributeNS(null, 'y2', '100%');
        this.svgElem_.appendChild(yAxisElem);
        const lineElem = doc.createElementNS(SVG_NS, 'line');
        lineElem.classList.add(cn$4('l'));
        lineElem.setAttributeNS(null, 'x1', '50%');
        lineElem.setAttributeNS(null, 'y1', '50%');
        this.svgElem_.appendChild(lineElem);
        this.lineElem_ = lineElem;
        const markerElem = doc.createElement('div');
        markerElem.classList.add(cn$4('m'));
        this.padElement.appendChild(markerElem);
        this.markerElem_ = markerElem;
        config.value.emitter.on('change', this.onValueChange_);
        this.value = config.value;
        this.update_();
    }
    get allFocusableElements() {
        return [this.padElement];
    }
    update_() {
        const [x, y] = this.value.rawValue.getComponents();
        const max = this.props_.get('max');
        const px = mapRange(x, -max, +max, 0, 100);
        const py = mapRange(y, -max, +max, 0, 100);
        const ipy = this.props_.get('invertsY') ? 100 - py : py;
        this.lineElem_.setAttributeNS(null, 'x2', `${px}%`);
        this.lineElem_.setAttributeNS(null, 'y2', `${ipy}%`);
        this.markerElem_.style.left = `${px}%`;
        this.markerElem_.style.top = `${ipy}%`;
    }
    onValueChange_() {
        this.update_();
    }
    onPropsChange_() {
        this.update_();
    }
    onFoldableChange_() {
        this.update_();
    }
}

function computeOffset(ev, keyScales, invertsY) {
    return [
        getStepForKey(keyScales[0], getHorizontalStepKeys(ev)),
        getStepForKey(keyScales[1], getVerticalStepKeys(ev)) * (invertsY ? 1 : -1),
    ];
}
class Point2dPickerController {
    constructor(doc, config) {
        this.onPadKeyDown_ = this.onPadKeyDown_.bind(this);
        this.onPadKeyUp_ = this.onPadKeyUp_.bind(this);
        this.onPointerDown_ = this.onPointerDown_.bind(this);
        this.onPointerMove_ = this.onPointerMove_.bind(this);
        this.onPointerUp_ = this.onPointerUp_.bind(this);
        this.props = config.props;
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new Point2dPickerView(doc, {
            layout: config.layout,
            props: this.props,
            value: this.value,
            viewProps: this.viewProps,
        });
        this.ptHandler_ = new PointerHandler(this.view.padElement);
        this.ptHandler_.emitter.on('down', this.onPointerDown_);
        this.ptHandler_.emitter.on('move', this.onPointerMove_);
        this.ptHandler_.emitter.on('up', this.onPointerUp_);
        this.view.padElement.addEventListener('keydown', this.onPadKeyDown_);
        this.view.padElement.addEventListener('keyup', this.onPadKeyUp_);
    }
    handlePointerEvent_(d, opts) {
        if (!d.point) {
            return;
        }
        const max = this.props.get('max');
        const px = mapRange(d.point.x, 0, d.bounds.width, -max, +max);
        const py = mapRange(this.props.get('invertsY') ? d.bounds.height - d.point.y : d.point.y, 0, d.bounds.height, -max, +max);
        this.value.setRawValue(new Point2d(px, py), opts);
    }
    onPointerDown_(ev) {
        this.handlePointerEvent_(ev.data, {
            forceEmit: false,
            last: false,
        });
    }
    onPointerMove_(ev) {
        this.handlePointerEvent_(ev.data, {
            forceEmit: false,
            last: false,
        });
    }
    onPointerUp_(ev) {
        this.handlePointerEvent_(ev.data, {
            forceEmit: true,
            last: true,
        });
    }
    onPadKeyDown_(ev) {
        if (isArrowKey(ev.key)) {
            ev.preventDefault();
        }
        const [dx, dy] = computeOffset(ev, [this.props.get('xKeyScale'), this.props.get('yKeyScale')], this.props.get('invertsY'));
        if (dx === 0 && dy === 0) {
            return;
        }
        this.value.setRawValue(new Point2d(this.value.rawValue.x + dx, this.value.rawValue.y + dy), {
            forceEmit: false,
            last: false,
        });
    }
    onPadKeyUp_(ev) {
        const [dx, dy] = computeOffset(ev, [this.props.get('xKeyScale'), this.props.get('yKeyScale')], this.props.get('invertsY'));
        if (dx === 0 && dy === 0) {
            return;
        }
        this.value.setRawValue(this.value.rawValue, {
            forceEmit: true,
            last: true,
        });
    }
}

class Point2dController {
    constructor(doc, config) {
        var _a, _b;
        this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this);
        this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this);
        this.onPadButtonBlur_ = this.onPadButtonBlur_.bind(this);
        this.onPadButtonClick_ = this.onPadButtonClick_.bind(this);
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.foldable_ = Foldable.create(config.expanded);
        this.popC_ =
            config.pickerLayout === 'popup'
                ? new PopupController(doc, {
                    viewProps: this.viewProps,
                })
                : null;
        const padC = new Point2dPickerController(doc, {
            layout: config.pickerLayout,
            props: new ValueMap({
                invertsY: createValue(config.invertsY),
                max: createValue(config.max),
                xKeyScale: config.axes[0].textProps.value('keyScale'),
                yKeyScale: config.axes[1].textProps.value('keyScale'),
            }),
            value: this.value,
            viewProps: this.viewProps,
        });
        padC.view.allFocusableElements.forEach((elem) => {
            elem.addEventListener('blur', this.onPopupChildBlur_);
            elem.addEventListener('keydown', this.onPopupChildKeydown_);
        });
        this.pickerC_ = padC;
        this.textC_ = new PointNdTextController(doc, {
            assembly: Point2dAssembly,
            axes: config.axes,
            parser: config.parser,
            value: this.value,
            viewProps: this.viewProps,
        });
        this.view = new Point2dView(doc, {
            expanded: this.foldable_.value('expanded'),
            pickerLayout: config.pickerLayout,
            viewProps: this.viewProps,
        });
        this.view.textElement.appendChild(this.textC_.view.element);
        (_a = this.view.buttonElement) === null || _a === void 0 ? void 0 : _a.addEventListener('blur', this.onPadButtonBlur_);
        (_b = this.view.buttonElement) === null || _b === void 0 ? void 0 : _b.addEventListener('click', this.onPadButtonClick_);
        if (this.popC_) {
            this.view.element.appendChild(this.popC_.view.element);
            this.popC_.view.element.appendChild(this.pickerC_.view.element);
            connectValues({
                primary: this.foldable_.value('expanded'),
                secondary: this.popC_.shows,
                forward: (p) => p,
                backward: (_, s) => s,
            });
        }
        else if (this.view.pickerElement) {
            this.view.pickerElement.appendChild(this.pickerC_.view.element);
            bindFoldable(this.foldable_, this.view.pickerElement);
        }
    }
    get textController() {
        return this.textC_;
    }
    onPadButtonBlur_(e) {
        if (!this.popC_) {
            return;
        }
        const elem = this.view.element;
        const nextTarget = forceCast(e.relatedTarget);
        if (!nextTarget || !elem.contains(nextTarget)) {
            this.popC_.shows.rawValue = false;
        }
    }
    onPadButtonClick_() {
        this.foldable_.set('expanded', !this.foldable_.get('expanded'));
        if (this.foldable_.get('expanded')) {
            this.pickerC_.view.allFocusableElements[0].focus();
        }
    }
    onPopupChildBlur_(ev) {
        if (!this.popC_) {
            return;
        }
        const elem = this.popC_.view.element;
        const nextTarget = findNextTarget(ev);
        if (nextTarget && elem.contains(nextTarget)) {
            return;
        }
        if (nextTarget &&
            nextTarget === this.view.buttonElement &&
            !supportsTouch(elem.ownerDocument)) {
            return;
        }
        this.popC_.shows.rawValue = false;
    }
    onPopupChildKeydown_(ev) {
        if (this.popC_) {
            if (ev.key === 'Escape') {
                this.popC_.shows.rawValue = false;
            }
        }
        else if (this.view.pickerElement) {
            if (ev.key === 'Escape') {
                this.view.buttonElement.focus();
            }
        }
    }
}

function point2dFromUnknown(value) {
    return Point2d.isObject(value)
        ? new Point2d(value.x, value.y)
        : new Point2d();
}
function writePoint2d(target, value) {
    target.writeProperty('x', value.x);
    target.writeProperty('y', value.y);
}

function createConstraint$3(params, initialValue) {
    return new PointNdConstraint({
        assembly: Point2dAssembly,
        components: [
            createDimensionConstraint(Object.assign(Object.assign({}, params), params.x), initialValue.x),
            createDimensionConstraint(Object.assign(Object.assign({}, params), params.y), initialValue.y),
        ],
    });
}
function getSuitableMaxDimensionValue(params, rawValue) {
    var _a, _b;
    if (!isEmpty(params.min) || !isEmpty(params.max)) {
        return Math.max(Math.abs((_a = params.min) !== null && _a !== void 0 ? _a : 0), Math.abs((_b = params.max) !== null && _b !== void 0 ? _b : 0));
    }
    const step = getSuitableKeyScale(params);
    return Math.max(Math.abs(step) * 10, Math.abs(rawValue) * 10);
}
function getSuitableMax(params, initialValue) {
    var _a, _b;
    const xr = getSuitableMaxDimensionValue(deepMerge(params, ((_a = params.x) !== null && _a !== void 0 ? _a : {})), initialValue.x);
    const yr = getSuitableMaxDimensionValue(deepMerge(params, ((_b = params.y) !== null && _b !== void 0 ? _b : {})), initialValue.y);
    return Math.max(xr, yr);
}
function shouldInvertY(params) {
    if (!('y' in params)) {
        return false;
    }
    const yParams = params.y;
    if (!yParams) {
        return false;
    }
    return 'inverted' in yParams ? !!yParams.inverted : false;
}
const Point2dInputPlugin = createPlugin({
    id: 'input-point2d',
    type: 'input',
    accept: (value, params) => {
        if (!Point2d.isObject(value)) {
            return null;
        }
        const result = parseRecord(params, (p) => (Object.assign(Object.assign({}, createPointDimensionParser(p)), { expanded: p.optional.boolean, picker: p.optional.custom(parsePickerLayout), readonly: p.optional.constant(false), x: p.optional.custom(parsePointDimensionParams), y: p.optional.object(Object.assign(Object.assign({}, createPointDimensionParser(p)), { inverted: p.optional.boolean })) })));
        return result
            ? {
                initialValue: value,
                params: result,
            }
            : null;
    },
    binding: {
        reader: () => point2dFromUnknown,
        constraint: (args) => createConstraint$3(args.params, args.initialValue),
        equals: Point2d.equals,
        writer: () => writePoint2d,
    },
    controller: (args) => {
        var _a, _b;
        const doc = args.document;
        const value = args.value;
        const c = args.constraint;
        const dParams = [args.params.x, args.params.y];
        return new Point2dController(doc, {
            axes: value.rawValue.getComponents().map((comp, i) => {
                var _a;
                return createPointAxis({
                    constraint: c.components[i],
                    initialValue: comp,
                    params: deepMerge(args.params, ((_a = dParams[i]) !== null && _a !== void 0 ? _a : {})),
                });
            }),
            expanded: (_a = args.params.expanded) !== null && _a !== void 0 ? _a : false,
            invertsY: shouldInvertY(args.params),
            max: getSuitableMax(args.params, value.rawValue),
            parser: parseNumber,
            pickerLayout: (_b = args.params.picker) !== null && _b !== void 0 ? _b : 'popup',
            value: value,
            viewProps: args.viewProps,
        });
    },
});

class Point3d {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    getComponents() {
        return [this.x, this.y, this.z];
    }
    static isObject(obj) {
        if (isEmpty(obj)) {
            return false;
        }
        const x = obj.x;
        const y = obj.y;
        const z = obj.z;
        if (typeof x !== 'number' ||
            typeof y !== 'number' ||
            typeof z !== 'number') {
            return false;
        }
        return true;
    }
    static equals(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
    }
    toObject() {
        return {
            x: this.x,
            y: this.y,
            z: this.z,
        };
    }
}
const Point3dAssembly = {
    toComponents: (p) => p.getComponents(),
    fromComponents: (comps) => new Point3d(...comps),
};

function point3dFromUnknown(value) {
    return Point3d.isObject(value)
        ? new Point3d(value.x, value.y, value.z)
        : new Point3d();
}
function writePoint3d(target, value) {
    target.writeProperty('x', value.x);
    target.writeProperty('y', value.y);
    target.writeProperty('z', value.z);
}

function createConstraint$2(params, initialValue) {
    return new PointNdConstraint({
        assembly: Point3dAssembly,
        components: [
            createDimensionConstraint(Object.assign(Object.assign({}, params), params.x), initialValue.x),
            createDimensionConstraint(Object.assign(Object.assign({}, params), params.y), initialValue.y),
            createDimensionConstraint(Object.assign(Object.assign({}, params), params.z), initialValue.z),
        ],
    });
}
const Point3dInputPlugin = createPlugin({
    id: 'input-point3d',
    type: 'input',
    accept: (value, params) => {
        if (!Point3d.isObject(value)) {
            return null;
        }
        const result = parseRecord(params, (p) => (Object.assign(Object.assign({}, createPointDimensionParser(p)), { readonly: p.optional.constant(false), x: p.optional.custom(parsePointDimensionParams), y: p.optional.custom(parsePointDimensionParams), z: p.optional.custom(parsePointDimensionParams) })));
        return result
            ? {
                initialValue: value,
                params: result,
            }
            : null;
    },
    binding: {
        reader: (_args) => point3dFromUnknown,
        constraint: (args) => createConstraint$2(args.params, args.initialValue),
        equals: Point3d.equals,
        writer: (_args) => writePoint3d,
    },
    controller: (args) => {
        const value = args.value;
        const c = args.constraint;
        const dParams = [args.params.x, args.params.y, args.params.z];
        return new PointNdTextController(args.document, {
            assembly: Point3dAssembly,
            axes: value.rawValue.getComponents().map((comp, i) => {
                var _a;
                return createPointAxis({
                    constraint: c.components[i],
                    initialValue: comp,
                    params: deepMerge(args.params, ((_a = dParams[i]) !== null && _a !== void 0 ? _a : {})),
                });
            }),
            parser: parseNumber,
            value: value,
            viewProps: args.viewProps,
        });
    },
});

class Point4d {
    constructor(x = 0, y = 0, z = 0, w = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    getComponents() {
        return [this.x, this.y, this.z, this.w];
    }
    static isObject(obj) {
        if (isEmpty(obj)) {
            return false;
        }
        const x = obj.x;
        const y = obj.y;
        const z = obj.z;
        const w = obj.w;
        if (typeof x !== 'number' ||
            typeof y !== 'number' ||
            typeof z !== 'number' ||
            typeof w !== 'number') {
            return false;
        }
        return true;
    }
    static equals(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z && v1.w === v2.w;
    }
    toObject() {
        return {
            x: this.x,
            y: this.y,
            z: this.z,
            w: this.w,
        };
    }
}
const Point4dAssembly = {
    toComponents: (p) => p.getComponents(),
    fromComponents: (comps) => new Point4d(...comps),
};

function point4dFromUnknown(value) {
    return Point4d.isObject(value)
        ? new Point4d(value.x, value.y, value.z, value.w)
        : new Point4d();
}
function writePoint4d(target, value) {
    target.writeProperty('x', value.x);
    target.writeProperty('y', value.y);
    target.writeProperty('z', value.z);
    target.writeProperty('w', value.w);
}

function createConstraint$1(params, initialValue) {
    return new PointNdConstraint({
        assembly: Point4dAssembly,
        components: [
            createDimensionConstraint(Object.assign(Object.assign({}, params), params.x), initialValue.x),
            createDimensionConstraint(Object.assign(Object.assign({}, params), params.y), initialValue.y),
            createDimensionConstraint(Object.assign(Object.assign({}, params), params.z), initialValue.z),
            createDimensionConstraint(Object.assign(Object.assign({}, params), params.w), initialValue.w),
        ],
    });
}
const Point4dInputPlugin = createPlugin({
    id: 'input-point4d',
    type: 'input',
    accept: (value, params) => {
        if (!Point4d.isObject(value)) {
            return null;
        }
        const result = parseRecord(params, (p) => (Object.assign(Object.assign({}, createPointDimensionParser(p)), { readonly: p.optional.constant(false), w: p.optional.custom(parsePointDimensionParams), x: p.optional.custom(parsePointDimensionParams), y: p.optional.custom(parsePointDimensionParams), z: p.optional.custom(parsePointDimensionParams) })));
        return result
            ? {
                initialValue: value,
                params: result,
            }
            : null;
    },
    binding: {
        reader: (_args) => point4dFromUnknown,
        constraint: (args) => createConstraint$1(args.params, args.initialValue),
        equals: Point4d.equals,
        writer: (_args) => writePoint4d,
    },
    controller: (args) => {
        const value = args.value;
        const c = args.constraint;
        const dParams = [
            args.params.x,
            args.params.y,
            args.params.z,
            args.params.w,
        ];
        return new PointNdTextController(args.document, {
            assembly: Point4dAssembly,
            axes: value.rawValue.getComponents().map((comp, i) => {
                var _a;
                return createPointAxis({
                    constraint: c.components[i],
                    initialValue: comp,
                    params: deepMerge(args.params, ((_a = dParams[i]) !== null && _a !== void 0 ? _a : {})),
                });
            }),
            parser: parseNumber,
            value: value,
            viewProps: args.viewProps,
        });
    },
});

function createConstraint(params) {
    const constraints = [];
    const lc = createListConstraint(params.options);
    if (lc) {
        constraints.push(lc);
    }
    return new CompositeConstraint(constraints);
}
const StringInputPlugin = createPlugin({
    id: 'input-string',
    type: 'input',
    accept: (value, params) => {
        if (typeof value !== 'string') {
            return null;
        }
        const result = parseRecord(params, (p) => ({
            readonly: p.optional.constant(false),
            options: p.optional.custom(parseListOptions),
        }));
        return result
            ? {
                initialValue: value,
                params: result,
            }
            : null;
    },
    binding: {
        reader: (_args) => stringFromUnknown,
        constraint: (args) => createConstraint(args.params),
        writer: (_args) => writePrimitive,
    },
    controller: (args) => {
        const doc = args.document;
        const value = args.value;
        const c = args.constraint;
        const lc = c && findConstraint(c, ListConstraint);
        if (lc) {
            return new ListController(doc, {
                props: new ValueMap({
                    options: lc.values.value('options'),
                }),
                value: value,
                viewProps: args.viewProps,
            });
        }
        return new TextController(doc, {
            parser: (v) => v,
            props: ValueMap.fromObject({
                formatter: formatString,
            }),
            value: value,
            viewProps: args.viewProps,
        });
    },
    api(args) {
        if (typeof args.controller.value.rawValue !== 'string') {
            return null;
        }
        if (args.controller.valueController instanceof ListController) {
            return new ListInputBindingApi(args.controller);
        }
        return null;
    },
});

const Constants = {
    monitor: {
        defaultInterval: 200,
        defaultRows: 3,
    },
};

const cn$3 = ClassName('mll');
class MultiLogView {
    constructor(doc, config) {
        this.onValueUpdate_ = this.onValueUpdate_.bind(this);
        this.formatter_ = config.formatter;
        this.element = doc.createElement('div');
        this.element.classList.add(cn$3());
        config.viewProps.bindClassModifiers(this.element);
        const textareaElem = doc.createElement('textarea');
        textareaElem.classList.add(cn$3('i'));
        textareaElem.style.height = `calc(var(${getCssVar('containerUnitSize')}) * ${config.rows})`;
        textareaElem.readOnly = true;
        config.viewProps.bindDisabled(textareaElem);
        this.element.appendChild(textareaElem);
        this.textareaElem_ = textareaElem;
        config.value.emitter.on('change', this.onValueUpdate_);
        this.value = config.value;
        this.update_();
    }
    update_() {
        const elem = this.textareaElem_;
        const shouldScroll = elem.scrollTop === elem.scrollHeight - elem.clientHeight;
        const lines = [];
        this.value.rawValue.forEach((value) => {
            if (value !== undefined) {
                lines.push(this.formatter_(value));
            }
        });
        elem.textContent = lines.join('\n');
        if (shouldScroll) {
            elem.scrollTop = elem.scrollHeight;
        }
    }
    onValueUpdate_() {
        this.update_();
    }
}

class MultiLogController {
    constructor(doc, config) {
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new MultiLogView(doc, {
            formatter: config.formatter,
            rows: config.rows,
            value: this.value,
            viewProps: this.viewProps,
        });
    }
}

const cn$2 = ClassName('sgl');
class SingleLogView {
    constructor(doc, config) {
        this.onValueUpdate_ = this.onValueUpdate_.bind(this);
        this.formatter_ = config.formatter;
        this.element = doc.createElement('div');
        this.element.classList.add(cn$2());
        config.viewProps.bindClassModifiers(this.element);
        const inputElem = doc.createElement('input');
        inputElem.classList.add(cn$2('i'));
        inputElem.readOnly = true;
        inputElem.type = 'text';
        config.viewProps.bindDisabled(inputElem);
        this.element.appendChild(inputElem);
        this.inputElement = inputElem;
        config.value.emitter.on('change', this.onValueUpdate_);
        this.value = config.value;
        this.update_();
    }
    update_() {
        const values = this.value.rawValue;
        const lastValue = values[values.length - 1];
        this.inputElement.value =
            lastValue !== undefined ? this.formatter_(lastValue) : '';
    }
    onValueUpdate_() {
        this.update_();
    }
}

class SingleLogController {
    constructor(doc, config) {
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.view = new SingleLogView(doc, {
            formatter: config.formatter,
            value: this.value,
            viewProps: this.viewProps,
        });
    }
}

const BooleanMonitorPlugin = createPlugin({
    id: 'monitor-bool',
    type: 'monitor',
    accept: (value, params) => {
        if (typeof value !== 'boolean') {
            return null;
        }
        const result = parseRecord(params, (p) => ({
            readonly: p.required.constant(true),
            rows: p.optional.number,
        }));
        return result
            ? {
                initialValue: value,
                params: result,
            }
            : null;
    },
    binding: {
        reader: (_args) => boolFromUnknown,
    },
    controller: (args) => {
        var _a;
        if (args.value.rawValue.length === 1) {
            return new SingleLogController(args.document, {
                formatter: BooleanFormatter,
                value: args.value,
                viewProps: args.viewProps,
            });
        }
        return new MultiLogController(args.document, {
            formatter: BooleanFormatter,
            rows: (_a = args.params.rows) !== null && _a !== void 0 ? _a : Constants.monitor.defaultRows,
            value: args.value,
            viewProps: args.viewProps,
        });
    },
});

class GraphLogMonitorBindingApi extends BindingApi {
    get max() {
        return this.controller.valueController.props.get('max');
    }
    set max(max) {
        this.controller.valueController.props.set('max', max);
    }
    get min() {
        return this.controller.valueController.props.get('min');
    }
    set min(min) {
        this.controller.valueController.props.set('min', min);
    }
}

const cn$1 = ClassName('grl');
class GraphLogView {
    constructor(doc, config) {
        this.onCursorChange_ = this.onCursorChange_.bind(this);
        this.onValueUpdate_ = this.onValueUpdate_.bind(this);
        this.element = doc.createElement('div');
        this.element.classList.add(cn$1());
        config.viewProps.bindClassModifiers(this.element);
        this.formatter_ = config.formatter;
        this.props_ = config.props;
        this.cursor_ = config.cursor;
        this.cursor_.emitter.on('change', this.onCursorChange_);
        const svgElem = doc.createElementNS(SVG_NS, 'svg');
        svgElem.classList.add(cn$1('g'));
        svgElem.style.height = `calc(var(${getCssVar('containerUnitSize')}) * ${config.rows})`;
        this.element.appendChild(svgElem);
        this.svgElem_ = svgElem;
        const lineElem = doc.createElementNS(SVG_NS, 'polyline');
        this.svgElem_.appendChild(lineElem);
        this.lineElem_ = lineElem;
        const tooltipElem = doc.createElement('div');
        tooltipElem.classList.add(cn$1('t'), ClassName('tt')());
        this.element.appendChild(tooltipElem);
        this.tooltipElem_ = tooltipElem;
        config.value.emitter.on('change', this.onValueUpdate_);
        this.value = config.value;
        this.update_();
    }
    get graphElement() {
        return this.svgElem_;
    }
    update_() {
        const { clientWidth: w, clientHeight: h } = this.element;
        const maxIndex = this.value.rawValue.length - 1;
        const min = this.props_.get('min');
        const max = this.props_.get('max');
        const points = [];
        this.value.rawValue.forEach((v, index) => {
            if (v === undefined) {
                return;
            }
            const x = mapRange(index, 0, maxIndex, 0, w);
            const y = mapRange(v, min, max, h, 0);
            points.push([x, y].join(','));
        });
        this.lineElem_.setAttributeNS(null, 'points', points.join(' '));
        const tooltipElem = this.tooltipElem_;
        const value = this.value.rawValue[this.cursor_.rawValue];
        if (value === undefined) {
            tooltipElem.classList.remove(cn$1('t', 'a'));
            return;
        }
        const tx = mapRange(this.cursor_.rawValue, 0, maxIndex, 0, w);
        const ty = mapRange(value, min, max, h, 0);
        tooltipElem.style.left = `${tx}px`;
        tooltipElem.style.top = `${ty}px`;
        tooltipElem.textContent = `${this.formatter_(value)}`;
        if (!tooltipElem.classList.contains(cn$1('t', 'a'))) {
            tooltipElem.classList.add(cn$1('t', 'a'), cn$1('t', 'in'));
            forceReflow(tooltipElem);
            tooltipElem.classList.remove(cn$1('t', 'in'));
        }
    }
    onValueUpdate_() {
        this.update_();
    }
    onCursorChange_() {
        this.update_();
    }
}

class GraphLogController {
    constructor(doc, config) {
        this.onGraphMouseMove_ = this.onGraphMouseMove_.bind(this);
        this.onGraphMouseLeave_ = this.onGraphMouseLeave_.bind(this);
        this.onGraphPointerDown_ = this.onGraphPointerDown_.bind(this);
        this.onGraphPointerMove_ = this.onGraphPointerMove_.bind(this);
        this.onGraphPointerUp_ = this.onGraphPointerUp_.bind(this);
        this.props = config.props;
        this.value = config.value;
        this.viewProps = config.viewProps;
        this.cursor_ = createValue(-1);
        this.view = new GraphLogView(doc, {
            cursor: this.cursor_,
            formatter: config.formatter,
            rows: config.rows,
            props: this.props,
            value: this.value,
            viewProps: this.viewProps,
        });
        if (!supportsTouch(doc)) {
            this.view.element.addEventListener('mousemove', this.onGraphMouseMove_);
            this.view.element.addEventListener('mouseleave', this.onGraphMouseLeave_);
        }
        else {
            const ph = new PointerHandler(this.view.element);
            ph.emitter.on('down', this.onGraphPointerDown_);
            ph.emitter.on('move', this.onGraphPointerMove_);
            ph.emitter.on('up', this.onGraphPointerUp_);
        }
    }
    importProps(state) {
        return importBladeState(state, null, (p) => ({
            max: p.required.number,
            min: p.required.number,
        }), (result) => {
            this.props.set('max', result.max);
            this.props.set('min', result.min);
            return true;
        });
    }
    exportProps() {
        return exportBladeState(null, {
            max: this.props.get('max'),
            min: this.props.get('min'),
        });
    }
    onGraphMouseLeave_() {
        this.cursor_.rawValue = -1;
    }
    onGraphMouseMove_(ev) {
        const { clientWidth: w } = this.view.element;
        this.cursor_.rawValue = Math.floor(mapRange(ev.offsetX, 0, w, 0, this.value.rawValue.length));
    }
    onGraphPointerDown_(ev) {
        this.onGraphPointerMove_(ev);
    }
    onGraphPointerMove_(ev) {
        if (!ev.data.point) {
            this.cursor_.rawValue = -1;
            return;
        }
        this.cursor_.rawValue = Math.floor(mapRange(ev.data.point.x, 0, ev.data.bounds.width, 0, this.value.rawValue.length));
    }
    onGraphPointerUp_() {
        this.cursor_.rawValue = -1;
    }
}

function createFormatter(params) {
    return !isEmpty(params.format) ? params.format : createNumberFormatter(2);
}
function createTextMonitor(args) {
    var _a;
    if (args.value.rawValue.length === 1) {
        return new SingleLogController(args.document, {
            formatter: createFormatter(args.params),
            value: args.value,
            viewProps: args.viewProps,
        });
    }
    return new MultiLogController(args.document, {
        formatter: createFormatter(args.params),
        rows: (_a = args.params.rows) !== null && _a !== void 0 ? _a : Constants.monitor.defaultRows,
        value: args.value,
        viewProps: args.viewProps,
    });
}
function createGraphMonitor(args) {
    var _a, _b, _c;
    return new GraphLogController(args.document, {
        formatter: createFormatter(args.params),
        rows: (_a = args.params.rows) !== null && _a !== void 0 ? _a : Constants.monitor.defaultRows,
        props: ValueMap.fromObject({
            max: (_b = args.params.max) !== null && _b !== void 0 ? _b : 100,
            min: (_c = args.params.min) !== null && _c !== void 0 ? _c : 0,
        }),
        value: args.value,
        viewProps: args.viewProps,
    });
}
function shouldShowGraph(params) {
    return params.view === 'graph';
}
const NumberMonitorPlugin = createPlugin({
    id: 'monitor-number',
    type: 'monitor',
    accept: (value, params) => {
        if (typeof value !== 'number') {
            return null;
        }
        const result = parseRecord(params, (p) => ({
            format: p.optional.function,
            max: p.optional.number,
            min: p.optional.number,
            readonly: p.required.constant(true),
            rows: p.optional.number,
            view: p.optional.string,
        }));
        return result
            ? {
                initialValue: value,
                params: result,
            }
            : null;
    },
    binding: {
        defaultBufferSize: (params) => (shouldShowGraph(params) ? 64 : 1),
        reader: (_args) => numberFromUnknown,
    },
    controller: (args) => {
        if (shouldShowGraph(args.params)) {
            return createGraphMonitor(args);
        }
        return createTextMonitor(args);
    },
    api: (args) => {
        if (args.controller.valueController instanceof GraphLogController) {
            return new GraphLogMonitorBindingApi(args.controller);
        }
        return null;
    },
});

const StringMonitorPlugin = createPlugin({
    id: 'monitor-string',
    type: 'monitor',
    accept: (value, params) => {
        if (typeof value !== 'string') {
            return null;
        }
        const result = parseRecord(params, (p) => ({
            multiline: p.optional.boolean,
            readonly: p.required.constant(true),
            rows: p.optional.number,
        }));
        return result
            ? {
                initialValue: value,
                params: result,
            }
            : null;
    },
    binding: {
        reader: (_args) => stringFromUnknown,
    },
    controller: (args) => {
        var _a;
        const value = args.value;
        const multiline = value.rawValue.length > 1 || args.params.multiline;
        if (multiline) {
            return new MultiLogController(args.document, {
                formatter: formatString,
                rows: (_a = args.params.rows) !== null && _a !== void 0 ? _a : Constants.monitor.defaultRows,
                value: value,
                viewProps: args.viewProps,
            });
        }
        return new SingleLogController(args.document, {
            formatter: formatString,
            value: value,
            viewProps: args.viewProps,
        });
    },
});

class BladeApiCache {
    constructor() {
        this.map_ = new Map();
    }
    get(bc) {
        var _a;
        return (_a = this.map_.get(bc)) !== null && _a !== void 0 ? _a : null;
    }
    has(bc) {
        return this.map_.has(bc);
    }
    add(bc, api) {
        this.map_.set(bc, api);
        bc.viewProps.handleDispose(() => {
            this.map_.delete(bc);
        });
        return api;
    }
}

class ReadWriteBinding {
    constructor(config) {
        this.target = config.target;
        this.reader_ = config.reader;
        this.writer_ = config.writer;
    }
    read() {
        return this.reader_(this.target.read());
    }
    write(value) {
        this.writer_(this.target, value);
    }
    inject(value) {
        this.write(this.reader_(value));
    }
}

function createInputBindingController(plugin, args) {
    var _a;
    const result = plugin.accept(args.target.read(), args.params);
    if (isEmpty(result)) {
        return null;
    }
    const valueArgs = {
        target: args.target,
        initialValue: result.initialValue,
        params: result.params,
    };
    const params = parseRecord(args.params, (p) => ({
        disabled: p.optional.boolean,
        hidden: p.optional.boolean,
        label: p.optional.string,
        tag: p.optional.string,
    }));
    const reader = plugin.binding.reader(valueArgs);
    const constraint = plugin.binding.constraint
        ? plugin.binding.constraint(valueArgs)
        : undefined;
    const binding = new ReadWriteBinding({
        reader: reader,
        target: args.target,
        writer: plugin.binding.writer(valueArgs),
    });
    const value = new InputBindingValue(createValue(reader(result.initialValue), {
        constraint: constraint,
        equals: plugin.binding.equals,
    }), binding);
    const controller = plugin.controller({
        constraint: constraint,
        document: args.document,
        initialValue: result.initialValue,
        params: result.params,
        value: value,
        viewProps: ViewProps.create({
            disabled: params === null || params === void 0 ? void 0 : params.disabled,
            hidden: params === null || params === void 0 ? void 0 : params.hidden,
        }),
    });
    return new InputBindingController(args.document, {
        blade: createBlade(),
        props: ValueMap.fromObject({
            label: 'label' in args.params ? (_a = params === null || params === void 0 ? void 0 : params.label) !== null && _a !== void 0 ? _a : null : args.target.key,
        }),
        tag: params === null || params === void 0 ? void 0 : params.tag,
        value: value,
        valueController: controller,
    });
}

class ReadonlyBinding {
    constructor(config) {
        this.target = config.target;
        this.reader_ = config.reader;
    }
    read() {
        return this.reader_(this.target.read());
    }
}

function createTicker(document, interval) {
    return interval === 0
        ? new ManualTicker()
        : new IntervalTicker(document, interval !== null && interval !== void 0 ? interval : Constants.monitor.defaultInterval);
}
function createMonitorBindingController(plugin, args) {
    var _a, _b, _c;
    const result = plugin.accept(args.target.read(), args.params);
    if (isEmpty(result)) {
        return null;
    }
    const bindingArgs = {
        target: args.target,
        initialValue: result.initialValue,
        params: result.params,
    };
    const params = parseRecord(args.params, (p) => ({
        bufferSize: p.optional.number,
        disabled: p.optional.boolean,
        hidden: p.optional.boolean,
        interval: p.optional.number,
        label: p.optional.string,
    }));
    const reader = plugin.binding.reader(bindingArgs);
    const bufferSize = (_b = (_a = params === null || params === void 0 ? void 0 : params.bufferSize) !== null && _a !== void 0 ? _a : (plugin.binding.defaultBufferSize &&
        plugin.binding.defaultBufferSize(result.params))) !== null && _b !== void 0 ? _b : 1;
    const value = new MonitorBindingValue({
        binding: new ReadonlyBinding({
            reader: reader,
            target: args.target,
        }),
        bufferSize: bufferSize,
        ticker: createTicker(args.document, params === null || params === void 0 ? void 0 : params.interval),
    });
    const controller = plugin.controller({
        document: args.document,
        params: result.params,
        value: value,
        viewProps: ViewProps.create({
            disabled: params === null || params === void 0 ? void 0 : params.disabled,
            hidden: params === null || params === void 0 ? void 0 : params.hidden,
        }),
    });
    controller.viewProps.bindDisabled(value.ticker);
    controller.viewProps.handleDispose(() => {
        value.ticker.dispose();
    });
    return new MonitorBindingController(args.document, {
        blade: createBlade(),
        props: ValueMap.fromObject({
            label: 'label' in args.params ? (_c = params === null || params === void 0 ? void 0 : params.label) !== null && _c !== void 0 ? _c : null : args.target.key,
        }),
        value: value,
        valueController: controller,
    });
}

class PluginPool {
    constructor(apiCache) {
        this.pluginsMap_ = {
            blades: [],
            inputs: [],
            monitors: [],
        };
        this.apiCache_ = apiCache;
    }
    getAll() {
        return [
            ...this.pluginsMap_.blades,
            ...this.pluginsMap_.inputs,
            ...this.pluginsMap_.monitors,
        ];
    }
    register(bundleId, r) {
        if (!isCompatible(r.core)) {
            throw TpError.notCompatible(bundleId, r.id);
        }
        if (r.type === 'blade') {
            this.pluginsMap_.blades.unshift(r);
        }
        else if (r.type === 'input') {
            this.pluginsMap_.inputs.unshift(r);
        }
        else if (r.type === 'monitor') {
            this.pluginsMap_.monitors.unshift(r);
        }
    }
    createInput_(document, target, params) {
        return this.pluginsMap_.inputs.reduce((result, plugin) => result !== null && result !== void 0 ? result : createInputBindingController(plugin, {
            document: document,
            target: target,
            params: params,
        }), null);
    }
    createMonitor_(document, target, params) {
        return this.pluginsMap_.monitors.reduce((result, plugin) => result !== null && result !== void 0 ? result : createMonitorBindingController(plugin, {
            document: document,
            params: params,
            target: target,
        }), null);
    }
    createBinding(doc, target, params) {
        const initialValue = target.read();
        if (isEmpty(initialValue)) {
            throw new TpError({
                context: {
                    key: target.key,
                },
                type: 'nomatchingcontroller',
            });
        }
        const ic = this.createInput_(doc, target, params);
        if (ic) {
            return ic;
        }
        const mc = this.createMonitor_(doc, target, params);
        if (mc) {
            return mc;
        }
        throw new TpError({
            context: {
                key: target.key,
            },
            type: 'nomatchingcontroller',
        });
    }
    createBlade(document, params) {
        const bc = this.pluginsMap_.blades.reduce((result, plugin) => result !== null && result !== void 0 ? result : createBladeController(plugin, {
            document: document,
            params: params,
        }), null);
        if (!bc) {
            throw new TpError({
                type: 'nomatchingview',
                context: {
                    params: params,
                },
            });
        }
        return bc;
    }
    createInputBindingApi_(bc) {
        const api = this.pluginsMap_.inputs.reduce((result, plugin) => {
            var _a, _b;
            if (result) {
                return result;
            }
            return ((_b = (_a = plugin.api) === null || _a === void 0 ? void 0 : _a.call(plugin, {
                controller: bc,
            })) !== null && _b !== void 0 ? _b : null);
        }, null);
        return this.apiCache_.add(bc, api !== null && api !== void 0 ? api : new BindingApi(bc));
    }
    createMonitorBindingApi_(bc) {
        const api = this.pluginsMap_.monitors.reduce((result, plugin) => {
            var _a, _b;
            if (result) {
                return result;
            }
            return ((_b = (_a = plugin.api) === null || _a === void 0 ? void 0 : _a.call(plugin, {
                controller: bc,
            })) !== null && _b !== void 0 ? _b : null);
        }, null);
        return this.apiCache_.add(bc, api !== null && api !== void 0 ? api : new BindingApi(bc));
    }
    createBindingApi(bc) {
        if (this.apiCache_.has(bc)) {
            return this.apiCache_.get(bc);
        }
        if (isInputBindingController(bc)) {
            return this.createInputBindingApi_(bc);
        }
        if (isMonitorBindingController(bc)) {
            return this.createMonitorBindingApi_(bc);
        }
        throw TpError.shouldNeverHappen();
    }
    createApi(bc) {
        if (this.apiCache_.has(bc)) {
            return this.apiCache_.get(bc);
        }
        if (isBindingController(bc)) {
            return this.createBindingApi(bc);
        }
        const api = this.pluginsMap_.blades.reduce((result, plugin) => result !== null && result !== void 0 ? result : plugin.api({
            controller: bc,
            pool: this,
        }), null);
        if (!api) {
            throw TpError.shouldNeverHappen();
        }
        return this.apiCache_.add(bc, api);
    }
}

const sharedCache = new BladeApiCache();
function createDefaultPluginPool() {
    const pool = new PluginPool(sharedCache);
    [
        Point2dInputPlugin,
        Point3dInputPlugin,
        Point4dInputPlugin,
        StringInputPlugin,
        NumberInputPlugin,
        StringColorInputPlugin,
        ObjectColorInputPlugin,
        NumberColorInputPlugin,
        BooleanInputPlugin,
        BooleanMonitorPlugin,
        StringMonitorPlugin,
        NumberMonitorPlugin,
        ButtonBladePlugin,
        FolderBladePlugin,
        TabBladePlugin,
    ].forEach((p) => {
        pool.register('core', p);
    });
    return pool;
}

class ListBladeApi extends BladeApi {
    /**
     * @hidden
     */
    constructor(controller) {
        super(controller);
        this.emitter_ = new Emitter();
        this.controller.value.emitter.on('change', (ev) => {
            this.emitter_.emit('change', new TpChangeEvent(this, ev.rawValue));
        });
    }
    get label() {
        return this.controller.labelController.props.get('label');
    }
    set label(label) {
        this.controller.labelController.props.set('label', label);
    }
    get options() {
        return this.controller.valueController.props.get('options');
    }
    set options(options) {
        this.controller.valueController.props.set('options', options);
    }
    get value() {
        return this.controller.value.rawValue;
    }
    set value(value) {
        this.controller.value.rawValue = value;
    }
    on(eventName, handler) {
        const bh = handler.bind(this);
        this.emitter_.on(eventName, (ev) => {
            bh(ev);
        }, {
            key: handler,
        });
        return this;
    }
    off(eventName, handler) {
        this.emitter_.off(eventName, handler);
        return this;
    }
}

class SeparatorBladeApi extends BladeApi {
}

class SliderBladeApi extends BladeApi {
    /**
     * @hidden
     */
    constructor(controller) {
        super(controller);
        this.emitter_ = new Emitter();
        this.controller.value.emitter.on('change', (ev) => {
            this.emitter_.emit('change', new TpChangeEvent(this, ev.rawValue));
        });
    }
    get label() {
        return this.controller.labelController.props.get('label');
    }
    set label(label) {
        this.controller.labelController.props.set('label', label);
    }
    get max() {
        return this.controller.valueController.sliderController.props.get('max');
    }
    set max(max) {
        this.controller.valueController.sliderController.props.set('max', max);
    }
    get min() {
        return this.controller.valueController.sliderController.props.get('min');
    }
    set min(min) {
        this.controller.valueController.sliderController.props.set('min', min);
    }
    get value() {
        return this.controller.value.rawValue;
    }
    set value(value) {
        this.controller.value.rawValue = value;
    }
    on(eventName, handler) {
        const bh = handler.bind(this);
        this.emitter_.on(eventName, (ev) => {
            bh(ev);
        }, {
            key: handler,
        });
        return this;
    }
    off(eventName, handler) {
        this.emitter_.off(eventName, handler);
        return this;
    }
}

class TextBladeApi extends BladeApi {
    /**
     * @hidden
     */
    constructor(controller) {
        super(controller);
        this.emitter_ = new Emitter();
        this.controller.value.emitter.on('change', (ev) => {
            this.emitter_.emit('change', new TpChangeEvent(this, ev.rawValue));
        });
    }
    get label() {
        return this.controller.labelController.props.get('label');
    }
    set label(label) {
        this.controller.labelController.props.set('label', label);
    }
    get formatter() {
        return this.controller.valueController.props.get('formatter');
    }
    set formatter(formatter) {
        this.controller.valueController.props.set('formatter', formatter);
    }
    get value() {
        return this.controller.value.rawValue;
    }
    set value(value) {
        this.controller.value.rawValue = value;
    }
    on(eventName, handler) {
        const bh = handler.bind(this);
        this.emitter_.on(eventName, (ev) => {
            bh(ev);
        }, {
            key: handler,
        });
        return this;
    }
    off(eventName, handler) {
        this.emitter_.off(eventName, handler);
        return this;
    }
}

const ListBladePlugin = (function () {
    return {
        id: 'list',
        type: 'blade',
        core: VERSION$1,
        accept(params) {
            const result = parseRecord(params, (p) => ({
                options: p.required.custom(parseListOptions),
                value: p.required.raw,
                view: p.required.constant('list'),
                label: p.optional.string,
            }));
            return result ? { params: result } : null;
        },
        controller(args) {
            const lc = new ListConstraint(normalizeListOptions(args.params.options));
            const value = createValue(args.params.value, {
                constraint: lc,
            });
            const ic = new ListController(args.document, {
                props: new ValueMap({
                    options: lc.values.value('options'),
                }),
                value: value,
                viewProps: args.viewProps,
            });
            return new LabeledValueBladeController(args.document, {
                blade: args.blade,
                props: ValueMap.fromObject({
                    label: args.params.label,
                }),
                value: value,
                valueController: ic,
            });
        },
        api(args) {
            if (!(args.controller instanceof LabeledValueBladeController)) {
                return null;
            }
            if (!(args.controller.valueController instanceof ListController)) {
                return null;
            }
            return new ListBladeApi(args.controller);
        },
    };
})();

class RootApi extends FolderApi {
    /**
     * @hidden
     */
    constructor(controller, pool) {
        super(controller, pool);
    }
    get element() {
        return this.controller.view.element;
    }
}

/**
 * @hidden
 */
class RootController extends FolderController {
    constructor(doc, config) {
        super(doc, {
            expanded: config.expanded,
            blade: config.blade,
            props: config.props,
            root: true,
            viewProps: config.viewProps,
        });
    }
}

const cn = ClassName('spr');
/**
 * @hidden
 */
class SeparatorView {
    constructor(doc, config) {
        this.element = doc.createElement('div');
        this.element.classList.add(cn());
        config.viewProps.bindClassModifiers(this.element);
        const hrElem = doc.createElement('hr');
        hrElem.classList.add(cn('r'));
        this.element.appendChild(hrElem);
    }
}

/**
 * @hidden
 */
class SeparatorController extends BladeController {
    /**
     * @hidden
     */
    constructor(doc, config) {
        super(Object.assign(Object.assign({}, config), { view: new SeparatorView(doc, {
                viewProps: config.viewProps,
            }) }));
    }
}

const SeparatorBladePlugin = {
    id: 'separator',
    type: 'blade',
    core: VERSION$1,
    accept(params) {
        const result = parseRecord(params, (p) => ({
            view: p.required.constant('separator'),
        }));
        return result ? { params: result } : null;
    },
    controller(args) {
        return new SeparatorController(args.document, {
            blade: args.blade,
            viewProps: args.viewProps,
        });
    },
    api(args) {
        if (!(args.controller instanceof SeparatorController)) {
            return null;
        }
        return new SeparatorBladeApi(args.controller);
    },
};

const SliderBladePlugin = {
    id: 'slider',
    type: 'blade',
    core: VERSION$1,
    accept(params) {
        const result = parseRecord(params, (p) => ({
            max: p.required.number,
            min: p.required.number,
            view: p.required.constant('slider'),
            format: p.optional.function,
            label: p.optional.string,
            value: p.optional.number,
        }));
        return result ? { params: result } : null;
    },
    controller(args) {
        var _a, _b;
        const initialValue = (_a = args.params.value) !== null && _a !== void 0 ? _a : 0;
        const drc = new DefiniteRangeConstraint({
            max: args.params.max,
            min: args.params.min,
        });
        const v = createValue(initialValue, {
            constraint: drc,
        });
        const vc = new SliderTextController(args.document, Object.assign(Object.assign({}, createSliderTextProps({
            formatter: (_b = args.params.format) !== null && _b !== void 0 ? _b : numberToString,
            keyScale: createValue(1),
            max: drc.values.value('max'),
            min: drc.values.value('min'),
            pointerScale: getSuitablePointerScale(args.params, initialValue),
        })), { parser: parseNumber, value: v, viewProps: args.viewProps }));
        return new LabeledValueBladeController(args.document, {
            blade: args.blade,
            props: ValueMap.fromObject({
                label: args.params.label,
            }),
            value: v,
            valueController: vc,
        });
    },
    api(args) {
        if (!(args.controller instanceof LabeledValueBladeController)) {
            return null;
        }
        if (!(args.controller.valueController instanceof SliderTextController)) {
            return null;
        }
        return new SliderBladeApi(args.controller);
    },
};

const TextBladePlugin = (function () {
    return {
        id: 'text',
        type: 'blade',
        core: VERSION$1,
        accept(params) {
            const result = parseRecord(params, (p) => ({
                parse: p.required.function,
                value: p.required.raw,
                view: p.required.constant('text'),
                format: p.optional.function,
                label: p.optional.string,
            }));
            return result ? { params: result } : null;
        },
        controller(args) {
            var _a;
            const v = createValue(args.params.value);
            const ic = new TextController(args.document, {
                parser: args.params.parse,
                props: ValueMap.fromObject({
                    formatter: (_a = args.params.format) !== null && _a !== void 0 ? _a : ((v) => String(v)),
                }),
                value: v,
                viewProps: args.viewProps,
            });
            return new LabeledValueBladeController(args.document, {
                blade: args.blade,
                props: ValueMap.fromObject({
                    label: args.params.label,
                }),
                value: v,
                valueController: ic,
            });
        },
        api(args) {
            if (!(args.controller instanceof LabeledValueBladeController)) {
                return null;
            }
            if (!(args.controller.valueController instanceof TextController)) {
                return null;
            }
            return new TextBladeApi(args.controller);
        },
    };
})();

function createDefaultWrapperElement(doc) {
    const elem = doc.createElement('div');
    elem.classList.add(ClassName('dfw')());
    if (doc.body) {
        doc.body.appendChild(elem);
    }
    return elem;
}
function embedStyle(doc, id, css) {
    if (doc.querySelector(`style[data-tp-style=${id}]`)) {
        return;
    }
    const styleElem = doc.createElement('style');
    styleElem.dataset.tpStyle = id;
    styleElem.textContent = css;
    doc.head.appendChild(styleElem);
}
/**
 * The root pane of Tweakpane.
 */
class Pane extends RootApi {
    constructor(opt_config) {
        var _a, _b;
        const config = opt_config !== null && opt_config !== void 0 ? opt_config : {};
        const doc = (_a = config.document) !== null && _a !== void 0 ? _a : getWindowDocument();
        const pool = createDefaultPluginPool();
        const rootController = new RootController(doc, {
            expanded: config.expanded,
            blade: createBlade(),
            props: ValueMap.fromObject({
                title: config.title,
            }),
            viewProps: ViewProps.create(),
        });
        super(rootController, pool);
        this.pool_ = pool;
        this.containerElem_ = (_b = config.container) !== null && _b !== void 0 ? _b : createDefaultWrapperElement(doc);
        this.containerElem_.appendChild(this.element);
        this.doc_ = doc;
        this.usesDefaultWrapper_ = !config.container;
        this.setUpDefaultPlugins_();
    }
    get document() {
        if (!this.doc_) {
            throw TpError.alreadyDisposed();
        }
        return this.doc_;
    }
    dispose() {
        const containerElem = this.containerElem_;
        if (!containerElem) {
            throw TpError.alreadyDisposed();
        }
        if (this.usesDefaultWrapper_) {
            const parentElem = containerElem.parentElement;
            if (parentElem) {
                parentElem.removeChild(containerElem);
            }
        }
        this.containerElem_ = null;
        this.doc_ = null;
        super.dispose();
    }
    registerPlugin(bundle) {
        if (bundle.css) {
            embedStyle(this.document, `plugin-${bundle.id}`, bundle.css);
        }
        const plugins = 'plugin' in bundle
            ? [bundle.plugin]
            : 'plugins' in bundle
                ? bundle.plugins
                : [];
        plugins.forEach((p) => {
            this.pool_.register(bundle.id, p);
        });
    }
    setUpDefaultPlugins_() {
        this.registerPlugin({
            id: 'default',
            // NOTE: This string literal will be replaced with the default CSS by Rollup at the compilation time
            css: '.tp-tbiv_b,.tp-coltxtv_ms,.tp-colswv_b,.tp-ckbv_i,.tp-sglv_i,.tp-mllv_i,.tp-grlv_g,.tp-txtv_i,.tp-p2dpv_p,.tp-colswv_sw,.tp-rotv_b,.tp-fldv_b,.tp-p2dv_b,.tp-btnv_b,.tp-lstv_s{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:rgba(0,0,0,0);border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0}.tp-p2dv_b,.tp-btnv_b,.tp-lstv_s{background-color:var(--btn-bg);border-radius:var(--bld-br);color:var(--btn-fg);cursor:pointer;display:block;font-weight:bold;height:var(--cnt-usz);line-height:var(--cnt-usz);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tp-p2dv_b:hover,.tp-btnv_b:hover,.tp-lstv_s:hover{background-color:var(--btn-bg-h)}.tp-p2dv_b:focus,.tp-btnv_b:focus,.tp-lstv_s:focus{background-color:var(--btn-bg-f)}.tp-p2dv_b:active,.tp-btnv_b:active,.tp-lstv_s:active{background-color:var(--btn-bg-a)}.tp-p2dv_b:disabled,.tp-btnv_b:disabled,.tp-lstv_s:disabled{opacity:.5}.tp-rotv_c>.tp-cntv.tp-v-lst,.tp-tbpv_c>.tp-cntv.tp-v-lst,.tp-fldv_c>.tp-cntv.tp-v-lst{margin-bottom:calc(-1*var(--cnt-vp))}.tp-rotv_c>.tp-fldv.tp-v-lst .tp-fldv_c,.tp-tbpv_c>.tp-fldv.tp-v-lst .tp-fldv_c,.tp-fldv_c>.tp-fldv.tp-v-lst .tp-fldv_c{border-bottom-left-radius:0}.tp-rotv_c>.tp-fldv.tp-v-lst .tp-fldv_b,.tp-tbpv_c>.tp-fldv.tp-v-lst .tp-fldv_b,.tp-fldv_c>.tp-fldv.tp-v-lst .tp-fldv_b{border-bottom-left-radius:0}.tp-rotv_c>*:not(.tp-v-fst),.tp-tbpv_c>*:not(.tp-v-fst),.tp-fldv_c>*:not(.tp-v-fst){margin-top:var(--cnt-usp)}.tp-rotv_c>.tp-sprv:not(.tp-v-fst),.tp-tbpv_c>.tp-sprv:not(.tp-v-fst),.tp-fldv_c>.tp-sprv:not(.tp-v-fst),.tp-rotv_c>.tp-cntv:not(.tp-v-fst),.tp-tbpv_c>.tp-cntv:not(.tp-v-fst),.tp-fldv_c>.tp-cntv:not(.tp-v-fst){margin-top:var(--cnt-vp)}.tp-rotv_c>.tp-sprv+*:not(.tp-v-hidden),.tp-tbpv_c>.tp-sprv+*:not(.tp-v-hidden),.tp-fldv_c>.tp-sprv+*:not(.tp-v-hidden),.tp-rotv_c>.tp-cntv+*:not(.tp-v-hidden),.tp-tbpv_c>.tp-cntv+*:not(.tp-v-hidden),.tp-fldv_c>.tp-cntv+*:not(.tp-v-hidden){margin-top:var(--cnt-vp)}.tp-rotv_c>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-tbpv_c>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-fldv_c>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-rotv_c>.tp-cntv:not(.tp-v-hidden)+.tp-cntv,.tp-tbpv_c>.tp-cntv:not(.tp-v-hidden)+.tp-cntv,.tp-fldv_c>.tp-cntv:not(.tp-v-hidden)+.tp-cntv{margin-top:0}.tp-tbpv_c>.tp-cntv,.tp-fldv_c>.tp-cntv{margin-left:4px}.tp-tbpv_c>.tp-fldv>.tp-fldv_b,.tp-fldv_c>.tp-fldv>.tp-fldv_b{border-top-left-radius:var(--bld-br);border-bottom-left-radius:var(--bld-br)}.tp-tbpv_c>.tp-fldv.tp-fldv-expanded>.tp-fldv_b,.tp-fldv_c>.tp-fldv.tp-fldv-expanded>.tp-fldv_b{border-bottom-left-radius:0}.tp-tbpv_c .tp-fldv>.tp-fldv_c,.tp-fldv_c .tp-fldv>.tp-fldv_c{border-bottom-left-radius:var(--bld-br)}.tp-tbpv_c>.tp-cntv+.tp-fldv>.tp-fldv_b,.tp-fldv_c>.tp-cntv+.tp-fldv>.tp-fldv_b{border-top-left-radius:0}.tp-tbpv_c>.tp-cntv+.tp-tabv>.tp-tabv_t,.tp-fldv_c>.tp-cntv+.tp-tabv>.tp-tabv_t{border-top-left-radius:0}.tp-tbpv_c>.tp-tabv>.tp-tabv_t,.tp-fldv_c>.tp-tabv>.tp-tabv_t{border-top-left-radius:var(--bld-br)}.tp-tbpv_c .tp-tabv>.tp-tabv_c,.tp-fldv_c .tp-tabv>.tp-tabv_c{border-bottom-left-radius:var(--bld-br)}.tp-rotv_b,.tp-fldv_b{background-color:var(--cnt-bg);color:var(--cnt-fg);cursor:pointer;display:block;height:calc(var(--cnt-usz) + 4px);line-height:calc(var(--cnt-usz) + 4px);overflow:hidden;padding-left:var(--cnt-hp);padding-right:calc(4px + var(--cnt-usz) + var(--cnt-hp));position:relative;text-align:left;text-overflow:ellipsis;white-space:nowrap;width:100%;transition:border-radius .2s ease-in-out .2s}.tp-rotv_b:hover,.tp-fldv_b:hover{background-color:var(--cnt-bg-h)}.tp-rotv_b:focus,.tp-fldv_b:focus{background-color:var(--cnt-bg-f)}.tp-rotv_b:active,.tp-fldv_b:active{background-color:var(--cnt-bg-a)}.tp-rotv_b:disabled,.tp-fldv_b:disabled{opacity:.5}.tp-rotv_m,.tp-fldv_m{background:linear-gradient(to left, var(--cnt-fg), var(--cnt-fg) 2px, transparent 2px, transparent 4px, var(--cnt-fg) 4px);border-radius:2px;bottom:0;content:"";display:block;height:6px;right:calc(var(--cnt-hp) + (var(--cnt-usz) + 4px - 6px)/2 - 2px);margin:auto;opacity:.5;position:absolute;top:0;transform:rotate(90deg);transition:transform .2s ease-in-out;width:6px}.tp-rotv.tp-rotv-expanded .tp-rotv_m,.tp-fldv.tp-fldv-expanded>.tp-fldv_b>.tp-fldv_m{transform:none}.tp-rotv_c,.tp-fldv_c{box-sizing:border-box;height:0;opacity:0;overflow:hidden;padding-bottom:0;padding-top:0;position:relative;transition:height .2s ease-in-out,opacity .2s linear,padding .2s ease-in-out}.tp-rotv.tp-rotv-cpl:not(.tp-rotv-expanded) .tp-rotv_c,.tp-fldv.tp-fldv-cpl:not(.tp-fldv-expanded)>.tp-fldv_c{display:none}.tp-rotv.tp-rotv-expanded .tp-rotv_c,.tp-fldv.tp-fldv-expanded>.tp-fldv_c{opacity:1;padding-bottom:var(--cnt-vp);padding-top:var(--cnt-vp);transform:none;overflow:visible;transition:height .2s ease-in-out,opacity .2s linear .2s,padding .2s ease-in-out}.tp-txtv_i,.tp-p2dpv_p,.tp-colswv_sw{background-color:var(--in-bg);border-radius:var(--bld-br);box-sizing:border-box;color:var(--in-fg);font-family:inherit;height:var(--cnt-usz);line-height:var(--cnt-usz);min-width:0;width:100%}.tp-txtv_i:hover,.tp-p2dpv_p:hover,.tp-colswv_sw:hover{background-color:var(--in-bg-h)}.tp-txtv_i:focus,.tp-p2dpv_p:focus,.tp-colswv_sw:focus{background-color:var(--in-bg-f)}.tp-txtv_i:active,.tp-p2dpv_p:active,.tp-colswv_sw:active{background-color:var(--in-bg-a)}.tp-txtv_i:disabled,.tp-p2dpv_p:disabled,.tp-colswv_sw:disabled{opacity:.5}.tp-lstv,.tp-coltxtv_m{position:relative}.tp-lstv_s{padding:0 20px 0 4px;width:100%}.tp-lstv_m,.tp-coltxtv_mm{bottom:0;margin:auto;pointer-events:none;position:absolute;right:2px;top:0}.tp-lstv_m svg,.tp-coltxtv_mm svg{bottom:0;height:16px;margin:auto;position:absolute;right:0;top:0;width:16px}.tp-lstv_m svg path,.tp-coltxtv_mm svg path{fill:currentColor}.tp-sglv_i,.tp-mllv_i,.tp-grlv_g{background-color:var(--mo-bg);border-radius:var(--bld-br);box-sizing:border-box;color:var(--mo-fg);height:var(--cnt-usz);scrollbar-color:currentColor rgba(0,0,0,0);scrollbar-width:thin;width:100%}.tp-sglv_i::-webkit-scrollbar,.tp-mllv_i::-webkit-scrollbar,.tp-grlv_g::-webkit-scrollbar{height:8px;width:8px}.tp-sglv_i::-webkit-scrollbar-corner,.tp-mllv_i::-webkit-scrollbar-corner,.tp-grlv_g::-webkit-scrollbar-corner{background-color:rgba(0,0,0,0)}.tp-sglv_i::-webkit-scrollbar-thumb,.tp-mllv_i::-webkit-scrollbar-thumb,.tp-grlv_g::-webkit-scrollbar-thumb{background-clip:padding-box;background-color:currentColor;border:rgba(0,0,0,0) solid 2px;border-radius:4px}.tp-pndtxtv,.tp-coltxtv_w{display:flex}.tp-pndtxtv_a,.tp-coltxtv_c{width:100%}.tp-pndtxtv_a+.tp-pndtxtv_a,.tp-coltxtv_c+.tp-pndtxtv_a,.tp-pndtxtv_a+.tp-coltxtv_c,.tp-coltxtv_c+.tp-coltxtv_c{margin-left:2px}.tp-rotv{--bs-bg: var(--tp-base-background-color, hsl(230, 7%, 17%));--bs-br: var(--tp-base-border-radius, 6px);--bs-ff: var(--tp-base-font-family, Roboto Mono, Source Code Pro, Menlo, Courier, monospace);--bs-sh: var(--tp-base-shadow-color, rgba(0, 0, 0, 0.2));--bld-br: var(--tp-blade-border-radius, 2px);--bld-hp: var(--tp-blade-horizontal-padding, 4px);--bld-vw: var(--tp-blade-value-width, 160px);--btn-bg: var(--tp-button-background-color, hsl(230, 7%, 70%));--btn-bg-a: var(--tp-button-background-color-active, #d6d7db);--btn-bg-f: var(--tp-button-background-color-focus, #c8cad0);--btn-bg-h: var(--tp-button-background-color-hover, #bbbcc4);--btn-fg: var(--tp-button-foreground-color, hsl(230, 7%, 17%));--cnt-bg: var(--tp-container-background-color, rgba(187, 188, 196, 0.1));--cnt-bg-a: var(--tp-container-background-color-active, rgba(187, 188, 196, 0.25));--cnt-bg-f: var(--tp-container-background-color-focus, rgba(187, 188, 196, 0.2));--cnt-bg-h: var(--tp-container-background-color-hover, rgba(187, 188, 196, 0.15));--cnt-fg: var(--tp-container-foreground-color, hsl(230, 7%, 75%));--cnt-hp: var(--tp-container-horizontal-padding, 4px);--cnt-vp: var(--tp-container-vertical-padding, 4px);--cnt-usp: var(--tp-container-unit-spacing, 4px);--cnt-usz: var(--tp-container-unit-size, 20px);--in-bg: var(--tp-input-background-color, rgba(187, 188, 196, 0.1));--in-bg-a: var(--tp-input-background-color-active, rgba(187, 188, 196, 0.25));--in-bg-f: var(--tp-input-background-color-focus, rgba(187, 188, 196, 0.2));--in-bg-h: var(--tp-input-background-color-hover, rgba(187, 188, 196, 0.15));--in-fg: var(--tp-input-foreground-color, hsl(230, 7%, 75%));--lbl-fg: var(--tp-label-foreground-color, rgba(187, 188, 196, 0.7));--mo-bg: var(--tp-monitor-background-color, rgba(0, 0, 0, 0.2));--mo-fg: var(--tp-monitor-foreground-color, rgba(187, 188, 196, 0.7));--grv-fg: var(--tp-groove-foreground-color, rgba(187, 188, 196, 0.1))}.tp-btnv_b{width:100%}.tp-btnv_t{text-align:center}.tp-ckbv_l{display:block;position:relative}.tp-ckbv_i{left:0;opacity:0;position:absolute;top:0}.tp-ckbv_w{background-color:var(--in-bg);border-radius:var(--bld-br);cursor:pointer;display:block;height:var(--cnt-usz);position:relative;width:var(--cnt-usz)}.tp-ckbv_w svg{display:block;height:16px;inset:0;margin:auto;opacity:0;position:absolute;width:16px}.tp-ckbv_w svg path{fill:none;stroke:var(--in-fg);stroke-width:2}.tp-ckbv_i:hover+.tp-ckbv_w{background-color:var(--in-bg-h)}.tp-ckbv_i:focus+.tp-ckbv_w{background-color:var(--in-bg-f)}.tp-ckbv_i:active+.tp-ckbv_w{background-color:var(--in-bg-a)}.tp-ckbv_i:checked+.tp-ckbv_w svg{opacity:1}.tp-ckbv.tp-v-disabled .tp-ckbv_w{opacity:.5}.tp-colv{position:relative}.tp-colv_h{display:flex}.tp-colv_s{flex-grow:0;flex-shrink:0;width:var(--cnt-usz)}.tp-colv_t{flex:1;margin-left:4px}.tp-colv_p{height:0;margin-top:0;opacity:0;overflow:hidden;transition:height .2s ease-in-out,opacity .2s linear,margin .2s ease-in-out}.tp-colv.tp-colv-expanded.tp-colv-cpl .tp-colv_p{overflow:visible}.tp-colv.tp-colv-expanded .tp-colv_p{margin-top:var(--cnt-usp);opacity:1}.tp-colv .tp-popv{left:calc(-1*var(--cnt-hp));right:calc(-1*var(--cnt-hp));top:var(--cnt-usz)}.tp-colpv_h,.tp-colpv_ap{margin-left:6px;margin-right:6px}.tp-colpv_h{margin-top:var(--cnt-usp)}.tp-colpv_rgb{display:flex;margin-top:var(--cnt-usp);width:100%}.tp-colpv_a{display:flex;margin-top:var(--cnt-vp);padding-top:calc(var(--cnt-vp) + 2px);position:relative}.tp-colpv_a::before{background-color:var(--grv-fg);content:"";height:2px;left:calc(-1*var(--cnt-hp));position:absolute;right:calc(-1*var(--cnt-hp));top:0}.tp-colpv.tp-v-disabled .tp-colpv_a::before{opacity:.5}.tp-colpv_ap{align-items:center;display:flex;flex:3}.tp-colpv_at{flex:1;margin-left:4px}.tp-svpv{border-radius:var(--bld-br);outline:none;overflow:hidden;position:relative}.tp-svpv.tp-v-disabled{opacity:.5}.tp-svpv_c{cursor:crosshair;display:block;height:calc(var(--cnt-usz)*4);width:100%}.tp-svpv_m{border-radius:100%;border:rgba(255,255,255,.75) solid 2px;box-sizing:border-box;filter:drop-shadow(0 0 1px rgba(0, 0, 0, 0.3));height:12px;margin-left:-6px;margin-top:-6px;pointer-events:none;position:absolute;width:12px}.tp-svpv:focus .tp-svpv_m{border-color:#fff}.tp-hplv{cursor:pointer;height:var(--cnt-usz);outline:none;position:relative}.tp-hplv.tp-v-disabled{opacity:.5}.tp-hplv_c{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAABCAYAAABubagXAAAAQ0lEQVQoU2P8z8Dwn0GCgQEDi2OK/RBgYHjBgIpfovFh8j8YBIgzFGQxuqEgPhaDOT5gOhPkdCxOZeBg+IDFZZiGAgCaSSMYtcRHLgAAAABJRU5ErkJggg==);background-position:left top;background-repeat:no-repeat;background-size:100% 100%;border-radius:2px;display:block;height:4px;left:0;margin-top:-2px;position:absolute;top:50%;width:100%}.tp-hplv_m{border-radius:var(--bld-br);border:rgba(255,255,255,.75) solid 2px;box-shadow:0 0 2px rgba(0,0,0,.1);box-sizing:border-box;height:12px;left:50%;margin-left:-6px;margin-top:-6px;position:absolute;top:50%;width:12px}.tp-hplv:focus .tp-hplv_m{border-color:#fff}.tp-aplv{cursor:pointer;height:var(--cnt-usz);outline:none;position:relative;width:100%}.tp-aplv.tp-v-disabled{opacity:.5}.tp-aplv_b{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:4px 4px;background-position:0 0,2px 2px;border-radius:2px;display:block;height:4px;left:0;margin-top:-2px;overflow:hidden;position:absolute;top:50%;width:100%}.tp-aplv_c{inset:0;position:absolute}.tp-aplv_m{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:12px 12px;background-position:0 0,6px 6px;border-radius:var(--bld-br);box-shadow:0 0 2px rgba(0,0,0,.1);height:12px;left:50%;margin-left:-6px;margin-top:-6px;overflow:hidden;position:absolute;top:50%;width:12px}.tp-aplv_p{border-radius:var(--bld-br);border:rgba(255,255,255,.75) solid 2px;box-sizing:border-box;inset:0;position:absolute}.tp-aplv:focus .tp-aplv_p{border-color:#fff}.tp-colswv{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:10px 10px;background-position:0 0,5px 5px;border-radius:var(--bld-br);overflow:hidden}.tp-colswv.tp-v-disabled{opacity:.5}.tp-colswv_sw{border-radius:0}.tp-colswv_b{cursor:pointer;display:block;height:var(--cnt-usz);left:0;position:absolute;top:0;width:var(--cnt-usz)}.tp-colswv_b:focus::after{border:rgba(255,255,255,.75) solid 2px;border-radius:var(--bld-br);content:"";display:block;inset:0;position:absolute}.tp-coltxtv{display:flex;width:100%}.tp-coltxtv_m{margin-right:4px}.tp-coltxtv_ms{border-radius:var(--bld-br);color:var(--lbl-fg);cursor:pointer;height:var(--cnt-usz);line-height:var(--cnt-usz);padding:0 18px 0 4px}.tp-coltxtv_ms:hover{background-color:var(--in-bg-h)}.tp-coltxtv_ms:focus{background-color:var(--in-bg-f)}.tp-coltxtv_ms:active{background-color:var(--in-bg-a)}.tp-coltxtv_mm{color:var(--lbl-fg)}.tp-coltxtv.tp-v-disabled .tp-coltxtv_mm{opacity:.5}.tp-coltxtv_w{flex:1}.tp-dfwv{position:absolute;top:8px;right:8px;width:256px}.tp-fldv{position:relative}.tp-fldv_t{padding-left:4px}.tp-fldv_b:disabled .tp-fldv_m{display:none}.tp-fldv_c{padding-left:4px}.tp-fldv_i{bottom:0;color:var(--cnt-bg);left:0;overflow:hidden;position:absolute;top:calc(var(--cnt-usz) + 4px);width:max(var(--bs-br),4px)}.tp-fldv_i::before{background-color:currentColor;bottom:0;content:"";left:0;position:absolute;top:0;width:4px}.tp-fldv_b:hover+.tp-fldv_i{color:var(--cnt-bg-h)}.tp-fldv_b:focus+.tp-fldv_i{color:var(--cnt-bg-f)}.tp-fldv_b:active+.tp-fldv_i{color:var(--cnt-bg-a)}.tp-fldv.tp-v-disabled>.tp-fldv_i{opacity:.5}.tp-grlv{position:relative}.tp-grlv_g{display:block;height:calc(var(--cnt-usz)*3)}.tp-grlv_g polyline{fill:none;stroke:var(--mo-fg);stroke-linejoin:round}.tp-grlv_t{margin-top:-4px;transition:left .05s,top .05s;visibility:hidden}.tp-grlv_t.tp-grlv_t-a{visibility:visible}.tp-grlv_t.tp-grlv_t-in{transition:none}.tp-grlv.tp-v-disabled .tp-grlv_g{opacity:.5}.tp-grlv .tp-ttv{background-color:var(--mo-fg)}.tp-grlv .tp-ttv::before{border-top-color:var(--mo-fg)}.tp-lblv{align-items:center;display:flex;line-height:1.3;padding-left:var(--cnt-hp);padding-right:var(--cnt-hp)}.tp-lblv.tp-lblv-nol{display:block}.tp-lblv_l{color:var(--lbl-fg);flex:1;-webkit-hyphens:auto;hyphens:auto;overflow:hidden;padding-left:4px;padding-right:16px}.tp-lblv.tp-v-disabled .tp-lblv_l{opacity:.5}.tp-lblv.tp-lblv-nol .tp-lblv_l{display:none}.tp-lblv_v{align-self:flex-start;flex-grow:0;flex-shrink:0;width:var(--bld-vw)}.tp-lblv.tp-lblv-nol .tp-lblv_v{width:100%}.tp-lstv_s{padding:0 20px 0 var(--bld-hp);width:100%}.tp-lstv_m{color:var(--btn-fg)}.tp-sglv_i{padding-left:var(--bld-hp);padding-right:var(--bld-hp)}.tp-sglv.tp-v-disabled .tp-sglv_i{opacity:.5}.tp-mllv_i{display:block;height:calc(var(--cnt-usz)*3);line-height:var(--cnt-usz);padding-left:var(--bld-hp);padding-right:var(--bld-hp);resize:none;white-space:pre}.tp-mllv.tp-v-disabled .tp-mllv_i{opacity:.5}.tp-p2dv{position:relative}.tp-p2dv_h{display:flex}.tp-p2dv_b{height:var(--cnt-usz);margin-right:4px;position:relative;width:var(--cnt-usz)}.tp-p2dv_b svg{display:block;height:16px;left:50%;margin-left:-8px;margin-top:-8px;position:absolute;top:50%;width:16px}.tp-p2dv_b svg path{stroke:currentColor;stroke-width:2}.tp-p2dv_b svg circle{fill:currentColor}.tp-p2dv_t{flex:1}.tp-p2dv_p{height:0;margin-top:0;opacity:0;overflow:hidden;transition:height .2s ease-in-out,opacity .2s linear,margin .2s ease-in-out}.tp-p2dv.tp-p2dv-expanded .tp-p2dv_p{margin-top:var(--cnt-usp);opacity:1}.tp-p2dv .tp-popv{left:calc(-1*var(--cnt-hp));right:calc(-1*var(--cnt-hp));top:var(--cnt-usz)}.tp-p2dpv{padding-left:calc(var(--cnt-usz) + 4px)}.tp-p2dpv_p{cursor:crosshair;height:0;overflow:hidden;padding-bottom:100%;position:relative}.tp-p2dpv.tp-v-disabled .tp-p2dpv_p{opacity:.5}.tp-p2dpv_g{display:block;height:100%;left:0;pointer-events:none;position:absolute;top:0;width:100%}.tp-p2dpv_ax{opacity:.1;stroke:var(--in-fg);stroke-dasharray:1}.tp-p2dpv_l{opacity:.5;stroke:var(--in-fg);stroke-dasharray:1}.tp-p2dpv_m{border:var(--in-fg) solid 1px;border-radius:50%;box-sizing:border-box;height:4px;margin-left:-2px;margin-top:-2px;position:absolute;width:4px}.tp-p2dpv_p:focus .tp-p2dpv_m{background-color:var(--in-fg);border-width:0}.tp-popv{background-color:var(--bs-bg);border-radius:var(--bs-br);box-shadow:0 2px 4px var(--bs-sh);display:none;max-width:var(--bld-vw);padding:var(--cnt-vp) var(--cnt-hp);position:absolute;visibility:hidden;z-index:1000}.tp-popv.tp-popv-v{display:block;visibility:visible}.tp-sldv.tp-v-disabled{opacity:.5}.tp-sldv_t{box-sizing:border-box;cursor:pointer;height:var(--cnt-usz);margin:0 6px;outline:none;position:relative}.tp-sldv_t::before{background-color:var(--in-bg);border-radius:1px;content:"";display:block;height:2px;inset:0;margin:auto;position:absolute}.tp-sldv_k{height:100%;left:0;position:absolute;top:0}.tp-sldv_k::before{background-color:var(--in-fg);border-radius:1px;content:"";display:block;height:2px;inset:0;margin-bottom:auto;margin-top:auto;position:absolute}.tp-sldv_k::after{background-color:var(--btn-bg);border-radius:var(--bld-br);bottom:0;content:"";display:block;height:12px;margin-bottom:auto;margin-top:auto;position:absolute;right:-6px;top:0;width:12px}.tp-sldv_t:hover .tp-sldv_k::after{background-color:var(--btn-bg-h)}.tp-sldv_t:focus .tp-sldv_k::after{background-color:var(--btn-bg-f)}.tp-sldv_t:active .tp-sldv_k::after{background-color:var(--btn-bg-a)}.tp-sldtxtv{display:flex}.tp-sldtxtv_s{flex:2}.tp-sldtxtv_t{flex:1;margin-left:4px}.tp-tabv{position:relative}.tp-tabv_t{align-items:flex-end;color:var(--cnt-bg);display:flex;overflow:hidden;position:relative}.tp-tabv_t:hover{color:var(--cnt-bg-h)}.tp-tabv_t:has(*:focus){color:var(--cnt-bg-f)}.tp-tabv_t:has(*:active){color:var(--cnt-bg-a)}.tp-tabv_t::before{background-color:currentColor;bottom:0;content:"";height:2px;left:0;pointer-events:none;position:absolute;right:0}.tp-tabv.tp-v-disabled .tp-tabv_t::before{opacity:.5}.tp-tabv.tp-tabv-nop .tp-tabv_t{height:calc(var(--cnt-usz) + 4px);position:relative}.tp-tabv.tp-tabv-nop .tp-tabv_t::before{background-color:var(--cnt-bg);bottom:0;content:"";height:2px;left:0;position:absolute;right:0}.tp-tabv_i{bottom:0;color:var(--cnt-bg);left:0;overflow:hidden;position:absolute;top:calc(var(--cnt-usz) + 4px);width:max(var(--bs-br),4px)}.tp-tabv_i::before{background-color:currentColor;bottom:0;content:"";left:0;position:absolute;top:0;width:4px}.tp-tabv_t:hover+.tp-tabv_i{color:var(--cnt-bg-h)}.tp-tabv_t:has(*:focus)+.tp-tabv_i{color:var(--cnt-bg-f)}.tp-tabv_t:has(*:active)+.tp-tabv_i{color:var(--cnt-bg-a)}.tp-tabv.tp-v-disabled>.tp-tabv_i{opacity:.5}.tp-tbiv{flex:1;min-width:0;position:relative}.tp-tbiv+.tp-tbiv{margin-left:2px}.tp-tbiv+.tp-tbiv.tp-v-disabled::before{opacity:.5}.tp-tbiv_b{display:block;padding-left:calc(var(--cnt-hp) + 4px);padding-right:calc(var(--cnt-hp) + 4px);position:relative;width:100%}.tp-tbiv_b:disabled{opacity:.5}.tp-tbiv_b::before{background-color:var(--cnt-bg);content:"";inset:0 0 2px;pointer-events:none;position:absolute}.tp-tbiv_b:hover::before{background-color:var(--cnt-bg-h)}.tp-tbiv_b:focus::before{background-color:var(--cnt-bg-f)}.tp-tbiv_b:active::before{background-color:var(--cnt-bg-a)}.tp-tbiv_t{color:var(--cnt-fg);height:calc(var(--cnt-usz) + 4px);line-height:calc(var(--cnt-usz) + 4px);opacity:.5;overflow:hidden;position:relative;text-overflow:ellipsis}.tp-tbiv.tp-tbiv-sel .tp-tbiv_t{opacity:1}.tp-tbpv_c{padding-bottom:var(--cnt-vp);padding-left:4px;padding-top:var(--cnt-vp)}.tp-txtv{position:relative}.tp-txtv_i{padding-left:var(--bld-hp);padding-right:var(--bld-hp)}.tp-txtv.tp-txtv-fst .tp-txtv_i{border-bottom-right-radius:0;border-top-right-radius:0}.tp-txtv.tp-txtv-mid .tp-txtv_i{border-radius:0}.tp-txtv.tp-txtv-lst .tp-txtv_i{border-bottom-left-radius:0;border-top-left-radius:0}.tp-txtv.tp-txtv-num .tp-txtv_i{text-align:right}.tp-txtv.tp-txtv-drg .tp-txtv_i{opacity:.3}.tp-txtv_k{cursor:pointer;height:100%;left:calc(var(--bld-hp) - 5px);position:absolute;top:0;width:12px}.tp-txtv_k::before{background-color:var(--in-fg);border-radius:1px;bottom:0;content:"";height:calc(var(--cnt-usz) - 4px);left:50%;margin-bottom:auto;margin-left:-1px;margin-top:auto;opacity:.1;position:absolute;top:0;transition:border-radius .1s,height .1s,transform .1s,width .1s;width:2px}.tp-txtv_k:hover::before,.tp-txtv.tp-txtv-drg .tp-txtv_k::before{opacity:1}.tp-txtv.tp-txtv-drg .tp-txtv_k::before{border-radius:50%;height:4px;transform:translateX(-1px);width:4px}.tp-txtv_g{bottom:0;display:block;height:8px;left:50%;margin:auto;overflow:visible;pointer-events:none;position:absolute;top:0;visibility:hidden;width:100%}.tp-txtv.tp-txtv-drg .tp-txtv_g{visibility:visible}.tp-txtv_gb{fill:none;stroke:var(--in-fg);stroke-dasharray:1}.tp-txtv_gh{fill:none;stroke:var(--in-fg)}.tp-txtv .tp-ttv{margin-left:6px;visibility:hidden}.tp-txtv.tp-txtv-drg .tp-ttv{visibility:visible}.tp-ttv{background-color:var(--in-fg);border-radius:var(--bld-br);color:var(--bs-bg);padding:2px 4px;pointer-events:none;position:absolute;transform:translate(-50%, -100%)}.tp-ttv::before{border-color:var(--in-fg) rgba(0,0,0,0) rgba(0,0,0,0) rgba(0,0,0,0);border-style:solid;border-width:2px;box-sizing:border-box;content:"";font-size:.9em;height:4px;left:50%;margin-left:-2px;position:absolute;top:100%;width:4px}.tp-rotv{background-color:var(--bs-bg);border-radius:var(--bs-br);box-shadow:0 2px 4px var(--bs-sh);font-family:var(--bs-ff);font-size:11px;font-weight:500;line-height:1;text-align:left}.tp-rotv_b{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br);border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br);padding-left:calc(4px + var(--cnt-usz) + var(--cnt-hp));text-align:center}.tp-rotv.tp-rotv-expanded .tp-rotv_b{border-bottom-left-radius:0;border-bottom-right-radius:0;transition-delay:0s;transition-duration:0s}.tp-rotv.tp-rotv-not>.tp-rotv_b{display:none}.tp-rotv_b:disabled .tp-rotv_m{display:none}.tp-rotv_c>.tp-fldv.tp-v-lst>.tp-fldv_c{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br)}.tp-rotv_c>.tp-fldv.tp-v-lst>.tp-fldv_i{border-bottom-left-radius:var(--bs-br)}.tp-rotv_c>.tp-fldv.tp-v-lst:not(.tp-fldv-expanded)>.tp-fldv_b{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br)}.tp-rotv_c>.tp-fldv.tp-v-lst.tp-fldv-expanded>.tp-fldv_b{transition-delay:0s;transition-duration:0s}.tp-rotv_c .tp-fldv.tp-v-vlst:not(.tp-fldv-expanded)>.tp-fldv_b{border-bottom-right-radius:var(--bs-br)}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-fldv.tp-v-fst{margin-top:calc(-1*var(--cnt-vp))}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-fldv.tp-v-fst>.tp-fldv_b{border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br)}.tp-rotv_c>.tp-tabv.tp-v-lst>.tp-tabv_c{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br)}.tp-rotv_c>.tp-tabv.tp-v-lst>.tp-tabv_i{border-bottom-left-radius:var(--bs-br)}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-tabv.tp-v-fst{margin-top:calc(-1*var(--cnt-vp))}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-tabv.tp-v-fst>.tp-tabv_t{border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br)}.tp-rotv.tp-v-disabled,.tp-rotv .tp-v-disabled{pointer-events:none}.tp-rotv.tp-v-hidden,.tp-rotv .tp-v-hidden{display:none}.tp-sprv_r{background-color:var(--grv-fg);border-width:0;display:block;height:2px;margin:0;width:100%}.tp-sprv.tp-v-disabled .tp-sprv_r{opacity:.5}',
            plugins: [
                ListBladePlugin,
                SeparatorBladePlugin,
                SliderBladePlugin,
                TabBladePlugin,
                TextBladePlugin,
            ],
        });
    }
}

const VERSION = new Semver('4.0.5');




/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGliLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGVBQWU7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDLGFBQWEsMEJBQTBCLGtDQUFrQyxhQUFhLDRCQUE0QjtBQUM5SixLQUFLLElBQUk7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDJEQUEyRCxhQUFhO0FBQ3hFLHNFQUFzRSxZQUFZO0FBQ2xGLDBEQUEwRCwrQkFBK0I7QUFDekY7QUFDQSxnRUFBZ0UsV0FBVztBQUMzRSxnREFBZ0QsYUFBYTtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2Qix5QkFBeUI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixTQUFTLEdBQUcsR0FBRztBQUN0QyxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBLDZCQUE2QiwyQkFBMkI7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdFQUF3RSxTQUFTLGNBQWM7QUFDL0Y7QUFDQTtBQUNBLGtFQUFrRSxTQUFTLGNBQWM7QUFDekY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTLElBQUk7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RCxjQUFjO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyREFBMkQsY0FBYztBQUN6RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0JBQXdCLG9CQUFvQjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3RUFBd0UsU0FBUyxjQUFjO0FBQy9GO0FBQ0E7QUFDQTtBQUNBLGtFQUFrRSxTQUFTLGNBQWM7QUFDekY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxVQUFVLHFCQUFxQjtBQUMzRSxLQUFLLElBQUk7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1SUFBdUk7QUFDdkk7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsZ0JBQWdCO0FBQ2xELCtCQUErQixhQUFhO0FBQzVDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLHNEQUFzRDtBQUN0RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULDRDQUE0QyxhQUFhO0FBQ3pEO0FBQ0E7QUFDQSxhQUFhLHlCQUF5QjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLHlGQUF5Riw0QkFBNEIsa0xBQWtMO0FBQ3ZTO0FBQ0E7O0FBRUE7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdFQUF3RSxTQUFTLGNBQWM7QUFDL0Y7QUFDQTtBQUNBLGtFQUFrRSxTQUFTLGNBQWM7QUFDekY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwREFBMEQ7QUFDMUQ7QUFDQTtBQUNBLHlGQUF5RjtBQUN6RjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSwyQkFBMkIsaUJBQWlCO0FBQzVDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsMEJBQTBCLGlCQUFpQjtBQUMzQyxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7O0FBRUQ7QUFDQSxzREFBc0QsYUFBYSxnQkFBZ0I7QUFDbkY7QUFDQTtBQUNBLHNEQUFzRCxhQUFhLGdCQUFnQjtBQUNuRjtBQUNBO0FBQ0Esc0RBQXNELGFBQWEsYUFBYTtBQUNoRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdELFFBQVE7QUFDaEU7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLFNBQVM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsNENBQTRDLGFBQWE7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLGVBQWU7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCwwQkFBMEIsaUJBQWlCO0FBQzNDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULDRDQUE0QyxhQUFhO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBLGFBQWEsZUFBZTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdEQUF3RCwwQkFBMEI7QUFDbEY7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSx3REFBd0QsZ0JBQWdCLGtKQUFrSjtBQUMxTjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxjQUFjO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsa0NBQWtDO0FBQ3ZELEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEseUJBQXlCLHdDQUF3QztBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RCxVQUFVLE1BQU0sSUFBSSxNQUFNLFVBQVUsVUFBVSxFQUFFLE9BQU8sRUFBRTtBQUNySCxnRUFBZ0UsRUFBRTtBQUNsRTtBQUNBO0FBQ0EsMENBQTBDLEVBQUU7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxFQUFFO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsaUJBQWlCO0FBQ2pDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0ZBQXNGLGtDQUFrQyxJQUFJLHdGQUF3RjtBQUNwTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNGQUFzRixrQ0FBa0MsSUFBSSx3RkFBd0Y7QUFDcE47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0QsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFO0FBQ3hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRTtBQUN6RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsaUdBQWlHO0FBQzlIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsaUlBQWlJO0FBQzlKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EsNkNBQTZDLDJCQUEyQjtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QyxRQUFRLGFBQWE7QUFDbEU7QUFDQTtBQUNBLDZDQUE2QyxRQUFRLFlBQVk7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsSUFBSTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxPQUFPLEVBQUUsTUFBTTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLE9BQU8sRUFBRSxNQUFNO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsaUJBQWlCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsbUJBQW1CLGlCQUFpQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsaUJBQWlCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixpQkFBaUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdGQUF3RixhQUFhLElBQUksZ0JBQWdCO0FBQ3pILGFBQWEsRUFBRSxrQkFBa0I7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixhQUFhLElBQUksZ0JBQWdCO0FBQ25ELEtBQUs7QUFDTCxhQUFhLEVBQUUsa0JBQWtCO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhEQUE4RCx3QkFBd0I7QUFDdEY7QUFDQTtBQUNBLHlDQUF5QyxLQUFLO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLDJCQUEyQjtBQUNyQyxVQUFVLDJCQUEyQjtBQUNyQyxVQUFVLDJCQUEyQjtBQUNyQyxVQUFVLDJCQUEyQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLEtBQUs7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixhQUFhO0FBQ3RDLDZCQUE2QixZQUFZO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxLQUFLO0FBQzlDO0FBQ0Esd0NBQXdDLElBQUk7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQSxrRUFBa0UsZ0JBQWdCO0FBQ2xGLHFCQUFxQjtBQUNyQjtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsbUJBQW1CO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRCxhQUFhLDZDQUE2QztBQUNoSDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRCxhQUFhLG1GQUFtRjtBQUN0SjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRCxhQUFhLDBDQUEwQztBQUM3RztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLFlBQVksNElBQTRJO0FBQzVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlGQUFpRiwyQ0FBMkMsb0ZBQW9GO0FBQ2hOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5RkFBeUYsc0RBQXNELG1CQUFtQiwwR0FBMEcsT0FBTyw4REFBOEQ7QUFDalY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCxHQUFHO0FBQ3hELHFEQUFxRCxJQUFJO0FBQ3pELHlDQUF5QyxHQUFHO0FBQzVDLHdDQUF3QyxJQUFJO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0VBQW9FO0FBQ3BFLG9FQUFvRTtBQUNwRTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0hBQWtIO0FBQ2xILGtIQUFrSDtBQUNsSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlGQUFpRixvQ0FBb0Msc05BQXNOLG9DQUFvQyw4QkFBOEIsSUFBSTtBQUNqWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5R0FBeUc7QUFDekcsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0VBQW9FO0FBQ3BFLG9FQUFvRTtBQUNwRSxvRUFBb0U7QUFDcEU7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlGQUFpRixvQ0FBb0MseUxBQXlMO0FBQzlTO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5R0FBeUc7QUFDekcsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvRUFBb0U7QUFDcEUsb0VBQW9FO0FBQ3BFLG9FQUFvRTtBQUNwRSxvRUFBb0U7QUFDcEU7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlGQUFpRixvQ0FBb0MsME9BQTBPO0FBQy9WO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUdBQXlHO0FBQ3pHLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsK0JBQStCLE1BQU0sWUFBWTtBQUNqRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQywrQkFBK0IsTUFBTSxZQUFZO0FBQzVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0Isa0NBQWtDO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLEdBQUc7QUFDdkMsbUNBQW1DLEdBQUc7QUFDdEMscUNBQXFDLHVCQUF1QjtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsaUJBQWlCO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLDhCQUE4QixpQkFBaUI7QUFDL0MsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxhQUFhO0FBQ3pEO0FBQ0EsYUFBYSxHQUFHO0FBQ2hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsMEJBQTBCLGlCQUFpQjtBQUMzQyxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULDBCQUEwQixpQkFBaUI7QUFDM0MsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNULHlGQUF5RjtBQUN6RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxNQUFNLDBEQUEwRDtBQUN6RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYiw4QkFBOEIsaUJBQWlCO0FBQy9DLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxHQUFHO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxVQUFVO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlNQUFpTSx3QkFBd0IscUJBQXFCLGdCQUFnQiwrQkFBK0IsZUFBZSxvQkFBb0Isa0JBQWtCLG9CQUFvQixTQUFTLGFBQWEsVUFBVSxpQ0FBaUMsK0JBQStCLDRCQUE0QixvQkFBb0IsZUFBZSxjQUFjLGlCQUFpQixzQkFBc0IsMkJBQTJCLGdCQUFnQix1QkFBdUIsbUJBQW1CLG1EQUFtRCxpQ0FBaUMsbURBQW1ELGlDQUFpQyxzREFBc0QsaUNBQWlDLDREQUE0RCxXQUFXLHVGQUF1RixxQ0FBcUMsd0hBQXdILDRCQUE0Qix3SEFBd0gsNEJBQTRCLG9GQUFvRiwwQkFBMEIsa05BQWtOLHlCQUF5QixnUEFBZ1AseUJBQXlCLDBSQUEwUixhQUFhLHdDQUF3QyxnQkFBZ0IsOERBQThELHFDQUFxQyx3Q0FBd0MsZ0dBQWdHLDRCQUE0Qiw4REFBOEQsd0NBQXdDLGdGQUFnRix5QkFBeUIsZ0ZBQWdGLHlCQUF5Qiw4REFBOEQscUNBQXFDLDhEQUE4RCx3Q0FBd0Msc0JBQXNCLCtCQUErQixvQkFBb0IsZUFBZSxjQUFjLGtDQUFrQyx1Q0FBdUMsZ0JBQWdCLDJCQUEyQix5REFBeUQsa0JBQWtCLGdCQUFnQix1QkFBdUIsbUJBQW1CLFdBQVcsNkNBQTZDLGtDQUFrQyxpQ0FBaUMsa0NBQWtDLGlDQUFpQyxvQ0FBb0MsaUNBQWlDLHdDQUF3QyxXQUFXLHNCQUFzQiwySEFBMkgsa0JBQWtCLFNBQVMsV0FBVyxjQUFjLFdBQVcsaUVBQWlFLFlBQVksV0FBVyxrQkFBa0IsTUFBTSx3QkFBd0IscUNBQXFDLFVBQVUscUZBQXFGLGVBQWUsc0JBQXNCLHNCQUFzQixTQUFTLFVBQVUsZ0JBQWdCLGlCQUFpQixjQUFjLGtCQUFrQiw2RUFBNkUsOEdBQThHLGFBQWEsMEVBQTBFLFVBQVUsNkJBQTZCLDBCQUEwQixlQUFlLGlCQUFpQixpRkFBaUYscUNBQXFDLDhCQUE4Qiw0QkFBNEIsc0JBQXNCLG1CQUFtQixvQkFBb0Isc0JBQXNCLDJCQUEyQixZQUFZLFdBQVcsdURBQXVELGdDQUFnQyx1REFBdUQsZ0NBQWdDLDBEQUEwRCxnQ0FBZ0MsZ0VBQWdFLFdBQVcsdUJBQXVCLGtCQUFrQixXQUFXLHFCQUFxQixXQUFXLDBCQUEwQixTQUFTLFlBQVksb0JBQW9CLGtCQUFrQixVQUFVLE1BQU0sa0NBQWtDLFNBQVMsWUFBWSxZQUFZLGtCQUFrQixRQUFRLE1BQU0sV0FBVyw0Q0FBNEMsa0JBQWtCLGlDQUFpQyw4QkFBOEIsNEJBQTRCLHNCQUFzQixtQkFBbUIsc0JBQXNCLDJDQUEyQyxxQkFBcUIsV0FBVywwRkFBMEYsV0FBVyxVQUFVLCtHQUErRywrQkFBK0IsNEdBQTRHLDRCQUE0Qiw4QkFBOEIsK0JBQStCLGtCQUFrQiwwQkFBMEIsYUFBYSw0QkFBNEIsV0FBVyxnSEFBZ0gsZ0JBQWdCLFNBQVMsNERBQTRELDJDQUEyQyw2RkFBNkYseURBQXlELDZDQUE2QyxrREFBa0QsNkNBQTZDLCtEQUErRCw4REFBOEQsNkRBQTZELDZEQUE2RCwrREFBK0QseUVBQXlFLG1GQUFtRixpRkFBaUYsa0ZBQWtGLGtFQUFrRSxzREFBc0Qsb0RBQW9ELGlEQUFpRCwrQ0FBK0Msb0VBQW9FLDhFQUE4RSw0RUFBNEUsNkVBQTZFLDZEQUE2RCxxRUFBcUUsZ0VBQWdFLHNFQUFzRSxzRUFBc0UsV0FBVyxXQUFXLFdBQVcsa0JBQWtCLFdBQVcsY0FBYyxrQkFBa0IsV0FBVyxPQUFPLFVBQVUsa0JBQWtCLE1BQU0sV0FBVyw4QkFBOEIsNEJBQTRCLGVBQWUsY0FBYyxzQkFBc0Isa0JBQWtCLHFCQUFxQixlQUFlLGNBQWMsWUFBWSxRQUFRLFlBQVksVUFBVSxrQkFBa0IsV0FBVyxvQkFBb0IsVUFBVSxvQkFBb0IsZUFBZSw0QkFBNEIsZ0NBQWdDLDRCQUE0QixnQ0FBZ0MsNkJBQTZCLGdDQUFnQyxrQ0FBa0MsVUFBVSxrQ0FBa0MsV0FBVyxTQUFTLGtCQUFrQixXQUFXLGFBQWEsV0FBVyxZQUFZLGNBQWMscUJBQXFCLFdBQVcsT0FBTyxnQkFBZ0IsV0FBVyxTQUFTLGFBQWEsVUFBVSxnQkFBZ0IsNEVBQTRFLGlEQUFpRCxpQkFBaUIscUNBQXFDLDBCQUEwQixVQUFVLGtCQUFrQiw0QkFBNEIsNkJBQTZCLG1CQUFtQix5QkFBeUIsZ0JBQWdCLGlCQUFpQixZQUFZLDBCQUEwQixjQUFjLGFBQWEsMEJBQTBCLFdBQVcsWUFBWSxhQUFhLHlCQUF5QixzQ0FBc0Msa0JBQWtCLG9CQUFvQiwrQkFBK0IsV0FBVyxXQUFXLDRCQUE0QixrQkFBa0IsNkJBQTZCLE1BQU0sNENBQTRDLFdBQVcsYUFBYSxtQkFBbUIsYUFBYSxPQUFPLGFBQWEsT0FBTyxnQkFBZ0IsU0FBUyw0QkFBNEIsYUFBYSxnQkFBZ0Isa0JBQWtCLHVCQUF1QixXQUFXLFdBQVcsaUJBQWlCLGNBQWMsOEJBQThCLFdBQVcsV0FBVyxtQkFBbUIsdUNBQXVDLHNCQUFzQiwrQ0FBK0MsWUFBWSxpQkFBaUIsZ0JBQWdCLG9CQUFvQixrQkFBa0IsV0FBVywwQkFBMEIsa0JBQWtCLFNBQVMsZUFBZSxzQkFBc0IsYUFBYSxrQkFBa0IsdUJBQXVCLFdBQVcsV0FBVyxvQ0FBb0MsaUxBQWlMLDZCQUE2Qiw0QkFBNEIsMEJBQTBCLGtCQUFrQixjQUFjLFdBQVcsT0FBTyxnQkFBZ0Isa0JBQWtCLFFBQVEsV0FBVyxXQUFXLDRCQUE0Qix1Q0FBdUMsa0NBQWtDLHNCQUFzQixZQUFZLFNBQVMsaUJBQWlCLGdCQUFnQixrQkFBa0IsUUFBUSxXQUFXLDBCQUEwQixrQkFBa0IsU0FBUyxlQUFlLHNCQUFzQixhQUFhLGtCQUFrQixXQUFXLHVCQUF1QixXQUFXLFdBQVcsc0JBQXNCLHlMQUF5TCx3QkFBd0IsZ0NBQWdDLGtCQUFrQixjQUFjLFdBQVcsT0FBTyxnQkFBZ0IsZ0JBQWdCLGtCQUFrQixRQUFRLFdBQVcsV0FBVyxRQUFRLGtCQUFrQixXQUFXLHNCQUFzQix5TEFBeUwsMEJBQTBCLGdDQUFnQyw0QkFBNEIsa0NBQWtDLFlBQVksU0FBUyxpQkFBaUIsZ0JBQWdCLGdCQUFnQixrQkFBa0IsUUFBUSxXQUFXLFdBQVcsNEJBQTRCLHVDQUF1QyxzQkFBc0IsUUFBUSxrQkFBa0IsMEJBQTBCLGtCQUFrQixXQUFXLHNCQUFzQix5TEFBeUwsMEJBQTBCLGdDQUFnQyw0QkFBNEIsZ0JBQWdCLHlCQUF5QixXQUFXLGNBQWMsZ0JBQWdCLGFBQWEsZUFBZSxjQUFjLHNCQUFzQixPQUFPLGtCQUFrQixNQUFNLHFCQUFxQiwwQkFBMEIsdUNBQXVDLDRCQUE0QixXQUFXLGNBQWMsUUFBUSxrQkFBa0IsWUFBWSxhQUFhLFdBQVcsY0FBYyxpQkFBaUIsZUFBZSw0QkFBNEIsb0JBQW9CLGVBQWUsc0JBQXNCLDJCQUEyQixxQkFBcUIscUJBQXFCLGdDQUFnQyxxQkFBcUIsZ0NBQWdDLHNCQUFzQixnQ0FBZ0MsZUFBZSxvQkFBb0IseUNBQXlDLFdBQVcsY0FBYyxPQUFPLFNBQVMsa0JBQWtCLFFBQVEsVUFBVSxZQUFZLFNBQVMsa0JBQWtCLFdBQVcsaUJBQWlCLCtCQUErQixhQUFhLFdBQVcsaUJBQWlCLFdBQVcsU0FBUyxvQkFBb0IsT0FBTyxnQkFBZ0Isa0JBQWtCLCtCQUErQiw0QkFBNEIsbUJBQW1CLDhCQUE4QixTQUFTLFdBQVcsT0FBTyxrQkFBa0IsTUFBTSxVQUFVLDRCQUE0QixzQkFBc0IsNEJBQTRCLHNCQUFzQiw2QkFBNkIsc0JBQXNCLGtDQUFrQyxXQUFXLFNBQVMsa0JBQWtCLFdBQVcsY0FBYyw4QkFBOEIsb0JBQW9CLFVBQVUsb0JBQW9CLHNCQUFzQixXQUFXLGdCQUFnQiw4QkFBOEIsa0JBQWtCLHVCQUF1QixtQkFBbUIsd0JBQXdCLGdCQUFnQixrQ0FBa0MsV0FBVyxpQkFBaUIsOEJBQThCLHlCQUF5Qiw4QkFBOEIsU0FBUyxtQkFBbUIsYUFBYSxnQkFBZ0IsMkJBQTJCLDRCQUE0QixxQkFBcUIsY0FBYyxXQUFXLG9CQUFvQixPQUFPLHFCQUFxQixhQUFhLGdCQUFnQixpQkFBaUIsbUJBQW1CLGtDQUFrQyxXQUFXLGdDQUFnQyxhQUFhLFdBQVcsc0JBQXNCLFlBQVksY0FBYyxvQkFBb0IsZ0NBQWdDLFdBQVcsV0FBVywrQkFBK0IsV0FBVyxXQUFXLG9CQUFvQixXQUFXLDJCQUEyQiw0QkFBNEIsa0NBQWtDLFdBQVcsV0FBVyxjQUFjLDhCQUE4QiwyQkFBMkIsMkJBQTJCLDRCQUE0QixZQUFZLGdCQUFnQixrQ0FBa0MsV0FBVyxTQUFTLGtCQUFrQixXQUFXLGFBQWEsV0FBVyxzQkFBc0IsaUJBQWlCLGtCQUFrQixxQkFBcUIsZUFBZSxjQUFjLFlBQVksU0FBUyxpQkFBaUIsZ0JBQWdCLGtCQUFrQixRQUFRLFdBQVcsb0JBQW9CLG9CQUFvQixlQUFlLHNCQUFzQixrQkFBa0IsV0FBVyxPQUFPLFdBQVcsU0FBUyxhQUFhLFVBQVUsZ0JBQWdCLDRFQUE0RSxxQ0FBcUMsMEJBQTBCLFVBQVUsa0JBQWtCLDRCQUE0Qiw2QkFBNkIsbUJBQW1CLFVBQVUsd0NBQXdDLFlBQVksaUJBQWlCLFNBQVMsZ0JBQWdCLG9CQUFvQixrQkFBa0Isb0NBQW9DLFdBQVcsWUFBWSxjQUFjLFlBQVksT0FBTyxvQkFBb0Isa0JBQWtCLE1BQU0sV0FBVyxhQUFhLFdBQVcsb0JBQW9CLG1CQUFtQixZQUFZLFdBQVcsb0JBQW9CLG1CQUFtQixZQUFZLDhCQUE4QixrQkFBa0Isc0JBQXNCLFdBQVcsaUJBQWlCLGdCQUFnQixrQkFBa0IsVUFBVSw4QkFBOEIsOEJBQThCLGVBQWUsU0FBUyw4QkFBOEIsMkJBQTJCLGtDQUFrQyxhQUFhLHdCQUF3QixvQ0FBb0Msa0JBQWtCLGtCQUFrQixhQUFhLG1CQUFtQixjQUFjLG1CQUFtQix1QkFBdUIsV0FBVyxXQUFXLHNCQUFzQixlQUFlLHNCQUFzQixhQUFhLGFBQWEsa0JBQWtCLG1CQUFtQiw4QkFBOEIsa0JBQWtCLFdBQVcsY0FBYyxXQUFXLFFBQVEsWUFBWSxrQkFBa0IsV0FBVyxZQUFZLE9BQU8sa0JBQWtCLE1BQU0sbUJBQW1CLDhCQUE4QixrQkFBa0IsV0FBVyxjQUFjLFdBQVcsUUFBUSxtQkFBbUIsZ0JBQWdCLGtCQUFrQixrQkFBa0IsK0JBQStCLDRCQUE0QixTQUFTLFdBQVcsY0FBYyxZQUFZLG1CQUFtQixnQkFBZ0Isa0JBQWtCLFdBQVcsTUFBTSxXQUFXLG1DQUFtQyxpQ0FBaUMsbUNBQW1DLGlDQUFpQyxvQ0FBb0MsaUNBQWlDLFlBQVksYUFBYSxjQUFjLE9BQU8sY0FBYyxPQUFPLGdCQUFnQixTQUFTLGtCQUFrQixXQUFXLHFCQUFxQixvQkFBb0IsYUFBYSxnQkFBZ0Isa0JBQWtCLGlCQUFpQixzQkFBc0Isd0JBQXdCLHNCQUFzQix5QkFBeUIsc0JBQXNCLG1CQUFtQiw4QkFBOEIsU0FBUyxXQUFXLFdBQVcsT0FBTyxvQkFBb0Isa0JBQWtCLFFBQVEsMENBQTBDLFdBQVcsZ0NBQWdDLGtDQUFrQyxrQkFBa0Isd0NBQXdDLCtCQUErQixTQUFTLFdBQVcsV0FBVyxPQUFPLGtCQUFrQixRQUFRLFdBQVcsU0FBUyxvQkFBb0IsT0FBTyxnQkFBZ0Isa0JBQWtCLCtCQUErQiw0QkFBNEIsbUJBQW1CLDhCQUE4QixTQUFTLFdBQVcsT0FBTyxrQkFBa0IsTUFBTSxVQUFVLDRCQUE0QixzQkFBc0IsbUNBQW1DLHNCQUFzQixvQ0FBb0Msc0JBQXNCLGtDQUFrQyxXQUFXLFNBQVMsT0FBTyxZQUFZLGtCQUFrQixrQkFBa0IsZ0JBQWdCLHdDQUF3QyxXQUFXLFdBQVcsY0FBYyx1Q0FBdUMsd0NBQXdDLGtCQUFrQixXQUFXLG9CQUFvQixXQUFXLG1CQUFtQiwrQkFBK0IsV0FBVyxjQUFjLG9CQUFvQixrQkFBa0IseUJBQXlCLGlDQUFpQyx5QkFBeUIsaUNBQWlDLDBCQUEwQixpQ0FBaUMsV0FBVyxvQkFBb0Isa0NBQWtDLHVDQUF1QyxXQUFXLGdCQUFnQixrQkFBa0IsdUJBQXVCLGdDQUFnQyxVQUFVLFdBQVcsNkJBQTZCLGlCQUFpQiwwQkFBMEIsU0FBUyxrQkFBa0IsV0FBVywyQkFBMkIsNEJBQTRCLGdDQUFnQyw2QkFBNkIsMEJBQTBCLGdDQUFnQyxnQkFBZ0IsZ0NBQWdDLDRCQUE0Qix5QkFBeUIsZ0NBQWdDLGlCQUFpQixnQ0FBZ0MsV0FBVyxXQUFXLGVBQWUsWUFBWSwrQkFBK0Isa0JBQWtCLE1BQU0sV0FBVyxtQkFBbUIsOEJBQThCLGtCQUFrQixTQUFTLFdBQVcsa0NBQWtDLFNBQVMsbUJBQW1CLGlCQUFpQixnQkFBZ0IsV0FBVyxrQkFBa0IsTUFBTSxnRUFBZ0UsVUFBVSxpRUFBaUUsVUFBVSx3Q0FBd0Msa0JBQWtCLFdBQVcsMkJBQTJCLFVBQVUsV0FBVyxTQUFTLGNBQWMsV0FBVyxTQUFTLFlBQVksaUJBQWlCLG9CQUFvQixrQkFBa0IsTUFBTSxrQkFBa0IsV0FBVyxnQ0FBZ0MsbUJBQW1CLFlBQVksVUFBVSxvQkFBb0IsbUJBQW1CLFlBQVksVUFBVSxvQkFBb0IsaUJBQWlCLGdCQUFnQixrQkFBa0IsNkJBQTZCLG1CQUFtQixRQUFRLDhCQUE4Qiw0QkFBNEIsbUJBQW1CLGdCQUFnQixvQkFBb0Isa0JBQWtCLGlDQUFpQyxnQkFBZ0Isb0VBQW9FLG1CQUFtQixpQkFBaUIsc0JBQXNCLFdBQVcsZUFBZSxXQUFXLFNBQVMsaUJBQWlCLGtCQUFrQixTQUFTLFVBQVUsU0FBUyw4QkFBOEIsMkJBQTJCLGtDQUFrQyx5QkFBeUIsZUFBZSxnQkFBZ0IsY0FBYyxnQkFBZ0IsV0FBVyx1Q0FBdUMsd0NBQXdDLG9DQUFvQyxxQ0FBcUMsd0RBQXdELGtCQUFrQixxQ0FBcUMsNEJBQTRCLDZCQUE2QixvQkFBb0IsdUJBQXVCLGdDQUFnQyxhQUFhLCtCQUErQixhQUFhLHdDQUF3Qyx1Q0FBdUMsd0NBQXdDLHdDQUF3Qyx1Q0FBdUMsK0RBQStELHVDQUF1Qyx3Q0FBd0MseURBQXlELG9CQUFvQix1QkFBdUIsZ0VBQWdFLHdDQUF3QyxrREFBa0Qsa0NBQWtDLDZEQUE2RCxvQ0FBb0MscUNBQXFDLHdDQUF3Qyx1Q0FBdUMsd0NBQXdDLHdDQUF3Qyx1Q0FBdUMsa0RBQWtELGtDQUFrQyw2REFBNkQsb0NBQW9DLHFDQUFxQywrQ0FBK0Msb0JBQW9CLDJDQUEyQyxhQUFhLFdBQVcsK0JBQStCLGVBQWUsY0FBYyxXQUFXLFNBQVMsV0FBVyxrQ0FBa0MsV0FBVztBQUM3NXZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7O0FBRStNIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2ViZ2wvLi9ub2RlX21vZHVsZXMvdHdlYWtwYW5lL2Rpc3QvdHdlYWtwYW5lLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISBUd2Vha3BhbmUgNC4wLjUgKGMpIDIwMTYgY29jb3BvbiwgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLiAqL1xuZnVuY3Rpb24gZm9yY2VDYXN0KHYpIHtcbiAgICByZXR1cm4gdjtcbn1cbmZ1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZDtcbn1cbmZ1bmN0aW9uIGlzT2JqZWN0JDEodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jztcbn1cbmZ1bmN0aW9uIGlzUmVjb3JkKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCc7XG59XG5mdW5jdGlvbiBkZWVwRXF1YWxzQXJyYXkoYTEsIGEyKSB7XG4gICAgaWYgKGExLmxlbmd0aCAhPT0gYTIubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhMS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYTFbaV0gIT09IGEyW2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5mdW5jdGlvbiBkZWVwTWVyZ2UocjEsIHIyKSB7XG4gICAgY29uc3Qga2V5cyA9IEFycmF5LmZyb20obmV3IFNldChbLi4uT2JqZWN0LmtleXMocjEpLCAuLi5PYmplY3Qua2V5cyhyMildKSk7XG4gICAgcmV0dXJuIGtleXMucmVkdWNlKChyZXN1bHQsIGtleSkgPT4ge1xuICAgICAgICBjb25zdCB2MSA9IHIxW2tleV07XG4gICAgICAgIGNvbnN0IHYyID0gcjJba2V5XTtcbiAgICAgICAgcmV0dXJuIGlzUmVjb3JkKHYxKSAmJiBpc1JlY29yZCh2MilcbiAgICAgICAgICAgID8gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCByZXN1bHQpLCB7IFtrZXldOiBkZWVwTWVyZ2UodjEsIHYyKSB9KSA6IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgcmVzdWx0KSwgeyBba2V5XToga2V5IGluIHIyID8gdjIgOiB2MSB9KTtcbiAgICB9LCB7fSk7XG59XG5cbmZ1bmN0aW9uIGlzQmluZGluZyh2YWx1ZSkge1xuICAgIGlmICghaXNPYmplY3QkMSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gJ3RhcmdldCcgaW4gdmFsdWU7XG59XG5cbmNvbnN0IENSRUFURV9NRVNTQUdFX01BUCA9IHtcbiAgICBhbHJlYWR5ZGlzcG9zZWQ6ICgpID0+ICdWaWV3IGhhcyBiZWVuIGFscmVhZHkgZGlzcG9zZWQnLFxuICAgIGludmFsaWRwYXJhbXM6IChjb250ZXh0KSA9PiBgSW52YWxpZCBwYXJhbWV0ZXJzIGZvciAnJHtjb250ZXh0Lm5hbWV9J2AsXG4gICAgbm9tYXRjaGluZ2NvbnRyb2xsZXI6IChjb250ZXh0KSA9PiBgTm8gbWF0Y2hpbmcgY29udHJvbGxlciBmb3IgJyR7Y29udGV4dC5rZXl9J2AsXG4gICAgbm9tYXRjaGluZ3ZpZXc6IChjb250ZXh0KSA9PiBgTm8gbWF0Y2hpbmcgdmlldyBmb3IgJyR7SlNPTi5zdHJpbmdpZnkoY29udGV4dC5wYXJhbXMpfSdgLFxuICAgIG5vdGJpbmRhYmxlOiAoKSA9PiBgVmFsdWUgaXMgbm90IGJpbmRhYmxlYCxcbiAgICBub3Rjb21wYXRpYmxlOiAoY29udGV4dCkgPT4gYE5vdCBjb21wYXRpYmxlIHdpdGggIHBsdWdpbiAnJHtjb250ZXh0LmlkfSdgLFxuICAgIHByb3BlcnR5bm90Zm91bmQ6IChjb250ZXh0KSA9PiBgUHJvcGVydHkgJyR7Y29udGV4dC5uYW1lfScgbm90IGZvdW5kYCxcbiAgICBzaG91bGRuZXZlcmhhcHBlbjogKCkgPT4gJ1RoaXMgZXJyb3Igc2hvdWxkIG5ldmVyIGhhcHBlbicsXG59O1xuY2xhc3MgVHBFcnJvciB7XG4gICAgc3RhdGljIGFscmVhZHlEaXNwb3NlZCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUcEVycm9yKHsgdHlwZTogJ2FscmVhZHlkaXNwb3NlZCcgfSk7XG4gICAgfVxuICAgIHN0YXRpYyBub3RCaW5kYWJsZSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUcEVycm9yKHtcbiAgICAgICAgICAgIHR5cGU6ICdub3RiaW5kYWJsZScsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzdGF0aWMgbm90Q29tcGF0aWJsZShidW5kbGVJZCwgaWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUcEVycm9yKHtcbiAgICAgICAgICAgIHR5cGU6ICdub3Rjb21wYXRpYmxlJyxcbiAgICAgICAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgICAgICAgICBpZDogYCR7YnVuZGxlSWR9LiR7aWR9YCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzdGF0aWMgcHJvcGVydHlOb3RGb3VuZChuYW1lKSB7XG4gICAgICAgIHJldHVybiBuZXcgVHBFcnJvcih7XG4gICAgICAgICAgICB0eXBlOiAncHJvcGVydHlub3Rmb3VuZCcsXG4gICAgICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzdGF0aWMgc2hvdWxkTmV2ZXJIYXBwZW4oKSB7XG4gICAgICAgIHJldHVybiBuZXcgVHBFcnJvcih7IHR5cGU6ICdzaG91bGRuZXZlcmhhcHBlbicgfSk7XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9XG4gICAgICAgICAgICAoX2EgPSBDUkVBVEVfTUVTU0FHRV9NQVBbY29uZmlnLnR5cGVdKGZvcmNlQ2FzdChjb25maWcuY29udGV4dCkpKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAnVW5leHBlY3RlZCBlcnJvcic7XG4gICAgICAgIHRoaXMubmFtZSA9IHRoaXMuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgdGhpcy5zdGFjayA9IG5ldyBFcnJvcih0aGlzLm1lc3NhZ2UpLnN0YWNrO1xuICAgICAgICB0aGlzLnR5cGUgPSBjb25maWcudHlwZTtcbiAgICB9XG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1lc3NhZ2U7XG4gICAgfVxufVxuXG5jbGFzcyBCaW5kaW5nVGFyZ2V0IHtcbiAgICBjb25zdHJ1Y3RvcihvYmosIGtleSkge1xuICAgICAgICB0aGlzLm9ial8gPSBvYmo7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgIH1cbiAgICBzdGF0aWMgaXNCaW5kYWJsZShvYmopIHtcbiAgICAgICAgaWYgKG9iaiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb2JqICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJlYWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9ial9bdGhpcy5rZXldO1xuICAgIH1cbiAgICB3cml0ZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLm9ial9bdGhpcy5rZXldID0gdmFsdWU7XG4gICAgfVxuICAgIHdyaXRlUHJvcGVydHkobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgY29uc3QgdmFsdWVPYmogPSB0aGlzLnJlYWQoKTtcbiAgICAgICAgaWYgKCFCaW5kaW5nVGFyZ2V0LmlzQmluZGFibGUodmFsdWVPYmopKSB7XG4gICAgICAgICAgICB0aHJvdyBUcEVycm9yLm5vdEJpbmRhYmxlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEobmFtZSBpbiB2YWx1ZU9iaikpIHtcbiAgICAgICAgICAgIHRocm93IFRwRXJyb3IucHJvcGVydHlOb3RGb3VuZChuYW1lKTtcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZU9ialtuYW1lXSA9IHZhbHVlO1xuICAgIH1cbn1cblxuY2xhc3MgRW1pdHRlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzXyA9IHt9O1xuICAgIH1cbiAgICBvbihldmVudE5hbWUsIGhhbmRsZXIsIG9wdF9vcHRpb25zKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgbGV0IG9ic2VydmVycyA9IHRoaXMub2JzZXJ2ZXJzX1tldmVudE5hbWVdO1xuICAgICAgICBpZiAoIW9ic2VydmVycykge1xuICAgICAgICAgICAgb2JzZXJ2ZXJzID0gdGhpcy5vYnNlcnZlcnNfW2V2ZW50TmFtZV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBvYnNlcnZlcnMucHVzaCh7XG4gICAgICAgICAgICBoYW5kbGVyOiBoYW5kbGVyLFxuICAgICAgICAgICAga2V5OiAoX2EgPSBvcHRfb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRfb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0X29wdGlvbnMua2V5KSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBoYW5kbGVyLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIG9mZihldmVudE5hbWUsIGtleSkge1xuICAgICAgICBjb25zdCBvYnNlcnZlcnMgPSB0aGlzLm9ic2VydmVyc19bZXZlbnROYW1lXTtcbiAgICAgICAgaWYgKG9ic2VydmVycykge1xuICAgICAgICAgICAgdGhpcy5vYnNlcnZlcnNfW2V2ZW50TmFtZV0gPSBvYnNlcnZlcnMuZmlsdGVyKChvYnNlcnZlcikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZlci5rZXkgIT09IGtleTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBlbWl0KGV2ZW50TmFtZSwgZXZlbnQpIHtcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXJzID0gdGhpcy5vYnNlcnZlcnNfW2V2ZW50TmFtZV07XG4gICAgICAgIGlmICghb2JzZXJ2ZXJzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgb2JzZXJ2ZXJzLmZvckVhY2goKG9ic2VydmVyKSA9PiB7XG4gICAgICAgICAgICBvYnNlcnZlci5oYW5kbGVyKGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5jbGFzcyBDb21wbGV4VmFsdWUge1xuICAgIGNvbnN0cnVjdG9yKGluaXRpYWxWYWx1ZSwgY29uZmlnKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgdGhpcy5jb25zdHJhaW50XyA9IGNvbmZpZyA9PT0gbnVsbCB8fCBjb25maWcgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNvbmZpZy5jb25zdHJhaW50O1xuICAgICAgICB0aGlzLmVxdWFsc18gPSAoX2EgPSBjb25maWcgPT09IG51bGwgfHwgY29uZmlnID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjb25maWcuZXF1YWxzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAoKHYxLCB2MikgPT4gdjEgPT09IHYyKTtcbiAgICAgICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5yYXdWYWx1ZV8gPSBpbml0aWFsVmFsdWU7XG4gICAgfVxuICAgIGdldCBjb25zdHJhaW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJhaW50XztcbiAgICB9XG4gICAgZ2V0IHJhd1ZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yYXdWYWx1ZV87XG4gICAgfVxuICAgIHNldCByYXdWYWx1ZShyYXdWYWx1ZSkge1xuICAgICAgICB0aGlzLnNldFJhd1ZhbHVlKHJhd1ZhbHVlLCB7XG4gICAgICAgICAgICBmb3JjZUVtaXQ6IGZhbHNlLFxuICAgICAgICAgICAgbGFzdDogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNldFJhd1ZhbHVlKHJhd1ZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IG9wdHMgPSBvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMgIT09IHZvaWQgMCA/IG9wdGlvbnMgOiB7XG4gICAgICAgICAgICBmb3JjZUVtaXQ6IGZhbHNlLFxuICAgICAgICAgICAgbGFzdDogdHJ1ZSxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY29uc3RyYWluZWRWYWx1ZSA9IHRoaXMuY29uc3RyYWludF9cbiAgICAgICAgICAgID8gdGhpcy5jb25zdHJhaW50Xy5jb25zdHJhaW4ocmF3VmFsdWUpXG4gICAgICAgICAgICA6IHJhd1ZhbHVlO1xuICAgICAgICBjb25zdCBwcmV2VmFsdWUgPSB0aGlzLnJhd1ZhbHVlXztcbiAgICAgICAgY29uc3QgY2hhbmdlZCA9ICF0aGlzLmVxdWFsc18ocHJldlZhbHVlLCBjb25zdHJhaW5lZFZhbHVlKTtcbiAgICAgICAgaWYgKCFjaGFuZ2VkICYmICFvcHRzLmZvcmNlRW1pdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdiZWZvcmVjaGFuZ2UnLCB7XG4gICAgICAgICAgICBzZW5kZXI6IHRoaXMsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJhd1ZhbHVlXyA9IGNvbnN0cmFpbmVkVmFsdWU7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdjaGFuZ2UnLCB7XG4gICAgICAgICAgICBvcHRpb25zOiBvcHRzLFxuICAgICAgICAgICAgcHJldmlvdXNSYXdWYWx1ZTogcHJldlZhbHVlLFxuICAgICAgICAgICAgcmF3VmFsdWU6IGNvbnN0cmFpbmVkVmFsdWUsXG4gICAgICAgICAgICBzZW5kZXI6IHRoaXMsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuY2xhc3MgUHJpbWl0aXZlVmFsdWUge1xuICAgIGNvbnN0cnVjdG9yKGluaXRpYWxWYWx1ZSkge1xuICAgICAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICAgICAgICB0aGlzLnZhbHVlXyA9IGluaXRpYWxWYWx1ZTtcbiAgICB9XG4gICAgZ2V0IHJhd1ZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZV87XG4gICAgfVxuICAgIHNldCByYXdWYWx1ZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLnNldFJhd1ZhbHVlKHZhbHVlLCB7XG4gICAgICAgICAgICBmb3JjZUVtaXQ6IGZhbHNlLFxuICAgICAgICAgICAgbGFzdDogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNldFJhd1ZhbHVlKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IG9wdHMgPSBvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMgIT09IHZvaWQgMCA/IG9wdGlvbnMgOiB7XG4gICAgICAgICAgICBmb3JjZUVtaXQ6IGZhbHNlLFxuICAgICAgICAgICAgbGFzdDogdHJ1ZSxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgcHJldlZhbHVlID0gdGhpcy52YWx1ZV87XG4gICAgICAgIGlmIChwcmV2VmFsdWUgPT09IHZhbHVlICYmICFvcHRzLmZvcmNlRW1pdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdiZWZvcmVjaGFuZ2UnLCB7XG4gICAgICAgICAgICBzZW5kZXI6IHRoaXMsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnZhbHVlXyA9IHZhbHVlO1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnY2hhbmdlJywge1xuICAgICAgICAgICAgb3B0aW9uczogb3B0cyxcbiAgICAgICAgICAgIHByZXZpb3VzUmF3VmFsdWU6IHByZXZWYWx1ZSxcbiAgICAgICAgICAgIHJhd1ZhbHVlOiB0aGlzLnZhbHVlXyxcbiAgICAgICAgICAgIHNlbmRlcjogdGhpcyxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5jbGFzcyBSZWFkb25seVByaW1pdGl2ZVZhbHVlIHtcbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSkge1xuICAgICAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICAgICAgICB0aGlzLm9uVmFsdWVCZWZvcmVDaGFuZ2VfID0gdGhpcy5vblZhbHVlQmVmb3JlQ2hhbmdlXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2VfID0gdGhpcy5vblZhbHVlQ2hhbmdlXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnZhbHVlXyA9IHZhbHVlO1xuICAgICAgICB0aGlzLnZhbHVlXy5lbWl0dGVyLm9uKCdiZWZvcmVjaGFuZ2UnLCB0aGlzLm9uVmFsdWVCZWZvcmVDaGFuZ2VfKTtcbiAgICAgICAgdGhpcy52YWx1ZV8uZW1pdHRlci5vbignY2hhbmdlJywgdGhpcy5vblZhbHVlQ2hhbmdlXyk7XG4gICAgfVxuICAgIGdldCByYXdWYWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVfLnJhd1ZhbHVlO1xuICAgIH1cbiAgICBvblZhbHVlQmVmb3JlQ2hhbmdlXyhldikge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnYmVmb3JlY2hhbmdlJywgT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBldiksIHsgc2VuZGVyOiB0aGlzIH0pKTtcbiAgICB9XG4gICAgb25WYWx1ZUNoYW5nZV8oZXYpIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2NoYW5nZScsIE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgZXYpLCB7IHNlbmRlcjogdGhpcyB9KSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVWYWx1ZShpbml0aWFsVmFsdWUsIGNvbmZpZykge1xuICAgIGNvbnN0IGNvbnN0cmFpbnQgPSBjb25maWcgPT09IG51bGwgfHwgY29uZmlnID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjb25maWcuY29uc3RyYWludDtcbiAgICBjb25zdCBlcXVhbHMgPSBjb25maWcgPT09IG51bGwgfHwgY29uZmlnID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjb25maWcuZXF1YWxzO1xuICAgIGlmICghY29uc3RyYWludCAmJiAhZXF1YWxzKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJpbWl0aXZlVmFsdWUoaW5pdGlhbFZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBDb21wbGV4VmFsdWUoaW5pdGlhbFZhbHVlLCBjb25maWcpO1xufVxuZnVuY3Rpb24gY3JlYXRlUmVhZG9ubHlWYWx1ZSh2YWx1ZSkge1xuICAgIHJldHVybiBbXG4gICAgICAgIG5ldyBSZWFkb25seVByaW1pdGl2ZVZhbHVlKHZhbHVlKSxcbiAgICAgICAgKHJhd1ZhbHVlLCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICB2YWx1ZS5zZXRSYXdWYWx1ZShyYXdWYWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgIH0sXG4gICAgXTtcbn1cblxuY2xhc3MgVmFsdWVNYXAge1xuICAgIGNvbnN0cnVjdG9yKHZhbHVlTWFwKSB7XG4gICAgICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMudmFsTWFwXyA9IHZhbHVlTWFwO1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLnZhbE1hcF8pIHtcbiAgICAgICAgICAgIGNvbnN0IHYgPSB0aGlzLnZhbE1hcF9ba2V5XTtcbiAgICAgICAgICAgIHYuZW1pdHRlci5vbignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdjaGFuZ2UnLCB7XG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICBzZW5kZXI6IHRoaXMsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlQ29yZShpbml0aWFsVmFsdWUpIHtcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGluaXRpYWxWYWx1ZSk7XG4gICAgICAgIHJldHVybiBrZXlzLnJlZHVjZSgobywga2V5KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihvLCB7XG4gICAgICAgICAgICAgICAgW2tleV06IGNyZWF0ZVZhbHVlKGluaXRpYWxWYWx1ZVtrZXldKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCB7fSk7XG4gICAgfVxuICAgIHN0YXRpYyBmcm9tT2JqZWN0KGluaXRpYWxWYWx1ZSkge1xuICAgICAgICBjb25zdCBjb3JlID0gdGhpcy5jcmVhdGVDb3JlKGluaXRpYWxWYWx1ZSk7XG4gICAgICAgIHJldHVybiBuZXcgVmFsdWVNYXAoY29yZSk7XG4gICAgfVxuICAgIGdldChrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsTWFwX1trZXldLnJhd1ZhbHVlO1xuICAgIH1cbiAgICBzZXQoa2V5LCB2YWx1ZSkge1xuICAgICAgICB0aGlzLnZhbE1hcF9ba2V5XS5yYXdWYWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgICB2YWx1ZShrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsTWFwX1trZXldO1xuICAgIH1cbn1cblxuY2xhc3MgRGVmaW5pdGVSYW5nZUNvbnN0cmFpbnQge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgICB0aGlzLnZhbHVlcyA9IFZhbHVlTWFwLmZyb21PYmplY3Qoe1xuICAgICAgICAgICAgbWF4OiBjb25maWcubWF4LFxuICAgICAgICAgICAgbWluOiBjb25maWcubWluLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgY29uc3RyYWluKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IG1heCA9IHRoaXMudmFsdWVzLmdldCgnbWF4Jyk7XG4gICAgICAgIGNvbnN0IG1pbiA9IHRoaXMudmFsdWVzLmdldCgnbWluJyk7XG4gICAgICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heCh2YWx1ZSwgbWluKSwgbWF4KTtcbiAgICB9XG59XG5cbmNsYXNzIFJhbmdlQ29uc3RyYWludCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgICAgIHRoaXMudmFsdWVzID0gVmFsdWVNYXAuZnJvbU9iamVjdCh7XG4gICAgICAgICAgICBtYXg6IGNvbmZpZy5tYXgsXG4gICAgICAgICAgICBtaW46IGNvbmZpZy5taW4sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdHJhaW4odmFsdWUpIHtcbiAgICAgICAgY29uc3QgbWF4ID0gdGhpcy52YWx1ZXMuZ2V0KCdtYXgnKTtcbiAgICAgICAgY29uc3QgbWluID0gdGhpcy52YWx1ZXMuZ2V0KCdtaW4nKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICBpZiAoIWlzRW1wdHkobWluKSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gTWF0aC5tYXgocmVzdWx0LCBtaW4pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNFbXB0eShtYXgpKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBNYXRoLm1pbihyZXN1bHQsIG1heCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59XG5cbmNsYXNzIFN0ZXBDb25zdHJhaW50IHtcbiAgICBjb25zdHJ1Y3RvcihzdGVwLCBvcmlnaW4gPSAwKSB7XG4gICAgICAgIHRoaXMuc3RlcCA9IHN0ZXA7XG4gICAgICAgIHRoaXMub3JpZ2luID0gb3JpZ2luO1xuICAgIH1cbiAgICBjb25zdHJhaW4odmFsdWUpIHtcbiAgICAgICAgY29uc3QgbyA9IHRoaXMub3JpZ2luICUgdGhpcy5zdGVwO1xuICAgICAgICBjb25zdCByID0gTWF0aC5yb3VuZCgodmFsdWUgLSBvKSAvIHRoaXMuc3RlcCk7XG4gICAgICAgIHJldHVybiBvICsgciAqIHRoaXMuc3RlcDtcbiAgICB9XG59XG5cbmNsYXNzIE51bWJlckxpdGVyYWxOb2RlIHtcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0KSB7XG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgfVxuICAgIGV2YWx1YXRlKCkge1xuICAgICAgICByZXR1cm4gTnVtYmVyKHRoaXMudGV4dCk7XG4gICAgfVxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0O1xuICAgIH1cbn1cbmNvbnN0IEJJTkFSWV9PUEVSQVRJT05fTUFQID0ge1xuICAgICcqKic6ICh2MSwgdjIpID0+IE1hdGgucG93KHYxLCB2MiksXG4gICAgJyonOiAodjEsIHYyKSA9PiB2MSAqIHYyLFxuICAgICcvJzogKHYxLCB2MikgPT4gdjEgLyB2MixcbiAgICAnJSc6ICh2MSwgdjIpID0+IHYxICUgdjIsXG4gICAgJysnOiAodjEsIHYyKSA9PiB2MSArIHYyLFxuICAgICctJzogKHYxLCB2MikgPT4gdjEgLSB2MixcbiAgICAnPDwnOiAodjEsIHYyKSA9PiB2MSA8PCB2MixcbiAgICAnPj4nOiAodjEsIHYyKSA9PiB2MSA+PiB2MixcbiAgICAnPj4+JzogKHYxLCB2MikgPT4gdjEgPj4+IHYyLFxuICAgICcmJzogKHYxLCB2MikgPT4gdjEgJiB2MixcbiAgICAnXic6ICh2MSwgdjIpID0+IHYxIF4gdjIsXG4gICAgJ3wnOiAodjEsIHYyKSA9PiB2MSB8IHYyLFxufTtcbmNsYXNzIEJpbmFyeU9wZXJhdGlvbk5vZGUge1xuICAgIGNvbnN0cnVjdG9yKG9wZXJhdG9yLCBsZWZ0LCByaWdodCkge1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICB9XG4gICAgZXZhbHVhdGUoKSB7XG4gICAgICAgIGNvbnN0IG9wID0gQklOQVJZX09QRVJBVElPTl9NQVBbdGhpcy5vcGVyYXRvcl07XG4gICAgICAgIGlmICghb3ApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgdW5leHBlY3RlZCBiaW5hcnkgb3BlcmF0b3I6ICcke3RoaXMub3BlcmF0b3J9YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9wKHRoaXMubGVmdC5ldmFsdWF0ZSgpLCB0aGlzLnJpZ2h0LmV2YWx1YXRlKCkpO1xuICAgIH1cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICdiKCcsXG4gICAgICAgICAgICB0aGlzLmxlZnQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgIHRoaXMub3BlcmF0b3IsXG4gICAgICAgICAgICB0aGlzLnJpZ2h0LnRvU3RyaW5nKCksXG4gICAgICAgICAgICAnKScsXG4gICAgICAgIF0uam9pbignICcpO1xuICAgIH1cbn1cbmNvbnN0IFVOQVJZX09QRVJBVElPTl9NQVAgPSB7XG4gICAgJysnOiAodikgPT4gdixcbiAgICAnLSc6ICh2KSA9PiAtdixcbiAgICAnfic6ICh2KSA9PiB+dixcbn07XG5jbGFzcyBVbmFyeU9wZXJhdGlvbk5vZGUge1xuICAgIGNvbnN0cnVjdG9yKG9wZXJhdG9yLCBleHByKSB7XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZXhwcjtcbiAgICB9XG4gICAgZXZhbHVhdGUoKSB7XG4gICAgICAgIGNvbnN0IG9wID0gVU5BUllfT1BFUkFUSU9OX01BUFt0aGlzLm9wZXJhdG9yXTtcbiAgICAgICAgaWYgKCFvcCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bmV4cGVjdGVkIHVuYXJ5IG9wZXJhdG9yOiAnJHt0aGlzLm9wZXJhdG9yfWApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcCh0aGlzLmV4cHJlc3Npb24uZXZhbHVhdGUoKSk7XG4gICAgfVxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gWyd1KCcsIHRoaXMub3BlcmF0b3IsIHRoaXMuZXhwcmVzc2lvbi50b1N0cmluZygpLCAnKSddLmpvaW4oJyAnKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNvbWJpbmVSZWFkZXIocGFyc2Vycykge1xuICAgIHJldHVybiAodGV4dCwgY3Vyc29yKSA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyc2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2Vyc1tpXSh0ZXh0LCBjdXJzb3IpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdCAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9O1xufVxuZnVuY3Rpb24gcmVhZFdoaXRlc3BhY2UodGV4dCwgY3Vyc29yKSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IG0gPSB0ZXh0LnN1YnN0cihjdXJzb3IpLm1hdGNoKC9eXFxzKy8pO1xuICAgIHJldHVybiAoX2EgPSAobSAmJiBtWzBdKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogJyc7XG59XG5mdW5jdGlvbiByZWFkTm9uWmVyb0RpZ2l0KHRleHQsIGN1cnNvcikge1xuICAgIGNvbnN0IGNoID0gdGV4dC5zdWJzdHIoY3Vyc29yLCAxKTtcbiAgICByZXR1cm4gY2gubWF0Y2goL15bMS05XSQvKSA/IGNoIDogJyc7XG59XG5mdW5jdGlvbiByZWFkRGVjaW1hbERpZ2l0cyh0ZXh0LCBjdXJzb3IpIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgbSA9IHRleHQuc3Vic3RyKGN1cnNvcikubWF0Y2goL15bMC05XSsvKTtcbiAgICByZXR1cm4gKF9hID0gKG0gJiYgbVswXSkpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6ICcnO1xufVxuZnVuY3Rpb24gcmVhZFNpZ25lZEludGVnZXIodGV4dCwgY3Vyc29yKSB7XG4gICAgY29uc3QgZHMgPSByZWFkRGVjaW1hbERpZ2l0cyh0ZXh0LCBjdXJzb3IpO1xuICAgIGlmIChkcyAhPT0gJycpIHtcbiAgICAgICAgcmV0dXJuIGRzO1xuICAgIH1cbiAgICBjb25zdCBzaWduID0gdGV4dC5zdWJzdHIoY3Vyc29yLCAxKTtcbiAgICBjdXJzb3IgKz0gMTtcbiAgICBpZiAoc2lnbiAhPT0gJy0nICYmIHNpZ24gIT09ICcrJykge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGNvbnN0IHNkcyA9IHJlYWREZWNpbWFsRGlnaXRzKHRleHQsIGN1cnNvcik7XG4gICAgaWYgKHNkcyA9PT0gJycpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gc2lnbiArIHNkcztcbn1cbmZ1bmN0aW9uIHJlYWRFeHBvbmVudFBhcnQodGV4dCwgY3Vyc29yKSB7XG4gICAgY29uc3QgZSA9IHRleHQuc3Vic3RyKGN1cnNvciwgMSk7XG4gICAgY3Vyc29yICs9IDE7XG4gICAgaWYgKGUudG9Mb3dlckNhc2UoKSAhPT0gJ2UnKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgY29uc3Qgc2kgPSByZWFkU2lnbmVkSW50ZWdlcih0ZXh0LCBjdXJzb3IpO1xuICAgIGlmIChzaSA9PT0gJycpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gZSArIHNpO1xufVxuZnVuY3Rpb24gcmVhZERlY2ltYWxJbnRlZ2VyTGl0ZXJhbCh0ZXh0LCBjdXJzb3IpIHtcbiAgICBjb25zdCBjaCA9IHRleHQuc3Vic3RyKGN1cnNvciwgMSk7XG4gICAgaWYgKGNoID09PSAnMCcpIHtcbiAgICAgICAgcmV0dXJuIGNoO1xuICAgIH1cbiAgICBjb25zdCBuemQgPSByZWFkTm9uWmVyb0RpZ2l0KHRleHQsIGN1cnNvcik7XG4gICAgY3Vyc29yICs9IG56ZC5sZW5ndGg7XG4gICAgaWYgKG56ZCA9PT0gJycpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gbnpkICsgcmVhZERlY2ltYWxEaWdpdHModGV4dCwgY3Vyc29yKTtcbn1cbmZ1bmN0aW9uIHJlYWREZWNpbWFsTGl0ZXJhbDEodGV4dCwgY3Vyc29yKSB7XG4gICAgY29uc3QgZGlsID0gcmVhZERlY2ltYWxJbnRlZ2VyTGl0ZXJhbCh0ZXh0LCBjdXJzb3IpO1xuICAgIGN1cnNvciArPSBkaWwubGVuZ3RoO1xuICAgIGlmIChkaWwgPT09ICcnKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgY29uc3QgZG90ID0gdGV4dC5zdWJzdHIoY3Vyc29yLCAxKTtcbiAgICBjdXJzb3IgKz0gZG90Lmxlbmd0aDtcbiAgICBpZiAoZG90ICE9PSAnLicpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBjb25zdCBkZHMgPSByZWFkRGVjaW1hbERpZ2l0cyh0ZXh0LCBjdXJzb3IpO1xuICAgIGN1cnNvciArPSBkZHMubGVuZ3RoO1xuICAgIHJldHVybiBkaWwgKyBkb3QgKyBkZHMgKyByZWFkRXhwb25lbnRQYXJ0KHRleHQsIGN1cnNvcik7XG59XG5mdW5jdGlvbiByZWFkRGVjaW1hbExpdGVyYWwyKHRleHQsIGN1cnNvcikge1xuICAgIGNvbnN0IGRvdCA9IHRleHQuc3Vic3RyKGN1cnNvciwgMSk7XG4gICAgY3Vyc29yICs9IGRvdC5sZW5ndGg7XG4gICAgaWYgKGRvdCAhPT0gJy4nKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgY29uc3QgZGRzID0gcmVhZERlY2ltYWxEaWdpdHModGV4dCwgY3Vyc29yKTtcbiAgICBjdXJzb3IgKz0gZGRzLmxlbmd0aDtcbiAgICBpZiAoZGRzID09PSAnJykge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiBkb3QgKyBkZHMgKyByZWFkRXhwb25lbnRQYXJ0KHRleHQsIGN1cnNvcik7XG59XG5mdW5jdGlvbiByZWFkRGVjaW1hbExpdGVyYWwzKHRleHQsIGN1cnNvcikge1xuICAgIGNvbnN0IGRpbCA9IHJlYWREZWNpbWFsSW50ZWdlckxpdGVyYWwodGV4dCwgY3Vyc29yKTtcbiAgICBjdXJzb3IgKz0gZGlsLmxlbmd0aDtcbiAgICBpZiAoZGlsID09PSAnJykge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiBkaWwgKyByZWFkRXhwb25lbnRQYXJ0KHRleHQsIGN1cnNvcik7XG59XG5jb25zdCByZWFkRGVjaW1hbExpdGVyYWwgPSBjb21iaW5lUmVhZGVyKFtcbiAgICByZWFkRGVjaW1hbExpdGVyYWwxLFxuICAgIHJlYWREZWNpbWFsTGl0ZXJhbDIsXG4gICAgcmVhZERlY2ltYWxMaXRlcmFsMyxcbl0pO1xuZnVuY3Rpb24gcGFyc2VCaW5hcnlEaWdpdHModGV4dCwgY3Vyc29yKSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IG0gPSB0ZXh0LnN1YnN0cihjdXJzb3IpLm1hdGNoKC9eWzAxXSsvKTtcbiAgICByZXR1cm4gKF9hID0gKG0gJiYgbVswXSkpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6ICcnO1xufVxuZnVuY3Rpb24gcmVhZEJpbmFyeUludGVnZXJMaXRlcmFsKHRleHQsIGN1cnNvcikge1xuICAgIGNvbnN0IHByZWZpeCA9IHRleHQuc3Vic3RyKGN1cnNvciwgMik7XG4gICAgY3Vyc29yICs9IHByZWZpeC5sZW5ndGg7XG4gICAgaWYgKHByZWZpeC50b0xvd2VyQ2FzZSgpICE9PSAnMGInKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgY29uc3QgYmRzID0gcGFyc2VCaW5hcnlEaWdpdHModGV4dCwgY3Vyc29yKTtcbiAgICBpZiAoYmRzID09PSAnJykge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiBwcmVmaXggKyBiZHM7XG59XG5mdW5jdGlvbiByZWFkT2N0YWxEaWdpdHModGV4dCwgY3Vyc29yKSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IG0gPSB0ZXh0LnN1YnN0cihjdXJzb3IpLm1hdGNoKC9eWzAtN10rLyk7XG4gICAgcmV0dXJuIChfYSA9IChtICYmIG1bMF0pKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAnJztcbn1cbmZ1bmN0aW9uIHJlYWRPY3RhbEludGVnZXJMaXRlcmFsKHRleHQsIGN1cnNvcikge1xuICAgIGNvbnN0IHByZWZpeCA9IHRleHQuc3Vic3RyKGN1cnNvciwgMik7XG4gICAgY3Vyc29yICs9IHByZWZpeC5sZW5ndGg7XG4gICAgaWYgKHByZWZpeC50b0xvd2VyQ2FzZSgpICE9PSAnMG8nKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgY29uc3Qgb2RzID0gcmVhZE9jdGFsRGlnaXRzKHRleHQsIGN1cnNvcik7XG4gICAgaWYgKG9kcyA9PT0gJycpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gcHJlZml4ICsgb2RzO1xufVxuZnVuY3Rpb24gcmVhZEhleERpZ2l0cyh0ZXh0LCBjdXJzb3IpIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgbSA9IHRleHQuc3Vic3RyKGN1cnNvcikubWF0Y2goL15bMC05YS1mXSsvaSk7XG4gICAgcmV0dXJuIChfYSA9IChtICYmIG1bMF0pKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAnJztcbn1cbmZ1bmN0aW9uIHJlYWRIZXhJbnRlZ2VyTGl0ZXJhbCh0ZXh0LCBjdXJzb3IpIHtcbiAgICBjb25zdCBwcmVmaXggPSB0ZXh0LnN1YnN0cihjdXJzb3IsIDIpO1xuICAgIGN1cnNvciArPSBwcmVmaXgubGVuZ3RoO1xuICAgIGlmIChwcmVmaXgudG9Mb3dlckNhc2UoKSAhPT0gJzB4Jykge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGNvbnN0IGhkcyA9IHJlYWRIZXhEaWdpdHModGV4dCwgY3Vyc29yKTtcbiAgICBpZiAoaGRzID09PSAnJykge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiBwcmVmaXggKyBoZHM7XG59XG5jb25zdCByZWFkTm9uRGVjaW1hbEludGVnZXJMaXRlcmFsID0gY29tYmluZVJlYWRlcihbXG4gICAgcmVhZEJpbmFyeUludGVnZXJMaXRlcmFsLFxuICAgIHJlYWRPY3RhbEludGVnZXJMaXRlcmFsLFxuICAgIHJlYWRIZXhJbnRlZ2VyTGl0ZXJhbCxcbl0pO1xuY29uc3QgcmVhZE51bWVyaWNMaXRlcmFsID0gY29tYmluZVJlYWRlcihbXG4gICAgcmVhZE5vbkRlY2ltYWxJbnRlZ2VyTGl0ZXJhbCxcbiAgICByZWFkRGVjaW1hbExpdGVyYWwsXG5dKTtcblxuZnVuY3Rpb24gcGFyc2VMaXRlcmFsKHRleHQsIGN1cnNvcikge1xuICAgIGNvbnN0IG51bSA9IHJlYWROdW1lcmljTGl0ZXJhbCh0ZXh0LCBjdXJzb3IpO1xuICAgIGN1cnNvciArPSBudW0ubGVuZ3RoO1xuICAgIGlmIChudW0gPT09ICcnKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBldmFsdWFibGU6IG5ldyBOdW1iZXJMaXRlcmFsTm9kZShudW0pLFxuICAgICAgICBjdXJzb3I6IGN1cnNvcixcbiAgICB9O1xufVxuZnVuY3Rpb24gcGFyc2VQYXJlbnRoZXNpemVkRXhwcmVzc2lvbih0ZXh0LCBjdXJzb3IpIHtcbiAgICBjb25zdCBvcCA9IHRleHQuc3Vic3RyKGN1cnNvciwgMSk7XG4gICAgY3Vyc29yICs9IG9wLmxlbmd0aDtcbiAgICBpZiAob3AgIT09ICcoJykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgZXhwciA9IHBhcnNlRXhwcmVzc2lvbih0ZXh0LCBjdXJzb3IpO1xuICAgIGlmICghZXhwcikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY3Vyc29yID0gZXhwci5jdXJzb3I7XG4gICAgY3Vyc29yICs9IHJlYWRXaGl0ZXNwYWNlKHRleHQsIGN1cnNvcikubGVuZ3RoO1xuICAgIGNvbnN0IGNsID0gdGV4dC5zdWJzdHIoY3Vyc29yLCAxKTtcbiAgICBjdXJzb3IgKz0gY2wubGVuZ3RoO1xuICAgIGlmIChjbCAhPT0gJyknKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBldmFsdWFibGU6IGV4cHIuZXZhbHVhYmxlLFxuICAgICAgICBjdXJzb3I6IGN1cnNvcixcbiAgICB9O1xufVxuZnVuY3Rpb24gcGFyc2VQcmltYXJ5RXhwcmVzc2lvbih0ZXh0LCBjdXJzb3IpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuICgoX2EgPSBwYXJzZUxpdGVyYWwodGV4dCwgY3Vyc29yKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogcGFyc2VQYXJlbnRoZXNpemVkRXhwcmVzc2lvbih0ZXh0LCBjdXJzb3IpKTtcbn1cbmZ1bmN0aW9uIHBhcnNlVW5hcnlFeHByZXNzaW9uKHRleHQsIGN1cnNvcikge1xuICAgIGNvbnN0IGV4cHIgPSBwYXJzZVByaW1hcnlFeHByZXNzaW9uKHRleHQsIGN1cnNvcik7XG4gICAgaWYgKGV4cHIpIHtcbiAgICAgICAgcmV0dXJuIGV4cHI7XG4gICAgfVxuICAgIGNvbnN0IG9wID0gdGV4dC5zdWJzdHIoY3Vyc29yLCAxKTtcbiAgICBjdXJzb3IgKz0gb3AubGVuZ3RoO1xuICAgIGlmIChvcCAhPT0gJysnICYmIG9wICE9PSAnLScgJiYgb3AgIT09ICd+Jykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgbnVtID0gcGFyc2VVbmFyeUV4cHJlc3Npb24odGV4dCwgY3Vyc29yKTtcbiAgICBpZiAoIW51bSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY3Vyc29yID0gbnVtLmN1cnNvcjtcbiAgICByZXR1cm4ge1xuICAgICAgICBjdXJzb3I6IGN1cnNvcixcbiAgICAgICAgZXZhbHVhYmxlOiBuZXcgVW5hcnlPcGVyYXRpb25Ob2RlKG9wLCBudW0uZXZhbHVhYmxlKSxcbiAgICB9O1xufVxuZnVuY3Rpb24gcmVhZEJpbmFyeU9wZXJhdG9yKG9wcywgdGV4dCwgY3Vyc29yKSB7XG4gICAgY3Vyc29yICs9IHJlYWRXaGl0ZXNwYWNlKHRleHQsIGN1cnNvcikubGVuZ3RoO1xuICAgIGNvbnN0IG9wID0gb3BzLmZpbHRlcigob3ApID0+IHRleHQuc3RhcnRzV2l0aChvcCwgY3Vyc29yKSlbMF07XG4gICAgaWYgKCFvcCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY3Vyc29yICs9IG9wLmxlbmd0aDtcbiAgICBjdXJzb3IgKz0gcmVhZFdoaXRlc3BhY2UodGV4dCwgY3Vyc29yKS5sZW5ndGg7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY3Vyc29yOiBjdXJzb3IsXG4gICAgICAgIG9wZXJhdG9yOiBvcCxcbiAgICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlQmluYXJ5T3BlcmF0aW9uRXhwcmVzc2lvblBhcnNlcihleHByUGFyc2VyLCBvcHMpIHtcbiAgICByZXR1cm4gKHRleHQsIGN1cnNvcikgPT4ge1xuICAgICAgICBjb25zdCBmaXJzdEV4cHIgPSBleHByUGFyc2VyKHRleHQsIGN1cnNvcik7XG4gICAgICAgIGlmICghZmlyc3RFeHByKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjdXJzb3IgPSBmaXJzdEV4cHIuY3Vyc29yO1xuICAgICAgICBsZXQgZXhwciA9IGZpcnN0RXhwci5ldmFsdWFibGU7XG4gICAgICAgIGZvciAoOzspIHtcbiAgICAgICAgICAgIGNvbnN0IG9wID0gcmVhZEJpbmFyeU9wZXJhdG9yKG9wcywgdGV4dCwgY3Vyc29yKTtcbiAgICAgICAgICAgIGlmICghb3ApIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN1cnNvciA9IG9wLmN1cnNvcjtcbiAgICAgICAgICAgIGNvbnN0IG5leHRFeHByID0gZXhwclBhcnNlcih0ZXh0LCBjdXJzb3IpO1xuICAgICAgICAgICAgaWYgKCFuZXh0RXhwcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3Vyc29yID0gbmV4dEV4cHIuY3Vyc29yO1xuICAgICAgICAgICAgZXhwciA9IG5ldyBCaW5hcnlPcGVyYXRpb25Ob2RlKG9wLm9wZXJhdG9yLCBleHByLCBuZXh0RXhwci5ldmFsdWFibGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBleHByXG4gICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICBjdXJzb3I6IGN1cnNvcixcbiAgICAgICAgICAgICAgICBldmFsdWFibGU6IGV4cHIsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA6IG51bGw7XG4gICAgfTtcbn1cbmNvbnN0IHBhcnNlQmluYXJ5T3BlcmF0aW9uRXhwcmVzc2lvbiA9IFtcbiAgICBbJyoqJ10sXG4gICAgWycqJywgJy8nLCAnJSddLFxuICAgIFsnKycsICctJ10sXG4gICAgWyc8PCcsICc+Pj4nLCAnPj4nXSxcbiAgICBbJyYnXSxcbiAgICBbJ14nXSxcbiAgICBbJ3wnXSxcbl0ucmVkdWNlKChwYXJzZXIsIG9wcykgPT4ge1xuICAgIHJldHVybiBjcmVhdGVCaW5hcnlPcGVyYXRpb25FeHByZXNzaW9uUGFyc2VyKHBhcnNlciwgb3BzKTtcbn0sIHBhcnNlVW5hcnlFeHByZXNzaW9uKTtcbmZ1bmN0aW9uIHBhcnNlRXhwcmVzc2lvbih0ZXh0LCBjdXJzb3IpIHtcbiAgICBjdXJzb3IgKz0gcmVhZFdoaXRlc3BhY2UodGV4dCwgY3Vyc29yKS5sZW5ndGg7XG4gICAgcmV0dXJuIHBhcnNlQmluYXJ5T3BlcmF0aW9uRXhwcmVzc2lvbih0ZXh0LCBjdXJzb3IpO1xufVxuZnVuY3Rpb24gcGFyc2VFY21hTnVtYmVyRXhwcmVzc2lvbih0ZXh0KSB7XG4gICAgY29uc3QgZXhwciA9IHBhcnNlRXhwcmVzc2lvbih0ZXh0LCAwKTtcbiAgICBpZiAoIWV4cHIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGN1cnNvciA9IGV4cHIuY3Vyc29yICsgcmVhZFdoaXRlc3BhY2UodGV4dCwgZXhwci5jdXJzb3IpLmxlbmd0aDtcbiAgICBpZiAoY3Vyc29yICE9PSB0ZXh0Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGV4cHIuZXZhbHVhYmxlO1xufVxuXG5mdW5jdGlvbiBwYXJzZU51bWJlcih0ZXh0KSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IHIgPSBwYXJzZUVjbWFOdW1iZXJFeHByZXNzaW9uKHRleHQpO1xuICAgIHJldHVybiAoX2EgPSByID09PSBudWxsIHx8IHIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHIuZXZhbHVhdGUoKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogbnVsbDtcbn1cbmZ1bmN0aW9uIG51bWJlckZyb21Vbmtub3duKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICBjb25zdCBwdiA9IHBhcnNlTnVtYmVyKHZhbHVlKTtcbiAgICAgICAgaWYgKCFpc0VtcHR5KHB2KSkge1xuICAgICAgICAgICAgcmV0dXJuIHB2O1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAwO1xufVxuZnVuY3Rpb24gbnVtYmVyVG9TdHJpbmcodmFsdWUpIHtcbiAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZU51bWJlckZvcm1hdHRlcihkaWdpdHMpIHtcbiAgICByZXR1cm4gKHZhbHVlKSA9PiB7XG4gICAgICAgIHJldHVybiB2YWx1ZS50b0ZpeGVkKE1hdGgubWF4KE1hdGgubWluKGRpZ2l0cywgMjApLCAwKSk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gbWFwUmFuZ2UodmFsdWUsIHN0YXJ0MSwgZW5kMSwgc3RhcnQyLCBlbmQyKSB7XG4gICAgY29uc3QgcCA9ICh2YWx1ZSAtIHN0YXJ0MSkgLyAoZW5kMSAtIHN0YXJ0MSk7XG4gICAgcmV0dXJuIHN0YXJ0MiArIHAgKiAoZW5kMiAtIHN0YXJ0Mik7XG59XG5mdW5jdGlvbiBnZXREZWNpbWFsRGlnaXRzKHZhbHVlKSB7XG4gICAgY29uc3QgdGV4dCA9IFN0cmluZyh2YWx1ZS50b0ZpeGVkKDEwKSk7XG4gICAgY29uc3QgZnJhYyA9IHRleHQuc3BsaXQoJy4nKVsxXTtcbiAgICByZXR1cm4gZnJhYy5yZXBsYWNlKC8wKyQvLCAnJykubGVuZ3RoO1xufVxuZnVuY3Rpb24gY29uc3RyYWluUmFuZ2UodmFsdWUsIG1pbiwgbWF4KSB7XG4gICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCBtaW4pLCBtYXgpO1xufVxuZnVuY3Rpb24gbG9vcFJhbmdlKHZhbHVlLCBtYXgpIHtcbiAgICByZXR1cm4gKCh2YWx1ZSAlIG1heCkgKyBtYXgpICUgbWF4O1xufVxuZnVuY3Rpb24gZ2V0U3VpdGFibGVEZWNpbWFsRGlnaXRzKHBhcmFtcywgcmF3VmFsdWUpIHtcbiAgICByZXR1cm4gIWlzRW1wdHkocGFyYW1zLnN0ZXApXG4gICAgICAgID8gZ2V0RGVjaW1hbERpZ2l0cyhwYXJhbXMuc3RlcClcbiAgICAgICAgOiBNYXRoLm1heChnZXREZWNpbWFsRGlnaXRzKHJhd1ZhbHVlKSwgMik7XG59XG5mdW5jdGlvbiBnZXRTdWl0YWJsZUtleVNjYWxlKHBhcmFtcykge1xuICAgIHZhciBfYTtcbiAgICByZXR1cm4gKF9hID0gcGFyYW1zLnN0ZXApICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IDE7XG59XG5mdW5jdGlvbiBnZXRTdWl0YWJsZVBvaW50ZXJTY2FsZShwYXJhbXMsIHJhd1ZhbHVlKSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IGJhc2UgPSBNYXRoLmFicygoX2EgPSBwYXJhbXMuc3RlcCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogcmF3VmFsdWUpO1xuICAgIHJldHVybiBiYXNlID09PSAwID8gMC4xIDogTWF0aC5wb3coMTAsIE1hdGguZmxvb3IoTWF0aC5sb2cxMChiYXNlKSkgLSAxKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVN0ZXBDb25zdHJhaW50KHBhcmFtcywgaW5pdGlhbFZhbHVlKSB7XG4gICAgaWYgKCFpc0VtcHR5KHBhcmFtcy5zdGVwKSkge1xuICAgICAgICByZXR1cm4gbmV3IFN0ZXBDb25zdHJhaW50KHBhcmFtcy5zdGVwLCBpbml0aWFsVmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVJhbmdlQ29uc3RyYWludChwYXJhbXMpIHtcbiAgICBpZiAoIWlzRW1wdHkocGFyYW1zLm1heCkgJiYgIWlzRW1wdHkocGFyYW1zLm1pbikpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEZWZpbml0ZVJhbmdlQ29uc3RyYWludCh7XG4gICAgICAgICAgICBtYXg6IHBhcmFtcy5tYXgsXG4gICAgICAgICAgICBtaW46IHBhcmFtcy5taW4sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoIWlzRW1wdHkocGFyYW1zLm1heCkgfHwgIWlzRW1wdHkocGFyYW1zLm1pbikpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSYW5nZUNvbnN0cmFpbnQoe1xuICAgICAgICAgICAgbWF4OiBwYXJhbXMubWF4LFxuICAgICAgICAgICAgbWluOiBwYXJhbXMubWluLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5mdW5jdGlvbiBjcmVhdGVOdW1iZXJUZXh0UHJvcHNPYmplY3QocGFyYW1zLCBpbml0aWFsVmFsdWUpIHtcbiAgICB2YXIgX2EsIF9iLCBfYztcbiAgICByZXR1cm4ge1xuICAgICAgICBmb3JtYXR0ZXI6IChfYSA9IHBhcmFtcy5mb3JtYXQpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGNyZWF0ZU51bWJlckZvcm1hdHRlcihnZXRTdWl0YWJsZURlY2ltYWxEaWdpdHMocGFyYW1zLCBpbml0aWFsVmFsdWUpKSxcbiAgICAgICAga2V5U2NhbGU6IChfYiA9IHBhcmFtcy5rZXlTY2FsZSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogZ2V0U3VpdGFibGVLZXlTY2FsZShwYXJhbXMpLFxuICAgICAgICBwb2ludGVyU2NhbGU6IChfYyA9IHBhcmFtcy5wb2ludGVyU2NhbGUpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IGdldFN1aXRhYmxlUG9pbnRlclNjYWxlKHBhcmFtcywgaW5pdGlhbFZhbHVlKSxcbiAgICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlTnVtYmVyVGV4dElucHV0UGFyYW1zUGFyc2VyKHApIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBmb3JtYXQ6IHAub3B0aW9uYWwuZnVuY3Rpb24sXG4gICAgICAgIGtleVNjYWxlOiBwLm9wdGlvbmFsLm51bWJlcixcbiAgICAgICAgbWF4OiBwLm9wdGlvbmFsLm51bWJlcixcbiAgICAgICAgbWluOiBwLm9wdGlvbmFsLm51bWJlcixcbiAgICAgICAgcG9pbnRlclNjYWxlOiBwLm9wdGlvbmFsLm51bWJlcixcbiAgICAgICAgc3RlcDogcC5vcHRpb25hbC5udW1iZXIsXG4gICAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUG9pbnRBeGlzKGNvbmZpZykge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbnN0cmFpbnQ6IGNvbmZpZy5jb25zdHJhaW50LFxuICAgICAgICB0ZXh0UHJvcHM6IFZhbHVlTWFwLmZyb21PYmplY3QoY3JlYXRlTnVtYmVyVGV4dFByb3BzT2JqZWN0KGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5pbml0aWFsVmFsdWUpKSxcbiAgICB9O1xufVxuXG5jbGFzcyBCbGFkZUFwaSB7XG4gICAgY29uc3RydWN0b3IoY29udHJvbGxlcikge1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xuICAgIH1cbiAgICBnZXQgZWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlci52aWV3LmVsZW1lbnQ7XG4gICAgfVxuICAgIGdldCBkaXNhYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlci52aWV3UHJvcHMuZ2V0KCdkaXNhYmxlZCcpO1xuICAgIH1cbiAgICBzZXQgZGlzYWJsZWQoZGlzYWJsZWQpIHtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnZpZXdQcm9wcy5zZXQoJ2Rpc2FibGVkJywgZGlzYWJsZWQpO1xuICAgIH1cbiAgICBnZXQgaGlkZGVuKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyLnZpZXdQcm9wcy5nZXQoJ2hpZGRlbicpO1xuICAgIH1cbiAgICBzZXQgaGlkZGVuKGhpZGRlbikge1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIudmlld1Byb3BzLnNldCgnaGlkZGVuJywgaGlkZGVuKTtcbiAgICB9XG4gICAgZGlzcG9zZSgpIHtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnZpZXdQcm9wcy5zZXQoJ2Rpc3Bvc2VkJywgdHJ1ZSk7XG4gICAgfVxuICAgIGltcG9ydFN0YXRlKHN0YXRlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXIuaW1wb3J0U3RhdGUoc3RhdGUpO1xuICAgIH1cbiAgICBleHBvcnRTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlci5leHBvcnRTdGF0ZSgpO1xuICAgIH1cbn1cblxuY2xhc3MgVHBFdmVudCB7XG4gICAgY29uc3RydWN0b3IodGFyZ2V0KSB7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgIH1cbn1cbmNsYXNzIFRwQ2hhbmdlRXZlbnQgZXh0ZW5kcyBUcEV2ZW50IHtcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQsIHZhbHVlLCBsYXN0KSB7XG4gICAgICAgIHN1cGVyKHRhcmdldCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5sYXN0ID0gbGFzdCAhPT0gbnVsbCAmJiBsYXN0ICE9PSB2b2lkIDAgPyBsYXN0IDogdHJ1ZTtcbiAgICB9XG59XG5jbGFzcyBUcEZvbGRFdmVudCBleHRlbmRzIFRwRXZlbnQge1xuICAgIGNvbnN0cnVjdG9yKHRhcmdldCwgZXhwYW5kZWQpIHtcbiAgICAgICAgc3VwZXIodGFyZ2V0KTtcbiAgICAgICAgdGhpcy5leHBhbmRlZCA9IGV4cGFuZGVkO1xuICAgIH1cbn1cbmNsYXNzIFRwVGFiU2VsZWN0RXZlbnQgZXh0ZW5kcyBUcEV2ZW50IHtcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQsIGluZGV4KSB7XG4gICAgICAgIHN1cGVyKHRhcmdldCk7XG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICB9XG59XG5jbGFzcyBUcE1vdXNlRXZlbnQgZXh0ZW5kcyBUcEV2ZW50IHtcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQsIG5hdGl2ZUV2ZW50KSB7XG4gICAgICAgIHN1cGVyKHRhcmdldCk7XG4gICAgICAgIHRoaXMubmF0aXZlID0gbmF0aXZlRXZlbnQ7XG4gICAgfVxufVxuXG5jbGFzcyBCaW5kaW5nQXBpIGV4dGVuZHMgQmxhZGVBcGkge1xuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXIpIHtcbiAgICAgICAgc3VwZXIoY29udHJvbGxlcik7XG4gICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZV8gPSB0aGlzLm9uVmFsdWVDaGFuZ2VfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZW1pdHRlcl8gPSBuZXcgRW1pdHRlcigpO1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIudmFsdWUuZW1pdHRlci5vbignY2hhbmdlJywgdGhpcy5vblZhbHVlQ2hhbmdlXyk7XG4gICAgfVxuICAgIGdldCBsYWJlbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlci5sYWJlbENvbnRyb2xsZXIucHJvcHMuZ2V0KCdsYWJlbCcpO1xuICAgIH1cbiAgICBzZXQgbGFiZWwobGFiZWwpIHtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLmxhYmVsQ29udHJvbGxlci5wcm9wcy5zZXQoJ2xhYmVsJywgbGFiZWwpO1xuICAgIH1cbiAgICBnZXQga2V5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyLnZhbHVlLmJpbmRpbmcudGFyZ2V0LmtleTtcbiAgICB9XG4gICAgZ2V0IHRhZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlci50YWc7XG4gICAgfVxuICAgIHNldCB0YWcodGFnKSB7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci50YWcgPSB0YWc7XG4gICAgfVxuICAgIG9uKGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgICAgICBjb25zdCBiaCA9IGhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5lbWl0dGVyXy5vbihldmVudE5hbWUsIChldikgPT4ge1xuICAgICAgICAgICAgYmgoZXYpO1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICBrZXk6IGhhbmRsZXIsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgb2ZmKGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgICAgICB0aGlzLmVtaXR0ZXJfLm9mZihldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmVmcmVzaCgpIHtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnZhbHVlLmZldGNoKCk7XG4gICAgfVxuICAgIG9uVmFsdWVDaGFuZ2VfKGV2KSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5jb250cm9sbGVyLnZhbHVlO1xuICAgICAgICB0aGlzLmVtaXR0ZXJfLmVtaXQoJ2NoYW5nZScsIG5ldyBUcENoYW5nZUV2ZW50KHRoaXMsIGZvcmNlQ2FzdCh2YWx1ZS5iaW5kaW5nLnRhcmdldC5yZWFkKCkpLCBldi5vcHRpb25zLmxhc3QpKTtcbiAgICB9XG59XG5cbmNsYXNzIElucHV0QmluZGluZ1ZhbHVlIHtcbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSwgYmluZGluZykge1xuICAgICAgICB0aGlzLm9uVmFsdWVCZWZvcmVDaGFuZ2VfID0gdGhpcy5vblZhbHVlQmVmb3JlQ2hhbmdlXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2VfID0gdGhpcy5vblZhbHVlQ2hhbmdlXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmJpbmRpbmcgPSBiaW5kaW5nO1xuICAgICAgICB0aGlzLnZhbHVlXyA9IHZhbHVlO1xuICAgICAgICB0aGlzLnZhbHVlXy5lbWl0dGVyLm9uKCdiZWZvcmVjaGFuZ2UnLCB0aGlzLm9uVmFsdWVCZWZvcmVDaGFuZ2VfKTtcbiAgICAgICAgdGhpcy52YWx1ZV8uZW1pdHRlci5vbignY2hhbmdlJywgdGhpcy5vblZhbHVlQ2hhbmdlXyk7XG4gICAgICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gICAgfVxuICAgIGdldCByYXdWYWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVfLnJhd1ZhbHVlO1xuICAgIH1cbiAgICBzZXQgcmF3VmFsdWUocmF3VmFsdWUpIHtcbiAgICAgICAgdGhpcy52YWx1ZV8ucmF3VmFsdWUgPSByYXdWYWx1ZTtcbiAgICB9XG4gICAgc2V0UmF3VmFsdWUocmF3VmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy52YWx1ZV8uc2V0UmF3VmFsdWUocmF3VmFsdWUsIG9wdGlvbnMpO1xuICAgIH1cbiAgICBmZXRjaCgpIHtcbiAgICAgICAgdGhpcy52YWx1ZV8ucmF3VmFsdWUgPSB0aGlzLmJpbmRpbmcucmVhZCgpO1xuICAgIH1cbiAgICBwdXNoKCkge1xuICAgICAgICB0aGlzLmJpbmRpbmcud3JpdGUodGhpcy52YWx1ZV8ucmF3VmFsdWUpO1xuICAgIH1cbiAgICBvblZhbHVlQmVmb3JlQ2hhbmdlXyhldikge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnYmVmb3JlY2hhbmdlJywgT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBldiksIHsgc2VuZGVyOiB0aGlzIH0pKTtcbiAgICB9XG4gICAgb25WYWx1ZUNoYW5nZV8oZXYpIHtcbiAgICAgICAgdGhpcy5wdXNoKCk7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdjaGFuZ2UnLCBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGV2KSwgeyBzZW5kZXI6IHRoaXMgfSkpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGlzSW5wdXRCaW5kaW5nVmFsdWUodikge1xuICAgIGlmICghKCdiaW5kaW5nJyBpbiB2KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IGIgPSB2WydiaW5kaW5nJ107XG4gICAgcmV0dXJuIGlzQmluZGluZyhiKSAmJiAncmVhZCcgaW4gYiAmJiAnd3JpdGUnIGluIGI7XG59XG5cbmZ1bmN0aW9uIHBhcnNlT2JqZWN0KHZhbHVlLCBrZXlUb1BhcnNlck1hcCkge1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhrZXlUb1BhcnNlck1hcCk7XG4gICAgY29uc3QgcmVzdWx0ID0ga2V5cy5yZWR1Y2UoKHRtcCwga2V5KSA9PiB7XG4gICAgICAgIGlmICh0bXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwYXJzZXIgPSBrZXlUb1BhcnNlck1hcFtrZXldO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBwYXJzZXIodmFsdWVba2V5XSk7XG4gICAgICAgIHJldHVybiByZXN1bHQuc3VjY2VlZGVkXG4gICAgICAgICAgICA/IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgdG1wKSwgeyBba2V5XTogcmVzdWx0LnZhbHVlIH0pIDogdW5kZWZpbmVkO1xuICAgIH0sIHt9KTtcbiAgICByZXR1cm4gZm9yY2VDYXN0KHJlc3VsdCk7XG59XG5mdW5jdGlvbiBwYXJzZUFycmF5KHZhbHVlLCBwYXJzZUl0ZW0pIHtcbiAgICByZXR1cm4gdmFsdWUucmVkdWNlKCh0bXAsIGl0ZW0pID0+IHtcbiAgICAgICAgaWYgKHRtcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlSXRlbShpdGVtKTtcbiAgICAgICAgaWYgKCFyZXN1bHQuc3VjY2VlZGVkIHx8IHJlc3VsdC52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbLi4udG1wLCByZXN1bHQudmFsdWVdO1xuICAgIH0sIFtdKTtcbn1cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCc7XG59XG5mdW5jdGlvbiBjcmVhdGVNaWNyb1BhcnNlckJ1aWxkZXIocGFyc2UpIHtcbiAgICByZXR1cm4gKG9wdGlvbmFsKSA9PiAodikgPT4ge1xuICAgICAgICBpZiAoIW9wdGlvbmFsICYmIHYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZWVkZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25hbCAmJiB2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3VjY2VlZGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlKHYpO1xuICAgICAgICByZXR1cm4gcmVzdWx0ICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgIHN1Y2NlZWRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0LFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgc3VjY2VlZGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgfTtcbiAgICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlTWljcm9QYXJzZXJCdWlsZGVycyhvcHRpb25hbCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGN1c3RvbTogKHBhcnNlKSA9PiBjcmVhdGVNaWNyb1BhcnNlckJ1aWxkZXIocGFyc2UpKG9wdGlvbmFsKSxcbiAgICAgICAgYm9vbGVhbjogY3JlYXRlTWljcm9QYXJzZXJCdWlsZGVyKCh2KSA9PiB0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nID8gdiA6IHVuZGVmaW5lZCkob3B0aW9uYWwpLFxuICAgICAgICBudW1iZXI6IGNyZWF0ZU1pY3JvUGFyc2VyQnVpbGRlcigodikgPT4gdHlwZW9mIHYgPT09ICdudW1iZXInID8gdiA6IHVuZGVmaW5lZCkob3B0aW9uYWwpLFxuICAgICAgICBzdHJpbmc6IGNyZWF0ZU1pY3JvUGFyc2VyQnVpbGRlcigodikgPT4gdHlwZW9mIHYgPT09ICdzdHJpbmcnID8gdiA6IHVuZGVmaW5lZCkob3B0aW9uYWwpLFxuICAgICAgICBmdW5jdGlvbjogY3JlYXRlTWljcm9QYXJzZXJCdWlsZGVyKCh2KSA9PlxuICAgICAgICB0eXBlb2YgdiA9PT0gJ2Z1bmN0aW9uJyA/IHYgOiB1bmRlZmluZWQpKG9wdGlvbmFsKSxcbiAgICAgICAgY29uc3RhbnQ6ICh2YWx1ZSkgPT4gY3JlYXRlTWljcm9QYXJzZXJCdWlsZGVyKCh2KSA9PiAodiA9PT0gdmFsdWUgPyB2YWx1ZSA6IHVuZGVmaW5lZCkpKG9wdGlvbmFsKSxcbiAgICAgICAgcmF3OiBjcmVhdGVNaWNyb1BhcnNlckJ1aWxkZXIoKHYpID0+IHYpKG9wdGlvbmFsKSxcbiAgICAgICAgb2JqZWN0OiAoa2V5VG9QYXJzZXJNYXApID0+IGNyZWF0ZU1pY3JvUGFyc2VyQnVpbGRlcigodikgPT4ge1xuICAgICAgICAgICAgaWYgKCFpc09iamVjdCh2KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VPYmplY3Qodiwga2V5VG9QYXJzZXJNYXApO1xuICAgICAgICB9KShvcHRpb25hbCksXG4gICAgICAgIGFycmF5OiAoaXRlbVBhcnNlcikgPT4gY3JlYXRlTWljcm9QYXJzZXJCdWlsZGVyKCh2KSA9PiB7XG4gICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkodikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlQXJyYXkodiwgaXRlbVBhcnNlcik7XG4gICAgICAgIH0pKG9wdGlvbmFsKSxcbiAgICB9O1xufVxuY29uc3QgTWljcm9QYXJzZXJzID0ge1xuICAgIG9wdGlvbmFsOiBjcmVhdGVNaWNyb1BhcnNlckJ1aWxkZXJzKHRydWUpLFxuICAgIHJlcXVpcmVkOiBjcmVhdGVNaWNyb1BhcnNlckJ1aWxkZXJzKGZhbHNlKSxcbn07XG5mdW5jdGlvbiBwYXJzZVJlY29yZCh2YWx1ZSwga2V5VG9QYXJzZXJNYXApIHtcbiAgICBjb25zdCBtYXAgPSBrZXlUb1BhcnNlck1hcChNaWNyb1BhcnNlcnMpO1xuICAgIGNvbnN0IHJlc3VsdCA9IE1pY3JvUGFyc2Vycy5yZXF1aXJlZC5vYmplY3QobWFwKSh2YWx1ZSk7XG4gICAgcmV0dXJuIHJlc3VsdC5zdWNjZWVkZWQgPyByZXN1bHQudmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGltcG9ydEJsYWRlU3RhdGUoc3RhdGUsIHN1cGVySW1wb3J0LCBwYXJzZXIsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHN1cGVySW1wb3J0ICYmICFzdXBlckltcG9ydChzdGF0ZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCByZXN1bHQgPSBwYXJzZVJlY29yZChzdGF0ZSwgcGFyc2VyKTtcbiAgICByZXR1cm4gcmVzdWx0ID8gY2FsbGJhY2socmVzdWx0KSA6IGZhbHNlO1xufVxuZnVuY3Rpb24gZXhwb3J0QmxhZGVTdGF0ZShzdXBlckV4cG9ydCwgdGhpc1N0YXRlKSB7XG4gICAgdmFyIF9hO1xuICAgIHJldHVybiBkZWVwTWVyZ2UoKF9hID0gc3VwZXJFeHBvcnQgPT09IG51bGwgfHwgc3VwZXJFeHBvcnQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHN1cGVyRXhwb3J0KCkpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHt9LCB0aGlzU3RhdGUpO1xufVxuXG5mdW5jdGlvbiBpc1ZhbHVlQmxhZGVDb250cm9sbGVyKGJjKSB7XG4gICAgcmV0dXJuICd2YWx1ZScgaW4gYmM7XG59XG5cbmZ1bmN0aW9uIGlzQmluZGluZ1ZhbHVlKHYpIHtcbiAgICBpZiAoIWlzT2JqZWN0JDEodikgfHwgISgnYmluZGluZycgaW4gdikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBiID0gdi5iaW5kaW5nO1xuICAgIHJldHVybiBpc0JpbmRpbmcoYik7XG59XG5cbmNvbnN0IFNWR19OUyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG5mdW5jdGlvbiBmb3JjZVJlZmxvdyhlbGVtZW50KSB7XG4gICAgZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG59XG5mdW5jdGlvbiBkaXNhYmxlVHJhbnNpdGlvblRlbXBvcmFyaWx5KGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgdCA9IGVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbjtcbiAgICBlbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSAnbm9uZSc7XG4gICAgY2FsbGJhY2soKTtcbiAgICBlbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSB0O1xufVxuZnVuY3Rpb24gc3VwcG9ydHNUb3VjaChkb2MpIHtcbiAgICByZXR1cm4gZG9jLm9udG91Y2hzdGFydCAhPT0gdW5kZWZpbmVkO1xufVxuZnVuY3Rpb24gZ2V0R2xvYmFsT2JqZWN0KCkge1xuICAgIHJldHVybiBnbG9iYWxUaGlzO1xufVxuZnVuY3Rpb24gZ2V0V2luZG93RG9jdW1lbnQoKSB7XG4gICAgY29uc3QgZ2xvYmFsT2JqID0gZm9yY2VDYXN0KGdldEdsb2JhbE9iamVjdCgpKTtcbiAgICByZXR1cm4gZ2xvYmFsT2JqLmRvY3VtZW50O1xufVxuZnVuY3Rpb24gZ2V0Q2FudmFzQ29udGV4dChjYW52YXNFbGVtZW50KSB7XG4gICAgY29uc3Qgd2luID0gY2FudmFzRWxlbWVudC5vd25lckRvY3VtZW50LmRlZmF1bHRWaWV3O1xuICAgIGlmICghd2luKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBpc0Jyb3dzZXIgPSAnZG9jdW1lbnQnIGluIHdpbjtcbiAgICByZXR1cm4gaXNCcm93c2VyXG4gICAgICAgID8gY2FudmFzRWxlbWVudC5nZXRDb250ZXh0KCcyZCcsIHtcbiAgICAgICAgICAgIHdpbGxSZWFkRnJlcXVlbnRseTogdHJ1ZSxcbiAgICAgICAgfSlcbiAgICAgICAgOiBudWxsO1xufVxuY29uc3QgSUNPTl9JRF9UT19JTk5FUl9IVE1MX01BUCA9IHtcbiAgICBjaGVjazogJzxwYXRoIGQ9XCJNMiA4bDQgNGw4IC04XCIvPicsXG4gICAgZHJvcGRvd246ICc8cGF0aCBkPVwiTTUgN2g2bC0zIDMgelwiLz4nLFxuICAgIHAyZHBhZDogJzxwYXRoIGQ9XCJNOCA0djhcIi8+PHBhdGggZD1cIk00IDhoOFwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEuMlwiLz4nLFxufTtcbmZ1bmN0aW9uIGNyZWF0ZVN2Z0ljb25FbGVtZW50KGRvY3VtZW50LCBpY29uSWQpIHtcbiAgICBjb25zdCBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR19OUywgJ3N2ZycpO1xuICAgIGVsZW0uaW5uZXJIVE1MID0gSUNPTl9JRF9UT19JTk5FUl9IVE1MX01BUFtpY29uSWRdO1xuICAgIHJldHVybiBlbGVtO1xufVxuZnVuY3Rpb24gaW5zZXJ0RWxlbWVudEF0KHBhcmVudEVsZW1lbnQsIGVsZW1lbnQsIGluZGV4KSB7XG4gICAgcGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoZWxlbWVudCwgcGFyZW50RWxlbWVudC5jaGlsZHJlbltpbmRleF0pO1xufVxuZnVuY3Rpb24gcmVtb3ZlRWxlbWVudChlbGVtZW50KSB7XG4gICAgaWYgKGVsZW1lbnQucGFyZW50RWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG4gICAgfVxufVxuZnVuY3Rpb24gcmVtb3ZlQ2hpbGRFbGVtZW50cyhlbGVtZW50KSB7XG4gICAgd2hpbGUgKGVsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQuY2hpbGRyZW5bMF0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHJlbW92ZUNoaWxkTm9kZXMoZWxlbWVudCkge1xuICAgIHdoaWxlIChlbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQuY2hpbGROb2Rlc1swXSk7XG4gICAgfVxufVxuZnVuY3Rpb24gZmluZE5leHRUYXJnZXQoZXYpIHtcbiAgICBpZiAoZXYucmVsYXRlZFRhcmdldCkge1xuICAgICAgICByZXR1cm4gZm9yY2VDYXN0KGV2LnJlbGF0ZWRUYXJnZXQpO1xuICAgIH1cbiAgICBpZiAoJ2V4cGxpY2l0T3JpZ2luYWxUYXJnZXQnIGluIGV2KSB7XG4gICAgICAgIHJldHVybiBldi5leHBsaWNpdE9yaWdpbmFsVGFyZ2V0O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gYmluZFZhbHVlKHZhbHVlLCBhcHBseVZhbHVlKSB7XG4gICAgdmFsdWUuZW1pdHRlci5vbignY2hhbmdlJywgKGV2KSA9PiB7XG4gICAgICAgIGFwcGx5VmFsdWUoZXYucmF3VmFsdWUpO1xuICAgIH0pO1xuICAgIGFwcGx5VmFsdWUodmFsdWUucmF3VmFsdWUpO1xufVxuZnVuY3Rpb24gYmluZFZhbHVlTWFwKHZhbHVlTWFwLCBrZXksIGFwcGx5VmFsdWUpIHtcbiAgICBiaW5kVmFsdWUodmFsdWVNYXAudmFsdWUoa2V5KSwgYXBwbHlWYWx1ZSk7XG59XG5cbmNvbnN0IFBSRUZJWCA9ICd0cCc7XG5mdW5jdGlvbiBDbGFzc05hbWUodmlld05hbWUpIHtcbiAgICBjb25zdCBmbiA9IChvcHRfZWxlbWVudE5hbWUsIG9wdF9tb2RpZmllcikgPT4ge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgUFJFRklYLFxuICAgICAgICAgICAgJy0nLFxuICAgICAgICAgICAgdmlld05hbWUsXG4gICAgICAgICAgICAndicsXG4gICAgICAgICAgICBvcHRfZWxlbWVudE5hbWUgPyBgXyR7b3B0X2VsZW1lbnROYW1lfWAgOiAnJyxcbiAgICAgICAgICAgIG9wdF9tb2RpZmllciA/IGAtJHtvcHRfbW9kaWZpZXJ9YCA6ICcnLFxuICAgICAgICBdLmpvaW4oJycpO1xuICAgIH07XG4gICAgcmV0dXJuIGZuO1xufVxuXG5jb25zdCBjbiRyID0gQ2xhc3NOYW1lKCdsYmwnKTtcbmZ1bmN0aW9uIGNyZWF0ZUxhYmVsTm9kZShkb2MsIGxhYmVsKSB7XG4gICAgY29uc3QgZnJhZyA9IGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgY29uc3QgbGluZU5vZGVzID0gbGFiZWwuc3BsaXQoJ1xcbicpLm1hcCgobGluZSkgPT4ge1xuICAgICAgICByZXR1cm4gZG9jLmNyZWF0ZVRleHROb2RlKGxpbmUpO1xuICAgIH0pO1xuICAgIGxpbmVOb2Rlcy5mb3JFYWNoKChsaW5lTm9kZSwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChkb2MuY3JlYXRlRWxlbWVudCgnYnInKSk7XG4gICAgICAgIH1cbiAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChsaW5lTm9kZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGZyYWc7XG59XG5jbGFzcyBMYWJlbFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKGRvYywgY29uZmlnKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoY24kcigpKTtcbiAgICAgICAgY29uZmlnLnZpZXdQcm9wcy5iaW5kQ2xhc3NNb2RpZmllcnModGhpcy5lbGVtZW50KTtcbiAgICAgICAgY29uc3QgbGFiZWxFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBsYWJlbEVsZW0uY2xhc3NMaXN0LmFkZChjbiRyKCdsJykpO1xuICAgICAgICBiaW5kVmFsdWVNYXAoY29uZmlnLnByb3BzLCAnbGFiZWwnLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmIChpc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNuJHIodW5kZWZpbmVkLCAnbm9sJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoY24kcih1bmRlZmluZWQsICdub2wnKSk7XG4gICAgICAgICAgICAgICAgcmVtb3ZlQ2hpbGROb2RlcyhsYWJlbEVsZW0pO1xuICAgICAgICAgICAgICAgIGxhYmVsRWxlbS5hcHBlbmRDaGlsZChjcmVhdGVMYWJlbE5vZGUoZG9jLCB2YWx1ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGxhYmVsRWxlbSk7XG4gICAgICAgIHRoaXMubGFiZWxFbGVtZW50ID0gbGFiZWxFbGVtO1xuICAgICAgICBjb25zdCB2YWx1ZUVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHZhbHVlRWxlbS5jbGFzc0xpc3QuYWRkKGNuJHIoJ3YnKSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh2YWx1ZUVsZW0pO1xuICAgICAgICB0aGlzLnZhbHVlRWxlbWVudCA9IHZhbHVlRWxlbTtcbiAgICB9XG59XG5cbmNsYXNzIExhYmVsQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoZG9jLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5wcm9wcyA9IGNvbmZpZy5wcm9wcztcbiAgICAgICAgdGhpcy52YWx1ZUNvbnRyb2xsZXIgPSBjb25maWcudmFsdWVDb250cm9sbGVyO1xuICAgICAgICB0aGlzLnZpZXdQcm9wcyA9IGNvbmZpZy52YWx1ZUNvbnRyb2xsZXIudmlld1Byb3BzO1xuICAgICAgICB0aGlzLnZpZXcgPSBuZXcgTGFiZWxWaWV3KGRvYywge1xuICAgICAgICAgICAgcHJvcHM6IGNvbmZpZy5wcm9wcyxcbiAgICAgICAgICAgIHZpZXdQcm9wczogdGhpcy52aWV3UHJvcHMsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnZpZXcudmFsdWVFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMudmFsdWVDb250cm9sbGVyLnZpZXcuZWxlbWVudCk7XG4gICAgfVxuICAgIGltcG9ydFByb3BzKHN0YXRlKSB7XG4gICAgICAgIHJldHVybiBpbXBvcnRCbGFkZVN0YXRlKHN0YXRlLCBudWxsLCAocCkgPT4gKHtcbiAgICAgICAgICAgIGxhYmVsOiBwLm9wdGlvbmFsLnN0cmluZyxcbiAgICAgICAgfSksIChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuc2V0KCdsYWJlbCcsIHJlc3VsdC5sYWJlbCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGV4cG9ydFByb3BzKCkge1xuICAgICAgICByZXR1cm4gZXhwb3J0QmxhZGVTdGF0ZShudWxsLCB7XG4gICAgICAgICAgICBsYWJlbDogdGhpcy5wcm9wcy5nZXQoJ2xhYmVsJyksXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0QWxsQmxhZGVQb3NpdGlvbnMoKSB7XG4gICAgcmV0dXJuIFsndmVyeWZpcnN0JywgJ2ZpcnN0JywgJ2xhc3QnLCAndmVyeWxhc3QnXTtcbn1cblxuY29uc3QgY24kcSA9IENsYXNzTmFtZSgnJyk7XG5jb25zdCBQT1NfVE9fQ0xBU1NfTkFNRV9NQVAgPSB7XG4gICAgdmVyeWZpcnN0OiAndmZzdCcsXG4gICAgZmlyc3Q6ICdmc3QnLFxuICAgIGxhc3Q6ICdsc3QnLFxuICAgIHZlcnlsYXN0OiAndmxzdCcsXG59O1xuY2xhc3MgQmxhZGVDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICAgICAgdGhpcy5wYXJlbnRfID0gbnVsbDtcbiAgICAgICAgdGhpcy5ibGFkZSA9IGNvbmZpZy5ibGFkZTtcbiAgICAgICAgdGhpcy52aWV3ID0gY29uZmlnLnZpZXc7XG4gICAgICAgIHRoaXMudmlld1Byb3BzID0gY29uZmlnLnZpZXdQcm9wcztcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMudmlldy5lbGVtZW50O1xuICAgICAgICB0aGlzLmJsYWRlLnZhbHVlKCdwb3NpdGlvbnMnKS5lbWl0dGVyLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgICAgICBnZXRBbGxCbGFkZVBvc2l0aW9ucygpLmZvckVhY2goKHBvcykgPT4ge1xuICAgICAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShjbiRxKHVuZGVmaW5lZCwgUE9TX1RPX0NMQVNTX05BTUVfTUFQW3Bvc10pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5ibGFkZS5nZXQoJ3Bvc2l0aW9ucycpLmZvckVhY2goKHBvcykgPT4ge1xuICAgICAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChjbiRxKHVuZGVmaW5lZCwgUE9TX1RPX0NMQVNTX05BTUVfTUFQW3Bvc10pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy52aWV3UHJvcHMuaGFuZGxlRGlzcG9zZSgoKSA9PiB7XG4gICAgICAgICAgICByZW1vdmVFbGVtZW50KGVsZW0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0IHBhcmVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50XztcbiAgICB9XG4gICAgc2V0IHBhcmVudChwYXJlbnQpIHtcbiAgICAgICAgdGhpcy5wYXJlbnRfID0gcGFyZW50O1xuICAgICAgICB0aGlzLnZpZXdQcm9wcy5zZXQoJ3BhcmVudCcsIHRoaXMucGFyZW50XyA/IHRoaXMucGFyZW50Xy52aWV3UHJvcHMgOiBudWxsKTtcbiAgICB9XG4gICAgaW1wb3J0U3RhdGUoc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIGltcG9ydEJsYWRlU3RhdGUoc3RhdGUsIG51bGwsIChwKSA9PiAoe1xuICAgICAgICAgICAgZGlzYWJsZWQ6IHAucmVxdWlyZWQuYm9vbGVhbixcbiAgICAgICAgICAgIGhpZGRlbjogcC5yZXF1aXJlZC5ib29sZWFuLFxuICAgICAgICB9KSwgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy52aWV3UHJvcHMuaW1wb3J0U3RhdGUocmVzdWx0KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZXhwb3J0U3RhdGUoKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRCbGFkZVN0YXRlKG51bGwsIE9iamVjdC5hc3NpZ24oe30sIHRoaXMudmlld1Byb3BzLmV4cG9ydFN0YXRlKCkpKTtcbiAgICB9XG59XG5cbmNsYXNzIExhYmVsZWRWYWx1ZUJsYWRlQ29udHJvbGxlciBleHRlbmRzIEJsYWRlQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoZG9jLCBjb25maWcpIHtcbiAgICAgICAgaWYgKGNvbmZpZy52YWx1ZSAhPT0gY29uZmlnLnZhbHVlQ29udHJvbGxlci52YWx1ZSkge1xuICAgICAgICAgICAgdGhyb3cgVHBFcnJvci5zaG91bGROZXZlckhhcHBlbigpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHZpZXdQcm9wcyA9IGNvbmZpZy52YWx1ZUNvbnRyb2xsZXIudmlld1Byb3BzO1xuICAgICAgICBjb25zdCBsYyA9IG5ldyBMYWJlbENvbnRyb2xsZXIoZG9jLCB7XG4gICAgICAgICAgICBibGFkZTogY29uZmlnLmJsYWRlLFxuICAgICAgICAgICAgcHJvcHM6IGNvbmZpZy5wcm9wcyxcbiAgICAgICAgICAgIHZhbHVlQ29udHJvbGxlcjogY29uZmlnLnZhbHVlQ29udHJvbGxlcixcbiAgICAgICAgfSk7XG4gICAgICAgIHN1cGVyKE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgY29uZmlnKSwgeyB2aWV3OiBuZXcgTGFiZWxWaWV3KGRvYywge1xuICAgICAgICAgICAgICAgIHByb3BzOiBjb25maWcucHJvcHMsXG4gICAgICAgICAgICAgICAgdmlld1Byb3BzOiB2aWV3UHJvcHMsXG4gICAgICAgICAgICB9KSwgdmlld1Byb3BzOiB2aWV3UHJvcHMgfSkpO1xuICAgICAgICB0aGlzLmxhYmVsQ29udHJvbGxlciA9IGxjO1xuICAgICAgICB0aGlzLnZhbHVlID0gY29uZmlnLnZhbHVlO1xuICAgICAgICB0aGlzLnZhbHVlQ29udHJvbGxlciA9IGNvbmZpZy52YWx1ZUNvbnRyb2xsZXI7XG4gICAgICAgIHRoaXMudmlldy52YWx1ZUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy52YWx1ZUNvbnRyb2xsZXIudmlldy5lbGVtZW50KTtcbiAgICB9XG4gICAgaW1wb3J0U3RhdGUoc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIGltcG9ydEJsYWRlU3RhdGUoc3RhdGUsIChzKSA9PiB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iLCBfYztcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5pbXBvcnRTdGF0ZShzKSAmJlxuICAgICAgICAgICAgICAgIHRoaXMubGFiZWxDb250cm9sbGVyLmltcG9ydFByb3BzKHMpICYmXG4gICAgICAgICAgICAgICAgKChfYyA9IChfYiA9IChfYSA9IHRoaXMudmFsdWVDb250cm9sbGVyKS5pbXBvcnRQcm9wcykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwoX2EsIHN0YXRlKSkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogdHJ1ZSk7XG4gICAgICAgIH0sIChwKSA9PiAoe1xuICAgICAgICAgICAgdmFsdWU6IHAub3B0aW9uYWwucmF3LFxuICAgICAgICB9KSwgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUucmF3VmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGV4cG9ydFN0YXRlKCkge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYztcbiAgICAgICAgcmV0dXJuIGV4cG9ydEJsYWRlU3RhdGUoKCkgPT4gc3VwZXIuZXhwb3J0U3RhdGUoKSwgT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHsgdmFsdWU6IHRoaXMudmFsdWUucmF3VmFsdWUgfSwgdGhpcy5sYWJlbENvbnRyb2xsZXIuZXhwb3J0UHJvcHMoKSksICgoX2MgPSAoX2IgPSAoX2EgPSB0aGlzLnZhbHVlQ29udHJvbGxlcikuZXhwb3J0UHJvcHMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5jYWxsKF9hKSkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDoge30pKSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBleGNsdWRlVmFsdWUoc3RhdGUpIHtcbiAgICBjb25zdCByZXN1bHQgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSk7XG4gICAgZGVsZXRlIHJlc3VsdC52YWx1ZTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuY2xhc3MgQmluZGluZ0NvbnRyb2xsZXIgZXh0ZW5kcyBMYWJlbGVkVmFsdWVCbGFkZUNvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKGRvYywgY29uZmlnKSB7XG4gICAgICAgIHN1cGVyKGRvYywgY29uZmlnKTtcbiAgICAgICAgdGhpcy50YWcgPSBjb25maWcudGFnO1xuICAgIH1cbiAgICBpbXBvcnRTdGF0ZShzdGF0ZSkge1xuICAgICAgICByZXR1cm4gaW1wb3J0QmxhZGVTdGF0ZShzdGF0ZSxcbiAgICAgICAgKF9zKSA9PiBzdXBlci5pbXBvcnRTdGF0ZShleGNsdWRlVmFsdWUoc3RhdGUpKSwgKHApID0+ICh7XG4gICAgICAgICAgICB0YWc6IHAub3B0aW9uYWwuc3RyaW5nLFxuICAgICAgICB9KSwgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50YWcgPSByZXN1bHQudGFnO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBleHBvcnRTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydEJsYWRlU3RhdGUoKCkgPT4gZXhjbHVkZVZhbHVlKHN1cGVyLmV4cG9ydFN0YXRlKCkpLCB7XG4gICAgICAgICAgICBiaW5kaW5nOiB7XG4gICAgICAgICAgICAgICAga2V5OiB0aGlzLnZhbHVlLmJpbmRpbmcudGFyZ2V0LmtleSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy52YWx1ZS5iaW5kaW5nLnRhcmdldC5yZWFkKCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGFnOiB0aGlzLnRhZyxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZnVuY3Rpb24gaXNCaW5kaW5nQ29udHJvbGxlcihiYykge1xuICAgIHJldHVybiBpc1ZhbHVlQmxhZGVDb250cm9sbGVyKGJjKSAmJiBpc0JpbmRpbmdWYWx1ZShiYy52YWx1ZSk7XG59XG5cbmNsYXNzIElucHV0QmluZGluZ0NvbnRyb2xsZXIgZXh0ZW5kcyBCaW5kaW5nQ29udHJvbGxlciB7XG4gICAgaW1wb3J0U3RhdGUoc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIGltcG9ydEJsYWRlU3RhdGUoc3RhdGUsIChzKSA9PiBzdXBlci5pbXBvcnRTdGF0ZShzKSwgKHApID0+ICh7XG4gICAgICAgICAgICBiaW5kaW5nOiBwLnJlcXVpcmVkLm9iamVjdCh7XG4gICAgICAgICAgICAgICAgdmFsdWU6IHAucmVxdWlyZWQucmF3LFxuICAgICAgICAgICAgfSksXG4gICAgICAgIH0pLCAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlLmJpbmRpbmcuaW5qZWN0KHJlc3VsdC5iaW5kaW5nLnZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMudmFsdWUuZmV0Y2goKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5mdW5jdGlvbiBpc0lucHV0QmluZGluZ0NvbnRyb2xsZXIoYmMpIHtcbiAgICByZXR1cm4gaXNWYWx1ZUJsYWRlQ29udHJvbGxlcihiYykgJiYgaXNJbnB1dEJpbmRpbmdWYWx1ZShiYy52YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGZpbGxCdWZmZXIoYnVmZmVyLCBidWZmZXJTaXplKSB7XG4gICAgd2hpbGUgKGJ1ZmZlci5sZW5ndGggPCBidWZmZXJTaXplKSB7XG4gICAgICAgIGJ1ZmZlci5wdXNoKHVuZGVmaW5lZCk7XG4gICAgfVxufVxuZnVuY3Rpb24gaW5pdGlhbGl6ZUJ1ZmZlcihidWZmZXJTaXplKSB7XG4gICAgY29uc3QgYnVmZmVyID0gW107XG4gICAgZmlsbEJ1ZmZlcihidWZmZXIsIGJ1ZmZlclNpemUpO1xuICAgIHJldHVybiBidWZmZXI7XG59XG5mdW5jdGlvbiBjcmVhdGVUcmltbWVkQnVmZmVyKGJ1ZmZlcikge1xuICAgIGNvbnN0IGluZGV4ID0gYnVmZmVyLmluZGV4T2YodW5kZWZpbmVkKTtcbiAgICByZXR1cm4gZm9yY2VDYXN0KGluZGV4IDwgMCA/IGJ1ZmZlciA6IGJ1ZmZlci5zbGljZSgwLCBpbmRleCkpO1xufVxuZnVuY3Rpb24gY3JlYXRlUHVzaGVkQnVmZmVyKGJ1ZmZlciwgbmV3VmFsdWUpIHtcbiAgICBjb25zdCBuZXdCdWZmZXIgPSBbLi4uY3JlYXRlVHJpbW1lZEJ1ZmZlcihidWZmZXIpLCBuZXdWYWx1ZV07XG4gICAgaWYgKG5ld0J1ZmZlci5sZW5ndGggPiBidWZmZXIubGVuZ3RoKSB7XG4gICAgICAgIG5ld0J1ZmZlci5zcGxpY2UoMCwgbmV3QnVmZmVyLmxlbmd0aCAtIGJ1ZmZlci5sZW5ndGgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZmlsbEJ1ZmZlcihuZXdCdWZmZXIsIGJ1ZmZlci5sZW5ndGgpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3QnVmZmVyO1xufVxuXG5jbGFzcyBNb25pdG9yQmluZGluZ1ZhbHVlIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5vblRpY2tfID0gdGhpcy5vblRpY2tfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25WYWx1ZUJlZm9yZUNoYW5nZV8gPSB0aGlzLm9uVmFsdWVCZWZvcmVDaGFuZ2VfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZV8gPSB0aGlzLm9uVmFsdWVDaGFuZ2VfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuYmluZGluZyA9IGNvbmZpZy5iaW5kaW5nO1xuICAgICAgICB0aGlzLnZhbHVlXyA9IGNyZWF0ZVZhbHVlKGluaXRpYWxpemVCdWZmZXIoY29uZmlnLmJ1ZmZlclNpemUpKTtcbiAgICAgICAgdGhpcy52YWx1ZV8uZW1pdHRlci5vbignYmVmb3JlY2hhbmdlJywgdGhpcy5vblZhbHVlQmVmb3JlQ2hhbmdlXyk7XG4gICAgICAgIHRoaXMudmFsdWVfLmVtaXR0ZXIub24oJ2NoYW5nZScsIHRoaXMub25WYWx1ZUNoYW5nZV8pO1xuICAgICAgICB0aGlzLnRpY2tlciA9IGNvbmZpZy50aWNrZXI7XG4gICAgICAgIHRoaXMudGlja2VyLmVtaXR0ZXIub24oJ3RpY2snLCB0aGlzLm9uVGlja18pO1xuICAgICAgICB0aGlzLmZldGNoKCk7XG4gICAgfVxuICAgIGdldCByYXdWYWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVfLnJhd1ZhbHVlO1xuICAgIH1cbiAgICBzZXQgcmF3VmFsdWUocmF3VmFsdWUpIHtcbiAgICAgICAgdGhpcy52YWx1ZV8ucmF3VmFsdWUgPSByYXdWYWx1ZTtcbiAgICB9XG4gICAgc2V0UmF3VmFsdWUocmF3VmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy52YWx1ZV8uc2V0UmF3VmFsdWUocmF3VmFsdWUsIG9wdGlvbnMpO1xuICAgIH1cbiAgICBmZXRjaCgpIHtcbiAgICAgICAgdGhpcy52YWx1ZV8ucmF3VmFsdWUgPSBjcmVhdGVQdXNoZWRCdWZmZXIodGhpcy52YWx1ZV8ucmF3VmFsdWUsIHRoaXMuYmluZGluZy5yZWFkKCkpO1xuICAgIH1cbiAgICBvblRpY2tfKCkge1xuICAgICAgICB0aGlzLmZldGNoKCk7XG4gICAgfVxuICAgIG9uVmFsdWVCZWZvcmVDaGFuZ2VfKGV2KSB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdiZWZvcmVjaGFuZ2UnLCBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGV2KSwgeyBzZW5kZXI6IHRoaXMgfSkpO1xuICAgIH1cbiAgICBvblZhbHVlQ2hhbmdlXyhldikge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnY2hhbmdlJywgT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBldiksIHsgc2VuZGVyOiB0aGlzIH0pKTtcbiAgICB9XG59XG5mdW5jdGlvbiBpc01vbml0b3JCaW5kaW5nVmFsdWUodikge1xuICAgIGlmICghKCdiaW5kaW5nJyBpbiB2KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IGIgPSB2WydiaW5kaW5nJ107XG4gICAgcmV0dXJuIGlzQmluZGluZyhiKSAmJiAncmVhZCcgaW4gYiAmJiAhKCd3cml0ZScgaW4gYik7XG59XG5cbmNsYXNzIE1vbml0b3JCaW5kaW5nQ29udHJvbGxlciBleHRlbmRzIEJpbmRpbmdDb250cm9sbGVyIHtcbiAgICBleHBvcnRTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydEJsYWRlU3RhdGUoKCkgPT4gc3VwZXIuZXhwb3J0U3RhdGUoKSwge1xuICAgICAgICAgICAgYmluZGluZzoge1xuICAgICAgICAgICAgICAgIHJlYWRvbmx5OiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZnVuY3Rpb24gaXNNb25pdG9yQmluZGluZ0NvbnRyb2xsZXIoYmMpIHtcbiAgICByZXR1cm4gKGlzVmFsdWVCbGFkZUNvbnRyb2xsZXIoYmMpICYmXG4gICAgICAgIGlzTW9uaXRvckJpbmRpbmdWYWx1ZShiYy52YWx1ZSkpO1xufVxuXG5jbGFzcyBCdXR0b25BcGkgZXh0ZW5kcyBCbGFkZUFwaSB7XG4gICAgZ2V0IGxhYmVsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyLmxhYmVsQ29udHJvbGxlci5wcm9wcy5nZXQoJ2xhYmVsJyk7XG4gICAgfVxuICAgIHNldCBsYWJlbChsYWJlbCkge1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIubGFiZWxDb250cm9sbGVyLnByb3BzLnNldCgnbGFiZWwnLCBsYWJlbCk7XG4gICAgfVxuICAgIGdldCB0aXRsZSgpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gKF9hID0gdGhpcy5jb250cm9sbGVyLmJ1dHRvbkNvbnRyb2xsZXIucHJvcHMuZ2V0KCd0aXRsZScpKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAnJztcbiAgICB9XG4gICAgc2V0IHRpdGxlKHRpdGxlKSB7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci5idXR0b25Db250cm9sbGVyLnByb3BzLnNldCgndGl0bGUnLCB0aXRsZSk7XG4gICAgfVxuICAgIG9uKGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgICAgICBjb25zdCBiaCA9IGhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgICAgY29uc3QgZW1pdHRlciA9IHRoaXMuY29udHJvbGxlci5idXR0b25Db250cm9sbGVyLmVtaXR0ZXI7XG4gICAgICAgIGVtaXR0ZXIub24oZXZlbnROYW1lLCAoZXYpID0+IHtcbiAgICAgICAgICAgIGJoKG5ldyBUcE1vdXNlRXZlbnQodGhpcywgZXYubmF0aXZlRXZlbnQpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBvZmYoZXZlbnROYW1lLCBoYW5kbGVyKSB7XG4gICAgICAgIGNvbnN0IGVtaXR0ZXIgPSB0aGlzLmNvbnRyb2xsZXIuYnV0dG9uQ29udHJvbGxlci5lbWl0dGVyO1xuICAgICAgICBlbWl0dGVyLm9mZihldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFwcGx5Q2xhc3MoZWxlbSwgY2xhc3NOYW1lLCBhY3RpdmUpIHtcbiAgICBpZiAoYWN0aXZlKSB7XG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgfVxufVxuZnVuY3Rpb24gdmFsdWVUb0NsYXNzTmFtZShlbGVtLCBjbGFzc05hbWUpIHtcbiAgICByZXR1cm4gKHZhbHVlKSA9PiB7XG4gICAgICAgIGFwcGx5Q2xhc3MoZWxlbSwgY2xhc3NOYW1lLCB2YWx1ZSk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGJpbmRWYWx1ZVRvVGV4dENvbnRlbnQodmFsdWUsIGVsZW0pIHtcbiAgICBiaW5kVmFsdWUodmFsdWUsICh0ZXh0KSA9PiB7XG4gICAgICAgIGVsZW0udGV4dENvbnRlbnQgPSB0ZXh0ICE9PSBudWxsICYmIHRleHQgIT09IHZvaWQgMCA/IHRleHQgOiAnJztcbiAgICB9KTtcbn1cblxuY29uc3QgY24kcCA9IENsYXNzTmFtZSgnYnRuJyk7XG5jbGFzcyBCdXR0b25WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihkb2MsIGNvbmZpZykge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNuJHAoKSk7XG4gICAgICAgIGNvbmZpZy52aWV3UHJvcHMuYmluZENsYXNzTW9kaWZpZXJzKHRoaXMuZWxlbWVudCk7XG4gICAgICAgIGNvbnN0IGJ1dHRvbkVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIGJ1dHRvbkVsZW0uY2xhc3NMaXN0LmFkZChjbiRwKCdiJykpO1xuICAgICAgICBjb25maWcudmlld1Byb3BzLmJpbmREaXNhYmxlZChidXR0b25FbGVtKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGJ1dHRvbkVsZW0pO1xuICAgICAgICB0aGlzLmJ1dHRvbkVsZW1lbnQgPSBidXR0b25FbGVtO1xuICAgICAgICBjb25zdCB0aXRsZUVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRpdGxlRWxlbS5jbGFzc0xpc3QuYWRkKGNuJHAoJ3QnKSk7XG4gICAgICAgIGJpbmRWYWx1ZVRvVGV4dENvbnRlbnQoY29uZmlnLnByb3BzLnZhbHVlKCd0aXRsZScpLCB0aXRsZUVsZW0pO1xuICAgICAgICB0aGlzLmJ1dHRvbkVsZW1lbnQuYXBwZW5kQ2hpbGQodGl0bGVFbGVtKTtcbiAgICB9XG59XG5cbmNsYXNzIEJ1dHRvbkNvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKGRvYywgY29uZmlnKSB7XG4gICAgICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMub25DbGlja18gPSB0aGlzLm9uQ2xpY2tfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMucHJvcHMgPSBjb25maWcucHJvcHM7XG4gICAgICAgIHRoaXMudmlld1Byb3BzID0gY29uZmlnLnZpZXdQcm9wcztcbiAgICAgICAgdGhpcy52aWV3ID0gbmV3IEJ1dHRvblZpZXcoZG9jLCB7XG4gICAgICAgICAgICBwcm9wczogdGhpcy5wcm9wcyxcbiAgICAgICAgICAgIHZpZXdQcm9wczogdGhpcy52aWV3UHJvcHMsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnZpZXcuYnV0dG9uRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25DbGlja18pO1xuICAgIH1cbiAgICBpbXBvcnRQcm9wcyhzdGF0ZSkge1xuICAgICAgICByZXR1cm4gaW1wb3J0QmxhZGVTdGF0ZShzdGF0ZSwgbnVsbCwgKHApID0+ICh7XG4gICAgICAgICAgICB0aXRsZTogcC5vcHRpb25hbC5zdHJpbmcsXG4gICAgICAgIH0pLCAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLnNldCgndGl0bGUnLCByZXN1bHQudGl0bGUpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBleHBvcnRQcm9wcygpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydEJsYWRlU3RhdGUobnVsbCwge1xuICAgICAgICAgICAgdGl0bGU6IHRoaXMucHJvcHMuZ2V0KCd0aXRsZScpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb25DbGlja18oZXYpIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2NsaWNrJywge1xuICAgICAgICAgICAgbmF0aXZlRXZlbnQ6IGV2LFxuICAgICAgICAgICAgc2VuZGVyOiB0aGlzLFxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmNsYXNzIEJ1dHRvbkJsYWRlQ29udHJvbGxlciBleHRlbmRzIEJsYWRlQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoZG9jLCBjb25maWcpIHtcbiAgICAgICAgY29uc3QgYmMgPSBuZXcgQnV0dG9uQ29udHJvbGxlcihkb2MsIHtcbiAgICAgICAgICAgIHByb3BzOiBjb25maWcuYnV0dG9uUHJvcHMsXG4gICAgICAgICAgICB2aWV3UHJvcHM6IGNvbmZpZy52aWV3UHJvcHMsXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBsYyA9IG5ldyBMYWJlbENvbnRyb2xsZXIoZG9jLCB7XG4gICAgICAgICAgICBibGFkZTogY29uZmlnLmJsYWRlLFxuICAgICAgICAgICAgcHJvcHM6IGNvbmZpZy5sYWJlbFByb3BzLFxuICAgICAgICAgICAgdmFsdWVDb250cm9sbGVyOiBiYyxcbiAgICAgICAgfSk7XG4gICAgICAgIHN1cGVyKHtcbiAgICAgICAgICAgIGJsYWRlOiBjb25maWcuYmxhZGUsXG4gICAgICAgICAgICB2aWV3OiBsYy52aWV3LFxuICAgICAgICAgICAgdmlld1Byb3BzOiBjb25maWcudmlld1Byb3BzLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5idXR0b25Db250cm9sbGVyID0gYmM7XG4gICAgICAgIHRoaXMubGFiZWxDb250cm9sbGVyID0gbGM7XG4gICAgfVxuICAgIGltcG9ydFN0YXRlKHN0YXRlKSB7XG4gICAgICAgIHJldHVybiBpbXBvcnRCbGFkZVN0YXRlKHN0YXRlLCAocykgPT4gc3VwZXIuaW1wb3J0U3RhdGUocykgJiZcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uQ29udHJvbGxlci5pbXBvcnRQcm9wcyhzKSAmJlxuICAgICAgICAgICAgdGhpcy5sYWJlbENvbnRyb2xsZXIuaW1wb3J0UHJvcHMocyksICgpID0+ICh7fSksICgpID0+IHRydWUpO1xuICAgIH1cbiAgICBleHBvcnRTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydEJsYWRlU3RhdGUoKCkgPT4gc3VwZXIuZXhwb3J0U3RhdGUoKSwgT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCB0aGlzLmJ1dHRvbkNvbnRyb2xsZXIuZXhwb3J0UHJvcHMoKSksIHRoaXMubGFiZWxDb250cm9sbGVyLmV4cG9ydFByb3BzKCkpKTtcbiAgICB9XG59XG5cbmNsYXNzIFNlbXZlciB7XG4gICAgY29uc3RydWN0b3IodGV4dCkge1xuICAgICAgICBjb25zdCBbY29yZSwgcHJlcmVsZWFzZV0gPSB0ZXh0LnNwbGl0KCctJyk7XG4gICAgICAgIGNvbnN0IGNvcmVDb21wcyA9IGNvcmUuc3BsaXQoJy4nKTtcbiAgICAgICAgdGhpcy5tYWpvciA9IHBhcnNlSW50KGNvcmVDb21wc1swXSwgMTApO1xuICAgICAgICB0aGlzLm1pbm9yID0gcGFyc2VJbnQoY29yZUNvbXBzWzFdLCAxMCk7XG4gICAgICAgIHRoaXMucGF0Y2ggPSBwYXJzZUludChjb3JlQ29tcHNbMl0sIDEwKTtcbiAgICAgICAgdGhpcy5wcmVyZWxlYXNlID0gcHJlcmVsZWFzZSAhPT0gbnVsbCAmJiBwcmVyZWxlYXNlICE9PSB2b2lkIDAgPyBwcmVyZWxlYXNlIDogbnVsbDtcbiAgICB9XG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IGNvcmUgPSBbdGhpcy5tYWpvciwgdGhpcy5taW5vciwgdGhpcy5wYXRjaF0uam9pbignLicpO1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVyZWxlYXNlICE9PSBudWxsID8gW2NvcmUsIHRoaXMucHJlcmVsZWFzZV0uam9pbignLScpIDogY29yZTtcbiAgICB9XG59XG5cbmNvbnN0IFZFUlNJT04kMSA9IG5ldyBTZW12ZXIoJzIuMC41Jyk7XG5cbmZ1bmN0aW9uIGNyZWF0ZVBsdWdpbihwbHVnaW4pIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7IGNvcmU6IFZFUlNJT04kMSB9LCBwbHVnaW4pO1xufVxuXG5jb25zdCBCdXR0b25CbGFkZVBsdWdpbiA9IGNyZWF0ZVBsdWdpbih7XG4gICAgaWQ6ICdidXR0b24nLFxuICAgIHR5cGU6ICdibGFkZScsXG4gICAgYWNjZXB0KHBhcmFtcykge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBwYXJzZVJlY29yZChwYXJhbXMsIChwKSA9PiAoe1xuICAgICAgICAgICAgdGl0bGU6IHAucmVxdWlyZWQuc3RyaW5nLFxuICAgICAgICAgICAgdmlldzogcC5yZXF1aXJlZC5jb25zdGFudCgnYnV0dG9uJyksXG4gICAgICAgICAgICBsYWJlbDogcC5vcHRpb25hbC5zdHJpbmcsXG4gICAgICAgIH0pKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCA/IHsgcGFyYW1zOiByZXN1bHQgfSA6IG51bGw7XG4gICAgfSxcbiAgICBjb250cm9sbGVyKGFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCdXR0b25CbGFkZUNvbnRyb2xsZXIoYXJncy5kb2N1bWVudCwge1xuICAgICAgICAgICAgYmxhZGU6IGFyZ3MuYmxhZGUsXG4gICAgICAgICAgICBidXR0b25Qcm9wczogVmFsdWVNYXAuZnJvbU9iamVjdCh7XG4gICAgICAgICAgICAgICAgdGl0bGU6IGFyZ3MucGFyYW1zLnRpdGxlLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBsYWJlbFByb3BzOiBWYWx1ZU1hcC5mcm9tT2JqZWN0KHtcbiAgICAgICAgICAgICAgICBsYWJlbDogYXJncy5wYXJhbXMubGFiZWwsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHZpZXdQcm9wczogYXJncy52aWV3UHJvcHMsXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgYXBpKGFyZ3MpIHtcbiAgICAgICAgaWYgKGFyZ3MuY29udHJvbGxlciBpbnN0YW5jZW9mIEJ1dHRvbkJsYWRlQ29udHJvbGxlcikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBCdXR0b25BcGkoYXJncy5jb250cm9sbGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxufSk7XG5cbmZ1bmN0aW9uIGFkZEJ1dHRvbkFzQmxhZGUoYXBpLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gYXBpLmFkZEJsYWRlKE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgcGFyYW1zKSwgeyB2aWV3OiAnYnV0dG9uJyB9KSk7XG59XG5mdW5jdGlvbiBhZGRGb2xkZXJBc0JsYWRlKGFwaSwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIGFwaS5hZGRCbGFkZShPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHBhcmFtcyksIHsgdmlldzogJ2ZvbGRlcicgfSkpO1xufVxuZnVuY3Rpb24gYWRkVGFiQXNCbGFkZShhcGksIHBhcmFtcykge1xuICAgIHJldHVybiBhcGkuYWRkQmxhZGUoT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBwYXJhbXMpLCB7IHZpZXc6ICd0YWInIH0pKTtcbn1cblxuZnVuY3Rpb24gaXNSZWZyZXNoYWJsZSh2YWx1ZSkge1xuICAgIGlmICghaXNPYmplY3QkMSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gJ3JlZnJlc2gnIGluIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5yZWZyZXNoID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVCaW5kaW5nVGFyZ2V0KG9iaiwga2V5KSB7XG4gICAgaWYgKCFCaW5kaW5nVGFyZ2V0LmlzQmluZGFibGUob2JqKSkge1xuICAgICAgICB0aHJvdyBUcEVycm9yLm5vdEJpbmRhYmxlKCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQmluZGluZ1RhcmdldChvYmosIGtleSk7XG59XG5jbGFzcyBSYWNrQXBpIHtcbiAgICBjb25zdHJ1Y3Rvcihjb250cm9sbGVyLCBwb29sKSB7XG4gICAgICAgIHRoaXMub25SYWNrVmFsdWVDaGFuZ2VfID0gdGhpcy5vblJhY2tWYWx1ZUNoYW5nZV8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyXyA9IGNvbnRyb2xsZXI7XG4gICAgICAgIHRoaXMuZW1pdHRlcl8gPSBuZXcgRW1pdHRlcigpO1xuICAgICAgICB0aGlzLnBvb2xfID0gcG9vbDtcbiAgICAgICAgY29uc3QgcmFjayA9IHRoaXMuY29udHJvbGxlcl8ucmFjaztcbiAgICAgICAgcmFjay5lbWl0dGVyLm9uKCd2YWx1ZWNoYW5nZScsIHRoaXMub25SYWNrVmFsdWVDaGFuZ2VfKTtcbiAgICB9XG4gICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyXy5yYWNrLmNoaWxkcmVuLm1hcCgoYmMpID0+IHRoaXMucG9vbF8uY3JlYXRlQXBpKGJjKSk7XG4gICAgfVxuICAgIGFkZEJpbmRpbmcob2JqZWN0LCBrZXksIG9wdF9wYXJhbXMpIHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gb3B0X3BhcmFtcyAhPT0gbnVsbCAmJiBvcHRfcGFyYW1zICE9PSB2b2lkIDAgPyBvcHRfcGFyYW1zIDoge307XG4gICAgICAgIGNvbnN0IGRvYyA9IHRoaXMuY29udHJvbGxlcl8uZWxlbWVudC5vd25lckRvY3VtZW50O1xuICAgICAgICBjb25zdCBiYyA9IHRoaXMucG9vbF8uY3JlYXRlQmluZGluZyhkb2MsIGNyZWF0ZUJpbmRpbmdUYXJnZXQob2JqZWN0LCBrZXkpLCBwYXJhbXMpO1xuICAgICAgICBjb25zdCBhcGkgPSB0aGlzLnBvb2xfLmNyZWF0ZUJpbmRpbmdBcGkoYmMpO1xuICAgICAgICByZXR1cm4gdGhpcy5hZGQoYXBpLCBwYXJhbXMuaW5kZXgpO1xuICAgIH1cbiAgICBhZGRGb2xkZXIocGFyYW1zKSB7XG4gICAgICAgIHJldHVybiBhZGRGb2xkZXJBc0JsYWRlKHRoaXMsIHBhcmFtcyk7XG4gICAgfVxuICAgIGFkZEJ1dHRvbihwYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIGFkZEJ1dHRvbkFzQmxhZGUodGhpcywgcGFyYW1zKTtcbiAgICB9XG4gICAgYWRkVGFiKHBhcmFtcykge1xuICAgICAgICByZXR1cm4gYWRkVGFiQXNCbGFkZSh0aGlzLCBwYXJhbXMpO1xuICAgIH1cbiAgICBhZGQoYXBpLCBvcHRfaW5kZXgpIHtcbiAgICAgICAgY29uc3QgYmMgPSBhcGkuY29udHJvbGxlcjtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyXy5yYWNrLmFkZChiYywgb3B0X2luZGV4KTtcbiAgICAgICAgcmV0dXJuIGFwaTtcbiAgICB9XG4gICAgcmVtb3ZlKGFwaSkge1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXJfLnJhY2sucmVtb3ZlKGFwaS5jb250cm9sbGVyKTtcbiAgICB9XG4gICAgYWRkQmxhZGUocGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IGRvYyA9IHRoaXMuY29udHJvbGxlcl8uZWxlbWVudC5vd25lckRvY3VtZW50O1xuICAgICAgICBjb25zdCBiYyA9IHRoaXMucG9vbF8uY3JlYXRlQmxhZGUoZG9jLCBwYXJhbXMpO1xuICAgICAgICBjb25zdCBhcGkgPSB0aGlzLnBvb2xfLmNyZWF0ZUFwaShiYyk7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZChhcGksIHBhcmFtcy5pbmRleCk7XG4gICAgfVxuICAgIG9uKGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgICAgICBjb25zdCBiaCA9IGhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5lbWl0dGVyXy5vbihldmVudE5hbWUsIChldikgPT4ge1xuICAgICAgICAgICAgYmgoZXYpO1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICBrZXk6IGhhbmRsZXIsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgb2ZmKGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgICAgICB0aGlzLmVtaXR0ZXJfLm9mZihldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmVmcmVzaCgpIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChjKSA9PiB7XG4gICAgICAgICAgICBpZiAoaXNSZWZyZXNoYWJsZShjKSkge1xuICAgICAgICAgICAgICAgIGMucmVmcmVzaCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb25SYWNrVmFsdWVDaGFuZ2VfKGV2KSB7XG4gICAgICAgIGNvbnN0IGJjID0gZXYuYmxhZGVDb250cm9sbGVyO1xuICAgICAgICBjb25zdCBhcGkgPSB0aGlzLnBvb2xfLmNyZWF0ZUFwaShiYyk7XG4gICAgICAgIGNvbnN0IGJpbmRpbmcgPSBpc0JpbmRpbmdWYWx1ZShiYy52YWx1ZSkgPyBiYy52YWx1ZS5iaW5kaW5nIDogbnVsbDtcbiAgICAgICAgdGhpcy5lbWl0dGVyXy5lbWl0KCdjaGFuZ2UnLCBuZXcgVHBDaGFuZ2VFdmVudChhcGksIGJpbmRpbmcgPyBiaW5kaW5nLnRhcmdldC5yZWFkKCkgOiBiYy52YWx1ZS5yYXdWYWx1ZSwgZXYub3B0aW9ucy5sYXN0KSk7XG4gICAgfVxufVxuXG5jbGFzcyBDb250YWluZXJCbGFkZUFwaSBleHRlbmRzIEJsYWRlQXBpIHtcbiAgICBjb25zdHJ1Y3Rvcihjb250cm9sbGVyLCBwb29sKSB7XG4gICAgICAgIHN1cGVyKGNvbnRyb2xsZXIpO1xuICAgICAgICB0aGlzLnJhY2tBcGlfID0gbmV3IFJhY2tBcGkoY29udHJvbGxlci5yYWNrQ29udHJvbGxlciwgcG9vbCk7XG4gICAgfVxuICAgIHJlZnJlc2goKSB7XG4gICAgICAgIHRoaXMucmFja0FwaV8ucmVmcmVzaCgpO1xuICAgIH1cbn1cblxuY2xhc3MgQ29udGFpbmVyQmxhZGVDb250cm9sbGVyIGV4dGVuZHMgQmxhZGVDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICAgICAgc3VwZXIoe1xuICAgICAgICAgICAgYmxhZGU6IGNvbmZpZy5ibGFkZSxcbiAgICAgICAgICAgIHZpZXc6IGNvbmZpZy52aWV3LFxuICAgICAgICAgICAgdmlld1Byb3BzOiBjb25maWcucmFja0NvbnRyb2xsZXIudmlld1Byb3BzLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yYWNrQ29udHJvbGxlciA9IGNvbmZpZy5yYWNrQ29udHJvbGxlcjtcbiAgICB9XG4gICAgaW1wb3J0U3RhdGUoc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIGltcG9ydEJsYWRlU3RhdGUoc3RhdGUsIChzKSA9PiBzdXBlci5pbXBvcnRTdGF0ZShzKSwgKHApID0+ICh7XG4gICAgICAgICAgICBjaGlsZHJlbjogcC5yZXF1aXJlZC5hcnJheShwLnJlcXVpcmVkLnJhdyksXG4gICAgICAgIH0pLCAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yYWNrQ29udHJvbGxlci5yYWNrLmNoaWxkcmVuLmV2ZXJ5KChjLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBjLmltcG9ydFN0YXRlKHJlc3VsdC5jaGlsZHJlbltpbmRleF0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBleHBvcnRTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydEJsYWRlU3RhdGUoKCkgPT4gc3VwZXIuZXhwb3J0U3RhdGUoKSwge1xuICAgICAgICAgICAgY2hpbGRyZW46IHRoaXMucmFja0NvbnRyb2xsZXIucmFjay5jaGlsZHJlbi5tYXAoKGMpID0+IGMuZXhwb3J0U3RhdGUoKSksXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGlzQ29udGFpbmVyQmxhZGVDb250cm9sbGVyKGJjKSB7XG4gICAgcmV0dXJuICdyYWNrQ29udHJvbGxlcicgaW4gYmM7XG59XG5cbmNsYXNzIE5lc3RlZE9yZGVyZWRTZXQge1xuICAgIGNvbnN0cnVjdG9yKGV4dHJhY3QpIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5pdGVtc18gPSBbXTtcbiAgICAgICAgdGhpcy5jYWNoZV8gPSBuZXcgU2V0KCk7XG4gICAgICAgIHRoaXMub25TdWJMaXN0QWRkXyA9IHRoaXMub25TdWJMaXN0QWRkXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uU3ViTGlzdFJlbW92ZV8gPSB0aGlzLm9uU3ViTGlzdFJlbW92ZV8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5leHRyYWN0XyA9IGV4dHJhY3Q7XG4gICAgfVxuICAgIGdldCBpdGVtcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXRlbXNfO1xuICAgIH1cbiAgICBhbGxJdGVtcygpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5jYWNoZV8pO1xuICAgIH1cbiAgICBmaW5kKGNhbGxiYWNrKSB7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLmFsbEl0ZW1zKCkpIHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayhpdGVtKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpbmNsdWRlcyhpdGVtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlXy5oYXMoaXRlbSk7XG4gICAgfVxuICAgIGFkZChpdGVtLCBvcHRfaW5kZXgpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5jbHVkZXMoaXRlbSkpIHtcbiAgICAgICAgICAgIHRocm93IFRwRXJyb3Iuc2hvdWxkTmV2ZXJIYXBwZW4oKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpbmRleCA9IG9wdF9pbmRleCAhPT0gdW5kZWZpbmVkID8gb3B0X2luZGV4IDogdGhpcy5pdGVtc18ubGVuZ3RoO1xuICAgICAgICB0aGlzLml0ZW1zXy5zcGxpY2UoaW5kZXgsIDAsIGl0ZW0pO1xuICAgICAgICB0aGlzLmNhY2hlXy5hZGQoaXRlbSk7XG4gICAgICAgIGNvbnN0IHN1Ykxpc3QgPSB0aGlzLmV4dHJhY3RfKGl0ZW0pO1xuICAgICAgICBpZiAoc3ViTGlzdCkge1xuICAgICAgICAgICAgc3ViTGlzdC5lbWl0dGVyLm9uKCdhZGQnLCB0aGlzLm9uU3ViTGlzdEFkZF8pO1xuICAgICAgICAgICAgc3ViTGlzdC5lbWl0dGVyLm9uKCdyZW1vdmUnLCB0aGlzLm9uU3ViTGlzdFJlbW92ZV8pO1xuICAgICAgICAgICAgc3ViTGlzdC5hbGxJdGVtcygpLmZvckVhY2goKGkpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlXy5hZGQoaSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnYWRkJywge1xuICAgICAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICAgICAgaXRlbTogaXRlbSxcbiAgICAgICAgICAgIHJvb3Q6IHRoaXMsXG4gICAgICAgICAgICB0YXJnZXQ6IHRoaXMsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZW1vdmUoaXRlbSkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuaXRlbXNfLmluZGV4T2YoaXRlbSk7XG4gICAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLml0ZW1zXy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB0aGlzLmNhY2hlXy5kZWxldGUoaXRlbSk7XG4gICAgICAgIGNvbnN0IHN1Ykxpc3QgPSB0aGlzLmV4dHJhY3RfKGl0ZW0pO1xuICAgICAgICBpZiAoc3ViTGlzdCkge1xuICAgICAgICAgICAgc3ViTGlzdC5hbGxJdGVtcygpLmZvckVhY2goKGkpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlXy5kZWxldGUoaSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHN1Ykxpc3QuZW1pdHRlci5vZmYoJ2FkZCcsIHRoaXMub25TdWJMaXN0QWRkXyk7XG4gICAgICAgICAgICBzdWJMaXN0LmVtaXR0ZXIub2ZmKCdyZW1vdmUnLCB0aGlzLm9uU3ViTGlzdFJlbW92ZV8pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdyZW1vdmUnLCB7XG4gICAgICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgICAgICBpdGVtOiBpdGVtLFxuICAgICAgICAgICAgcm9vdDogdGhpcyxcbiAgICAgICAgICAgIHRhcmdldDogdGhpcyxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG9uU3ViTGlzdEFkZF8oZXYpIHtcbiAgICAgICAgdGhpcy5jYWNoZV8uYWRkKGV2Lml0ZW0pO1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnYWRkJywge1xuICAgICAgICAgICAgaW5kZXg6IGV2LmluZGV4LFxuICAgICAgICAgICAgaXRlbTogZXYuaXRlbSxcbiAgICAgICAgICAgIHJvb3Q6IHRoaXMsXG4gICAgICAgICAgICB0YXJnZXQ6IGV2LnRhcmdldCxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG9uU3ViTGlzdFJlbW92ZV8oZXYpIHtcbiAgICAgICAgdGhpcy5jYWNoZV8uZGVsZXRlKGV2Lml0ZW0pO1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgncmVtb3ZlJywge1xuICAgICAgICAgICAgaW5kZXg6IGV2LmluZGV4LFxuICAgICAgICAgICAgaXRlbTogZXYuaXRlbSxcbiAgICAgICAgICAgIHJvb3Q6IHRoaXMsXG4gICAgICAgICAgICB0YXJnZXQ6IGV2LnRhcmdldCxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmaW5kVmFsdWVCbGFkZUNvbnRyb2xsZXIoYmNzLCB2KSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiY3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgYmMgPSBiY3NbaV07XG4gICAgICAgIGlmIChpc1ZhbHVlQmxhZGVDb250cm9sbGVyKGJjKSAmJiBiYy52YWx1ZSA9PT0gdikge1xuICAgICAgICAgICAgcmV0dXJuIGJjO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuZnVuY3Rpb24gZmluZFN1YkJsYWRlQ29udHJvbGxlclNldChiYykge1xuICAgIHJldHVybiBpc0NvbnRhaW5lckJsYWRlQ29udHJvbGxlcihiYylcbiAgICAgICAgPyBiYy5yYWNrQ29udHJvbGxlci5yYWNrWydiY1NldF8nXVxuICAgICAgICA6IG51bGw7XG59XG5jbGFzcyBSYWNrIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5vbkJsYWRlUG9zaXRpb25zQ2hhbmdlXyA9IHRoaXMub25CbGFkZVBvc2l0aW9uc0NoYW5nZV8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vblNldEFkZF8gPSB0aGlzLm9uU2V0QWRkXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uU2V0UmVtb3ZlXyA9IHRoaXMub25TZXRSZW1vdmVfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25DaGlsZERpc3Bvc2VfID0gdGhpcy5vbkNoaWxkRGlzcG9zZV8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbkNoaWxkUG9zaXRpb25zQ2hhbmdlXyA9IHRoaXMub25DaGlsZFBvc2l0aW9uc0NoYW5nZV8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbkNoaWxkVmFsdWVDaGFuZ2VfID0gdGhpcy5vbkNoaWxkVmFsdWVDaGFuZ2VfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25DaGlsZFZpZXdQcm9wc0NoYW5nZV8gPSB0aGlzLm9uQ2hpbGRWaWV3UHJvcHNDaGFuZ2VfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25SYWNrTGF5b3V0XyA9IHRoaXMub25SYWNrTGF5b3V0Xy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uUmFja1ZhbHVlQ2hhbmdlXyA9IHRoaXMub25SYWNrVmFsdWVDaGFuZ2VfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuYmxhZGVfID0gKF9hID0gY29uZmlnLmJsYWRlKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBudWxsO1xuICAgICAgICAoX2IgPSB0aGlzLmJsYWRlXykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnZhbHVlKCdwb3NpdGlvbnMnKS5lbWl0dGVyLm9uKCdjaGFuZ2UnLCB0aGlzLm9uQmxhZGVQb3NpdGlvbnNDaGFuZ2VfKTtcbiAgICAgICAgdGhpcy52aWV3UHJvcHMgPSBjb25maWcudmlld1Byb3BzO1xuICAgICAgICB0aGlzLmJjU2V0XyA9IG5ldyBOZXN0ZWRPcmRlcmVkU2V0KGZpbmRTdWJCbGFkZUNvbnRyb2xsZXJTZXQpO1xuICAgICAgICB0aGlzLmJjU2V0Xy5lbWl0dGVyLm9uKCdhZGQnLCB0aGlzLm9uU2V0QWRkXyk7XG4gICAgICAgIHRoaXMuYmNTZXRfLmVtaXR0ZXIub24oJ3JlbW92ZScsIHRoaXMub25TZXRSZW1vdmVfKTtcbiAgICB9XG4gICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5iY1NldF8uaXRlbXM7XG4gICAgfVxuICAgIGFkZChiYywgb3B0X2luZGV4KSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgKF9hID0gYmMucGFyZW50KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVtb3ZlKGJjKTtcbiAgICAgICAgYmMucGFyZW50ID0gdGhpcztcbiAgICAgICAgdGhpcy5iY1NldF8uYWRkKGJjLCBvcHRfaW5kZXgpO1xuICAgIH1cbiAgICByZW1vdmUoYmMpIHtcbiAgICAgICAgYmMucGFyZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5iY1NldF8ucmVtb3ZlKGJjKTtcbiAgICB9XG4gICAgZmluZChmaW5kZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmNTZXRfLmFsbEl0ZW1zKCkuZmlsdGVyKGZpbmRlcik7XG4gICAgfVxuICAgIG9uU2V0QWRkXyhldikge1xuICAgICAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uc18oKTtcbiAgICAgICAgY29uc3Qgcm9vdCA9IGV2LnRhcmdldCA9PT0gZXYucm9vdDtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2FkZCcsIHtcbiAgICAgICAgICAgIGJsYWRlQ29udHJvbGxlcjogZXYuaXRlbSxcbiAgICAgICAgICAgIGluZGV4OiBldi5pbmRleCxcbiAgICAgICAgICAgIHJvb3Q6IHJvb3QsXG4gICAgICAgICAgICBzZW5kZXI6IHRoaXMsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIXJvb3QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBiYyA9IGV2Lml0ZW07XG4gICAgICAgIGJjLnZpZXdQcm9wcy5lbWl0dGVyLm9uKCdjaGFuZ2UnLCB0aGlzLm9uQ2hpbGRWaWV3UHJvcHNDaGFuZ2VfKTtcbiAgICAgICAgYmMuYmxhZGVcbiAgICAgICAgICAgIC52YWx1ZSgncG9zaXRpb25zJylcbiAgICAgICAgICAgIC5lbWl0dGVyLm9uKCdjaGFuZ2UnLCB0aGlzLm9uQ2hpbGRQb3NpdGlvbnNDaGFuZ2VfKTtcbiAgICAgICAgYmMudmlld1Byb3BzLmhhbmRsZURpc3Bvc2UodGhpcy5vbkNoaWxkRGlzcG9zZV8pO1xuICAgICAgICBpZiAoaXNWYWx1ZUJsYWRlQ29udHJvbGxlcihiYykpIHtcbiAgICAgICAgICAgIGJjLnZhbHVlLmVtaXR0ZXIub24oJ2NoYW5nZScsIHRoaXMub25DaGlsZFZhbHVlQ2hhbmdlXyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNDb250YWluZXJCbGFkZUNvbnRyb2xsZXIoYmMpKSB7XG4gICAgICAgICAgICBjb25zdCByYWNrID0gYmMucmFja0NvbnRyb2xsZXIucmFjaztcbiAgICAgICAgICAgIGlmIChyYWNrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW1pdHRlciA9IHJhY2suZW1pdHRlcjtcbiAgICAgICAgICAgICAgICBlbWl0dGVyLm9uKCdsYXlvdXQnLCB0aGlzLm9uUmFja0xheW91dF8pO1xuICAgICAgICAgICAgICAgIGVtaXR0ZXIub24oJ3ZhbHVlY2hhbmdlJywgdGhpcy5vblJhY2tWYWx1ZUNoYW5nZV8pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIG9uU2V0UmVtb3ZlXyhldikge1xuICAgICAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uc18oKTtcbiAgICAgICAgY29uc3Qgcm9vdCA9IGV2LnRhcmdldCA9PT0gZXYucm9vdDtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3JlbW92ZScsIHtcbiAgICAgICAgICAgIGJsYWRlQ29udHJvbGxlcjogZXYuaXRlbSxcbiAgICAgICAgICAgIHJvb3Q6IHJvb3QsXG4gICAgICAgICAgICBzZW5kZXI6IHRoaXMsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIXJvb3QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBiYyA9IGV2Lml0ZW07XG4gICAgICAgIGlmIChpc1ZhbHVlQmxhZGVDb250cm9sbGVyKGJjKSkge1xuICAgICAgICAgICAgYmMudmFsdWUuZW1pdHRlci5vZmYoJ2NoYW5nZScsIHRoaXMub25DaGlsZFZhbHVlQ2hhbmdlXyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNDb250YWluZXJCbGFkZUNvbnRyb2xsZXIoYmMpKSB7XG4gICAgICAgICAgICBjb25zdCByYWNrID0gYmMucmFja0NvbnRyb2xsZXIucmFjaztcbiAgICAgICAgICAgIGlmIChyYWNrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW1pdHRlciA9IHJhY2suZW1pdHRlcjtcbiAgICAgICAgICAgICAgICBlbWl0dGVyLm9mZignbGF5b3V0JywgdGhpcy5vblJhY2tMYXlvdXRfKTtcbiAgICAgICAgICAgICAgICBlbWl0dGVyLm9mZigndmFsdWVjaGFuZ2UnLCB0aGlzLm9uUmFja1ZhbHVlQ2hhbmdlXyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgdXBkYXRlUG9zaXRpb25zXygpIHtcbiAgICAgICAgY29uc3QgdmlzaWJsZUl0ZW1zID0gdGhpcy5iY1NldF8uaXRlbXMuZmlsdGVyKChiYykgPT4gIWJjLnZpZXdQcm9wcy5nZXQoJ2hpZGRlbicpKTtcbiAgICAgICAgY29uc3QgZmlyc3RWaXNpYmxlSXRlbSA9IHZpc2libGVJdGVtc1swXTtcbiAgICAgICAgY29uc3QgbGFzdFZpc2libGVJdGVtID0gdmlzaWJsZUl0ZW1zW3Zpc2libGVJdGVtcy5sZW5ndGggLSAxXTtcbiAgICAgICAgdGhpcy5iY1NldF8uaXRlbXMuZm9yRWFjaCgoYmMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBzID0gW107XG4gICAgICAgICAgICBpZiAoYmMgPT09IGZpcnN0VmlzaWJsZUl0ZW0pIHtcbiAgICAgICAgICAgICAgICBwcy5wdXNoKCdmaXJzdCcpO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5ibGFkZV8gfHxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ibGFkZV8uZ2V0KCdwb3NpdGlvbnMnKS5pbmNsdWRlcygndmVyeWZpcnN0JykpIHtcbiAgICAgICAgICAgICAgICAgICAgcHMucHVzaCgndmVyeWZpcnN0Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJjID09PSBsYXN0VmlzaWJsZUl0ZW0pIHtcbiAgICAgICAgICAgICAgICBwcy5wdXNoKCdsYXN0Jyk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJsYWRlXyB8fCB0aGlzLmJsYWRlXy5nZXQoJ3Bvc2l0aW9ucycpLmluY2x1ZGVzKCd2ZXJ5bGFzdCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBzLnB1c2goJ3ZlcnlsYXN0Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmMuYmxhZGUuc2V0KCdwb3NpdGlvbnMnLCBwcyk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvbkNoaWxkUG9zaXRpb25zQ2hhbmdlXygpIHtcbiAgICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbnNfKCk7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdsYXlvdXQnLCB7XG4gICAgICAgICAgICBzZW5kZXI6IHRoaXMsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvbkNoaWxkVmlld1Byb3BzQ2hhbmdlXyhfZXYpIHtcbiAgICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbnNfKCk7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdsYXlvdXQnLCB7XG4gICAgICAgICAgICBzZW5kZXI6IHRoaXMsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvbkNoaWxkRGlzcG9zZV8oKSB7XG4gICAgICAgIGNvbnN0IGRpc3Bvc2VkVWNzID0gdGhpcy5iY1NldF8uaXRlbXMuZmlsdGVyKChiYykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGJjLnZpZXdQcm9wcy5nZXQoJ2Rpc3Bvc2VkJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBkaXNwb3NlZFVjcy5mb3JFYWNoKChiYykgPT4ge1xuICAgICAgICAgICAgdGhpcy5iY1NldF8ucmVtb3ZlKGJjKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG9uQ2hpbGRWYWx1ZUNoYW5nZV8oZXYpIHtcbiAgICAgICAgY29uc3QgYmMgPSBmaW5kVmFsdWVCbGFkZUNvbnRyb2xsZXIodGhpcy5maW5kKGlzVmFsdWVCbGFkZUNvbnRyb2xsZXIpLCBldi5zZW5kZXIpO1xuICAgICAgICBpZiAoIWJjKSB7XG4gICAgICAgICAgICB0aHJvdyBUcEVycm9yLmFscmVhZHlEaXNwb3NlZCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCd2YWx1ZWNoYW5nZScsIHtcbiAgICAgICAgICAgIGJsYWRlQ29udHJvbGxlcjogYmMsXG4gICAgICAgICAgICBvcHRpb25zOiBldi5vcHRpb25zLFxuICAgICAgICAgICAgc2VuZGVyOiB0aGlzLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb25SYWNrTGF5b3V0XyhfKSB7XG4gICAgICAgIHRoaXMudXBkYXRlUG9zaXRpb25zXygpO1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnbGF5b3V0Jywge1xuICAgICAgICAgICAgc2VuZGVyOiB0aGlzLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb25SYWNrVmFsdWVDaGFuZ2VfKGV2KSB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCd2YWx1ZWNoYW5nZScsIHtcbiAgICAgICAgICAgIGJsYWRlQ29udHJvbGxlcjogZXYuYmxhZGVDb250cm9sbGVyLFxuICAgICAgICAgICAgb3B0aW9uczogZXYub3B0aW9ucyxcbiAgICAgICAgICAgIHNlbmRlcjogdGhpcyxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG9uQmxhZGVQb3NpdGlvbnNDaGFuZ2VfKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uc18oKTtcbiAgICB9XG59XG5cbmNsYXNzIFJhY2tDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICAgICAgdGhpcy5vblJhY2tBZGRfID0gdGhpcy5vblJhY2tBZGRfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25SYWNrUmVtb3ZlXyA9IHRoaXMub25SYWNrUmVtb3ZlXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBjb25maWcuZWxlbWVudDtcbiAgICAgICAgdGhpcy52aWV3UHJvcHMgPSBjb25maWcudmlld1Byb3BzO1xuICAgICAgICBjb25zdCByYWNrID0gbmV3IFJhY2soe1xuICAgICAgICAgICAgYmxhZGU6IGNvbmZpZy5yb290ID8gdW5kZWZpbmVkIDogY29uZmlnLmJsYWRlLFxuICAgICAgICAgICAgdmlld1Byb3BzOiBjb25maWcudmlld1Byb3BzLFxuICAgICAgICB9KTtcbiAgICAgICAgcmFjay5lbWl0dGVyLm9uKCdhZGQnLCB0aGlzLm9uUmFja0FkZF8pO1xuICAgICAgICByYWNrLmVtaXR0ZXIub24oJ3JlbW92ZScsIHRoaXMub25SYWNrUmVtb3ZlXyk7XG4gICAgICAgIHRoaXMucmFjayA9IHJhY2s7XG4gICAgICAgIHRoaXMudmlld1Byb3BzLmhhbmRsZURpc3Bvc2UoKCkgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMucmFjay5jaGlsZHJlbi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJjID0gdGhpcy5yYWNrLmNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgIGJjLnZpZXdQcm9wcy5zZXQoJ2Rpc3Bvc2VkJywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvblJhY2tBZGRfKGV2KSB7XG4gICAgICAgIGlmICghZXYucm9vdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGluc2VydEVsZW1lbnRBdCh0aGlzLmVsZW1lbnQsIGV2LmJsYWRlQ29udHJvbGxlci52aWV3LmVsZW1lbnQsIGV2LmluZGV4KTtcbiAgICB9XG4gICAgb25SYWNrUmVtb3ZlXyhldikge1xuICAgICAgICBpZiAoIWV2LnJvb3QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZW1vdmVFbGVtZW50KGV2LmJsYWRlQ29udHJvbGxlci52aWV3LmVsZW1lbnQpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlQmxhZGUoKSB7XG4gICAgcmV0dXJuIG5ldyBWYWx1ZU1hcCh7XG4gICAgICAgIHBvc2l0aW9uczogY3JlYXRlVmFsdWUoW10sIHtcbiAgICAgICAgICAgIGVxdWFsczogZGVlcEVxdWFsc0FycmF5LFxuICAgICAgICB9KSxcbiAgICB9KTtcbn1cblxuY2xhc3MgRm9sZGFibGUgZXh0ZW5kcyBWYWx1ZU1hcCB7XG4gICAgY29uc3RydWN0b3IodmFsdWVNYXApIHtcbiAgICAgICAgc3VwZXIodmFsdWVNYXApO1xuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlKGV4cGFuZGVkKSB7XG4gICAgICAgIGNvbnN0IGNvcmVPYmogPSB7XG4gICAgICAgICAgICBjb21wbGV0ZWQ6IHRydWUsXG4gICAgICAgICAgICBleHBhbmRlZDogZXhwYW5kZWQsXG4gICAgICAgICAgICBleHBhbmRlZEhlaWdodDogbnVsbCxcbiAgICAgICAgICAgIHNob3VsZEZpeEhlaWdodDogZmFsc2UsXG4gICAgICAgICAgICB0ZW1wb3JhcnlFeHBhbmRlZDogbnVsbCxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY29yZSA9IFZhbHVlTWFwLmNyZWF0ZUNvcmUoY29yZU9iaik7XG4gICAgICAgIHJldHVybiBuZXcgRm9sZGFibGUoY29yZSk7XG4gICAgfVxuICAgIGdldCBzdHlsZUV4cGFuZGVkKCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiAoX2EgPSB0aGlzLmdldCgndGVtcG9yYXJ5RXhwYW5kZWQnKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogdGhpcy5nZXQoJ2V4cGFuZGVkJyk7XG4gICAgfVxuICAgIGdldCBzdHlsZUhlaWdodCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0eWxlRXhwYW5kZWQpIHtcbiAgICAgICAgICAgIHJldHVybiAnMCc7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZXhIZWlnaHQgPSB0aGlzLmdldCgnZXhwYW5kZWRIZWlnaHQnKTtcbiAgICAgICAgaWYgKHRoaXMuZ2V0KCdzaG91bGRGaXhIZWlnaHQnKSAmJiAhaXNFbXB0eShleEhlaWdodCkpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHtleEhlaWdodH1weGA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdhdXRvJztcbiAgICB9XG4gICAgYmluZEV4cGFuZGVkQ2xhc3MoZWxlbSwgZXhwYW5kZWRDbGFzc05hbWUpIHtcbiAgICAgICAgY29uc3Qgb25FeHBhbmQgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBleHBhbmRlZCA9IHRoaXMuc3R5bGVFeHBhbmRlZDtcbiAgICAgICAgICAgIGlmIChleHBhbmRlZCkge1xuICAgICAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChleHBhbmRlZENsYXNzTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoZXhwYW5kZWRDbGFzc05hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBiaW5kVmFsdWVNYXAodGhpcywgJ2V4cGFuZGVkJywgb25FeHBhbmQpO1xuICAgICAgICBiaW5kVmFsdWVNYXAodGhpcywgJ3RlbXBvcmFyeUV4cGFuZGVkJywgb25FeHBhbmQpO1xuICAgIH1cbiAgICBjbGVhblVwVHJhbnNpdGlvbigpIHtcbiAgICAgICAgdGhpcy5zZXQoJ3Nob3VsZEZpeEhlaWdodCcsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5zZXQoJ2V4cGFuZGVkSGVpZ2h0JywgbnVsbCk7XG4gICAgICAgIHRoaXMuc2V0KCdjb21wbGV0ZWQnLCB0cnVlKTtcbiAgICB9XG59XG5mdW5jdGlvbiBjb21wdXRlRXhwYW5kZWRGb2xkZXJIZWlnaHQoZm9sZGVyLCBjb250YWluZXJFbGVtZW50KSB7XG4gICAgbGV0IGhlaWdodCA9IDA7XG4gICAgZGlzYWJsZVRyYW5zaXRpb25UZW1wb3JhcmlseShjb250YWluZXJFbGVtZW50LCAoKSA9PiB7XG4gICAgICAgIGZvbGRlci5zZXQoJ2V4cGFuZGVkSGVpZ2h0JywgbnVsbCk7XG4gICAgICAgIGZvbGRlci5zZXQoJ3RlbXBvcmFyeUV4cGFuZGVkJywgdHJ1ZSk7XG4gICAgICAgIGZvcmNlUmVmbG93KGNvbnRhaW5lckVsZW1lbnQpO1xuICAgICAgICBoZWlnaHQgPSBjb250YWluZXJFbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgZm9sZGVyLnNldCgndGVtcG9yYXJ5RXhwYW5kZWQnLCBudWxsKTtcbiAgICAgICAgZm9yY2VSZWZsb3coY29udGFpbmVyRWxlbWVudCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGhlaWdodDtcbn1cbmZ1bmN0aW9uIGFwcGx5SGVpZ2h0KGZvbGRhYmxlLCBlbGVtKSB7XG4gICAgZWxlbS5zdHlsZS5oZWlnaHQgPSBmb2xkYWJsZS5zdHlsZUhlaWdodDtcbn1cbmZ1bmN0aW9uIGJpbmRGb2xkYWJsZShmb2xkYWJsZSwgZWxlbSkge1xuICAgIGZvbGRhYmxlLnZhbHVlKCdleHBhbmRlZCcpLmVtaXR0ZXIub24oJ2JlZm9yZWNoYW5nZScsICgpID0+IHtcbiAgICAgICAgZm9sZGFibGUuc2V0KCdjb21wbGV0ZWQnLCBmYWxzZSk7XG4gICAgICAgIGlmIChpc0VtcHR5KGZvbGRhYmxlLmdldCgnZXhwYW5kZWRIZWlnaHQnKSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGggPSBjb21wdXRlRXhwYW5kZWRGb2xkZXJIZWlnaHQoZm9sZGFibGUsIGVsZW0pO1xuICAgICAgICAgICAgaWYgKGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9sZGFibGUuc2V0KCdleHBhbmRlZEhlaWdodCcsIGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvbGRhYmxlLnNldCgnc2hvdWxkRml4SGVpZ2h0JywgdHJ1ZSk7XG4gICAgICAgIGZvcmNlUmVmbG93KGVsZW0pO1xuICAgIH0pO1xuICAgIGZvbGRhYmxlLmVtaXR0ZXIub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgICAgYXBwbHlIZWlnaHQoZm9sZGFibGUsIGVsZW0pO1xuICAgIH0pO1xuICAgIGFwcGx5SGVpZ2h0KGZvbGRhYmxlLCBlbGVtKTtcbiAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCAoZXYpID0+IHtcbiAgICAgICAgaWYgKGV2LnByb3BlcnR5TmFtZSAhPT0gJ2hlaWdodCcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmb2xkYWJsZS5jbGVhblVwVHJhbnNpdGlvbigpO1xuICAgIH0pO1xufVxuXG5jbGFzcyBGb2xkZXJBcGkgZXh0ZW5kcyBDb250YWluZXJCbGFkZUFwaSB7XG4gICAgY29uc3RydWN0b3IoY29udHJvbGxlciwgcG9vbCkge1xuICAgICAgICBzdXBlcihjb250cm9sbGVyLCBwb29sKTtcbiAgICAgICAgdGhpcy5lbWl0dGVyXyA9IG5ldyBFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci5mb2xkYWJsZVxuICAgICAgICAgICAgLnZhbHVlKCdleHBhbmRlZCcpXG4gICAgICAgICAgICAuZW1pdHRlci5vbignY2hhbmdlJywgKGV2KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVtaXR0ZXJfLmVtaXQoJ2ZvbGQnLCBuZXcgVHBGb2xkRXZlbnQodGhpcywgZXYuc2VuZGVyLnJhd1ZhbHVlKSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJhY2tBcGlfLm9uKCdjaGFuZ2UnLCAoZXYpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW1pdHRlcl8uZW1pdCgnY2hhbmdlJywgZXYpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0IGV4cGFuZGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyLmZvbGRhYmxlLmdldCgnZXhwYW5kZWQnKTtcbiAgICB9XG4gICAgc2V0IGV4cGFuZGVkKGV4cGFuZGVkKSB7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci5mb2xkYWJsZS5zZXQoJ2V4cGFuZGVkJywgZXhwYW5kZWQpO1xuICAgIH1cbiAgICBnZXQgdGl0bGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXIucHJvcHMuZ2V0KCd0aXRsZScpO1xuICAgIH1cbiAgICBzZXQgdGl0bGUodGl0bGUpIHtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnByb3BzLnNldCgndGl0bGUnLCB0aXRsZSk7XG4gICAgfVxuICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmFja0FwaV8uY2hpbGRyZW47XG4gICAgfVxuICAgIGFkZEJpbmRpbmcob2JqZWN0LCBrZXksIG9wdF9wYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmFja0FwaV8uYWRkQmluZGluZyhvYmplY3QsIGtleSwgb3B0X3BhcmFtcyk7XG4gICAgfVxuICAgIGFkZEZvbGRlcihwYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmFja0FwaV8uYWRkRm9sZGVyKHBhcmFtcyk7XG4gICAgfVxuICAgIGFkZEJ1dHRvbihwYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmFja0FwaV8uYWRkQnV0dG9uKHBhcmFtcyk7XG4gICAgfVxuICAgIGFkZFRhYihwYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmFja0FwaV8uYWRkVGFiKHBhcmFtcyk7XG4gICAgfVxuICAgIGFkZChhcGksIG9wdF9pbmRleCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yYWNrQXBpXy5hZGQoYXBpLCBvcHRfaW5kZXgpO1xuICAgIH1cbiAgICByZW1vdmUoYXBpKSB7XG4gICAgICAgIHRoaXMucmFja0FwaV8ucmVtb3ZlKGFwaSk7XG4gICAgfVxuICAgIGFkZEJsYWRlKHBhcmFtcykge1xuICAgICAgICByZXR1cm4gdGhpcy5yYWNrQXBpXy5hZGRCbGFkZShwYXJhbXMpO1xuICAgIH1cbiAgICBvbihldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgICAgY29uc3QgYmggPSBoYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZW1pdHRlcl8ub24oZXZlbnROYW1lLCAoZXYpID0+IHtcbiAgICAgICAgICAgIGJoKGV2KTtcbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiBoYW5kbGVyLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIG9mZihldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyXy5vZmYoZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG5jb25zdCBibGFkZUNvbnRhaW5lckNsYXNzTmFtZSA9IENsYXNzTmFtZSgnY250Jyk7XG5cbmNsYXNzIEZvbGRlclZpZXcge1xuICAgIGNvbnN0cnVjdG9yKGRvYywgY29uZmlnKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgdGhpcy5jbGFzc05hbWVfID0gQ2xhc3NOYW1lKChfYSA9IGNvbmZpZy52aWV3TmFtZSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogJ2ZsZCcpO1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMuY2xhc3NOYW1lXygpLCBibGFkZUNvbnRhaW5lckNsYXNzTmFtZSgpKTtcbiAgICAgICAgY29uZmlnLnZpZXdQcm9wcy5iaW5kQ2xhc3NNb2RpZmllcnModGhpcy5lbGVtZW50KTtcbiAgICAgICAgdGhpcy5mb2xkYWJsZV8gPSBjb25maWcuZm9sZGFibGU7XG4gICAgICAgIHRoaXMuZm9sZGFibGVfLmJpbmRFeHBhbmRlZENsYXNzKHRoaXMuZWxlbWVudCwgdGhpcy5jbGFzc05hbWVfKHVuZGVmaW5lZCwgJ2V4cGFuZGVkJykpO1xuICAgICAgICBiaW5kVmFsdWVNYXAodGhpcy5mb2xkYWJsZV8sICdjb21wbGV0ZWQnLCB2YWx1ZVRvQ2xhc3NOYW1lKHRoaXMuZWxlbWVudCwgdGhpcy5jbGFzc05hbWVfKHVuZGVmaW5lZCwgJ2NwbCcpKSk7XG4gICAgICAgIGNvbnN0IGJ1dHRvbkVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIGJ1dHRvbkVsZW0uY2xhc3NMaXN0LmFkZCh0aGlzLmNsYXNzTmFtZV8oJ2InKSk7XG4gICAgICAgIGJpbmRWYWx1ZU1hcChjb25maWcucHJvcHMsICd0aXRsZScsICh0aXRsZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGlzRW1wdHkodGl0bGUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQodGhpcy5jbGFzc05hbWVfKHVuZGVmaW5lZCwgJ25vdCcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY2xhc3NOYW1lXyh1bmRlZmluZWQsICdub3QnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25maWcudmlld1Byb3BzLmJpbmREaXNhYmxlZChidXR0b25FbGVtKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGJ1dHRvbkVsZW0pO1xuICAgICAgICB0aGlzLmJ1dHRvbkVsZW1lbnQgPSBidXR0b25FbGVtO1xuICAgICAgICBjb25zdCBpbmRlbnRFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBpbmRlbnRFbGVtLmNsYXNzTGlzdC5hZGQodGhpcy5jbGFzc05hbWVfKCdpJykpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoaW5kZW50RWxlbSk7XG4gICAgICAgIGNvbnN0IHRpdGxlRWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGl0bGVFbGVtLmNsYXNzTGlzdC5hZGQodGhpcy5jbGFzc05hbWVfKCd0JykpO1xuICAgICAgICBiaW5kVmFsdWVUb1RleHRDb250ZW50KGNvbmZpZy5wcm9wcy52YWx1ZSgndGl0bGUnKSwgdGl0bGVFbGVtKTtcbiAgICAgICAgdGhpcy5idXR0b25FbGVtZW50LmFwcGVuZENoaWxkKHRpdGxlRWxlbSk7XG4gICAgICAgIHRoaXMudGl0bGVFbGVtZW50ID0gdGl0bGVFbGVtO1xuICAgICAgICBjb25zdCBtYXJrRWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbWFya0VsZW0uY2xhc3NMaXN0LmFkZCh0aGlzLmNsYXNzTmFtZV8oJ20nKSk7XG4gICAgICAgIHRoaXMuYnV0dG9uRWxlbWVudC5hcHBlbmRDaGlsZChtYXJrRWxlbSk7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lckVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGNvbnRhaW5lckVsZW0uY2xhc3NMaXN0LmFkZCh0aGlzLmNsYXNzTmFtZV8oJ2MnKSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChjb250YWluZXJFbGVtKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJFbGVtZW50ID0gY29udGFpbmVyRWxlbTtcbiAgICB9XG59XG5cbmNsYXNzIEZvbGRlckNvbnRyb2xsZXIgZXh0ZW5kcyBDb250YWluZXJCbGFkZUNvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKGRvYywgY29uZmlnKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgY29uc3QgZm9sZGFibGUgPSBGb2xkYWJsZS5jcmVhdGUoKF9hID0gY29uZmlnLmV4cGFuZGVkKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB0cnVlKTtcbiAgICAgICAgY29uc3QgdmlldyA9IG5ldyBGb2xkZXJWaWV3KGRvYywge1xuICAgICAgICAgICAgZm9sZGFibGU6IGZvbGRhYmxlLFxuICAgICAgICAgICAgcHJvcHM6IGNvbmZpZy5wcm9wcyxcbiAgICAgICAgICAgIHZpZXdOYW1lOiBjb25maWcucm9vdCA/ICdyb3QnIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdmlld1Byb3BzOiBjb25maWcudmlld1Byb3BzLFxuICAgICAgICB9KTtcbiAgICAgICAgc3VwZXIoT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBjb25maWcpLCB7IHJhY2tDb250cm9sbGVyOiBuZXcgUmFja0NvbnRyb2xsZXIoe1xuICAgICAgICAgICAgICAgIGJsYWRlOiBjb25maWcuYmxhZGUsXG4gICAgICAgICAgICAgICAgZWxlbWVudDogdmlldy5jb250YWluZXJFbGVtZW50LFxuICAgICAgICAgICAgICAgIHJvb3Q6IGNvbmZpZy5yb290LFxuICAgICAgICAgICAgICAgIHZpZXdQcm9wczogY29uZmlnLnZpZXdQcm9wcyxcbiAgICAgICAgICAgIH0pLCB2aWV3OiB2aWV3IH0pKTtcbiAgICAgICAgdGhpcy5vblRpdGxlQ2xpY2tfID0gdGhpcy5vblRpdGxlQ2xpY2tfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMucHJvcHMgPSBjb25maWcucHJvcHM7XG4gICAgICAgIHRoaXMuZm9sZGFibGUgPSBmb2xkYWJsZTtcbiAgICAgICAgYmluZEZvbGRhYmxlKHRoaXMuZm9sZGFibGUsIHRoaXMudmlldy5jb250YWluZXJFbGVtZW50KTtcbiAgICAgICAgdGhpcy5yYWNrQ29udHJvbGxlci5yYWNrLmVtaXR0ZXIub24oJ2FkZCcsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9sZGFibGUuY2xlYW5VcFRyYW5zaXRpb24oKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmFja0NvbnRyb2xsZXIucmFjay5lbWl0dGVyLm9uKCdyZW1vdmUnLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvbGRhYmxlLmNsZWFuVXBUcmFuc2l0aW9uKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnZpZXcuYnV0dG9uRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25UaXRsZUNsaWNrXyk7XG4gICAgfVxuICAgIGdldCBkb2N1bWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmlldy5lbGVtZW50Lm93bmVyRG9jdW1lbnQ7XG4gICAgfVxuICAgIGltcG9ydFN0YXRlKHN0YXRlKSB7XG4gICAgICAgIHJldHVybiBpbXBvcnRCbGFkZVN0YXRlKHN0YXRlLCAocykgPT4gc3VwZXIuaW1wb3J0U3RhdGUocyksIChwKSA9PiAoe1xuICAgICAgICAgICAgZXhwYW5kZWQ6IHAucmVxdWlyZWQuYm9vbGVhbixcbiAgICAgICAgICAgIHRpdGxlOiBwLm9wdGlvbmFsLnN0cmluZyxcbiAgICAgICAgfSksIChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9sZGFibGUuc2V0KCdleHBhbmRlZCcsIHJlc3VsdC5leHBhbmRlZCk7XG4gICAgICAgICAgICB0aGlzLnByb3BzLnNldCgndGl0bGUnLCByZXN1bHQudGl0bGUpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBleHBvcnRTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydEJsYWRlU3RhdGUoKCkgPT4gc3VwZXIuZXhwb3J0U3RhdGUoKSwge1xuICAgICAgICAgICAgZXhwYW5kZWQ6IHRoaXMuZm9sZGFibGUuZ2V0KCdleHBhbmRlZCcpLFxuICAgICAgICAgICAgdGl0bGU6IHRoaXMucHJvcHMuZ2V0KCd0aXRsZScpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb25UaXRsZUNsaWNrXygpIHtcbiAgICAgICAgdGhpcy5mb2xkYWJsZS5zZXQoJ2V4cGFuZGVkJywgIXRoaXMuZm9sZGFibGUuZ2V0KCdleHBhbmRlZCcpKTtcbiAgICB9XG59XG5cbmNvbnN0IEZvbGRlckJsYWRlUGx1Z2luID0gY3JlYXRlUGx1Z2luKHtcbiAgICBpZDogJ2ZvbGRlcicsXG4gICAgdHlwZTogJ2JsYWRlJyxcbiAgICBhY2NlcHQocGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlUmVjb3JkKHBhcmFtcywgKHApID0+ICh7XG4gICAgICAgICAgICB0aXRsZTogcC5yZXF1aXJlZC5zdHJpbmcsXG4gICAgICAgICAgICB2aWV3OiBwLnJlcXVpcmVkLmNvbnN0YW50KCdmb2xkZXInKSxcbiAgICAgICAgICAgIGV4cGFuZGVkOiBwLm9wdGlvbmFsLmJvb2xlYW4sXG4gICAgICAgIH0pKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCA/IHsgcGFyYW1zOiByZXN1bHQgfSA6IG51bGw7XG4gICAgfSxcbiAgICBjb250cm9sbGVyKGFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGb2xkZXJDb250cm9sbGVyKGFyZ3MuZG9jdW1lbnQsIHtcbiAgICAgICAgICAgIGJsYWRlOiBhcmdzLmJsYWRlLFxuICAgICAgICAgICAgZXhwYW5kZWQ6IGFyZ3MucGFyYW1zLmV4cGFuZGVkLFxuICAgICAgICAgICAgcHJvcHM6IFZhbHVlTWFwLmZyb21PYmplY3Qoe1xuICAgICAgICAgICAgICAgIHRpdGxlOiBhcmdzLnBhcmFtcy50aXRsZSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgdmlld1Byb3BzOiBhcmdzLnZpZXdQcm9wcyxcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBhcGkoYXJncykge1xuICAgICAgICBpZiAoIShhcmdzLmNvbnRyb2xsZXIgaW5zdGFuY2VvZiBGb2xkZXJDb250cm9sbGVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBGb2xkZXJBcGkoYXJncy5jb250cm9sbGVyLCBhcmdzLnBvb2wpO1xuICAgIH0sXG59KTtcblxuY29uc3QgY24kbyA9IENsYXNzTmFtZSgnJyk7XG5mdW5jdGlvbiB2YWx1ZVRvTW9kaWZpZXIoZWxlbSwgbW9kaWZpZXIpIHtcbiAgICByZXR1cm4gdmFsdWVUb0NsYXNzTmFtZShlbGVtLCBjbiRvKHVuZGVmaW5lZCwgbW9kaWZpZXIpKTtcbn1cbmNsYXNzIFZpZXdQcm9wcyBleHRlbmRzIFZhbHVlTWFwIHtcbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZU1hcCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHN1cGVyKHZhbHVlTWFwKTtcbiAgICAgICAgdGhpcy5vbkRpc2FibGVkQ2hhbmdlXyA9IHRoaXMub25EaXNhYmxlZENoYW5nZV8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vblBhcmVudENoYW5nZV8gPSB0aGlzLm9uUGFyZW50Q2hhbmdlXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uUGFyZW50R2xvYmFsRGlzYWJsZWRDaGFuZ2VfID1cbiAgICAgICAgICAgIHRoaXMub25QYXJlbnRHbG9iYWxEaXNhYmxlZENoYW5nZV8uYmluZCh0aGlzKTtcbiAgICAgICAgW3RoaXMuZ2xvYmFsRGlzYWJsZWRfLCB0aGlzLnNldEdsb2JhbERpc2FibGVkX10gPSBjcmVhdGVSZWFkb25seVZhbHVlKGNyZWF0ZVZhbHVlKHRoaXMuZ2V0R2xvYmFsRGlzYWJsZWRfKCkpKTtcbiAgICAgICAgdGhpcy52YWx1ZSgnZGlzYWJsZWQnKS5lbWl0dGVyLm9uKCdjaGFuZ2UnLCB0aGlzLm9uRGlzYWJsZWRDaGFuZ2VfKTtcbiAgICAgICAgdGhpcy52YWx1ZSgncGFyZW50JykuZW1pdHRlci5vbignY2hhbmdlJywgdGhpcy5vblBhcmVudENoYW5nZV8pO1xuICAgICAgICAoX2EgPSB0aGlzLmdldCgncGFyZW50JykpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nbG9iYWxEaXNhYmxlZC5lbWl0dGVyLm9uKCdjaGFuZ2UnLCB0aGlzLm9uUGFyZW50R2xvYmFsRGlzYWJsZWRDaGFuZ2VfKTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZShvcHRfaW5pdGlhbFZhbHVlKSB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jO1xuICAgICAgICBjb25zdCBpbml0aWFsVmFsdWUgPSBvcHRfaW5pdGlhbFZhbHVlICE9PSBudWxsICYmIG9wdF9pbml0aWFsVmFsdWUgIT09IHZvaWQgMCA/IG9wdF9pbml0aWFsVmFsdWUgOiB7fTtcbiAgICAgICAgcmV0dXJuIG5ldyBWaWV3UHJvcHMoVmFsdWVNYXAuY3JlYXRlQ29yZSh7XG4gICAgICAgICAgICBkaXNhYmxlZDogKF9hID0gaW5pdGlhbFZhbHVlLmRpc2FibGVkKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBmYWxzZSxcbiAgICAgICAgICAgIGRpc3Bvc2VkOiBmYWxzZSxcbiAgICAgICAgICAgIGhpZGRlbjogKF9iID0gaW5pdGlhbFZhbHVlLmhpZGRlbikgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogZmFsc2UsXG4gICAgICAgICAgICBwYXJlbnQ6IChfYyA9IGluaXRpYWxWYWx1ZS5wYXJlbnQpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IG51bGwsXG4gICAgICAgIH0pKTtcbiAgICB9XG4gICAgZ2V0IGdsb2JhbERpc2FibGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nbG9iYWxEaXNhYmxlZF87XG4gICAgfVxuICAgIGJpbmRDbGFzc01vZGlmaWVycyhlbGVtKSB7XG4gICAgICAgIGJpbmRWYWx1ZSh0aGlzLmdsb2JhbERpc2FibGVkXywgdmFsdWVUb01vZGlmaWVyKGVsZW0sICdkaXNhYmxlZCcpKTtcbiAgICAgICAgYmluZFZhbHVlTWFwKHRoaXMsICdoaWRkZW4nLCB2YWx1ZVRvTW9kaWZpZXIoZWxlbSwgJ2hpZGRlbicpKTtcbiAgICB9XG4gICAgYmluZERpc2FibGVkKHRhcmdldCkge1xuICAgICAgICBiaW5kVmFsdWUodGhpcy5nbG9iYWxEaXNhYmxlZF8sIChkaXNhYmxlZCkgPT4ge1xuICAgICAgICAgICAgdGFyZ2V0LmRpc2FibGVkID0gZGlzYWJsZWQ7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBiaW5kVGFiSW5kZXgoZWxlbSkge1xuICAgICAgICBiaW5kVmFsdWUodGhpcy5nbG9iYWxEaXNhYmxlZF8sIChkaXNhYmxlZCkgPT4ge1xuICAgICAgICAgICAgZWxlbS50YWJJbmRleCA9IGRpc2FibGVkID8gLTEgOiAwO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaGFuZGxlRGlzcG9zZShjYWxsYmFjaykge1xuICAgICAgICB0aGlzLnZhbHVlKCdkaXNwb3NlZCcpLmVtaXR0ZXIub24oJ2NoYW5nZScsIChkaXNwb3NlZCkgPT4ge1xuICAgICAgICAgICAgaWYgKGRpc3Bvc2VkKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGltcG9ydFN0YXRlKHN0YXRlKSB7XG4gICAgICAgIHRoaXMuc2V0KCdkaXNhYmxlZCcsIHN0YXRlLmRpc2FibGVkKTtcbiAgICAgICAgdGhpcy5zZXQoJ2hpZGRlbicsIHN0YXRlLmhpZGRlbik7XG4gICAgfVxuICAgIGV4cG9ydFN0YXRlKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGlzYWJsZWQ6IHRoaXMuZ2V0KCdkaXNhYmxlZCcpLFxuICAgICAgICAgICAgaGlkZGVuOiB0aGlzLmdldCgnaGlkZGVuJyksXG4gICAgICAgIH07XG4gICAgfVxuICAgIGdldEdsb2JhbERpc2FibGVkXygpIHtcbiAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5nZXQoJ3BhcmVudCcpO1xuICAgICAgICBjb25zdCBwYXJlbnREaXNhYmxlZCA9IHBhcmVudCA/IHBhcmVudC5nbG9iYWxEaXNhYmxlZC5yYXdWYWx1ZSA6IGZhbHNlO1xuICAgICAgICByZXR1cm4gcGFyZW50RGlzYWJsZWQgfHwgdGhpcy5nZXQoJ2Rpc2FibGVkJyk7XG4gICAgfVxuICAgIHVwZGF0ZUdsb2JhbERpc2FibGVkXygpIHtcbiAgICAgICAgdGhpcy5zZXRHbG9iYWxEaXNhYmxlZF8odGhpcy5nZXRHbG9iYWxEaXNhYmxlZF8oKSk7XG4gICAgfVxuICAgIG9uRGlzYWJsZWRDaGFuZ2VfKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUdsb2JhbERpc2FibGVkXygpO1xuICAgIH1cbiAgICBvblBhcmVudEdsb2JhbERpc2FibGVkQ2hhbmdlXygpIHtcbiAgICAgICAgdGhpcy51cGRhdGVHbG9iYWxEaXNhYmxlZF8oKTtcbiAgICB9XG4gICAgb25QYXJlbnRDaGFuZ2VfKGV2KSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgY29uc3QgcHJldlBhcmVudCA9IGV2LnByZXZpb3VzUmF3VmFsdWU7XG4gICAgICAgIHByZXZQYXJlbnQgPT09IG51bGwgfHwgcHJldlBhcmVudCA9PT0gdm9pZCAwID8gdm9pZCAwIDogcHJldlBhcmVudC5nbG9iYWxEaXNhYmxlZC5lbWl0dGVyLm9mZignY2hhbmdlJywgdGhpcy5vblBhcmVudEdsb2JhbERpc2FibGVkQ2hhbmdlXyk7XG4gICAgICAgIChfYSA9IHRoaXMuZ2V0KCdwYXJlbnQnKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdsb2JhbERpc2FibGVkLmVtaXR0ZXIub24oJ2NoYW5nZScsIHRoaXMub25QYXJlbnRHbG9iYWxEaXNhYmxlZENoYW5nZV8pO1xuICAgICAgICB0aGlzLnVwZGF0ZUdsb2JhbERpc2FibGVkXygpO1xuICAgIH1cbn1cblxuY29uc3QgY24kbiA9IENsYXNzTmFtZSgndGJwJyk7XG5jbGFzcyBUYWJQYWdlVmlldyB7XG4gICAgY29uc3RydWN0b3IoZG9jLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbiRuKCkpO1xuICAgICAgICBjb25maWcudmlld1Byb3BzLmJpbmRDbGFzc01vZGlmaWVycyh0aGlzLmVsZW1lbnQpO1xuICAgICAgICBjb25zdCBjb250YWluZXJFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjb250YWluZXJFbGVtLmNsYXNzTGlzdC5hZGQoY24kbignYycpKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGNvbnRhaW5lckVsZW0pO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckVsZW1lbnQgPSBjb250YWluZXJFbGVtO1xuICAgIH1cbn1cblxuY29uc3QgY24kbSA9IENsYXNzTmFtZSgndGJpJyk7XG5jbGFzcyBUYWJJdGVtVmlldyB7XG4gICAgY29uc3RydWN0b3IoZG9jLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbiRtKCkpO1xuICAgICAgICBjb25maWcudmlld1Byb3BzLmJpbmRDbGFzc01vZGlmaWVycyh0aGlzLmVsZW1lbnQpO1xuICAgICAgICBiaW5kVmFsdWVNYXAoY29uZmlnLnByb3BzLCAnc2VsZWN0ZWQnLCAoc2VsZWN0ZWQpID0+IHtcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNuJG0odW5kZWZpbmVkLCAnc2VsJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoY24kbSh1bmRlZmluZWQsICdzZWwnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBidXR0b25FbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBidXR0b25FbGVtLmNsYXNzTGlzdC5hZGQoY24kbSgnYicpKTtcbiAgICAgICAgY29uZmlnLnZpZXdQcm9wcy5iaW5kRGlzYWJsZWQoYnV0dG9uRWxlbSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChidXR0b25FbGVtKTtcbiAgICAgICAgdGhpcy5idXR0b25FbGVtZW50ID0gYnV0dG9uRWxlbTtcbiAgICAgICAgY29uc3QgdGl0bGVFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aXRsZUVsZW0uY2xhc3NMaXN0LmFkZChjbiRtKCd0JykpO1xuICAgICAgICBiaW5kVmFsdWVUb1RleHRDb250ZW50KGNvbmZpZy5wcm9wcy52YWx1ZSgndGl0bGUnKSwgdGl0bGVFbGVtKTtcbiAgICAgICAgdGhpcy5idXR0b25FbGVtZW50LmFwcGVuZENoaWxkKHRpdGxlRWxlbSk7XG4gICAgICAgIHRoaXMudGl0bGVFbGVtZW50ID0gdGl0bGVFbGVtO1xuICAgIH1cbn1cblxuY2xhc3MgVGFiSXRlbUNvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKGRvYywgY29uZmlnKSB7XG4gICAgICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMub25DbGlja18gPSB0aGlzLm9uQ2xpY2tfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMucHJvcHMgPSBjb25maWcucHJvcHM7XG4gICAgICAgIHRoaXMudmlld1Byb3BzID0gY29uZmlnLnZpZXdQcm9wcztcbiAgICAgICAgdGhpcy52aWV3ID0gbmV3IFRhYkl0ZW1WaWV3KGRvYywge1xuICAgICAgICAgICAgcHJvcHM6IGNvbmZpZy5wcm9wcyxcbiAgICAgICAgICAgIHZpZXdQcm9wczogY29uZmlnLnZpZXdQcm9wcyxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudmlldy5idXR0b25FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkNsaWNrXyk7XG4gICAgfVxuICAgIG9uQ2xpY2tfKCkge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnY2xpY2snLCB7XG4gICAgICAgICAgICBzZW5kZXI6IHRoaXMsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuY2xhc3MgVGFiUGFnZUNvbnRyb2xsZXIgZXh0ZW5kcyBDb250YWluZXJCbGFkZUNvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKGRvYywgY29uZmlnKSB7XG4gICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgVGFiUGFnZVZpZXcoZG9jLCB7XG4gICAgICAgICAgICB2aWV3UHJvcHM6IGNvbmZpZy52aWV3UHJvcHMsXG4gICAgICAgIH0pO1xuICAgICAgICBzdXBlcihPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGNvbmZpZyksIHsgcmFja0NvbnRyb2xsZXI6IG5ldyBSYWNrQ29udHJvbGxlcih7XG4gICAgICAgICAgICAgICAgYmxhZGU6IGNvbmZpZy5ibGFkZSxcbiAgICAgICAgICAgICAgICBlbGVtZW50OiB2aWV3LmNvbnRhaW5lckVsZW1lbnQsXG4gICAgICAgICAgICAgICAgdmlld1Byb3BzOiBjb25maWcudmlld1Byb3BzLFxuICAgICAgICAgICAgfSksIHZpZXc6IHZpZXcgfSkpO1xuICAgICAgICB0aGlzLm9uSXRlbUNsaWNrXyA9IHRoaXMub25JdGVtQ2xpY2tfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaWNfID0gbmV3IFRhYkl0ZW1Db250cm9sbGVyKGRvYywge1xuICAgICAgICAgICAgcHJvcHM6IGNvbmZpZy5pdGVtUHJvcHMsXG4gICAgICAgICAgICB2aWV3UHJvcHM6IFZpZXdQcm9wcy5jcmVhdGUoKSxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaWNfLmVtaXR0ZXIub24oJ2NsaWNrJywgdGhpcy5vbkl0ZW1DbGlja18pO1xuICAgICAgICB0aGlzLnByb3BzID0gY29uZmlnLnByb3BzO1xuICAgICAgICBiaW5kVmFsdWVNYXAodGhpcy5wcm9wcywgJ3NlbGVjdGVkJywgKHNlbGVjdGVkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLml0ZW1Db250cm9sbGVyLnByb3BzLnNldCgnc2VsZWN0ZWQnLCBzZWxlY3RlZCk7XG4gICAgICAgICAgICB0aGlzLnZpZXdQcm9wcy5zZXQoJ2hpZGRlbicsICFzZWxlY3RlZCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnZXQgaXRlbUNvbnRyb2xsZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmljXztcbiAgICB9XG4gICAgaW1wb3J0U3RhdGUoc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIGltcG9ydEJsYWRlU3RhdGUoc3RhdGUsIChzKSA9PiBzdXBlci5pbXBvcnRTdGF0ZShzKSwgKHApID0+ICh7XG4gICAgICAgICAgICBzZWxlY3RlZDogcC5yZXF1aXJlZC5ib29sZWFuLFxuICAgICAgICAgICAgdGl0bGU6IHAucmVxdWlyZWQuc3RyaW5nLFxuICAgICAgICB9KSwgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pY18ucHJvcHMuc2V0KCdzZWxlY3RlZCcsIHJlc3VsdC5zZWxlY3RlZCk7XG4gICAgICAgICAgICB0aGlzLmljXy5wcm9wcy5zZXQoJ3RpdGxlJywgcmVzdWx0LnRpdGxlKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZXhwb3J0U3RhdGUoKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRCbGFkZVN0YXRlKCgpID0+IHN1cGVyLmV4cG9ydFN0YXRlKCksIHtcbiAgICAgICAgICAgIHNlbGVjdGVkOiB0aGlzLmljXy5wcm9wcy5nZXQoJ3NlbGVjdGVkJyksXG4gICAgICAgICAgICB0aXRsZTogdGhpcy5pY18ucHJvcHMuZ2V0KCd0aXRsZScpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb25JdGVtQ2xpY2tfKCkge1xuICAgICAgICB0aGlzLnByb3BzLnNldCgnc2VsZWN0ZWQnLCB0cnVlKTtcbiAgICB9XG59XG5cbmNsYXNzIFRhYkFwaSBleHRlbmRzIENvbnRhaW5lckJsYWRlQXBpIHtcbiAgICBjb25zdHJ1Y3Rvcihjb250cm9sbGVyLCBwb29sKSB7XG4gICAgICAgIHN1cGVyKGNvbnRyb2xsZXIsIHBvb2wpO1xuICAgICAgICB0aGlzLmVtaXR0ZXJfID0gbmV3IEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5vblNlbGVjdF8gPSB0aGlzLm9uU2VsZWN0Xy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnBvb2xfID0gcG9vbDtcbiAgICAgICAgdGhpcy5yYWNrQXBpXy5vbignY2hhbmdlJywgKGV2KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVtaXR0ZXJfLmVtaXQoJ2NoYW5nZScsIGV2KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci50YWIuc2VsZWN0ZWRJbmRleC5lbWl0dGVyLm9uKCdjaGFuZ2UnLCB0aGlzLm9uU2VsZWN0Xyk7XG4gICAgfVxuICAgIGdldCBwYWdlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmFja0FwaV8uY2hpbGRyZW47XG4gICAgfVxuICAgIGFkZFBhZ2UocGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IGRvYyA9IHRoaXMuY29udHJvbGxlci52aWV3LmVsZW1lbnQub3duZXJEb2N1bWVudDtcbiAgICAgICAgY29uc3QgcGMgPSBuZXcgVGFiUGFnZUNvbnRyb2xsZXIoZG9jLCB7XG4gICAgICAgICAgICBibGFkZTogY3JlYXRlQmxhZGUoKSxcbiAgICAgICAgICAgIGl0ZW1Qcm9wczogVmFsdWVNYXAuZnJvbU9iamVjdCh7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBwYXJhbXMudGl0bGUsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHByb3BzOiBWYWx1ZU1hcC5mcm9tT2JqZWN0KHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHZpZXdQcm9wczogVmlld1Byb3BzLmNyZWF0ZSgpLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgcGFwaSA9IHRoaXMucG9vbF8uY3JlYXRlQXBpKHBjKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmFja0FwaV8uYWRkKHBhcGksIHBhcmFtcy5pbmRleCk7XG4gICAgfVxuICAgIHJlbW92ZVBhZ2UoaW5kZXgpIHtcbiAgICAgICAgdGhpcy5yYWNrQXBpXy5yZW1vdmUodGhpcy5yYWNrQXBpXy5jaGlsZHJlbltpbmRleF0pO1xuICAgIH1cbiAgICBvbihldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgICAgY29uc3QgYmggPSBoYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZW1pdHRlcl8ub24oZXZlbnROYW1lLCAoZXYpID0+IHtcbiAgICAgICAgICAgIGJoKGV2KTtcbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiBoYW5kbGVyLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIG9mZihldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyXy5vZmYoZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIG9uU2VsZWN0Xyhldikge1xuICAgICAgICB0aGlzLmVtaXR0ZXJfLmVtaXQoJ3NlbGVjdCcsIG5ldyBUcFRhYlNlbGVjdEV2ZW50KHRoaXMsIGV2LnJhd1ZhbHVlKSk7XG4gICAgfVxufVxuXG5jbGFzcyBUYWJQYWdlQXBpIGV4dGVuZHMgQ29udGFpbmVyQmxhZGVBcGkge1xuICAgIGdldCB0aXRsZSgpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gKF9hID0gdGhpcy5jb250cm9sbGVyLml0ZW1Db250cm9sbGVyLnByb3BzLmdldCgndGl0bGUnKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogJyc7XG4gICAgfVxuICAgIHNldCB0aXRsZSh0aXRsZSkge1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuaXRlbUNvbnRyb2xsZXIucHJvcHMuc2V0KCd0aXRsZScsIHRpdGxlKTtcbiAgICB9XG4gICAgZ2V0IHNlbGVjdGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyLnByb3BzLmdldCgnc2VsZWN0ZWQnKTtcbiAgICB9XG4gICAgc2V0IHNlbGVjdGVkKHNlbGVjdGVkKSB7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci5wcm9wcy5zZXQoJ3NlbGVjdGVkJywgc2VsZWN0ZWQpO1xuICAgIH1cbiAgICBnZXQgY2hpbGRyZW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJhY2tBcGlfLmNoaWxkcmVuO1xuICAgIH1cbiAgICBhZGRCdXR0b24ocGFyYW1zKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJhY2tBcGlfLmFkZEJ1dHRvbihwYXJhbXMpO1xuICAgIH1cbiAgICBhZGRGb2xkZXIocGFyYW1zKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJhY2tBcGlfLmFkZEZvbGRlcihwYXJhbXMpO1xuICAgIH1cbiAgICBhZGRUYWIocGFyYW1zKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJhY2tBcGlfLmFkZFRhYihwYXJhbXMpO1xuICAgIH1cbiAgICBhZGQoYXBpLCBvcHRfaW5kZXgpIHtcbiAgICAgICAgdGhpcy5yYWNrQXBpXy5hZGQoYXBpLCBvcHRfaW5kZXgpO1xuICAgIH1cbiAgICByZW1vdmUoYXBpKSB7XG4gICAgICAgIHRoaXMucmFja0FwaV8ucmVtb3ZlKGFwaSk7XG4gICAgfVxuICAgIGFkZEJpbmRpbmcob2JqZWN0LCBrZXksIG9wdF9wYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmFja0FwaV8uYWRkQmluZGluZyhvYmplY3QsIGtleSwgb3B0X3BhcmFtcyk7XG4gICAgfVxuICAgIGFkZEJsYWRlKHBhcmFtcykge1xuICAgICAgICByZXR1cm4gdGhpcy5yYWNrQXBpXy5hZGRCbGFkZShwYXJhbXMpO1xuICAgIH1cbn1cblxuY29uc3QgSU5ERVhfTk9UX1NFTEVDVEVEID0gLTE7XG5jbGFzcyBUYWIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLm9uSXRlbVNlbGVjdGVkQ2hhbmdlXyA9IHRoaXMub25JdGVtU2VsZWN0ZWRDaGFuZ2VfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZW1wdHkgPSBjcmVhdGVWYWx1ZSh0cnVlKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gY3JlYXRlVmFsdWUoSU5ERVhfTk9UX1NFTEVDVEVEKTtcbiAgICAgICAgdGhpcy5pdGVtc18gPSBbXTtcbiAgICB9XG4gICAgYWRkKGl0ZW0sIG9wdF9pbmRleCkge1xuICAgICAgICBjb25zdCBpbmRleCA9IG9wdF9pbmRleCAhPT0gbnVsbCAmJiBvcHRfaW5kZXggIT09IHZvaWQgMCA/IG9wdF9pbmRleCA6IHRoaXMuaXRlbXNfLmxlbmd0aDtcbiAgICAgICAgdGhpcy5pdGVtc18uc3BsaWNlKGluZGV4LCAwLCBpdGVtKTtcbiAgICAgICAgaXRlbS5lbWl0dGVyLm9uKCdjaGFuZ2UnLCB0aGlzLm9uSXRlbVNlbGVjdGVkQ2hhbmdlXyk7XG4gICAgICAgIHRoaXMua2VlcFNlbGVjdGlvbl8oKTtcbiAgICB9XG4gICAgcmVtb3ZlKGl0ZW0pIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLml0ZW1zXy5pbmRleE9mKGl0ZW0pO1xuICAgICAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pdGVtc18uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgaXRlbS5lbWl0dGVyLm9mZignY2hhbmdlJywgdGhpcy5vbkl0ZW1TZWxlY3RlZENoYW5nZV8pO1xuICAgICAgICB0aGlzLmtlZXBTZWxlY3Rpb25fKCk7XG4gICAgfVxuICAgIGtlZXBTZWxlY3Rpb25fKCkge1xuICAgICAgICBpZiAodGhpcy5pdGVtc18ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXgucmF3VmFsdWUgPSBJTkRFWF9OT1RfU0VMRUNURUQ7XG4gICAgICAgICAgICB0aGlzLmVtcHR5LnJhd1ZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmaXJzdFNlbEluZGV4ID0gdGhpcy5pdGVtc18uZmluZEluZGV4KChzKSA9PiBzLnJhd1ZhbHVlKTtcbiAgICAgICAgaWYgKGZpcnN0U2VsSW5kZXggPCAwKSB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zXy5mb3JFYWNoKChzLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgcy5yYXdWYWx1ZSA9IGkgPT09IDA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleC5yYXdWYWx1ZSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zXy5mb3JFYWNoKChzLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgcy5yYXdWYWx1ZSA9IGkgPT09IGZpcnN0U2VsSW5kZXg7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleC5yYXdWYWx1ZSA9IGZpcnN0U2VsSW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbXB0eS5yYXdWYWx1ZSA9IGZhbHNlO1xuICAgIH1cbiAgICBvbkl0ZW1TZWxlY3RlZENoYW5nZV8oZXYpIHtcbiAgICAgICAgaWYgKGV2LnJhd1ZhbHVlKSB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuaXRlbXNfLmZpbmRJbmRleCgocykgPT4gcyA9PT0gZXYuc2VuZGVyKTtcbiAgICAgICAgICAgIHRoaXMuaXRlbXNfLmZvckVhY2goKHMsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBzLnJhd1ZhbHVlID0gaSA9PT0gaW5kZXg7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleC5yYXdWYWx1ZSA9IGluZGV4O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5rZWVwU2VsZWN0aW9uXygpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCBjbiRsID0gQ2xhc3NOYW1lKCd0YWInKTtcbmNsYXNzIFRhYlZpZXcge1xuICAgIGNvbnN0cnVjdG9yKGRvYywgY29uZmlnKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoY24kbCgpLCBibGFkZUNvbnRhaW5lckNsYXNzTmFtZSgpKTtcbiAgICAgICAgY29uZmlnLnZpZXdQcm9wcy5iaW5kQ2xhc3NNb2RpZmllcnModGhpcy5lbGVtZW50KTtcbiAgICAgICAgYmluZFZhbHVlKGNvbmZpZy5lbXB0eSwgdmFsdWVUb0NsYXNzTmFtZSh0aGlzLmVsZW1lbnQsIGNuJGwodW5kZWZpbmVkLCAnbm9wJykpKTtcbiAgICAgICAgY29uc3QgdGl0bGVFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aXRsZUVsZW0uY2xhc3NMaXN0LmFkZChjbiRsKCd0JykpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGl0bGVFbGVtKTtcbiAgICAgICAgdGhpcy5pdGVtc0VsZW1lbnQgPSB0aXRsZUVsZW07XG4gICAgICAgIGNvbnN0IGluZGVudEVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGluZGVudEVsZW0uY2xhc3NMaXN0LmFkZChjbiRsKCdpJykpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoaW5kZW50RWxlbSk7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRzRWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY29udGVudHNFbGVtLmNsYXNzTGlzdC5hZGQoY24kbCgnYycpKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGNvbnRlbnRzRWxlbSk7XG4gICAgICAgIHRoaXMuY29udGVudHNFbGVtZW50ID0gY29udGVudHNFbGVtO1xuICAgIH1cbn1cblxuY2xhc3MgVGFiQ29udHJvbGxlciBleHRlbmRzIENvbnRhaW5lckJsYWRlQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoZG9jLCBjb25maWcpIHtcbiAgICAgICAgY29uc3QgdGFiID0gbmV3IFRhYigpO1xuICAgICAgICBjb25zdCB2aWV3ID0gbmV3IFRhYlZpZXcoZG9jLCB7XG4gICAgICAgICAgICBlbXB0eTogdGFiLmVtcHR5LFxuICAgICAgICAgICAgdmlld1Byb3BzOiBjb25maWcudmlld1Byb3BzLFxuICAgICAgICB9KTtcbiAgICAgICAgc3VwZXIoe1xuICAgICAgICAgICAgYmxhZGU6IGNvbmZpZy5ibGFkZSxcbiAgICAgICAgICAgIHJhY2tDb250cm9sbGVyOiBuZXcgUmFja0NvbnRyb2xsZXIoe1xuICAgICAgICAgICAgICAgIGJsYWRlOiBjb25maWcuYmxhZGUsXG4gICAgICAgICAgICAgICAgZWxlbWVudDogdmlldy5jb250ZW50c0VsZW1lbnQsXG4gICAgICAgICAgICAgICAgdmlld1Byb3BzOiBjb25maWcudmlld1Byb3BzLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB2aWV3OiB2aWV3LFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vblJhY2tBZGRfID0gdGhpcy5vblJhY2tBZGRfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25SYWNrUmVtb3ZlXyA9IHRoaXMub25SYWNrUmVtb3ZlXy5iaW5kKHRoaXMpO1xuICAgICAgICBjb25zdCByYWNrID0gdGhpcy5yYWNrQ29udHJvbGxlci5yYWNrO1xuICAgICAgICByYWNrLmVtaXR0ZXIub24oJ2FkZCcsIHRoaXMub25SYWNrQWRkXyk7XG4gICAgICAgIHJhY2suZW1pdHRlci5vbigncmVtb3ZlJywgdGhpcy5vblJhY2tSZW1vdmVfKTtcbiAgICAgICAgdGhpcy50YWIgPSB0YWI7XG4gICAgfVxuICAgIGFkZChwYywgb3B0X2luZGV4KSB7XG4gICAgICAgIHRoaXMucmFja0NvbnRyb2xsZXIucmFjay5hZGQocGMsIG9wdF9pbmRleCk7XG4gICAgfVxuICAgIHJlbW92ZShpbmRleCkge1xuICAgICAgICB0aGlzLnJhY2tDb250cm9sbGVyLnJhY2sucmVtb3ZlKHRoaXMucmFja0NvbnRyb2xsZXIucmFjay5jaGlsZHJlbltpbmRleF0pO1xuICAgIH1cbiAgICBvblJhY2tBZGRfKGV2KSB7XG4gICAgICAgIGlmICghZXYucm9vdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBjID0gZXYuYmxhZGVDb250cm9sbGVyO1xuICAgICAgICBpbnNlcnRFbGVtZW50QXQodGhpcy52aWV3Lml0ZW1zRWxlbWVudCwgcGMuaXRlbUNvbnRyb2xsZXIudmlldy5lbGVtZW50LCBldi5pbmRleCk7XG4gICAgICAgIHBjLml0ZW1Db250cm9sbGVyLnZpZXdQcm9wcy5zZXQoJ3BhcmVudCcsIHRoaXMudmlld1Byb3BzKTtcbiAgICAgICAgdGhpcy50YWIuYWRkKHBjLnByb3BzLnZhbHVlKCdzZWxlY3RlZCcpKTtcbiAgICB9XG4gICAgb25SYWNrUmVtb3ZlXyhldikge1xuICAgICAgICBpZiAoIWV2LnJvb3QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwYyA9IGV2LmJsYWRlQ29udHJvbGxlcjtcbiAgICAgICAgcmVtb3ZlRWxlbWVudChwYy5pdGVtQ29udHJvbGxlci52aWV3LmVsZW1lbnQpO1xuICAgICAgICBwYy5pdGVtQ29udHJvbGxlci52aWV3UHJvcHMuc2V0KCdwYXJlbnQnLCBudWxsKTtcbiAgICAgICAgdGhpcy50YWIucmVtb3ZlKHBjLnByb3BzLnZhbHVlKCdzZWxlY3RlZCcpKTtcbiAgICB9XG59XG5cbmNvbnN0IFRhYkJsYWRlUGx1Z2luID0gY3JlYXRlUGx1Z2luKHtcbiAgICBpZDogJ3RhYicsXG4gICAgdHlwZTogJ2JsYWRlJyxcbiAgICBhY2NlcHQocGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlUmVjb3JkKHBhcmFtcywgKHApID0+ICh7XG4gICAgICAgICAgICBwYWdlczogcC5yZXF1aXJlZC5hcnJheShwLnJlcXVpcmVkLm9iamVjdCh7IHRpdGxlOiBwLnJlcXVpcmVkLnN0cmluZyB9KSksXG4gICAgICAgICAgICB2aWV3OiBwLnJlcXVpcmVkLmNvbnN0YW50KCd0YWInKSxcbiAgICAgICAgfSkpO1xuICAgICAgICBpZiAoIXJlc3VsdCB8fCByZXN1bHQucGFnZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBwYXJhbXM6IHJlc3VsdCB9O1xuICAgIH0sXG4gICAgY29udHJvbGxlcihhcmdzKSB7XG4gICAgICAgIGNvbnN0IGMgPSBuZXcgVGFiQ29udHJvbGxlcihhcmdzLmRvY3VtZW50LCB7XG4gICAgICAgICAgICBibGFkZTogYXJncy5ibGFkZSxcbiAgICAgICAgICAgIHZpZXdQcm9wczogYXJncy52aWV3UHJvcHMsXG4gICAgICAgIH0pO1xuICAgICAgICBhcmdzLnBhcmFtcy5wYWdlcy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwYyA9IG5ldyBUYWJQYWdlQ29udHJvbGxlcihhcmdzLmRvY3VtZW50LCB7XG4gICAgICAgICAgICAgICAgYmxhZGU6IGNyZWF0ZUJsYWRlKCksXG4gICAgICAgICAgICAgICAgaXRlbVByb3BzOiBWYWx1ZU1hcC5mcm9tT2JqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogcC50aXRsZSxcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBwcm9wczogVmFsdWVNYXAuZnJvbU9iamVjdCh7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICB2aWV3UHJvcHM6IFZpZXdQcm9wcy5jcmVhdGUoKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYy5hZGQocGMpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfSxcbiAgICBhcGkoYXJncykge1xuICAgICAgICBpZiAoYXJncy5jb250cm9sbGVyIGluc3RhbmNlb2YgVGFiQ29udHJvbGxlcikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBUYWJBcGkoYXJncy5jb250cm9sbGVyLCBhcmdzLnBvb2wpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmdzLmNvbnRyb2xsZXIgaW5zdGFuY2VvZiBUYWJQYWdlQ29udHJvbGxlcikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBUYWJQYWdlQXBpKGFyZ3MuY29udHJvbGxlciwgYXJncy5wb29sKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxufSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUJsYWRlQ29udHJvbGxlcihwbHVnaW4sIGFyZ3MpIHtcbiAgICBjb25zdCBhYyA9IHBsdWdpbi5hY2NlcHQoYXJncy5wYXJhbXMpO1xuICAgIGlmICghYWMpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHBhcmFtcyA9IHBhcnNlUmVjb3JkKGFyZ3MucGFyYW1zLCAocCkgPT4gKHtcbiAgICAgICAgZGlzYWJsZWQ6IHAub3B0aW9uYWwuYm9vbGVhbixcbiAgICAgICAgaGlkZGVuOiBwLm9wdGlvbmFsLmJvb2xlYW4sXG4gICAgfSkpO1xuICAgIHJldHVybiBwbHVnaW4uY29udHJvbGxlcih7XG4gICAgICAgIGJsYWRlOiBjcmVhdGVCbGFkZSgpLFxuICAgICAgICBkb2N1bWVudDogYXJncy5kb2N1bWVudCxcbiAgICAgICAgcGFyYW1zOiBmb3JjZUNhc3QoT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBhYy5wYXJhbXMpLCB7IGRpc2FibGVkOiBwYXJhbXMgPT09IG51bGwgfHwgcGFyYW1zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwYXJhbXMuZGlzYWJsZWQsIGhpZGRlbjogcGFyYW1zID09PSBudWxsIHx8IHBhcmFtcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcGFyYW1zLmhpZGRlbiB9KSksXG4gICAgICAgIHZpZXdQcm9wczogVmlld1Byb3BzLmNyZWF0ZSh7XG4gICAgICAgICAgICBkaXNhYmxlZDogcGFyYW1zID09PSBudWxsIHx8IHBhcmFtcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcGFyYW1zLmRpc2FibGVkLFxuICAgICAgICAgICAgaGlkZGVuOiBwYXJhbXMgPT09IG51bGwgfHwgcGFyYW1zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwYXJhbXMuaGlkZGVuLFxuICAgICAgICB9KSxcbiAgICB9KTtcbn1cblxuY2xhc3MgTGlzdElucHV0QmluZGluZ0FwaSBleHRlbmRzIEJpbmRpbmdBcGkge1xuICAgIGdldCBvcHRpb25zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyLnZhbHVlQ29udHJvbGxlci5wcm9wcy5nZXQoJ29wdGlvbnMnKTtcbiAgICB9XG4gICAgc2V0IG9wdGlvbnMob3B0aW9ucykge1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIudmFsdWVDb250cm9sbGVyLnByb3BzLnNldCgnb3B0aW9ucycsIG9wdGlvbnMpO1xuICAgIH1cbn1cblxuY2xhc3MgTWFudWFsVGlja2VyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICAgIH1cbiAgICBkaXNwb3NlKCkgeyB9XG4gICAgdGljaygpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgndGljaycsIHtcbiAgICAgICAgICAgIHNlbmRlcjogdGhpcyxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5jbGFzcyBJbnRlcnZhbFRpY2tlciB7XG4gICAgY29uc3RydWN0b3IoZG9jLCBpbnRlcnZhbCkge1xuICAgICAgICB0aGlzLmRpc2FibGVkXyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnRpbWVySWRfID0gbnVsbDtcbiAgICAgICAgdGhpcy5vblRpY2tfID0gdGhpcy5vblRpY2tfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZG9jXyA9IGRvYztcbiAgICAgICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5pbnRlcnZhbF8gPSBpbnRlcnZhbDtcbiAgICAgICAgdGhpcy5zZXRUaW1lcl8oKTtcbiAgICB9XG4gICAgZ2V0IGRpc2FibGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZF87XG4gICAgfVxuICAgIHNldCBkaXNhYmxlZChpbmFjdGl2ZSkge1xuICAgICAgICB0aGlzLmRpc2FibGVkXyA9IGluYWN0aXZlO1xuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZF8pIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJUaW1lcl8oKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VGltZXJfKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZGlzcG9zZSgpIHtcbiAgICAgICAgdGhpcy5jbGVhclRpbWVyXygpO1xuICAgIH1cbiAgICBjbGVhclRpbWVyXygpIHtcbiAgICAgICAgaWYgKHRoaXMudGltZXJJZF8gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB3aW4gPSB0aGlzLmRvY18uZGVmYXVsdFZpZXc7XG4gICAgICAgIGlmICh3aW4pIHtcbiAgICAgICAgICAgIHdpbi5jbGVhckludGVydmFsKHRoaXMudGltZXJJZF8pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGltZXJJZF8gPSBudWxsO1xuICAgIH1cbiAgICBzZXRUaW1lcl8oKSB7XG4gICAgICAgIHRoaXMuY2xlYXJUaW1lcl8oKTtcbiAgICAgICAgaWYgKHRoaXMuaW50ZXJ2YWxfIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB3aW4gPSB0aGlzLmRvY18uZGVmYXVsdFZpZXc7XG4gICAgICAgIGlmICh3aW4pIHtcbiAgICAgICAgICAgIHRoaXMudGltZXJJZF8gPSB3aW4uc2V0SW50ZXJ2YWwodGhpcy5vblRpY2tfLCB0aGlzLmludGVydmFsXyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgb25UaWNrXygpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWRfKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3RpY2snLCB7XG4gICAgICAgICAgICBzZW5kZXI6IHRoaXMsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuY2xhc3MgQ29tcG9zaXRlQ29uc3RyYWludCB7XG4gICAgY29uc3RydWN0b3IoY29uc3RyYWludHMpIHtcbiAgICAgICAgdGhpcy5jb25zdHJhaW50cyA9IGNvbnN0cmFpbnRzO1xuICAgIH1cbiAgICBjb25zdHJhaW4odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RyYWludHMucmVkdWNlKChyZXN1bHQsIGMpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjLmNvbnN0cmFpbihyZXN1bHQpO1xuICAgICAgICB9LCB2YWx1ZSk7XG4gICAgfVxufVxuZnVuY3Rpb24gZmluZENvbnN0cmFpbnQoYywgY29uc3RyYWludENsYXNzKSB7XG4gICAgaWYgKGMgaW5zdGFuY2VvZiBjb25zdHJhaW50Q2xhc3MpIHtcbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfVxuICAgIGlmIChjIGluc3RhbmNlb2YgQ29tcG9zaXRlQ29uc3RyYWludCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBjLmNvbnN0cmFpbnRzLnJlZHVjZSgodG1wUmVzdWx0LCBzYykgPT4ge1xuICAgICAgICAgICAgaWYgKHRtcFJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0bXBSZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2MgaW5zdGFuY2VvZiBjb25zdHJhaW50Q2xhc3MgPyBzYyA6IG51bGw7XG4gICAgICAgIH0sIG51bGwpO1xuICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5jbGFzcyBMaXN0Q29uc3RyYWludCB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICB0aGlzLnZhbHVlcyA9IFZhbHVlTWFwLmZyb21PYmplY3Qoe1xuICAgICAgICAgICAgb3B0aW9uczogb3B0aW9ucyxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0cmFpbih2YWx1ZSkge1xuICAgICAgICBjb25zdCBvcHRzID0gdGhpcy52YWx1ZXMuZ2V0KCdvcHRpb25zJyk7XG4gICAgICAgIGlmIChvcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1hdGNoZWQgPSBvcHRzLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0udmFsdWUgPT09IHZhbHVlO1xuICAgICAgICB9KS5sZW5ndGggPiAwO1xuICAgICAgICByZXR1cm4gbWF0Y2hlZCA/IHZhbHVlIDogb3B0c1swXS52YWx1ZTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlTGlzdE9wdGlvbnModmFsdWUpIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgcCA9IE1pY3JvUGFyc2VycztcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIChfYSA9IHBhcnNlUmVjb3JkKHsgaXRlbXM6IHZhbHVlIH0sIChwKSA9PiAoe1xuICAgICAgICAgICAgaXRlbXM6IHAucmVxdWlyZWQuYXJyYXkocC5yZXF1aXJlZC5vYmplY3Qoe1xuICAgICAgICAgICAgICAgIHRleHQ6IHAucmVxdWlyZWQuc3RyaW5nLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBwLnJlcXVpcmVkLnJhdyxcbiAgICAgICAgICAgIH0pKSxcbiAgICAgICAgfSkpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuaXRlbXM7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBwLnJlcXVpcmVkLnJhdyh2YWx1ZSlcbiAgICAgICAgICAgIC52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbmZ1bmN0aW9uIG5vcm1hbGl6ZUxpc3RPcHRpb25zKG9wdGlvbnMpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvcHRpb25zKSkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9XG4gICAgY29uc3QgaXRlbXMgPSBbXTtcbiAgICBPYmplY3Qua2V5cyhvcHRpb25zKS5mb3JFYWNoKCh0ZXh0KSA9PiB7XG4gICAgICAgIGl0ZW1zLnB1c2goeyB0ZXh0OiB0ZXh0LCB2YWx1ZTogb3B0aW9uc1t0ZXh0XSB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gaXRlbXM7XG59XG5mdW5jdGlvbiBjcmVhdGVMaXN0Q29uc3RyYWludChvcHRpb25zKSB7XG4gICAgcmV0dXJuICFpc0VtcHR5KG9wdGlvbnMpXG4gICAgICAgID8gbmV3IExpc3RDb25zdHJhaW50KG5vcm1hbGl6ZUxpc3RPcHRpb25zKGZvcmNlQ2FzdChvcHRpb25zKSkpXG4gICAgICAgIDogbnVsbDtcbn1cblxuY29uc3QgY24kayA9IENsYXNzTmFtZSgnbHN0Jyk7XG5jbGFzcyBMaXN0VmlldyB7XG4gICAgY29uc3RydWN0b3IoZG9jLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5vblZhbHVlQ2hhbmdlXyA9IHRoaXMub25WYWx1ZUNoYW5nZV8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5wcm9wc18gPSBjb25maWcucHJvcHM7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoY24kaygpKTtcbiAgICAgICAgY29uZmlnLnZpZXdQcm9wcy5iaW5kQ2xhc3NNb2RpZmllcnModGhpcy5lbGVtZW50KTtcbiAgICAgICAgY29uc3Qgc2VsZWN0RWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgICAgICAgc2VsZWN0RWxlbS5jbGFzc0xpc3QuYWRkKGNuJGsoJ3MnKSk7XG4gICAgICAgIGNvbmZpZy52aWV3UHJvcHMuYmluZERpc2FibGVkKHNlbGVjdEVsZW0pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoc2VsZWN0RWxlbSk7XG4gICAgICAgIHRoaXMuc2VsZWN0RWxlbWVudCA9IHNlbGVjdEVsZW07XG4gICAgICAgIGNvbnN0IG1hcmtFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBtYXJrRWxlbS5jbGFzc0xpc3QuYWRkKGNuJGsoJ20nKSk7XG4gICAgICAgIG1hcmtFbGVtLmFwcGVuZENoaWxkKGNyZWF0ZVN2Z0ljb25FbGVtZW50KGRvYywgJ2Ryb3Bkb3duJykpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQobWFya0VsZW0pO1xuICAgICAgICBjb25maWcudmFsdWUuZW1pdHRlci5vbignY2hhbmdlJywgdGhpcy5vblZhbHVlQ2hhbmdlXyk7XG4gICAgICAgIHRoaXMudmFsdWVfID0gY29uZmlnLnZhbHVlO1xuICAgICAgICBiaW5kVmFsdWVNYXAodGhpcy5wcm9wc18sICdvcHRpb25zJywgKG9wdHMpID0+IHtcbiAgICAgICAgICAgIHJlbW92ZUNoaWxkRWxlbWVudHModGhpcy5zZWxlY3RFbGVtZW50KTtcbiAgICAgICAgICAgIG9wdHMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbkVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICAgICAgb3B0aW9uRWxlbS50ZXh0Q29udGVudCA9IGl0ZW0udGV4dDtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdEVsZW1lbnQuYXBwZW5kQ2hpbGQob3B0aW9uRWxlbSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlXygpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgdXBkYXRlXygpIHtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gdGhpcy5wcm9wc18uZ2V0KCdvcHRpb25zJykubWFwKChvKSA9PiBvLnZhbHVlKTtcbiAgICAgICAgdGhpcy5zZWxlY3RFbGVtZW50LnNlbGVjdGVkSW5kZXggPSB2YWx1ZXMuaW5kZXhPZih0aGlzLnZhbHVlXy5yYXdWYWx1ZSk7XG4gICAgfVxuICAgIG9uVmFsdWVDaGFuZ2VfKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZV8oKTtcbiAgICB9XG59XG5cbmNsYXNzIExpc3RDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihkb2MsIGNvbmZpZykge1xuICAgICAgICB0aGlzLm9uU2VsZWN0Q2hhbmdlXyA9IHRoaXMub25TZWxlY3RDaGFuZ2VfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMucHJvcHMgPSBjb25maWcucHJvcHM7XG4gICAgICAgIHRoaXMudmFsdWUgPSBjb25maWcudmFsdWU7XG4gICAgICAgIHRoaXMudmlld1Byb3BzID0gY29uZmlnLnZpZXdQcm9wcztcbiAgICAgICAgdGhpcy52aWV3ID0gbmV3IExpc3RWaWV3KGRvYywge1xuICAgICAgICAgICAgcHJvcHM6IHRoaXMucHJvcHMsXG4gICAgICAgICAgICB2YWx1ZTogdGhpcy52YWx1ZSxcbiAgICAgICAgICAgIHZpZXdQcm9wczogdGhpcy52aWV3UHJvcHMsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnZpZXcuc2VsZWN0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLm9uU2VsZWN0Q2hhbmdlXyk7XG4gICAgfVxuICAgIG9uU2VsZWN0Q2hhbmdlXyhlKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdEVsZW0gPSBmb3JjZUNhc3QoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgdGhpcy52YWx1ZS5yYXdWYWx1ZSA9XG4gICAgICAgICAgICB0aGlzLnByb3BzLmdldCgnb3B0aW9ucycpW3NlbGVjdEVsZW0uc2VsZWN0ZWRJbmRleF0udmFsdWU7XG4gICAgfVxuICAgIGltcG9ydFByb3BzKHN0YXRlKSB7XG4gICAgICAgIHJldHVybiBpbXBvcnRCbGFkZVN0YXRlKHN0YXRlLCBudWxsLCAocCkgPT4gKHtcbiAgICAgICAgICAgIG9wdGlvbnM6IHAucmVxdWlyZWQuY3VzdG9tKHBhcnNlTGlzdE9wdGlvbnMpLFxuICAgICAgICB9KSwgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5zZXQoJ29wdGlvbnMnLCBub3JtYWxpemVMaXN0T3B0aW9ucyhyZXN1bHQub3B0aW9ucykpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBleHBvcnRQcm9wcygpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydEJsYWRlU3RhdGUobnVsbCwge1xuICAgICAgICAgICAgb3B0aW9uczogdGhpcy5wcm9wcy5nZXQoJ29wdGlvbnMnKSxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5jb25zdCBjbiRqID0gQ2xhc3NOYW1lKCdwb3AnKTtcbmNsYXNzIFBvcHVwVmlldyB7XG4gICAgY29uc3RydWN0b3IoZG9jLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbiRqKCkpO1xuICAgICAgICBjb25maWcudmlld1Byb3BzLmJpbmRDbGFzc01vZGlmaWVycyh0aGlzLmVsZW1lbnQpO1xuICAgICAgICBiaW5kVmFsdWUoY29uZmlnLnNob3dzLCB2YWx1ZVRvQ2xhc3NOYW1lKHRoaXMuZWxlbWVudCwgY24kaih1bmRlZmluZWQsICd2JykpKTtcbiAgICB9XG59XG5cbmNsYXNzIFBvcHVwQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoZG9jLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5zaG93cyA9IGNyZWF0ZVZhbHVlKGZhbHNlKTtcbiAgICAgICAgdGhpcy52aWV3UHJvcHMgPSBjb25maWcudmlld1Byb3BzO1xuICAgICAgICB0aGlzLnZpZXcgPSBuZXcgUG9wdXBWaWV3KGRvYywge1xuICAgICAgICAgICAgc2hvd3M6IHRoaXMuc2hvd3MsXG4gICAgICAgICAgICB2aWV3UHJvcHM6IHRoaXMudmlld1Byb3BzLFxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmNvbnN0IGNuJGkgPSBDbGFzc05hbWUoJ3R4dCcpO1xuY2xhc3MgVGV4dFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKGRvYywgY29uZmlnKSB7XG4gICAgICAgIHRoaXMub25DaGFuZ2VfID0gdGhpcy5vbkNoYW5nZV8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbiRpKCkpO1xuICAgICAgICBjb25maWcudmlld1Byb3BzLmJpbmRDbGFzc01vZGlmaWVycyh0aGlzLmVsZW1lbnQpO1xuICAgICAgICB0aGlzLnByb3BzXyA9IGNvbmZpZy5wcm9wcztcbiAgICAgICAgdGhpcy5wcm9wc18uZW1pdHRlci5vbignY2hhbmdlJywgdGhpcy5vbkNoYW5nZV8pO1xuICAgICAgICBjb25zdCBpbnB1dEVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgaW5wdXRFbGVtLmNsYXNzTGlzdC5hZGQoY24kaSgnaScpKTtcbiAgICAgICAgaW5wdXRFbGVtLnR5cGUgPSAndGV4dCc7XG4gICAgICAgIGNvbmZpZy52aWV3UHJvcHMuYmluZERpc2FibGVkKGlucHV0RWxlbSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChpbnB1dEVsZW0pO1xuICAgICAgICB0aGlzLmlucHV0RWxlbWVudCA9IGlucHV0RWxlbTtcbiAgICAgICAgY29uZmlnLnZhbHVlLmVtaXR0ZXIub24oJ2NoYW5nZScsIHRoaXMub25DaGFuZ2VfKTtcbiAgICAgICAgdGhpcy52YWx1ZV8gPSBjb25maWcudmFsdWU7XG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xuICAgIH1cbiAgICByZWZyZXNoKCkge1xuICAgICAgICBjb25zdCBmb3JtYXR0ZXIgPSB0aGlzLnByb3BzXy5nZXQoJ2Zvcm1hdHRlcicpO1xuICAgICAgICB0aGlzLmlucHV0RWxlbWVudC52YWx1ZSA9IGZvcm1hdHRlcih0aGlzLnZhbHVlXy5yYXdWYWx1ZSk7XG4gICAgfVxuICAgIG9uQ2hhbmdlXygpIHtcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgfVxufVxuXG5jbGFzcyBUZXh0Q29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoZG9jLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5vbklucHV0Q2hhbmdlXyA9IHRoaXMub25JbnB1dENoYW5nZV8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5wYXJzZXJfID0gY29uZmlnLnBhcnNlcjtcbiAgICAgICAgdGhpcy5wcm9wcyA9IGNvbmZpZy5wcm9wcztcbiAgICAgICAgdGhpcy52YWx1ZSA9IGNvbmZpZy52YWx1ZTtcbiAgICAgICAgdGhpcy52aWV3UHJvcHMgPSBjb25maWcudmlld1Byb3BzO1xuICAgICAgICB0aGlzLnZpZXcgPSBuZXcgVGV4dFZpZXcoZG9jLCB7XG4gICAgICAgICAgICBwcm9wczogY29uZmlnLnByb3BzLFxuICAgICAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXG4gICAgICAgICAgICB2aWV3UHJvcHM6IHRoaXMudmlld1Byb3BzLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy52aWV3LmlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLm9uSW5wdXRDaGFuZ2VfKTtcbiAgICB9XG4gICAgb25JbnB1dENoYW5nZV8oZSkge1xuICAgICAgICBjb25zdCBpbnB1dEVsZW0gPSBmb3JjZUNhc3QoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBpbnB1dEVsZW0udmFsdWU7XG4gICAgICAgIGNvbnN0IHBhcnNlZFZhbHVlID0gdGhpcy5wYXJzZXJfKHZhbHVlKTtcbiAgICAgICAgaWYgKCFpc0VtcHR5KHBhcnNlZFZhbHVlKSkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZS5yYXdWYWx1ZSA9IHBhcnNlZFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmlldy5yZWZyZXNoKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBib29sVG9TdHJpbmcodmFsdWUpIHtcbiAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcbn1cbmZ1bmN0aW9uIGJvb2xGcm9tVW5rbm93bih2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAhIXZhbHVlO1xufVxuZnVuY3Rpb24gQm9vbGVhbkZvcm1hdHRlcih2YWx1ZSkge1xuICAgIHJldHVybiBib29sVG9TdHJpbmcodmFsdWUpO1xufVxuXG5mdW5jdGlvbiBjb21wb3NlUGFyc2VycyhwYXJzZXJzKSB7XG4gICAgcmV0dXJuICh0ZXh0KSA9PiB7XG4gICAgICAgIHJldHVybiBwYXJzZXJzLnJlZHVjZSgocmVzdWx0LCBwYXJzZXIpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlcih0ZXh0KTtcbiAgICAgICAgfSwgbnVsbCk7XG4gICAgfTtcbn1cblxuY29uc3QgaW5uZXJGb3JtYXR0ZXIgPSBjcmVhdGVOdW1iZXJGb3JtYXR0ZXIoMCk7XG5mdW5jdGlvbiBmb3JtYXRQZXJjZW50YWdlKHZhbHVlKSB7XG4gICAgcmV0dXJuIGlubmVyRm9ybWF0dGVyKHZhbHVlKSArICclJztcbn1cblxuZnVuY3Rpb24gc3RyaW5nRnJvbVVua25vd24odmFsdWUpIHtcbiAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcbn1cbmZ1bmN0aW9uIGZvcm1hdFN0cmluZyh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gY29ubmVjdFZhbHVlcyh7IHByaW1hcnksIHNlY29uZGFyeSwgZm9yd2FyZCwgYmFja3dhcmQsIH0pIHtcbiAgICBsZXQgY2hhbmdpbmcgPSBmYWxzZTtcbiAgICBmdW5jdGlvbiBwcmV2ZW50RmVlZGJhY2soY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKGNoYW5naW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY2hhbmdpbmcgPSB0cnVlO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICBjaGFuZ2luZyA9IGZhbHNlO1xuICAgIH1cbiAgICBwcmltYXJ5LmVtaXR0ZXIub24oJ2NoYW5nZScsIChldikgPT4ge1xuICAgICAgICBwcmV2ZW50RmVlZGJhY2soKCkgPT4ge1xuICAgICAgICAgICAgc2Vjb25kYXJ5LnNldFJhd1ZhbHVlKGZvcndhcmQocHJpbWFyeS5yYXdWYWx1ZSwgc2Vjb25kYXJ5LnJhd1ZhbHVlKSwgZXYub3B0aW9ucyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHNlY29uZGFyeS5lbWl0dGVyLm9uKCdjaGFuZ2UnLCAoZXYpID0+IHtcbiAgICAgICAgcHJldmVudEZlZWRiYWNrKCgpID0+IHtcbiAgICAgICAgICAgIHByaW1hcnkuc2V0UmF3VmFsdWUoYmFja3dhcmQocHJpbWFyeS5yYXdWYWx1ZSwgc2Vjb25kYXJ5LnJhd1ZhbHVlKSwgZXYub3B0aW9ucyk7XG4gICAgICAgIH0pO1xuICAgICAgICBwcmV2ZW50RmVlZGJhY2soKCkgPT4ge1xuICAgICAgICAgICAgc2Vjb25kYXJ5LnNldFJhd1ZhbHVlKGZvcndhcmQocHJpbWFyeS5yYXdWYWx1ZSwgc2Vjb25kYXJ5LnJhd1ZhbHVlKSwgZXYub3B0aW9ucyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHByZXZlbnRGZWVkYmFjaygoKSA9PiB7XG4gICAgICAgIHNlY29uZGFyeS5zZXRSYXdWYWx1ZShmb3J3YXJkKHByaW1hcnkucmF3VmFsdWUsIHNlY29uZGFyeS5yYXdWYWx1ZSksIHtcbiAgICAgICAgICAgIGZvcmNlRW1pdDogZmFsc2UsXG4gICAgICAgICAgICBsYXN0OiB0cnVlLFxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0U3RlcEZvcktleShrZXlTY2FsZSwga2V5cykge1xuICAgIGNvbnN0IHN0ZXAgPSBrZXlTY2FsZSAqIChrZXlzLmFsdEtleSA/IDAuMSA6IDEpICogKGtleXMuc2hpZnRLZXkgPyAxMCA6IDEpO1xuICAgIGlmIChrZXlzLnVwS2V5KSB7XG4gICAgICAgIHJldHVybiArc3RlcDtcbiAgICB9XG4gICAgZWxzZSBpZiAoa2V5cy5kb3duS2V5KSB7XG4gICAgICAgIHJldHVybiAtc3RlcDtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG59XG5mdW5jdGlvbiBnZXRWZXJ0aWNhbFN0ZXBLZXlzKGV2KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYWx0S2V5OiBldi5hbHRLZXksXG4gICAgICAgIGRvd25LZXk6IGV2LmtleSA9PT0gJ0Fycm93RG93bicsXG4gICAgICAgIHNoaWZ0S2V5OiBldi5zaGlmdEtleSxcbiAgICAgICAgdXBLZXk6IGV2LmtleSA9PT0gJ0Fycm93VXAnLFxuICAgIH07XG59XG5mdW5jdGlvbiBnZXRIb3Jpem9udGFsU3RlcEtleXMoZXYpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBhbHRLZXk6IGV2LmFsdEtleSxcbiAgICAgICAgZG93bktleTogZXYua2V5ID09PSAnQXJyb3dMZWZ0JyxcbiAgICAgICAgc2hpZnRLZXk6IGV2LnNoaWZ0S2V5LFxuICAgICAgICB1cEtleTogZXYua2V5ID09PSAnQXJyb3dSaWdodCcsXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGlzVmVydGljYWxBcnJvd0tleShrZXkpIHtcbiAgICByZXR1cm4ga2V5ID09PSAnQXJyb3dVcCcgfHwga2V5ID09PSAnQXJyb3dEb3duJztcbn1cbmZ1bmN0aW9uIGlzQXJyb3dLZXkoa2V5KSB7XG4gICAgcmV0dXJuIGlzVmVydGljYWxBcnJvd0tleShrZXkpIHx8IGtleSA9PT0gJ0Fycm93TGVmdCcgfHwga2V5ID09PSAnQXJyb3dSaWdodCc7XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVPZmZzZXQkMShldiwgZWxlbSkge1xuICAgIHZhciBfYSwgX2I7XG4gICAgY29uc3Qgd2luID0gZWxlbS5vd25lckRvY3VtZW50LmRlZmF1bHRWaWV3O1xuICAgIGNvbnN0IHJlY3QgPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHg6IGV2LnBhZ2VYIC0gKCgoX2EgPSAod2luICYmIHdpbi5zY3JvbGxYKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogMCkgKyByZWN0LmxlZnQpLFxuICAgICAgICB5OiBldi5wYWdlWSAtICgoKF9iID0gKHdpbiAmJiB3aW4uc2Nyb2xsWSkpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IDApICsgcmVjdC50b3ApLFxuICAgIH07XG59XG5jbGFzcyBQb2ludGVySGFuZGxlciB7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudCkge1xuICAgICAgICB0aGlzLmxhc3RUb3VjaF8gPSBudWxsO1xuICAgICAgICB0aGlzLm9uRG9jdW1lbnRNb3VzZU1vdmVfID0gdGhpcy5vbkRvY3VtZW50TW91c2VNb3ZlXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uRG9jdW1lbnRNb3VzZVVwXyA9IHRoaXMub25Eb2N1bWVudE1vdXNlVXBfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25Nb3VzZURvd25fID0gdGhpcy5vbk1vdXNlRG93bl8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vblRvdWNoRW5kXyA9IHRoaXMub25Ub3VjaEVuZF8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vblRvdWNoTW92ZV8gPSB0aGlzLm9uVG91Y2hNb3ZlXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uVG91Y2hTdGFydF8gPSB0aGlzLm9uVG91Y2hTdGFydF8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5lbGVtXyA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25Ub3VjaFN0YXJ0Xywge1xuICAgICAgICAgICAgcGFzc2l2ZTogZmFsc2UsXG4gICAgICAgIH0pO1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMub25Ub3VjaE1vdmVfLCB7XG4gICAgICAgICAgICBwYXNzaXZlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMub25Ub3VjaEVuZF8pO1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZURvd25fKTtcbiAgICB9XG4gICAgY29tcHV0ZVBvc2l0aW9uXyhvZmZzZXQpIHtcbiAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMuZWxlbV8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBib3VuZHM6IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogcmVjdC53aWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBvaW50OiBvZmZzZXRcbiAgICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgICAgeDogb2Zmc2V0LngsXG4gICAgICAgICAgICAgICAgICAgIHk6IG9mZnNldC55LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA6IG51bGwsXG4gICAgICAgIH07XG4gICAgfVxuICAgIG9uTW91c2VEb3duXyhldikge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIChfYSA9IGV2LmN1cnJlbnRUYXJnZXQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5mb2N1cygpO1xuICAgICAgICBjb25zdCBkb2MgPSB0aGlzLmVsZW1fLm93bmVyRG9jdW1lbnQ7XG4gICAgICAgIGRvYy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uRG9jdW1lbnRNb3VzZU1vdmVfKTtcbiAgICAgICAgZG9jLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uRG9jdW1lbnRNb3VzZVVwXyk7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkb3duJywge1xuICAgICAgICAgICAgYWx0S2V5OiBldi5hbHRLZXksXG4gICAgICAgICAgICBkYXRhOiB0aGlzLmNvbXB1dGVQb3NpdGlvbl8oY29tcHV0ZU9mZnNldCQxKGV2LCB0aGlzLmVsZW1fKSksXG4gICAgICAgICAgICBzZW5kZXI6IHRoaXMsXG4gICAgICAgICAgICBzaGlmdEtleTogZXYuc2hpZnRLZXksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvbkRvY3VtZW50TW91c2VNb3ZlXyhldikge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnbW92ZScsIHtcbiAgICAgICAgICAgIGFsdEtleTogZXYuYWx0S2V5LFxuICAgICAgICAgICAgZGF0YTogdGhpcy5jb21wdXRlUG9zaXRpb25fKGNvbXB1dGVPZmZzZXQkMShldiwgdGhpcy5lbGVtXykpLFxuICAgICAgICAgICAgc2VuZGVyOiB0aGlzLFxuICAgICAgICAgICAgc2hpZnRLZXk6IGV2LnNoaWZ0S2V5LFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb25Eb2N1bWVudE1vdXNlVXBfKGV2KSB7XG4gICAgICAgIGNvbnN0IGRvYyA9IHRoaXMuZWxlbV8ub3duZXJEb2N1bWVudDtcbiAgICAgICAgZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Eb2N1bWVudE1vdXNlTW92ZV8pO1xuICAgICAgICBkb2MucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Eb2N1bWVudE1vdXNlVXBfKTtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3VwJywge1xuICAgICAgICAgICAgYWx0S2V5OiBldi5hbHRLZXksXG4gICAgICAgICAgICBkYXRhOiB0aGlzLmNvbXB1dGVQb3NpdGlvbl8oY29tcHV0ZU9mZnNldCQxKGV2LCB0aGlzLmVsZW1fKSksXG4gICAgICAgICAgICBzZW5kZXI6IHRoaXMsXG4gICAgICAgICAgICBzaGlmdEtleTogZXYuc2hpZnRLZXksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvblRvdWNoU3RhcnRfKGV2KSB7XG4gICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IHRvdWNoID0gZXYudGFyZ2V0VG91Y2hlcy5pdGVtKDApO1xuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5lbGVtXy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2Rvd24nLCB7XG4gICAgICAgICAgICBhbHRLZXk6IGV2LmFsdEtleSxcbiAgICAgICAgICAgIGRhdGE6IHRoaXMuY29tcHV0ZVBvc2l0aW9uXyh0b3VjaFxuICAgICAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgICAgICB4OiB0b3VjaC5jbGllbnRYIC0gcmVjdC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICB5OiB0b3VjaC5jbGllbnRZIC0gcmVjdC50b3AsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkKSxcbiAgICAgICAgICAgIHNlbmRlcjogdGhpcyxcbiAgICAgICAgICAgIHNoaWZ0S2V5OiBldi5zaGlmdEtleSxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubGFzdFRvdWNoXyA9IHRvdWNoO1xuICAgIH1cbiAgICBvblRvdWNoTW92ZV8oZXYpIHtcbiAgICAgICAgY29uc3QgdG91Y2ggPSBldi50YXJnZXRUb3VjaGVzLml0ZW0oMCk7XG4gICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLmVsZW1fLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnbW92ZScsIHtcbiAgICAgICAgICAgIGFsdEtleTogZXYuYWx0S2V5LFxuICAgICAgICAgICAgZGF0YTogdGhpcy5jb21wdXRlUG9zaXRpb25fKHRvdWNoXG4gICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgIHg6IHRvdWNoLmNsaWVudFggLSByZWN0LmxlZnQsXG4gICAgICAgICAgICAgICAgICAgIHk6IHRvdWNoLmNsaWVudFkgLSByZWN0LnRvcCxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQpLFxuICAgICAgICAgICAgc2VuZGVyOiB0aGlzLFxuICAgICAgICAgICAgc2hpZnRLZXk6IGV2LnNoaWZ0S2V5LFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5sYXN0VG91Y2hfID0gdG91Y2g7XG4gICAgfVxuICAgIG9uVG91Y2hFbmRfKGV2KSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgY29uc3QgdG91Y2ggPSAoX2EgPSBldi50YXJnZXRUb3VjaGVzLml0ZW0oMCkpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHRoaXMubGFzdFRvdWNoXztcbiAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMuZWxlbV8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCd1cCcsIHtcbiAgICAgICAgICAgIGFsdEtleTogZXYuYWx0S2V5LFxuICAgICAgICAgICAgZGF0YTogdGhpcy5jb21wdXRlUG9zaXRpb25fKHRvdWNoXG4gICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgIHg6IHRvdWNoLmNsaWVudFggLSByZWN0LmxlZnQsXG4gICAgICAgICAgICAgICAgICAgIHk6IHRvdWNoLmNsaWVudFkgLSByZWN0LnRvcCxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQpLFxuICAgICAgICAgICAgc2VuZGVyOiB0aGlzLFxuICAgICAgICAgICAgc2hpZnRLZXk6IGV2LnNoaWZ0S2V5LFxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmNvbnN0IGNuJGggPSBDbGFzc05hbWUoJ3R4dCcpO1xuY2xhc3MgTnVtYmVyVGV4dFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKGRvYywgY29uZmlnKSB7XG4gICAgICAgIHRoaXMub25DaGFuZ2VfID0gdGhpcy5vbkNoYW5nZV8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5wcm9wc18gPSBjb25maWcucHJvcHM7XG4gICAgICAgIHRoaXMucHJvcHNfLmVtaXR0ZXIub24oJ2NoYW5nZScsIHRoaXMub25DaGFuZ2VfKTtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbiRoKCksIGNuJGgodW5kZWZpbmVkLCAnbnVtJykpO1xuICAgICAgICBpZiAoY29uZmlnLmFycmF5UG9zaXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNuJGgodW5kZWZpbmVkLCBjb25maWcuYXJyYXlQb3NpdGlvbikpO1xuICAgICAgICB9XG4gICAgICAgIGNvbmZpZy52aWV3UHJvcHMuYmluZENsYXNzTW9kaWZpZXJzKHRoaXMuZWxlbWVudCk7XG4gICAgICAgIGNvbnN0IGlucHV0RWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICBpbnB1dEVsZW0uY2xhc3NMaXN0LmFkZChjbiRoKCdpJykpO1xuICAgICAgICBpbnB1dEVsZW0udHlwZSA9ICd0ZXh0JztcbiAgICAgICAgY29uZmlnLnZpZXdQcm9wcy5iaW5kRGlzYWJsZWQoaW5wdXRFbGVtKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGlucHV0RWxlbSk7XG4gICAgICAgIHRoaXMuaW5wdXRFbGVtZW50ID0gaW5wdXRFbGVtO1xuICAgICAgICB0aGlzLm9uRHJhZ2dpbmdDaGFuZ2VfID0gdGhpcy5vbkRyYWdnaW5nQ2hhbmdlXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmRyYWdnaW5nXyA9IGNvbmZpZy5kcmFnZ2luZztcbiAgICAgICAgdGhpcy5kcmFnZ2luZ18uZW1pdHRlci5vbignY2hhbmdlJywgdGhpcy5vbkRyYWdnaW5nQ2hhbmdlXyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNuJGgoKSk7XG4gICAgICAgIHRoaXMuaW5wdXRFbGVtZW50LmNsYXNzTGlzdC5hZGQoY24kaCgnaScpKTtcbiAgICAgICAgY29uc3Qga25vYkVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGtub2JFbGVtLmNsYXNzTGlzdC5hZGQoY24kaCgnaycpKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGtub2JFbGVtKTtcbiAgICAgICAgdGhpcy5rbm9iRWxlbWVudCA9IGtub2JFbGVtO1xuICAgICAgICBjb25zdCBndWlkZUVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudE5TKFNWR19OUywgJ3N2ZycpO1xuICAgICAgICBndWlkZUVsZW0uY2xhc3NMaXN0LmFkZChjbiRoKCdnJykpO1xuICAgICAgICB0aGlzLmtub2JFbGVtZW50LmFwcGVuZENoaWxkKGd1aWRlRWxlbSk7XG4gICAgICAgIGNvbnN0IGJvZHlFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnROUyhTVkdfTlMsICdwYXRoJyk7XG4gICAgICAgIGJvZHlFbGVtLmNsYXNzTGlzdC5hZGQoY24kaCgnZ2InKSk7XG4gICAgICAgIGd1aWRlRWxlbS5hcHBlbmRDaGlsZChib2R5RWxlbSk7XG4gICAgICAgIHRoaXMuZ3VpZGVCb2R5RWxlbV8gPSBib2R5RWxlbTtcbiAgICAgICAgY29uc3QgaGVhZEVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudE5TKFNWR19OUywgJ3BhdGgnKTtcbiAgICAgICAgaGVhZEVsZW0uY2xhc3NMaXN0LmFkZChjbiRoKCdnaCcpKTtcbiAgICAgICAgZ3VpZGVFbGVtLmFwcGVuZENoaWxkKGhlYWRFbGVtKTtcbiAgICAgICAgdGhpcy5ndWlkZUhlYWRFbGVtXyA9IGhlYWRFbGVtO1xuICAgICAgICBjb25zdCB0b29sdGlwRWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdG9vbHRpcEVsZW0uY2xhc3NMaXN0LmFkZChDbGFzc05hbWUoJ3R0JykoKSk7XG4gICAgICAgIHRoaXMua25vYkVsZW1lbnQuYXBwZW5kQ2hpbGQodG9vbHRpcEVsZW0pO1xuICAgICAgICB0aGlzLnRvb2x0aXBFbGVtXyA9IHRvb2x0aXBFbGVtO1xuICAgICAgICBjb25maWcudmFsdWUuZW1pdHRlci5vbignY2hhbmdlJywgdGhpcy5vbkNoYW5nZV8pO1xuICAgICAgICB0aGlzLnZhbHVlID0gY29uZmlnLnZhbHVlO1xuICAgICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICB9XG4gICAgb25EcmFnZ2luZ0NoYW5nZV8oZXYpIHtcbiAgICAgICAgaWYgKGV2LnJhd1ZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShjbiRoKHVuZGVmaW5lZCwgJ2RyZycpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbiRoKHVuZGVmaW5lZCwgJ2RyZycpKTtcbiAgICAgICAgY29uc3QgeCA9IGV2LnJhd1ZhbHVlIC8gdGhpcy5wcm9wc18uZ2V0KCdwb2ludGVyU2NhbGUnKTtcbiAgICAgICAgY29uc3QgYW94ID0geCArICh4ID4gMCA/IC0xIDogeCA8IDAgPyArMSA6IDApO1xuICAgICAgICBjb25zdCBhZHggPSBjb25zdHJhaW5SYW5nZSgtYW94LCAtNCwgKzQpO1xuICAgICAgICB0aGlzLmd1aWRlSGVhZEVsZW1fLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgW2BNICR7YW94ICsgYWR4fSwwIEwke2FveH0sNCBMJHthb3ggKyBhZHh9LDhgLCBgTSAke3h9LC0xIEwke3h9LDlgXS5qb2luKCcgJykpO1xuICAgICAgICB0aGlzLmd1aWRlQm9keUVsZW1fLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgYE0gMCw0IEwke3h9LDRgKTtcbiAgICAgICAgY29uc3QgZm9ybWF0dGVyID0gdGhpcy5wcm9wc18uZ2V0KCdmb3JtYXR0ZXInKTtcbiAgICAgICAgdGhpcy50b29sdGlwRWxlbV8udGV4dENvbnRlbnQgPSBmb3JtYXR0ZXIodGhpcy52YWx1ZS5yYXdWYWx1ZSk7XG4gICAgICAgIHRoaXMudG9vbHRpcEVsZW1fLnN0eWxlLmxlZnQgPSBgJHt4fXB4YDtcbiAgICB9XG4gICAgcmVmcmVzaCgpIHtcbiAgICAgICAgY29uc3QgZm9ybWF0dGVyID0gdGhpcy5wcm9wc18uZ2V0KCdmb3JtYXR0ZXInKTtcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnQudmFsdWUgPSBmb3JtYXR0ZXIodGhpcy52YWx1ZS5yYXdWYWx1ZSk7XG4gICAgfVxuICAgIG9uQ2hhbmdlXygpIHtcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgfVxufVxuXG5jbGFzcyBOdW1iZXJUZXh0Q29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoZG9jLCBjb25maWcpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICB0aGlzLm9yaWdpblJhd1ZhbHVlXyA9IDA7XG4gICAgICAgIHRoaXMub25JbnB1dENoYW5nZV8gPSB0aGlzLm9uSW5wdXRDaGFuZ2VfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25JbnB1dEtleURvd25fID0gdGhpcy5vbklucHV0S2V5RG93bl8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbklucHV0S2V5VXBfID0gdGhpcy5vbklucHV0S2V5VXBfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25Qb2ludGVyRG93bl8gPSB0aGlzLm9uUG9pbnRlckRvd25fLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25Qb2ludGVyTW92ZV8gPSB0aGlzLm9uUG9pbnRlck1vdmVfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25Qb2ludGVyVXBfID0gdGhpcy5vblBvaW50ZXJVcF8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5wYXJzZXJfID0gY29uZmlnLnBhcnNlcjtcbiAgICAgICAgdGhpcy5wcm9wcyA9IGNvbmZpZy5wcm9wcztcbiAgICAgICAgdGhpcy5zbGlkZXJQcm9wc18gPSAoX2EgPSBjb25maWcuc2xpZGVyUHJvcHMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IG51bGw7XG4gICAgICAgIHRoaXMudmFsdWUgPSBjb25maWcudmFsdWU7XG4gICAgICAgIHRoaXMudmlld1Byb3BzID0gY29uZmlnLnZpZXdQcm9wcztcbiAgICAgICAgdGhpcy5kcmFnZ2luZ18gPSBjcmVhdGVWYWx1ZShudWxsKTtcbiAgICAgICAgdGhpcy52aWV3ID0gbmV3IE51bWJlclRleHRWaWV3KGRvYywge1xuICAgICAgICAgICAgYXJyYXlQb3NpdGlvbjogY29uZmlnLmFycmF5UG9zaXRpb24sXG4gICAgICAgICAgICBkcmFnZ2luZzogdGhpcy5kcmFnZ2luZ18sXG4gICAgICAgICAgICBwcm9wczogdGhpcy5wcm9wcyxcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgICAgICAgdmlld1Byb3BzOiB0aGlzLnZpZXdQcm9wcyxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudmlldy5pbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5vbklucHV0Q2hhbmdlXyk7XG4gICAgICAgIHRoaXMudmlldy5pbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMub25JbnB1dEtleURvd25fKTtcbiAgICAgICAgdGhpcy52aWV3LmlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMub25JbnB1dEtleVVwXyk7XG4gICAgICAgIGNvbnN0IHBoID0gbmV3IFBvaW50ZXJIYW5kbGVyKHRoaXMudmlldy5rbm9iRWxlbWVudCk7XG4gICAgICAgIHBoLmVtaXR0ZXIub24oJ2Rvd24nLCB0aGlzLm9uUG9pbnRlckRvd25fKTtcbiAgICAgICAgcGguZW1pdHRlci5vbignbW92ZScsIHRoaXMub25Qb2ludGVyTW92ZV8pO1xuICAgICAgICBwaC5lbWl0dGVyLm9uKCd1cCcsIHRoaXMub25Qb2ludGVyVXBfKTtcbiAgICB9XG4gICAgY29uc3RyYWluVmFsdWVfKHZhbHVlKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIGNvbnN0IG1pbiA9IChfYSA9IHRoaXMuc2xpZGVyUHJvcHNfKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0KCdtaW4nKTtcbiAgICAgICAgY29uc3QgbWF4ID0gKF9iID0gdGhpcy5zbGlkZXJQcm9wc18pID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5nZXQoJ21heCcpO1xuICAgICAgICBsZXQgdiA9IHZhbHVlO1xuICAgICAgICBpZiAobWluICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHYgPSBNYXRoLm1heCh2LCBtaW4pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdiA9IE1hdGgubWluKHYsIG1heCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfVxuICAgIG9uSW5wdXRDaGFuZ2VfKGUpIHtcbiAgICAgICAgY29uc3QgaW5wdXRFbGVtID0gZm9yY2VDYXN0KGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gaW5wdXRFbGVtLnZhbHVlO1xuICAgICAgICBjb25zdCBwYXJzZWRWYWx1ZSA9IHRoaXMucGFyc2VyXyh2YWx1ZSk7XG4gICAgICAgIGlmICghaXNFbXB0eShwYXJzZWRWYWx1ZSkpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUucmF3VmFsdWUgPSB0aGlzLmNvbnN0cmFpblZhbHVlXyhwYXJzZWRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52aWV3LnJlZnJlc2goKTtcbiAgICB9XG4gICAgb25JbnB1dEtleURvd25fKGV2KSB7XG4gICAgICAgIGNvbnN0IHN0ZXAgPSBnZXRTdGVwRm9yS2V5KHRoaXMucHJvcHMuZ2V0KCdrZXlTY2FsZScpLCBnZXRWZXJ0aWNhbFN0ZXBLZXlzKGV2KSk7XG4gICAgICAgIGlmIChzdGVwID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52YWx1ZS5zZXRSYXdWYWx1ZSh0aGlzLmNvbnN0cmFpblZhbHVlXyh0aGlzLnZhbHVlLnJhd1ZhbHVlICsgc3RlcCksIHtcbiAgICAgICAgICAgIGZvcmNlRW1pdDogZmFsc2UsXG4gICAgICAgICAgICBsYXN0OiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG9uSW5wdXRLZXlVcF8oZXYpIHtcbiAgICAgICAgY29uc3Qgc3RlcCA9IGdldFN0ZXBGb3JLZXkodGhpcy5wcm9wcy5nZXQoJ2tleVNjYWxlJyksIGdldFZlcnRpY2FsU3RlcEtleXMoZXYpKTtcbiAgICAgICAgaWYgKHN0ZXAgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnZhbHVlLnNldFJhd1ZhbHVlKHRoaXMudmFsdWUucmF3VmFsdWUsIHtcbiAgICAgICAgICAgIGZvcmNlRW1pdDogdHJ1ZSxcbiAgICAgICAgICAgIGxhc3Q6IHRydWUsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvblBvaW50ZXJEb3duXygpIHtcbiAgICAgICAgdGhpcy5vcmlnaW5SYXdWYWx1ZV8gPSB0aGlzLnZhbHVlLnJhd1ZhbHVlO1xuICAgICAgICB0aGlzLmRyYWdnaW5nXy5yYXdWYWx1ZSA9IDA7XG4gICAgfVxuICAgIGNvbXB1dGVEcmFnZ2luZ1ZhbHVlXyhkYXRhKSB7XG4gICAgICAgIGlmICghZGF0YS5wb2ludCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZHggPSBkYXRhLnBvaW50LnggLSBkYXRhLmJvdW5kcy53aWR0aCAvIDI7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cmFpblZhbHVlXyh0aGlzLm9yaWdpblJhd1ZhbHVlXyArIGR4ICogdGhpcy5wcm9wcy5nZXQoJ3BvaW50ZXJTY2FsZScpKTtcbiAgICB9XG4gICAgb25Qb2ludGVyTW92ZV8oZXYpIHtcbiAgICAgICAgY29uc3QgdiA9IHRoaXMuY29tcHV0ZURyYWdnaW5nVmFsdWVfKGV2LmRhdGEpO1xuICAgICAgICBpZiAodiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmFsdWUuc2V0UmF3VmFsdWUodiwge1xuICAgICAgICAgICAgZm9yY2VFbWl0OiBmYWxzZSxcbiAgICAgICAgICAgIGxhc3Q6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kcmFnZ2luZ18ucmF3VmFsdWUgPSB0aGlzLnZhbHVlLnJhd1ZhbHVlIC0gdGhpcy5vcmlnaW5SYXdWYWx1ZV87XG4gICAgfVxuICAgIG9uUG9pbnRlclVwXyhldikge1xuICAgICAgICBjb25zdCB2ID0gdGhpcy5jb21wdXRlRHJhZ2dpbmdWYWx1ZV8oZXYuZGF0YSk7XG4gICAgICAgIGlmICh2ID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52YWx1ZS5zZXRSYXdWYWx1ZSh2LCB7XG4gICAgICAgICAgICBmb3JjZUVtaXQ6IHRydWUsXG4gICAgICAgICAgICBsYXN0OiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kcmFnZ2luZ18ucmF3VmFsdWUgPSBudWxsO1xuICAgIH1cbn1cblxuY29uc3QgY24kZyA9IENsYXNzTmFtZSgnc2xkJyk7XG5jbGFzcyBTbGlkZXJWaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihkb2MsIGNvbmZpZykge1xuICAgICAgICB0aGlzLm9uQ2hhbmdlXyA9IHRoaXMub25DaGFuZ2VfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMucHJvcHNfID0gY29uZmlnLnByb3BzO1xuICAgICAgICB0aGlzLnByb3BzXy5lbWl0dGVyLm9uKCdjaGFuZ2UnLCB0aGlzLm9uQ2hhbmdlXyk7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoY24kZygpKTtcbiAgICAgICAgY29uZmlnLnZpZXdQcm9wcy5iaW5kQ2xhc3NNb2RpZmllcnModGhpcy5lbGVtZW50KTtcbiAgICAgICAgY29uc3QgdHJhY2tFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0cmFja0VsZW0uY2xhc3NMaXN0LmFkZChjbiRnKCd0JykpO1xuICAgICAgICBjb25maWcudmlld1Byb3BzLmJpbmRUYWJJbmRleCh0cmFja0VsZW0pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodHJhY2tFbGVtKTtcbiAgICAgICAgdGhpcy50cmFja0VsZW1lbnQgPSB0cmFja0VsZW07XG4gICAgICAgIGNvbnN0IGtub2JFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBrbm9iRWxlbS5jbGFzc0xpc3QuYWRkKGNuJGcoJ2snKSk7XG4gICAgICAgIHRoaXMudHJhY2tFbGVtZW50LmFwcGVuZENoaWxkKGtub2JFbGVtKTtcbiAgICAgICAgdGhpcy5rbm9iRWxlbWVudCA9IGtub2JFbGVtO1xuICAgICAgICBjb25maWcudmFsdWUuZW1pdHRlci5vbignY2hhbmdlJywgdGhpcy5vbkNoYW5nZV8pO1xuICAgICAgICB0aGlzLnZhbHVlID0gY29uZmlnLnZhbHVlO1xuICAgICAgICB0aGlzLnVwZGF0ZV8oKTtcbiAgICB9XG4gICAgdXBkYXRlXygpIHtcbiAgICAgICAgY29uc3QgcCA9IGNvbnN0cmFpblJhbmdlKG1hcFJhbmdlKHRoaXMudmFsdWUucmF3VmFsdWUsIHRoaXMucHJvcHNfLmdldCgnbWluJyksIHRoaXMucHJvcHNfLmdldCgnbWF4JyksIDAsIDEwMCksIDAsIDEwMCk7XG4gICAgICAgIHRoaXMua25vYkVsZW1lbnQuc3R5bGUud2lkdGggPSBgJHtwfSVgO1xuICAgIH1cbiAgICBvbkNoYW5nZV8oKSB7XG4gICAgICAgIHRoaXMudXBkYXRlXygpO1xuICAgIH1cbn1cblxuY2xhc3MgU2xpZGVyQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoZG9jLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5vbktleURvd25fID0gdGhpcy5vbktleURvd25fLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25LZXlVcF8gPSB0aGlzLm9uS2V5VXBfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25Qb2ludGVyRG93bk9yTW92ZV8gPSB0aGlzLm9uUG9pbnRlckRvd25Pck1vdmVfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25Qb2ludGVyVXBfID0gdGhpcy5vblBvaW50ZXJVcF8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IGNvbmZpZy52YWx1ZTtcbiAgICAgICAgdGhpcy52aWV3UHJvcHMgPSBjb25maWcudmlld1Byb3BzO1xuICAgICAgICB0aGlzLnByb3BzID0gY29uZmlnLnByb3BzO1xuICAgICAgICB0aGlzLnZpZXcgPSBuZXcgU2xpZGVyVmlldyhkb2MsIHtcbiAgICAgICAgICAgIHByb3BzOiB0aGlzLnByb3BzLFxuICAgICAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXG4gICAgICAgICAgICB2aWV3UHJvcHM6IHRoaXMudmlld1Byb3BzLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5wdEhhbmRsZXJfID0gbmV3IFBvaW50ZXJIYW5kbGVyKHRoaXMudmlldy50cmFja0VsZW1lbnQpO1xuICAgICAgICB0aGlzLnB0SGFuZGxlcl8uZW1pdHRlci5vbignZG93bicsIHRoaXMub25Qb2ludGVyRG93bk9yTW92ZV8pO1xuICAgICAgICB0aGlzLnB0SGFuZGxlcl8uZW1pdHRlci5vbignbW92ZScsIHRoaXMub25Qb2ludGVyRG93bk9yTW92ZV8pO1xuICAgICAgICB0aGlzLnB0SGFuZGxlcl8uZW1pdHRlci5vbigndXAnLCB0aGlzLm9uUG9pbnRlclVwXyk7XG4gICAgICAgIHRoaXMudmlldy50cmFja0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMub25LZXlEb3duXyk7XG4gICAgICAgIHRoaXMudmlldy50cmFja0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLm9uS2V5VXBfKTtcbiAgICB9XG4gICAgaGFuZGxlUG9pbnRlckV2ZW50XyhkLCBvcHRzKSB7XG4gICAgICAgIGlmICghZC5wb2ludCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmFsdWUuc2V0UmF3VmFsdWUobWFwUmFuZ2UoY29uc3RyYWluUmFuZ2UoZC5wb2ludC54LCAwLCBkLmJvdW5kcy53aWR0aCksIDAsIGQuYm91bmRzLndpZHRoLCB0aGlzLnByb3BzLmdldCgnbWluJyksIHRoaXMucHJvcHMuZ2V0KCdtYXgnKSksIG9wdHMpO1xuICAgIH1cbiAgICBvblBvaW50ZXJEb3duT3JNb3ZlXyhldikge1xuICAgICAgICB0aGlzLmhhbmRsZVBvaW50ZXJFdmVudF8oZXYuZGF0YSwge1xuICAgICAgICAgICAgZm9yY2VFbWl0OiBmYWxzZSxcbiAgICAgICAgICAgIGxhc3Q6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb25Qb2ludGVyVXBfKGV2KSB7XG4gICAgICAgIHRoaXMuaGFuZGxlUG9pbnRlckV2ZW50Xyhldi5kYXRhLCB7XG4gICAgICAgICAgICBmb3JjZUVtaXQ6IHRydWUsXG4gICAgICAgICAgICBsYXN0OiB0cnVlLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb25LZXlEb3duXyhldikge1xuICAgICAgICBjb25zdCBzdGVwID0gZ2V0U3RlcEZvcktleSh0aGlzLnByb3BzLmdldCgna2V5U2NhbGUnKSwgZ2V0SG9yaXpvbnRhbFN0ZXBLZXlzKGV2KSk7XG4gICAgICAgIGlmIChzdGVwID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52YWx1ZS5zZXRSYXdWYWx1ZSh0aGlzLnZhbHVlLnJhd1ZhbHVlICsgc3RlcCwge1xuICAgICAgICAgICAgZm9yY2VFbWl0OiBmYWxzZSxcbiAgICAgICAgICAgIGxhc3Q6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb25LZXlVcF8oZXYpIHtcbiAgICAgICAgY29uc3Qgc3RlcCA9IGdldFN0ZXBGb3JLZXkodGhpcy5wcm9wcy5nZXQoJ2tleVNjYWxlJyksIGdldEhvcml6b250YWxTdGVwS2V5cyhldikpO1xuICAgICAgICBpZiAoc3RlcCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmFsdWUuc2V0UmF3VmFsdWUodGhpcy52YWx1ZS5yYXdWYWx1ZSwge1xuICAgICAgICAgICAgZm9yY2VFbWl0OiB0cnVlLFxuICAgICAgICAgICAgbGFzdDogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5jb25zdCBjbiRmID0gQ2xhc3NOYW1lKCdzbGR0eHQnKTtcbmNsYXNzIFNsaWRlclRleHRWaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihkb2MsIGNvbmZpZykge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNuJGYoKSk7XG4gICAgICAgIGNvbnN0IHNsaWRlckVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHNsaWRlckVsZW0uY2xhc3NMaXN0LmFkZChjbiRmKCdzJykpO1xuICAgICAgICB0aGlzLnNsaWRlclZpZXdfID0gY29uZmlnLnNsaWRlclZpZXc7XG4gICAgICAgIHNsaWRlckVsZW0uYXBwZW5kQ2hpbGQodGhpcy5zbGlkZXJWaWV3Xy5lbGVtZW50KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHNsaWRlckVsZW0pO1xuICAgICAgICBjb25zdCB0ZXh0RWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGV4dEVsZW0uY2xhc3NMaXN0LmFkZChjbiRmKCd0JykpO1xuICAgICAgICB0aGlzLnRleHRWaWV3XyA9IGNvbmZpZy50ZXh0VmlldztcbiAgICAgICAgdGV4dEVsZW0uYXBwZW5kQ2hpbGQodGhpcy50ZXh0Vmlld18uZWxlbWVudCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0ZXh0RWxlbSk7XG4gICAgfVxufVxuXG5jbGFzcyBTbGlkZXJUZXh0Q29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoZG9jLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IGNvbmZpZy52YWx1ZTtcbiAgICAgICAgdGhpcy52aWV3UHJvcHMgPSBjb25maWcudmlld1Byb3BzO1xuICAgICAgICB0aGlzLnNsaWRlckNfID0gbmV3IFNsaWRlckNvbnRyb2xsZXIoZG9jLCB7XG4gICAgICAgICAgICBwcm9wczogY29uZmlnLnNsaWRlclByb3BzLFxuICAgICAgICAgICAgdmFsdWU6IGNvbmZpZy52YWx1ZSxcbiAgICAgICAgICAgIHZpZXdQcm9wczogdGhpcy52aWV3UHJvcHMsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRleHRDXyA9IG5ldyBOdW1iZXJUZXh0Q29udHJvbGxlcihkb2MsIHtcbiAgICAgICAgICAgIHBhcnNlcjogY29uZmlnLnBhcnNlcixcbiAgICAgICAgICAgIHByb3BzOiBjb25maWcudGV4dFByb3BzLFxuICAgICAgICAgICAgc2xpZGVyUHJvcHM6IGNvbmZpZy5zbGlkZXJQcm9wcyxcbiAgICAgICAgICAgIHZhbHVlOiBjb25maWcudmFsdWUsXG4gICAgICAgICAgICB2aWV3UHJvcHM6IGNvbmZpZy52aWV3UHJvcHMsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnZpZXcgPSBuZXcgU2xpZGVyVGV4dFZpZXcoZG9jLCB7XG4gICAgICAgICAgICBzbGlkZXJWaWV3OiB0aGlzLnNsaWRlckNfLnZpZXcsXG4gICAgICAgICAgICB0ZXh0VmlldzogdGhpcy50ZXh0Q18udmlldyxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGdldCBzbGlkZXJDb250cm9sbGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zbGlkZXJDXztcbiAgICB9XG4gICAgZ2V0IHRleHRDb250cm9sbGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0Q187XG4gICAgfVxuICAgIGltcG9ydFByb3BzKHN0YXRlKSB7XG4gICAgICAgIHJldHVybiBpbXBvcnRCbGFkZVN0YXRlKHN0YXRlLCBudWxsLCAocCkgPT4gKHtcbiAgICAgICAgICAgIG1heDogcC5yZXF1aXJlZC5udW1iZXIsXG4gICAgICAgICAgICBtaW46IHAucmVxdWlyZWQubnVtYmVyLFxuICAgICAgICB9KSwgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2xpZGVyUHJvcHMgPSB0aGlzLnNsaWRlckNfLnByb3BzO1xuICAgICAgICAgICAgc2xpZGVyUHJvcHMuc2V0KCdtYXgnLCByZXN1bHQubWF4KTtcbiAgICAgICAgICAgIHNsaWRlclByb3BzLnNldCgnbWluJywgcmVzdWx0Lm1pbik7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGV4cG9ydFByb3BzKCkge1xuICAgICAgICBjb25zdCBzbGlkZXJQcm9wcyA9IHRoaXMuc2xpZGVyQ18ucHJvcHM7XG4gICAgICAgIHJldHVybiBleHBvcnRCbGFkZVN0YXRlKG51bGwsIHtcbiAgICAgICAgICAgIG1heDogc2xpZGVyUHJvcHMuZ2V0KCdtYXgnKSxcbiAgICAgICAgICAgIG1pbjogc2xpZGVyUHJvcHMuZ2V0KCdtaW4nKSxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZnVuY3Rpb24gY3JlYXRlU2xpZGVyVGV4dFByb3BzKGNvbmZpZykge1xuICAgIHJldHVybiB7XG4gICAgICAgIHNsaWRlclByb3BzOiBuZXcgVmFsdWVNYXAoe1xuICAgICAgICAgICAga2V5U2NhbGU6IGNvbmZpZy5rZXlTY2FsZSxcbiAgICAgICAgICAgIG1heDogY29uZmlnLm1heCxcbiAgICAgICAgICAgIG1pbjogY29uZmlnLm1pbixcbiAgICAgICAgfSksXG4gICAgICAgIHRleHRQcm9wczogbmV3IFZhbHVlTWFwKHtcbiAgICAgICAgICAgIGZvcm1hdHRlcjogY3JlYXRlVmFsdWUoY29uZmlnLmZvcm1hdHRlciksXG4gICAgICAgICAgICBrZXlTY2FsZTogY29uZmlnLmtleVNjYWxlLFxuICAgICAgICAgICAgcG9pbnRlclNjYWxlOiBjcmVhdGVWYWx1ZShjb25maWcucG9pbnRlclNjYWxlKSxcbiAgICAgICAgfSksXG4gICAgfTtcbn1cblxuY29uc3QgQ1NTX1ZBUl9NQVAgPSB7XG4gICAgY29udGFpbmVyVW5pdFNpemU6ICdjbnQtdXN6Jyxcbn07XG5mdW5jdGlvbiBnZXRDc3NWYXIoa2V5KSB7XG4gICAgcmV0dXJuIGAtLSR7Q1NTX1ZBUl9NQVBba2V5XX1gO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVQb2ludERpbWVuc2lvblBhcnNlcihwKSB7XG4gICAgcmV0dXJuIGNyZWF0ZU51bWJlclRleHRJbnB1dFBhcmFtc1BhcnNlcihwKTtcbn1cbmZ1bmN0aW9uIHBhcnNlUG9pbnREaW1lbnNpb25QYXJhbXModmFsdWUpIHtcbiAgICBpZiAoIWlzUmVjb3JkKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VSZWNvcmQodmFsdWUsIGNyZWF0ZVBvaW50RGltZW5zaW9uUGFyc2VyKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZURpbWVuc2lvbkNvbnN0cmFpbnQocGFyYW1zLCBpbml0aWFsVmFsdWUpIHtcbiAgICBpZiAoIXBhcmFtcykge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBjb25zdCBjb25zdHJhaW50cyA9IFtdO1xuICAgIGNvbnN0IGNzID0gY3JlYXRlU3RlcENvbnN0cmFpbnQocGFyYW1zLCBpbml0aWFsVmFsdWUpO1xuICAgIGlmIChjcykge1xuICAgICAgICBjb25zdHJhaW50cy5wdXNoKGNzKTtcbiAgICB9XG4gICAgY29uc3QgcnMgPSBjcmVhdGVSYW5nZUNvbnN0cmFpbnQocGFyYW1zKTtcbiAgICBpZiAocnMpIHtcbiAgICAgICAgY29uc3RyYWludHMucHVzaChycyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQ29tcG9zaXRlQ29uc3RyYWludChjb25zdHJhaW50cyk7XG59XG5cbmZ1bmN0aW9uIGlzQ29tcGF0aWJsZSh2ZXIpIHtcbiAgICBpZiAoIXZlcikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB2ZXIubWFqb3IgPT09IFZFUlNJT04kMS5tYWpvcjtcbn1cblxuZnVuY3Rpb24gcGFyc2VQaWNrZXJMYXlvdXQodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT09ICdpbmxpbmUnIHx8IHZhbHVlID09PSAncG9wdXAnKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gd3JpdGVQcmltaXRpdmUodGFyZ2V0LCB2YWx1ZSkge1xuICAgIHRhcmdldC53cml0ZSh2YWx1ZSk7XG59XG5cbmNvbnN0IGNuJGUgPSBDbGFzc05hbWUoJ2NrYicpO1xuY2xhc3MgQ2hlY2tib3hWaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihkb2MsIGNvbmZpZykge1xuICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2VfID0gdGhpcy5vblZhbHVlQ2hhbmdlXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNuJGUoKSk7XG4gICAgICAgIGNvbmZpZy52aWV3UHJvcHMuYmluZENsYXNzTW9kaWZpZXJzKHRoaXMuZWxlbWVudCk7XG4gICAgICAgIGNvbnN0IGxhYmVsRWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgICBsYWJlbEVsZW0uY2xhc3NMaXN0LmFkZChjbiRlKCdsJykpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQobGFiZWxFbGVtKTtcbiAgICAgICAgdGhpcy5sYWJlbEVsZW1lbnQgPSBsYWJlbEVsZW07XG4gICAgICAgIGNvbnN0IGlucHV0RWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICBpbnB1dEVsZW0uY2xhc3NMaXN0LmFkZChjbiRlKCdpJykpO1xuICAgICAgICBpbnB1dEVsZW0udHlwZSA9ICdjaGVja2JveCc7XG4gICAgICAgIHRoaXMubGFiZWxFbGVtZW50LmFwcGVuZENoaWxkKGlucHV0RWxlbSk7XG4gICAgICAgIHRoaXMuaW5wdXRFbGVtZW50ID0gaW5wdXRFbGVtO1xuICAgICAgICBjb25maWcudmlld1Byb3BzLmJpbmREaXNhYmxlZCh0aGlzLmlucHV0RWxlbWVudCk7XG4gICAgICAgIGNvbnN0IHdyYXBwZXJFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB3cmFwcGVyRWxlbS5jbGFzc0xpc3QuYWRkKGNuJGUoJ3cnKSk7XG4gICAgICAgIHRoaXMubGFiZWxFbGVtZW50LmFwcGVuZENoaWxkKHdyYXBwZXJFbGVtKTtcbiAgICAgICAgY29uc3QgbWFya0VsZW0gPSBjcmVhdGVTdmdJY29uRWxlbWVudChkb2MsICdjaGVjaycpO1xuICAgICAgICB3cmFwcGVyRWxlbS5hcHBlbmRDaGlsZChtYXJrRWxlbSk7XG4gICAgICAgIGNvbmZpZy52YWx1ZS5lbWl0dGVyLm9uKCdjaGFuZ2UnLCB0aGlzLm9uVmFsdWVDaGFuZ2VfKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IGNvbmZpZy52YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVfKCk7XG4gICAgfVxuICAgIHVwZGF0ZV8oKSB7XG4gICAgICAgIHRoaXMuaW5wdXRFbGVtZW50LmNoZWNrZWQgPSB0aGlzLnZhbHVlLnJhd1ZhbHVlO1xuICAgIH1cbiAgICBvblZhbHVlQ2hhbmdlXygpIHtcbiAgICAgICAgdGhpcy51cGRhdGVfKCk7XG4gICAgfVxufVxuXG5jbGFzcyBDaGVja2JveENvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKGRvYywgY29uZmlnKSB7XG4gICAgICAgIHRoaXMub25JbnB1dENoYW5nZV8gPSB0aGlzLm9uSW5wdXRDaGFuZ2VfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25MYWJlbE1vdXNlRG93bl8gPSB0aGlzLm9uTGFiZWxNb3VzZURvd25fLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMudmFsdWUgPSBjb25maWcudmFsdWU7XG4gICAgICAgIHRoaXMudmlld1Byb3BzID0gY29uZmlnLnZpZXdQcm9wcztcbiAgICAgICAgdGhpcy52aWV3ID0gbmV3IENoZWNrYm94Vmlldyhkb2MsIHtcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgICAgICAgdmlld1Byb3BzOiB0aGlzLnZpZXdQcm9wcyxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudmlldy5pbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5vbklucHV0Q2hhbmdlXyk7XG4gICAgICAgIHRoaXMudmlldy5sYWJlbEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5vbkxhYmVsTW91c2VEb3duXyk7XG4gICAgfVxuICAgIG9uSW5wdXRDaGFuZ2VfKGV2KSB7XG4gICAgICAgIGNvbnN0IGlucHV0RWxlbSA9IGZvcmNlQ2FzdChldi5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgdGhpcy52YWx1ZS5yYXdWYWx1ZSA9IGlucHV0RWxlbS5jaGVja2VkO1xuICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gICAgb25MYWJlbE1vdXNlRG93bl8oZXYpIHtcbiAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbnN0cmFpbnQkNihwYXJhbXMpIHtcbiAgICBjb25zdCBjb25zdHJhaW50cyA9IFtdO1xuICAgIGNvbnN0IGxjID0gY3JlYXRlTGlzdENvbnN0cmFpbnQocGFyYW1zLm9wdGlvbnMpO1xuICAgIGlmIChsYykge1xuICAgICAgICBjb25zdHJhaW50cy5wdXNoKGxjKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBDb21wb3NpdGVDb25zdHJhaW50KGNvbnN0cmFpbnRzKTtcbn1cbmNvbnN0IEJvb2xlYW5JbnB1dFBsdWdpbiA9IGNyZWF0ZVBsdWdpbih7XG4gICAgaWQ6ICdpbnB1dC1ib29sJyxcbiAgICB0eXBlOiAnaW5wdXQnLFxuICAgIGFjY2VwdDogKHZhbHVlLCBwYXJhbXMpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXN1bHQgPSBwYXJzZVJlY29yZChwYXJhbXMsIChwKSA9PiAoe1xuICAgICAgICAgICAgb3B0aW9uczogcC5vcHRpb25hbC5jdXN0b20ocGFyc2VMaXN0T3B0aW9ucyksXG4gICAgICAgICAgICByZWFkb25seTogcC5vcHRpb25hbC5jb25zdGFudChmYWxzZSksXG4gICAgICAgIH0pKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgaW5pdGlhbFZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHJlc3VsdCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogbnVsbDtcbiAgICB9LFxuICAgIGJpbmRpbmc6IHtcbiAgICAgICAgcmVhZGVyOiAoX2FyZ3MpID0+IGJvb2xGcm9tVW5rbm93bixcbiAgICAgICAgY29uc3RyYWludDogKGFyZ3MpID0+IGNyZWF0ZUNvbnN0cmFpbnQkNihhcmdzLnBhcmFtcyksXG4gICAgICAgIHdyaXRlcjogKF9hcmdzKSA9PiB3cml0ZVByaW1pdGl2ZSxcbiAgICB9LFxuICAgIGNvbnRyb2xsZXI6IChhcmdzKSA9PiB7XG4gICAgICAgIGNvbnN0IGRvYyA9IGFyZ3MuZG9jdW1lbnQ7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gYXJncy52YWx1ZTtcbiAgICAgICAgY29uc3QgYyA9IGFyZ3MuY29uc3RyYWludDtcbiAgICAgICAgY29uc3QgbGMgPSBjICYmIGZpbmRDb25zdHJhaW50KGMsIExpc3RDb25zdHJhaW50KTtcbiAgICAgICAgaWYgKGxjKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IExpc3RDb250cm9sbGVyKGRvYywge1xuICAgICAgICAgICAgICAgIHByb3BzOiBuZXcgVmFsdWVNYXAoe1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBsYy52YWx1ZXMudmFsdWUoJ29wdGlvbnMnKSxcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgdmlld1Byb3BzOiBhcmdzLnZpZXdQcm9wcyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQ2hlY2tib3hDb250cm9sbGVyKGRvYywge1xuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgdmlld1Byb3BzOiBhcmdzLnZpZXdQcm9wcyxcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBhcGkoYXJncykge1xuICAgICAgICBpZiAodHlwZW9mIGFyZ3MuY29udHJvbGxlci52YWx1ZS5yYXdWYWx1ZSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJncy5jb250cm9sbGVyLnZhbHVlQ29udHJvbGxlciBpbnN0YW5jZW9mIExpc3RDb250cm9sbGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IExpc3RJbnB1dEJpbmRpbmdBcGkoYXJncy5jb250cm9sbGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxufSk7XG5cbmNvbnN0IGNuJGQgPSBDbGFzc05hbWUoJ2NvbCcpO1xuY2xhc3MgQ29sb3JWaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihkb2MsIGNvbmZpZykge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNuJGQoKSk7XG4gICAgICAgIGNvbmZpZy5mb2xkYWJsZS5iaW5kRXhwYW5kZWRDbGFzcyh0aGlzLmVsZW1lbnQsIGNuJGQodW5kZWZpbmVkLCAnZXhwYW5kZWQnKSk7XG4gICAgICAgIGJpbmRWYWx1ZU1hcChjb25maWcuZm9sZGFibGUsICdjb21wbGV0ZWQnLCB2YWx1ZVRvQ2xhc3NOYW1lKHRoaXMuZWxlbWVudCwgY24kZCh1bmRlZmluZWQsICdjcGwnKSkpO1xuICAgICAgICBjb25zdCBoZWFkRWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaGVhZEVsZW0uY2xhc3NMaXN0LmFkZChjbiRkKCdoJykpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoaGVhZEVsZW0pO1xuICAgICAgICBjb25zdCBzd2F0Y2hFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBzd2F0Y2hFbGVtLmNsYXNzTGlzdC5hZGQoY24kZCgncycpKTtcbiAgICAgICAgaGVhZEVsZW0uYXBwZW5kQ2hpbGQoc3dhdGNoRWxlbSk7XG4gICAgICAgIHRoaXMuc3dhdGNoRWxlbWVudCA9IHN3YXRjaEVsZW07XG4gICAgICAgIGNvbnN0IHRleHRFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0ZXh0RWxlbS5jbGFzc0xpc3QuYWRkKGNuJGQoJ3QnKSk7XG4gICAgICAgIGhlYWRFbGVtLmFwcGVuZENoaWxkKHRleHRFbGVtKTtcbiAgICAgICAgdGhpcy50ZXh0RWxlbWVudCA9IHRleHRFbGVtO1xuICAgICAgICBpZiAoY29uZmlnLnBpY2tlckxheW91dCA9PT0gJ2lubGluZScpIHtcbiAgICAgICAgICAgIGNvbnN0IHBpY2tlckVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBwaWNrZXJFbGVtLmNsYXNzTGlzdC5hZGQoY24kZCgncCcpKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChwaWNrZXJFbGVtKTtcbiAgICAgICAgICAgIHRoaXMucGlja2VyRWxlbWVudCA9IHBpY2tlckVsZW07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBpY2tlckVsZW1lbnQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiByZ2JUb0hzbEludChyLCBnLCBiKSB7XG4gICAgY29uc3QgcnAgPSBjb25zdHJhaW5SYW5nZShyIC8gMjU1LCAwLCAxKTtcbiAgICBjb25zdCBncCA9IGNvbnN0cmFpblJhbmdlKGcgLyAyNTUsIDAsIDEpO1xuICAgIGNvbnN0IGJwID0gY29uc3RyYWluUmFuZ2UoYiAvIDI1NSwgMCwgMSk7XG4gICAgY29uc3QgY21heCA9IE1hdGgubWF4KHJwLCBncCwgYnApO1xuICAgIGNvbnN0IGNtaW4gPSBNYXRoLm1pbihycCwgZ3AsIGJwKTtcbiAgICBjb25zdCBjID0gY21heCAtIGNtaW47XG4gICAgbGV0IGggPSAwO1xuICAgIGxldCBzID0gMDtcbiAgICBjb25zdCBsID0gKGNtaW4gKyBjbWF4KSAvIDI7XG4gICAgaWYgKGMgIT09IDApIHtcbiAgICAgICAgcyA9IGMgLyAoMSAtIE1hdGguYWJzKGNtYXggKyBjbWluIC0gMSkpO1xuICAgICAgICBpZiAocnAgPT09IGNtYXgpIHtcbiAgICAgICAgICAgIGggPSAoZ3AgLSBicCkgLyBjO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGdwID09PSBjbWF4KSB7XG4gICAgICAgICAgICBoID0gMiArIChicCAtIHJwKSAvIGM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBoID0gNCArIChycCAtIGdwKSAvIGM7XG4gICAgICAgIH1cbiAgICAgICAgaCA9IGggLyA2ICsgKGggPCAwID8gMSA6IDApO1xuICAgIH1cbiAgICByZXR1cm4gW2ggKiAzNjAsIHMgKiAxMDAsIGwgKiAxMDBdO1xufVxuZnVuY3Rpb24gaHNsVG9SZ2JJbnQoaCwgcywgbCkge1xuICAgIGNvbnN0IGhwID0gKChoICUgMzYwKSArIDM2MCkgJSAzNjA7XG4gICAgY29uc3Qgc3AgPSBjb25zdHJhaW5SYW5nZShzIC8gMTAwLCAwLCAxKTtcbiAgICBjb25zdCBscCA9IGNvbnN0cmFpblJhbmdlKGwgLyAxMDAsIDAsIDEpO1xuICAgIGNvbnN0IGMgPSAoMSAtIE1hdGguYWJzKDIgKiBscCAtIDEpKSAqIHNwO1xuICAgIGNvbnN0IHggPSBjICogKDEgLSBNYXRoLmFicygoKGhwIC8gNjApICUgMikgLSAxKSk7XG4gICAgY29uc3QgbSA9IGxwIC0gYyAvIDI7XG4gICAgbGV0IHJwLCBncCwgYnA7XG4gICAgaWYgKGhwID49IDAgJiYgaHAgPCA2MCkge1xuICAgICAgICBbcnAsIGdwLCBicF0gPSBbYywgeCwgMF07XG4gICAgfVxuICAgIGVsc2UgaWYgKGhwID49IDYwICYmIGhwIDwgMTIwKSB7XG4gICAgICAgIFtycCwgZ3AsIGJwXSA9IFt4LCBjLCAwXTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaHAgPj0gMTIwICYmIGhwIDwgMTgwKSB7XG4gICAgICAgIFtycCwgZ3AsIGJwXSA9IFswLCBjLCB4XTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaHAgPj0gMTgwICYmIGhwIDwgMjQwKSB7XG4gICAgICAgIFtycCwgZ3AsIGJwXSA9IFswLCB4LCBjXTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaHAgPj0gMjQwICYmIGhwIDwgMzAwKSB7XG4gICAgICAgIFtycCwgZ3AsIGJwXSA9IFt4LCAwLCBjXTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIFtycCwgZ3AsIGJwXSA9IFtjLCAwLCB4XTtcbiAgICB9XG4gICAgcmV0dXJuIFsocnAgKyBtKSAqIDI1NSwgKGdwICsgbSkgKiAyNTUsIChicCArIG0pICogMjU1XTtcbn1cbmZ1bmN0aW9uIHJnYlRvSHN2SW50KHIsIGcsIGIpIHtcbiAgICBjb25zdCBycCA9IGNvbnN0cmFpblJhbmdlKHIgLyAyNTUsIDAsIDEpO1xuICAgIGNvbnN0IGdwID0gY29uc3RyYWluUmFuZ2UoZyAvIDI1NSwgMCwgMSk7XG4gICAgY29uc3QgYnAgPSBjb25zdHJhaW5SYW5nZShiIC8gMjU1LCAwLCAxKTtcbiAgICBjb25zdCBjbWF4ID0gTWF0aC5tYXgocnAsIGdwLCBicCk7XG4gICAgY29uc3QgY21pbiA9IE1hdGgubWluKHJwLCBncCwgYnApO1xuICAgIGNvbnN0IGQgPSBjbWF4IC0gY21pbjtcbiAgICBsZXQgaDtcbiAgICBpZiAoZCA9PT0gMCkge1xuICAgICAgICBoID0gMDtcbiAgICB9XG4gICAgZWxzZSBpZiAoY21heCA9PT0gcnApIHtcbiAgICAgICAgaCA9IDYwICogKCgoKChncCAtIGJwKSAvIGQpICUgNikgKyA2KSAlIDYpO1xuICAgIH1cbiAgICBlbHNlIGlmIChjbWF4ID09PSBncCkge1xuICAgICAgICBoID0gNjAgKiAoKGJwIC0gcnApIC8gZCArIDIpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaCA9IDYwICogKChycCAtIGdwKSAvIGQgKyA0KTtcbiAgICB9XG4gICAgY29uc3QgcyA9IGNtYXggPT09IDAgPyAwIDogZCAvIGNtYXg7XG4gICAgY29uc3QgdiA9IGNtYXg7XG4gICAgcmV0dXJuIFtoLCBzICogMTAwLCB2ICogMTAwXTtcbn1cbmZ1bmN0aW9uIGhzdlRvUmdiSW50KGgsIHMsIHYpIHtcbiAgICBjb25zdCBocCA9IGxvb3BSYW5nZShoLCAzNjApO1xuICAgIGNvbnN0IHNwID0gY29uc3RyYWluUmFuZ2UocyAvIDEwMCwgMCwgMSk7XG4gICAgY29uc3QgdnAgPSBjb25zdHJhaW5SYW5nZSh2IC8gMTAwLCAwLCAxKTtcbiAgICBjb25zdCBjID0gdnAgKiBzcDtcbiAgICBjb25zdCB4ID0gYyAqICgxIC0gTWF0aC5hYnMoKChocCAvIDYwKSAlIDIpIC0gMSkpO1xuICAgIGNvbnN0IG0gPSB2cCAtIGM7XG4gICAgbGV0IHJwLCBncCwgYnA7XG4gICAgaWYgKGhwID49IDAgJiYgaHAgPCA2MCkge1xuICAgICAgICBbcnAsIGdwLCBicF0gPSBbYywgeCwgMF07XG4gICAgfVxuICAgIGVsc2UgaWYgKGhwID49IDYwICYmIGhwIDwgMTIwKSB7XG4gICAgICAgIFtycCwgZ3AsIGJwXSA9IFt4LCBjLCAwXTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaHAgPj0gMTIwICYmIGhwIDwgMTgwKSB7XG4gICAgICAgIFtycCwgZ3AsIGJwXSA9IFswLCBjLCB4XTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaHAgPj0gMTgwICYmIGhwIDwgMjQwKSB7XG4gICAgICAgIFtycCwgZ3AsIGJwXSA9IFswLCB4LCBjXTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaHAgPj0gMjQwICYmIGhwIDwgMzAwKSB7XG4gICAgICAgIFtycCwgZ3AsIGJwXSA9IFt4LCAwLCBjXTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIFtycCwgZ3AsIGJwXSA9IFtjLCAwLCB4XTtcbiAgICB9XG4gICAgcmV0dXJuIFsocnAgKyBtKSAqIDI1NSwgKGdwICsgbSkgKiAyNTUsIChicCArIG0pICogMjU1XTtcbn1cbmZ1bmN0aW9uIGhzbFRvSHN2SW50KGgsIHMsIGwpIHtcbiAgICBjb25zdCBzZCA9IGwgKyAocyAqICgxMDAgLSBNYXRoLmFicygyICogbCAtIDEwMCkpKSAvICgyICogMTAwKTtcbiAgICByZXR1cm4gW1xuICAgICAgICBoLFxuICAgICAgICBzZCAhPT0gMCA/IChzICogKDEwMCAtIE1hdGguYWJzKDIgKiBsIC0gMTAwKSkpIC8gc2QgOiAwLFxuICAgICAgICBsICsgKHMgKiAoMTAwIC0gTWF0aC5hYnMoMiAqIGwgLSAxMDApKSkgLyAoMiAqIDEwMCksXG4gICAgXTtcbn1cbmZ1bmN0aW9uIGhzdlRvSHNsSW50KGgsIHMsIHYpIHtcbiAgICBjb25zdCBzZCA9IDEwMCAtIE1hdGguYWJzKCh2ICogKDIwMCAtIHMpKSAvIDEwMCAtIDEwMCk7XG4gICAgcmV0dXJuIFtoLCBzZCAhPT0gMCA/IChzICogdikgLyBzZCA6IDAsICh2ICogKDIwMCAtIHMpKSAvICgyICogMTAwKV07XG59XG5mdW5jdGlvbiByZW1vdmVBbHBoYUNvbXBvbmVudChjb21wcykge1xuICAgIHJldHVybiBbY29tcHNbMF0sIGNvbXBzWzFdLCBjb21wc1syXV07XG59XG5mdW5jdGlvbiBhcHBlbmRBbHBoYUNvbXBvbmVudChjb21wcywgYWxwaGEpIHtcbiAgICByZXR1cm4gW2NvbXBzWzBdLCBjb21wc1sxXSwgY29tcHNbMl0sIGFscGhhXTtcbn1cbmNvbnN0IE1PREVfQ09OVkVSVEVSX01BUCA9IHtcbiAgICBoc2w6IHtcbiAgICAgICAgaHNsOiAoaCwgcywgbCkgPT4gW2gsIHMsIGxdLFxuICAgICAgICBoc3Y6IGhzbFRvSHN2SW50LFxuICAgICAgICByZ2I6IGhzbFRvUmdiSW50LFxuICAgIH0sXG4gICAgaHN2OiB7XG4gICAgICAgIGhzbDogaHN2VG9Ic2xJbnQsXG4gICAgICAgIGhzdjogKGgsIHMsIHYpID0+IFtoLCBzLCB2XSxcbiAgICAgICAgcmdiOiBoc3ZUb1JnYkludCxcbiAgICB9LFxuICAgIHJnYjoge1xuICAgICAgICBoc2w6IHJnYlRvSHNsSW50LFxuICAgICAgICBoc3Y6IHJnYlRvSHN2SW50LFxuICAgICAgICByZ2I6IChyLCBnLCBiKSA9PiBbciwgZywgYl0sXG4gICAgfSxcbn07XG5mdW5jdGlvbiBnZXRDb2xvck1heENvbXBvbmVudHMobW9kZSwgdHlwZSkge1xuICAgIHJldHVybiBbXG4gICAgICAgIHR5cGUgPT09ICdmbG9hdCcgPyAxIDogbW9kZSA9PT0gJ3JnYicgPyAyNTUgOiAzNjAsXG4gICAgICAgIHR5cGUgPT09ICdmbG9hdCcgPyAxIDogbW9kZSA9PT0gJ3JnYicgPyAyNTUgOiAxMDAsXG4gICAgICAgIHR5cGUgPT09ICdmbG9hdCcgPyAxIDogbW9kZSA9PT0gJ3JnYicgPyAyNTUgOiAxMDAsXG4gICAgXTtcbn1cbmZ1bmN0aW9uIGxvb3BIdWVSYW5nZShodWUsIG1heCkge1xuICAgIHJldHVybiBodWUgPT09IG1heCA/IG1heCA6IGxvb3BSYW5nZShodWUsIG1heCk7XG59XG5mdW5jdGlvbiBjb25zdHJhaW5Db2xvckNvbXBvbmVudHMoY29tcG9uZW50cywgbW9kZSwgdHlwZSkge1xuICAgIHZhciBfYTtcbiAgICBjb25zdCBtcyA9IGdldENvbG9yTWF4Q29tcG9uZW50cyhtb2RlLCB0eXBlKTtcbiAgICByZXR1cm4gW1xuICAgICAgICBtb2RlID09PSAncmdiJ1xuICAgICAgICAgICAgPyBjb25zdHJhaW5SYW5nZShjb21wb25lbnRzWzBdLCAwLCBtc1swXSlcbiAgICAgICAgICAgIDogbG9vcEh1ZVJhbmdlKGNvbXBvbmVudHNbMF0sIG1zWzBdKSxcbiAgICAgICAgY29uc3RyYWluUmFuZ2UoY29tcG9uZW50c1sxXSwgMCwgbXNbMV0pLFxuICAgICAgICBjb25zdHJhaW5SYW5nZShjb21wb25lbnRzWzJdLCAwLCBtc1syXSksXG4gICAgICAgIGNvbnN0cmFpblJhbmdlKChfYSA9IGNvbXBvbmVudHNbM10pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IDEsIDAsIDEpLFxuICAgIF07XG59XG5mdW5jdGlvbiBjb252ZXJ0Q29sb3JUeXBlKGNvbXBzLCBtb2RlLCBmcm9tLCB0bykge1xuICAgIGNvbnN0IGZtcyA9IGdldENvbG9yTWF4Q29tcG9uZW50cyhtb2RlLCBmcm9tKTtcbiAgICBjb25zdCB0bXMgPSBnZXRDb2xvck1heENvbXBvbmVudHMobW9kZSwgdG8pO1xuICAgIHJldHVybiBjb21wcy5tYXAoKGMsIGluZGV4KSA9PiAoYyAvIGZtc1tpbmRleF0pICogdG1zW2luZGV4XSk7XG59XG5mdW5jdGlvbiBjb252ZXJ0Q29sb3IoY29tcG9uZW50cywgZnJvbSwgdG8pIHtcbiAgICBjb25zdCBpbnRDb21wcyA9IGNvbnZlcnRDb2xvclR5cGUoY29tcG9uZW50cywgZnJvbS5tb2RlLCBmcm9tLnR5cGUsICdpbnQnKTtcbiAgICBjb25zdCByZXN1bHQgPSBNT0RFX0NPTlZFUlRFUl9NQVBbZnJvbS5tb2RlXVt0by5tb2RlXSguLi5pbnRDb21wcyk7XG4gICAgcmV0dXJuIGNvbnZlcnRDb2xvclR5cGUocmVzdWx0LCB0by5tb2RlLCAnaW50JywgdG8udHlwZSk7XG59XG5cbmNsYXNzIEludENvbG9yIHtcbiAgICBzdGF0aWMgYmxhY2soKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW50Q29sb3IoWzAsIDAsIDBdLCAncmdiJyk7XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKGNvbXBzLCBtb2RlKSB7XG4gICAgICAgIHRoaXMudHlwZSA9ICdpbnQnO1xuICAgICAgICB0aGlzLm1vZGUgPSBtb2RlO1xuICAgICAgICB0aGlzLmNvbXBzXyA9IGNvbnN0cmFpbkNvbG9yQ29tcG9uZW50cyhjb21wcywgbW9kZSwgdGhpcy50eXBlKTtcbiAgICB9XG4gICAgZ2V0Q29tcG9uZW50cyhvcHRfbW9kZSkge1xuICAgICAgICByZXR1cm4gYXBwZW5kQWxwaGFDb21wb25lbnQoY29udmVydENvbG9yKHJlbW92ZUFscGhhQ29tcG9uZW50KHRoaXMuY29tcHNfKSwgeyBtb2RlOiB0aGlzLm1vZGUsIHR5cGU6IHRoaXMudHlwZSB9LCB7IG1vZGU6IG9wdF9tb2RlICE9PSBudWxsICYmIG9wdF9tb2RlICE9PSB2b2lkIDAgPyBvcHRfbW9kZSA6IHRoaXMubW9kZSwgdHlwZTogdGhpcy50eXBlIH0pLCB0aGlzLmNvbXBzX1szXSk7XG4gICAgfVxuICAgIHRvUmdiYU9iamVjdCgpIHtcbiAgICAgICAgY29uc3QgcmdiQ29tcHMgPSB0aGlzLmdldENvbXBvbmVudHMoJ3JnYicpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcjogcmdiQ29tcHNbMF0sXG4gICAgICAgICAgICBnOiByZ2JDb21wc1sxXSxcbiAgICAgICAgICAgIGI6IHJnYkNvbXBzWzJdLFxuICAgICAgICAgICAgYTogcmdiQ29tcHNbM10sXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jb25zdCBjbiRjID0gQ2xhc3NOYW1lKCdjb2xwJyk7XG5jbGFzcyBDb2xvclBpY2tlclZpZXcge1xuICAgIGNvbnN0cnVjdG9yKGRvYywgY29uZmlnKSB7XG4gICAgICAgIHRoaXMuYWxwaGFWaWV3c18gPSBudWxsO1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNuJGMoKSk7XG4gICAgICAgIGNvbmZpZy52aWV3UHJvcHMuYmluZENsYXNzTW9kaWZpZXJzKHRoaXMuZWxlbWVudCk7XG4gICAgICAgIGNvbnN0IGhzdkVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGhzdkVsZW0uY2xhc3NMaXN0LmFkZChjbiRjKCdoc3YnKSk7XG4gICAgICAgIGNvbnN0IHN2RWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgc3ZFbGVtLmNsYXNzTGlzdC5hZGQoY24kYygnc3YnKSk7XG4gICAgICAgIHRoaXMuc3ZQYWxldHRlVmlld18gPSBjb25maWcuc3ZQYWxldHRlVmlldztcbiAgICAgICAgc3ZFbGVtLmFwcGVuZENoaWxkKHRoaXMuc3ZQYWxldHRlVmlld18uZWxlbWVudCk7XG4gICAgICAgIGhzdkVsZW0uYXBwZW5kQ2hpbGQoc3ZFbGVtKTtcbiAgICAgICAgY29uc3QgaEVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGhFbGVtLmNsYXNzTGlzdC5hZGQoY24kYygnaCcpKTtcbiAgICAgICAgdGhpcy5oUGFsZXR0ZVZpZXdfID0gY29uZmlnLmhQYWxldHRlVmlldztcbiAgICAgICAgaEVsZW0uYXBwZW5kQ2hpbGQodGhpcy5oUGFsZXR0ZVZpZXdfLmVsZW1lbnQpO1xuICAgICAgICBoc3ZFbGVtLmFwcGVuZENoaWxkKGhFbGVtKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGhzdkVsZW0pO1xuICAgICAgICBjb25zdCByZ2JFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICByZ2JFbGVtLmNsYXNzTGlzdC5hZGQoY24kYygncmdiJykpO1xuICAgICAgICB0aGlzLnRleHRzVmlld18gPSBjb25maWcudGV4dHNWaWV3O1xuICAgICAgICByZ2JFbGVtLmFwcGVuZENoaWxkKHRoaXMudGV4dHNWaWV3Xy5lbGVtZW50KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHJnYkVsZW0pO1xuICAgICAgICBpZiAoY29uZmlnLmFscGhhVmlld3MpIHtcbiAgICAgICAgICAgIHRoaXMuYWxwaGFWaWV3c18gPSB7XG4gICAgICAgICAgICAgICAgcGFsZXR0ZTogY29uZmlnLmFscGhhVmlld3MucGFsZXR0ZSxcbiAgICAgICAgICAgICAgICB0ZXh0OiBjb25maWcuYWxwaGFWaWV3cy50ZXh0LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IGFFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgYUVsZW0uY2xhc3NMaXN0LmFkZChjbiRjKCdhJykpO1xuICAgICAgICAgICAgY29uc3QgYXBFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgYXBFbGVtLmNsYXNzTGlzdC5hZGQoY24kYygnYXAnKSk7XG4gICAgICAgICAgICBhcEVsZW0uYXBwZW5kQ2hpbGQodGhpcy5hbHBoYVZpZXdzXy5wYWxldHRlLmVsZW1lbnQpO1xuICAgICAgICAgICAgYUVsZW0uYXBwZW5kQ2hpbGQoYXBFbGVtKTtcbiAgICAgICAgICAgIGNvbnN0IGF0RWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGF0RWxlbS5jbGFzc0xpc3QuYWRkKGNuJGMoJ2F0JykpO1xuICAgICAgICAgICAgYXRFbGVtLmFwcGVuZENoaWxkKHRoaXMuYWxwaGFWaWV3c18udGV4dC5lbGVtZW50KTtcbiAgICAgICAgICAgIGFFbGVtLmFwcGVuZENoaWxkKGF0RWxlbSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoYUVsZW0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCBhbGxGb2N1c2FibGVFbGVtZW50cygpIHtcbiAgICAgICAgY29uc3QgZWxlbXMgPSBbXG4gICAgICAgICAgICB0aGlzLnN2UGFsZXR0ZVZpZXdfLmVsZW1lbnQsXG4gICAgICAgICAgICB0aGlzLmhQYWxldHRlVmlld18uZWxlbWVudCxcbiAgICAgICAgICAgIHRoaXMudGV4dHNWaWV3Xy5tb2RlU2VsZWN0RWxlbWVudCxcbiAgICAgICAgICAgIC4uLnRoaXMudGV4dHNWaWV3Xy5pbnB1dFZpZXdzLm1hcCgodikgPT4gdi5pbnB1dEVsZW1lbnQpLFxuICAgICAgICBdO1xuICAgICAgICBpZiAodGhpcy5hbHBoYVZpZXdzXykge1xuICAgICAgICAgICAgZWxlbXMucHVzaCh0aGlzLmFscGhhVmlld3NfLnBhbGV0dGUuZWxlbWVudCwgdGhpcy5hbHBoYVZpZXdzXy50ZXh0LmlucHV0RWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1zO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VDb2xvclR5cGUodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09ICdpbnQnID8gJ2ludCcgOiB2YWx1ZSA9PT0gJ2Zsb2F0JyA/ICdmbG9hdCcgOiB1bmRlZmluZWQ7XG59XG5mdW5jdGlvbiBwYXJzZUNvbG9ySW5wdXRQYXJhbXMocGFyYW1zKSB7XG4gICAgcmV0dXJuIHBhcnNlUmVjb3JkKHBhcmFtcywgKHApID0+ICh7XG4gICAgICAgIGNvbG9yOiBwLm9wdGlvbmFsLm9iamVjdCh7XG4gICAgICAgICAgICBhbHBoYTogcC5vcHRpb25hbC5ib29sZWFuLFxuICAgICAgICAgICAgdHlwZTogcC5vcHRpb25hbC5jdXN0b20ocGFyc2VDb2xvclR5cGUpLFxuICAgICAgICB9KSxcbiAgICAgICAgZXhwYW5kZWQ6IHAub3B0aW9uYWwuYm9vbGVhbixcbiAgICAgICAgcGlja2VyOiBwLm9wdGlvbmFsLmN1c3RvbShwYXJzZVBpY2tlckxheW91dCksXG4gICAgICAgIHJlYWRvbmx5OiBwLm9wdGlvbmFsLmNvbnN0YW50KGZhbHNlKSxcbiAgICB9KSk7XG59XG5mdW5jdGlvbiBnZXRLZXlTY2FsZUZvckNvbG9yKGZvckFscGhhKSB7XG4gICAgcmV0dXJuIGZvckFscGhhID8gMC4xIDogMTtcbn1cbmZ1bmN0aW9uIGV4dHJhY3RDb2xvclR5cGUocGFyYW1zKSB7XG4gICAgdmFyIF9hO1xuICAgIHJldHVybiAoX2EgPSBwYXJhbXMuY29sb3IpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS50eXBlO1xufVxuXG5jbGFzcyBGbG9hdENvbG9yIHtcbiAgICBjb25zdHJ1Y3Rvcihjb21wcywgbW9kZSkge1xuICAgICAgICB0aGlzLnR5cGUgPSAnZmxvYXQnO1xuICAgICAgICB0aGlzLm1vZGUgPSBtb2RlO1xuICAgICAgICB0aGlzLmNvbXBzXyA9IGNvbnN0cmFpbkNvbG9yQ29tcG9uZW50cyhjb21wcywgbW9kZSwgdGhpcy50eXBlKTtcbiAgICB9XG4gICAgZ2V0Q29tcG9uZW50cyhvcHRfbW9kZSkge1xuICAgICAgICByZXR1cm4gYXBwZW5kQWxwaGFDb21wb25lbnQoY29udmVydENvbG9yKHJlbW92ZUFscGhhQ29tcG9uZW50KHRoaXMuY29tcHNfKSwgeyBtb2RlOiB0aGlzLm1vZGUsIHR5cGU6IHRoaXMudHlwZSB9LCB7IG1vZGU6IG9wdF9tb2RlICE9PSBudWxsICYmIG9wdF9tb2RlICE9PSB2b2lkIDAgPyBvcHRfbW9kZSA6IHRoaXMubW9kZSwgdHlwZTogdGhpcy50eXBlIH0pLCB0aGlzLmNvbXBzX1szXSk7XG4gICAgfVxuICAgIHRvUmdiYU9iamVjdCgpIHtcbiAgICAgICAgY29uc3QgcmdiQ29tcHMgPSB0aGlzLmdldENvbXBvbmVudHMoJ3JnYicpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcjogcmdiQ29tcHNbMF0sXG4gICAgICAgICAgICBnOiByZ2JDb21wc1sxXSxcbiAgICAgICAgICAgIGI6IHJnYkNvbXBzWzJdLFxuICAgICAgICAgICAgYTogcmdiQ29tcHNbM10sXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jb25zdCBUWVBFX1RPX0NPTlNUUlVDVE9SX01BUCA9IHtcbiAgICBpbnQ6IChjb21wcywgbW9kZSkgPT4gbmV3IEludENvbG9yKGNvbXBzLCBtb2RlKSxcbiAgICBmbG9hdDogKGNvbXBzLCBtb2RlKSA9PiBuZXcgRmxvYXRDb2xvcihjb21wcywgbW9kZSksXG59O1xuZnVuY3Rpb24gY3JlYXRlQ29sb3IoY29tcHMsIG1vZGUsIHR5cGUpIHtcbiAgICByZXR1cm4gVFlQRV9UT19DT05TVFJVQ1RPUl9NQVBbdHlwZV0oY29tcHMsIG1vZGUpO1xufVxuZnVuY3Rpb24gaXNGbG9hdENvbG9yKGMpIHtcbiAgICByZXR1cm4gYy50eXBlID09PSAnZmxvYXQnO1xufVxuZnVuY3Rpb24gaXNJbnRDb2xvcihjKSB7XG4gICAgcmV0dXJuIGMudHlwZSA9PT0gJ2ludCc7XG59XG5mdW5jdGlvbiBjb252ZXJ0RmxvYXRUb0ludChjZikge1xuICAgIGNvbnN0IGNvbXBzID0gY2YuZ2V0Q29tcG9uZW50cygpO1xuICAgIGNvbnN0IG1zID0gZ2V0Q29sb3JNYXhDb21wb25lbnRzKGNmLm1vZGUsICdpbnQnKTtcbiAgICByZXR1cm4gbmV3IEludENvbG9yKFtcbiAgICAgICAgTWF0aC5yb3VuZChtYXBSYW5nZShjb21wc1swXSwgMCwgMSwgMCwgbXNbMF0pKSxcbiAgICAgICAgTWF0aC5yb3VuZChtYXBSYW5nZShjb21wc1sxXSwgMCwgMSwgMCwgbXNbMV0pKSxcbiAgICAgICAgTWF0aC5yb3VuZChtYXBSYW5nZShjb21wc1syXSwgMCwgMSwgMCwgbXNbMl0pKSxcbiAgICAgICAgY29tcHNbM10sXG4gICAgXSwgY2YubW9kZSk7XG59XG5mdW5jdGlvbiBjb252ZXJ0SW50VG9GbG9hdChjaSkge1xuICAgIGNvbnN0IGNvbXBzID0gY2kuZ2V0Q29tcG9uZW50cygpO1xuICAgIGNvbnN0IG1zID0gZ2V0Q29sb3JNYXhDb21wb25lbnRzKGNpLm1vZGUsICdpbnQnKTtcbiAgICByZXR1cm4gbmV3IEZsb2F0Q29sb3IoW1xuICAgICAgICBtYXBSYW5nZShjb21wc1swXSwgMCwgbXNbMF0sIDAsIDEpLFxuICAgICAgICBtYXBSYW5nZShjb21wc1sxXSwgMCwgbXNbMV0sIDAsIDEpLFxuICAgICAgICBtYXBSYW5nZShjb21wc1syXSwgMCwgbXNbMl0sIDAsIDEpLFxuICAgICAgICBjb21wc1szXSxcbiAgICBdLCBjaS5tb2RlKTtcbn1cbmZ1bmN0aW9uIG1hcENvbG9yVHlwZShjLCB0eXBlKSB7XG4gICAgaWYgKGMudHlwZSA9PT0gdHlwZSkge1xuICAgICAgICByZXR1cm4gYztcbiAgICB9XG4gICAgaWYgKGlzSW50Q29sb3IoYykgJiYgdHlwZSA9PT0gJ2Zsb2F0Jykge1xuICAgICAgICByZXR1cm4gY29udmVydEludFRvRmxvYXQoYyk7XG4gICAgfVxuICAgIGlmIChpc0Zsb2F0Q29sb3IoYykgJiYgdHlwZSA9PT0gJ2ludCcpIHtcbiAgICAgICAgcmV0dXJuIGNvbnZlcnRGbG9hdFRvSW50KGMpO1xuICAgIH1cbiAgICB0aHJvdyBUcEVycm9yLnNob3VsZE5ldmVySGFwcGVuKCk7XG59XG5cbmZ1bmN0aW9uIGVxdWFsc1N0cmluZ0NvbG9yRm9ybWF0KGYxLCBmMikge1xuICAgIHJldHVybiAoZjEuYWxwaGEgPT09IGYyLmFscGhhICYmXG4gICAgICAgIGYxLm1vZGUgPT09IGYyLm1vZGUgJiZcbiAgICAgICAgZjEubm90YXRpb24gPT09IGYyLm5vdGF0aW9uICYmXG4gICAgICAgIGYxLnR5cGUgPT09IGYyLnR5cGUpO1xufVxuZnVuY3Rpb24gcGFyc2VDc3NOdW1iZXJPclBlcmNlbnRhZ2UodGV4dCwgbWF4KSB7XG4gICAgY29uc3QgbSA9IHRleHQubWF0Y2goL14oLispJSQvKTtcbiAgICBpZiAoIW0pIHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKHBhcnNlRmxvYXQodGV4dCksIG1heCk7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLm1pbihwYXJzZUZsb2F0KG1bMV0pICogMC4wMSAqIG1heCwgbWF4KTtcbn1cbmNvbnN0IEFOR0xFX1RPX0RFR19NQVAgPSB7XG4gICAgZGVnOiAoYW5nbGUpID0+IGFuZ2xlLFxuICAgIGdyYWQ6IChhbmdsZSkgPT4gKGFuZ2xlICogMzYwKSAvIDQwMCxcbiAgICByYWQ6IChhbmdsZSkgPT4gKGFuZ2xlICogMzYwKSAvICgyICogTWF0aC5QSSksXG4gICAgdHVybjogKGFuZ2xlKSA9PiBhbmdsZSAqIDM2MCxcbn07XG5mdW5jdGlvbiBwYXJzZUNzc051bWJlck9yQW5nbGUodGV4dCkge1xuICAgIGNvbnN0IG0gPSB0ZXh0Lm1hdGNoKC9eKFswLTkuXSs/KShkZWd8Z3JhZHxyYWR8dHVybikkLyk7XG4gICAgaWYgKCFtKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHRleHQpO1xuICAgIH1cbiAgICBjb25zdCBhbmdsZSA9IHBhcnNlRmxvYXQobVsxXSk7XG4gICAgY29uc3QgdW5pdCA9IG1bMl07XG4gICAgcmV0dXJuIEFOR0xFX1RPX0RFR19NQVBbdW5pdF0oYW5nbGUpO1xufVxuZnVuY3Rpb24gcGFyc2VGdW5jdGlvbmFsUmdiQ29sb3JDb21wb25lbnRzKHRleHQpIHtcbiAgICBjb25zdCBtID0gdGV4dC5tYXRjaCgvXnJnYlxcKFxccyooWzAtOUEtRmEtZi5dKyU/KVxccyosXFxzKihbMC05QS1GYS1mLl0rJT8pXFxzKixcXHMqKFswLTlBLUZhLWYuXSslPylcXHMqXFwpJC8pO1xuICAgIGlmICghbSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgY29tcHMgPSBbXG4gICAgICAgIHBhcnNlQ3NzTnVtYmVyT3JQZXJjZW50YWdlKG1bMV0sIDI1NSksXG4gICAgICAgIHBhcnNlQ3NzTnVtYmVyT3JQZXJjZW50YWdlKG1bMl0sIDI1NSksXG4gICAgICAgIHBhcnNlQ3NzTnVtYmVyT3JQZXJjZW50YWdlKG1bM10sIDI1NSksXG4gICAgXTtcbiAgICBpZiAoaXNOYU4oY29tcHNbMF0pIHx8IGlzTmFOKGNvbXBzWzFdKSB8fCBpc05hTihjb21wc1syXSkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjb21wcztcbn1cbmZ1bmN0aW9uIHBhcnNlRnVuY3Rpb25hbFJnYkNvbG9yKHRleHQpIHtcbiAgICBjb25zdCBjb21wcyA9IHBhcnNlRnVuY3Rpb25hbFJnYkNvbG9yQ29tcG9uZW50cyh0ZXh0KTtcbiAgICByZXR1cm4gY29tcHMgPyBuZXcgSW50Q29sb3IoY29tcHMsICdyZ2InKSA6IG51bGw7XG59XG5mdW5jdGlvbiBwYXJzZUZ1bmN0aW9uYWxSZ2JhQ29sb3JDb21wb25lbnRzKHRleHQpIHtcbiAgICBjb25zdCBtID0gdGV4dC5tYXRjaCgvXnJnYmFcXChcXHMqKFswLTlBLUZhLWYuXSslPylcXHMqLFxccyooWzAtOUEtRmEtZi5dKyU/KVxccyosXFxzKihbMC05QS1GYS1mLl0rJT8pXFxzKixcXHMqKFswLTlBLUZhLWYuXSslPylcXHMqXFwpJC8pO1xuICAgIGlmICghbSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgY29tcHMgPSBbXG4gICAgICAgIHBhcnNlQ3NzTnVtYmVyT3JQZXJjZW50YWdlKG1bMV0sIDI1NSksXG4gICAgICAgIHBhcnNlQ3NzTnVtYmVyT3JQZXJjZW50YWdlKG1bMl0sIDI1NSksXG4gICAgICAgIHBhcnNlQ3NzTnVtYmVyT3JQZXJjZW50YWdlKG1bM10sIDI1NSksXG4gICAgICAgIHBhcnNlQ3NzTnVtYmVyT3JQZXJjZW50YWdlKG1bNF0sIDEpLFxuICAgIF07XG4gICAgaWYgKGlzTmFOKGNvbXBzWzBdKSB8fFxuICAgICAgICBpc05hTihjb21wc1sxXSkgfHxcbiAgICAgICAgaXNOYU4oY29tcHNbMl0pIHx8XG4gICAgICAgIGlzTmFOKGNvbXBzWzNdKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNvbXBzO1xufVxuZnVuY3Rpb24gcGFyc2VGdW5jdGlvbmFsUmdiYUNvbG9yKHRleHQpIHtcbiAgICBjb25zdCBjb21wcyA9IHBhcnNlRnVuY3Rpb25hbFJnYmFDb2xvckNvbXBvbmVudHModGV4dCk7XG4gICAgcmV0dXJuIGNvbXBzID8gbmV3IEludENvbG9yKGNvbXBzLCAncmdiJykgOiBudWxsO1xufVxuZnVuY3Rpb24gcGFyc2VGdW5jdGlvbmFsSHNsQ29sb3JDb21wb25lbnRzKHRleHQpIHtcbiAgICBjb25zdCBtID0gdGV4dC5tYXRjaCgvXmhzbFxcKFxccyooWzAtOUEtRmEtZi5dKyg/OmRlZ3xncmFkfHJhZHx0dXJuKT8pXFxzKixcXHMqKFswLTlBLUZhLWYuXSslPylcXHMqLFxccyooWzAtOUEtRmEtZi5dKyU/KVxccypcXCkkLyk7XG4gICAgaWYgKCFtKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBjb21wcyA9IFtcbiAgICAgICAgcGFyc2VDc3NOdW1iZXJPckFuZ2xlKG1bMV0pLFxuICAgICAgICBwYXJzZUNzc051bWJlck9yUGVyY2VudGFnZShtWzJdLCAxMDApLFxuICAgICAgICBwYXJzZUNzc051bWJlck9yUGVyY2VudGFnZShtWzNdLCAxMDApLFxuICAgIF07XG4gICAgaWYgKGlzTmFOKGNvbXBzWzBdKSB8fCBpc05hTihjb21wc1sxXSkgfHwgaXNOYU4oY29tcHNbMl0pKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY29tcHM7XG59XG5mdW5jdGlvbiBwYXJzZUZ1bmN0aW9uYWxIc2xDb2xvcih0ZXh0KSB7XG4gICAgY29uc3QgY29tcHMgPSBwYXJzZUZ1bmN0aW9uYWxIc2xDb2xvckNvbXBvbmVudHModGV4dCk7XG4gICAgcmV0dXJuIGNvbXBzID8gbmV3IEludENvbG9yKGNvbXBzLCAnaHNsJykgOiBudWxsO1xufVxuZnVuY3Rpb24gcGFyc2VIc2xhQ29sb3JDb21wb25lbnRzKHRleHQpIHtcbiAgICBjb25zdCBtID0gdGV4dC5tYXRjaCgvXmhzbGFcXChcXHMqKFswLTlBLUZhLWYuXSsoPzpkZWd8Z3JhZHxyYWR8dHVybik/KVxccyosXFxzKihbMC05QS1GYS1mLl0rJT8pXFxzKixcXHMqKFswLTlBLUZhLWYuXSslPylcXHMqLFxccyooWzAtOUEtRmEtZi5dKyU/KVxccypcXCkkLyk7XG4gICAgaWYgKCFtKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBjb21wcyA9IFtcbiAgICAgICAgcGFyc2VDc3NOdW1iZXJPckFuZ2xlKG1bMV0pLFxuICAgICAgICBwYXJzZUNzc051bWJlck9yUGVyY2VudGFnZShtWzJdLCAxMDApLFxuICAgICAgICBwYXJzZUNzc051bWJlck9yUGVyY2VudGFnZShtWzNdLCAxMDApLFxuICAgICAgICBwYXJzZUNzc051bWJlck9yUGVyY2VudGFnZShtWzRdLCAxKSxcbiAgICBdO1xuICAgIGlmIChpc05hTihjb21wc1swXSkgfHxcbiAgICAgICAgaXNOYU4oY29tcHNbMV0pIHx8XG4gICAgICAgIGlzTmFOKGNvbXBzWzJdKSB8fFxuICAgICAgICBpc05hTihjb21wc1szXSkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjb21wcztcbn1cbmZ1bmN0aW9uIHBhcnNlRnVuY3Rpb25hbEhzbGFDb2xvcih0ZXh0KSB7XG4gICAgY29uc3QgY29tcHMgPSBwYXJzZUhzbGFDb2xvckNvbXBvbmVudHModGV4dCk7XG4gICAgcmV0dXJuIGNvbXBzID8gbmV3IEludENvbG9yKGNvbXBzLCAnaHNsJykgOiBudWxsO1xufVxuZnVuY3Rpb24gcGFyc2VIZXhSZ2JDb2xvckNvbXBvbmVudHModGV4dCkge1xuICAgIGNvbnN0IG1SZ2IgPSB0ZXh0Lm1hdGNoKC9eIyhbMC05QS1GYS1mXSkoWzAtOUEtRmEtZl0pKFswLTlBLUZhLWZdKSQvKTtcbiAgICBpZiAobVJnYikge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgcGFyc2VJbnQobVJnYlsxXSArIG1SZ2JbMV0sIDE2KSxcbiAgICAgICAgICAgIHBhcnNlSW50KG1SZ2JbMl0gKyBtUmdiWzJdLCAxNiksXG4gICAgICAgICAgICBwYXJzZUludChtUmdiWzNdICsgbVJnYlszXSwgMTYpLFxuICAgICAgICBdO1xuICAgIH1cbiAgICBjb25zdCBtUnJnZ2JiID0gdGV4dC5tYXRjaCgvXig/OiN8MHgpKFswLTlBLUZhLWZdezJ9KShbMC05QS1GYS1mXXsyfSkoWzAtOUEtRmEtZl17Mn0pJC8pO1xuICAgIGlmIChtUnJnZ2JiKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBwYXJzZUludChtUnJnZ2JiWzFdLCAxNiksXG4gICAgICAgICAgICBwYXJzZUludChtUnJnZ2JiWzJdLCAxNiksXG4gICAgICAgICAgICBwYXJzZUludChtUnJnZ2JiWzNdLCAxNiksXG4gICAgICAgIF07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuZnVuY3Rpb24gcGFyc2VIZXhSZ2JDb2xvcih0ZXh0KSB7XG4gICAgY29uc3QgY29tcHMgPSBwYXJzZUhleFJnYkNvbG9yQ29tcG9uZW50cyh0ZXh0KTtcbiAgICByZXR1cm4gY29tcHMgPyBuZXcgSW50Q29sb3IoY29tcHMsICdyZ2InKSA6IG51bGw7XG59XG5mdW5jdGlvbiBwYXJzZUhleFJnYmFDb2xvckNvbXBvbmVudHModGV4dCkge1xuICAgIGNvbnN0IG1SZ2IgPSB0ZXh0Lm1hdGNoKC9eIyhbMC05QS1GYS1mXSkoWzAtOUEtRmEtZl0pKFswLTlBLUZhLWZdKShbMC05QS1GYS1mXSkkLyk7XG4gICAgaWYgKG1SZ2IpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHBhcnNlSW50KG1SZ2JbMV0gKyBtUmdiWzFdLCAxNiksXG4gICAgICAgICAgICBwYXJzZUludChtUmdiWzJdICsgbVJnYlsyXSwgMTYpLFxuICAgICAgICAgICAgcGFyc2VJbnQobVJnYlszXSArIG1SZ2JbM10sIDE2KSxcbiAgICAgICAgICAgIG1hcFJhbmdlKHBhcnNlSW50KG1SZ2JbNF0gKyBtUmdiWzRdLCAxNiksIDAsIDI1NSwgMCwgMSksXG4gICAgICAgIF07XG4gICAgfVxuICAgIGNvbnN0IG1ScmdnYmIgPSB0ZXh0Lm1hdGNoKC9eKD86I3wweCk/KFswLTlBLUZhLWZdezJ9KShbMC05QS1GYS1mXXsyfSkoWzAtOUEtRmEtZl17Mn0pKFswLTlBLUZhLWZdezJ9KSQvKTtcbiAgICBpZiAobVJyZ2diYikge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgcGFyc2VJbnQobVJyZ2diYlsxXSwgMTYpLFxuICAgICAgICAgICAgcGFyc2VJbnQobVJyZ2diYlsyXSwgMTYpLFxuICAgICAgICAgICAgcGFyc2VJbnQobVJyZ2diYlszXSwgMTYpLFxuICAgICAgICAgICAgbWFwUmFuZ2UocGFyc2VJbnQobVJyZ2diYls0XSwgMTYpLCAwLCAyNTUsIDAsIDEpLFxuICAgICAgICBdO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cbmZ1bmN0aW9uIHBhcnNlSGV4UmdiYUNvbG9yKHRleHQpIHtcbiAgICBjb25zdCBjb21wcyA9IHBhcnNlSGV4UmdiYUNvbG9yQ29tcG9uZW50cyh0ZXh0KTtcbiAgICByZXR1cm4gY29tcHMgPyBuZXcgSW50Q29sb3IoY29tcHMsICdyZ2InKSA6IG51bGw7XG59XG5mdW5jdGlvbiBwYXJzZU9iamVjdFJnYkNvbG9yQ29tcG9uZW50cyh0ZXh0KSB7XG4gICAgY29uc3QgbSA9IHRleHQubWF0Y2goL15cXHtcXHMqclxccyo6XFxzKihbMC05QS1GYS1mLl0rJT8pXFxzKixcXHMqZ1xccyo6XFxzKihbMC05QS1GYS1mLl0rJT8pXFxzKixcXHMqYlxccyo6XFxzKihbMC05QS1GYS1mLl0rJT8pXFxzKlxcfSQvKTtcbiAgICBpZiAoIW0pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGNvbXBzID0gW1xuICAgICAgICBwYXJzZUZsb2F0KG1bMV0pLFxuICAgICAgICBwYXJzZUZsb2F0KG1bMl0pLFxuICAgICAgICBwYXJzZUZsb2F0KG1bM10pLFxuICAgIF07XG4gICAgaWYgKGlzTmFOKGNvbXBzWzBdKSB8fCBpc05hTihjb21wc1sxXSkgfHwgaXNOYU4oY29tcHNbMl0pKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY29tcHM7XG59XG5mdW5jdGlvbiBjcmVhdGVPYmplY3RSZ2JDb2xvclBhcnNlcih0eXBlKSB7XG4gICAgcmV0dXJuICh0ZXh0KSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbXBzID0gcGFyc2VPYmplY3RSZ2JDb2xvckNvbXBvbmVudHModGV4dCk7XG4gICAgICAgIHJldHVybiBjb21wcyA/IGNyZWF0ZUNvbG9yKGNvbXBzLCAncmdiJywgdHlwZSkgOiBudWxsO1xuICAgIH07XG59XG5mdW5jdGlvbiBwYXJzZU9iamVjdFJnYmFDb2xvckNvbXBvbmVudHModGV4dCkge1xuICAgIGNvbnN0IG0gPSB0ZXh0Lm1hdGNoKC9eXFx7XFxzKnJcXHMqOlxccyooWzAtOUEtRmEtZi5dKyU/KVxccyosXFxzKmdcXHMqOlxccyooWzAtOUEtRmEtZi5dKyU/KVxccyosXFxzKmJcXHMqOlxccyooWzAtOUEtRmEtZi5dKyU/KVxccyosXFxzKmFcXHMqOlxccyooWzAtOUEtRmEtZi5dKyU/KVxccypcXH0kLyk7XG4gICAgaWYgKCFtKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBjb21wcyA9IFtcbiAgICAgICAgcGFyc2VGbG9hdChtWzFdKSxcbiAgICAgICAgcGFyc2VGbG9hdChtWzJdKSxcbiAgICAgICAgcGFyc2VGbG9hdChtWzNdKSxcbiAgICAgICAgcGFyc2VGbG9hdChtWzRdKSxcbiAgICBdO1xuICAgIGlmIChpc05hTihjb21wc1swXSkgfHxcbiAgICAgICAgaXNOYU4oY29tcHNbMV0pIHx8XG4gICAgICAgIGlzTmFOKGNvbXBzWzJdKSB8fFxuICAgICAgICBpc05hTihjb21wc1szXSkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjb21wcztcbn1cbmZ1bmN0aW9uIGNyZWF0ZU9iamVjdFJnYmFDb2xvclBhcnNlcih0eXBlKSB7XG4gICAgcmV0dXJuICh0ZXh0KSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbXBzID0gcGFyc2VPYmplY3RSZ2JhQ29sb3JDb21wb25lbnRzKHRleHQpO1xuICAgICAgICByZXR1cm4gY29tcHMgPyBjcmVhdGVDb2xvcihjb21wcywgJ3JnYicsIHR5cGUpIDogbnVsbDtcbiAgICB9O1xufVxuY29uc3QgUEFSU0VSX0FORF9SRVNVTFQgPSBbXG4gICAge1xuICAgICAgICBwYXJzZXI6IHBhcnNlSGV4UmdiQ29sb3JDb21wb25lbnRzLFxuICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICAgIGFscGhhOiBmYWxzZSxcbiAgICAgICAgICAgIG1vZGU6ICdyZ2InLFxuICAgICAgICAgICAgbm90YXRpb246ICdoZXgnLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgICBwYXJzZXI6IHBhcnNlSGV4UmdiYUNvbG9yQ29tcG9uZW50cyxcbiAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgICBhbHBoYTogdHJ1ZSxcbiAgICAgICAgICAgIG1vZGU6ICdyZ2InLFxuICAgICAgICAgICAgbm90YXRpb246ICdoZXgnLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgICBwYXJzZXI6IHBhcnNlRnVuY3Rpb25hbFJnYkNvbG9yQ29tcG9uZW50cyxcbiAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgICBhbHBoYTogZmFsc2UsXG4gICAgICAgICAgICBtb2RlOiAncmdiJyxcbiAgICAgICAgICAgIG5vdGF0aW9uOiAnZnVuYycsXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHBhcnNlcjogcGFyc2VGdW5jdGlvbmFsUmdiYUNvbG9yQ29tcG9uZW50cyxcbiAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgICBhbHBoYTogdHJ1ZSxcbiAgICAgICAgICAgIG1vZGU6ICdyZ2InLFxuICAgICAgICAgICAgbm90YXRpb246ICdmdW5jJyxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgcGFyc2VyOiBwYXJzZUZ1bmN0aW9uYWxIc2xDb2xvckNvbXBvbmVudHMsXG4gICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgICAgYWxwaGE6IGZhbHNlLFxuICAgICAgICAgICAgbW9kZTogJ2hzbCcsXG4gICAgICAgICAgICBub3RhdGlvbjogJ2Z1bmMnLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgICBwYXJzZXI6IHBhcnNlSHNsYUNvbG9yQ29tcG9uZW50cyxcbiAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgICBhbHBoYTogdHJ1ZSxcbiAgICAgICAgICAgIG1vZGU6ICdoc2wnLFxuICAgICAgICAgICAgbm90YXRpb246ICdmdW5jJyxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgcGFyc2VyOiBwYXJzZU9iamVjdFJnYkNvbG9yQ29tcG9uZW50cyxcbiAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgICBhbHBoYTogZmFsc2UsXG4gICAgICAgICAgICBtb2RlOiAncmdiJyxcbiAgICAgICAgICAgIG5vdGF0aW9uOiAnb2JqZWN0JyxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgcGFyc2VyOiBwYXJzZU9iamVjdFJnYmFDb2xvckNvbXBvbmVudHMsXG4gICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgICAgYWxwaGE6IHRydWUsXG4gICAgICAgICAgICBtb2RlOiAncmdiJyxcbiAgICAgICAgICAgIG5vdGF0aW9uOiAnb2JqZWN0JyxcbiAgICAgICAgfSxcbiAgICB9LFxuXTtcbmZ1bmN0aW9uIGRldGVjdFN0cmluZ0NvbG9yKHRleHQpIHtcbiAgICByZXR1cm4gUEFSU0VSX0FORF9SRVNVTFQucmVkdWNlKChwcmV2LCB7IHBhcnNlciwgcmVzdWx0OiBkZXRlY3Rpb24gfSkgPT4ge1xuICAgICAgICBpZiAocHJldikge1xuICAgICAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcnNlcih0ZXh0KSA/IGRldGVjdGlvbiA6IG51bGw7XG4gICAgfSwgbnVsbCk7XG59XG5mdW5jdGlvbiBkZXRlY3RTdHJpbmdDb2xvckZvcm1hdCh0ZXh0LCB0eXBlID0gJ2ludCcpIHtcbiAgICBjb25zdCByID0gZGV0ZWN0U3RyaW5nQ29sb3IodGV4dCk7XG4gICAgaWYgKCFyKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoci5ub3RhdGlvbiA9PT0gJ2hleCcgJiYgdHlwZSAhPT0gJ2Zsb2F0Jykge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCByKSwgeyB0eXBlOiAnaW50JyB9KTtcbiAgICB9XG4gICAgaWYgKHIubm90YXRpb24gPT09ICdmdW5jJykge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCByKSwgeyB0eXBlOiB0eXBlIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUNvbG9yU3RyaW5nUGFyc2VyKHR5cGUpIHtcbiAgICBjb25zdCBwYXJzZXJzID0gW1xuICAgICAgICBwYXJzZUhleFJnYkNvbG9yLFxuICAgICAgICBwYXJzZUhleFJnYmFDb2xvcixcbiAgICAgICAgcGFyc2VGdW5jdGlvbmFsUmdiQ29sb3IsXG4gICAgICAgIHBhcnNlRnVuY3Rpb25hbFJnYmFDb2xvcixcbiAgICAgICAgcGFyc2VGdW5jdGlvbmFsSHNsQ29sb3IsXG4gICAgICAgIHBhcnNlRnVuY3Rpb25hbEhzbGFDb2xvcixcbiAgICBdO1xuICAgIGlmICh0eXBlID09PSAnaW50Jykge1xuICAgICAgICBwYXJzZXJzLnB1c2goY3JlYXRlT2JqZWN0UmdiQ29sb3JQYXJzZXIoJ2ludCcpLCBjcmVhdGVPYmplY3RSZ2JhQ29sb3JQYXJzZXIoJ2ludCcpKTtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT09ICdmbG9hdCcpIHtcbiAgICAgICAgcGFyc2Vycy5wdXNoKGNyZWF0ZU9iamVjdFJnYkNvbG9yUGFyc2VyKCdmbG9hdCcpLCBjcmVhdGVPYmplY3RSZ2JhQ29sb3JQYXJzZXIoJ2Zsb2F0JykpO1xuICAgIH1cbiAgICBjb25zdCBwYXJzZXIgPSBjb21wb3NlUGFyc2VycyhwYXJzZXJzKTtcbiAgICByZXR1cm4gKHRleHQpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VyKHRleHQpO1xuICAgICAgICByZXR1cm4gcmVzdWx0ID8gbWFwQ29sb3JUeXBlKHJlc3VsdCwgdHlwZSkgOiBudWxsO1xuICAgIH07XG59XG5mdW5jdGlvbiByZWFkSW50Q29sb3JTdHJpbmcodmFsdWUpIHtcbiAgICBjb25zdCBwYXJzZXIgPSBjcmVhdGVDb2xvclN0cmluZ1BhcnNlcignaW50Jyk7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIEludENvbG9yLmJsYWNrKCk7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlcih2YWx1ZSk7XG4gICAgcmV0dXJuIHJlc3VsdCAhPT0gbnVsbCAmJiByZXN1bHQgIT09IHZvaWQgMCA/IHJlc3VsdCA6IEludENvbG9yLmJsYWNrKCk7XG59XG5mdW5jdGlvbiB6ZXJvZmlsbChjb21wKSB7XG4gICAgY29uc3QgaGV4ID0gY29uc3RyYWluUmFuZ2UoTWF0aC5mbG9vcihjb21wKSwgMCwgMjU1KS50b1N0cmluZygxNik7XG4gICAgcmV0dXJuIGhleC5sZW5ndGggPT09IDEgPyBgMCR7aGV4fWAgOiBoZXg7XG59XG5mdW5jdGlvbiBjb2xvclRvSGV4UmdiU3RyaW5nKHZhbHVlLCBwcmVmaXggPSAnIycpIHtcbiAgICBjb25zdCBoZXhlcyA9IHJlbW92ZUFscGhhQ29tcG9uZW50KHZhbHVlLmdldENvbXBvbmVudHMoJ3JnYicpKVxuICAgICAgICAubWFwKHplcm9maWxsKVxuICAgICAgICAuam9pbignJyk7XG4gICAgcmV0dXJuIGAke3ByZWZpeH0ke2hleGVzfWA7XG59XG5mdW5jdGlvbiBjb2xvclRvSGV4UmdiYVN0cmluZyh2YWx1ZSwgcHJlZml4ID0gJyMnKSB7XG4gICAgY29uc3QgcmdiYUNvbXBzID0gdmFsdWUuZ2V0Q29tcG9uZW50cygncmdiJyk7XG4gICAgY29uc3QgaGV4ZXMgPSBbcmdiYUNvbXBzWzBdLCByZ2JhQ29tcHNbMV0sIHJnYmFDb21wc1syXSwgcmdiYUNvbXBzWzNdICogMjU1XVxuICAgICAgICAubWFwKHplcm9maWxsKVxuICAgICAgICAuam9pbignJyk7XG4gICAgcmV0dXJuIGAke3ByZWZpeH0ke2hleGVzfWA7XG59XG5mdW5jdGlvbiBjb2xvclRvRnVuY3Rpb25hbFJnYlN0cmluZyh2YWx1ZSkge1xuICAgIGNvbnN0IGZvcm1hdHRlciA9IGNyZWF0ZU51bWJlckZvcm1hdHRlcigwKTtcbiAgICBjb25zdCBjaSA9IG1hcENvbG9yVHlwZSh2YWx1ZSwgJ2ludCcpO1xuICAgIGNvbnN0IGNvbXBzID0gcmVtb3ZlQWxwaGFDb21wb25lbnQoY2kuZ2V0Q29tcG9uZW50cygncmdiJykpLm1hcCgoY29tcCkgPT4gZm9ybWF0dGVyKGNvbXApKTtcbiAgICByZXR1cm4gYHJnYigke2NvbXBzLmpvaW4oJywgJyl9KWA7XG59XG5mdW5jdGlvbiBjb2xvclRvRnVuY3Rpb25hbFJnYmFTdHJpbmcodmFsdWUpIHtcbiAgICBjb25zdCBhRm9ybWF0dGVyID0gY3JlYXRlTnVtYmVyRm9ybWF0dGVyKDIpO1xuICAgIGNvbnN0IHJnYkZvcm1hdHRlciA9IGNyZWF0ZU51bWJlckZvcm1hdHRlcigwKTtcbiAgICBjb25zdCBjaSA9IG1hcENvbG9yVHlwZSh2YWx1ZSwgJ2ludCcpO1xuICAgIGNvbnN0IGNvbXBzID0gY2kuZ2V0Q29tcG9uZW50cygncmdiJykubWFwKChjb21wLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBmb3JtYXR0ZXIgPSBpbmRleCA9PT0gMyA/IGFGb3JtYXR0ZXIgOiByZ2JGb3JtYXR0ZXI7XG4gICAgICAgIHJldHVybiBmb3JtYXR0ZXIoY29tcCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGByZ2JhKCR7Y29tcHMuam9pbignLCAnKX0pYDtcbn1cbmZ1bmN0aW9uIGNvbG9yVG9GdW5jdGlvbmFsSHNsU3RyaW5nKHZhbHVlKSB7XG4gICAgY29uc3QgZm9ybWF0dGVycyA9IFtcbiAgICAgICAgY3JlYXRlTnVtYmVyRm9ybWF0dGVyKDApLFxuICAgICAgICBmb3JtYXRQZXJjZW50YWdlLFxuICAgICAgICBmb3JtYXRQZXJjZW50YWdlLFxuICAgIF07XG4gICAgY29uc3QgY2kgPSBtYXBDb2xvclR5cGUodmFsdWUsICdpbnQnKTtcbiAgICBjb25zdCBjb21wcyA9IHJlbW92ZUFscGhhQ29tcG9uZW50KGNpLmdldENvbXBvbmVudHMoJ2hzbCcpKS5tYXAoKGNvbXAsIGluZGV4KSA9PiBmb3JtYXR0ZXJzW2luZGV4XShjb21wKSk7XG4gICAgcmV0dXJuIGBoc2woJHtjb21wcy5qb2luKCcsICcpfSlgO1xufVxuZnVuY3Rpb24gY29sb3JUb0Z1bmN0aW9uYWxIc2xhU3RyaW5nKHZhbHVlKSB7XG4gICAgY29uc3QgZm9ybWF0dGVycyA9IFtcbiAgICAgICAgY3JlYXRlTnVtYmVyRm9ybWF0dGVyKDApLFxuICAgICAgICBmb3JtYXRQZXJjZW50YWdlLFxuICAgICAgICBmb3JtYXRQZXJjZW50YWdlLFxuICAgICAgICBjcmVhdGVOdW1iZXJGb3JtYXR0ZXIoMiksXG4gICAgXTtcbiAgICBjb25zdCBjaSA9IG1hcENvbG9yVHlwZSh2YWx1ZSwgJ2ludCcpO1xuICAgIGNvbnN0IGNvbXBzID0gY2lcbiAgICAgICAgLmdldENvbXBvbmVudHMoJ2hzbCcpXG4gICAgICAgIC5tYXAoKGNvbXAsIGluZGV4KSA9PiBmb3JtYXR0ZXJzW2luZGV4XShjb21wKSk7XG4gICAgcmV0dXJuIGBoc2xhKCR7Y29tcHMuam9pbignLCAnKX0pYDtcbn1cbmZ1bmN0aW9uIGNvbG9yVG9PYmplY3RSZ2JTdHJpbmcodmFsdWUsIHR5cGUpIHtcbiAgICBjb25zdCBmb3JtYXR0ZXIgPSBjcmVhdGVOdW1iZXJGb3JtYXR0ZXIodHlwZSA9PT0gJ2Zsb2F0JyA/IDIgOiAwKTtcbiAgICBjb25zdCBuYW1lcyA9IFsncicsICdnJywgJ2InXTtcbiAgICBjb25zdCBjYyA9IG1hcENvbG9yVHlwZSh2YWx1ZSwgdHlwZSk7XG4gICAgY29uc3QgY29tcHMgPSByZW1vdmVBbHBoYUNvbXBvbmVudChjYy5nZXRDb21wb25lbnRzKCdyZ2InKSkubWFwKChjb21wLCBpbmRleCkgPT4gYCR7bmFtZXNbaW5kZXhdfTogJHtmb3JtYXR0ZXIoY29tcCl9YCk7XG4gICAgcmV0dXJuIGB7JHtjb21wcy5qb2luKCcsICcpfX1gO1xufVxuZnVuY3Rpb24gY3JlYXRlT2JqZWN0UmdiQ29sb3JGb3JtYXR0ZXIodHlwZSkge1xuICAgIHJldHVybiAodmFsdWUpID0+IGNvbG9yVG9PYmplY3RSZ2JTdHJpbmcodmFsdWUsIHR5cGUpO1xufVxuZnVuY3Rpb24gY29sb3JUb09iamVjdFJnYmFTdHJpbmcodmFsdWUsIHR5cGUpIHtcbiAgICBjb25zdCBhRm9ybWF0dGVyID0gY3JlYXRlTnVtYmVyRm9ybWF0dGVyKDIpO1xuICAgIGNvbnN0IHJnYkZvcm1hdHRlciA9IGNyZWF0ZU51bWJlckZvcm1hdHRlcih0eXBlID09PSAnZmxvYXQnID8gMiA6IDApO1xuICAgIGNvbnN0IG5hbWVzID0gWydyJywgJ2cnLCAnYicsICdhJ107XG4gICAgY29uc3QgY2MgPSBtYXBDb2xvclR5cGUodmFsdWUsIHR5cGUpO1xuICAgIGNvbnN0IGNvbXBzID0gY2MuZ2V0Q29tcG9uZW50cygncmdiJykubWFwKChjb21wLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBmb3JtYXR0ZXIgPSBpbmRleCA9PT0gMyA/IGFGb3JtYXR0ZXIgOiByZ2JGb3JtYXR0ZXI7XG4gICAgICAgIHJldHVybiBgJHtuYW1lc1tpbmRleF19OiAke2Zvcm1hdHRlcihjb21wKX1gO1xuICAgIH0pO1xuICAgIHJldHVybiBgeyR7Y29tcHMuam9pbignLCAnKX19YDtcbn1cbmZ1bmN0aW9uIGNyZWF0ZU9iamVjdFJnYmFDb2xvckZvcm1hdHRlcih0eXBlKSB7XG4gICAgcmV0dXJuICh2YWx1ZSkgPT4gY29sb3JUb09iamVjdFJnYmFTdHJpbmcodmFsdWUsIHR5cGUpO1xufVxuY29uc3QgRk9STUFUX0FORF9TVFJJTkdJRklFUlMgPSBbXG4gICAge1xuICAgICAgICBmb3JtYXQ6IHtcbiAgICAgICAgICAgIGFscGhhOiBmYWxzZSxcbiAgICAgICAgICAgIG1vZGU6ICdyZ2InLFxuICAgICAgICAgICAgbm90YXRpb246ICdoZXgnLFxuICAgICAgICAgICAgdHlwZTogJ2ludCcsXG4gICAgICAgIH0sXG4gICAgICAgIHN0cmluZ2lmaWVyOiBjb2xvclRvSGV4UmdiU3RyaW5nLFxuICAgIH0sXG4gICAge1xuICAgICAgICBmb3JtYXQ6IHtcbiAgICAgICAgICAgIGFscGhhOiB0cnVlLFxuICAgICAgICAgICAgbW9kZTogJ3JnYicsXG4gICAgICAgICAgICBub3RhdGlvbjogJ2hleCcsXG4gICAgICAgICAgICB0eXBlOiAnaW50JyxcbiAgICAgICAgfSxcbiAgICAgICAgc3RyaW5naWZpZXI6IGNvbG9yVG9IZXhSZ2JhU3RyaW5nLFxuICAgIH0sXG4gICAge1xuICAgICAgICBmb3JtYXQ6IHtcbiAgICAgICAgICAgIGFscGhhOiBmYWxzZSxcbiAgICAgICAgICAgIG1vZGU6ICdyZ2InLFxuICAgICAgICAgICAgbm90YXRpb246ICdmdW5jJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbnQnLFxuICAgICAgICB9LFxuICAgICAgICBzdHJpbmdpZmllcjogY29sb3JUb0Z1bmN0aW9uYWxSZ2JTdHJpbmcsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGZvcm1hdDoge1xuICAgICAgICAgICAgYWxwaGE6IHRydWUsXG4gICAgICAgICAgICBtb2RlOiAncmdiJyxcbiAgICAgICAgICAgIG5vdGF0aW9uOiAnZnVuYycsXG4gICAgICAgICAgICB0eXBlOiAnaW50JyxcbiAgICAgICAgfSxcbiAgICAgICAgc3RyaW5naWZpZXI6IGNvbG9yVG9GdW5jdGlvbmFsUmdiYVN0cmluZyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgZm9ybWF0OiB7XG4gICAgICAgICAgICBhbHBoYTogZmFsc2UsXG4gICAgICAgICAgICBtb2RlOiAnaHNsJyxcbiAgICAgICAgICAgIG5vdGF0aW9uOiAnZnVuYycsXG4gICAgICAgICAgICB0eXBlOiAnaW50JyxcbiAgICAgICAgfSxcbiAgICAgICAgc3RyaW5naWZpZXI6IGNvbG9yVG9GdW5jdGlvbmFsSHNsU3RyaW5nLFxuICAgIH0sXG4gICAge1xuICAgICAgICBmb3JtYXQ6IHtcbiAgICAgICAgICAgIGFscGhhOiB0cnVlLFxuICAgICAgICAgICAgbW9kZTogJ2hzbCcsXG4gICAgICAgICAgICBub3RhdGlvbjogJ2Z1bmMnLFxuICAgICAgICAgICAgdHlwZTogJ2ludCcsXG4gICAgICAgIH0sXG4gICAgICAgIHN0cmluZ2lmaWVyOiBjb2xvclRvRnVuY3Rpb25hbEhzbGFTdHJpbmcsXG4gICAgfSxcbiAgICAuLi5bJ2ludCcsICdmbG9hdCddLnJlZHVjZSgocHJldiwgdHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgLi4ucHJldixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmb3JtYXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgYWxwaGE6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBtb2RlOiAncmdiJyxcbiAgICAgICAgICAgICAgICAgICAgbm90YXRpb246ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3RyaW5naWZpZXI6IGNyZWF0ZU9iamVjdFJnYkNvbG9yRm9ybWF0dGVyKHR5cGUpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmb3JtYXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgYWxwaGE6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG1vZGU6ICdyZ2InLFxuICAgICAgICAgICAgICAgICAgICBub3RhdGlvbjogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdHJpbmdpZmllcjogY3JlYXRlT2JqZWN0UmdiYUNvbG9yRm9ybWF0dGVyKHR5cGUpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXTtcbiAgICB9LCBbXSksXG5dO1xuZnVuY3Rpb24gZmluZENvbG9yU3RyaW5naWZpZXIoZm9ybWF0KSB7XG4gICAgcmV0dXJuIEZPUk1BVF9BTkRfU1RSSU5HSUZJRVJTLnJlZHVjZSgocHJldiwgZmFzKSA9PiB7XG4gICAgICAgIGlmIChwcmV2KSB7XG4gICAgICAgICAgICByZXR1cm4gcHJldjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXF1YWxzU3RyaW5nQ29sb3JGb3JtYXQoZmFzLmZvcm1hdCwgZm9ybWF0KVxuICAgICAgICAgICAgPyBmYXMuc3RyaW5naWZpZXJcbiAgICAgICAgICAgIDogbnVsbDtcbiAgICB9LCBudWxsKTtcbn1cblxuY29uc3QgY24kYiA9IENsYXNzTmFtZSgnYXBsJyk7XG5jbGFzcyBBUGFsZXR0ZVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKGRvYywgY29uZmlnKSB7XG4gICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZV8gPSB0aGlzLm9uVmFsdWVDaGFuZ2VfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMudmFsdWUgPSBjb25maWcudmFsdWU7XG4gICAgICAgIHRoaXMudmFsdWUuZW1pdHRlci5vbignY2hhbmdlJywgdGhpcy5vblZhbHVlQ2hhbmdlXyk7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoY24kYigpKTtcbiAgICAgICAgY29uZmlnLnZpZXdQcm9wcy5iaW5kQ2xhc3NNb2RpZmllcnModGhpcy5lbGVtZW50KTtcbiAgICAgICAgY29uZmlnLnZpZXdQcm9wcy5iaW5kVGFiSW5kZXgodGhpcy5lbGVtZW50KTtcbiAgICAgICAgY29uc3QgYmFyRWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgYmFyRWxlbS5jbGFzc0xpc3QuYWRkKGNuJGIoJ2InKSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChiYXJFbGVtKTtcbiAgICAgICAgY29uc3QgY29sb3JFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjb2xvckVsZW0uY2xhc3NMaXN0LmFkZChjbiRiKCdjJykpO1xuICAgICAgICBiYXJFbGVtLmFwcGVuZENoaWxkKGNvbG9yRWxlbSk7XG4gICAgICAgIHRoaXMuY29sb3JFbGVtXyA9IGNvbG9yRWxlbTtcbiAgICAgICAgY29uc3QgbWFya2VyRWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbWFya2VyRWxlbS5jbGFzc0xpc3QuYWRkKGNuJGIoJ20nKSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChtYXJrZXJFbGVtKTtcbiAgICAgICAgdGhpcy5tYXJrZXJFbGVtXyA9IG1hcmtlckVsZW07XG4gICAgICAgIGNvbnN0IHByZXZpZXdFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBwcmV2aWV3RWxlbS5jbGFzc0xpc3QuYWRkKGNuJGIoJ3AnKSk7XG4gICAgICAgIHRoaXMubWFya2VyRWxlbV8uYXBwZW5kQ2hpbGQocHJldmlld0VsZW0pO1xuICAgICAgICB0aGlzLnByZXZpZXdFbGVtXyA9IHByZXZpZXdFbGVtO1xuICAgICAgICB0aGlzLnVwZGF0ZV8oKTtcbiAgICB9XG4gICAgdXBkYXRlXygpIHtcbiAgICAgICAgY29uc3QgYyA9IHRoaXMudmFsdWUucmF3VmFsdWU7XG4gICAgICAgIGNvbnN0IHJnYmFDb21wcyA9IGMuZ2V0Q29tcG9uZW50cygncmdiJyk7XG4gICAgICAgIGNvbnN0IGxlZnRDb2xvciA9IG5ldyBJbnRDb2xvcihbcmdiYUNvbXBzWzBdLCByZ2JhQ29tcHNbMV0sIHJnYmFDb21wc1syXSwgMF0sICdyZ2InKTtcbiAgICAgICAgY29uc3QgcmlnaHRDb2xvciA9IG5ldyBJbnRDb2xvcihbcmdiYUNvbXBzWzBdLCByZ2JhQ29tcHNbMV0sIHJnYmFDb21wc1syXSwgMjU1XSwgJ3JnYicpO1xuICAgICAgICBjb25zdCBncmFkaWVudENvbXBzID0gW1xuICAgICAgICAgICAgJ3RvIHJpZ2h0JyxcbiAgICAgICAgICAgIGNvbG9yVG9GdW5jdGlvbmFsUmdiYVN0cmluZyhsZWZ0Q29sb3IpLFxuICAgICAgICAgICAgY29sb3JUb0Z1bmN0aW9uYWxSZ2JhU3RyaW5nKHJpZ2h0Q29sb3IpLFxuICAgICAgICBdO1xuICAgICAgICB0aGlzLmNvbG9yRWxlbV8uc3R5bGUuYmFja2dyb3VuZCA9IGBsaW5lYXItZ3JhZGllbnQoJHtncmFkaWVudENvbXBzLmpvaW4oJywnKX0pYDtcbiAgICAgICAgdGhpcy5wcmV2aWV3RWxlbV8uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3JUb0Z1bmN0aW9uYWxSZ2JhU3RyaW5nKGMpO1xuICAgICAgICBjb25zdCBsZWZ0ID0gbWFwUmFuZ2UocmdiYUNvbXBzWzNdLCAwLCAxLCAwLCAxMDApO1xuICAgICAgICB0aGlzLm1hcmtlckVsZW1fLnN0eWxlLmxlZnQgPSBgJHtsZWZ0fSVgO1xuICAgIH1cbiAgICBvblZhbHVlQ2hhbmdlXygpIHtcbiAgICAgICAgdGhpcy51cGRhdGVfKCk7XG4gICAgfVxufVxuXG5jbGFzcyBBUGFsZXR0ZUNvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKGRvYywgY29uZmlnKSB7XG4gICAgICAgIHRoaXMub25LZXlEb3duXyA9IHRoaXMub25LZXlEb3duXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uS2V5VXBfID0gdGhpcy5vbktleVVwXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uUG9pbnRlckRvd25fID0gdGhpcy5vblBvaW50ZXJEb3duXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uUG9pbnRlck1vdmVfID0gdGhpcy5vblBvaW50ZXJNb3ZlXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uUG9pbnRlclVwXyA9IHRoaXMub25Qb2ludGVyVXBfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMudmFsdWUgPSBjb25maWcudmFsdWU7XG4gICAgICAgIHRoaXMudmlld1Byb3BzID0gY29uZmlnLnZpZXdQcm9wcztcbiAgICAgICAgdGhpcy52aWV3ID0gbmV3IEFQYWxldHRlVmlldyhkb2MsIHtcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgICAgICAgdmlld1Byb3BzOiB0aGlzLnZpZXdQcm9wcyxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucHRIYW5kbGVyXyA9IG5ldyBQb2ludGVySGFuZGxlcih0aGlzLnZpZXcuZWxlbWVudCk7XG4gICAgICAgIHRoaXMucHRIYW5kbGVyXy5lbWl0dGVyLm9uKCdkb3duJywgdGhpcy5vblBvaW50ZXJEb3duXyk7XG4gICAgICAgIHRoaXMucHRIYW5kbGVyXy5lbWl0dGVyLm9uKCdtb3ZlJywgdGhpcy5vblBvaW50ZXJNb3ZlXyk7XG4gICAgICAgIHRoaXMucHRIYW5kbGVyXy5lbWl0dGVyLm9uKCd1cCcsIHRoaXMub25Qb2ludGVyVXBfKTtcbiAgICAgICAgdGhpcy52aWV3LmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMub25LZXlEb3duXyk7XG4gICAgICAgIHRoaXMudmlldy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5vbktleVVwXyk7XG4gICAgfVxuICAgIGhhbmRsZVBvaW50ZXJFdmVudF8oZCwgb3B0cykge1xuICAgICAgICBpZiAoIWQucG9pbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhbHBoYSA9IGQucG9pbnQueCAvIGQuYm91bmRzLndpZHRoO1xuICAgICAgICBjb25zdCBjID0gdGhpcy52YWx1ZS5yYXdWYWx1ZTtcbiAgICAgICAgY29uc3QgW2gsIHMsIHZdID0gYy5nZXRDb21wb25lbnRzKCdoc3YnKTtcbiAgICAgICAgdGhpcy52YWx1ZS5zZXRSYXdWYWx1ZShuZXcgSW50Q29sb3IoW2gsIHMsIHYsIGFscGhhXSwgJ2hzdicpLCBvcHRzKTtcbiAgICB9XG4gICAgb25Qb2ludGVyRG93bl8oZXYpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVQb2ludGVyRXZlbnRfKGV2LmRhdGEsIHtcbiAgICAgICAgICAgIGZvcmNlRW1pdDogZmFsc2UsXG4gICAgICAgICAgICBsYXN0OiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG9uUG9pbnRlck1vdmVfKGV2KSB7XG4gICAgICAgIHRoaXMuaGFuZGxlUG9pbnRlckV2ZW50Xyhldi5kYXRhLCB7XG4gICAgICAgICAgICBmb3JjZUVtaXQ6IGZhbHNlLFxuICAgICAgICAgICAgbGFzdDogZmFsc2UsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvblBvaW50ZXJVcF8oZXYpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVQb2ludGVyRXZlbnRfKGV2LmRhdGEsIHtcbiAgICAgICAgICAgIGZvcmNlRW1pdDogdHJ1ZSxcbiAgICAgICAgICAgIGxhc3Q6IHRydWUsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvbktleURvd25fKGV2KSB7XG4gICAgICAgIGNvbnN0IHN0ZXAgPSBnZXRTdGVwRm9yS2V5KGdldEtleVNjYWxlRm9yQ29sb3IodHJ1ZSksIGdldEhvcml6b250YWxTdGVwS2V5cyhldikpO1xuICAgICAgICBpZiAoc3RlcCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGMgPSB0aGlzLnZhbHVlLnJhd1ZhbHVlO1xuICAgICAgICBjb25zdCBbaCwgcywgdiwgYV0gPSBjLmdldENvbXBvbmVudHMoJ2hzdicpO1xuICAgICAgICB0aGlzLnZhbHVlLnNldFJhd1ZhbHVlKG5ldyBJbnRDb2xvcihbaCwgcywgdiwgYSArIHN0ZXBdLCAnaHN2JyksIHtcbiAgICAgICAgICAgIGZvcmNlRW1pdDogZmFsc2UsXG4gICAgICAgICAgICBsYXN0OiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG9uS2V5VXBfKGV2KSB7XG4gICAgICAgIGNvbnN0IHN0ZXAgPSBnZXRTdGVwRm9yS2V5KGdldEtleVNjYWxlRm9yQ29sb3IodHJ1ZSksIGdldEhvcml6b250YWxTdGVwS2V5cyhldikpO1xuICAgICAgICBpZiAoc3RlcCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmFsdWUuc2V0UmF3VmFsdWUodGhpcy52YWx1ZS5yYXdWYWx1ZSwge1xuICAgICAgICAgICAgZm9yY2VFbWl0OiB0cnVlLFxuICAgICAgICAgICAgbGFzdDogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5jb25zdCBjbiRhID0gQ2xhc3NOYW1lKCdjb2x0eHQnKTtcbmZ1bmN0aW9uIGNyZWF0ZU1vZGVTZWxlY3RFbGVtZW50KGRvYykge1xuICAgIGNvbnN0IHNlbGVjdEVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG4gICAgY29uc3QgaXRlbXMgPSBbXG4gICAgICAgIHsgdGV4dDogJ1JHQicsIHZhbHVlOiAncmdiJyB9LFxuICAgICAgICB7IHRleHQ6ICdIU0wnLCB2YWx1ZTogJ2hzbCcgfSxcbiAgICAgICAgeyB0ZXh0OiAnSFNWJywgdmFsdWU6ICdoc3YnIH0sXG4gICAgICAgIHsgdGV4dDogJ0hFWCcsIHZhbHVlOiAnaGV4JyB9LFxuICAgIF07XG4gICAgc2VsZWN0RWxlbS5hcHBlbmRDaGlsZChpdGVtcy5yZWR1Y2UoKGZyYWcsIGl0ZW0pID0+IHtcbiAgICAgICAgY29uc3Qgb3B0RWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgb3B0RWxlbS50ZXh0Q29udGVudCA9IGl0ZW0udGV4dDtcbiAgICAgICAgb3B0RWxlbS52YWx1ZSA9IGl0ZW0udmFsdWU7XG4gICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQob3B0RWxlbSk7XG4gICAgICAgIHJldHVybiBmcmFnO1xuICAgIH0sIGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCkpKTtcbiAgICByZXR1cm4gc2VsZWN0RWxlbTtcbn1cbmNsYXNzIENvbG9yVGV4dHNWaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihkb2MsIGNvbmZpZykge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNuJGEoKSk7XG4gICAgICAgIGNvbmZpZy52aWV3UHJvcHMuYmluZENsYXNzTW9kaWZpZXJzKHRoaXMuZWxlbWVudCk7XG4gICAgICAgIGNvbnN0IG1vZGVFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBtb2RlRWxlbS5jbGFzc0xpc3QuYWRkKGNuJGEoJ20nKSk7XG4gICAgICAgIHRoaXMubW9kZUVsZW1fID0gY3JlYXRlTW9kZVNlbGVjdEVsZW1lbnQoZG9jKTtcbiAgICAgICAgdGhpcy5tb2RlRWxlbV8uY2xhc3NMaXN0LmFkZChjbiRhKCdtcycpKTtcbiAgICAgICAgbW9kZUVsZW0uYXBwZW5kQ2hpbGQodGhpcy5tb2RlU2VsZWN0RWxlbWVudCk7XG4gICAgICAgIGNvbmZpZy52aWV3UHJvcHMuYmluZERpc2FibGVkKHRoaXMubW9kZUVsZW1fKTtcbiAgICAgICAgY29uc3QgbW9kZU1hcmtlckVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIG1vZGVNYXJrZXJFbGVtLmNsYXNzTGlzdC5hZGQoY24kYSgnbW0nKSk7XG4gICAgICAgIG1vZGVNYXJrZXJFbGVtLmFwcGVuZENoaWxkKGNyZWF0ZVN2Z0ljb25FbGVtZW50KGRvYywgJ2Ryb3Bkb3duJykpO1xuICAgICAgICBtb2RlRWxlbS5hcHBlbmRDaGlsZChtb2RlTWFya2VyRWxlbSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChtb2RlRWxlbSk7XG4gICAgICAgIGNvbnN0IGlucHV0c0VsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGlucHV0c0VsZW0uY2xhc3NMaXN0LmFkZChjbiRhKCd3JykpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoaW5wdXRzRWxlbSk7XG4gICAgICAgIHRoaXMuaW5wdXRzRWxlbV8gPSBpbnB1dHNFbGVtO1xuICAgICAgICB0aGlzLmlucHV0Vmlld3NfID0gY29uZmlnLmlucHV0Vmlld3M7XG4gICAgICAgIHRoaXMuYXBwbHlJbnB1dFZpZXdzXygpO1xuICAgICAgICBiaW5kVmFsdWUoY29uZmlnLm1vZGUsIChtb2RlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm1vZGVFbGVtXy52YWx1ZSA9IG1vZGU7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnZXQgbW9kZVNlbGVjdEVsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vZGVFbGVtXztcbiAgICB9XG4gICAgZ2V0IGlucHV0Vmlld3MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0Vmlld3NfO1xuICAgIH1cbiAgICBzZXQgaW5wdXRWaWV3cyhpbnB1dFZpZXdzKSB7XG4gICAgICAgIHRoaXMuaW5wdXRWaWV3c18gPSBpbnB1dFZpZXdzO1xuICAgICAgICB0aGlzLmFwcGx5SW5wdXRWaWV3c18oKTtcbiAgICB9XG4gICAgYXBwbHlJbnB1dFZpZXdzXygpIHtcbiAgICAgICAgcmVtb3ZlQ2hpbGRFbGVtZW50cyh0aGlzLmlucHV0c0VsZW1fKTtcbiAgICAgICAgY29uc3QgZG9jID0gdGhpcy5lbGVtZW50Lm93bmVyRG9jdW1lbnQ7XG4gICAgICAgIHRoaXMuaW5wdXRWaWV3c18uZm9yRWFjaCgodikgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29tcEVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBjb21wRWxlbS5jbGFzc0xpc3QuYWRkKGNuJGEoJ2MnKSk7XG4gICAgICAgICAgICBjb21wRWxlbS5hcHBlbmRDaGlsZCh2LmVsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dHNFbGVtXy5hcHBlbmRDaGlsZChjb21wRWxlbSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlRm9ybWF0dGVyJDIodHlwZSkge1xuICAgIHJldHVybiBjcmVhdGVOdW1iZXJGb3JtYXR0ZXIodHlwZSA9PT0gJ2Zsb2F0JyA/IDIgOiAwKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUNvbnN0cmFpbnQkNShtb2RlLCB0eXBlLCBpbmRleCkge1xuICAgIGNvbnN0IG1heCA9IGdldENvbG9yTWF4Q29tcG9uZW50cyhtb2RlLCB0eXBlKVtpbmRleF07XG4gICAgcmV0dXJuIG5ldyBEZWZpbml0ZVJhbmdlQ29uc3RyYWludCh7XG4gICAgICAgIG1pbjogMCxcbiAgICAgICAgbWF4OiBtYXgsXG4gICAgfSk7XG59XG5mdW5jdGlvbiBjcmVhdGVDb21wb25lbnRDb250cm9sbGVyKGRvYywgY29uZmlnLCBpbmRleCkge1xuICAgIHJldHVybiBuZXcgTnVtYmVyVGV4dENvbnRyb2xsZXIoZG9jLCB7XG4gICAgICAgIGFycmF5UG9zaXRpb246IGluZGV4ID09PSAwID8gJ2ZzdCcgOiBpbmRleCA9PT0gMyAtIDEgPyAnbHN0JyA6ICdtaWQnLFxuICAgICAgICBwYXJzZXI6IGNvbmZpZy5wYXJzZXIsXG4gICAgICAgIHByb3BzOiBWYWx1ZU1hcC5mcm9tT2JqZWN0KHtcbiAgICAgICAgICAgIGZvcm1hdHRlcjogY3JlYXRlRm9ybWF0dGVyJDIoY29uZmlnLmNvbG9yVHlwZSksXG4gICAgICAgICAgICBrZXlTY2FsZTogZ2V0S2V5U2NhbGVGb3JDb2xvcihmYWxzZSksXG4gICAgICAgICAgICBwb2ludGVyU2NhbGU6IGNvbmZpZy5jb2xvclR5cGUgPT09ICdmbG9hdCcgPyAwLjAxIDogMSxcbiAgICAgICAgfSksXG4gICAgICAgIHZhbHVlOiBjcmVhdGVWYWx1ZSgwLCB7XG4gICAgICAgICAgICBjb25zdHJhaW50OiBjcmVhdGVDb25zdHJhaW50JDUoY29uZmlnLmNvbG9yTW9kZSwgY29uZmlnLmNvbG9yVHlwZSwgaW5kZXgpLFxuICAgICAgICB9KSxcbiAgICAgICAgdmlld1Byb3BzOiBjb25maWcudmlld1Byb3BzLFxuICAgIH0pO1xufVxuZnVuY3Rpb24gY3JlYXRlQ29tcG9uZW50Q29udHJvbGxlcnMoZG9jLCBjb25maWcpIHtcbiAgICBjb25zdCBjYyA9IHtcbiAgICAgICAgY29sb3JNb2RlOiBjb25maWcuY29sb3JNb2RlLFxuICAgICAgICBjb2xvclR5cGU6IGNvbmZpZy5jb2xvclR5cGUsXG4gICAgICAgIHBhcnNlcjogcGFyc2VOdW1iZXIsXG4gICAgICAgIHZpZXdQcm9wczogY29uZmlnLnZpZXdQcm9wcyxcbiAgICB9O1xuICAgIHJldHVybiBbMCwgMSwgMl0ubWFwKChpKSA9PiB7XG4gICAgICAgIGNvbnN0IGMgPSBjcmVhdGVDb21wb25lbnRDb250cm9sbGVyKGRvYywgY2MsIGkpO1xuICAgICAgICBjb25uZWN0VmFsdWVzKHtcbiAgICAgICAgICAgIHByaW1hcnk6IGNvbmZpZy52YWx1ZSxcbiAgICAgICAgICAgIHNlY29uZGFyeTogYy52YWx1ZSxcbiAgICAgICAgICAgIGZvcndhcmQocCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1jID0gbWFwQ29sb3JUeXBlKHAsIGNvbmZpZy5jb2xvclR5cGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBtYy5nZXRDb21wb25lbnRzKGNvbmZpZy5jb2xvck1vZGUpW2ldO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJhY2t3YXJkKHAsIHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwaWNrZWRNb2RlID0gY29uZmlnLmNvbG9yTW9kZTtcbiAgICAgICAgICAgICAgICBjb25zdCBtYyA9IG1hcENvbG9yVHlwZShwLCBjb25maWcuY29sb3JUeXBlKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wcyA9IG1jLmdldENvbXBvbmVudHMocGlja2VkTW9kZSk7XG4gICAgICAgICAgICAgICAgY29tcHNbaV0gPSBzO1xuICAgICAgICAgICAgICAgIGNvbnN0IGMgPSBjcmVhdGVDb2xvcihhcHBlbmRBbHBoYUNvbXBvbmVudChyZW1vdmVBbHBoYUNvbXBvbmVudChjb21wcyksIGNvbXBzWzNdKSwgcGlja2VkTW9kZSwgY29uZmlnLmNvbG9yVHlwZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hcENvbG9yVHlwZShjLCAnaW50Jyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBjcmVhdGVIZXhDb250cm9sbGVyKGRvYywgY29uZmlnKSB7XG4gICAgY29uc3QgYyA9IG5ldyBUZXh0Q29udHJvbGxlcihkb2MsIHtcbiAgICAgICAgcGFyc2VyOiBjcmVhdGVDb2xvclN0cmluZ1BhcnNlcignaW50JyksXG4gICAgICAgIHByb3BzOiBWYWx1ZU1hcC5mcm9tT2JqZWN0KHtcbiAgICAgICAgICAgIGZvcm1hdHRlcjogY29sb3JUb0hleFJnYlN0cmluZyxcbiAgICAgICAgfSksXG4gICAgICAgIHZhbHVlOiBjcmVhdGVWYWx1ZShJbnRDb2xvci5ibGFjaygpKSxcbiAgICAgICAgdmlld1Byb3BzOiBjb25maWcudmlld1Byb3BzLFxuICAgIH0pO1xuICAgIGNvbm5lY3RWYWx1ZXMoe1xuICAgICAgICBwcmltYXJ5OiBjb25maWcudmFsdWUsXG4gICAgICAgIHNlY29uZGFyeTogYy52YWx1ZSxcbiAgICAgICAgZm9yd2FyZDogKHApID0+IG5ldyBJbnRDb2xvcihyZW1vdmVBbHBoYUNvbXBvbmVudChwLmdldENvbXBvbmVudHMoKSksIHAubW9kZSksXG4gICAgICAgIGJhY2t3YXJkOiAocCwgcykgPT4gbmV3IEludENvbG9yKGFwcGVuZEFscGhhQ29tcG9uZW50KHJlbW92ZUFscGhhQ29tcG9uZW50KHMuZ2V0Q29tcG9uZW50cyhwLm1vZGUpKSwgcC5nZXRDb21wb25lbnRzKClbM10pLCBwLm1vZGUpLFxuICAgIH0pO1xuICAgIHJldHVybiBbY107XG59XG5mdW5jdGlvbiBpc0NvbG9yTW9kZShtb2RlKSB7XG4gICAgcmV0dXJuIG1vZGUgIT09ICdoZXgnO1xufVxuY2xhc3MgQ29sb3JUZXh0c0NvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKGRvYywgY29uZmlnKSB7XG4gICAgICAgIHRoaXMub25Nb2RlU2VsZWN0Q2hhbmdlXyA9IHRoaXMub25Nb2RlU2VsZWN0Q2hhbmdlXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmNvbG9yVHlwZV8gPSBjb25maWcuY29sb3JUeXBlO1xuICAgICAgICB0aGlzLnZhbHVlID0gY29uZmlnLnZhbHVlO1xuICAgICAgICB0aGlzLnZpZXdQcm9wcyA9IGNvbmZpZy52aWV3UHJvcHM7XG4gICAgICAgIHRoaXMuY29sb3JNb2RlID0gY3JlYXRlVmFsdWUodGhpcy52YWx1ZS5yYXdWYWx1ZS5tb2RlKTtcbiAgICAgICAgdGhpcy5jY3NfID0gdGhpcy5jcmVhdGVDb21wb25lbnRDb250cm9sbGVyc18oZG9jKTtcbiAgICAgICAgdGhpcy52aWV3ID0gbmV3IENvbG9yVGV4dHNWaWV3KGRvYywge1xuICAgICAgICAgICAgbW9kZTogdGhpcy5jb2xvck1vZGUsXG4gICAgICAgICAgICBpbnB1dFZpZXdzOiBbdGhpcy5jY3NfWzBdLnZpZXcsIHRoaXMuY2NzX1sxXS52aWV3LCB0aGlzLmNjc19bMl0udmlld10sXG4gICAgICAgICAgICB2aWV3UHJvcHM6IHRoaXMudmlld1Byb3BzLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy52aWV3Lm1vZGVTZWxlY3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMub25Nb2RlU2VsZWN0Q2hhbmdlXyk7XG4gICAgfVxuICAgIGNyZWF0ZUNvbXBvbmVudENvbnRyb2xsZXJzXyhkb2MpIHtcbiAgICAgICAgY29uc3QgbW9kZSA9IHRoaXMuY29sb3JNb2RlLnJhd1ZhbHVlO1xuICAgICAgICBpZiAoaXNDb2xvck1vZGUobW9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVDb21wb25lbnRDb250cm9sbGVycyhkb2MsIHtcbiAgICAgICAgICAgICAgICBjb2xvck1vZGU6IG1vZGUsXG4gICAgICAgICAgICAgICAgY29sb3JUeXBlOiB0aGlzLmNvbG9yVHlwZV8sXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXG4gICAgICAgICAgICAgICAgdmlld1Byb3BzOiB0aGlzLnZpZXdQcm9wcyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjcmVhdGVIZXhDb250cm9sbGVyKGRvYywge1xuICAgICAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXG4gICAgICAgICAgICB2aWV3UHJvcHM6IHRoaXMudmlld1Byb3BzLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb25Nb2RlU2VsZWN0Q2hhbmdlXyhldikge1xuICAgICAgICBjb25zdCBzZWxlY3RFbGVtID0gZXYuY3VycmVudFRhcmdldDtcbiAgICAgICAgdGhpcy5jb2xvck1vZGUucmF3VmFsdWUgPSBzZWxlY3RFbGVtLnZhbHVlO1xuICAgICAgICB0aGlzLmNjc18gPSB0aGlzLmNyZWF0ZUNvbXBvbmVudENvbnRyb2xsZXJzXyh0aGlzLnZpZXcuZWxlbWVudC5vd25lckRvY3VtZW50KTtcbiAgICAgICAgdGhpcy52aWV3LmlucHV0Vmlld3MgPSB0aGlzLmNjc18ubWFwKChjYykgPT4gY2Mudmlldyk7XG4gICAgfVxufVxuXG5jb25zdCBjbiQ5ID0gQ2xhc3NOYW1lKCdocGwnKTtcbmNsYXNzIEhQYWxldHRlVmlldyB7XG4gICAgY29uc3RydWN0b3IoZG9jLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5vblZhbHVlQ2hhbmdlXyA9IHRoaXMub25WYWx1ZUNoYW5nZV8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IGNvbmZpZy52YWx1ZTtcbiAgICAgICAgdGhpcy52YWx1ZS5lbWl0dGVyLm9uKCdjaGFuZ2UnLCB0aGlzLm9uVmFsdWVDaGFuZ2VfKTtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbiQ5KCkpO1xuICAgICAgICBjb25maWcudmlld1Byb3BzLmJpbmRDbGFzc01vZGlmaWVycyh0aGlzLmVsZW1lbnQpO1xuICAgICAgICBjb25maWcudmlld1Byb3BzLmJpbmRUYWJJbmRleCh0aGlzLmVsZW1lbnQpO1xuICAgICAgICBjb25zdCBjb2xvckVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGNvbG9yRWxlbS5jbGFzc0xpc3QuYWRkKGNuJDkoJ2MnKSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChjb2xvckVsZW0pO1xuICAgICAgICBjb25zdCBtYXJrZXJFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBtYXJrZXJFbGVtLmNsYXNzTGlzdC5hZGQoY24kOSgnbScpKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKG1hcmtlckVsZW0pO1xuICAgICAgICB0aGlzLm1hcmtlckVsZW1fID0gbWFya2VyRWxlbTtcbiAgICAgICAgdGhpcy51cGRhdGVfKCk7XG4gICAgfVxuICAgIHVwZGF0ZV8oKSB7XG4gICAgICAgIGNvbnN0IGMgPSB0aGlzLnZhbHVlLnJhd1ZhbHVlO1xuICAgICAgICBjb25zdCBbaF0gPSBjLmdldENvbXBvbmVudHMoJ2hzdicpO1xuICAgICAgICB0aGlzLm1hcmtlckVsZW1fLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yVG9GdW5jdGlvbmFsUmdiU3RyaW5nKG5ldyBJbnRDb2xvcihbaCwgMTAwLCAxMDBdLCAnaHN2JykpO1xuICAgICAgICBjb25zdCBsZWZ0ID0gbWFwUmFuZ2UoaCwgMCwgMzYwLCAwLCAxMDApO1xuICAgICAgICB0aGlzLm1hcmtlckVsZW1fLnN0eWxlLmxlZnQgPSBgJHtsZWZ0fSVgO1xuICAgIH1cbiAgICBvblZhbHVlQ2hhbmdlXygpIHtcbiAgICAgICAgdGhpcy51cGRhdGVfKCk7XG4gICAgfVxufVxuXG5jbGFzcyBIUGFsZXR0ZUNvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKGRvYywgY29uZmlnKSB7XG4gICAgICAgIHRoaXMub25LZXlEb3duXyA9IHRoaXMub25LZXlEb3duXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uS2V5VXBfID0gdGhpcy5vbktleVVwXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uUG9pbnRlckRvd25fID0gdGhpcy5vblBvaW50ZXJEb3duXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uUG9pbnRlck1vdmVfID0gdGhpcy5vblBvaW50ZXJNb3ZlXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uUG9pbnRlclVwXyA9IHRoaXMub25Qb2ludGVyVXBfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMudmFsdWUgPSBjb25maWcudmFsdWU7XG4gICAgICAgIHRoaXMudmlld1Byb3BzID0gY29uZmlnLnZpZXdQcm9wcztcbiAgICAgICAgdGhpcy52aWV3ID0gbmV3IEhQYWxldHRlVmlldyhkb2MsIHtcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgICAgICAgdmlld1Byb3BzOiB0aGlzLnZpZXdQcm9wcyxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucHRIYW5kbGVyXyA9IG5ldyBQb2ludGVySGFuZGxlcih0aGlzLnZpZXcuZWxlbWVudCk7XG4gICAgICAgIHRoaXMucHRIYW5kbGVyXy5lbWl0dGVyLm9uKCdkb3duJywgdGhpcy5vblBvaW50ZXJEb3duXyk7XG4gICAgICAgIHRoaXMucHRIYW5kbGVyXy5lbWl0dGVyLm9uKCdtb3ZlJywgdGhpcy5vblBvaW50ZXJNb3ZlXyk7XG4gICAgICAgIHRoaXMucHRIYW5kbGVyXy5lbWl0dGVyLm9uKCd1cCcsIHRoaXMub25Qb2ludGVyVXBfKTtcbiAgICAgICAgdGhpcy52aWV3LmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMub25LZXlEb3duXyk7XG4gICAgICAgIHRoaXMudmlldy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5vbktleVVwXyk7XG4gICAgfVxuICAgIGhhbmRsZVBvaW50ZXJFdmVudF8oZCwgb3B0cykge1xuICAgICAgICBpZiAoIWQucG9pbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBodWUgPSBtYXBSYW5nZShjb25zdHJhaW5SYW5nZShkLnBvaW50LngsIDAsIGQuYm91bmRzLndpZHRoKSwgMCwgZC5ib3VuZHMud2lkdGgsIDAsIDM2MCk7XG4gICAgICAgIGNvbnN0IGMgPSB0aGlzLnZhbHVlLnJhd1ZhbHVlO1xuICAgICAgICBjb25zdCBbLCBzLCB2LCBhXSA9IGMuZ2V0Q29tcG9uZW50cygnaHN2Jyk7XG4gICAgICAgIHRoaXMudmFsdWUuc2V0UmF3VmFsdWUobmV3IEludENvbG9yKFtodWUsIHMsIHYsIGFdLCAnaHN2JyksIG9wdHMpO1xuICAgIH1cbiAgICBvblBvaW50ZXJEb3duXyhldikge1xuICAgICAgICB0aGlzLmhhbmRsZVBvaW50ZXJFdmVudF8oZXYuZGF0YSwge1xuICAgICAgICAgICAgZm9yY2VFbWl0OiBmYWxzZSxcbiAgICAgICAgICAgIGxhc3Q6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb25Qb2ludGVyTW92ZV8oZXYpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVQb2ludGVyRXZlbnRfKGV2LmRhdGEsIHtcbiAgICAgICAgICAgIGZvcmNlRW1pdDogZmFsc2UsXG4gICAgICAgICAgICBsYXN0OiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG9uUG9pbnRlclVwXyhldikge1xuICAgICAgICB0aGlzLmhhbmRsZVBvaW50ZXJFdmVudF8oZXYuZGF0YSwge1xuICAgICAgICAgICAgZm9yY2VFbWl0OiB0cnVlLFxuICAgICAgICAgICAgbGFzdDogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG9uS2V5RG93bl8oZXYpIHtcbiAgICAgICAgY29uc3Qgc3RlcCA9IGdldFN0ZXBGb3JLZXkoZ2V0S2V5U2NhbGVGb3JDb2xvcihmYWxzZSksIGdldEhvcml6b250YWxTdGVwS2V5cyhldikpO1xuICAgICAgICBpZiAoc3RlcCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGMgPSB0aGlzLnZhbHVlLnJhd1ZhbHVlO1xuICAgICAgICBjb25zdCBbaCwgcywgdiwgYV0gPSBjLmdldENvbXBvbmVudHMoJ2hzdicpO1xuICAgICAgICB0aGlzLnZhbHVlLnNldFJhd1ZhbHVlKG5ldyBJbnRDb2xvcihbaCArIHN0ZXAsIHMsIHYsIGFdLCAnaHN2JyksIHtcbiAgICAgICAgICAgIGZvcmNlRW1pdDogZmFsc2UsXG4gICAgICAgICAgICBsYXN0OiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG9uS2V5VXBfKGV2KSB7XG4gICAgICAgIGNvbnN0IHN0ZXAgPSBnZXRTdGVwRm9yS2V5KGdldEtleVNjYWxlRm9yQ29sb3IoZmFsc2UpLCBnZXRIb3Jpem9udGFsU3RlcEtleXMoZXYpKTtcbiAgICAgICAgaWYgKHN0ZXAgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnZhbHVlLnNldFJhd1ZhbHVlKHRoaXMudmFsdWUucmF3VmFsdWUsIHtcbiAgICAgICAgICAgIGZvcmNlRW1pdDogdHJ1ZSxcbiAgICAgICAgICAgIGxhc3Q6IHRydWUsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuY29uc3QgY24kOCA9IENsYXNzTmFtZSgnc3ZwJyk7XG5jb25zdCBDQU5WQVNfUkVTT0wgPSA2NDtcbmNsYXNzIFN2UGFsZXR0ZVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKGRvYywgY29uZmlnKSB7XG4gICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZV8gPSB0aGlzLm9uVmFsdWVDaGFuZ2VfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMudmFsdWUgPSBjb25maWcudmFsdWU7XG4gICAgICAgIHRoaXMudmFsdWUuZW1pdHRlci5vbignY2hhbmdlJywgdGhpcy5vblZhbHVlQ2hhbmdlXyk7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoY24kOCgpKTtcbiAgICAgICAgY29uZmlnLnZpZXdQcm9wcy5iaW5kQ2xhc3NNb2RpZmllcnModGhpcy5lbGVtZW50KTtcbiAgICAgICAgY29uZmlnLnZpZXdQcm9wcy5iaW5kVGFiSW5kZXgodGhpcy5lbGVtZW50KTtcbiAgICAgICAgY29uc3QgY2FudmFzRWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgY2FudmFzRWxlbS5oZWlnaHQgPSBDQU5WQVNfUkVTT0w7XG4gICAgICAgIGNhbnZhc0VsZW0ud2lkdGggPSBDQU5WQVNfUkVTT0w7XG4gICAgICAgIGNhbnZhc0VsZW0uY2xhc3NMaXN0LmFkZChjbiQ4KCdjJykpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoY2FudmFzRWxlbSk7XG4gICAgICAgIHRoaXMuY2FudmFzRWxlbWVudCA9IGNhbnZhc0VsZW07XG4gICAgICAgIGNvbnN0IG1hcmtlckVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIG1hcmtlckVsZW0uY2xhc3NMaXN0LmFkZChjbiQ4KCdtJykpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQobWFya2VyRWxlbSk7XG4gICAgICAgIHRoaXMubWFya2VyRWxlbV8gPSBtYXJrZXJFbGVtO1xuICAgICAgICB0aGlzLnVwZGF0ZV8oKTtcbiAgICB9XG4gICAgdXBkYXRlXygpIHtcbiAgICAgICAgY29uc3QgY3R4ID0gZ2V0Q2FudmFzQ29udGV4dCh0aGlzLmNhbnZhc0VsZW1lbnQpO1xuICAgICAgICBpZiAoIWN0eCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGMgPSB0aGlzLnZhbHVlLnJhd1ZhbHVlO1xuICAgICAgICBjb25zdCBoc3ZDb21wcyA9IGMuZ2V0Q29tcG9uZW50cygnaHN2Jyk7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5jYW52YXNFbGVtZW50LndpZHRoO1xuICAgICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0O1xuICAgICAgICBjb25zdCBpbWdEYXRhID0gY3R4LmdldEltYWdlRGF0YSgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgY29uc3QgZGF0YSA9IGltZ0RhdGEuZGF0YTtcbiAgICAgICAgZm9yIChsZXQgaXkgPSAwOyBpeSA8IGhlaWdodDsgaXkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaXggPSAwOyBpeCA8IHdpZHRoOyBpeCsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcyA9IG1hcFJhbmdlKGl4LCAwLCB3aWR0aCwgMCwgMTAwKTtcbiAgICAgICAgICAgICAgICBjb25zdCB2ID0gbWFwUmFuZ2UoaXksIDAsIGhlaWdodCwgMTAwLCAwKTtcbiAgICAgICAgICAgICAgICBjb25zdCByZ2JDb21wcyA9IGhzdlRvUmdiSW50KGhzdkNvbXBzWzBdLCBzLCB2KTtcbiAgICAgICAgICAgICAgICBjb25zdCBpID0gKGl5ICogd2lkdGggKyBpeCkgKiA0O1xuICAgICAgICAgICAgICAgIGRhdGFbaV0gPSByZ2JDb21wc1swXTtcbiAgICAgICAgICAgICAgICBkYXRhW2kgKyAxXSA9IHJnYkNvbXBzWzFdO1xuICAgICAgICAgICAgICAgIGRhdGFbaSArIDJdID0gcmdiQ29tcHNbMl07XG4gICAgICAgICAgICAgICAgZGF0YVtpICsgM10gPSAyNTU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY3R4LnB1dEltYWdlRGF0YShpbWdEYXRhLCAwLCAwKTtcbiAgICAgICAgY29uc3QgbGVmdCA9IG1hcFJhbmdlKGhzdkNvbXBzWzFdLCAwLCAxMDAsIDAsIDEwMCk7XG4gICAgICAgIHRoaXMubWFya2VyRWxlbV8uc3R5bGUubGVmdCA9IGAke2xlZnR9JWA7XG4gICAgICAgIGNvbnN0IHRvcCA9IG1hcFJhbmdlKGhzdkNvbXBzWzJdLCAwLCAxMDAsIDEwMCwgMCk7XG4gICAgICAgIHRoaXMubWFya2VyRWxlbV8uc3R5bGUudG9wID0gYCR7dG9wfSVgO1xuICAgIH1cbiAgICBvblZhbHVlQ2hhbmdlXygpIHtcbiAgICAgICAgdGhpcy51cGRhdGVfKCk7XG4gICAgfVxufVxuXG5jbGFzcyBTdlBhbGV0dGVDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihkb2MsIGNvbmZpZykge1xuICAgICAgICB0aGlzLm9uS2V5RG93bl8gPSB0aGlzLm9uS2V5RG93bl8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbktleVVwXyA9IHRoaXMub25LZXlVcF8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vblBvaW50ZXJEb3duXyA9IHRoaXMub25Qb2ludGVyRG93bl8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vblBvaW50ZXJNb3ZlXyA9IHRoaXMub25Qb2ludGVyTW92ZV8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vblBvaW50ZXJVcF8gPSB0aGlzLm9uUG9pbnRlclVwXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnZhbHVlID0gY29uZmlnLnZhbHVlO1xuICAgICAgICB0aGlzLnZpZXdQcm9wcyA9IGNvbmZpZy52aWV3UHJvcHM7XG4gICAgICAgIHRoaXMudmlldyA9IG5ldyBTdlBhbGV0dGVWaWV3KGRvYywge1xuICAgICAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXG4gICAgICAgICAgICB2aWV3UHJvcHM6IHRoaXMudmlld1Byb3BzLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5wdEhhbmRsZXJfID0gbmV3IFBvaW50ZXJIYW5kbGVyKHRoaXMudmlldy5lbGVtZW50KTtcbiAgICAgICAgdGhpcy5wdEhhbmRsZXJfLmVtaXR0ZXIub24oJ2Rvd24nLCB0aGlzLm9uUG9pbnRlckRvd25fKTtcbiAgICAgICAgdGhpcy5wdEhhbmRsZXJfLmVtaXR0ZXIub24oJ21vdmUnLCB0aGlzLm9uUG9pbnRlck1vdmVfKTtcbiAgICAgICAgdGhpcy5wdEhhbmRsZXJfLmVtaXR0ZXIub24oJ3VwJywgdGhpcy5vblBvaW50ZXJVcF8pO1xuICAgICAgICB0aGlzLnZpZXcuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5vbktleURvd25fKTtcbiAgICAgICAgdGhpcy52aWV3LmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLm9uS2V5VXBfKTtcbiAgICB9XG4gICAgaGFuZGxlUG9pbnRlckV2ZW50XyhkLCBvcHRzKSB7XG4gICAgICAgIGlmICghZC5wb2ludCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNhdHVyYXRpb24gPSBtYXBSYW5nZShkLnBvaW50LngsIDAsIGQuYm91bmRzLndpZHRoLCAwLCAxMDApO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IG1hcFJhbmdlKGQucG9pbnQueSwgMCwgZC5ib3VuZHMuaGVpZ2h0LCAxMDAsIDApO1xuICAgICAgICBjb25zdCBbaCwgLCAsIGFdID0gdGhpcy52YWx1ZS5yYXdWYWx1ZS5nZXRDb21wb25lbnRzKCdoc3YnKTtcbiAgICAgICAgdGhpcy52YWx1ZS5zZXRSYXdWYWx1ZShuZXcgSW50Q29sb3IoW2gsIHNhdHVyYXRpb24sIHZhbHVlLCBhXSwgJ2hzdicpLCBvcHRzKTtcbiAgICB9XG4gICAgb25Qb2ludGVyRG93bl8oZXYpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVQb2ludGVyRXZlbnRfKGV2LmRhdGEsIHtcbiAgICAgICAgICAgIGZvcmNlRW1pdDogZmFsc2UsXG4gICAgICAgICAgICBsYXN0OiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG9uUG9pbnRlck1vdmVfKGV2KSB7XG4gICAgICAgIHRoaXMuaGFuZGxlUG9pbnRlckV2ZW50Xyhldi5kYXRhLCB7XG4gICAgICAgICAgICBmb3JjZUVtaXQ6IGZhbHNlLFxuICAgICAgICAgICAgbGFzdDogZmFsc2UsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvblBvaW50ZXJVcF8oZXYpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVQb2ludGVyRXZlbnRfKGV2LmRhdGEsIHtcbiAgICAgICAgICAgIGZvcmNlRW1pdDogdHJ1ZSxcbiAgICAgICAgICAgIGxhc3Q6IHRydWUsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvbktleURvd25fKGV2KSB7XG4gICAgICAgIGlmIChpc0Fycm93S2V5KGV2LmtleSkpIHtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgW2gsIHMsIHYsIGFdID0gdGhpcy52YWx1ZS5yYXdWYWx1ZS5nZXRDb21wb25lbnRzKCdoc3YnKTtcbiAgICAgICAgY29uc3Qga2V5U2NhbGUgPSBnZXRLZXlTY2FsZUZvckNvbG9yKGZhbHNlKTtcbiAgICAgICAgY29uc3QgZHMgPSBnZXRTdGVwRm9yS2V5KGtleVNjYWxlLCBnZXRIb3Jpem9udGFsU3RlcEtleXMoZXYpKTtcbiAgICAgICAgY29uc3QgZHYgPSBnZXRTdGVwRm9yS2V5KGtleVNjYWxlLCBnZXRWZXJ0aWNhbFN0ZXBLZXlzKGV2KSk7XG4gICAgICAgIGlmIChkcyA9PT0gMCAmJiBkdiA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmFsdWUuc2V0UmF3VmFsdWUobmV3IEludENvbG9yKFtoLCBzICsgZHMsIHYgKyBkdiwgYV0sICdoc3YnKSwge1xuICAgICAgICAgICAgZm9yY2VFbWl0OiBmYWxzZSxcbiAgICAgICAgICAgIGxhc3Q6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb25LZXlVcF8oZXYpIHtcbiAgICAgICAgY29uc3Qga2V5U2NhbGUgPSBnZXRLZXlTY2FsZUZvckNvbG9yKGZhbHNlKTtcbiAgICAgICAgY29uc3QgZHMgPSBnZXRTdGVwRm9yS2V5KGtleVNjYWxlLCBnZXRIb3Jpem9udGFsU3RlcEtleXMoZXYpKTtcbiAgICAgICAgY29uc3QgZHYgPSBnZXRTdGVwRm9yS2V5KGtleVNjYWxlLCBnZXRWZXJ0aWNhbFN0ZXBLZXlzKGV2KSk7XG4gICAgICAgIGlmIChkcyA9PT0gMCAmJiBkdiA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmFsdWUuc2V0UmF3VmFsdWUodGhpcy52YWx1ZS5yYXdWYWx1ZSwge1xuICAgICAgICAgICAgZm9yY2VFbWl0OiB0cnVlLFxuICAgICAgICAgICAgbGFzdDogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5jbGFzcyBDb2xvclBpY2tlckNvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKGRvYywgY29uZmlnKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSBjb25maWcudmFsdWU7XG4gICAgICAgIHRoaXMudmlld1Byb3BzID0gY29uZmlnLnZpZXdQcm9wcztcbiAgICAgICAgdGhpcy5oUGFsZXR0ZUNfID0gbmV3IEhQYWxldHRlQ29udHJvbGxlcihkb2MsIHtcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgICAgICAgdmlld1Byb3BzOiB0aGlzLnZpZXdQcm9wcyxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc3ZQYWxldHRlQ18gPSBuZXcgU3ZQYWxldHRlQ29udHJvbGxlcihkb2MsIHtcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgICAgICAgdmlld1Byb3BzOiB0aGlzLnZpZXdQcm9wcyxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYWxwaGFJY3NfID0gY29uZmlnLnN1cHBvcnRzQWxwaGFcbiAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgIHBhbGV0dGU6IG5ldyBBUGFsZXR0ZUNvbnRyb2xsZXIoZG9jLCB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB2aWV3UHJvcHM6IHRoaXMudmlld1Byb3BzLFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIHRleHQ6IG5ldyBOdW1iZXJUZXh0Q29udHJvbGxlcihkb2MsIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VyOiBwYXJzZU51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgcHJvcHM6IFZhbHVlTWFwLmZyb21PYmplY3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRlclNjYWxlOiAwLjAxLFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5U2NhbGU6IDAuMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlcjogY3JlYXRlTnVtYmVyRm9ybWF0dGVyKDIpLFxuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGNyZWF0ZVZhbHVlKDAsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQ6IG5ldyBEZWZpbml0ZVJhbmdlQ29uc3RyYWludCh7IG1pbjogMCwgbWF4OiAxIH0pLFxuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgdmlld1Byb3BzOiB0aGlzLnZpZXdQcm9wcyxcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgaWYgKHRoaXMuYWxwaGFJY3NfKSB7XG4gICAgICAgICAgICBjb25uZWN0VmFsdWVzKHtcbiAgICAgICAgICAgICAgICBwcmltYXJ5OiB0aGlzLnZhbHVlLFxuICAgICAgICAgICAgICAgIHNlY29uZGFyeTogdGhpcy5hbHBoYUljc18udGV4dC52YWx1ZSxcbiAgICAgICAgICAgICAgICBmb3J3YXJkOiAocCkgPT4gcC5nZXRDb21wb25lbnRzKClbM10sXG4gICAgICAgICAgICAgICAgYmFja3dhcmQ6IChwLCBzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBzID0gcC5nZXRDb21wb25lbnRzKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBzWzNdID0gcztcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBJbnRDb2xvcihjb21wcywgcC5tb2RlKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50ZXh0c0NfID0gbmV3IENvbG9yVGV4dHNDb250cm9sbGVyKGRvYywge1xuICAgICAgICAgICAgY29sb3JUeXBlOiBjb25maWcuY29sb3JUeXBlLFxuICAgICAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXG4gICAgICAgICAgICB2aWV3UHJvcHM6IHRoaXMudmlld1Byb3BzLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy52aWV3ID0gbmV3IENvbG9yUGlja2VyVmlldyhkb2MsIHtcbiAgICAgICAgICAgIGFscGhhVmlld3M6IHRoaXMuYWxwaGFJY3NfXG4gICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgIHBhbGV0dGU6IHRoaXMuYWxwaGFJY3NfLnBhbGV0dGUudmlldyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogdGhpcy5hbHBoYUljc18udGV4dC52aWV3LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA6IG51bGwsXG4gICAgICAgICAgICBoUGFsZXR0ZVZpZXc6IHRoaXMuaFBhbGV0dGVDXy52aWV3LFxuICAgICAgICAgICAgc3VwcG9ydHNBbHBoYTogY29uZmlnLnN1cHBvcnRzQWxwaGEsXG4gICAgICAgICAgICBzdlBhbGV0dGVWaWV3OiB0aGlzLnN2UGFsZXR0ZUNfLnZpZXcsXG4gICAgICAgICAgICB0ZXh0c1ZpZXc6IHRoaXMudGV4dHNDXy52aWV3LFxuICAgICAgICAgICAgdmlld1Byb3BzOiB0aGlzLnZpZXdQcm9wcyxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGdldCB0ZXh0c0NvbnRyb2xsZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHRzQ187XG4gICAgfVxufVxuXG5jb25zdCBjbiQ3ID0gQ2xhc3NOYW1lKCdjb2xzdycpO1xuY2xhc3MgQ29sb3JTd2F0Y2hWaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihkb2MsIGNvbmZpZykge1xuICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2VfID0gdGhpcy5vblZhbHVlQ2hhbmdlXy5iaW5kKHRoaXMpO1xuICAgICAgICBjb25maWcudmFsdWUuZW1pdHRlci5vbignY2hhbmdlJywgdGhpcy5vblZhbHVlQ2hhbmdlXyk7XG4gICAgICAgIHRoaXMudmFsdWUgPSBjb25maWcudmFsdWU7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoY24kNygpKTtcbiAgICAgICAgY29uZmlnLnZpZXdQcm9wcy5iaW5kQ2xhc3NNb2RpZmllcnModGhpcy5lbGVtZW50KTtcbiAgICAgICAgY29uc3Qgc3dhdGNoRWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgc3dhdGNoRWxlbS5jbGFzc0xpc3QuYWRkKGNuJDcoJ3N3JykpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoc3dhdGNoRWxlbSk7XG4gICAgICAgIHRoaXMuc3dhdGNoRWxlbV8gPSBzd2F0Y2hFbGVtO1xuICAgICAgICBjb25zdCBidXR0b25FbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBidXR0b25FbGVtLmNsYXNzTGlzdC5hZGQoY24kNygnYicpKTtcbiAgICAgICAgY29uZmlnLnZpZXdQcm9wcy5iaW5kRGlzYWJsZWQoYnV0dG9uRWxlbSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChidXR0b25FbGVtKTtcbiAgICAgICAgdGhpcy5idXR0b25FbGVtZW50ID0gYnV0dG9uRWxlbTtcbiAgICAgICAgdGhpcy51cGRhdGVfKCk7XG4gICAgfVxuICAgIHVwZGF0ZV8oKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy52YWx1ZS5yYXdWYWx1ZTtcbiAgICAgICAgdGhpcy5zd2F0Y2hFbGVtXy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvclRvSGV4UmdiYVN0cmluZyh2YWx1ZSk7XG4gICAgfVxuICAgIG9uVmFsdWVDaGFuZ2VfKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZV8oKTtcbiAgICB9XG59XG5cbmNsYXNzIENvbG9yU3dhdGNoQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoZG9jLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IGNvbmZpZy52YWx1ZTtcbiAgICAgICAgdGhpcy52aWV3UHJvcHMgPSBjb25maWcudmlld1Byb3BzO1xuICAgICAgICB0aGlzLnZpZXcgPSBuZXcgQ29sb3JTd2F0Y2hWaWV3KGRvYywge1xuICAgICAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXG4gICAgICAgICAgICB2aWV3UHJvcHM6IHRoaXMudmlld1Byb3BzLFxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmNsYXNzIENvbG9yQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoZG9jLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5vbkJ1dHRvbkJsdXJfID0gdGhpcy5vbkJ1dHRvbkJsdXJfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25CdXR0b25DbGlja18gPSB0aGlzLm9uQnV0dG9uQ2xpY2tfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25Qb3B1cENoaWxkQmx1cl8gPSB0aGlzLm9uUG9wdXBDaGlsZEJsdXJfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25Qb3B1cENoaWxkS2V5ZG93bl8gPSB0aGlzLm9uUG9wdXBDaGlsZEtleWRvd25fLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMudmFsdWUgPSBjb25maWcudmFsdWU7XG4gICAgICAgIHRoaXMudmlld1Byb3BzID0gY29uZmlnLnZpZXdQcm9wcztcbiAgICAgICAgdGhpcy5mb2xkYWJsZV8gPSBGb2xkYWJsZS5jcmVhdGUoY29uZmlnLmV4cGFuZGVkKTtcbiAgICAgICAgdGhpcy5zd2F0Y2hDXyA9IG5ldyBDb2xvclN3YXRjaENvbnRyb2xsZXIoZG9jLCB7XG4gICAgICAgICAgICB2YWx1ZTogdGhpcy52YWx1ZSxcbiAgICAgICAgICAgIHZpZXdQcm9wczogdGhpcy52aWV3UHJvcHMsXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBidXR0b25FbGVtID0gdGhpcy5zd2F0Y2hDXy52aWV3LmJ1dHRvbkVsZW1lbnQ7XG4gICAgICAgIGJ1dHRvbkVsZW0uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMub25CdXR0b25CbHVyXyk7XG4gICAgICAgIGJ1dHRvbkVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uQnV0dG9uQ2xpY2tfKTtcbiAgICAgICAgdGhpcy50ZXh0Q18gPSBuZXcgVGV4dENvbnRyb2xsZXIoZG9jLCB7XG4gICAgICAgICAgICBwYXJzZXI6IGNvbmZpZy5wYXJzZXIsXG4gICAgICAgICAgICBwcm9wczogVmFsdWVNYXAuZnJvbU9iamVjdCh7XG4gICAgICAgICAgICAgICAgZm9ybWF0dGVyOiBjb25maWcuZm9ybWF0dGVyLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB2YWx1ZTogdGhpcy52YWx1ZSxcbiAgICAgICAgICAgIHZpZXdQcm9wczogdGhpcy52aWV3UHJvcHMsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnZpZXcgPSBuZXcgQ29sb3JWaWV3KGRvYywge1xuICAgICAgICAgICAgZm9sZGFibGU6IHRoaXMuZm9sZGFibGVfLFxuICAgICAgICAgICAgcGlja2VyTGF5b3V0OiBjb25maWcucGlja2VyTGF5b3V0LFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy52aWV3LnN3YXRjaEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5zd2F0Y2hDXy52aWV3LmVsZW1lbnQpO1xuICAgICAgICB0aGlzLnZpZXcudGV4dEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy50ZXh0Q18udmlldy5lbGVtZW50KTtcbiAgICAgICAgdGhpcy5wb3BDXyA9XG4gICAgICAgICAgICBjb25maWcucGlja2VyTGF5b3V0ID09PSAncG9wdXAnXG4gICAgICAgICAgICAgICAgPyBuZXcgUG9wdXBDb250cm9sbGVyKGRvYywge1xuICAgICAgICAgICAgICAgICAgICB2aWV3UHJvcHM6IHRoaXMudmlld1Byb3BzLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgOiBudWxsO1xuICAgICAgICBjb25zdCBwaWNrZXJDID0gbmV3IENvbG9yUGlja2VyQ29udHJvbGxlcihkb2MsIHtcbiAgICAgICAgICAgIGNvbG9yVHlwZTogY29uZmlnLmNvbG9yVHlwZSxcbiAgICAgICAgICAgIHN1cHBvcnRzQWxwaGE6IGNvbmZpZy5zdXBwb3J0c0FscGhhLFxuICAgICAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXG4gICAgICAgICAgICB2aWV3UHJvcHM6IHRoaXMudmlld1Byb3BzLFxuICAgICAgICB9KTtcbiAgICAgICAgcGlja2VyQy52aWV3LmFsbEZvY3VzYWJsZUVsZW1lbnRzLmZvckVhY2goKGVsZW0pID0+IHtcbiAgICAgICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMub25Qb3B1cENoaWxkQmx1cl8pO1xuICAgICAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5vblBvcHVwQ2hpbGRLZXlkb3duXyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnBpY2tlckNfID0gcGlja2VyQztcbiAgICAgICAgaWYgKHRoaXMucG9wQ18pIHtcbiAgICAgICAgICAgIHRoaXMudmlldy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMucG9wQ18udmlldy5lbGVtZW50KTtcbiAgICAgICAgICAgIHRoaXMucG9wQ18udmlldy5lbGVtZW50LmFwcGVuZENoaWxkKHBpY2tlckMudmlldy5lbGVtZW50KTtcbiAgICAgICAgICAgIGNvbm5lY3RWYWx1ZXMoe1xuICAgICAgICAgICAgICAgIHByaW1hcnk6IHRoaXMuZm9sZGFibGVfLnZhbHVlKCdleHBhbmRlZCcpLFxuICAgICAgICAgICAgICAgIHNlY29uZGFyeTogdGhpcy5wb3BDXy5zaG93cyxcbiAgICAgICAgICAgICAgICBmb3J3YXJkOiAocCkgPT4gcCxcbiAgICAgICAgICAgICAgICBiYWNrd2FyZDogKF8sIHMpID0+IHMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnZpZXcucGlja2VyRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy52aWV3LnBpY2tlckVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5waWNrZXJDXy52aWV3LmVsZW1lbnQpO1xuICAgICAgICAgICAgYmluZEZvbGRhYmxlKHRoaXMuZm9sZGFibGVfLCB0aGlzLnZpZXcucGlja2VyRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0IHRleHRDb250cm9sbGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0Q187XG4gICAgfVxuICAgIG9uQnV0dG9uQmx1cl8oZSkge1xuICAgICAgICBpZiAoIXRoaXMucG9wQ18pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy52aWV3LmVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IG5leHRUYXJnZXQgPSBmb3JjZUNhc3QoZS5yZWxhdGVkVGFyZ2V0KTtcbiAgICAgICAgaWYgKCFuZXh0VGFyZ2V0IHx8ICFlbGVtLmNvbnRhaW5zKG5leHRUYXJnZXQpKSB7XG4gICAgICAgICAgICB0aGlzLnBvcENfLnNob3dzLnJhd1ZhbHVlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgb25CdXR0b25DbGlja18oKSB7XG4gICAgICAgIHRoaXMuZm9sZGFibGVfLnNldCgnZXhwYW5kZWQnLCAhdGhpcy5mb2xkYWJsZV8uZ2V0KCdleHBhbmRlZCcpKTtcbiAgICAgICAgaWYgKHRoaXMuZm9sZGFibGVfLmdldCgnZXhwYW5kZWQnKSkge1xuICAgICAgICAgICAgdGhpcy5waWNrZXJDXy52aWV3LmFsbEZvY3VzYWJsZUVsZW1lbnRzWzBdLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgb25Qb3B1cENoaWxkQmx1cl8oZXYpIHtcbiAgICAgICAgaWYgKCF0aGlzLnBvcENfKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMucG9wQ18udmlldy5lbGVtZW50O1xuICAgICAgICBjb25zdCBuZXh0VGFyZ2V0ID0gZmluZE5leHRUYXJnZXQoZXYpO1xuICAgICAgICBpZiAobmV4dFRhcmdldCAmJiBlbGVtLmNvbnRhaW5zKG5leHRUYXJnZXQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5leHRUYXJnZXQgJiZcbiAgICAgICAgICAgIG5leHRUYXJnZXQgPT09IHRoaXMuc3dhdGNoQ18udmlldy5idXR0b25FbGVtZW50ICYmXG4gICAgICAgICAgICAhc3VwcG9ydHNUb3VjaChlbGVtLm93bmVyRG9jdW1lbnQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wb3BDXy5zaG93cy5yYXdWYWx1ZSA9IGZhbHNlO1xuICAgIH1cbiAgICBvblBvcHVwQ2hpbGRLZXlkb3duXyhldikge1xuICAgICAgICBpZiAodGhpcy5wb3BDXykge1xuICAgICAgICAgICAgaWYgKGV2LmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBvcENfLnNob3dzLnJhd1ZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy52aWV3LnBpY2tlckVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmIChldi5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zd2F0Y2hDXy52aWV3LmJ1dHRvbkVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gY29sb3JUb1JnYk51bWJlcih2YWx1ZSkge1xuICAgIHJldHVybiByZW1vdmVBbHBoYUNvbXBvbmVudCh2YWx1ZS5nZXRDb21wb25lbnRzKCdyZ2InKSkucmVkdWNlKChyZXN1bHQsIGNvbXApID0+IHtcbiAgICAgICAgcmV0dXJuIChyZXN1bHQgPDwgOCkgfCAoTWF0aC5mbG9vcihjb21wKSAmIDB4ZmYpO1xuICAgIH0sIDApO1xufVxuZnVuY3Rpb24gY29sb3JUb1JnYmFOdW1iZXIodmFsdWUpIHtcbiAgICByZXR1cm4gKHZhbHVlLmdldENvbXBvbmVudHMoJ3JnYicpLnJlZHVjZSgocmVzdWx0LCBjb21wLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBoZXggPSBNYXRoLmZsb29yKGluZGV4ID09PSAzID8gY29tcCAqIDI1NSA6IGNvbXApICYgMHhmZjtcbiAgICAgICAgcmV0dXJuIChyZXN1bHQgPDwgOCkgfCBoZXg7XG4gICAgfSwgMCkgPj4+IDApO1xufVxuZnVuY3Rpb24gbnVtYmVyVG9SZ2JDb2xvcihudW0pIHtcbiAgICByZXR1cm4gbmV3IEludENvbG9yKFsobnVtID4+IDE2KSAmIDB4ZmYsIChudW0gPj4gOCkgJiAweGZmLCBudW0gJiAweGZmXSwgJ3JnYicpO1xufVxuZnVuY3Rpb24gbnVtYmVyVG9SZ2JhQ29sb3IobnVtKSB7XG4gICAgcmV0dXJuIG5ldyBJbnRDb2xvcihbXG4gICAgICAgIChudW0gPj4gMjQpICYgMHhmZixcbiAgICAgICAgKG51bSA+PiAxNikgJiAweGZmLFxuICAgICAgICAobnVtID4+IDgpICYgMHhmZixcbiAgICAgICAgbWFwUmFuZ2UobnVtICYgMHhmZiwgMCwgMjU1LCAwLCAxKSxcbiAgICBdLCAncmdiJyk7XG59XG5mdW5jdGlvbiBjb2xvckZyb21SZ2JOdW1iZXIodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJykge1xuICAgICAgICByZXR1cm4gSW50Q29sb3IuYmxhY2soKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bWJlclRvUmdiQ29sb3IodmFsdWUpO1xufVxuZnVuY3Rpb24gY29sb3JGcm9tUmdiYU51bWJlcih2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiBJbnRDb2xvci5ibGFjaygpO1xuICAgIH1cbiAgICByZXR1cm4gbnVtYmVyVG9SZ2JhQ29sb3IodmFsdWUpO1xufVxuXG5mdW5jdGlvbiBpc1JnYkNvbG9yQ29tcG9uZW50KG9iaiwga2V5KSB7XG4gICAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnIHx8IGlzRW1wdHkob2JqKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBrZXkgaW4gb2JqICYmIHR5cGVvZiBvYmpba2V5XSA9PT0gJ251bWJlcic7XG59XG5mdW5jdGlvbiBpc1JnYkNvbG9yT2JqZWN0KG9iaikge1xuICAgIHJldHVybiAoaXNSZ2JDb2xvckNvbXBvbmVudChvYmosICdyJykgJiZcbiAgICAgICAgaXNSZ2JDb2xvckNvbXBvbmVudChvYmosICdnJykgJiZcbiAgICAgICAgaXNSZ2JDb2xvckNvbXBvbmVudChvYmosICdiJykpO1xufVxuZnVuY3Rpb24gaXNSZ2JhQ29sb3JPYmplY3Qob2JqKSB7XG4gICAgcmV0dXJuIGlzUmdiQ29sb3JPYmplY3Qob2JqKSAmJiBpc1JnYkNvbG9yQ29tcG9uZW50KG9iaiwgJ2EnKTtcbn1cbmZ1bmN0aW9uIGlzQ29sb3JPYmplY3Qob2JqKSB7XG4gICAgcmV0dXJuIGlzUmdiQ29sb3JPYmplY3Qob2JqKTtcbn1cbmZ1bmN0aW9uIGVxdWFsc0NvbG9yKHYxLCB2Mikge1xuICAgIGlmICh2MS5tb2RlICE9PSB2Mi5tb2RlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHYxLnR5cGUgIT09IHYyLnR5cGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBjb21wczEgPSB2MS5nZXRDb21wb25lbnRzKCk7XG4gICAgY29uc3QgY29tcHMyID0gdjIuZ2V0Q29tcG9uZW50cygpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29tcHMxLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjb21wczFbaV0gIT09IGNvbXBzMltpXSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gY3JlYXRlQ29sb3JDb21wb25lbnRzRnJvbVJnYk9iamVjdChvYmopIHtcbiAgICByZXR1cm4gJ2EnIGluIG9iaiA/IFtvYmouciwgb2JqLmcsIG9iai5iLCBvYmouYV0gOiBbb2JqLnIsIG9iai5nLCBvYmouYl07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbG9yU3RyaW5nV3JpdGVyKGZvcm1hdCkge1xuICAgIGNvbnN0IHN0cmluZ2lmeSA9IGZpbmRDb2xvclN0cmluZ2lmaWVyKGZvcm1hdCk7XG4gICAgcmV0dXJuIHN0cmluZ2lmeVxuICAgICAgICA/ICh0YXJnZXQsIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB3cml0ZVByaW1pdGl2ZSh0YXJnZXQsIHN0cmluZ2lmeSh2YWx1ZSkpO1xuICAgICAgICB9XG4gICAgICAgIDogbnVsbDtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUNvbG9yTnVtYmVyV3JpdGVyKHN1cHBvcnRzQWxwaGEpIHtcbiAgICBjb25zdCBjb2xvclRvTnVtYmVyID0gc3VwcG9ydHNBbHBoYSA/IGNvbG9yVG9SZ2JhTnVtYmVyIDogY29sb3JUb1JnYk51bWJlcjtcbiAgICByZXR1cm4gKHRhcmdldCwgdmFsdWUpID0+IHtcbiAgICAgICAgd3JpdGVQcmltaXRpdmUodGFyZ2V0LCBjb2xvclRvTnVtYmVyKHZhbHVlKSk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHdyaXRlUmdiYUNvbG9yT2JqZWN0KHRhcmdldCwgdmFsdWUsIHR5cGUpIHtcbiAgICBjb25zdCBjYyA9IG1hcENvbG9yVHlwZSh2YWx1ZSwgdHlwZSk7XG4gICAgY29uc3Qgb2JqID0gY2MudG9SZ2JhT2JqZWN0KCk7XG4gICAgdGFyZ2V0LndyaXRlUHJvcGVydHkoJ3InLCBvYmoucik7XG4gICAgdGFyZ2V0LndyaXRlUHJvcGVydHkoJ2cnLCBvYmouZyk7XG4gICAgdGFyZ2V0LndyaXRlUHJvcGVydHkoJ2InLCBvYmouYik7XG4gICAgdGFyZ2V0LndyaXRlUHJvcGVydHkoJ2EnLCBvYmouYSk7XG59XG5mdW5jdGlvbiB3cml0ZVJnYkNvbG9yT2JqZWN0KHRhcmdldCwgdmFsdWUsIHR5cGUpIHtcbiAgICBjb25zdCBjYyA9IG1hcENvbG9yVHlwZSh2YWx1ZSwgdHlwZSk7XG4gICAgY29uc3Qgb2JqID0gY2MudG9SZ2JhT2JqZWN0KCk7XG4gICAgdGFyZ2V0LndyaXRlUHJvcGVydHkoJ3InLCBvYmoucik7XG4gICAgdGFyZ2V0LndyaXRlUHJvcGVydHkoJ2cnLCBvYmouZyk7XG4gICAgdGFyZ2V0LndyaXRlUHJvcGVydHkoJ2InLCBvYmouYik7XG59XG5mdW5jdGlvbiBjcmVhdGVDb2xvck9iamVjdFdyaXRlcihzdXBwb3J0c0FscGhhLCB0eXBlKSB7XG4gICAgcmV0dXJuICh0YXJnZXQsIGluVmFsdWUpID0+IHtcbiAgICAgICAgaWYgKHN1cHBvcnRzQWxwaGEpIHtcbiAgICAgICAgICAgIHdyaXRlUmdiYUNvbG9yT2JqZWN0KHRhcmdldCwgaW5WYWx1ZSwgdHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB3cml0ZVJnYkNvbG9yT2JqZWN0KHRhcmdldCwgaW5WYWx1ZSwgdHlwZSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5mdW5jdGlvbiBzaG91bGRTdXBwb3J0QWxwaGEkMShpbnB1dFBhcmFtcykge1xuICAgIHZhciBfYTtcbiAgICBpZiAoKF9hID0gaW5wdXRQYXJhbXMgPT09IG51bGwgfHwgaW5wdXRQYXJhbXMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGlucHV0UGFyYW1zLmNvbG9yKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuYWxwaGEpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUZvcm1hdHRlciQxKHN1cHBvcnRzQWxwaGEpIHtcbiAgICByZXR1cm4gc3VwcG9ydHNBbHBoYVxuICAgICAgICA/ICh2KSA9PiBjb2xvclRvSGV4UmdiYVN0cmluZyh2LCAnMHgnKVxuICAgICAgICA6ICh2KSA9PiBjb2xvclRvSGV4UmdiU3RyaW5nKHYsICcweCcpO1xufVxuZnVuY3Rpb24gaXNGb3JDb2xvcihwYXJhbXMpIHtcbiAgICBpZiAoJ2NvbG9yJyBpbiBwYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChwYXJhbXMudmlldyA9PT0gJ2NvbG9yJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuY29uc3QgTnVtYmVyQ29sb3JJbnB1dFBsdWdpbiA9IGNyZWF0ZVBsdWdpbih7XG4gICAgaWQ6ICdpbnB1dC1jb2xvci1udW1iZXInLFxuICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgYWNjZXB0OiAodmFsdWUsIHBhcmFtcykgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc0ZvckNvbG9yKHBhcmFtcykpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlQ29sb3JJbnB1dFBhcmFtcyhwYXJhbXMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICBpbml0aWFsVmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgIHBhcmFtczogT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCByZXN1bHQpLCB7IHN1cHBvcnRzQWxwaGE6IHNob3VsZFN1cHBvcnRBbHBoYSQxKHBhcmFtcykgfSksXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA6IG51bGw7XG4gICAgfSxcbiAgICBiaW5kaW5nOiB7XG4gICAgICAgIHJlYWRlcjogKGFyZ3MpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhcmdzLnBhcmFtcy5zdXBwb3J0c0FscGhhXG4gICAgICAgICAgICAgICAgPyBjb2xvckZyb21SZ2JhTnVtYmVyXG4gICAgICAgICAgICAgICAgOiBjb2xvckZyb21SZ2JOdW1iZXI7XG4gICAgICAgIH0sXG4gICAgICAgIGVxdWFsczogZXF1YWxzQ29sb3IsXG4gICAgICAgIHdyaXRlcjogKGFyZ3MpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVDb2xvck51bWJlcldyaXRlcihhcmdzLnBhcmFtcy5zdXBwb3J0c0FscGhhKTtcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIGNvbnRyb2xsZXI6IChhcmdzKSA9PiB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIHJldHVybiBuZXcgQ29sb3JDb250cm9sbGVyKGFyZ3MuZG9jdW1lbnQsIHtcbiAgICAgICAgICAgIGNvbG9yVHlwZTogJ2ludCcsXG4gICAgICAgICAgICBleHBhbmRlZDogKF9hID0gYXJncy5wYXJhbXMuZXhwYW5kZWQpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGZhbHNlLFxuICAgICAgICAgICAgZm9ybWF0dGVyOiBjcmVhdGVGb3JtYXR0ZXIkMShhcmdzLnBhcmFtcy5zdXBwb3J0c0FscGhhKSxcbiAgICAgICAgICAgIHBhcnNlcjogY3JlYXRlQ29sb3JTdHJpbmdQYXJzZXIoJ2ludCcpLFxuICAgICAgICAgICAgcGlja2VyTGF5b3V0OiAoX2IgPSBhcmdzLnBhcmFtcy5waWNrZXIpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6ICdwb3B1cCcsXG4gICAgICAgICAgICBzdXBwb3J0c0FscGhhOiBhcmdzLnBhcmFtcy5zdXBwb3J0c0FscGhhLFxuICAgICAgICAgICAgdmFsdWU6IGFyZ3MudmFsdWUsXG4gICAgICAgICAgICB2aWV3UHJvcHM6IGFyZ3Mudmlld1Byb3BzLFxuICAgICAgICB9KTtcbiAgICB9LFxufSk7XG5cbmZ1bmN0aW9uIGNvbG9yRnJvbU9iamVjdCh2YWx1ZSwgdHlwZSkge1xuICAgIGlmICghaXNDb2xvck9iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG1hcENvbG9yVHlwZShJbnRDb2xvci5ibGFjaygpLCB0eXBlKTtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT09ICdpbnQnKSB7XG4gICAgICAgIGNvbnN0IGNvbXBzID0gY3JlYXRlQ29sb3JDb21wb25lbnRzRnJvbVJnYk9iamVjdCh2YWx1ZSk7XG4gICAgICAgIHJldHVybiBuZXcgSW50Q29sb3IoY29tcHMsICdyZ2InKTtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT09ICdmbG9hdCcpIHtcbiAgICAgICAgY29uc3QgY29tcHMgPSBjcmVhdGVDb2xvckNvbXBvbmVudHNGcm9tUmdiT2JqZWN0KHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdENvbG9yKGNvbXBzLCAncmdiJyk7XG4gICAgfVxuICAgIHJldHVybiBtYXBDb2xvclR5cGUoSW50Q29sb3IuYmxhY2soKSwgJ2ludCcpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRTdXBwb3J0QWxwaGEoaW5pdGlhbFZhbHVlKSB7XG4gICAgcmV0dXJuIGlzUmdiYUNvbG9yT2JqZWN0KGluaXRpYWxWYWx1ZSk7XG59XG5mdW5jdGlvbiBjcmVhdGVDb2xvck9iamVjdEJpbmRpbmdSZWFkZXIodHlwZSkge1xuICAgIHJldHVybiAodmFsdWUpID0+IHtcbiAgICAgICAgY29uc3QgYyA9IGNvbG9yRnJvbU9iamVjdCh2YWx1ZSwgdHlwZSk7XG4gICAgICAgIHJldHVybiBtYXBDb2xvclR5cGUoYywgJ2ludCcpO1xuICAgIH07XG59XG5mdW5jdGlvbiBjcmVhdGVDb2xvck9iamVjdEZvcm1hdHRlcihzdXBwb3J0c0FscGhhLCB0eXBlKSB7XG4gICAgcmV0dXJuICh2YWx1ZSkgPT4ge1xuICAgICAgICBpZiAoc3VwcG9ydHNBbHBoYSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbG9yVG9PYmplY3RSZ2JhU3RyaW5nKHZhbHVlLCB0eXBlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29sb3JUb09iamVjdFJnYlN0cmluZyh2YWx1ZSwgdHlwZSk7XG4gICAgfTtcbn1cbmNvbnN0IE9iamVjdENvbG9ySW5wdXRQbHVnaW4gPSBjcmVhdGVQbHVnaW4oe1xuICAgIGlkOiAnaW5wdXQtY29sb3Itb2JqZWN0JyxcbiAgICB0eXBlOiAnaW5wdXQnLFxuICAgIGFjY2VwdDogKHZhbHVlLCBwYXJhbXMpID0+IHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAoIWlzQ29sb3JPYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXN1bHQgPSBwYXJzZUNvbG9ySW5wdXRQYXJhbXMocGFyYW1zKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgaW5pdGlhbFZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgcmVzdWx0KSwgeyBjb2xvclR5cGU6IChfYSA9IGV4dHJhY3RDb2xvclR5cGUocGFyYW1zKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogJ2ludCcgfSksXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA6IG51bGw7XG4gICAgfSxcbiAgICBiaW5kaW5nOiB7XG4gICAgICAgIHJlYWRlcjogKGFyZ3MpID0+IGNyZWF0ZUNvbG9yT2JqZWN0QmluZGluZ1JlYWRlcihhcmdzLnBhcmFtcy5jb2xvclR5cGUpLFxuICAgICAgICBlcXVhbHM6IGVxdWFsc0NvbG9yLFxuICAgICAgICB3cml0ZXI6IChhcmdzKSA9PiBjcmVhdGVDb2xvck9iamVjdFdyaXRlcihzaG91bGRTdXBwb3J0QWxwaGEoYXJncy5pbml0aWFsVmFsdWUpLCBhcmdzLnBhcmFtcy5jb2xvclR5cGUpLFxuICAgIH0sXG4gICAgY29udHJvbGxlcjogKGFyZ3MpID0+IHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgY29uc3Qgc3VwcG9ydHNBbHBoYSA9IGlzUmdiYUNvbG9yT2JqZWN0KGFyZ3MuaW5pdGlhbFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBDb2xvckNvbnRyb2xsZXIoYXJncy5kb2N1bWVudCwge1xuICAgICAgICAgICAgY29sb3JUeXBlOiBhcmdzLnBhcmFtcy5jb2xvclR5cGUsXG4gICAgICAgICAgICBleHBhbmRlZDogKF9hID0gYXJncy5wYXJhbXMuZXhwYW5kZWQpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGZhbHNlLFxuICAgICAgICAgICAgZm9ybWF0dGVyOiBjcmVhdGVDb2xvck9iamVjdEZvcm1hdHRlcihzdXBwb3J0c0FscGhhLCBhcmdzLnBhcmFtcy5jb2xvclR5cGUpLFxuICAgICAgICAgICAgcGFyc2VyOiBjcmVhdGVDb2xvclN0cmluZ1BhcnNlcignaW50JyksXG4gICAgICAgICAgICBwaWNrZXJMYXlvdXQ6IChfYiA9IGFyZ3MucGFyYW1zLnBpY2tlcikgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogJ3BvcHVwJyxcbiAgICAgICAgICAgIHN1cHBvcnRzQWxwaGE6IHN1cHBvcnRzQWxwaGEsXG4gICAgICAgICAgICB2YWx1ZTogYXJncy52YWx1ZSxcbiAgICAgICAgICAgIHZpZXdQcm9wczogYXJncy52aWV3UHJvcHMsXG4gICAgICAgIH0pO1xuICAgIH0sXG59KTtcblxuY29uc3QgU3RyaW5nQ29sb3JJbnB1dFBsdWdpbiA9IGNyZWF0ZVBsdWdpbih7XG4gICAgaWQ6ICdpbnB1dC1jb2xvci1zdHJpbmcnLFxuICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgYWNjZXB0OiAodmFsdWUsIHBhcmFtcykgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmFtcy52aWV3ID09PSAndGV4dCcpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZvcm1hdCA9IGRldGVjdFN0cmluZ0NvbG9yRm9ybWF0KHZhbHVlLCBleHRyYWN0Q29sb3JUeXBlKHBhcmFtcykpO1xuICAgICAgICBpZiAoIWZvcm1hdCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3RyaW5naWZpZXIgPSBmaW5kQ29sb3JTdHJpbmdpZmllcihmb3JtYXQpO1xuICAgICAgICBpZiAoIXN0cmluZ2lmaWVyKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXN1bHQgPSBwYXJzZUNvbG9ySW5wdXRQYXJhbXMocGFyYW1zKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgaW5pdGlhbFZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgcmVzdWx0KSwgeyBmb3JtYXQ6IGZvcm1hdCwgc3RyaW5naWZpZXI6IHN0cmluZ2lmaWVyIH0pLFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgOiBudWxsO1xuICAgIH0sXG4gICAgYmluZGluZzoge1xuICAgICAgICByZWFkZXI6ICgpID0+IHJlYWRJbnRDb2xvclN0cmluZyxcbiAgICAgICAgZXF1YWxzOiBlcXVhbHNDb2xvcixcbiAgICAgICAgd3JpdGVyOiAoYXJncykgPT4ge1xuICAgICAgICAgICAgY29uc3Qgd3JpdGVyID0gY3JlYXRlQ29sb3JTdHJpbmdXcml0ZXIoYXJncy5wYXJhbXMuZm9ybWF0KTtcbiAgICAgICAgICAgIGlmICghd3JpdGVyKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgVHBFcnJvci5ub3RCaW5kYWJsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHdyaXRlcjtcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIGNvbnRyb2xsZXI6IChhcmdzKSA9PiB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIHJldHVybiBuZXcgQ29sb3JDb250cm9sbGVyKGFyZ3MuZG9jdW1lbnQsIHtcbiAgICAgICAgICAgIGNvbG9yVHlwZTogYXJncy5wYXJhbXMuZm9ybWF0LnR5cGUsXG4gICAgICAgICAgICBleHBhbmRlZDogKF9hID0gYXJncy5wYXJhbXMuZXhwYW5kZWQpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGZhbHNlLFxuICAgICAgICAgICAgZm9ybWF0dGVyOiBhcmdzLnBhcmFtcy5zdHJpbmdpZmllcixcbiAgICAgICAgICAgIHBhcnNlcjogY3JlYXRlQ29sb3JTdHJpbmdQYXJzZXIoJ2ludCcpLFxuICAgICAgICAgICAgcGlja2VyTGF5b3V0OiAoX2IgPSBhcmdzLnBhcmFtcy5waWNrZXIpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6ICdwb3B1cCcsXG4gICAgICAgICAgICBzdXBwb3J0c0FscGhhOiBhcmdzLnBhcmFtcy5mb3JtYXQuYWxwaGEsXG4gICAgICAgICAgICB2YWx1ZTogYXJncy52YWx1ZSxcbiAgICAgICAgICAgIHZpZXdQcm9wczogYXJncy52aWV3UHJvcHMsXG4gICAgICAgIH0pO1xuICAgIH0sXG59KTtcblxuY2xhc3MgUG9pbnROZENvbnN0cmFpbnQge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBjb25maWcuY29tcG9uZW50cztcbiAgICAgICAgdGhpcy5hc21fID0gY29uZmlnLmFzc2VtYmx5O1xuICAgIH1cbiAgICBjb25zdHJhaW4odmFsdWUpIHtcbiAgICAgICAgY29uc3QgY29tcHMgPSB0aGlzLmFzbV9cbiAgICAgICAgICAgIC50b0NvbXBvbmVudHModmFsdWUpXG4gICAgICAgICAgICAubWFwKChjb21wLCBpbmRleCkgPT4geyB2YXIgX2EsIF9iOyByZXR1cm4gKF9iID0gKF9hID0gdGhpcy5jb21wb25lbnRzW2luZGV4XSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNvbnN0cmFpbihjb21wKSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogY29tcDsgfSk7XG4gICAgICAgIHJldHVybiB0aGlzLmFzbV8uZnJvbUNvbXBvbmVudHMoY29tcHMpO1xuICAgIH1cbn1cblxuY29uc3QgY24kNiA9IENsYXNzTmFtZSgncG5kdHh0Jyk7XG5jbGFzcyBQb2ludE5kVGV4dFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKGRvYywgY29uZmlnKSB7XG4gICAgICAgIHRoaXMudGV4dFZpZXdzID0gY29uZmlnLnRleHRWaWV3cztcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbiQ2KCkpO1xuICAgICAgICB0aGlzLnRleHRWaWV3cy5mb3JFYWNoKCh2KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBheGlzRWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGF4aXNFbGVtLmNsYXNzTGlzdC5hZGQoY24kNignYScpKTtcbiAgICAgICAgICAgIGF4aXNFbGVtLmFwcGVuZENoaWxkKHYuZWxlbWVudCk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoYXhpc0VsZW0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUF4aXNDb250cm9sbGVyKGRvYywgY29uZmlnLCBpbmRleCkge1xuICAgIHJldHVybiBuZXcgTnVtYmVyVGV4dENvbnRyb2xsZXIoZG9jLCB7XG4gICAgICAgIGFycmF5UG9zaXRpb246IGluZGV4ID09PSAwID8gJ2ZzdCcgOiBpbmRleCA9PT0gY29uZmlnLmF4ZXMubGVuZ3RoIC0gMSA/ICdsc3QnIDogJ21pZCcsXG4gICAgICAgIHBhcnNlcjogY29uZmlnLnBhcnNlcixcbiAgICAgICAgcHJvcHM6IGNvbmZpZy5heGVzW2luZGV4XS50ZXh0UHJvcHMsXG4gICAgICAgIHZhbHVlOiBjcmVhdGVWYWx1ZSgwLCB7XG4gICAgICAgICAgICBjb25zdHJhaW50OiBjb25maWcuYXhlc1tpbmRleF0uY29uc3RyYWludCxcbiAgICAgICAgfSksXG4gICAgICAgIHZpZXdQcm9wczogY29uZmlnLnZpZXdQcm9wcyxcbiAgICB9KTtcbn1cbmNsYXNzIFBvaW50TmRUZXh0Q29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoZG9jLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IGNvbmZpZy52YWx1ZTtcbiAgICAgICAgdGhpcy52aWV3UHJvcHMgPSBjb25maWcudmlld1Byb3BzO1xuICAgICAgICB0aGlzLmFjc18gPSBjb25maWcuYXhlcy5tYXAoKF8sIGluZGV4KSA9PiBjcmVhdGVBeGlzQ29udHJvbGxlcihkb2MsIGNvbmZpZywgaW5kZXgpKTtcbiAgICAgICAgdGhpcy5hY3NfLmZvckVhY2goKGMsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25uZWN0VmFsdWVzKHtcbiAgICAgICAgICAgICAgICBwcmltYXJ5OiB0aGlzLnZhbHVlLFxuICAgICAgICAgICAgICAgIHNlY29uZGFyeTogYy52YWx1ZSxcbiAgICAgICAgICAgICAgICBmb3J3YXJkOiAocCkgPT4gY29uZmlnLmFzc2VtYmx5LnRvQ29tcG9uZW50cyhwKVtpbmRleF0sXG4gICAgICAgICAgICAgICAgYmFja3dhcmQ6IChwLCBzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBzID0gY29uZmlnLmFzc2VtYmx5LnRvQ29tcG9uZW50cyhwKTtcbiAgICAgICAgICAgICAgICAgICAgY29tcHNbaW5kZXhdID0gcztcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZy5hc3NlbWJseS5mcm9tQ29tcG9uZW50cyhjb21wcyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy52aWV3ID0gbmV3IFBvaW50TmRUZXh0Vmlldyhkb2MsIHtcbiAgICAgICAgICAgIHRleHRWaWV3czogdGhpcy5hY3NfLm1hcCgoYWMpID0+IGFjLnZpZXcpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0IHRleHRDb250cm9sbGVycygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWNzXztcbiAgICB9XG59XG5cbmNsYXNzIFNsaWRlcklucHV0QmluZGluZ0FwaSBleHRlbmRzIEJpbmRpbmdBcGkge1xuICAgIGdldCBtYXgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXIudmFsdWVDb250cm9sbGVyLnNsaWRlckNvbnRyb2xsZXIucHJvcHMuZ2V0KCdtYXgnKTtcbiAgICB9XG4gICAgc2V0IG1heChtYXgpIHtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnZhbHVlQ29udHJvbGxlci5zbGlkZXJDb250cm9sbGVyLnByb3BzLnNldCgnbWF4JywgbWF4KTtcbiAgICB9XG4gICAgZ2V0IG1pbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlci52YWx1ZUNvbnRyb2xsZXIuc2xpZGVyQ29udHJvbGxlci5wcm9wcy5nZXQoJ21pbicpO1xuICAgIH1cbiAgICBzZXQgbWluKG1heCkge1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIudmFsdWVDb250cm9sbGVyLnNsaWRlckNvbnRyb2xsZXIucHJvcHMuc2V0KCdtaW4nLCBtYXgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29uc3RyYWludCQ0KHBhcmFtcywgaW5pdGlhbFZhbHVlKSB7XG4gICAgY29uc3QgY29uc3RyYWludHMgPSBbXTtcbiAgICBjb25zdCBzYyA9IGNyZWF0ZVN0ZXBDb25zdHJhaW50KHBhcmFtcywgaW5pdGlhbFZhbHVlKTtcbiAgICBpZiAoc2MpIHtcbiAgICAgICAgY29uc3RyYWludHMucHVzaChzYyk7XG4gICAgfVxuICAgIGNvbnN0IHJjID0gY3JlYXRlUmFuZ2VDb25zdHJhaW50KHBhcmFtcyk7XG4gICAgaWYgKHJjKSB7XG4gICAgICAgIGNvbnN0cmFpbnRzLnB1c2gocmMpO1xuICAgIH1cbiAgICBjb25zdCBsYyA9IGNyZWF0ZUxpc3RDb25zdHJhaW50KHBhcmFtcy5vcHRpb25zKTtcbiAgICBpZiAobGMpIHtcbiAgICAgICAgY29uc3RyYWludHMucHVzaChsYyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQ29tcG9zaXRlQ29uc3RyYWludChjb25zdHJhaW50cyk7XG59XG5jb25zdCBOdW1iZXJJbnB1dFBsdWdpbiA9IGNyZWF0ZVBsdWdpbih7XG4gICAgaWQ6ICdpbnB1dC1udW1iZXInLFxuICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgYWNjZXB0OiAodmFsdWUsIHBhcmFtcykgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VSZWNvcmQocGFyYW1zLCAocCkgPT4gKE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgY3JlYXRlTnVtYmVyVGV4dElucHV0UGFyYW1zUGFyc2VyKHApKSwgeyBvcHRpb25zOiBwLm9wdGlvbmFsLmN1c3RvbShwYXJzZUxpc3RPcHRpb25zKSwgcmVhZG9ubHk6IHAub3B0aW9uYWwuY29uc3RhbnQoZmFsc2UpIH0pKSk7XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgIGluaXRpYWxWYWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiByZXN1bHQsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA6IG51bGw7XG4gICAgfSxcbiAgICBiaW5kaW5nOiB7XG4gICAgICAgIHJlYWRlcjogKF9hcmdzKSA9PiBudW1iZXJGcm9tVW5rbm93bixcbiAgICAgICAgY29uc3RyYWludDogKGFyZ3MpID0+IGNyZWF0ZUNvbnN0cmFpbnQkNChhcmdzLnBhcmFtcywgYXJncy5pbml0aWFsVmFsdWUpLFxuICAgICAgICB3cml0ZXI6IChfYXJncykgPT4gd3JpdGVQcmltaXRpdmUsXG4gICAgfSxcbiAgICBjb250cm9sbGVyOiAoYXJncykgPT4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGFyZ3MudmFsdWU7XG4gICAgICAgIGNvbnN0IGMgPSBhcmdzLmNvbnN0cmFpbnQ7XG4gICAgICAgIGNvbnN0IGxjID0gYyAmJiBmaW5kQ29uc3RyYWludChjLCBMaXN0Q29uc3RyYWludCk7XG4gICAgICAgIGlmIChsYykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBMaXN0Q29udHJvbGxlcihhcmdzLmRvY3VtZW50LCB7XG4gICAgICAgICAgICAgICAgcHJvcHM6IG5ldyBWYWx1ZU1hcCh7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IGxjLnZhbHVlcy52YWx1ZSgnb3B0aW9ucycpLFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICB2aWV3UHJvcHM6IGFyZ3Mudmlld1Byb3BzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGV4dFByb3BzT2JqID0gY3JlYXRlTnVtYmVyVGV4dFByb3BzT2JqZWN0KGFyZ3MucGFyYW1zLCB2YWx1ZS5yYXdWYWx1ZSk7XG4gICAgICAgIGNvbnN0IGRyYyA9IGMgJiYgZmluZENvbnN0cmFpbnQoYywgRGVmaW5pdGVSYW5nZUNvbnN0cmFpbnQpO1xuICAgICAgICBpZiAoZHJjKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFNsaWRlclRleHRDb250cm9sbGVyKGFyZ3MuZG9jdW1lbnQsIE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgY3JlYXRlU2xpZGVyVGV4dFByb3BzKE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgdGV4dFByb3BzT2JqKSwgeyBrZXlTY2FsZTogY3JlYXRlVmFsdWUodGV4dFByb3BzT2JqLmtleVNjYWxlKSwgbWF4OiBkcmMudmFsdWVzLnZhbHVlKCdtYXgnKSwgbWluOiBkcmMudmFsdWVzLnZhbHVlKCdtaW4nKSB9KSkpLCB7IHBhcnNlcjogcGFyc2VOdW1iZXIsIHZhbHVlOiB2YWx1ZSwgdmlld1Byb3BzOiBhcmdzLnZpZXdQcm9wcyB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBOdW1iZXJUZXh0Q29udHJvbGxlcihhcmdzLmRvY3VtZW50LCB7XG4gICAgICAgICAgICBwYXJzZXI6IHBhcnNlTnVtYmVyLFxuICAgICAgICAgICAgcHJvcHM6IFZhbHVlTWFwLmZyb21PYmplY3QodGV4dFByb3BzT2JqKSxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIHZpZXdQcm9wczogYXJncy52aWV3UHJvcHMsXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgYXBpKGFyZ3MpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhcmdzLmNvbnRyb2xsZXIudmFsdWUucmF3VmFsdWUgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJncy5jb250cm9sbGVyLnZhbHVlQ29udHJvbGxlciBpbnN0YW5jZW9mIFNsaWRlclRleHRDb250cm9sbGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFNsaWRlcklucHV0QmluZGluZ0FwaShhcmdzLmNvbnRyb2xsZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmdzLmNvbnRyb2xsZXIudmFsdWVDb250cm9sbGVyIGluc3RhbmNlb2YgTGlzdENvbnRyb2xsZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTGlzdElucHV0QmluZGluZ0FwaShhcmdzLmNvbnRyb2xsZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG59KTtcblxuY2xhc3MgUG9pbnQyZCB7XG4gICAgY29uc3RydWN0b3IoeCA9IDAsIHkgPSAwKSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuICAgIGdldENvbXBvbmVudHMoKSB7XG4gICAgICAgIHJldHVybiBbdGhpcy54LCB0aGlzLnldO1xuICAgIH1cbiAgICBzdGF0aWMgaXNPYmplY3Qob2JqKSB7XG4gICAgICAgIGlmIChpc0VtcHR5KG9iaikpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB4ID0gb2JqLng7XG4gICAgICAgIGNvbnN0IHkgPSBvYmoueTtcbiAgICAgICAgaWYgKHR5cGVvZiB4ICE9PSAnbnVtYmVyJyB8fCB0eXBlb2YgeSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgc3RhdGljIGVxdWFscyh2MSwgdjIpIHtcbiAgICAgICAgcmV0dXJuIHYxLnggPT09IHYyLnggJiYgdjEueSA9PT0gdjIueTtcbiAgICB9XG4gICAgdG9PYmplY3QoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiB0aGlzLngsXG4gICAgICAgICAgICB5OiB0aGlzLnksXG4gICAgICAgIH07XG4gICAgfVxufVxuY29uc3QgUG9pbnQyZEFzc2VtYmx5ID0ge1xuICAgIHRvQ29tcG9uZW50czogKHApID0+IHAuZ2V0Q29tcG9uZW50cygpLFxuICAgIGZyb21Db21wb25lbnRzOiAoY29tcHMpID0+IG5ldyBQb2ludDJkKC4uLmNvbXBzKSxcbn07XG5cbmNvbnN0IGNuJDUgPSBDbGFzc05hbWUoJ3AyZCcpO1xuY2xhc3MgUG9pbnQyZFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKGRvYywgY29uZmlnKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoY24kNSgpKTtcbiAgICAgICAgY29uZmlnLnZpZXdQcm9wcy5iaW5kQ2xhc3NNb2RpZmllcnModGhpcy5lbGVtZW50KTtcbiAgICAgICAgYmluZFZhbHVlKGNvbmZpZy5leHBhbmRlZCwgdmFsdWVUb0NsYXNzTmFtZSh0aGlzLmVsZW1lbnQsIGNuJDUodW5kZWZpbmVkLCAnZXhwYW5kZWQnKSkpO1xuICAgICAgICBjb25zdCBoZWFkRWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaGVhZEVsZW0uY2xhc3NMaXN0LmFkZChjbiQ1KCdoJykpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoaGVhZEVsZW0pO1xuICAgICAgICBjb25zdCBidXR0b25FbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBidXR0b25FbGVtLmNsYXNzTGlzdC5hZGQoY24kNSgnYicpKTtcbiAgICAgICAgYnV0dG9uRWxlbS5hcHBlbmRDaGlsZChjcmVhdGVTdmdJY29uRWxlbWVudChkb2MsICdwMmRwYWQnKSk7XG4gICAgICAgIGNvbmZpZy52aWV3UHJvcHMuYmluZERpc2FibGVkKGJ1dHRvbkVsZW0pO1xuICAgICAgICBoZWFkRWxlbS5hcHBlbmRDaGlsZChidXR0b25FbGVtKTtcbiAgICAgICAgdGhpcy5idXR0b25FbGVtZW50ID0gYnV0dG9uRWxlbTtcbiAgICAgICAgY29uc3QgdGV4dEVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRleHRFbGVtLmNsYXNzTGlzdC5hZGQoY24kNSgndCcpKTtcbiAgICAgICAgaGVhZEVsZW0uYXBwZW5kQ2hpbGQodGV4dEVsZW0pO1xuICAgICAgICB0aGlzLnRleHRFbGVtZW50ID0gdGV4dEVsZW07XG4gICAgICAgIGlmIChjb25maWcucGlja2VyTGF5b3V0ID09PSAnaW5saW5lJykge1xuICAgICAgICAgICAgY29uc3QgcGlja2VyRWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHBpY2tlckVsZW0uY2xhc3NMaXN0LmFkZChjbiQ1KCdwJykpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHBpY2tlckVsZW0pO1xuICAgICAgICAgICAgdGhpcy5waWNrZXJFbGVtZW50ID0gcGlja2VyRWxlbTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGlja2VyRWxlbWVudCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IGNuJDQgPSBDbGFzc05hbWUoJ3AyZHAnKTtcbmNsYXNzIFBvaW50MmRQaWNrZXJWaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihkb2MsIGNvbmZpZykge1xuICAgICAgICB0aGlzLm9uRm9sZGFibGVDaGFuZ2VfID0gdGhpcy5vbkZvbGRhYmxlQ2hhbmdlXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uUHJvcHNDaGFuZ2VfID0gdGhpcy5vblByb3BzQ2hhbmdlXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2VfID0gdGhpcy5vblZhbHVlQ2hhbmdlXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnByb3BzXyA9IGNvbmZpZy5wcm9wcztcbiAgICAgICAgdGhpcy5wcm9wc18uZW1pdHRlci5vbignY2hhbmdlJywgdGhpcy5vblByb3BzQ2hhbmdlXyk7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoY24kNCgpKTtcbiAgICAgICAgaWYgKGNvbmZpZy5sYXlvdXQgPT09ICdwb3B1cCcpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNuJDQodW5kZWZpbmVkLCAncCcpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25maWcudmlld1Byb3BzLmJpbmRDbGFzc01vZGlmaWVycyh0aGlzLmVsZW1lbnQpO1xuICAgICAgICBjb25zdCBwYWRFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBwYWRFbGVtLmNsYXNzTGlzdC5hZGQoY24kNCgncCcpKTtcbiAgICAgICAgY29uZmlnLnZpZXdQcm9wcy5iaW5kVGFiSW5kZXgocGFkRWxlbSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChwYWRFbGVtKTtcbiAgICAgICAgdGhpcy5wYWRFbGVtZW50ID0gcGFkRWxlbTtcbiAgICAgICAgY29uc3Qgc3ZnRWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50TlMoU1ZHX05TLCAnc3ZnJyk7XG4gICAgICAgIHN2Z0VsZW0uY2xhc3NMaXN0LmFkZChjbiQ0KCdnJykpO1xuICAgICAgICB0aGlzLnBhZEVsZW1lbnQuYXBwZW5kQ2hpbGQoc3ZnRWxlbSk7XG4gICAgICAgIHRoaXMuc3ZnRWxlbV8gPSBzdmdFbGVtO1xuICAgICAgICBjb25zdCB4QXhpc0VsZW0gPSBkb2MuY3JlYXRlRWxlbWVudE5TKFNWR19OUywgJ2xpbmUnKTtcbiAgICAgICAgeEF4aXNFbGVtLmNsYXNzTGlzdC5hZGQoY24kNCgnYXgnKSk7XG4gICAgICAgIHhBeGlzRWxlbS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneDEnLCAnMCcpO1xuICAgICAgICB4QXhpc0VsZW0uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3kxJywgJzUwJScpO1xuICAgICAgICB4QXhpc0VsZW0uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gyJywgJzEwMCUnKTtcbiAgICAgICAgeEF4aXNFbGVtLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5MicsICc1MCUnKTtcbiAgICAgICAgdGhpcy5zdmdFbGVtXy5hcHBlbmRDaGlsZCh4QXhpc0VsZW0pO1xuICAgICAgICBjb25zdCB5QXhpc0VsZW0gPSBkb2MuY3JlYXRlRWxlbWVudE5TKFNWR19OUywgJ2xpbmUnKTtcbiAgICAgICAgeUF4aXNFbGVtLmNsYXNzTGlzdC5hZGQoY24kNCgnYXgnKSk7XG4gICAgICAgIHlBeGlzRWxlbS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneDEnLCAnNTAlJyk7XG4gICAgICAgIHlBeGlzRWxlbS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneTEnLCAnMCcpO1xuICAgICAgICB5QXhpc0VsZW0uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gyJywgJzUwJScpO1xuICAgICAgICB5QXhpc0VsZW0uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3kyJywgJzEwMCUnKTtcbiAgICAgICAgdGhpcy5zdmdFbGVtXy5hcHBlbmRDaGlsZCh5QXhpc0VsZW0pO1xuICAgICAgICBjb25zdCBsaW5lRWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50TlMoU1ZHX05TLCAnbGluZScpO1xuICAgICAgICBsaW5lRWxlbS5jbGFzc0xpc3QuYWRkKGNuJDQoJ2wnKSk7XG4gICAgICAgIGxpbmVFbGVtLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4MScsICc1MCUnKTtcbiAgICAgICAgbGluZUVsZW0uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3kxJywgJzUwJScpO1xuICAgICAgICB0aGlzLnN2Z0VsZW1fLmFwcGVuZENoaWxkKGxpbmVFbGVtKTtcbiAgICAgICAgdGhpcy5saW5lRWxlbV8gPSBsaW5lRWxlbTtcbiAgICAgICAgY29uc3QgbWFya2VyRWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbWFya2VyRWxlbS5jbGFzc0xpc3QuYWRkKGNuJDQoJ20nKSk7XG4gICAgICAgIHRoaXMucGFkRWxlbWVudC5hcHBlbmRDaGlsZChtYXJrZXJFbGVtKTtcbiAgICAgICAgdGhpcy5tYXJrZXJFbGVtXyA9IG1hcmtlckVsZW07XG4gICAgICAgIGNvbmZpZy52YWx1ZS5lbWl0dGVyLm9uKCdjaGFuZ2UnLCB0aGlzLm9uVmFsdWVDaGFuZ2VfKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IGNvbmZpZy52YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVfKCk7XG4gICAgfVxuICAgIGdldCBhbGxGb2N1c2FibGVFbGVtZW50cygpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLnBhZEVsZW1lbnRdO1xuICAgIH1cbiAgICB1cGRhdGVfKCkge1xuICAgICAgICBjb25zdCBbeCwgeV0gPSB0aGlzLnZhbHVlLnJhd1ZhbHVlLmdldENvbXBvbmVudHMoKTtcbiAgICAgICAgY29uc3QgbWF4ID0gdGhpcy5wcm9wc18uZ2V0KCdtYXgnKTtcbiAgICAgICAgY29uc3QgcHggPSBtYXBSYW5nZSh4LCAtbWF4LCArbWF4LCAwLCAxMDApO1xuICAgICAgICBjb25zdCBweSA9IG1hcFJhbmdlKHksIC1tYXgsICttYXgsIDAsIDEwMCk7XG4gICAgICAgIGNvbnN0IGlweSA9IHRoaXMucHJvcHNfLmdldCgnaW52ZXJ0c1knKSA/IDEwMCAtIHB5IDogcHk7XG4gICAgICAgIHRoaXMubGluZUVsZW1fLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4MicsIGAke3B4fSVgKTtcbiAgICAgICAgdGhpcy5saW5lRWxlbV8uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3kyJywgYCR7aXB5fSVgKTtcbiAgICAgICAgdGhpcy5tYXJrZXJFbGVtXy5zdHlsZS5sZWZ0ID0gYCR7cHh9JWA7XG4gICAgICAgIHRoaXMubWFya2VyRWxlbV8uc3R5bGUudG9wID0gYCR7aXB5fSVgO1xuICAgIH1cbiAgICBvblZhbHVlQ2hhbmdlXygpIHtcbiAgICAgICAgdGhpcy51cGRhdGVfKCk7XG4gICAgfVxuICAgIG9uUHJvcHNDaGFuZ2VfKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZV8oKTtcbiAgICB9XG4gICAgb25Gb2xkYWJsZUNoYW5nZV8oKSB7XG4gICAgICAgIHRoaXMudXBkYXRlXygpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY29tcHV0ZU9mZnNldChldiwga2V5U2NhbGVzLCBpbnZlcnRzWSkge1xuICAgIHJldHVybiBbXG4gICAgICAgIGdldFN0ZXBGb3JLZXkoa2V5U2NhbGVzWzBdLCBnZXRIb3Jpem9udGFsU3RlcEtleXMoZXYpKSxcbiAgICAgICAgZ2V0U3RlcEZvcktleShrZXlTY2FsZXNbMV0sIGdldFZlcnRpY2FsU3RlcEtleXMoZXYpKSAqIChpbnZlcnRzWSA/IDEgOiAtMSksXG4gICAgXTtcbn1cbmNsYXNzIFBvaW50MmRQaWNrZXJDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihkb2MsIGNvbmZpZykge1xuICAgICAgICB0aGlzLm9uUGFkS2V5RG93bl8gPSB0aGlzLm9uUGFkS2V5RG93bl8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vblBhZEtleVVwXyA9IHRoaXMub25QYWRLZXlVcF8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vblBvaW50ZXJEb3duXyA9IHRoaXMub25Qb2ludGVyRG93bl8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vblBvaW50ZXJNb3ZlXyA9IHRoaXMub25Qb2ludGVyTW92ZV8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vblBvaW50ZXJVcF8gPSB0aGlzLm9uUG9pbnRlclVwXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnByb3BzID0gY29uZmlnLnByb3BzO1xuICAgICAgICB0aGlzLnZhbHVlID0gY29uZmlnLnZhbHVlO1xuICAgICAgICB0aGlzLnZpZXdQcm9wcyA9IGNvbmZpZy52aWV3UHJvcHM7XG4gICAgICAgIHRoaXMudmlldyA9IG5ldyBQb2ludDJkUGlja2VyVmlldyhkb2MsIHtcbiAgICAgICAgICAgIGxheW91dDogY29uZmlnLmxheW91dCxcbiAgICAgICAgICAgIHByb3BzOiB0aGlzLnByb3BzLFxuICAgICAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXG4gICAgICAgICAgICB2aWV3UHJvcHM6IHRoaXMudmlld1Byb3BzLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5wdEhhbmRsZXJfID0gbmV3IFBvaW50ZXJIYW5kbGVyKHRoaXMudmlldy5wYWRFbGVtZW50KTtcbiAgICAgICAgdGhpcy5wdEhhbmRsZXJfLmVtaXR0ZXIub24oJ2Rvd24nLCB0aGlzLm9uUG9pbnRlckRvd25fKTtcbiAgICAgICAgdGhpcy5wdEhhbmRsZXJfLmVtaXR0ZXIub24oJ21vdmUnLCB0aGlzLm9uUG9pbnRlck1vdmVfKTtcbiAgICAgICAgdGhpcy5wdEhhbmRsZXJfLmVtaXR0ZXIub24oJ3VwJywgdGhpcy5vblBvaW50ZXJVcF8pO1xuICAgICAgICB0aGlzLnZpZXcucGFkRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5vblBhZEtleURvd25fKTtcbiAgICAgICAgdGhpcy52aWV3LnBhZEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLm9uUGFkS2V5VXBfKTtcbiAgICB9XG4gICAgaGFuZGxlUG9pbnRlckV2ZW50XyhkLCBvcHRzKSB7XG4gICAgICAgIGlmICghZC5wb2ludCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1heCA9IHRoaXMucHJvcHMuZ2V0KCdtYXgnKTtcbiAgICAgICAgY29uc3QgcHggPSBtYXBSYW5nZShkLnBvaW50LngsIDAsIGQuYm91bmRzLndpZHRoLCAtbWF4LCArbWF4KTtcbiAgICAgICAgY29uc3QgcHkgPSBtYXBSYW5nZSh0aGlzLnByb3BzLmdldCgnaW52ZXJ0c1knKSA/IGQuYm91bmRzLmhlaWdodCAtIGQucG9pbnQueSA6IGQucG9pbnQueSwgMCwgZC5ib3VuZHMuaGVpZ2h0LCAtbWF4LCArbWF4KTtcbiAgICAgICAgdGhpcy52YWx1ZS5zZXRSYXdWYWx1ZShuZXcgUG9pbnQyZChweCwgcHkpLCBvcHRzKTtcbiAgICB9XG4gICAgb25Qb2ludGVyRG93bl8oZXYpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVQb2ludGVyRXZlbnRfKGV2LmRhdGEsIHtcbiAgICAgICAgICAgIGZvcmNlRW1pdDogZmFsc2UsXG4gICAgICAgICAgICBsYXN0OiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG9uUG9pbnRlck1vdmVfKGV2KSB7XG4gICAgICAgIHRoaXMuaGFuZGxlUG9pbnRlckV2ZW50Xyhldi5kYXRhLCB7XG4gICAgICAgICAgICBmb3JjZUVtaXQ6IGZhbHNlLFxuICAgICAgICAgICAgbGFzdDogZmFsc2UsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvblBvaW50ZXJVcF8oZXYpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVQb2ludGVyRXZlbnRfKGV2LmRhdGEsIHtcbiAgICAgICAgICAgIGZvcmNlRW1pdDogdHJ1ZSxcbiAgICAgICAgICAgIGxhc3Q6IHRydWUsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvblBhZEtleURvd25fKGV2KSB7XG4gICAgICAgIGlmIChpc0Fycm93S2V5KGV2LmtleSkpIHtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgW2R4LCBkeV0gPSBjb21wdXRlT2Zmc2V0KGV2LCBbdGhpcy5wcm9wcy5nZXQoJ3hLZXlTY2FsZScpLCB0aGlzLnByb3BzLmdldCgneUtleVNjYWxlJyldLCB0aGlzLnByb3BzLmdldCgnaW52ZXJ0c1knKSk7XG4gICAgICAgIGlmIChkeCA9PT0gMCAmJiBkeSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmFsdWUuc2V0UmF3VmFsdWUobmV3IFBvaW50MmQodGhpcy52YWx1ZS5yYXdWYWx1ZS54ICsgZHgsIHRoaXMudmFsdWUucmF3VmFsdWUueSArIGR5KSwge1xuICAgICAgICAgICAgZm9yY2VFbWl0OiBmYWxzZSxcbiAgICAgICAgICAgIGxhc3Q6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb25QYWRLZXlVcF8oZXYpIHtcbiAgICAgICAgY29uc3QgW2R4LCBkeV0gPSBjb21wdXRlT2Zmc2V0KGV2LCBbdGhpcy5wcm9wcy5nZXQoJ3hLZXlTY2FsZScpLCB0aGlzLnByb3BzLmdldCgneUtleVNjYWxlJyldLCB0aGlzLnByb3BzLmdldCgnaW52ZXJ0c1knKSk7XG4gICAgICAgIGlmIChkeCA9PT0gMCAmJiBkeSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmFsdWUuc2V0UmF3VmFsdWUodGhpcy52YWx1ZS5yYXdWYWx1ZSwge1xuICAgICAgICAgICAgZm9yY2VFbWl0OiB0cnVlLFxuICAgICAgICAgICAgbGFzdDogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5jbGFzcyBQb2ludDJkQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoZG9jLCBjb25maWcpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgdGhpcy5vblBvcHVwQ2hpbGRCbHVyXyA9IHRoaXMub25Qb3B1cENoaWxkQmx1cl8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vblBvcHVwQ2hpbGRLZXlkb3duXyA9IHRoaXMub25Qb3B1cENoaWxkS2V5ZG93bl8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vblBhZEJ1dHRvbkJsdXJfID0gdGhpcy5vblBhZEJ1dHRvbkJsdXJfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25QYWRCdXR0b25DbGlja18gPSB0aGlzLm9uUGFkQnV0dG9uQ2xpY2tfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMudmFsdWUgPSBjb25maWcudmFsdWU7XG4gICAgICAgIHRoaXMudmlld1Byb3BzID0gY29uZmlnLnZpZXdQcm9wcztcbiAgICAgICAgdGhpcy5mb2xkYWJsZV8gPSBGb2xkYWJsZS5jcmVhdGUoY29uZmlnLmV4cGFuZGVkKTtcbiAgICAgICAgdGhpcy5wb3BDXyA9XG4gICAgICAgICAgICBjb25maWcucGlja2VyTGF5b3V0ID09PSAncG9wdXAnXG4gICAgICAgICAgICAgICAgPyBuZXcgUG9wdXBDb250cm9sbGVyKGRvYywge1xuICAgICAgICAgICAgICAgICAgICB2aWV3UHJvcHM6IHRoaXMudmlld1Byb3BzLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgOiBudWxsO1xuICAgICAgICBjb25zdCBwYWRDID0gbmV3IFBvaW50MmRQaWNrZXJDb250cm9sbGVyKGRvYywge1xuICAgICAgICAgICAgbGF5b3V0OiBjb25maWcucGlja2VyTGF5b3V0LFxuICAgICAgICAgICAgcHJvcHM6IG5ldyBWYWx1ZU1hcCh7XG4gICAgICAgICAgICAgICAgaW52ZXJ0c1k6IGNyZWF0ZVZhbHVlKGNvbmZpZy5pbnZlcnRzWSksXG4gICAgICAgICAgICAgICAgbWF4OiBjcmVhdGVWYWx1ZShjb25maWcubWF4KSxcbiAgICAgICAgICAgICAgICB4S2V5U2NhbGU6IGNvbmZpZy5heGVzWzBdLnRleHRQcm9wcy52YWx1ZSgna2V5U2NhbGUnKSxcbiAgICAgICAgICAgICAgICB5S2V5U2NhbGU6IGNvbmZpZy5heGVzWzFdLnRleHRQcm9wcy52YWx1ZSgna2V5U2NhbGUnKSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXG4gICAgICAgICAgICB2aWV3UHJvcHM6IHRoaXMudmlld1Byb3BzLFxuICAgICAgICB9KTtcbiAgICAgICAgcGFkQy52aWV3LmFsbEZvY3VzYWJsZUVsZW1lbnRzLmZvckVhY2goKGVsZW0pID0+IHtcbiAgICAgICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMub25Qb3B1cENoaWxkQmx1cl8pO1xuICAgICAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5vblBvcHVwQ2hpbGRLZXlkb3duXyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnBpY2tlckNfID0gcGFkQztcbiAgICAgICAgdGhpcy50ZXh0Q18gPSBuZXcgUG9pbnROZFRleHRDb250cm9sbGVyKGRvYywge1xuICAgICAgICAgICAgYXNzZW1ibHk6IFBvaW50MmRBc3NlbWJseSxcbiAgICAgICAgICAgIGF4ZXM6IGNvbmZpZy5heGVzLFxuICAgICAgICAgICAgcGFyc2VyOiBjb25maWcucGFyc2VyLFxuICAgICAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXG4gICAgICAgICAgICB2aWV3UHJvcHM6IHRoaXMudmlld1Byb3BzLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy52aWV3ID0gbmV3IFBvaW50MmRWaWV3KGRvYywge1xuICAgICAgICAgICAgZXhwYW5kZWQ6IHRoaXMuZm9sZGFibGVfLnZhbHVlKCdleHBhbmRlZCcpLFxuICAgICAgICAgICAgcGlja2VyTGF5b3V0OiBjb25maWcucGlja2VyTGF5b3V0LFxuICAgICAgICAgICAgdmlld1Byb3BzOiB0aGlzLnZpZXdQcm9wcyxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudmlldy50ZXh0RWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnRleHRDXy52aWV3LmVsZW1lbnQpO1xuICAgICAgICAoX2EgPSB0aGlzLnZpZXcuYnV0dG9uRWxlbWVudCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLm9uUGFkQnV0dG9uQmx1cl8pO1xuICAgICAgICAoX2IgPSB0aGlzLnZpZXcuYnV0dG9uRWxlbWVudCkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vblBhZEJ1dHRvbkNsaWNrXyk7XG4gICAgICAgIGlmICh0aGlzLnBvcENfKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXcuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnBvcENfLnZpZXcuZWxlbWVudCk7XG4gICAgICAgICAgICB0aGlzLnBvcENfLnZpZXcuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnBpY2tlckNfLnZpZXcuZWxlbWVudCk7XG4gICAgICAgICAgICBjb25uZWN0VmFsdWVzKHtcbiAgICAgICAgICAgICAgICBwcmltYXJ5OiB0aGlzLmZvbGRhYmxlXy52YWx1ZSgnZXhwYW5kZWQnKSxcbiAgICAgICAgICAgICAgICBzZWNvbmRhcnk6IHRoaXMucG9wQ18uc2hvd3MsXG4gICAgICAgICAgICAgICAgZm9yd2FyZDogKHApID0+IHAsXG4gICAgICAgICAgICAgICAgYmFja3dhcmQ6IChfLCBzKSA9PiBzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy52aWV3LnBpY2tlckVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMudmlldy5waWNrZXJFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMucGlja2VyQ18udmlldy5lbGVtZW50KTtcbiAgICAgICAgICAgIGJpbmRGb2xkYWJsZSh0aGlzLmZvbGRhYmxlXywgdGhpcy52aWV3LnBpY2tlckVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCB0ZXh0Q29udHJvbGxlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dENfO1xuICAgIH1cbiAgICBvblBhZEJ1dHRvbkJsdXJfKGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLnBvcENfKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMudmlldy5lbGVtZW50O1xuICAgICAgICBjb25zdCBuZXh0VGFyZ2V0ID0gZm9yY2VDYXN0KGUucmVsYXRlZFRhcmdldCk7XG4gICAgICAgIGlmICghbmV4dFRhcmdldCB8fCAhZWxlbS5jb250YWlucyhuZXh0VGFyZ2V0KSkge1xuICAgICAgICAgICAgdGhpcy5wb3BDXy5zaG93cy5yYXdWYWx1ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIG9uUGFkQnV0dG9uQ2xpY2tfKCkge1xuICAgICAgICB0aGlzLmZvbGRhYmxlXy5zZXQoJ2V4cGFuZGVkJywgIXRoaXMuZm9sZGFibGVfLmdldCgnZXhwYW5kZWQnKSk7XG4gICAgICAgIGlmICh0aGlzLmZvbGRhYmxlXy5nZXQoJ2V4cGFuZGVkJykpIHtcbiAgICAgICAgICAgIHRoaXMucGlja2VyQ18udmlldy5hbGxGb2N1c2FibGVFbGVtZW50c1swXS5mb2N1cygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIG9uUG9wdXBDaGlsZEJsdXJfKGV2KSB7XG4gICAgICAgIGlmICghdGhpcy5wb3BDXykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLnBvcENfLnZpZXcuZWxlbWVudDtcbiAgICAgICAgY29uc3QgbmV4dFRhcmdldCA9IGZpbmROZXh0VGFyZ2V0KGV2KTtcbiAgICAgICAgaWYgKG5leHRUYXJnZXQgJiYgZWxlbS5jb250YWlucyhuZXh0VGFyZ2V0KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuZXh0VGFyZ2V0ICYmXG4gICAgICAgICAgICBuZXh0VGFyZ2V0ID09PSB0aGlzLnZpZXcuYnV0dG9uRWxlbWVudCAmJlxuICAgICAgICAgICAgIXN1cHBvcnRzVG91Y2goZWxlbS5vd25lckRvY3VtZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucG9wQ18uc2hvd3MucmF3VmFsdWUgPSBmYWxzZTtcbiAgICB9XG4gICAgb25Qb3B1cENoaWxkS2V5ZG93bl8oZXYpIHtcbiAgICAgICAgaWYgKHRoaXMucG9wQ18pIHtcbiAgICAgICAgICAgIGlmIChldi5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3BDXy5zaG93cy5yYXdWYWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMudmlldy5waWNrZXJFbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAoZXYua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgICAgICAgICAgIHRoaXMudmlldy5idXR0b25FbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHBvaW50MmRGcm9tVW5rbm93bih2YWx1ZSkge1xuICAgIHJldHVybiBQb2ludDJkLmlzT2JqZWN0KHZhbHVlKVxuICAgICAgICA/IG5ldyBQb2ludDJkKHZhbHVlLngsIHZhbHVlLnkpXG4gICAgICAgIDogbmV3IFBvaW50MmQoKTtcbn1cbmZ1bmN0aW9uIHdyaXRlUG9pbnQyZCh0YXJnZXQsIHZhbHVlKSB7XG4gICAgdGFyZ2V0LndyaXRlUHJvcGVydHkoJ3gnLCB2YWx1ZS54KTtcbiAgICB0YXJnZXQud3JpdGVQcm9wZXJ0eSgneScsIHZhbHVlLnkpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb25zdHJhaW50JDMocGFyYW1zLCBpbml0aWFsVmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50TmRDb25zdHJhaW50KHtcbiAgICAgICAgYXNzZW1ibHk6IFBvaW50MmRBc3NlbWJseSxcbiAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgY3JlYXRlRGltZW5zaW9uQ29uc3RyYWludChPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHBhcmFtcyksIHBhcmFtcy54KSwgaW5pdGlhbFZhbHVlLngpLFxuICAgICAgICAgICAgY3JlYXRlRGltZW5zaW9uQ29uc3RyYWludChPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHBhcmFtcyksIHBhcmFtcy55KSwgaW5pdGlhbFZhbHVlLnkpLFxuICAgICAgICBdLFxuICAgIH0pO1xufVxuZnVuY3Rpb24gZ2V0U3VpdGFibGVNYXhEaW1lbnNpb25WYWx1ZShwYXJhbXMsIHJhd1ZhbHVlKSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICBpZiAoIWlzRW1wdHkocGFyYW1zLm1pbikgfHwgIWlzRW1wdHkocGFyYW1zLm1heCkpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KE1hdGguYWJzKChfYSA9IHBhcmFtcy5taW4pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IDApLCBNYXRoLmFicygoX2IgPSBwYXJhbXMubWF4KSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAwKSk7XG4gICAgfVxuICAgIGNvbnN0IHN0ZXAgPSBnZXRTdWl0YWJsZUtleVNjYWxlKHBhcmFtcyk7XG4gICAgcmV0dXJuIE1hdGgubWF4KE1hdGguYWJzKHN0ZXApICogMTAsIE1hdGguYWJzKHJhd1ZhbHVlKSAqIDEwKTtcbn1cbmZ1bmN0aW9uIGdldFN1aXRhYmxlTWF4KHBhcmFtcywgaW5pdGlhbFZhbHVlKSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICBjb25zdCB4ciA9IGdldFN1aXRhYmxlTWF4RGltZW5zaW9uVmFsdWUoZGVlcE1lcmdlKHBhcmFtcywgKChfYSA9IHBhcmFtcy54KSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB7fSkpLCBpbml0aWFsVmFsdWUueCk7XG4gICAgY29uc3QgeXIgPSBnZXRTdWl0YWJsZU1heERpbWVuc2lvblZhbHVlKGRlZXBNZXJnZShwYXJhbXMsICgoX2IgPSBwYXJhbXMueSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDoge30pKSwgaW5pdGlhbFZhbHVlLnkpO1xuICAgIHJldHVybiBNYXRoLm1heCh4ciwgeXIpO1xufVxuZnVuY3Rpb24gc2hvdWxkSW52ZXJ0WShwYXJhbXMpIHtcbiAgICBpZiAoISgneScgaW4gcGFyYW1zKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHlQYXJhbXMgPSBwYXJhbXMueTtcbiAgICBpZiAoIXlQYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gJ2ludmVydGVkJyBpbiB5UGFyYW1zID8gISF5UGFyYW1zLmludmVydGVkIDogZmFsc2U7XG59XG5jb25zdCBQb2ludDJkSW5wdXRQbHVnaW4gPSBjcmVhdGVQbHVnaW4oe1xuICAgIGlkOiAnaW5wdXQtcG9pbnQyZCcsXG4gICAgdHlwZTogJ2lucHV0JyxcbiAgICBhY2NlcHQ6ICh2YWx1ZSwgcGFyYW1zKSA9PiB7XG4gICAgICAgIGlmICghUG9pbnQyZC5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlUmVjb3JkKHBhcmFtcywgKHApID0+IChPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGNyZWF0ZVBvaW50RGltZW5zaW9uUGFyc2VyKHApKSwgeyBleHBhbmRlZDogcC5vcHRpb25hbC5ib29sZWFuLCBwaWNrZXI6IHAub3B0aW9uYWwuY3VzdG9tKHBhcnNlUGlja2VyTGF5b3V0KSwgcmVhZG9ubHk6IHAub3B0aW9uYWwuY29uc3RhbnQoZmFsc2UpLCB4OiBwLm9wdGlvbmFsLmN1c3RvbShwYXJzZVBvaW50RGltZW5zaW9uUGFyYW1zKSwgeTogcC5vcHRpb25hbC5vYmplY3QoT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBjcmVhdGVQb2ludERpbWVuc2lvblBhcnNlcihwKSksIHsgaW52ZXJ0ZWQ6IHAub3B0aW9uYWwuYm9vbGVhbiB9KSkgfSkpKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgaW5pdGlhbFZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHJlc3VsdCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogbnVsbDtcbiAgICB9LFxuICAgIGJpbmRpbmc6IHtcbiAgICAgICAgcmVhZGVyOiAoKSA9PiBwb2ludDJkRnJvbVVua25vd24sXG4gICAgICAgIGNvbnN0cmFpbnQ6IChhcmdzKSA9PiBjcmVhdGVDb25zdHJhaW50JDMoYXJncy5wYXJhbXMsIGFyZ3MuaW5pdGlhbFZhbHVlKSxcbiAgICAgICAgZXF1YWxzOiBQb2ludDJkLmVxdWFscyxcbiAgICAgICAgd3JpdGVyOiAoKSA9PiB3cml0ZVBvaW50MmQsXG4gICAgfSxcbiAgICBjb250cm9sbGVyOiAoYXJncykgPT4ge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICBjb25zdCBkb2MgPSBhcmdzLmRvY3VtZW50O1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGFyZ3MudmFsdWU7XG4gICAgICAgIGNvbnN0IGMgPSBhcmdzLmNvbnN0cmFpbnQ7XG4gICAgICAgIGNvbnN0IGRQYXJhbXMgPSBbYXJncy5wYXJhbXMueCwgYXJncy5wYXJhbXMueV07XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQyZENvbnRyb2xsZXIoZG9jLCB7XG4gICAgICAgICAgICBheGVzOiB2YWx1ZS5yYXdWYWx1ZS5nZXRDb21wb25lbnRzKCkubWFwKChjb21wLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVQb2ludEF4aXMoe1xuICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50OiBjLmNvbXBvbmVudHNbaV0sXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxWYWx1ZTogY29tcCxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBkZWVwTWVyZ2UoYXJncy5wYXJhbXMsICgoX2EgPSBkUGFyYW1zW2ldKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB7fSkpLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBleHBhbmRlZDogKF9hID0gYXJncy5wYXJhbXMuZXhwYW5kZWQpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGZhbHNlLFxuICAgICAgICAgICAgaW52ZXJ0c1k6IHNob3VsZEludmVydFkoYXJncy5wYXJhbXMpLFxuICAgICAgICAgICAgbWF4OiBnZXRTdWl0YWJsZU1heChhcmdzLnBhcmFtcywgdmFsdWUucmF3VmFsdWUpLFxuICAgICAgICAgICAgcGFyc2VyOiBwYXJzZU51bWJlcixcbiAgICAgICAgICAgIHBpY2tlckxheW91dDogKF9iID0gYXJncy5wYXJhbXMucGlja2VyKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAncG9wdXAnLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgdmlld1Byb3BzOiBhcmdzLnZpZXdQcm9wcyxcbiAgICAgICAgfSk7XG4gICAgfSxcbn0pO1xuXG5jbGFzcyBQb2ludDNkIHtcbiAgICBjb25zdHJ1Y3Rvcih4ID0gMCwgeSA9IDAsIHogPSAwKSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgICAgIHRoaXMueiA9IHo7XG4gICAgfVxuICAgIGdldENvbXBvbmVudHMoKSB7XG4gICAgICAgIHJldHVybiBbdGhpcy54LCB0aGlzLnksIHRoaXMuel07XG4gICAgfVxuICAgIHN0YXRpYyBpc09iamVjdChvYmopIHtcbiAgICAgICAgaWYgKGlzRW1wdHkob2JqKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHggPSBvYmoueDtcbiAgICAgICAgY29uc3QgeSA9IG9iai55O1xuICAgICAgICBjb25zdCB6ID0gb2JqLno7XG4gICAgICAgIGlmICh0eXBlb2YgeCAhPT0gJ251bWJlcicgfHxcbiAgICAgICAgICAgIHR5cGVvZiB5ICE9PSAnbnVtYmVyJyB8fFxuICAgICAgICAgICAgdHlwZW9mIHogIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHN0YXRpYyBlcXVhbHModjEsIHYyKSB7XG4gICAgICAgIHJldHVybiB2MS54ID09PSB2Mi54ICYmIHYxLnkgPT09IHYyLnkgJiYgdjEueiA9PT0gdjIuejtcbiAgICB9XG4gICAgdG9PYmplY3QoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiB0aGlzLngsXG4gICAgICAgICAgICB5OiB0aGlzLnksXG4gICAgICAgICAgICB6OiB0aGlzLnosXG4gICAgICAgIH07XG4gICAgfVxufVxuY29uc3QgUG9pbnQzZEFzc2VtYmx5ID0ge1xuICAgIHRvQ29tcG9uZW50czogKHApID0+IHAuZ2V0Q29tcG9uZW50cygpLFxuICAgIGZyb21Db21wb25lbnRzOiAoY29tcHMpID0+IG5ldyBQb2ludDNkKC4uLmNvbXBzKSxcbn07XG5cbmZ1bmN0aW9uIHBvaW50M2RGcm9tVW5rbm93bih2YWx1ZSkge1xuICAgIHJldHVybiBQb2ludDNkLmlzT2JqZWN0KHZhbHVlKVxuICAgICAgICA/IG5ldyBQb2ludDNkKHZhbHVlLngsIHZhbHVlLnksIHZhbHVlLnopXG4gICAgICAgIDogbmV3IFBvaW50M2QoKTtcbn1cbmZ1bmN0aW9uIHdyaXRlUG9pbnQzZCh0YXJnZXQsIHZhbHVlKSB7XG4gICAgdGFyZ2V0LndyaXRlUHJvcGVydHkoJ3gnLCB2YWx1ZS54KTtcbiAgICB0YXJnZXQud3JpdGVQcm9wZXJ0eSgneScsIHZhbHVlLnkpO1xuICAgIHRhcmdldC53cml0ZVByb3BlcnR5KCd6JywgdmFsdWUueik7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbnN0cmFpbnQkMihwYXJhbXMsIGluaXRpYWxWYWx1ZSkge1xuICAgIHJldHVybiBuZXcgUG9pbnROZENvbnN0cmFpbnQoe1xuICAgICAgICBhc3NlbWJseTogUG9pbnQzZEFzc2VtYmx5LFxuICAgICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgICAgICBjcmVhdGVEaW1lbnNpb25Db25zdHJhaW50KE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgcGFyYW1zKSwgcGFyYW1zLngpLCBpbml0aWFsVmFsdWUueCksXG4gICAgICAgICAgICBjcmVhdGVEaW1lbnNpb25Db25zdHJhaW50KE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgcGFyYW1zKSwgcGFyYW1zLnkpLCBpbml0aWFsVmFsdWUueSksXG4gICAgICAgICAgICBjcmVhdGVEaW1lbnNpb25Db25zdHJhaW50KE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgcGFyYW1zKSwgcGFyYW1zLnopLCBpbml0aWFsVmFsdWUueiksXG4gICAgICAgIF0sXG4gICAgfSk7XG59XG5jb25zdCBQb2ludDNkSW5wdXRQbHVnaW4gPSBjcmVhdGVQbHVnaW4oe1xuICAgIGlkOiAnaW5wdXQtcG9pbnQzZCcsXG4gICAgdHlwZTogJ2lucHV0JyxcbiAgICBhY2NlcHQ6ICh2YWx1ZSwgcGFyYW1zKSA9PiB7XG4gICAgICAgIGlmICghUG9pbnQzZC5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlUmVjb3JkKHBhcmFtcywgKHApID0+IChPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGNyZWF0ZVBvaW50RGltZW5zaW9uUGFyc2VyKHApKSwgeyByZWFkb25seTogcC5vcHRpb25hbC5jb25zdGFudChmYWxzZSksIHg6IHAub3B0aW9uYWwuY3VzdG9tKHBhcnNlUG9pbnREaW1lbnNpb25QYXJhbXMpLCB5OiBwLm9wdGlvbmFsLmN1c3RvbShwYXJzZVBvaW50RGltZW5zaW9uUGFyYW1zKSwgejogcC5vcHRpb25hbC5jdXN0b20ocGFyc2VQb2ludERpbWVuc2lvblBhcmFtcykgfSkpKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgaW5pdGlhbFZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHJlc3VsdCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogbnVsbDtcbiAgICB9LFxuICAgIGJpbmRpbmc6IHtcbiAgICAgICAgcmVhZGVyOiAoX2FyZ3MpID0+IHBvaW50M2RGcm9tVW5rbm93bixcbiAgICAgICAgY29uc3RyYWludDogKGFyZ3MpID0+IGNyZWF0ZUNvbnN0cmFpbnQkMihhcmdzLnBhcmFtcywgYXJncy5pbml0aWFsVmFsdWUpLFxuICAgICAgICBlcXVhbHM6IFBvaW50M2QuZXF1YWxzLFxuICAgICAgICB3cml0ZXI6IChfYXJncykgPT4gd3JpdGVQb2ludDNkLFxuICAgIH0sXG4gICAgY29udHJvbGxlcjogKGFyZ3MpID0+IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBhcmdzLnZhbHVlO1xuICAgICAgICBjb25zdCBjID0gYXJncy5jb25zdHJhaW50O1xuICAgICAgICBjb25zdCBkUGFyYW1zID0gW2FyZ3MucGFyYW1zLngsIGFyZ3MucGFyYW1zLnksIGFyZ3MucGFyYW1zLnpdO1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50TmRUZXh0Q29udHJvbGxlcihhcmdzLmRvY3VtZW50LCB7XG4gICAgICAgICAgICBhc3NlbWJseTogUG9pbnQzZEFzc2VtYmx5LFxuICAgICAgICAgICAgYXhlczogdmFsdWUucmF3VmFsdWUuZ2V0Q29tcG9uZW50cygpLm1hcCgoY29tcCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlUG9pbnRBeGlzKHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3RyYWludDogYy5jb21wb25lbnRzW2ldLFxuICAgICAgICAgICAgICAgICAgICBpbml0aWFsVmFsdWU6IGNvbXAsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczogZGVlcE1lcmdlKGFyZ3MucGFyYW1zLCAoKF9hID0gZFBhcmFtc1tpXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDoge30pKSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgcGFyc2VyOiBwYXJzZU51bWJlcixcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIHZpZXdQcm9wczogYXJncy52aWV3UHJvcHMsXG4gICAgICAgIH0pO1xuICAgIH0sXG59KTtcblxuY2xhc3MgUG9pbnQ0ZCB7XG4gICAgY29uc3RydWN0b3IoeCA9IDAsIHkgPSAwLCB6ID0gMCwgdyA9IDApIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICAgICAgdGhpcy56ID0gejtcbiAgICAgICAgdGhpcy53ID0gdztcbiAgICB9XG4gICAgZ2V0Q29tcG9uZW50cygpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLngsIHRoaXMueSwgdGhpcy56LCB0aGlzLnddO1xuICAgIH1cbiAgICBzdGF0aWMgaXNPYmplY3Qob2JqKSB7XG4gICAgICAgIGlmIChpc0VtcHR5KG9iaikpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB4ID0gb2JqLng7XG4gICAgICAgIGNvbnN0IHkgPSBvYmoueTtcbiAgICAgICAgY29uc3QgeiA9IG9iai56O1xuICAgICAgICBjb25zdCB3ID0gb2JqLnc7XG4gICAgICAgIGlmICh0eXBlb2YgeCAhPT0gJ251bWJlcicgfHxcbiAgICAgICAgICAgIHR5cGVvZiB5ICE9PSAnbnVtYmVyJyB8fFxuICAgICAgICAgICAgdHlwZW9mIHogIT09ICdudW1iZXInIHx8XG4gICAgICAgICAgICB0eXBlb2YgdyAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgc3RhdGljIGVxdWFscyh2MSwgdjIpIHtcbiAgICAgICAgcmV0dXJuIHYxLnggPT09IHYyLnggJiYgdjEueSA9PT0gdjIueSAmJiB2MS56ID09PSB2Mi56ICYmIHYxLncgPT09IHYyLnc7XG4gICAgfVxuICAgIHRvT2JqZWN0KCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogdGhpcy54LFxuICAgICAgICAgICAgeTogdGhpcy55LFxuICAgICAgICAgICAgejogdGhpcy56LFxuICAgICAgICAgICAgdzogdGhpcy53LFxuICAgICAgICB9O1xuICAgIH1cbn1cbmNvbnN0IFBvaW50NGRBc3NlbWJseSA9IHtcbiAgICB0b0NvbXBvbmVudHM6IChwKSA9PiBwLmdldENvbXBvbmVudHMoKSxcbiAgICBmcm9tQ29tcG9uZW50czogKGNvbXBzKSA9PiBuZXcgUG9pbnQ0ZCguLi5jb21wcyksXG59O1xuXG5mdW5jdGlvbiBwb2ludDRkRnJvbVVua25vd24odmFsdWUpIHtcbiAgICByZXR1cm4gUG9pbnQ0ZC5pc09iamVjdCh2YWx1ZSlcbiAgICAgICAgPyBuZXcgUG9pbnQ0ZCh2YWx1ZS54LCB2YWx1ZS55LCB2YWx1ZS56LCB2YWx1ZS53KVxuICAgICAgICA6IG5ldyBQb2ludDRkKCk7XG59XG5mdW5jdGlvbiB3cml0ZVBvaW50NGQodGFyZ2V0LCB2YWx1ZSkge1xuICAgIHRhcmdldC53cml0ZVByb3BlcnR5KCd4JywgdmFsdWUueCk7XG4gICAgdGFyZ2V0LndyaXRlUHJvcGVydHkoJ3knLCB2YWx1ZS55KTtcbiAgICB0YXJnZXQud3JpdGVQcm9wZXJ0eSgneicsIHZhbHVlLnopO1xuICAgIHRhcmdldC53cml0ZVByb3BlcnR5KCd3JywgdmFsdWUudyk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbnN0cmFpbnQkMShwYXJhbXMsIGluaXRpYWxWYWx1ZSkge1xuICAgIHJldHVybiBuZXcgUG9pbnROZENvbnN0cmFpbnQoe1xuICAgICAgICBhc3NlbWJseTogUG9pbnQ0ZEFzc2VtYmx5LFxuICAgICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgICAgICBjcmVhdGVEaW1lbnNpb25Db25zdHJhaW50KE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgcGFyYW1zKSwgcGFyYW1zLngpLCBpbml0aWFsVmFsdWUueCksXG4gICAgICAgICAgICBjcmVhdGVEaW1lbnNpb25Db25zdHJhaW50KE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgcGFyYW1zKSwgcGFyYW1zLnkpLCBpbml0aWFsVmFsdWUueSksXG4gICAgICAgICAgICBjcmVhdGVEaW1lbnNpb25Db25zdHJhaW50KE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgcGFyYW1zKSwgcGFyYW1zLnopLCBpbml0aWFsVmFsdWUueiksXG4gICAgICAgICAgICBjcmVhdGVEaW1lbnNpb25Db25zdHJhaW50KE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgcGFyYW1zKSwgcGFyYW1zLncpLCBpbml0aWFsVmFsdWUudyksXG4gICAgICAgIF0sXG4gICAgfSk7XG59XG5jb25zdCBQb2ludDRkSW5wdXRQbHVnaW4gPSBjcmVhdGVQbHVnaW4oe1xuICAgIGlkOiAnaW5wdXQtcG9pbnQ0ZCcsXG4gICAgdHlwZTogJ2lucHV0JyxcbiAgICBhY2NlcHQ6ICh2YWx1ZSwgcGFyYW1zKSA9PiB7XG4gICAgICAgIGlmICghUG9pbnQ0ZC5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlUmVjb3JkKHBhcmFtcywgKHApID0+IChPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGNyZWF0ZVBvaW50RGltZW5zaW9uUGFyc2VyKHApKSwgeyByZWFkb25seTogcC5vcHRpb25hbC5jb25zdGFudChmYWxzZSksIHc6IHAub3B0aW9uYWwuY3VzdG9tKHBhcnNlUG9pbnREaW1lbnNpb25QYXJhbXMpLCB4OiBwLm9wdGlvbmFsLmN1c3RvbShwYXJzZVBvaW50RGltZW5zaW9uUGFyYW1zKSwgeTogcC5vcHRpb25hbC5jdXN0b20ocGFyc2VQb2ludERpbWVuc2lvblBhcmFtcyksIHo6IHAub3B0aW9uYWwuY3VzdG9tKHBhcnNlUG9pbnREaW1lbnNpb25QYXJhbXMpIH0pKSk7XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgIGluaXRpYWxWYWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiByZXN1bHQsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA6IG51bGw7XG4gICAgfSxcbiAgICBiaW5kaW5nOiB7XG4gICAgICAgIHJlYWRlcjogKF9hcmdzKSA9PiBwb2ludDRkRnJvbVVua25vd24sXG4gICAgICAgIGNvbnN0cmFpbnQ6IChhcmdzKSA9PiBjcmVhdGVDb25zdHJhaW50JDEoYXJncy5wYXJhbXMsIGFyZ3MuaW5pdGlhbFZhbHVlKSxcbiAgICAgICAgZXF1YWxzOiBQb2ludDRkLmVxdWFscyxcbiAgICAgICAgd3JpdGVyOiAoX2FyZ3MpID0+IHdyaXRlUG9pbnQ0ZCxcbiAgICB9LFxuICAgIGNvbnRyb2xsZXI6IChhcmdzKSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gYXJncy52YWx1ZTtcbiAgICAgICAgY29uc3QgYyA9IGFyZ3MuY29uc3RyYWludDtcbiAgICAgICAgY29uc3QgZFBhcmFtcyA9IFtcbiAgICAgICAgICAgIGFyZ3MucGFyYW1zLngsXG4gICAgICAgICAgICBhcmdzLnBhcmFtcy55LFxuICAgICAgICAgICAgYXJncy5wYXJhbXMueixcbiAgICAgICAgICAgIGFyZ3MucGFyYW1zLncsXG4gICAgICAgIF07XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnROZFRleHRDb250cm9sbGVyKGFyZ3MuZG9jdW1lbnQsIHtcbiAgICAgICAgICAgIGFzc2VtYmx5OiBQb2ludDRkQXNzZW1ibHksXG4gICAgICAgICAgICBheGVzOiB2YWx1ZS5yYXdWYWx1ZS5nZXRDb21wb25lbnRzKCkubWFwKChjb21wLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVQb2ludEF4aXMoe1xuICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50OiBjLmNvbXBvbmVudHNbaV0sXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxWYWx1ZTogY29tcCxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBkZWVwTWVyZ2UoYXJncy5wYXJhbXMsICgoX2EgPSBkUGFyYW1zW2ldKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB7fSkpLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBwYXJzZXI6IHBhcnNlTnVtYmVyLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgdmlld1Byb3BzOiBhcmdzLnZpZXdQcm9wcyxcbiAgICAgICAgfSk7XG4gICAgfSxcbn0pO1xuXG5mdW5jdGlvbiBjcmVhdGVDb25zdHJhaW50KHBhcmFtcykge1xuICAgIGNvbnN0IGNvbnN0cmFpbnRzID0gW107XG4gICAgY29uc3QgbGMgPSBjcmVhdGVMaXN0Q29uc3RyYWludChwYXJhbXMub3B0aW9ucyk7XG4gICAgaWYgKGxjKSB7XG4gICAgICAgIGNvbnN0cmFpbnRzLnB1c2gobGMpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IENvbXBvc2l0ZUNvbnN0cmFpbnQoY29uc3RyYWludHMpO1xufVxuY29uc3QgU3RyaW5nSW5wdXRQbHVnaW4gPSBjcmVhdGVQbHVnaW4oe1xuICAgIGlkOiAnaW5wdXQtc3RyaW5nJyxcbiAgICB0eXBlOiAnaW5wdXQnLFxuICAgIGFjY2VwdDogKHZhbHVlLCBwYXJhbXMpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlUmVjb3JkKHBhcmFtcywgKHApID0+ICh7XG4gICAgICAgICAgICByZWFkb25seTogcC5vcHRpb25hbC5jb25zdGFudChmYWxzZSksXG4gICAgICAgICAgICBvcHRpb25zOiBwLm9wdGlvbmFsLmN1c3RvbShwYXJzZUxpc3RPcHRpb25zKSxcbiAgICAgICAgfSkpO1xuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICBpbml0aWFsVmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgIHBhcmFtczogcmVzdWx0LFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgOiBudWxsO1xuICAgIH0sXG4gICAgYmluZGluZzoge1xuICAgICAgICByZWFkZXI6IChfYXJncykgPT4gc3RyaW5nRnJvbVVua25vd24sXG4gICAgICAgIGNvbnN0cmFpbnQ6IChhcmdzKSA9PiBjcmVhdGVDb25zdHJhaW50KGFyZ3MucGFyYW1zKSxcbiAgICAgICAgd3JpdGVyOiAoX2FyZ3MpID0+IHdyaXRlUHJpbWl0aXZlLFxuICAgIH0sXG4gICAgY29udHJvbGxlcjogKGFyZ3MpID0+IHtcbiAgICAgICAgY29uc3QgZG9jID0gYXJncy5kb2N1bWVudDtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBhcmdzLnZhbHVlO1xuICAgICAgICBjb25zdCBjID0gYXJncy5jb25zdHJhaW50O1xuICAgICAgICBjb25zdCBsYyA9IGMgJiYgZmluZENvbnN0cmFpbnQoYywgTGlzdENvbnN0cmFpbnQpO1xuICAgICAgICBpZiAobGMpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTGlzdENvbnRyb2xsZXIoZG9jLCB7XG4gICAgICAgICAgICAgICAgcHJvcHM6IG5ldyBWYWx1ZU1hcCh7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IGxjLnZhbHVlcy52YWx1ZSgnb3B0aW9ucycpLFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICB2aWV3UHJvcHM6IGFyZ3Mudmlld1Byb3BzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBUZXh0Q29udHJvbGxlcihkb2MsIHtcbiAgICAgICAgICAgIHBhcnNlcjogKHYpID0+IHYsXG4gICAgICAgICAgICBwcm9wczogVmFsdWVNYXAuZnJvbU9iamVjdCh7XG4gICAgICAgICAgICAgICAgZm9ybWF0dGVyOiBmb3JtYXRTdHJpbmcsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIHZpZXdQcm9wczogYXJncy52aWV3UHJvcHMsXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgYXBpKGFyZ3MpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhcmdzLmNvbnRyb2xsZXIudmFsdWUucmF3VmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJncy5jb250cm9sbGVyLnZhbHVlQ29udHJvbGxlciBpbnN0YW5jZW9mIExpc3RDb250cm9sbGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IExpc3RJbnB1dEJpbmRpbmdBcGkoYXJncy5jb250cm9sbGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxufSk7XG5cbmNvbnN0IENvbnN0YW50cyA9IHtcbiAgICBtb25pdG9yOiB7XG4gICAgICAgIGRlZmF1bHRJbnRlcnZhbDogMjAwLFxuICAgICAgICBkZWZhdWx0Um93czogMyxcbiAgICB9LFxufTtcblxuY29uc3QgY24kMyA9IENsYXNzTmFtZSgnbWxsJyk7XG5jbGFzcyBNdWx0aUxvZ1ZpZXcge1xuICAgIGNvbnN0cnVjdG9yKGRvYywgY29uZmlnKSB7XG4gICAgICAgIHRoaXMub25WYWx1ZVVwZGF0ZV8gPSB0aGlzLm9uVmFsdWVVcGRhdGVfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZm9ybWF0dGVyXyA9IGNvbmZpZy5mb3JtYXR0ZXI7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoY24kMygpKTtcbiAgICAgICAgY29uZmlnLnZpZXdQcm9wcy5iaW5kQ2xhc3NNb2RpZmllcnModGhpcy5lbGVtZW50KTtcbiAgICAgICAgY29uc3QgdGV4dGFyZWFFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XG4gICAgICAgIHRleHRhcmVhRWxlbS5jbGFzc0xpc3QuYWRkKGNuJDMoJ2knKSk7XG4gICAgICAgIHRleHRhcmVhRWxlbS5zdHlsZS5oZWlnaHQgPSBgY2FsYyh2YXIoJHtnZXRDc3NWYXIoJ2NvbnRhaW5lclVuaXRTaXplJyl9KSAqICR7Y29uZmlnLnJvd3N9KWA7XG4gICAgICAgIHRleHRhcmVhRWxlbS5yZWFkT25seSA9IHRydWU7XG4gICAgICAgIGNvbmZpZy52aWV3UHJvcHMuYmluZERpc2FibGVkKHRleHRhcmVhRWxlbSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0ZXh0YXJlYUVsZW0pO1xuICAgICAgICB0aGlzLnRleHRhcmVhRWxlbV8gPSB0ZXh0YXJlYUVsZW07XG4gICAgICAgIGNvbmZpZy52YWx1ZS5lbWl0dGVyLm9uKCdjaGFuZ2UnLCB0aGlzLm9uVmFsdWVVcGRhdGVfKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IGNvbmZpZy52YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVfKCk7XG4gICAgfVxuICAgIHVwZGF0ZV8oKSB7XG4gICAgICAgIGNvbnN0IGVsZW0gPSB0aGlzLnRleHRhcmVhRWxlbV87XG4gICAgICAgIGNvbnN0IHNob3VsZFNjcm9sbCA9IGVsZW0uc2Nyb2xsVG9wID09PSBlbGVtLnNjcm9sbEhlaWdodCAtIGVsZW0uY2xpZW50SGVpZ2h0O1xuICAgICAgICBjb25zdCBsaW5lcyA9IFtdO1xuICAgICAgICB0aGlzLnZhbHVlLnJhd1ZhbHVlLmZvckVhY2goKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGxpbmVzLnB1c2godGhpcy5mb3JtYXR0ZXJfKHZhbHVlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBlbGVtLnRleHRDb250ZW50ID0gbGluZXMuam9pbignXFxuJyk7XG4gICAgICAgIGlmIChzaG91bGRTY3JvbGwpIHtcbiAgICAgICAgICAgIGVsZW0uc2Nyb2xsVG9wID0gZWxlbS5zY3JvbGxIZWlnaHQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgb25WYWx1ZVVwZGF0ZV8oKSB7XG4gICAgICAgIHRoaXMudXBkYXRlXygpO1xuICAgIH1cbn1cblxuY2xhc3MgTXVsdGlMb2dDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihkb2MsIGNvbmZpZykge1xuICAgICAgICB0aGlzLnZhbHVlID0gY29uZmlnLnZhbHVlO1xuICAgICAgICB0aGlzLnZpZXdQcm9wcyA9IGNvbmZpZy52aWV3UHJvcHM7XG4gICAgICAgIHRoaXMudmlldyA9IG5ldyBNdWx0aUxvZ1ZpZXcoZG9jLCB7XG4gICAgICAgICAgICBmb3JtYXR0ZXI6IGNvbmZpZy5mb3JtYXR0ZXIsXG4gICAgICAgICAgICByb3dzOiBjb25maWcucm93cyxcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgICAgICAgdmlld1Byb3BzOiB0aGlzLnZpZXdQcm9wcyxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5jb25zdCBjbiQyID0gQ2xhc3NOYW1lKCdzZ2wnKTtcbmNsYXNzIFNpbmdsZUxvZ1ZpZXcge1xuICAgIGNvbnN0cnVjdG9yKGRvYywgY29uZmlnKSB7XG4gICAgICAgIHRoaXMub25WYWx1ZVVwZGF0ZV8gPSB0aGlzLm9uVmFsdWVVcGRhdGVfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZm9ybWF0dGVyXyA9IGNvbmZpZy5mb3JtYXR0ZXI7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoY24kMigpKTtcbiAgICAgICAgY29uZmlnLnZpZXdQcm9wcy5iaW5kQ2xhc3NNb2RpZmllcnModGhpcy5lbGVtZW50KTtcbiAgICAgICAgY29uc3QgaW5wdXRFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgIGlucHV0RWxlbS5jbGFzc0xpc3QuYWRkKGNuJDIoJ2knKSk7XG4gICAgICAgIGlucHV0RWxlbS5yZWFkT25seSA9IHRydWU7XG4gICAgICAgIGlucHV0RWxlbS50eXBlID0gJ3RleHQnO1xuICAgICAgICBjb25maWcudmlld1Byb3BzLmJpbmREaXNhYmxlZChpbnB1dEVsZW0pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoaW5wdXRFbGVtKTtcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnQgPSBpbnB1dEVsZW07XG4gICAgICAgIGNvbmZpZy52YWx1ZS5lbWl0dGVyLm9uKCdjaGFuZ2UnLCB0aGlzLm9uVmFsdWVVcGRhdGVfKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IGNvbmZpZy52YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVfKCk7XG4gICAgfVxuICAgIHVwZGF0ZV8oKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMudmFsdWUucmF3VmFsdWU7XG4gICAgICAgIGNvbnN0IGxhc3RWYWx1ZSA9IHZhbHVlc1t2YWx1ZXMubGVuZ3RoIC0gMV07XG4gICAgICAgIHRoaXMuaW5wdXRFbGVtZW50LnZhbHVlID1cbiAgICAgICAgICAgIGxhc3RWYWx1ZSAhPT0gdW5kZWZpbmVkID8gdGhpcy5mb3JtYXR0ZXJfKGxhc3RWYWx1ZSkgOiAnJztcbiAgICB9XG4gICAgb25WYWx1ZVVwZGF0ZV8oKSB7XG4gICAgICAgIHRoaXMudXBkYXRlXygpO1xuICAgIH1cbn1cblxuY2xhc3MgU2luZ2xlTG9nQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoZG9jLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IGNvbmZpZy52YWx1ZTtcbiAgICAgICAgdGhpcy52aWV3UHJvcHMgPSBjb25maWcudmlld1Byb3BzO1xuICAgICAgICB0aGlzLnZpZXcgPSBuZXcgU2luZ2xlTG9nVmlldyhkb2MsIHtcbiAgICAgICAgICAgIGZvcm1hdHRlcjogY29uZmlnLmZvcm1hdHRlcixcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgICAgICAgdmlld1Byb3BzOiB0aGlzLnZpZXdQcm9wcyxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5jb25zdCBCb29sZWFuTW9uaXRvclBsdWdpbiA9IGNyZWF0ZVBsdWdpbih7XG4gICAgaWQ6ICdtb25pdG9yLWJvb2wnLFxuICAgIHR5cGU6ICdtb25pdG9yJyxcbiAgICBhY2NlcHQ6ICh2YWx1ZSwgcGFyYW1zKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VSZWNvcmQocGFyYW1zLCAocCkgPT4gKHtcbiAgICAgICAgICAgIHJlYWRvbmx5OiBwLnJlcXVpcmVkLmNvbnN0YW50KHRydWUpLFxuICAgICAgICAgICAgcm93czogcC5vcHRpb25hbC5udW1iZXIsXG4gICAgICAgIH0pKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgaW5pdGlhbFZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHJlc3VsdCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogbnVsbDtcbiAgICB9LFxuICAgIGJpbmRpbmc6IHtcbiAgICAgICAgcmVhZGVyOiAoX2FyZ3MpID0+IGJvb2xGcm9tVW5rbm93bixcbiAgICB9LFxuICAgIGNvbnRyb2xsZXI6IChhcmdzKSA9PiB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgaWYgKGFyZ3MudmFsdWUucmF3VmFsdWUubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFNpbmdsZUxvZ0NvbnRyb2xsZXIoYXJncy5kb2N1bWVudCwge1xuICAgICAgICAgICAgICAgIGZvcm1hdHRlcjogQm9vbGVhbkZvcm1hdHRlcixcbiAgICAgICAgICAgICAgICB2YWx1ZTogYXJncy52YWx1ZSxcbiAgICAgICAgICAgICAgICB2aWV3UHJvcHM6IGFyZ3Mudmlld1Byb3BzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBNdWx0aUxvZ0NvbnRyb2xsZXIoYXJncy5kb2N1bWVudCwge1xuICAgICAgICAgICAgZm9ybWF0dGVyOiBCb29sZWFuRm9ybWF0dGVyLFxuICAgICAgICAgICAgcm93czogKF9hID0gYXJncy5wYXJhbXMucm93cykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogQ29uc3RhbnRzLm1vbml0b3IuZGVmYXVsdFJvd3MsXG4gICAgICAgICAgICB2YWx1ZTogYXJncy52YWx1ZSxcbiAgICAgICAgICAgIHZpZXdQcm9wczogYXJncy52aWV3UHJvcHMsXG4gICAgICAgIH0pO1xuICAgIH0sXG59KTtcblxuY2xhc3MgR3JhcGhMb2dNb25pdG9yQmluZGluZ0FwaSBleHRlbmRzIEJpbmRpbmdBcGkge1xuICAgIGdldCBtYXgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXIudmFsdWVDb250cm9sbGVyLnByb3BzLmdldCgnbWF4Jyk7XG4gICAgfVxuICAgIHNldCBtYXgobWF4KSB7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci52YWx1ZUNvbnRyb2xsZXIucHJvcHMuc2V0KCdtYXgnLCBtYXgpO1xuICAgIH1cbiAgICBnZXQgbWluKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyLnZhbHVlQ29udHJvbGxlci5wcm9wcy5nZXQoJ21pbicpO1xuICAgIH1cbiAgICBzZXQgbWluKG1pbikge1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIudmFsdWVDb250cm9sbGVyLnByb3BzLnNldCgnbWluJywgbWluKTtcbiAgICB9XG59XG5cbmNvbnN0IGNuJDEgPSBDbGFzc05hbWUoJ2dybCcpO1xuY2xhc3MgR3JhcGhMb2dWaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihkb2MsIGNvbmZpZykge1xuICAgICAgICB0aGlzLm9uQ3Vyc29yQ2hhbmdlXyA9IHRoaXMub25DdXJzb3JDaGFuZ2VfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25WYWx1ZVVwZGF0ZV8gPSB0aGlzLm9uVmFsdWVVcGRhdGVfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoY24kMSgpKTtcbiAgICAgICAgY29uZmlnLnZpZXdQcm9wcy5iaW5kQ2xhc3NNb2RpZmllcnModGhpcy5lbGVtZW50KTtcbiAgICAgICAgdGhpcy5mb3JtYXR0ZXJfID0gY29uZmlnLmZvcm1hdHRlcjtcbiAgICAgICAgdGhpcy5wcm9wc18gPSBjb25maWcucHJvcHM7XG4gICAgICAgIHRoaXMuY3Vyc29yXyA9IGNvbmZpZy5jdXJzb3I7XG4gICAgICAgIHRoaXMuY3Vyc29yXy5lbWl0dGVyLm9uKCdjaGFuZ2UnLCB0aGlzLm9uQ3Vyc29yQ2hhbmdlXyk7XG4gICAgICAgIGNvbnN0IHN2Z0VsZW0gPSBkb2MuY3JlYXRlRWxlbWVudE5TKFNWR19OUywgJ3N2ZycpO1xuICAgICAgICBzdmdFbGVtLmNsYXNzTGlzdC5hZGQoY24kMSgnZycpKTtcbiAgICAgICAgc3ZnRWxlbS5zdHlsZS5oZWlnaHQgPSBgY2FsYyh2YXIoJHtnZXRDc3NWYXIoJ2NvbnRhaW5lclVuaXRTaXplJyl9KSAqICR7Y29uZmlnLnJvd3N9KWA7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChzdmdFbGVtKTtcbiAgICAgICAgdGhpcy5zdmdFbGVtXyA9IHN2Z0VsZW07XG4gICAgICAgIGNvbnN0IGxpbmVFbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnROUyhTVkdfTlMsICdwb2x5bGluZScpO1xuICAgICAgICB0aGlzLnN2Z0VsZW1fLmFwcGVuZENoaWxkKGxpbmVFbGVtKTtcbiAgICAgICAgdGhpcy5saW5lRWxlbV8gPSBsaW5lRWxlbTtcbiAgICAgICAgY29uc3QgdG9vbHRpcEVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRvb2x0aXBFbGVtLmNsYXNzTGlzdC5hZGQoY24kMSgndCcpLCBDbGFzc05hbWUoJ3R0JykoKSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0b29sdGlwRWxlbSk7XG4gICAgICAgIHRoaXMudG9vbHRpcEVsZW1fID0gdG9vbHRpcEVsZW07XG4gICAgICAgIGNvbmZpZy52YWx1ZS5lbWl0dGVyLm9uKCdjaGFuZ2UnLCB0aGlzLm9uVmFsdWVVcGRhdGVfKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IGNvbmZpZy52YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVfKCk7XG4gICAgfVxuICAgIGdldCBncmFwaEVsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN2Z0VsZW1fO1xuICAgIH1cbiAgICB1cGRhdGVfKCkge1xuICAgICAgICBjb25zdCB7IGNsaWVudFdpZHRoOiB3LCBjbGllbnRIZWlnaHQ6IGggfSA9IHRoaXMuZWxlbWVudDtcbiAgICAgICAgY29uc3QgbWF4SW5kZXggPSB0aGlzLnZhbHVlLnJhd1ZhbHVlLmxlbmd0aCAtIDE7XG4gICAgICAgIGNvbnN0IG1pbiA9IHRoaXMucHJvcHNfLmdldCgnbWluJyk7XG4gICAgICAgIGNvbnN0IG1heCA9IHRoaXMucHJvcHNfLmdldCgnbWF4Jyk7XG4gICAgICAgIGNvbnN0IHBvaW50cyA9IFtdO1xuICAgICAgICB0aGlzLnZhbHVlLnJhd1ZhbHVlLmZvckVhY2goKHYsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgeCA9IG1hcFJhbmdlKGluZGV4LCAwLCBtYXhJbmRleCwgMCwgdyk7XG4gICAgICAgICAgICBjb25zdCB5ID0gbWFwUmFuZ2UodiwgbWluLCBtYXgsIGgsIDApO1xuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3gsIHldLmpvaW4oJywnKSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmxpbmVFbGVtXy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncG9pbnRzJywgcG9pbnRzLmpvaW4oJyAnKSk7XG4gICAgICAgIGNvbnN0IHRvb2x0aXBFbGVtID0gdGhpcy50b29sdGlwRWxlbV87XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy52YWx1ZS5yYXdWYWx1ZVt0aGlzLmN1cnNvcl8ucmF3VmFsdWVdO1xuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdG9vbHRpcEVsZW0uY2xhc3NMaXN0LnJlbW92ZShjbiQxKCd0JywgJ2EnKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdHggPSBtYXBSYW5nZSh0aGlzLmN1cnNvcl8ucmF3VmFsdWUsIDAsIG1heEluZGV4LCAwLCB3KTtcbiAgICAgICAgY29uc3QgdHkgPSBtYXBSYW5nZSh2YWx1ZSwgbWluLCBtYXgsIGgsIDApO1xuICAgICAgICB0b29sdGlwRWxlbS5zdHlsZS5sZWZ0ID0gYCR7dHh9cHhgO1xuICAgICAgICB0b29sdGlwRWxlbS5zdHlsZS50b3AgPSBgJHt0eX1weGA7XG4gICAgICAgIHRvb2x0aXBFbGVtLnRleHRDb250ZW50ID0gYCR7dGhpcy5mb3JtYXR0ZXJfKHZhbHVlKX1gO1xuICAgICAgICBpZiAoIXRvb2x0aXBFbGVtLmNsYXNzTGlzdC5jb250YWlucyhjbiQxKCd0JywgJ2EnKSkpIHtcbiAgICAgICAgICAgIHRvb2x0aXBFbGVtLmNsYXNzTGlzdC5hZGQoY24kMSgndCcsICdhJyksIGNuJDEoJ3QnLCAnaW4nKSk7XG4gICAgICAgICAgICBmb3JjZVJlZmxvdyh0b29sdGlwRWxlbSk7XG4gICAgICAgICAgICB0b29sdGlwRWxlbS5jbGFzc0xpc3QucmVtb3ZlKGNuJDEoJ3QnLCAnaW4nKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgb25WYWx1ZVVwZGF0ZV8oKSB7XG4gICAgICAgIHRoaXMudXBkYXRlXygpO1xuICAgIH1cbiAgICBvbkN1cnNvckNoYW5nZV8oKSB7XG4gICAgICAgIHRoaXMudXBkYXRlXygpO1xuICAgIH1cbn1cblxuY2xhc3MgR3JhcGhMb2dDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihkb2MsIGNvbmZpZykge1xuICAgICAgICB0aGlzLm9uR3JhcGhNb3VzZU1vdmVfID0gdGhpcy5vbkdyYXBoTW91c2VNb3ZlXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uR3JhcGhNb3VzZUxlYXZlXyA9IHRoaXMub25HcmFwaE1vdXNlTGVhdmVfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25HcmFwaFBvaW50ZXJEb3duXyA9IHRoaXMub25HcmFwaFBvaW50ZXJEb3duXy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uR3JhcGhQb2ludGVyTW92ZV8gPSB0aGlzLm9uR3JhcGhQb2ludGVyTW92ZV8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbkdyYXBoUG9pbnRlclVwXyA9IHRoaXMub25HcmFwaFBvaW50ZXJVcF8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5wcm9wcyA9IGNvbmZpZy5wcm9wcztcbiAgICAgICAgdGhpcy52YWx1ZSA9IGNvbmZpZy52YWx1ZTtcbiAgICAgICAgdGhpcy52aWV3UHJvcHMgPSBjb25maWcudmlld1Byb3BzO1xuICAgICAgICB0aGlzLmN1cnNvcl8gPSBjcmVhdGVWYWx1ZSgtMSk7XG4gICAgICAgIHRoaXMudmlldyA9IG5ldyBHcmFwaExvZ1ZpZXcoZG9jLCB7XG4gICAgICAgICAgICBjdXJzb3I6IHRoaXMuY3Vyc29yXyxcbiAgICAgICAgICAgIGZvcm1hdHRlcjogY29uZmlnLmZvcm1hdHRlcixcbiAgICAgICAgICAgIHJvd3M6IGNvbmZpZy5yb3dzLFxuICAgICAgICAgICAgcHJvcHM6IHRoaXMucHJvcHMsXG4gICAgICAgICAgICB2YWx1ZTogdGhpcy52YWx1ZSxcbiAgICAgICAgICAgIHZpZXdQcm9wczogdGhpcy52aWV3UHJvcHMsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIXN1cHBvcnRzVG91Y2goZG9jKSkge1xuICAgICAgICAgICAgdGhpcy52aWV3LmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbkdyYXBoTW91c2VNb3ZlXyk7XG4gICAgICAgICAgICB0aGlzLnZpZXcuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcy5vbkdyYXBoTW91c2VMZWF2ZV8pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcGggPSBuZXcgUG9pbnRlckhhbmRsZXIodGhpcy52aWV3LmVsZW1lbnQpO1xuICAgICAgICAgICAgcGguZW1pdHRlci5vbignZG93bicsIHRoaXMub25HcmFwaFBvaW50ZXJEb3duXyk7XG4gICAgICAgICAgICBwaC5lbWl0dGVyLm9uKCdtb3ZlJywgdGhpcy5vbkdyYXBoUG9pbnRlck1vdmVfKTtcbiAgICAgICAgICAgIHBoLmVtaXR0ZXIub24oJ3VwJywgdGhpcy5vbkdyYXBoUG9pbnRlclVwXyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaW1wb3J0UHJvcHMoc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIGltcG9ydEJsYWRlU3RhdGUoc3RhdGUsIG51bGwsIChwKSA9PiAoe1xuICAgICAgICAgICAgbWF4OiBwLnJlcXVpcmVkLm51bWJlcixcbiAgICAgICAgICAgIG1pbjogcC5yZXF1aXJlZC5udW1iZXIsXG4gICAgICAgIH0pLCAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLnNldCgnbWF4JywgcmVzdWx0Lm1heCk7XG4gICAgICAgICAgICB0aGlzLnByb3BzLnNldCgnbWluJywgcmVzdWx0Lm1pbik7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGV4cG9ydFByb3BzKCkge1xuICAgICAgICByZXR1cm4gZXhwb3J0QmxhZGVTdGF0ZShudWxsLCB7XG4gICAgICAgICAgICBtYXg6IHRoaXMucHJvcHMuZ2V0KCdtYXgnKSxcbiAgICAgICAgICAgIG1pbjogdGhpcy5wcm9wcy5nZXQoJ21pbicpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb25HcmFwaE1vdXNlTGVhdmVfKCkge1xuICAgICAgICB0aGlzLmN1cnNvcl8ucmF3VmFsdWUgPSAtMTtcbiAgICB9XG4gICAgb25HcmFwaE1vdXNlTW92ZV8oZXYpIHtcbiAgICAgICAgY29uc3QgeyBjbGllbnRXaWR0aDogdyB9ID0gdGhpcy52aWV3LmVsZW1lbnQ7XG4gICAgICAgIHRoaXMuY3Vyc29yXy5yYXdWYWx1ZSA9IE1hdGguZmxvb3IobWFwUmFuZ2UoZXYub2Zmc2V0WCwgMCwgdywgMCwgdGhpcy52YWx1ZS5yYXdWYWx1ZS5sZW5ndGgpKTtcbiAgICB9XG4gICAgb25HcmFwaFBvaW50ZXJEb3duXyhldikge1xuICAgICAgICB0aGlzLm9uR3JhcGhQb2ludGVyTW92ZV8oZXYpO1xuICAgIH1cbiAgICBvbkdyYXBoUG9pbnRlck1vdmVfKGV2KSB7XG4gICAgICAgIGlmICghZXYuZGF0YS5wb2ludCkge1xuICAgICAgICAgICAgdGhpcy5jdXJzb3JfLnJhd1ZhbHVlID0gLTE7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdXJzb3JfLnJhd1ZhbHVlID0gTWF0aC5mbG9vcihtYXBSYW5nZShldi5kYXRhLnBvaW50LngsIDAsIGV2LmRhdGEuYm91bmRzLndpZHRoLCAwLCB0aGlzLnZhbHVlLnJhd1ZhbHVlLmxlbmd0aCkpO1xuICAgIH1cbiAgICBvbkdyYXBoUG9pbnRlclVwXygpIHtcbiAgICAgICAgdGhpcy5jdXJzb3JfLnJhd1ZhbHVlID0gLTE7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVGb3JtYXR0ZXIocGFyYW1zKSB7XG4gICAgcmV0dXJuICFpc0VtcHR5KHBhcmFtcy5mb3JtYXQpID8gcGFyYW1zLmZvcm1hdCA6IGNyZWF0ZU51bWJlckZvcm1hdHRlcigyKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVRleHRNb25pdG9yKGFyZ3MpIHtcbiAgICB2YXIgX2E7XG4gICAgaWYgKGFyZ3MudmFsdWUucmF3VmFsdWUubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiBuZXcgU2luZ2xlTG9nQ29udHJvbGxlcihhcmdzLmRvY3VtZW50LCB7XG4gICAgICAgICAgICBmb3JtYXR0ZXI6IGNyZWF0ZUZvcm1hdHRlcihhcmdzLnBhcmFtcyksXG4gICAgICAgICAgICB2YWx1ZTogYXJncy52YWx1ZSxcbiAgICAgICAgICAgIHZpZXdQcm9wczogYXJncy52aWV3UHJvcHMsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE11bHRpTG9nQ29udHJvbGxlcihhcmdzLmRvY3VtZW50LCB7XG4gICAgICAgIGZvcm1hdHRlcjogY3JlYXRlRm9ybWF0dGVyKGFyZ3MucGFyYW1zKSxcbiAgICAgICAgcm93czogKF9hID0gYXJncy5wYXJhbXMucm93cykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogQ29uc3RhbnRzLm1vbml0b3IuZGVmYXVsdFJvd3MsXG4gICAgICAgIHZhbHVlOiBhcmdzLnZhbHVlLFxuICAgICAgICB2aWV3UHJvcHM6IGFyZ3Mudmlld1Byb3BzLFxuICAgIH0pO1xufVxuZnVuY3Rpb24gY3JlYXRlR3JhcGhNb25pdG9yKGFyZ3MpIHtcbiAgICB2YXIgX2EsIF9iLCBfYztcbiAgICByZXR1cm4gbmV3IEdyYXBoTG9nQ29udHJvbGxlcihhcmdzLmRvY3VtZW50LCB7XG4gICAgICAgIGZvcm1hdHRlcjogY3JlYXRlRm9ybWF0dGVyKGFyZ3MucGFyYW1zKSxcbiAgICAgICAgcm93czogKF9hID0gYXJncy5wYXJhbXMucm93cykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogQ29uc3RhbnRzLm1vbml0b3IuZGVmYXVsdFJvd3MsXG4gICAgICAgIHByb3BzOiBWYWx1ZU1hcC5mcm9tT2JqZWN0KHtcbiAgICAgICAgICAgIG1heDogKF9iID0gYXJncy5wYXJhbXMubWF4KSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAxMDAsXG4gICAgICAgICAgICBtaW46IChfYyA9IGFyZ3MucGFyYW1zLm1pbikgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogMCxcbiAgICAgICAgfSksXG4gICAgICAgIHZhbHVlOiBhcmdzLnZhbHVlLFxuICAgICAgICB2aWV3UHJvcHM6IGFyZ3Mudmlld1Byb3BzLFxuICAgIH0pO1xufVxuZnVuY3Rpb24gc2hvdWxkU2hvd0dyYXBoKHBhcmFtcykge1xuICAgIHJldHVybiBwYXJhbXMudmlldyA9PT0gJ2dyYXBoJztcbn1cbmNvbnN0IE51bWJlck1vbml0b3JQbHVnaW4gPSBjcmVhdGVQbHVnaW4oe1xuICAgIGlkOiAnbW9uaXRvci1udW1iZXInLFxuICAgIHR5cGU6ICdtb25pdG9yJyxcbiAgICBhY2NlcHQ6ICh2YWx1ZSwgcGFyYW1zKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXN1bHQgPSBwYXJzZVJlY29yZChwYXJhbXMsIChwKSA9PiAoe1xuICAgICAgICAgICAgZm9ybWF0OiBwLm9wdGlvbmFsLmZ1bmN0aW9uLFxuICAgICAgICAgICAgbWF4OiBwLm9wdGlvbmFsLm51bWJlcixcbiAgICAgICAgICAgIG1pbjogcC5vcHRpb25hbC5udW1iZXIsXG4gICAgICAgICAgICByZWFkb25seTogcC5yZXF1aXJlZC5jb25zdGFudCh0cnVlKSxcbiAgICAgICAgICAgIHJvd3M6IHAub3B0aW9uYWwubnVtYmVyLFxuICAgICAgICAgICAgdmlldzogcC5vcHRpb25hbC5zdHJpbmcsXG4gICAgICAgIH0pKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgaW5pdGlhbFZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHJlc3VsdCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogbnVsbDtcbiAgICB9LFxuICAgIGJpbmRpbmc6IHtcbiAgICAgICAgZGVmYXVsdEJ1ZmZlclNpemU6IChwYXJhbXMpID0+IChzaG91bGRTaG93R3JhcGgocGFyYW1zKSA/IDY0IDogMSksXG4gICAgICAgIHJlYWRlcjogKF9hcmdzKSA9PiBudW1iZXJGcm9tVW5rbm93bixcbiAgICB9LFxuICAgIGNvbnRyb2xsZXI6IChhcmdzKSA9PiB7XG4gICAgICAgIGlmIChzaG91bGRTaG93R3JhcGgoYXJncy5wYXJhbXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlR3JhcGhNb25pdG9yKGFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjcmVhdGVUZXh0TW9uaXRvcihhcmdzKTtcbiAgICB9LFxuICAgIGFwaTogKGFyZ3MpID0+IHtcbiAgICAgICAgaWYgKGFyZ3MuY29udHJvbGxlci52YWx1ZUNvbnRyb2xsZXIgaW5zdGFuY2VvZiBHcmFwaExvZ0NvbnRyb2xsZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgR3JhcGhMb2dNb25pdG9yQmluZGluZ0FwaShhcmdzLmNvbnRyb2xsZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG59KTtcblxuY29uc3QgU3RyaW5nTW9uaXRvclBsdWdpbiA9IGNyZWF0ZVBsdWdpbih7XG4gICAgaWQ6ICdtb25pdG9yLXN0cmluZycsXG4gICAgdHlwZTogJ21vbml0b3InLFxuICAgIGFjY2VwdDogKHZhbHVlLCBwYXJhbXMpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlUmVjb3JkKHBhcmFtcywgKHApID0+ICh7XG4gICAgICAgICAgICBtdWx0aWxpbmU6IHAub3B0aW9uYWwuYm9vbGVhbixcbiAgICAgICAgICAgIHJlYWRvbmx5OiBwLnJlcXVpcmVkLmNvbnN0YW50KHRydWUpLFxuICAgICAgICAgICAgcm93czogcC5vcHRpb25hbC5udW1iZXIsXG4gICAgICAgIH0pKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgaW5pdGlhbFZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHJlc3VsdCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogbnVsbDtcbiAgICB9LFxuICAgIGJpbmRpbmc6IHtcbiAgICAgICAgcmVhZGVyOiAoX2FyZ3MpID0+IHN0cmluZ0Zyb21Vbmtub3duLFxuICAgIH0sXG4gICAgY29udHJvbGxlcjogKGFyZ3MpID0+IHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGFyZ3MudmFsdWU7XG4gICAgICAgIGNvbnN0IG11bHRpbGluZSA9IHZhbHVlLnJhd1ZhbHVlLmxlbmd0aCA+IDEgfHwgYXJncy5wYXJhbXMubXVsdGlsaW5lO1xuICAgICAgICBpZiAobXVsdGlsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE11bHRpTG9nQ29udHJvbGxlcihhcmdzLmRvY3VtZW50LCB7XG4gICAgICAgICAgICAgICAgZm9ybWF0dGVyOiBmb3JtYXRTdHJpbmcsXG4gICAgICAgICAgICAgICAgcm93czogKF9hID0gYXJncy5wYXJhbXMucm93cykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogQ29uc3RhbnRzLm1vbml0b3IuZGVmYXVsdFJvd3MsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgIHZpZXdQcm9wczogYXJncy52aWV3UHJvcHMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFNpbmdsZUxvZ0NvbnRyb2xsZXIoYXJncy5kb2N1bWVudCwge1xuICAgICAgICAgICAgZm9ybWF0dGVyOiBmb3JtYXRTdHJpbmcsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICB2aWV3UHJvcHM6IGFyZ3Mudmlld1Byb3BzLFxuICAgICAgICB9KTtcbiAgICB9LFxufSk7XG5cbmNsYXNzIEJsYWRlQXBpQ2FjaGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLm1hcF8gPSBuZXcgTWFwKCk7XG4gICAgfVxuICAgIGdldChiYykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiAoX2EgPSB0aGlzLm1hcF8uZ2V0KGJjKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogbnVsbDtcbiAgICB9XG4gICAgaGFzKGJjKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcF8uaGFzKGJjKTtcbiAgICB9XG4gICAgYWRkKGJjLCBhcGkpIHtcbiAgICAgICAgdGhpcy5tYXBfLnNldChiYywgYXBpKTtcbiAgICAgICAgYmMudmlld1Byb3BzLmhhbmRsZURpc3Bvc2UoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5tYXBfLmRlbGV0ZShiYyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYXBpO1xuICAgIH1cbn1cblxuY2xhc3MgUmVhZFdyaXRlQmluZGluZyB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gY29uZmlnLnRhcmdldDtcbiAgICAgICAgdGhpcy5yZWFkZXJfID0gY29uZmlnLnJlYWRlcjtcbiAgICAgICAgdGhpcy53cml0ZXJfID0gY29uZmlnLndyaXRlcjtcbiAgICB9XG4gICAgcmVhZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVhZGVyXyh0aGlzLnRhcmdldC5yZWFkKCkpO1xuICAgIH1cbiAgICB3cml0ZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLndyaXRlcl8odGhpcy50YXJnZXQsIHZhbHVlKTtcbiAgICB9XG4gICAgaW5qZWN0KHZhbHVlKSB7XG4gICAgICAgIHRoaXMud3JpdGUodGhpcy5yZWFkZXJfKHZhbHVlKSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVJbnB1dEJpbmRpbmdDb250cm9sbGVyKHBsdWdpbiwgYXJncykge1xuICAgIHZhciBfYTtcbiAgICBjb25zdCByZXN1bHQgPSBwbHVnaW4uYWNjZXB0KGFyZ3MudGFyZ2V0LnJlYWQoKSwgYXJncy5wYXJhbXMpO1xuICAgIGlmIChpc0VtcHR5KHJlc3VsdCkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHZhbHVlQXJncyA9IHtcbiAgICAgICAgdGFyZ2V0OiBhcmdzLnRhcmdldCxcbiAgICAgICAgaW5pdGlhbFZhbHVlOiByZXN1bHQuaW5pdGlhbFZhbHVlLFxuICAgICAgICBwYXJhbXM6IHJlc3VsdC5wYXJhbXMsXG4gICAgfTtcbiAgICBjb25zdCBwYXJhbXMgPSBwYXJzZVJlY29yZChhcmdzLnBhcmFtcywgKHApID0+ICh7XG4gICAgICAgIGRpc2FibGVkOiBwLm9wdGlvbmFsLmJvb2xlYW4sXG4gICAgICAgIGhpZGRlbjogcC5vcHRpb25hbC5ib29sZWFuLFxuICAgICAgICBsYWJlbDogcC5vcHRpb25hbC5zdHJpbmcsXG4gICAgICAgIHRhZzogcC5vcHRpb25hbC5zdHJpbmcsXG4gICAgfSkpO1xuICAgIGNvbnN0IHJlYWRlciA9IHBsdWdpbi5iaW5kaW5nLnJlYWRlcih2YWx1ZUFyZ3MpO1xuICAgIGNvbnN0IGNvbnN0cmFpbnQgPSBwbHVnaW4uYmluZGluZy5jb25zdHJhaW50XG4gICAgICAgID8gcGx1Z2luLmJpbmRpbmcuY29uc3RyYWludCh2YWx1ZUFyZ3MpXG4gICAgICAgIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IGJpbmRpbmcgPSBuZXcgUmVhZFdyaXRlQmluZGluZyh7XG4gICAgICAgIHJlYWRlcjogcmVhZGVyLFxuICAgICAgICB0YXJnZXQ6IGFyZ3MudGFyZ2V0LFxuICAgICAgICB3cml0ZXI6IHBsdWdpbi5iaW5kaW5nLndyaXRlcih2YWx1ZUFyZ3MpLFxuICAgIH0pO1xuICAgIGNvbnN0IHZhbHVlID0gbmV3IElucHV0QmluZGluZ1ZhbHVlKGNyZWF0ZVZhbHVlKHJlYWRlcihyZXN1bHQuaW5pdGlhbFZhbHVlKSwge1xuICAgICAgICBjb25zdHJhaW50OiBjb25zdHJhaW50LFxuICAgICAgICBlcXVhbHM6IHBsdWdpbi5iaW5kaW5nLmVxdWFscyxcbiAgICB9KSwgYmluZGluZyk7XG4gICAgY29uc3QgY29udHJvbGxlciA9IHBsdWdpbi5jb250cm9sbGVyKHtcbiAgICAgICAgY29uc3RyYWludDogY29uc3RyYWludCxcbiAgICAgICAgZG9jdW1lbnQ6IGFyZ3MuZG9jdW1lbnQsXG4gICAgICAgIGluaXRpYWxWYWx1ZTogcmVzdWx0LmluaXRpYWxWYWx1ZSxcbiAgICAgICAgcGFyYW1zOiByZXN1bHQucGFyYW1zLFxuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIHZpZXdQcm9wczogVmlld1Byb3BzLmNyZWF0ZSh7XG4gICAgICAgICAgICBkaXNhYmxlZDogcGFyYW1zID09PSBudWxsIHx8IHBhcmFtcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcGFyYW1zLmRpc2FibGVkLFxuICAgICAgICAgICAgaGlkZGVuOiBwYXJhbXMgPT09IG51bGwgfHwgcGFyYW1zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwYXJhbXMuaGlkZGVuLFxuICAgICAgICB9KSxcbiAgICB9KTtcbiAgICByZXR1cm4gbmV3IElucHV0QmluZGluZ0NvbnRyb2xsZXIoYXJncy5kb2N1bWVudCwge1xuICAgICAgICBibGFkZTogY3JlYXRlQmxhZGUoKSxcbiAgICAgICAgcHJvcHM6IFZhbHVlTWFwLmZyb21PYmplY3Qoe1xuICAgICAgICAgICAgbGFiZWw6ICdsYWJlbCcgaW4gYXJncy5wYXJhbXMgPyAoX2EgPSBwYXJhbXMgPT09IG51bGwgfHwgcGFyYW1zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwYXJhbXMubGFiZWwpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IG51bGwgOiBhcmdzLnRhcmdldC5rZXksXG4gICAgICAgIH0pLFxuICAgICAgICB0YWc6IHBhcmFtcyA9PT0gbnVsbCB8fCBwYXJhbXMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHBhcmFtcy50YWcsXG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgdmFsdWVDb250cm9sbGVyOiBjb250cm9sbGVyLFxuICAgIH0pO1xufVxuXG5jbGFzcyBSZWFkb25seUJpbmRpbmcge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgICB0aGlzLnRhcmdldCA9IGNvbmZpZy50YXJnZXQ7XG4gICAgICAgIHRoaXMucmVhZGVyXyA9IGNvbmZpZy5yZWFkZXI7XG4gICAgfVxuICAgIHJlYWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlYWRlcl8odGhpcy50YXJnZXQucmVhZCgpKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRpY2tlcihkb2N1bWVudCwgaW50ZXJ2YWwpIHtcbiAgICByZXR1cm4gaW50ZXJ2YWwgPT09IDBcbiAgICAgICAgPyBuZXcgTWFudWFsVGlja2VyKClcbiAgICAgICAgOiBuZXcgSW50ZXJ2YWxUaWNrZXIoZG9jdW1lbnQsIGludGVydmFsICE9PSBudWxsICYmIGludGVydmFsICE9PSB2b2lkIDAgPyBpbnRlcnZhbCA6IENvbnN0YW50cy5tb25pdG9yLmRlZmF1bHRJbnRlcnZhbCk7XG59XG5mdW5jdGlvbiBjcmVhdGVNb25pdG9yQmluZGluZ0NvbnRyb2xsZXIocGx1Z2luLCBhcmdzKSB7XG4gICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgY29uc3QgcmVzdWx0ID0gcGx1Z2luLmFjY2VwdChhcmdzLnRhcmdldC5yZWFkKCksIGFyZ3MucGFyYW1zKTtcbiAgICBpZiAoaXNFbXB0eShyZXN1bHQpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBiaW5kaW5nQXJncyA9IHtcbiAgICAgICAgdGFyZ2V0OiBhcmdzLnRhcmdldCxcbiAgICAgICAgaW5pdGlhbFZhbHVlOiByZXN1bHQuaW5pdGlhbFZhbHVlLFxuICAgICAgICBwYXJhbXM6IHJlc3VsdC5wYXJhbXMsXG4gICAgfTtcbiAgICBjb25zdCBwYXJhbXMgPSBwYXJzZVJlY29yZChhcmdzLnBhcmFtcywgKHApID0+ICh7XG4gICAgICAgIGJ1ZmZlclNpemU6IHAub3B0aW9uYWwubnVtYmVyLFxuICAgICAgICBkaXNhYmxlZDogcC5vcHRpb25hbC5ib29sZWFuLFxuICAgICAgICBoaWRkZW46IHAub3B0aW9uYWwuYm9vbGVhbixcbiAgICAgICAgaW50ZXJ2YWw6IHAub3B0aW9uYWwubnVtYmVyLFxuICAgICAgICBsYWJlbDogcC5vcHRpb25hbC5zdHJpbmcsXG4gICAgfSkpO1xuICAgIGNvbnN0IHJlYWRlciA9IHBsdWdpbi5iaW5kaW5nLnJlYWRlcihiaW5kaW5nQXJncyk7XG4gICAgY29uc3QgYnVmZmVyU2l6ZSA9IChfYiA9IChfYSA9IHBhcmFtcyA9PT0gbnVsbCB8fCBwYXJhbXMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHBhcmFtcy5idWZmZXJTaXplKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAocGx1Z2luLmJpbmRpbmcuZGVmYXVsdEJ1ZmZlclNpemUgJiZcbiAgICAgICAgcGx1Z2luLmJpbmRpbmcuZGVmYXVsdEJ1ZmZlclNpemUocmVzdWx0LnBhcmFtcykpKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAxO1xuICAgIGNvbnN0IHZhbHVlID0gbmV3IE1vbml0b3JCaW5kaW5nVmFsdWUoe1xuICAgICAgICBiaW5kaW5nOiBuZXcgUmVhZG9ubHlCaW5kaW5nKHtcbiAgICAgICAgICAgIHJlYWRlcjogcmVhZGVyLFxuICAgICAgICAgICAgdGFyZ2V0OiBhcmdzLnRhcmdldCxcbiAgICAgICAgfSksXG4gICAgICAgIGJ1ZmZlclNpemU6IGJ1ZmZlclNpemUsXG4gICAgICAgIHRpY2tlcjogY3JlYXRlVGlja2VyKGFyZ3MuZG9jdW1lbnQsIHBhcmFtcyA9PT0gbnVsbCB8fCBwYXJhbXMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHBhcmFtcy5pbnRlcnZhbCksXG4gICAgfSk7XG4gICAgY29uc3QgY29udHJvbGxlciA9IHBsdWdpbi5jb250cm9sbGVyKHtcbiAgICAgICAgZG9jdW1lbnQ6IGFyZ3MuZG9jdW1lbnQsXG4gICAgICAgIHBhcmFtczogcmVzdWx0LnBhcmFtcyxcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICB2aWV3UHJvcHM6IFZpZXdQcm9wcy5jcmVhdGUoe1xuICAgICAgICAgICAgZGlzYWJsZWQ6IHBhcmFtcyA9PT0gbnVsbCB8fCBwYXJhbXMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHBhcmFtcy5kaXNhYmxlZCxcbiAgICAgICAgICAgIGhpZGRlbjogcGFyYW1zID09PSBudWxsIHx8IHBhcmFtcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcGFyYW1zLmhpZGRlbixcbiAgICAgICAgfSksXG4gICAgfSk7XG4gICAgY29udHJvbGxlci52aWV3UHJvcHMuYmluZERpc2FibGVkKHZhbHVlLnRpY2tlcik7XG4gICAgY29udHJvbGxlci52aWV3UHJvcHMuaGFuZGxlRGlzcG9zZSgoKSA9PiB7XG4gICAgICAgIHZhbHVlLnRpY2tlci5kaXNwb3NlKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG5ldyBNb25pdG9yQmluZGluZ0NvbnRyb2xsZXIoYXJncy5kb2N1bWVudCwge1xuICAgICAgICBibGFkZTogY3JlYXRlQmxhZGUoKSxcbiAgICAgICAgcHJvcHM6IFZhbHVlTWFwLmZyb21PYmplY3Qoe1xuICAgICAgICAgICAgbGFiZWw6ICdsYWJlbCcgaW4gYXJncy5wYXJhbXMgPyAoX2MgPSBwYXJhbXMgPT09IG51bGwgfHwgcGFyYW1zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwYXJhbXMubGFiZWwpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IG51bGwgOiBhcmdzLnRhcmdldC5rZXksXG4gICAgICAgIH0pLFxuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIHZhbHVlQ29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICB9KTtcbn1cblxuY2xhc3MgUGx1Z2luUG9vbCB7XG4gICAgY29uc3RydWN0b3IoYXBpQ2FjaGUpIHtcbiAgICAgICAgdGhpcy5wbHVnaW5zTWFwXyA9IHtcbiAgICAgICAgICAgIGJsYWRlczogW10sXG4gICAgICAgICAgICBpbnB1dHM6IFtdLFxuICAgICAgICAgICAgbW9uaXRvcnM6IFtdLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmFwaUNhY2hlXyA9IGFwaUNhY2hlO1xuICAgIH1cbiAgICBnZXRBbGwoKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAuLi50aGlzLnBsdWdpbnNNYXBfLmJsYWRlcyxcbiAgICAgICAgICAgIC4uLnRoaXMucGx1Z2luc01hcF8uaW5wdXRzLFxuICAgICAgICAgICAgLi4udGhpcy5wbHVnaW5zTWFwXy5tb25pdG9ycyxcbiAgICAgICAgXTtcbiAgICB9XG4gICAgcmVnaXN0ZXIoYnVuZGxlSWQsIHIpIHtcbiAgICAgICAgaWYgKCFpc0NvbXBhdGlibGUoci5jb3JlKSkge1xuICAgICAgICAgICAgdGhyb3cgVHBFcnJvci5ub3RDb21wYXRpYmxlKGJ1bmRsZUlkLCByLmlkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoci50eXBlID09PSAnYmxhZGUnKSB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbnNNYXBfLmJsYWRlcy51bnNoaWZ0KHIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHIudHlwZSA9PT0gJ2lucHV0Jykge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW5zTWFwXy5pbnB1dHMudW5zaGlmdChyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyLnR5cGUgPT09ICdtb25pdG9yJykge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW5zTWFwXy5tb25pdG9ycy51bnNoaWZ0KHIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNyZWF0ZUlucHV0Xyhkb2N1bWVudCwgdGFyZ2V0LCBwYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGx1Z2luc01hcF8uaW5wdXRzLnJlZHVjZSgocmVzdWx0LCBwbHVnaW4pID0+IHJlc3VsdCAhPT0gbnVsbCAmJiByZXN1bHQgIT09IHZvaWQgMCA/IHJlc3VsdCA6IGNyZWF0ZUlucHV0QmluZGluZ0NvbnRyb2xsZXIocGx1Z2luLCB7XG4gICAgICAgICAgICBkb2N1bWVudDogZG9jdW1lbnQsXG4gICAgICAgICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgICAgICAgIHBhcmFtczogcGFyYW1zLFxuICAgICAgICB9KSwgbnVsbCk7XG4gICAgfVxuICAgIGNyZWF0ZU1vbml0b3JfKGRvY3VtZW50LCB0YXJnZXQsIHBhcmFtcykge1xuICAgICAgICByZXR1cm4gdGhpcy5wbHVnaW5zTWFwXy5tb25pdG9ycy5yZWR1Y2UoKHJlc3VsdCwgcGx1Z2luKSA9PiByZXN1bHQgIT09IG51bGwgJiYgcmVzdWx0ICE9PSB2b2lkIDAgPyByZXN1bHQgOiBjcmVhdGVNb25pdG9yQmluZGluZ0NvbnRyb2xsZXIocGx1Z2luLCB7XG4gICAgICAgICAgICBkb2N1bWVudDogZG9jdW1lbnQsXG4gICAgICAgICAgICBwYXJhbXM6IHBhcmFtcyxcbiAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICB9KSwgbnVsbCk7XG4gICAgfVxuICAgIGNyZWF0ZUJpbmRpbmcoZG9jLCB0YXJnZXQsIHBhcmFtcykge1xuICAgICAgICBjb25zdCBpbml0aWFsVmFsdWUgPSB0YXJnZXQucmVhZCgpO1xuICAgICAgICBpZiAoaXNFbXB0eShpbml0aWFsVmFsdWUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHBFcnJvcih7XG4gICAgICAgICAgICAgICAgY29udGV4dDoge1xuICAgICAgICAgICAgICAgICAgICBrZXk6IHRhcmdldC5rZXksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0eXBlOiAnbm9tYXRjaGluZ2NvbnRyb2xsZXInLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaWMgPSB0aGlzLmNyZWF0ZUlucHV0Xyhkb2MsIHRhcmdldCwgcGFyYW1zKTtcbiAgICAgICAgaWYgKGljKSB7XG4gICAgICAgICAgICByZXR1cm4gaWM7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWMgPSB0aGlzLmNyZWF0ZU1vbml0b3JfKGRvYywgdGFyZ2V0LCBwYXJhbXMpO1xuICAgICAgICBpZiAobWMpIHtcbiAgICAgICAgICAgIHJldHVybiBtYztcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgVHBFcnJvcih7XG4gICAgICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgICAgICAga2V5OiB0YXJnZXQua2V5LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6ICdub21hdGNoaW5nY29udHJvbGxlcicsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjcmVhdGVCbGFkZShkb2N1bWVudCwgcGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IGJjID0gdGhpcy5wbHVnaW5zTWFwXy5ibGFkZXMucmVkdWNlKChyZXN1bHQsIHBsdWdpbikgPT4gcmVzdWx0ICE9PSBudWxsICYmIHJlc3VsdCAhPT0gdm9pZCAwID8gcmVzdWx0IDogY3JlYXRlQmxhZGVDb250cm9sbGVyKHBsdWdpbiwge1xuICAgICAgICAgICAgZG9jdW1lbnQ6IGRvY3VtZW50LFxuICAgICAgICAgICAgcGFyYW1zOiBwYXJhbXMsXG4gICAgICAgIH0pLCBudWxsKTtcbiAgICAgICAgaWYgKCFiYykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFRwRXJyb3Ioe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdub21hdGNoaW5ndmlldycsXG4gICAgICAgICAgICAgICAgY29udGV4dDoge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHBhcmFtcyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJjO1xuICAgIH1cbiAgICBjcmVhdGVJbnB1dEJpbmRpbmdBcGlfKGJjKSB7XG4gICAgICAgIGNvbnN0IGFwaSA9IHRoaXMucGx1Z2luc01hcF8uaW5wdXRzLnJlZHVjZSgocmVzdWx0LCBwbHVnaW4pID0+IHtcbiAgICAgICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAoKF9iID0gKF9hID0gcGx1Z2luLmFwaSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwocGx1Z2luLCB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogYmMsXG4gICAgICAgICAgICB9KSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogbnVsbCk7XG4gICAgICAgIH0sIG51bGwpO1xuICAgICAgICByZXR1cm4gdGhpcy5hcGlDYWNoZV8uYWRkKGJjLCBhcGkgIT09IG51bGwgJiYgYXBpICE9PSB2b2lkIDAgPyBhcGkgOiBuZXcgQmluZGluZ0FwaShiYykpO1xuICAgIH1cbiAgICBjcmVhdGVNb25pdG9yQmluZGluZ0FwaV8oYmMpIHtcbiAgICAgICAgY29uc3QgYXBpID0gdGhpcy5wbHVnaW5zTWFwXy5tb25pdG9ycy5yZWR1Y2UoKHJlc3VsdCwgcGx1Z2luKSA9PiB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKChfYiA9IChfYSA9IHBsdWdpbi5hcGkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKHBsdWdpbiwge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGJjLFxuICAgICAgICAgICAgfSkpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IG51bGwpO1xuICAgICAgICB9LCBudWxsKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpQ2FjaGVfLmFkZChiYywgYXBpICE9PSBudWxsICYmIGFwaSAhPT0gdm9pZCAwID8gYXBpIDogbmV3IEJpbmRpbmdBcGkoYmMpKTtcbiAgICB9XG4gICAgY3JlYXRlQmluZGluZ0FwaShiYykge1xuICAgICAgICBpZiAodGhpcy5hcGlDYWNoZV8uaGFzKGJjKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXBpQ2FjaGVfLmdldChiYyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzSW5wdXRCaW5kaW5nQ29udHJvbGxlcihiYykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUlucHV0QmluZGluZ0FwaV8oYmMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc01vbml0b3JCaW5kaW5nQ29udHJvbGxlcihiYykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU1vbml0b3JCaW5kaW5nQXBpXyhiYyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgVHBFcnJvci5zaG91bGROZXZlckhhcHBlbigpO1xuICAgIH1cbiAgICBjcmVhdGVBcGkoYmMpIHtcbiAgICAgICAgaWYgKHRoaXMuYXBpQ2FjaGVfLmhhcyhiYykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFwaUNhY2hlXy5nZXQoYmMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0JpbmRpbmdDb250cm9sbGVyKGJjKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlQmluZGluZ0FwaShiYyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXBpID0gdGhpcy5wbHVnaW5zTWFwXy5ibGFkZXMucmVkdWNlKChyZXN1bHQsIHBsdWdpbikgPT4gcmVzdWx0ICE9PSBudWxsICYmIHJlc3VsdCAhPT0gdm9pZCAwID8gcmVzdWx0IDogcGx1Z2luLmFwaSh7XG4gICAgICAgICAgICBjb250cm9sbGVyOiBiYyxcbiAgICAgICAgICAgIHBvb2w6IHRoaXMsXG4gICAgICAgIH0pLCBudWxsKTtcbiAgICAgICAgaWYgKCFhcGkpIHtcbiAgICAgICAgICAgIHRocm93IFRwRXJyb3Iuc2hvdWxkTmV2ZXJIYXBwZW4oKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5hcGlDYWNoZV8uYWRkKGJjLCBhcGkpO1xuICAgIH1cbn1cblxuY29uc3Qgc2hhcmVkQ2FjaGUgPSBuZXcgQmxhZGVBcGlDYWNoZSgpO1xuZnVuY3Rpb24gY3JlYXRlRGVmYXVsdFBsdWdpblBvb2woKSB7XG4gICAgY29uc3QgcG9vbCA9IG5ldyBQbHVnaW5Qb29sKHNoYXJlZENhY2hlKTtcbiAgICBbXG4gICAgICAgIFBvaW50MmRJbnB1dFBsdWdpbixcbiAgICAgICAgUG9pbnQzZElucHV0UGx1Z2luLFxuICAgICAgICBQb2ludDRkSW5wdXRQbHVnaW4sXG4gICAgICAgIFN0cmluZ0lucHV0UGx1Z2luLFxuICAgICAgICBOdW1iZXJJbnB1dFBsdWdpbixcbiAgICAgICAgU3RyaW5nQ29sb3JJbnB1dFBsdWdpbixcbiAgICAgICAgT2JqZWN0Q29sb3JJbnB1dFBsdWdpbixcbiAgICAgICAgTnVtYmVyQ29sb3JJbnB1dFBsdWdpbixcbiAgICAgICAgQm9vbGVhbklucHV0UGx1Z2luLFxuICAgICAgICBCb29sZWFuTW9uaXRvclBsdWdpbixcbiAgICAgICAgU3RyaW5nTW9uaXRvclBsdWdpbixcbiAgICAgICAgTnVtYmVyTW9uaXRvclBsdWdpbixcbiAgICAgICAgQnV0dG9uQmxhZGVQbHVnaW4sXG4gICAgICAgIEZvbGRlckJsYWRlUGx1Z2luLFxuICAgICAgICBUYWJCbGFkZVBsdWdpbixcbiAgICBdLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgcG9vbC5yZWdpc3RlcignY29yZScsIHApO1xuICAgIH0pO1xuICAgIHJldHVybiBwb29sO1xufVxuXG5jbGFzcyBMaXN0QmxhZGVBcGkgZXh0ZW5kcyBCbGFkZUFwaSB7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXIpIHtcbiAgICAgICAgc3VwZXIoY29udHJvbGxlcik7XG4gICAgICAgIHRoaXMuZW1pdHRlcl8gPSBuZXcgRW1pdHRlcigpO1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIudmFsdWUuZW1pdHRlci5vbignY2hhbmdlJywgKGV2KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVtaXR0ZXJfLmVtaXQoJ2NoYW5nZScsIG5ldyBUcENoYW5nZUV2ZW50KHRoaXMsIGV2LnJhd1ZhbHVlKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnZXQgbGFiZWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXIubGFiZWxDb250cm9sbGVyLnByb3BzLmdldCgnbGFiZWwnKTtcbiAgICB9XG4gICAgc2V0IGxhYmVsKGxhYmVsKSB7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci5sYWJlbENvbnRyb2xsZXIucHJvcHMuc2V0KCdsYWJlbCcsIGxhYmVsKTtcbiAgICB9XG4gICAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXIudmFsdWVDb250cm9sbGVyLnByb3BzLmdldCgnb3B0aW9ucycpO1xuICAgIH1cbiAgICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci52YWx1ZUNvbnRyb2xsZXIucHJvcHMuc2V0KCdvcHRpb25zJywgb3B0aW9ucyk7XG4gICAgfVxuICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlci52YWx1ZS5yYXdWYWx1ZTtcbiAgICB9XG4gICAgc2V0IHZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci52YWx1ZS5yYXdWYWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgICBvbihldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgICAgY29uc3QgYmggPSBoYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZW1pdHRlcl8ub24oZXZlbnROYW1lLCAoZXYpID0+IHtcbiAgICAgICAgICAgIGJoKGV2KTtcbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiBoYW5kbGVyLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIG9mZihldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyXy5vZmYoZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG5jbGFzcyBTZXBhcmF0b3JCbGFkZUFwaSBleHRlbmRzIEJsYWRlQXBpIHtcbn1cblxuY2xhc3MgU2xpZGVyQmxhZGVBcGkgZXh0ZW5kcyBCbGFkZUFwaSB7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXIpIHtcbiAgICAgICAgc3VwZXIoY29udHJvbGxlcik7XG4gICAgICAgIHRoaXMuZW1pdHRlcl8gPSBuZXcgRW1pdHRlcigpO1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIudmFsdWUuZW1pdHRlci5vbignY2hhbmdlJywgKGV2KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVtaXR0ZXJfLmVtaXQoJ2NoYW5nZScsIG5ldyBUcENoYW5nZUV2ZW50KHRoaXMsIGV2LnJhd1ZhbHVlKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnZXQgbGFiZWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXIubGFiZWxDb250cm9sbGVyLnByb3BzLmdldCgnbGFiZWwnKTtcbiAgICB9XG4gICAgc2V0IGxhYmVsKGxhYmVsKSB7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci5sYWJlbENvbnRyb2xsZXIucHJvcHMuc2V0KCdsYWJlbCcsIGxhYmVsKTtcbiAgICB9XG4gICAgZ2V0IG1heCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlci52YWx1ZUNvbnRyb2xsZXIuc2xpZGVyQ29udHJvbGxlci5wcm9wcy5nZXQoJ21heCcpO1xuICAgIH1cbiAgICBzZXQgbWF4KG1heCkge1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIudmFsdWVDb250cm9sbGVyLnNsaWRlckNvbnRyb2xsZXIucHJvcHMuc2V0KCdtYXgnLCBtYXgpO1xuICAgIH1cbiAgICBnZXQgbWluKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyLnZhbHVlQ29udHJvbGxlci5zbGlkZXJDb250cm9sbGVyLnByb3BzLmdldCgnbWluJyk7XG4gICAgfVxuICAgIHNldCBtaW4obWluKSB7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci52YWx1ZUNvbnRyb2xsZXIuc2xpZGVyQ29udHJvbGxlci5wcm9wcy5zZXQoJ21pbicsIG1pbik7XG4gICAgfVxuICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlci52YWx1ZS5yYXdWYWx1ZTtcbiAgICB9XG4gICAgc2V0IHZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci52YWx1ZS5yYXdWYWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgICBvbihldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgICAgY29uc3QgYmggPSBoYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZW1pdHRlcl8ub24oZXZlbnROYW1lLCAoZXYpID0+IHtcbiAgICAgICAgICAgIGJoKGV2KTtcbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiBoYW5kbGVyLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIG9mZihldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyXy5vZmYoZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG5jbGFzcyBUZXh0QmxhZGVBcGkgZXh0ZW5kcyBCbGFkZUFwaSB7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXIpIHtcbiAgICAgICAgc3VwZXIoY29udHJvbGxlcik7XG4gICAgICAgIHRoaXMuZW1pdHRlcl8gPSBuZXcgRW1pdHRlcigpO1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIudmFsdWUuZW1pdHRlci5vbignY2hhbmdlJywgKGV2KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVtaXR0ZXJfLmVtaXQoJ2NoYW5nZScsIG5ldyBUcENoYW5nZUV2ZW50KHRoaXMsIGV2LnJhd1ZhbHVlKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnZXQgbGFiZWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXIubGFiZWxDb250cm9sbGVyLnByb3BzLmdldCgnbGFiZWwnKTtcbiAgICB9XG4gICAgc2V0IGxhYmVsKGxhYmVsKSB7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci5sYWJlbENvbnRyb2xsZXIucHJvcHMuc2V0KCdsYWJlbCcsIGxhYmVsKTtcbiAgICB9XG4gICAgZ2V0IGZvcm1hdHRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlci52YWx1ZUNvbnRyb2xsZXIucHJvcHMuZ2V0KCdmb3JtYXR0ZXInKTtcbiAgICB9XG4gICAgc2V0IGZvcm1hdHRlcihmb3JtYXR0ZXIpIHtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnZhbHVlQ29udHJvbGxlci5wcm9wcy5zZXQoJ2Zvcm1hdHRlcicsIGZvcm1hdHRlcik7XG4gICAgfVxuICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udHJvbGxlci52YWx1ZS5yYXdWYWx1ZTtcbiAgICB9XG4gICAgc2V0IHZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuY29udHJvbGxlci52YWx1ZS5yYXdWYWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgICBvbihldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgICAgY29uc3QgYmggPSBoYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZW1pdHRlcl8ub24oZXZlbnROYW1lLCAoZXYpID0+IHtcbiAgICAgICAgICAgIGJoKGV2KTtcbiAgICAgICAgfSwge1xuICAgICAgICAgICAga2V5OiBoYW5kbGVyLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIG9mZihldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyXy5vZmYoZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG5jb25zdCBMaXN0QmxhZGVQbHVnaW4gPSAoZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGlkOiAnbGlzdCcsXG4gICAgICAgIHR5cGU6ICdibGFkZScsXG4gICAgICAgIGNvcmU6IFZFUlNJT04kMSxcbiAgICAgICAgYWNjZXB0KHBhcmFtcykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VSZWNvcmQocGFyYW1zLCAocCkgPT4gKHtcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBwLnJlcXVpcmVkLmN1c3RvbShwYXJzZUxpc3RPcHRpb25zKSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogcC5yZXF1aXJlZC5yYXcsXG4gICAgICAgICAgICAgICAgdmlldzogcC5yZXF1aXJlZC5jb25zdGFudCgnbGlzdCcpLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBwLm9wdGlvbmFsLnN0cmluZyxcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQgPyB7IHBhcmFtczogcmVzdWx0IH0gOiBudWxsO1xuICAgICAgICB9LFxuICAgICAgICBjb250cm9sbGVyKGFyZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IGxjID0gbmV3IExpc3RDb25zdHJhaW50KG5vcm1hbGl6ZUxpc3RPcHRpb25zKGFyZ3MucGFyYW1zLm9wdGlvbnMpKTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY3JlYXRlVmFsdWUoYXJncy5wYXJhbXMudmFsdWUsIHtcbiAgICAgICAgICAgICAgICBjb25zdHJhaW50OiBsYyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgaWMgPSBuZXcgTGlzdENvbnRyb2xsZXIoYXJncy5kb2N1bWVudCwge1xuICAgICAgICAgICAgICAgIHByb3BzOiBuZXcgVmFsdWVNYXAoe1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBsYy52YWx1ZXMudmFsdWUoJ29wdGlvbnMnKSxcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgdmlld1Byb3BzOiBhcmdzLnZpZXdQcm9wcyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBMYWJlbGVkVmFsdWVCbGFkZUNvbnRyb2xsZXIoYXJncy5kb2N1bWVudCwge1xuICAgICAgICAgICAgICAgIGJsYWRlOiBhcmdzLmJsYWRlLFxuICAgICAgICAgICAgICAgIHByb3BzOiBWYWx1ZU1hcC5mcm9tT2JqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IGFyZ3MucGFyYW1zLmxhYmVsLFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICB2YWx1ZUNvbnRyb2xsZXI6IGljLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGFwaShhcmdzKSB7XG4gICAgICAgICAgICBpZiAoIShhcmdzLmNvbnRyb2xsZXIgaW5zdGFuY2VvZiBMYWJlbGVkVmFsdWVCbGFkZUNvbnRyb2xsZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIShhcmdzLmNvbnRyb2xsZXIudmFsdWVDb250cm9sbGVyIGluc3RhbmNlb2YgTGlzdENvbnRyb2xsZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV3IExpc3RCbGFkZUFwaShhcmdzLmNvbnRyb2xsZXIpO1xuICAgICAgICB9LFxuICAgIH07XG59KSgpO1xuXG5jbGFzcyBSb290QXBpIGV4dGVuZHMgRm9sZGVyQXBpIHtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoY29udHJvbGxlciwgcG9vbCkge1xuICAgICAgICBzdXBlcihjb250cm9sbGVyLCBwb29sKTtcbiAgICB9XG4gICAgZ2V0IGVsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXIudmlldy5lbGVtZW50O1xuICAgIH1cbn1cblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbmNsYXNzIFJvb3RDb250cm9sbGVyIGV4dGVuZHMgRm9sZGVyQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoZG9jLCBjb25maWcpIHtcbiAgICAgICAgc3VwZXIoZG9jLCB7XG4gICAgICAgICAgICBleHBhbmRlZDogY29uZmlnLmV4cGFuZGVkLFxuICAgICAgICAgICAgYmxhZGU6IGNvbmZpZy5ibGFkZSxcbiAgICAgICAgICAgIHByb3BzOiBjb25maWcucHJvcHMsXG4gICAgICAgICAgICByb290OiB0cnVlLFxuICAgICAgICAgICAgdmlld1Byb3BzOiBjb25maWcudmlld1Byb3BzLFxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmNvbnN0IGNuID0gQ2xhc3NOYW1lKCdzcHInKTtcbi8qKlxuICogQGhpZGRlblxuICovXG5jbGFzcyBTZXBhcmF0b3JWaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihkb2MsIGNvbmZpZykge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNuKCkpO1xuICAgICAgICBjb25maWcudmlld1Byb3BzLmJpbmRDbGFzc01vZGlmaWVycyh0aGlzLmVsZW1lbnQpO1xuICAgICAgICBjb25zdCBockVsZW0gPSBkb2MuY3JlYXRlRWxlbWVudCgnaHInKTtcbiAgICAgICAgaHJFbGVtLmNsYXNzTGlzdC5hZGQoY24oJ3InKSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChockVsZW0pO1xuICAgIH1cbn1cblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbmNsYXNzIFNlcGFyYXRvckNvbnRyb2xsZXIgZXh0ZW5kcyBCbGFkZUNvbnRyb2xsZXIge1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihkb2MsIGNvbmZpZykge1xuICAgICAgICBzdXBlcihPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGNvbmZpZyksIHsgdmlldzogbmV3IFNlcGFyYXRvclZpZXcoZG9jLCB7XG4gICAgICAgICAgICAgICAgdmlld1Byb3BzOiBjb25maWcudmlld1Byb3BzLFxuICAgICAgICAgICAgfSkgfSkpO1xuICAgIH1cbn1cblxuY29uc3QgU2VwYXJhdG9yQmxhZGVQbHVnaW4gPSB7XG4gICAgaWQ6ICdzZXBhcmF0b3InLFxuICAgIHR5cGU6ICdibGFkZScsXG4gICAgY29yZTogVkVSU0lPTiQxLFxuICAgIGFjY2VwdChwYXJhbXMpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VSZWNvcmQocGFyYW1zLCAocCkgPT4gKHtcbiAgICAgICAgICAgIHZpZXc6IHAucmVxdWlyZWQuY29uc3RhbnQoJ3NlcGFyYXRvcicpLFxuICAgICAgICB9KSk7XG4gICAgICAgIHJldHVybiByZXN1bHQgPyB7IHBhcmFtczogcmVzdWx0IH0gOiBudWxsO1xuICAgIH0sXG4gICAgY29udHJvbGxlcihhcmdzKSB7XG4gICAgICAgIHJldHVybiBuZXcgU2VwYXJhdG9yQ29udHJvbGxlcihhcmdzLmRvY3VtZW50LCB7XG4gICAgICAgICAgICBibGFkZTogYXJncy5ibGFkZSxcbiAgICAgICAgICAgIHZpZXdQcm9wczogYXJncy52aWV3UHJvcHMsXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgYXBpKGFyZ3MpIHtcbiAgICAgICAgaWYgKCEoYXJncy5jb250cm9sbGVyIGluc3RhbmNlb2YgU2VwYXJhdG9yQ29udHJvbGxlcikpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgU2VwYXJhdG9yQmxhZGVBcGkoYXJncy5jb250cm9sbGVyKTtcbiAgICB9LFxufTtcblxuY29uc3QgU2xpZGVyQmxhZGVQbHVnaW4gPSB7XG4gICAgaWQ6ICdzbGlkZXInLFxuICAgIHR5cGU6ICdibGFkZScsXG4gICAgY29yZTogVkVSU0lPTiQxLFxuICAgIGFjY2VwdChwYXJhbXMpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VSZWNvcmQocGFyYW1zLCAocCkgPT4gKHtcbiAgICAgICAgICAgIG1heDogcC5yZXF1aXJlZC5udW1iZXIsXG4gICAgICAgICAgICBtaW46IHAucmVxdWlyZWQubnVtYmVyLFxuICAgICAgICAgICAgdmlldzogcC5yZXF1aXJlZC5jb25zdGFudCgnc2xpZGVyJyksXG4gICAgICAgICAgICBmb3JtYXQ6IHAub3B0aW9uYWwuZnVuY3Rpb24sXG4gICAgICAgICAgICBsYWJlbDogcC5vcHRpb25hbC5zdHJpbmcsXG4gICAgICAgICAgICB2YWx1ZTogcC5vcHRpb25hbC5udW1iZXIsXG4gICAgICAgIH0pKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCA/IHsgcGFyYW1zOiByZXN1bHQgfSA6IG51bGw7XG4gICAgfSxcbiAgICBjb250cm9sbGVyKGFyZ3MpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgY29uc3QgaW5pdGlhbFZhbHVlID0gKF9hID0gYXJncy5wYXJhbXMudmFsdWUpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IDA7XG4gICAgICAgIGNvbnN0IGRyYyA9IG5ldyBEZWZpbml0ZVJhbmdlQ29uc3RyYWludCh7XG4gICAgICAgICAgICBtYXg6IGFyZ3MucGFyYW1zLm1heCxcbiAgICAgICAgICAgIG1pbjogYXJncy5wYXJhbXMubWluLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgdiA9IGNyZWF0ZVZhbHVlKGluaXRpYWxWYWx1ZSwge1xuICAgICAgICAgICAgY29uc3RyYWludDogZHJjLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgdmMgPSBuZXcgU2xpZGVyVGV4dENvbnRyb2xsZXIoYXJncy5kb2N1bWVudCwgT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBjcmVhdGVTbGlkZXJUZXh0UHJvcHMoe1xuICAgICAgICAgICAgZm9ybWF0dGVyOiAoX2IgPSBhcmdzLnBhcmFtcy5mb3JtYXQpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IG51bWJlclRvU3RyaW5nLFxuICAgICAgICAgICAga2V5U2NhbGU6IGNyZWF0ZVZhbHVlKDEpLFxuICAgICAgICAgICAgbWF4OiBkcmMudmFsdWVzLnZhbHVlKCdtYXgnKSxcbiAgICAgICAgICAgIG1pbjogZHJjLnZhbHVlcy52YWx1ZSgnbWluJyksXG4gICAgICAgICAgICBwb2ludGVyU2NhbGU6IGdldFN1aXRhYmxlUG9pbnRlclNjYWxlKGFyZ3MucGFyYW1zLCBpbml0aWFsVmFsdWUpLFxuICAgICAgICB9KSksIHsgcGFyc2VyOiBwYXJzZU51bWJlciwgdmFsdWU6IHYsIHZpZXdQcm9wczogYXJncy52aWV3UHJvcHMgfSkpO1xuICAgICAgICByZXR1cm4gbmV3IExhYmVsZWRWYWx1ZUJsYWRlQ29udHJvbGxlcihhcmdzLmRvY3VtZW50LCB7XG4gICAgICAgICAgICBibGFkZTogYXJncy5ibGFkZSxcbiAgICAgICAgICAgIHByb3BzOiBWYWx1ZU1hcC5mcm9tT2JqZWN0KHtcbiAgICAgICAgICAgICAgICBsYWJlbDogYXJncy5wYXJhbXMubGFiZWwsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHZhbHVlOiB2LFxuICAgICAgICAgICAgdmFsdWVDb250cm9sbGVyOiB2YyxcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBhcGkoYXJncykge1xuICAgICAgICBpZiAoIShhcmdzLmNvbnRyb2xsZXIgaW5zdGFuY2VvZiBMYWJlbGVkVmFsdWVCbGFkZUNvbnRyb2xsZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIShhcmdzLmNvbnRyb2xsZXIudmFsdWVDb250cm9sbGVyIGluc3RhbmNlb2YgU2xpZGVyVGV4dENvbnRyb2xsZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFNsaWRlckJsYWRlQXBpKGFyZ3MuY29udHJvbGxlcik7XG4gICAgfSxcbn07XG5cbmNvbnN0IFRleHRCbGFkZVBsdWdpbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6ICd0ZXh0JyxcbiAgICAgICAgdHlwZTogJ2JsYWRlJyxcbiAgICAgICAgY29yZTogVkVSU0lPTiQxLFxuICAgICAgICBhY2NlcHQocGFyYW1zKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBwYXJzZVJlY29yZChwYXJhbXMsIChwKSA9PiAoe1xuICAgICAgICAgICAgICAgIHBhcnNlOiBwLnJlcXVpcmVkLmZ1bmN0aW9uLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBwLnJlcXVpcmVkLnJhdyxcbiAgICAgICAgICAgICAgICB2aWV3OiBwLnJlcXVpcmVkLmNvbnN0YW50KCd0ZXh0JyksXG4gICAgICAgICAgICAgICAgZm9ybWF0OiBwLm9wdGlvbmFsLmZ1bmN0aW9uLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBwLm9wdGlvbmFsLnN0cmluZyxcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQgPyB7IHBhcmFtczogcmVzdWx0IH0gOiBudWxsO1xuICAgICAgICB9LFxuICAgICAgICBjb250cm9sbGVyKGFyZ3MpIHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIGNvbnN0IHYgPSBjcmVhdGVWYWx1ZShhcmdzLnBhcmFtcy52YWx1ZSk7XG4gICAgICAgICAgICBjb25zdCBpYyA9IG5ldyBUZXh0Q29udHJvbGxlcihhcmdzLmRvY3VtZW50LCB7XG4gICAgICAgICAgICAgICAgcGFyc2VyOiBhcmdzLnBhcmFtcy5wYXJzZSxcbiAgICAgICAgICAgICAgICBwcm9wczogVmFsdWVNYXAuZnJvbU9iamVjdCh7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlcjogKF9hID0gYXJncy5wYXJhbXMuZm9ybWF0KSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAoKHYpID0+IFN0cmluZyh2KSksXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgdmFsdWU6IHYsXG4gICAgICAgICAgICAgICAgdmlld1Byb3BzOiBhcmdzLnZpZXdQcm9wcyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBMYWJlbGVkVmFsdWVCbGFkZUNvbnRyb2xsZXIoYXJncy5kb2N1bWVudCwge1xuICAgICAgICAgICAgICAgIGJsYWRlOiBhcmdzLmJsYWRlLFxuICAgICAgICAgICAgICAgIHByb3BzOiBWYWx1ZU1hcC5mcm9tT2JqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IGFyZ3MucGFyYW1zLmxhYmVsLFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2LFxuICAgICAgICAgICAgICAgIHZhbHVlQ29udHJvbGxlcjogaWMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgYXBpKGFyZ3MpIHtcbiAgICAgICAgICAgIGlmICghKGFyZ3MuY29udHJvbGxlciBpbnN0YW5jZW9mIExhYmVsZWRWYWx1ZUJsYWRlQ29udHJvbGxlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghKGFyZ3MuY29udHJvbGxlci52YWx1ZUNvbnRyb2xsZXIgaW5zdGFuY2VvZiBUZXh0Q29udHJvbGxlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXcgVGV4dEJsYWRlQXBpKGFyZ3MuY29udHJvbGxlcik7XG4gICAgICAgIH0sXG4gICAgfTtcbn0pKCk7XG5cbmZ1bmN0aW9uIGNyZWF0ZURlZmF1bHRXcmFwcGVyRWxlbWVudChkb2MpIHtcbiAgICBjb25zdCBlbGVtID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsZW0uY2xhc3NMaXN0LmFkZChDbGFzc05hbWUoJ2RmdycpKCkpO1xuICAgIGlmIChkb2MuYm9keSkge1xuICAgICAgICBkb2MuYm9keS5hcHBlbmRDaGlsZChlbGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIGVsZW07XG59XG5mdW5jdGlvbiBlbWJlZFN0eWxlKGRvYywgaWQsIGNzcykge1xuICAgIGlmIChkb2MucXVlcnlTZWxlY3Rvcihgc3R5bGVbZGF0YS10cC1zdHlsZT0ke2lkfV1gKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHN0eWxlRWxlbSA9IGRvYy5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIHN0eWxlRWxlbS5kYXRhc2V0LnRwU3R5bGUgPSBpZDtcbiAgICBzdHlsZUVsZW0udGV4dENvbnRlbnQgPSBjc3M7XG4gICAgZG9jLmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtKTtcbn1cbi8qKlxuICogVGhlIHJvb3QgcGFuZSBvZiBUd2Vha3BhbmUuXG4gKi9cbmNsYXNzIFBhbmUgZXh0ZW5kcyBSb290QXBpIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRfY29uZmlnKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IG9wdF9jb25maWcgIT09IG51bGwgJiYgb3B0X2NvbmZpZyAhPT0gdm9pZCAwID8gb3B0X2NvbmZpZyA6IHt9O1xuICAgICAgICBjb25zdCBkb2MgPSAoX2EgPSBjb25maWcuZG9jdW1lbnQpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGdldFdpbmRvd0RvY3VtZW50KCk7XG4gICAgICAgIGNvbnN0IHBvb2wgPSBjcmVhdGVEZWZhdWx0UGx1Z2luUG9vbCgpO1xuICAgICAgICBjb25zdCByb290Q29udHJvbGxlciA9IG5ldyBSb290Q29udHJvbGxlcihkb2MsIHtcbiAgICAgICAgICAgIGV4cGFuZGVkOiBjb25maWcuZXhwYW5kZWQsXG4gICAgICAgICAgICBibGFkZTogY3JlYXRlQmxhZGUoKSxcbiAgICAgICAgICAgIHByb3BzOiBWYWx1ZU1hcC5mcm9tT2JqZWN0KHtcbiAgICAgICAgICAgICAgICB0aXRsZTogY29uZmlnLnRpdGxlLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB2aWV3UHJvcHM6IFZpZXdQcm9wcy5jcmVhdGUoKSxcbiAgICAgICAgfSk7XG4gICAgICAgIHN1cGVyKHJvb3RDb250cm9sbGVyLCBwb29sKTtcbiAgICAgICAgdGhpcy5wb29sXyA9IHBvb2w7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRWxlbV8gPSAoX2IgPSBjb25maWcuY29udGFpbmVyKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBjcmVhdGVEZWZhdWx0V3JhcHBlckVsZW1lbnQoZG9jKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJFbGVtXy5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQpO1xuICAgICAgICB0aGlzLmRvY18gPSBkb2M7XG4gICAgICAgIHRoaXMudXNlc0RlZmF1bHRXcmFwcGVyXyA9ICFjb25maWcuY29udGFpbmVyO1xuICAgICAgICB0aGlzLnNldFVwRGVmYXVsdFBsdWdpbnNfKCk7XG4gICAgfVxuICAgIGdldCBkb2N1bWVudCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRvY18pIHtcbiAgICAgICAgICAgIHRocm93IFRwRXJyb3IuYWxyZWFkeURpc3Bvc2VkKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZG9jXztcbiAgICB9XG4gICAgZGlzcG9zZSgpIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyRWxlbSA9IHRoaXMuY29udGFpbmVyRWxlbV87XG4gICAgICAgIGlmICghY29udGFpbmVyRWxlbSkge1xuICAgICAgICAgICAgdGhyb3cgVHBFcnJvci5hbHJlYWR5RGlzcG9zZWQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy51c2VzRGVmYXVsdFdyYXBwZXJfKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnRFbGVtID0gY29udGFpbmVyRWxlbS5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgaWYgKHBhcmVudEVsZW0pIHtcbiAgICAgICAgICAgICAgICBwYXJlbnRFbGVtLnJlbW92ZUNoaWxkKGNvbnRhaW5lckVsZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29udGFpbmVyRWxlbV8gPSBudWxsO1xuICAgICAgICB0aGlzLmRvY18gPSBudWxsO1xuICAgICAgICBzdXBlci5kaXNwb3NlKCk7XG4gICAgfVxuICAgIHJlZ2lzdGVyUGx1Z2luKGJ1bmRsZSkge1xuICAgICAgICBpZiAoYnVuZGxlLmNzcykge1xuICAgICAgICAgICAgZW1iZWRTdHlsZSh0aGlzLmRvY3VtZW50LCBgcGx1Z2luLSR7YnVuZGxlLmlkfWAsIGJ1bmRsZS5jc3MpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBsdWdpbnMgPSAncGx1Z2luJyBpbiBidW5kbGVcbiAgICAgICAgICAgID8gW2J1bmRsZS5wbHVnaW5dXG4gICAgICAgICAgICA6ICdwbHVnaW5zJyBpbiBidW5kbGVcbiAgICAgICAgICAgICAgICA/IGJ1bmRsZS5wbHVnaW5zXG4gICAgICAgICAgICAgICAgOiBbXTtcbiAgICAgICAgcGx1Z2lucy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvb2xfLnJlZ2lzdGVyKGJ1bmRsZS5pZCwgcCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzZXRVcERlZmF1bHRQbHVnaW5zXygpIHtcbiAgICAgICAgdGhpcy5yZWdpc3RlclBsdWdpbih7XG4gICAgICAgICAgICBpZDogJ2RlZmF1bHQnLFxuICAgICAgICAgICAgLy8gTk9URTogVGhpcyBzdHJpbmcgbGl0ZXJhbCB3aWxsIGJlIHJlcGxhY2VkIHdpdGggdGhlIGRlZmF1bHQgQ1NTIGJ5IFJvbGx1cCBhdCB0aGUgY29tcGlsYXRpb24gdGltZVxuICAgICAgICAgICAgY3NzOiAnLnRwLXRiaXZfYiwudHAtY29sdHh0dl9tcywudHAtY29sc3d2X2IsLnRwLWNrYnZfaSwudHAtc2dsdl9pLC50cC1tbGx2X2ksLnRwLWdybHZfZywudHAtdHh0dl9pLC50cC1wMmRwdl9wLC50cC1jb2xzd3Zfc3csLnRwLXJvdHZfYiwudHAtZmxkdl9iLC50cC1wMmR2X2IsLnRwLWJ0bnZfYiwudHAtbHN0dl9zey13ZWJraXQtYXBwZWFyYW5jZTpub25lOy1tb3otYXBwZWFyYW5jZTpub25lO2FwcGVhcmFuY2U6bm9uZTtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMCwwLDAsMCk7Ym9yZGVyLXdpZHRoOjA7Zm9udC1mYW1pbHk6aW5oZXJpdDtmb250LXNpemU6aW5oZXJpdDtmb250LXdlaWdodDppbmhlcml0O21hcmdpbjowO291dGxpbmU6bm9uZTtwYWRkaW5nOjB9LnRwLXAyZHZfYiwudHAtYnRudl9iLC50cC1sc3R2X3N7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1idG4tYmcpO2JvcmRlci1yYWRpdXM6dmFyKC0tYmxkLWJyKTtjb2xvcjp2YXIoLS1idG4tZmcpO2N1cnNvcjpwb2ludGVyO2Rpc3BsYXk6YmxvY2s7Zm9udC13ZWlnaHQ6Ym9sZDtoZWlnaHQ6dmFyKC0tY250LXVzeik7bGluZS1oZWlnaHQ6dmFyKC0tY250LXVzeik7b3ZlcmZsb3c6aGlkZGVuO3RleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7d2hpdGUtc3BhY2U6bm93cmFwfS50cC1wMmR2X2I6aG92ZXIsLnRwLWJ0bnZfYjpob3ZlciwudHAtbHN0dl9zOmhvdmVye2JhY2tncm91bmQtY29sb3I6dmFyKC0tYnRuLWJnLWgpfS50cC1wMmR2X2I6Zm9jdXMsLnRwLWJ0bnZfYjpmb2N1cywudHAtbHN0dl9zOmZvY3Vze2JhY2tncm91bmQtY29sb3I6dmFyKC0tYnRuLWJnLWYpfS50cC1wMmR2X2I6YWN0aXZlLC50cC1idG52X2I6YWN0aXZlLC50cC1sc3R2X3M6YWN0aXZle2JhY2tncm91bmQtY29sb3I6dmFyKC0tYnRuLWJnLWEpfS50cC1wMmR2X2I6ZGlzYWJsZWQsLnRwLWJ0bnZfYjpkaXNhYmxlZCwudHAtbHN0dl9zOmRpc2FibGVke29wYWNpdHk6LjV9LnRwLXJvdHZfYz4udHAtY250di50cC12LWxzdCwudHAtdGJwdl9jPi50cC1jbnR2LnRwLXYtbHN0LC50cC1mbGR2X2M+LnRwLWNudHYudHAtdi1sc3R7bWFyZ2luLWJvdHRvbTpjYWxjKC0xKnZhcigtLWNudC12cCkpfS50cC1yb3R2X2M+LnRwLWZsZHYudHAtdi1sc3QgLnRwLWZsZHZfYywudHAtdGJwdl9jPi50cC1mbGR2LnRwLXYtbHN0IC50cC1mbGR2X2MsLnRwLWZsZHZfYz4udHAtZmxkdi50cC12LWxzdCAudHAtZmxkdl9je2JvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6MH0udHAtcm90dl9jPi50cC1mbGR2LnRwLXYtbHN0IC50cC1mbGR2X2IsLnRwLXRicHZfYz4udHAtZmxkdi50cC12LWxzdCAudHAtZmxkdl9iLC50cC1mbGR2X2M+LnRwLWZsZHYudHAtdi1sc3QgLnRwLWZsZHZfYntib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOjB9LnRwLXJvdHZfYz4qOm5vdCgudHAtdi1mc3QpLC50cC10YnB2X2M+Kjpub3QoLnRwLXYtZnN0KSwudHAtZmxkdl9jPio6bm90KC50cC12LWZzdCl7bWFyZ2luLXRvcDp2YXIoLS1jbnQtdXNwKX0udHAtcm90dl9jPi50cC1zcHJ2Om5vdCgudHAtdi1mc3QpLC50cC10YnB2X2M+LnRwLXNwcnY6bm90KC50cC12LWZzdCksLnRwLWZsZHZfYz4udHAtc3Bydjpub3QoLnRwLXYtZnN0KSwudHAtcm90dl9jPi50cC1jbnR2Om5vdCgudHAtdi1mc3QpLC50cC10YnB2X2M+LnRwLWNudHY6bm90KC50cC12LWZzdCksLnRwLWZsZHZfYz4udHAtY250djpub3QoLnRwLXYtZnN0KXttYXJnaW4tdG9wOnZhcigtLWNudC12cCl9LnRwLXJvdHZfYz4udHAtc3BydisqOm5vdCgudHAtdi1oaWRkZW4pLC50cC10YnB2X2M+LnRwLXNwcnYrKjpub3QoLnRwLXYtaGlkZGVuKSwudHAtZmxkdl9jPi50cC1zcHJ2Kyo6bm90KC50cC12LWhpZGRlbiksLnRwLXJvdHZfYz4udHAtY250disqOm5vdCgudHAtdi1oaWRkZW4pLC50cC10YnB2X2M+LnRwLWNudHYrKjpub3QoLnRwLXYtaGlkZGVuKSwudHAtZmxkdl9jPi50cC1jbnR2Kyo6bm90KC50cC12LWhpZGRlbil7bWFyZ2luLXRvcDp2YXIoLS1jbnQtdnApfS50cC1yb3R2X2M+LnRwLXNwcnY6bm90KC50cC12LWhpZGRlbikrLnRwLXNwcnYsLnRwLXRicHZfYz4udHAtc3Bydjpub3QoLnRwLXYtaGlkZGVuKSsudHAtc3BydiwudHAtZmxkdl9jPi50cC1zcHJ2Om5vdCgudHAtdi1oaWRkZW4pKy50cC1zcHJ2LC50cC1yb3R2X2M+LnRwLWNudHY6bm90KC50cC12LWhpZGRlbikrLnRwLWNudHYsLnRwLXRicHZfYz4udHAtY250djpub3QoLnRwLXYtaGlkZGVuKSsudHAtY250diwudHAtZmxkdl9jPi50cC1jbnR2Om5vdCgudHAtdi1oaWRkZW4pKy50cC1jbnR2e21hcmdpbi10b3A6MH0udHAtdGJwdl9jPi50cC1jbnR2LC50cC1mbGR2X2M+LnRwLWNudHZ7bWFyZ2luLWxlZnQ6NHB4fS50cC10YnB2X2M+LnRwLWZsZHY+LnRwLWZsZHZfYiwudHAtZmxkdl9jPi50cC1mbGR2Pi50cC1mbGR2X2J7Ym9yZGVyLXRvcC1sZWZ0LXJhZGl1czp2YXIoLS1ibGQtYnIpO2JvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6dmFyKC0tYmxkLWJyKX0udHAtdGJwdl9jPi50cC1mbGR2LnRwLWZsZHYtZXhwYW5kZWQ+LnRwLWZsZHZfYiwudHAtZmxkdl9jPi50cC1mbGR2LnRwLWZsZHYtZXhwYW5kZWQ+LnRwLWZsZHZfYntib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOjB9LnRwLXRicHZfYyAudHAtZmxkdj4udHAtZmxkdl9jLC50cC1mbGR2X2MgLnRwLWZsZHY+LnRwLWZsZHZfY3tib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOnZhcigtLWJsZC1icil9LnRwLXRicHZfYz4udHAtY250disudHAtZmxkdj4udHAtZmxkdl9iLC50cC1mbGR2X2M+LnRwLWNudHYrLnRwLWZsZHY+LnRwLWZsZHZfYntib3JkZXItdG9wLWxlZnQtcmFkaXVzOjB9LnRwLXRicHZfYz4udHAtY250disudHAtdGFidj4udHAtdGFidl90LC50cC1mbGR2X2M+LnRwLWNudHYrLnRwLXRhYnY+LnRwLXRhYnZfdHtib3JkZXItdG9wLWxlZnQtcmFkaXVzOjB9LnRwLXRicHZfYz4udHAtdGFidj4udHAtdGFidl90LC50cC1mbGR2X2M+LnRwLXRhYnY+LnRwLXRhYnZfdHtib3JkZXItdG9wLWxlZnQtcmFkaXVzOnZhcigtLWJsZC1icil9LnRwLXRicHZfYyAudHAtdGFidj4udHAtdGFidl9jLC50cC1mbGR2X2MgLnRwLXRhYnY+LnRwLXRhYnZfY3tib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOnZhcigtLWJsZC1icil9LnRwLXJvdHZfYiwudHAtZmxkdl9ie2JhY2tncm91bmQtY29sb3I6dmFyKC0tY250LWJnKTtjb2xvcjp2YXIoLS1jbnQtZmcpO2N1cnNvcjpwb2ludGVyO2Rpc3BsYXk6YmxvY2s7aGVpZ2h0OmNhbGModmFyKC0tY250LXVzeikgKyA0cHgpO2xpbmUtaGVpZ2h0OmNhbGModmFyKC0tY250LXVzeikgKyA0cHgpO292ZXJmbG93OmhpZGRlbjtwYWRkaW5nLWxlZnQ6dmFyKC0tY250LWhwKTtwYWRkaW5nLXJpZ2h0OmNhbGMoNHB4ICsgdmFyKC0tY250LXVzeikgKyB2YXIoLS1jbnQtaHApKTtwb3NpdGlvbjpyZWxhdGl2ZTt0ZXh0LWFsaWduOmxlZnQ7dGV4dC1vdmVyZmxvdzplbGxpcHNpczt3aGl0ZS1zcGFjZTpub3dyYXA7d2lkdGg6MTAwJTt0cmFuc2l0aW9uOmJvcmRlci1yYWRpdXMgLjJzIGVhc2UtaW4tb3V0IC4yc30udHAtcm90dl9iOmhvdmVyLC50cC1mbGR2X2I6aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1jbnQtYmctaCl9LnRwLXJvdHZfYjpmb2N1cywudHAtZmxkdl9iOmZvY3Vze2JhY2tncm91bmQtY29sb3I6dmFyKC0tY250LWJnLWYpfS50cC1yb3R2X2I6YWN0aXZlLC50cC1mbGR2X2I6YWN0aXZle2JhY2tncm91bmQtY29sb3I6dmFyKC0tY250LWJnLWEpfS50cC1yb3R2X2I6ZGlzYWJsZWQsLnRwLWZsZHZfYjpkaXNhYmxlZHtvcGFjaXR5Oi41fS50cC1yb3R2X20sLnRwLWZsZHZfbXtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCh0byBsZWZ0LCB2YXIoLS1jbnQtZmcpLCB2YXIoLS1jbnQtZmcpIDJweCwgdHJhbnNwYXJlbnQgMnB4LCB0cmFuc3BhcmVudCA0cHgsIHZhcigtLWNudC1mZykgNHB4KTtib3JkZXItcmFkaXVzOjJweDtib3R0b206MDtjb250ZW50OlwiXCI7ZGlzcGxheTpibG9jaztoZWlnaHQ6NnB4O3JpZ2h0OmNhbGModmFyKC0tY250LWhwKSArICh2YXIoLS1jbnQtdXN6KSArIDRweCAtIDZweCkvMiAtIDJweCk7bWFyZ2luOmF1dG87b3BhY2l0eTouNTtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDt0cmFuc2Zvcm06cm90YXRlKDkwZGVnKTt0cmFuc2l0aW9uOnRyYW5zZm9ybSAuMnMgZWFzZS1pbi1vdXQ7d2lkdGg6NnB4fS50cC1yb3R2LnRwLXJvdHYtZXhwYW5kZWQgLnRwLXJvdHZfbSwudHAtZmxkdi50cC1mbGR2LWV4cGFuZGVkPi50cC1mbGR2X2I+LnRwLWZsZHZfbXt0cmFuc2Zvcm06bm9uZX0udHAtcm90dl9jLC50cC1mbGR2X2N7Ym94LXNpemluZzpib3JkZXItYm94O2hlaWdodDowO29wYWNpdHk6MDtvdmVyZmxvdzpoaWRkZW47cGFkZGluZy1ib3R0b206MDtwYWRkaW5nLXRvcDowO3Bvc2l0aW9uOnJlbGF0aXZlO3RyYW5zaXRpb246aGVpZ2h0IC4ycyBlYXNlLWluLW91dCxvcGFjaXR5IC4ycyBsaW5lYXIscGFkZGluZyAuMnMgZWFzZS1pbi1vdXR9LnRwLXJvdHYudHAtcm90di1jcGw6bm90KC50cC1yb3R2LWV4cGFuZGVkKSAudHAtcm90dl9jLC50cC1mbGR2LnRwLWZsZHYtY3BsOm5vdCgudHAtZmxkdi1leHBhbmRlZCk+LnRwLWZsZHZfY3tkaXNwbGF5Om5vbmV9LnRwLXJvdHYudHAtcm90di1leHBhbmRlZCAudHAtcm90dl9jLC50cC1mbGR2LnRwLWZsZHYtZXhwYW5kZWQ+LnRwLWZsZHZfY3tvcGFjaXR5OjE7cGFkZGluZy1ib3R0b206dmFyKC0tY250LXZwKTtwYWRkaW5nLXRvcDp2YXIoLS1jbnQtdnApO3RyYW5zZm9ybTpub25lO292ZXJmbG93OnZpc2libGU7dHJhbnNpdGlvbjpoZWlnaHQgLjJzIGVhc2UtaW4tb3V0LG9wYWNpdHkgLjJzIGxpbmVhciAuMnMscGFkZGluZyAuMnMgZWFzZS1pbi1vdXR9LnRwLXR4dHZfaSwudHAtcDJkcHZfcCwudHAtY29sc3d2X3N3e2JhY2tncm91bmQtY29sb3I6dmFyKC0taW4tYmcpO2JvcmRlci1yYWRpdXM6dmFyKC0tYmxkLWJyKTtib3gtc2l6aW5nOmJvcmRlci1ib3g7Y29sb3I6dmFyKC0taW4tZmcpO2ZvbnQtZmFtaWx5OmluaGVyaXQ7aGVpZ2h0OnZhcigtLWNudC11c3opO2xpbmUtaGVpZ2h0OnZhcigtLWNudC11c3opO21pbi13aWR0aDowO3dpZHRoOjEwMCV9LnRwLXR4dHZfaTpob3ZlciwudHAtcDJkcHZfcDpob3ZlciwudHAtY29sc3d2X3N3OmhvdmVye2JhY2tncm91bmQtY29sb3I6dmFyKC0taW4tYmctaCl9LnRwLXR4dHZfaTpmb2N1cywudHAtcDJkcHZfcDpmb2N1cywudHAtY29sc3d2X3N3OmZvY3Vze2JhY2tncm91bmQtY29sb3I6dmFyKC0taW4tYmctZil9LnRwLXR4dHZfaTphY3RpdmUsLnRwLXAyZHB2X3A6YWN0aXZlLC50cC1jb2xzd3Zfc3c6YWN0aXZle2JhY2tncm91bmQtY29sb3I6dmFyKC0taW4tYmctYSl9LnRwLXR4dHZfaTpkaXNhYmxlZCwudHAtcDJkcHZfcDpkaXNhYmxlZCwudHAtY29sc3d2X3N3OmRpc2FibGVke29wYWNpdHk6LjV9LnRwLWxzdHYsLnRwLWNvbHR4dHZfbXtwb3NpdGlvbjpyZWxhdGl2ZX0udHAtbHN0dl9ze3BhZGRpbmc6MCAyMHB4IDAgNHB4O3dpZHRoOjEwMCV9LnRwLWxzdHZfbSwudHAtY29sdHh0dl9tbXtib3R0b206MDttYXJnaW46YXV0bztwb2ludGVyLWV2ZW50czpub25lO3Bvc2l0aW9uOmFic29sdXRlO3JpZ2h0OjJweDt0b3A6MH0udHAtbHN0dl9tIHN2ZywudHAtY29sdHh0dl9tbSBzdmd7Ym90dG9tOjA7aGVpZ2h0OjE2cHg7bWFyZ2luOmF1dG87cG9zaXRpb246YWJzb2x1dGU7cmlnaHQ6MDt0b3A6MDt3aWR0aDoxNnB4fS50cC1sc3R2X20gc3ZnIHBhdGgsLnRwLWNvbHR4dHZfbW0gc3ZnIHBhdGh7ZmlsbDpjdXJyZW50Q29sb3J9LnRwLXNnbHZfaSwudHAtbWxsdl9pLC50cC1ncmx2X2d7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1tby1iZyk7Ym9yZGVyLXJhZGl1czp2YXIoLS1ibGQtYnIpO2JveC1zaXppbmc6Ym9yZGVyLWJveDtjb2xvcjp2YXIoLS1tby1mZyk7aGVpZ2h0OnZhcigtLWNudC11c3opO3Njcm9sbGJhci1jb2xvcjpjdXJyZW50Q29sb3IgcmdiYSgwLDAsMCwwKTtzY3JvbGxiYXItd2lkdGg6dGhpbjt3aWR0aDoxMDAlfS50cC1zZ2x2X2k6Oi13ZWJraXQtc2Nyb2xsYmFyLC50cC1tbGx2X2k6Oi13ZWJraXQtc2Nyb2xsYmFyLC50cC1ncmx2X2c6Oi13ZWJraXQtc2Nyb2xsYmFye2hlaWdodDo4cHg7d2lkdGg6OHB4fS50cC1zZ2x2X2k6Oi13ZWJraXQtc2Nyb2xsYmFyLWNvcm5lciwudHAtbWxsdl9pOjotd2Via2l0LXNjcm9sbGJhci1jb3JuZXIsLnRwLWdybHZfZzo6LXdlYmtpdC1zY3JvbGxiYXItY29ybmVye2JhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwwKX0udHAtc2dsdl9pOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiwudHAtbWxsdl9pOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiwudHAtZ3Jsdl9nOjotd2Via2l0LXNjcm9sbGJhci10aHVtYntiYWNrZ3JvdW5kLWNsaXA6cGFkZGluZy1ib3g7YmFja2dyb3VuZC1jb2xvcjpjdXJyZW50Q29sb3I7Ym9yZGVyOnJnYmEoMCwwLDAsMCkgc29saWQgMnB4O2JvcmRlci1yYWRpdXM6NHB4fS50cC1wbmR0eHR2LC50cC1jb2x0eHR2X3d7ZGlzcGxheTpmbGV4fS50cC1wbmR0eHR2X2EsLnRwLWNvbHR4dHZfY3t3aWR0aDoxMDAlfS50cC1wbmR0eHR2X2ErLnRwLXBuZHR4dHZfYSwudHAtY29sdHh0dl9jKy50cC1wbmR0eHR2X2EsLnRwLXBuZHR4dHZfYSsudHAtY29sdHh0dl9jLC50cC1jb2x0eHR2X2MrLnRwLWNvbHR4dHZfY3ttYXJnaW4tbGVmdDoycHh9LnRwLXJvdHZ7LS1icy1iZzogdmFyKC0tdHAtYmFzZS1iYWNrZ3JvdW5kLWNvbG9yLCBoc2woMjMwLCA3JSwgMTclKSk7LS1icy1icjogdmFyKC0tdHAtYmFzZS1ib3JkZXItcmFkaXVzLCA2cHgpOy0tYnMtZmY6IHZhcigtLXRwLWJhc2UtZm9udC1mYW1pbHksIFJvYm90byBNb25vLCBTb3VyY2UgQ29kZSBQcm8sIE1lbmxvLCBDb3VyaWVyLCBtb25vc3BhY2UpOy0tYnMtc2g6IHZhcigtLXRwLWJhc2Utc2hhZG93LWNvbG9yLCByZ2JhKDAsIDAsIDAsIDAuMikpOy0tYmxkLWJyOiB2YXIoLS10cC1ibGFkZS1ib3JkZXItcmFkaXVzLCAycHgpOy0tYmxkLWhwOiB2YXIoLS10cC1ibGFkZS1ob3Jpem9udGFsLXBhZGRpbmcsIDRweCk7LS1ibGQtdnc6IHZhcigtLXRwLWJsYWRlLXZhbHVlLXdpZHRoLCAxNjBweCk7LS1idG4tYmc6IHZhcigtLXRwLWJ1dHRvbi1iYWNrZ3JvdW5kLWNvbG9yLCBoc2woMjMwLCA3JSwgNzAlKSk7LS1idG4tYmctYTogdmFyKC0tdHAtYnV0dG9uLWJhY2tncm91bmQtY29sb3ItYWN0aXZlLCAjZDZkN2RiKTstLWJ0bi1iZy1mOiB2YXIoLS10cC1idXR0b24tYmFja2dyb3VuZC1jb2xvci1mb2N1cywgI2M4Y2FkMCk7LS1idG4tYmctaDogdmFyKC0tdHAtYnV0dG9uLWJhY2tncm91bmQtY29sb3ItaG92ZXIsICNiYmJjYzQpOy0tYnRuLWZnOiB2YXIoLS10cC1idXR0b24tZm9yZWdyb3VuZC1jb2xvciwgaHNsKDIzMCwgNyUsIDE3JSkpOy0tY250LWJnOiB2YXIoLS10cC1jb250YWluZXItYmFja2dyb3VuZC1jb2xvciwgcmdiYSgxODcsIDE4OCwgMTk2LCAwLjEpKTstLWNudC1iZy1hOiB2YXIoLS10cC1jb250YWluZXItYmFja2dyb3VuZC1jb2xvci1hY3RpdmUsIHJnYmEoMTg3LCAxODgsIDE5NiwgMC4yNSkpOy0tY250LWJnLWY6IHZhcigtLXRwLWNvbnRhaW5lci1iYWNrZ3JvdW5kLWNvbG9yLWZvY3VzLCByZ2JhKDE4NywgMTg4LCAxOTYsIDAuMikpOy0tY250LWJnLWg6IHZhcigtLXRwLWNvbnRhaW5lci1iYWNrZ3JvdW5kLWNvbG9yLWhvdmVyLCByZ2JhKDE4NywgMTg4LCAxOTYsIDAuMTUpKTstLWNudC1mZzogdmFyKC0tdHAtY29udGFpbmVyLWZvcmVncm91bmQtY29sb3IsIGhzbCgyMzAsIDclLCA3NSUpKTstLWNudC1ocDogdmFyKC0tdHAtY29udGFpbmVyLWhvcml6b250YWwtcGFkZGluZywgNHB4KTstLWNudC12cDogdmFyKC0tdHAtY29udGFpbmVyLXZlcnRpY2FsLXBhZGRpbmcsIDRweCk7LS1jbnQtdXNwOiB2YXIoLS10cC1jb250YWluZXItdW5pdC1zcGFjaW5nLCA0cHgpOy0tY250LXVzejogdmFyKC0tdHAtY29udGFpbmVyLXVuaXQtc2l6ZSwgMjBweCk7LS1pbi1iZzogdmFyKC0tdHAtaW5wdXQtYmFja2dyb3VuZC1jb2xvciwgcmdiYSgxODcsIDE4OCwgMTk2LCAwLjEpKTstLWluLWJnLWE6IHZhcigtLXRwLWlucHV0LWJhY2tncm91bmQtY29sb3ItYWN0aXZlLCByZ2JhKDE4NywgMTg4LCAxOTYsIDAuMjUpKTstLWluLWJnLWY6IHZhcigtLXRwLWlucHV0LWJhY2tncm91bmQtY29sb3ItZm9jdXMsIHJnYmEoMTg3LCAxODgsIDE5NiwgMC4yKSk7LS1pbi1iZy1oOiB2YXIoLS10cC1pbnB1dC1iYWNrZ3JvdW5kLWNvbG9yLWhvdmVyLCByZ2JhKDE4NywgMTg4LCAxOTYsIDAuMTUpKTstLWluLWZnOiB2YXIoLS10cC1pbnB1dC1mb3JlZ3JvdW5kLWNvbG9yLCBoc2woMjMwLCA3JSwgNzUlKSk7LS1sYmwtZmc6IHZhcigtLXRwLWxhYmVsLWZvcmVncm91bmQtY29sb3IsIHJnYmEoMTg3LCAxODgsIDE5NiwgMC43KSk7LS1tby1iZzogdmFyKC0tdHAtbW9uaXRvci1iYWNrZ3JvdW5kLWNvbG9yLCByZ2JhKDAsIDAsIDAsIDAuMikpOy0tbW8tZmc6IHZhcigtLXRwLW1vbml0b3ItZm9yZWdyb3VuZC1jb2xvciwgcmdiYSgxODcsIDE4OCwgMTk2LCAwLjcpKTstLWdydi1mZzogdmFyKC0tdHAtZ3Jvb3ZlLWZvcmVncm91bmQtY29sb3IsIHJnYmEoMTg3LCAxODgsIDE5NiwgMC4xKSl9LnRwLWJ0bnZfYnt3aWR0aDoxMDAlfS50cC1idG52X3R7dGV4dC1hbGlnbjpjZW50ZXJ9LnRwLWNrYnZfbHtkaXNwbGF5OmJsb2NrO3Bvc2l0aW9uOnJlbGF0aXZlfS50cC1ja2J2X2l7bGVmdDowO29wYWNpdHk6MDtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MH0udHAtY2tidl93e2JhY2tncm91bmQtY29sb3I6dmFyKC0taW4tYmcpO2JvcmRlci1yYWRpdXM6dmFyKC0tYmxkLWJyKTtjdXJzb3I6cG9pbnRlcjtkaXNwbGF5OmJsb2NrO2hlaWdodDp2YXIoLS1jbnQtdXN6KTtwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDp2YXIoLS1jbnQtdXN6KX0udHAtY2tidl93IHN2Z3tkaXNwbGF5OmJsb2NrO2hlaWdodDoxNnB4O2luc2V0OjA7bWFyZ2luOmF1dG87b3BhY2l0eTowO3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjE2cHh9LnRwLWNrYnZfdyBzdmcgcGF0aHtmaWxsOm5vbmU7c3Ryb2tlOnZhcigtLWluLWZnKTtzdHJva2Utd2lkdGg6Mn0udHAtY2tidl9pOmhvdmVyKy50cC1ja2J2X3d7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1pbi1iZy1oKX0udHAtY2tidl9pOmZvY3VzKy50cC1ja2J2X3d7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1pbi1iZy1mKX0udHAtY2tidl9pOmFjdGl2ZSsudHAtY2tidl93e2JhY2tncm91bmQtY29sb3I6dmFyKC0taW4tYmctYSl9LnRwLWNrYnZfaTpjaGVja2VkKy50cC1ja2J2X3cgc3Zne29wYWNpdHk6MX0udHAtY2tidi50cC12LWRpc2FibGVkIC50cC1ja2J2X3d7b3BhY2l0eTouNX0udHAtY29sdntwb3NpdGlvbjpyZWxhdGl2ZX0udHAtY29sdl9oe2Rpc3BsYXk6ZmxleH0udHAtY29sdl9ze2ZsZXgtZ3JvdzowO2ZsZXgtc2hyaW5rOjA7d2lkdGg6dmFyKC0tY250LXVzeil9LnRwLWNvbHZfdHtmbGV4OjE7bWFyZ2luLWxlZnQ6NHB4fS50cC1jb2x2X3B7aGVpZ2h0OjA7bWFyZ2luLXRvcDowO29wYWNpdHk6MDtvdmVyZmxvdzpoaWRkZW47dHJhbnNpdGlvbjpoZWlnaHQgLjJzIGVhc2UtaW4tb3V0LG9wYWNpdHkgLjJzIGxpbmVhcixtYXJnaW4gLjJzIGVhc2UtaW4tb3V0fS50cC1jb2x2LnRwLWNvbHYtZXhwYW5kZWQudHAtY29sdi1jcGwgLnRwLWNvbHZfcHtvdmVyZmxvdzp2aXNpYmxlfS50cC1jb2x2LnRwLWNvbHYtZXhwYW5kZWQgLnRwLWNvbHZfcHttYXJnaW4tdG9wOnZhcigtLWNudC11c3ApO29wYWNpdHk6MX0udHAtY29sdiAudHAtcG9wdntsZWZ0OmNhbGMoLTEqdmFyKC0tY250LWhwKSk7cmlnaHQ6Y2FsYygtMSp2YXIoLS1jbnQtaHApKTt0b3A6dmFyKC0tY250LXVzeil9LnRwLWNvbHB2X2gsLnRwLWNvbHB2X2Fwe21hcmdpbi1sZWZ0OjZweDttYXJnaW4tcmlnaHQ6NnB4fS50cC1jb2xwdl9oe21hcmdpbi10b3A6dmFyKC0tY250LXVzcCl9LnRwLWNvbHB2X3JnYntkaXNwbGF5OmZsZXg7bWFyZ2luLXRvcDp2YXIoLS1jbnQtdXNwKTt3aWR0aDoxMDAlfS50cC1jb2xwdl9he2Rpc3BsYXk6ZmxleDttYXJnaW4tdG9wOnZhcigtLWNudC12cCk7cGFkZGluZy10b3A6Y2FsYyh2YXIoLS1jbnQtdnApICsgMnB4KTtwb3NpdGlvbjpyZWxhdGl2ZX0udHAtY29scHZfYTo6YmVmb3Jle2JhY2tncm91bmQtY29sb3I6dmFyKC0tZ3J2LWZnKTtjb250ZW50OlwiXCI7aGVpZ2h0OjJweDtsZWZ0OmNhbGMoLTEqdmFyKC0tY250LWhwKSk7cG9zaXRpb246YWJzb2x1dGU7cmlnaHQ6Y2FsYygtMSp2YXIoLS1jbnQtaHApKTt0b3A6MH0udHAtY29scHYudHAtdi1kaXNhYmxlZCAudHAtY29scHZfYTo6YmVmb3Jle29wYWNpdHk6LjV9LnRwLWNvbHB2X2Fwe2FsaWduLWl0ZW1zOmNlbnRlcjtkaXNwbGF5OmZsZXg7ZmxleDozfS50cC1jb2xwdl9hdHtmbGV4OjE7bWFyZ2luLWxlZnQ6NHB4fS50cC1zdnB2e2JvcmRlci1yYWRpdXM6dmFyKC0tYmxkLWJyKTtvdXRsaW5lOm5vbmU7b3ZlcmZsb3c6aGlkZGVuO3Bvc2l0aW9uOnJlbGF0aXZlfS50cC1zdnB2LnRwLXYtZGlzYWJsZWR7b3BhY2l0eTouNX0udHAtc3Zwdl9je2N1cnNvcjpjcm9zc2hhaXI7ZGlzcGxheTpibG9jaztoZWlnaHQ6Y2FsYyh2YXIoLS1jbnQtdXN6KSo0KTt3aWR0aDoxMDAlfS50cC1zdnB2X217Ym9yZGVyLXJhZGl1czoxMDAlO2JvcmRlcjpyZ2JhKDI1NSwyNTUsMjU1LC43NSkgc29saWQgMnB4O2JveC1zaXppbmc6Ym9yZGVyLWJveDtmaWx0ZXI6ZHJvcC1zaGFkb3coMCAwIDFweCByZ2JhKDAsIDAsIDAsIDAuMykpO2hlaWdodDoxMnB4O21hcmdpbi1sZWZ0Oi02cHg7bWFyZ2luLXRvcDotNnB4O3BvaW50ZXItZXZlbnRzOm5vbmU7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6MTJweH0udHAtc3Zwdjpmb2N1cyAudHAtc3Zwdl9te2JvcmRlci1jb2xvcjojZmZmfS50cC1ocGx2e2N1cnNvcjpwb2ludGVyO2hlaWdodDp2YXIoLS1jbnQtdXN6KTtvdXRsaW5lOm5vbmU7cG9zaXRpb246cmVsYXRpdmV9LnRwLWhwbHYudHAtdi1kaXNhYmxlZHtvcGFjaXR5Oi41fS50cC1ocGx2X2N7YmFja2dyb3VuZC1pbWFnZTp1cmwoZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFQUFBQUFCQ0FZQUFBQnViYWdYQUFBQVEwbEVRVlFvVTJQOHo4RHduMEdDZ1FFRGkyT0svUkJnWUhqQmdJcGZvdkZoOGo4WUJJZ3pGR1F4dXFFZ1BoYURPVDVnT2hQa2RDeE9aZUJnK0lERlpaaUdBZ0NhU1NNWXRjUkhMZ0FBQUFCSlJVNUVya0pnZ2c9PSk7YmFja2dyb3VuZC1wb3NpdGlvbjpsZWZ0IHRvcDtiYWNrZ3JvdW5kLXJlcGVhdDpuby1yZXBlYXQ7YmFja2dyb3VuZC1zaXplOjEwMCUgMTAwJTtib3JkZXItcmFkaXVzOjJweDtkaXNwbGF5OmJsb2NrO2hlaWdodDo0cHg7bGVmdDowO21hcmdpbi10b3A6LTJweDtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6NTAlO3dpZHRoOjEwMCV9LnRwLWhwbHZfbXtib3JkZXItcmFkaXVzOnZhcigtLWJsZC1icik7Ym9yZGVyOnJnYmEoMjU1LDI1NSwyNTUsLjc1KSBzb2xpZCAycHg7Ym94LXNoYWRvdzowIDAgMnB4IHJnYmEoMCwwLDAsLjEpO2JveC1zaXppbmc6Ym9yZGVyLWJveDtoZWlnaHQ6MTJweDtsZWZ0OjUwJTttYXJnaW4tbGVmdDotNnB4O21hcmdpbi10b3A6LTZweDtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6NTAlO3dpZHRoOjEycHh9LnRwLWhwbHY6Zm9jdXMgLnRwLWhwbHZfbXtib3JkZXItY29sb3I6I2ZmZn0udHAtYXBsdntjdXJzb3I6cG9pbnRlcjtoZWlnaHQ6dmFyKC0tY250LXVzeik7b3V0bGluZTpub25lO3Bvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOjEwMCV9LnRwLWFwbHYudHAtdi1kaXNhYmxlZHtvcGFjaXR5Oi41fS50cC1hcGx2X2J7YmFja2dyb3VuZC1jb2xvcjojZmZmO2JhY2tncm91bmQtaW1hZ2U6bGluZWFyLWdyYWRpZW50KHRvIHRvcCByaWdodCwgI2RkZCAyNSUsIHRyYW5zcGFyZW50IDI1JSwgdHJhbnNwYXJlbnQgNzUlLCAjZGRkIDc1JSksbGluZWFyLWdyYWRpZW50KHRvIHRvcCByaWdodCwgI2RkZCAyNSUsIHRyYW5zcGFyZW50IDI1JSwgdHJhbnNwYXJlbnQgNzUlLCAjZGRkIDc1JSk7YmFja2dyb3VuZC1zaXplOjRweCA0cHg7YmFja2dyb3VuZC1wb3NpdGlvbjowIDAsMnB4IDJweDtib3JkZXItcmFkaXVzOjJweDtkaXNwbGF5OmJsb2NrO2hlaWdodDo0cHg7bGVmdDowO21hcmdpbi10b3A6LTJweDtvdmVyZmxvdzpoaWRkZW47cG9zaXRpb246YWJzb2x1dGU7dG9wOjUwJTt3aWR0aDoxMDAlfS50cC1hcGx2X2N7aW5zZXQ6MDtwb3NpdGlvbjphYnNvbHV0ZX0udHAtYXBsdl9te2JhY2tncm91bmQtY29sb3I6I2ZmZjtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudCh0byB0b3AgcmlnaHQsICNkZGQgMjUlLCB0cmFuc3BhcmVudCAyNSUsIHRyYW5zcGFyZW50IDc1JSwgI2RkZCA3NSUpLGxpbmVhci1ncmFkaWVudCh0byB0b3AgcmlnaHQsICNkZGQgMjUlLCB0cmFuc3BhcmVudCAyNSUsIHRyYW5zcGFyZW50IDc1JSwgI2RkZCA3NSUpO2JhY2tncm91bmQtc2l6ZToxMnB4IDEycHg7YmFja2dyb3VuZC1wb3NpdGlvbjowIDAsNnB4IDZweDtib3JkZXItcmFkaXVzOnZhcigtLWJsZC1icik7Ym94LXNoYWRvdzowIDAgMnB4IHJnYmEoMCwwLDAsLjEpO2hlaWdodDoxMnB4O2xlZnQ6NTAlO21hcmdpbi1sZWZ0Oi02cHg7bWFyZ2luLXRvcDotNnB4O292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6NTAlO3dpZHRoOjEycHh9LnRwLWFwbHZfcHtib3JkZXItcmFkaXVzOnZhcigtLWJsZC1icik7Ym9yZGVyOnJnYmEoMjU1LDI1NSwyNTUsLjc1KSBzb2xpZCAycHg7Ym94LXNpemluZzpib3JkZXItYm94O2luc2V0OjA7cG9zaXRpb246YWJzb2x1dGV9LnRwLWFwbHY6Zm9jdXMgLnRwLWFwbHZfcHtib3JkZXItY29sb3I6I2ZmZn0udHAtY29sc3d2e2JhY2tncm91bmQtY29sb3I6I2ZmZjtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudCh0byB0b3AgcmlnaHQsICNkZGQgMjUlLCB0cmFuc3BhcmVudCAyNSUsIHRyYW5zcGFyZW50IDc1JSwgI2RkZCA3NSUpLGxpbmVhci1ncmFkaWVudCh0byB0b3AgcmlnaHQsICNkZGQgMjUlLCB0cmFuc3BhcmVudCAyNSUsIHRyYW5zcGFyZW50IDc1JSwgI2RkZCA3NSUpO2JhY2tncm91bmQtc2l6ZToxMHB4IDEwcHg7YmFja2dyb3VuZC1wb3NpdGlvbjowIDAsNXB4IDVweDtib3JkZXItcmFkaXVzOnZhcigtLWJsZC1icik7b3ZlcmZsb3c6aGlkZGVufS50cC1jb2xzd3YudHAtdi1kaXNhYmxlZHtvcGFjaXR5Oi41fS50cC1jb2xzd3Zfc3d7Ym9yZGVyLXJhZGl1czowfS50cC1jb2xzd3ZfYntjdXJzb3I6cG9pbnRlcjtkaXNwbGF5OmJsb2NrO2hlaWdodDp2YXIoLS1jbnQtdXN6KTtsZWZ0OjA7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7d2lkdGg6dmFyKC0tY250LXVzeil9LnRwLWNvbHN3dl9iOmZvY3VzOjphZnRlcntib3JkZXI6cmdiYSgyNTUsMjU1LDI1NSwuNzUpIHNvbGlkIDJweDtib3JkZXItcmFkaXVzOnZhcigtLWJsZC1icik7Y29udGVudDpcIlwiO2Rpc3BsYXk6YmxvY2s7aW5zZXQ6MDtwb3NpdGlvbjphYnNvbHV0ZX0udHAtY29sdHh0dntkaXNwbGF5OmZsZXg7d2lkdGg6MTAwJX0udHAtY29sdHh0dl9te21hcmdpbi1yaWdodDo0cHh9LnRwLWNvbHR4dHZfbXN7Ym9yZGVyLXJhZGl1czp2YXIoLS1ibGQtYnIpO2NvbG9yOnZhcigtLWxibC1mZyk7Y3Vyc29yOnBvaW50ZXI7aGVpZ2h0OnZhcigtLWNudC11c3opO2xpbmUtaGVpZ2h0OnZhcigtLWNudC11c3opO3BhZGRpbmc6MCAxOHB4IDAgNHB4fS50cC1jb2x0eHR2X21zOmhvdmVye2JhY2tncm91bmQtY29sb3I6dmFyKC0taW4tYmctaCl9LnRwLWNvbHR4dHZfbXM6Zm9jdXN7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1pbi1iZy1mKX0udHAtY29sdHh0dl9tczphY3RpdmV7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1pbi1iZy1hKX0udHAtY29sdHh0dl9tbXtjb2xvcjp2YXIoLS1sYmwtZmcpfS50cC1jb2x0eHR2LnRwLXYtZGlzYWJsZWQgLnRwLWNvbHR4dHZfbW17b3BhY2l0eTouNX0udHAtY29sdHh0dl93e2ZsZXg6MX0udHAtZGZ3dntwb3NpdGlvbjphYnNvbHV0ZTt0b3A6OHB4O3JpZ2h0OjhweDt3aWR0aDoyNTZweH0udHAtZmxkdntwb3NpdGlvbjpyZWxhdGl2ZX0udHAtZmxkdl90e3BhZGRpbmctbGVmdDo0cHh9LnRwLWZsZHZfYjpkaXNhYmxlZCAudHAtZmxkdl9te2Rpc3BsYXk6bm9uZX0udHAtZmxkdl9je3BhZGRpbmctbGVmdDo0cHh9LnRwLWZsZHZfaXtib3R0b206MDtjb2xvcjp2YXIoLS1jbnQtYmcpO2xlZnQ6MDtvdmVyZmxvdzpoaWRkZW47cG9zaXRpb246YWJzb2x1dGU7dG9wOmNhbGModmFyKC0tY250LXVzeikgKyA0cHgpO3dpZHRoOm1heCh2YXIoLS1icy1iciksNHB4KX0udHAtZmxkdl9pOjpiZWZvcmV7YmFja2dyb3VuZC1jb2xvcjpjdXJyZW50Q29sb3I7Ym90dG9tOjA7Y29udGVudDpcIlwiO2xlZnQ6MDtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDt3aWR0aDo0cHh9LnRwLWZsZHZfYjpob3ZlcisudHAtZmxkdl9pe2NvbG9yOnZhcigtLWNudC1iZy1oKX0udHAtZmxkdl9iOmZvY3VzKy50cC1mbGR2X2l7Y29sb3I6dmFyKC0tY250LWJnLWYpfS50cC1mbGR2X2I6YWN0aXZlKy50cC1mbGR2X2l7Y29sb3I6dmFyKC0tY250LWJnLWEpfS50cC1mbGR2LnRwLXYtZGlzYWJsZWQ+LnRwLWZsZHZfaXtvcGFjaXR5Oi41fS50cC1ncmx2e3Bvc2l0aW9uOnJlbGF0aXZlfS50cC1ncmx2X2d7ZGlzcGxheTpibG9jaztoZWlnaHQ6Y2FsYyh2YXIoLS1jbnQtdXN6KSozKX0udHAtZ3Jsdl9nIHBvbHlsaW5le2ZpbGw6bm9uZTtzdHJva2U6dmFyKC0tbW8tZmcpO3N0cm9rZS1saW5lam9pbjpyb3VuZH0udHAtZ3Jsdl90e21hcmdpbi10b3A6LTRweDt0cmFuc2l0aW9uOmxlZnQgLjA1cyx0b3AgLjA1czt2aXNpYmlsaXR5OmhpZGRlbn0udHAtZ3Jsdl90LnRwLWdybHZfdC1he3Zpc2liaWxpdHk6dmlzaWJsZX0udHAtZ3Jsdl90LnRwLWdybHZfdC1pbnt0cmFuc2l0aW9uOm5vbmV9LnRwLWdybHYudHAtdi1kaXNhYmxlZCAudHAtZ3Jsdl9ne29wYWNpdHk6LjV9LnRwLWdybHYgLnRwLXR0dntiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLW1vLWZnKX0udHAtZ3JsdiAudHAtdHR2OjpiZWZvcmV7Ym9yZGVyLXRvcC1jb2xvcjp2YXIoLS1tby1mZyl9LnRwLWxibHZ7YWxpZ24taXRlbXM6Y2VudGVyO2Rpc3BsYXk6ZmxleDtsaW5lLWhlaWdodDoxLjM7cGFkZGluZy1sZWZ0OnZhcigtLWNudC1ocCk7cGFkZGluZy1yaWdodDp2YXIoLS1jbnQtaHApfS50cC1sYmx2LnRwLWxibHYtbm9se2Rpc3BsYXk6YmxvY2t9LnRwLWxibHZfbHtjb2xvcjp2YXIoLS1sYmwtZmcpO2ZsZXg6MTstd2Via2l0LWh5cGhlbnM6YXV0bztoeXBoZW5zOmF1dG87b3ZlcmZsb3c6aGlkZGVuO3BhZGRpbmctbGVmdDo0cHg7cGFkZGluZy1yaWdodDoxNnB4fS50cC1sYmx2LnRwLXYtZGlzYWJsZWQgLnRwLWxibHZfbHtvcGFjaXR5Oi41fS50cC1sYmx2LnRwLWxibHYtbm9sIC50cC1sYmx2X2x7ZGlzcGxheTpub25lfS50cC1sYmx2X3Z7YWxpZ24tc2VsZjpmbGV4LXN0YXJ0O2ZsZXgtZ3JvdzowO2ZsZXgtc2hyaW5rOjA7d2lkdGg6dmFyKC0tYmxkLXZ3KX0udHAtbGJsdi50cC1sYmx2LW5vbCAudHAtbGJsdl92e3dpZHRoOjEwMCV9LnRwLWxzdHZfc3twYWRkaW5nOjAgMjBweCAwIHZhcigtLWJsZC1ocCk7d2lkdGg6MTAwJX0udHAtbHN0dl9te2NvbG9yOnZhcigtLWJ0bi1mZyl9LnRwLXNnbHZfaXtwYWRkaW5nLWxlZnQ6dmFyKC0tYmxkLWhwKTtwYWRkaW5nLXJpZ2h0OnZhcigtLWJsZC1ocCl9LnRwLXNnbHYudHAtdi1kaXNhYmxlZCAudHAtc2dsdl9pe29wYWNpdHk6LjV9LnRwLW1sbHZfaXtkaXNwbGF5OmJsb2NrO2hlaWdodDpjYWxjKHZhcigtLWNudC11c3opKjMpO2xpbmUtaGVpZ2h0OnZhcigtLWNudC11c3opO3BhZGRpbmctbGVmdDp2YXIoLS1ibGQtaHApO3BhZGRpbmctcmlnaHQ6dmFyKC0tYmxkLWhwKTtyZXNpemU6bm9uZTt3aGl0ZS1zcGFjZTpwcmV9LnRwLW1sbHYudHAtdi1kaXNhYmxlZCAudHAtbWxsdl9pe29wYWNpdHk6LjV9LnRwLXAyZHZ7cG9zaXRpb246cmVsYXRpdmV9LnRwLXAyZHZfaHtkaXNwbGF5OmZsZXh9LnRwLXAyZHZfYntoZWlnaHQ6dmFyKC0tY250LXVzeik7bWFyZ2luLXJpZ2h0OjRweDtwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDp2YXIoLS1jbnQtdXN6KX0udHAtcDJkdl9iIHN2Z3tkaXNwbGF5OmJsb2NrO2hlaWdodDoxNnB4O2xlZnQ6NTAlO21hcmdpbi1sZWZ0Oi04cHg7bWFyZ2luLXRvcDotOHB4O3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1MCU7d2lkdGg6MTZweH0udHAtcDJkdl9iIHN2ZyBwYXRoe3N0cm9rZTpjdXJyZW50Q29sb3I7c3Ryb2tlLXdpZHRoOjJ9LnRwLXAyZHZfYiBzdmcgY2lyY2xle2ZpbGw6Y3VycmVudENvbG9yfS50cC1wMmR2X3R7ZmxleDoxfS50cC1wMmR2X3B7aGVpZ2h0OjA7bWFyZ2luLXRvcDowO29wYWNpdHk6MDtvdmVyZmxvdzpoaWRkZW47dHJhbnNpdGlvbjpoZWlnaHQgLjJzIGVhc2UtaW4tb3V0LG9wYWNpdHkgLjJzIGxpbmVhcixtYXJnaW4gLjJzIGVhc2UtaW4tb3V0fS50cC1wMmR2LnRwLXAyZHYtZXhwYW5kZWQgLnRwLXAyZHZfcHttYXJnaW4tdG9wOnZhcigtLWNudC11c3ApO29wYWNpdHk6MX0udHAtcDJkdiAudHAtcG9wdntsZWZ0OmNhbGMoLTEqdmFyKC0tY250LWhwKSk7cmlnaHQ6Y2FsYygtMSp2YXIoLS1jbnQtaHApKTt0b3A6dmFyKC0tY250LXVzeil9LnRwLXAyZHB2e3BhZGRpbmctbGVmdDpjYWxjKHZhcigtLWNudC11c3opICsgNHB4KX0udHAtcDJkcHZfcHtjdXJzb3I6Y3Jvc3NoYWlyO2hlaWdodDowO292ZXJmbG93OmhpZGRlbjtwYWRkaW5nLWJvdHRvbToxMDAlO3Bvc2l0aW9uOnJlbGF0aXZlfS50cC1wMmRwdi50cC12LWRpc2FibGVkIC50cC1wMmRwdl9we29wYWNpdHk6LjV9LnRwLXAyZHB2X2d7ZGlzcGxheTpibG9jaztoZWlnaHQ6MTAwJTtsZWZ0OjA7cG9pbnRlci1ldmVudHM6bm9uZTtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDt3aWR0aDoxMDAlfS50cC1wMmRwdl9heHtvcGFjaXR5Oi4xO3N0cm9rZTp2YXIoLS1pbi1mZyk7c3Ryb2tlLWRhc2hhcnJheToxfS50cC1wMmRwdl9se29wYWNpdHk6LjU7c3Ryb2tlOnZhcigtLWluLWZnKTtzdHJva2UtZGFzaGFycmF5OjF9LnRwLXAyZHB2X217Ym9yZGVyOnZhcigtLWluLWZnKSBzb2xpZCAxcHg7Ym9yZGVyLXJhZGl1czo1MCU7Ym94LXNpemluZzpib3JkZXItYm94O2hlaWdodDo0cHg7bWFyZ2luLWxlZnQ6LTJweDttYXJnaW4tdG9wOi0ycHg7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6NHB4fS50cC1wMmRwdl9wOmZvY3VzIC50cC1wMmRwdl9te2JhY2tncm91bmQtY29sb3I6dmFyKC0taW4tZmcpO2JvcmRlci13aWR0aDowfS50cC1wb3B2e2JhY2tncm91bmQtY29sb3I6dmFyKC0tYnMtYmcpO2JvcmRlci1yYWRpdXM6dmFyKC0tYnMtYnIpO2JveC1zaGFkb3c6MCAycHggNHB4IHZhcigtLWJzLXNoKTtkaXNwbGF5Om5vbmU7bWF4LXdpZHRoOnZhcigtLWJsZC12dyk7cGFkZGluZzp2YXIoLS1jbnQtdnApIHZhcigtLWNudC1ocCk7cG9zaXRpb246YWJzb2x1dGU7dmlzaWJpbGl0eTpoaWRkZW47ei1pbmRleDoxMDAwfS50cC1wb3B2LnRwLXBvcHYtdntkaXNwbGF5OmJsb2NrO3Zpc2liaWxpdHk6dmlzaWJsZX0udHAtc2xkdi50cC12LWRpc2FibGVke29wYWNpdHk6LjV9LnRwLXNsZHZfdHtib3gtc2l6aW5nOmJvcmRlci1ib3g7Y3Vyc29yOnBvaW50ZXI7aGVpZ2h0OnZhcigtLWNudC11c3opO21hcmdpbjowIDZweDtvdXRsaW5lOm5vbmU7cG9zaXRpb246cmVsYXRpdmV9LnRwLXNsZHZfdDo6YmVmb3Jle2JhY2tncm91bmQtY29sb3I6dmFyKC0taW4tYmcpO2JvcmRlci1yYWRpdXM6MXB4O2NvbnRlbnQ6XCJcIjtkaXNwbGF5OmJsb2NrO2hlaWdodDoycHg7aW5zZXQ6MDttYXJnaW46YXV0bztwb3NpdGlvbjphYnNvbHV0ZX0udHAtc2xkdl9re2hlaWdodDoxMDAlO2xlZnQ6MDtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MH0udHAtc2xkdl9rOjpiZWZvcmV7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1pbi1mZyk7Ym9yZGVyLXJhZGl1czoxcHg7Y29udGVudDpcIlwiO2Rpc3BsYXk6YmxvY2s7aGVpZ2h0OjJweDtpbnNldDowO21hcmdpbi1ib3R0b206YXV0bzttYXJnaW4tdG9wOmF1dG87cG9zaXRpb246YWJzb2x1dGV9LnRwLXNsZHZfazo6YWZ0ZXJ7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1idG4tYmcpO2JvcmRlci1yYWRpdXM6dmFyKC0tYmxkLWJyKTtib3R0b206MDtjb250ZW50OlwiXCI7ZGlzcGxheTpibG9jaztoZWlnaHQ6MTJweDttYXJnaW4tYm90dG9tOmF1dG87bWFyZ2luLXRvcDphdXRvO3Bvc2l0aW9uOmFic29sdXRlO3JpZ2h0Oi02cHg7dG9wOjA7d2lkdGg6MTJweH0udHAtc2xkdl90OmhvdmVyIC50cC1zbGR2X2s6OmFmdGVye2JhY2tncm91bmQtY29sb3I6dmFyKC0tYnRuLWJnLWgpfS50cC1zbGR2X3Q6Zm9jdXMgLnRwLXNsZHZfazo6YWZ0ZXJ7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1idG4tYmctZil9LnRwLXNsZHZfdDphY3RpdmUgLnRwLXNsZHZfazo6YWZ0ZXJ7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1idG4tYmctYSl9LnRwLXNsZHR4dHZ7ZGlzcGxheTpmbGV4fS50cC1zbGR0eHR2X3N7ZmxleDoyfS50cC1zbGR0eHR2X3R7ZmxleDoxO21hcmdpbi1sZWZ0OjRweH0udHAtdGFidntwb3NpdGlvbjpyZWxhdGl2ZX0udHAtdGFidl90e2FsaWduLWl0ZW1zOmZsZXgtZW5kO2NvbG9yOnZhcigtLWNudC1iZyk7ZGlzcGxheTpmbGV4O292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjpyZWxhdGl2ZX0udHAtdGFidl90OmhvdmVye2NvbG9yOnZhcigtLWNudC1iZy1oKX0udHAtdGFidl90OmhhcygqOmZvY3VzKXtjb2xvcjp2YXIoLS1jbnQtYmctZil9LnRwLXRhYnZfdDpoYXMoKjphY3RpdmUpe2NvbG9yOnZhcigtLWNudC1iZy1hKX0udHAtdGFidl90OjpiZWZvcmV7YmFja2dyb3VuZC1jb2xvcjpjdXJyZW50Q29sb3I7Ym90dG9tOjA7Y29udGVudDpcIlwiO2hlaWdodDoycHg7bGVmdDowO3BvaW50ZXItZXZlbnRzOm5vbmU7cG9zaXRpb246YWJzb2x1dGU7cmlnaHQ6MH0udHAtdGFidi50cC12LWRpc2FibGVkIC50cC10YWJ2X3Q6OmJlZm9yZXtvcGFjaXR5Oi41fS50cC10YWJ2LnRwLXRhYnYtbm9wIC50cC10YWJ2X3R7aGVpZ2h0OmNhbGModmFyKC0tY250LXVzeikgKyA0cHgpO3Bvc2l0aW9uOnJlbGF0aXZlfS50cC10YWJ2LnRwLXRhYnYtbm9wIC50cC10YWJ2X3Q6OmJlZm9yZXtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWNudC1iZyk7Ym90dG9tOjA7Y29udGVudDpcIlwiO2hlaWdodDoycHg7bGVmdDowO3Bvc2l0aW9uOmFic29sdXRlO3JpZ2h0OjB9LnRwLXRhYnZfaXtib3R0b206MDtjb2xvcjp2YXIoLS1jbnQtYmcpO2xlZnQ6MDtvdmVyZmxvdzpoaWRkZW47cG9zaXRpb246YWJzb2x1dGU7dG9wOmNhbGModmFyKC0tY250LXVzeikgKyA0cHgpO3dpZHRoOm1heCh2YXIoLS1icy1iciksNHB4KX0udHAtdGFidl9pOjpiZWZvcmV7YmFja2dyb3VuZC1jb2xvcjpjdXJyZW50Q29sb3I7Ym90dG9tOjA7Y29udGVudDpcIlwiO2xlZnQ6MDtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDt3aWR0aDo0cHh9LnRwLXRhYnZfdDpob3ZlcisudHAtdGFidl9pe2NvbG9yOnZhcigtLWNudC1iZy1oKX0udHAtdGFidl90OmhhcygqOmZvY3VzKSsudHAtdGFidl9pe2NvbG9yOnZhcigtLWNudC1iZy1mKX0udHAtdGFidl90OmhhcygqOmFjdGl2ZSkrLnRwLXRhYnZfaXtjb2xvcjp2YXIoLS1jbnQtYmctYSl9LnRwLXRhYnYudHAtdi1kaXNhYmxlZD4udHAtdGFidl9pe29wYWNpdHk6LjV9LnRwLXRiaXZ7ZmxleDoxO21pbi13aWR0aDowO3Bvc2l0aW9uOnJlbGF0aXZlfS50cC10Yml2Ky50cC10Yml2e21hcmdpbi1sZWZ0OjJweH0udHAtdGJpdisudHAtdGJpdi50cC12LWRpc2FibGVkOjpiZWZvcmV7b3BhY2l0eTouNX0udHAtdGJpdl9ie2Rpc3BsYXk6YmxvY2s7cGFkZGluZy1sZWZ0OmNhbGModmFyKC0tY250LWhwKSArIDRweCk7cGFkZGluZy1yaWdodDpjYWxjKHZhcigtLWNudC1ocCkgKyA0cHgpO3Bvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOjEwMCV9LnRwLXRiaXZfYjpkaXNhYmxlZHtvcGFjaXR5Oi41fS50cC10Yml2X2I6OmJlZm9yZXtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWNudC1iZyk7Y29udGVudDpcIlwiO2luc2V0OjAgMCAycHg7cG9pbnRlci1ldmVudHM6bm9uZTtwb3NpdGlvbjphYnNvbHV0ZX0udHAtdGJpdl9iOmhvdmVyOjpiZWZvcmV7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1jbnQtYmctaCl9LnRwLXRiaXZfYjpmb2N1czo6YmVmb3Jle2JhY2tncm91bmQtY29sb3I6dmFyKC0tY250LWJnLWYpfS50cC10Yml2X2I6YWN0aXZlOjpiZWZvcmV7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1jbnQtYmctYSl9LnRwLXRiaXZfdHtjb2xvcjp2YXIoLS1jbnQtZmcpO2hlaWdodDpjYWxjKHZhcigtLWNudC11c3opICsgNHB4KTtsaW5lLWhlaWdodDpjYWxjKHZhcigtLWNudC11c3opICsgNHB4KTtvcGFjaXR5Oi41O292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjpyZWxhdGl2ZTt0ZXh0LW92ZXJmbG93OmVsbGlwc2lzfS50cC10Yml2LnRwLXRiaXYtc2VsIC50cC10Yml2X3R7b3BhY2l0eToxfS50cC10YnB2X2N7cGFkZGluZy1ib3R0b206dmFyKC0tY250LXZwKTtwYWRkaW5nLWxlZnQ6NHB4O3BhZGRpbmctdG9wOnZhcigtLWNudC12cCl9LnRwLXR4dHZ7cG9zaXRpb246cmVsYXRpdmV9LnRwLXR4dHZfaXtwYWRkaW5nLWxlZnQ6dmFyKC0tYmxkLWhwKTtwYWRkaW5nLXJpZ2h0OnZhcigtLWJsZC1ocCl9LnRwLXR4dHYudHAtdHh0di1mc3QgLnRwLXR4dHZfaXtib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czowO2JvcmRlci10b3AtcmlnaHQtcmFkaXVzOjB9LnRwLXR4dHYudHAtdHh0di1taWQgLnRwLXR4dHZfaXtib3JkZXItcmFkaXVzOjB9LnRwLXR4dHYudHAtdHh0di1sc3QgLnRwLXR4dHZfaXtib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOjA7Ym9yZGVyLXRvcC1sZWZ0LXJhZGl1czowfS50cC10eHR2LnRwLXR4dHYtbnVtIC50cC10eHR2X2l7dGV4dC1hbGlnbjpyaWdodH0udHAtdHh0di50cC10eHR2LWRyZyAudHAtdHh0dl9pe29wYWNpdHk6LjN9LnRwLXR4dHZfa3tjdXJzb3I6cG9pbnRlcjtoZWlnaHQ6MTAwJTtsZWZ0OmNhbGModmFyKC0tYmxkLWhwKSAtIDVweCk7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7d2lkdGg6MTJweH0udHAtdHh0dl9rOjpiZWZvcmV7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1pbi1mZyk7Ym9yZGVyLXJhZGl1czoxcHg7Ym90dG9tOjA7Y29udGVudDpcIlwiO2hlaWdodDpjYWxjKHZhcigtLWNudC11c3opIC0gNHB4KTtsZWZ0OjUwJTttYXJnaW4tYm90dG9tOmF1dG87bWFyZ2luLWxlZnQ6LTFweDttYXJnaW4tdG9wOmF1dG87b3BhY2l0eTouMTtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDt0cmFuc2l0aW9uOmJvcmRlci1yYWRpdXMgLjFzLGhlaWdodCAuMXMsdHJhbnNmb3JtIC4xcyx3aWR0aCAuMXM7d2lkdGg6MnB4fS50cC10eHR2X2s6aG92ZXI6OmJlZm9yZSwudHAtdHh0di50cC10eHR2LWRyZyAudHAtdHh0dl9rOjpiZWZvcmV7b3BhY2l0eToxfS50cC10eHR2LnRwLXR4dHYtZHJnIC50cC10eHR2X2s6OmJlZm9yZXtib3JkZXItcmFkaXVzOjUwJTtoZWlnaHQ6NHB4O3RyYW5zZm9ybTp0cmFuc2xhdGVYKC0xcHgpO3dpZHRoOjRweH0udHAtdHh0dl9ne2JvdHRvbTowO2Rpc3BsYXk6YmxvY2s7aGVpZ2h0OjhweDtsZWZ0OjUwJTttYXJnaW46YXV0bztvdmVyZmxvdzp2aXNpYmxlO3BvaW50ZXItZXZlbnRzOm5vbmU7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7dmlzaWJpbGl0eTpoaWRkZW47d2lkdGg6MTAwJX0udHAtdHh0di50cC10eHR2LWRyZyAudHAtdHh0dl9ne3Zpc2liaWxpdHk6dmlzaWJsZX0udHAtdHh0dl9nYntmaWxsOm5vbmU7c3Ryb2tlOnZhcigtLWluLWZnKTtzdHJva2UtZGFzaGFycmF5OjF9LnRwLXR4dHZfZ2h7ZmlsbDpub25lO3N0cm9rZTp2YXIoLS1pbi1mZyl9LnRwLXR4dHYgLnRwLXR0dnttYXJnaW4tbGVmdDo2cHg7dmlzaWJpbGl0eTpoaWRkZW59LnRwLXR4dHYudHAtdHh0di1kcmcgLnRwLXR0dnt2aXNpYmlsaXR5OnZpc2libGV9LnRwLXR0dntiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWluLWZnKTtib3JkZXItcmFkaXVzOnZhcigtLWJsZC1icik7Y29sb3I6dmFyKC0tYnMtYmcpO3BhZGRpbmc6MnB4IDRweDtwb2ludGVyLWV2ZW50czpub25lO3Bvc2l0aW9uOmFic29sdXRlO3RyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwgLTEwMCUpfS50cC10dHY6OmJlZm9yZXtib3JkZXItY29sb3I6dmFyKC0taW4tZmcpIHJnYmEoMCwwLDAsMCkgcmdiYSgwLDAsMCwwKSByZ2JhKDAsMCwwLDApO2JvcmRlci1zdHlsZTpzb2xpZDtib3JkZXItd2lkdGg6MnB4O2JveC1zaXppbmc6Ym9yZGVyLWJveDtjb250ZW50OlwiXCI7Zm9udC1zaXplOi45ZW07aGVpZ2h0OjRweDtsZWZ0OjUwJTttYXJnaW4tbGVmdDotMnB4O3Bvc2l0aW9uOmFic29sdXRlO3RvcDoxMDAlO3dpZHRoOjRweH0udHAtcm90dntiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWJzLWJnKTtib3JkZXItcmFkaXVzOnZhcigtLWJzLWJyKTtib3gtc2hhZG93OjAgMnB4IDRweCB2YXIoLS1icy1zaCk7Zm9udC1mYW1pbHk6dmFyKC0tYnMtZmYpO2ZvbnQtc2l6ZToxMXB4O2ZvbnQtd2VpZ2h0OjUwMDtsaW5lLWhlaWdodDoxO3RleHQtYWxpZ246bGVmdH0udHAtcm90dl9ie2JvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6dmFyKC0tYnMtYnIpO2JvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOnZhcigtLWJzLWJyKTtib3JkZXItdG9wLWxlZnQtcmFkaXVzOnZhcigtLWJzLWJyKTtib3JkZXItdG9wLXJpZ2h0LXJhZGl1czp2YXIoLS1icy1icik7cGFkZGluZy1sZWZ0OmNhbGMoNHB4ICsgdmFyKC0tY250LXVzeikgKyB2YXIoLS1jbnQtaHApKTt0ZXh0LWFsaWduOmNlbnRlcn0udHAtcm90di50cC1yb3R2LWV4cGFuZGVkIC50cC1yb3R2X2J7Ym9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czowO2JvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOjA7dHJhbnNpdGlvbi1kZWxheTowczt0cmFuc2l0aW9uLWR1cmF0aW9uOjBzfS50cC1yb3R2LnRwLXJvdHYtbm90Pi50cC1yb3R2X2J7ZGlzcGxheTpub25lfS50cC1yb3R2X2I6ZGlzYWJsZWQgLnRwLXJvdHZfbXtkaXNwbGF5Om5vbmV9LnRwLXJvdHZfYz4udHAtZmxkdi50cC12LWxzdD4udHAtZmxkdl9je2JvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6dmFyKC0tYnMtYnIpO2JvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOnZhcigtLWJzLWJyKX0udHAtcm90dl9jPi50cC1mbGR2LnRwLXYtbHN0Pi50cC1mbGR2X2l7Ym9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czp2YXIoLS1icy1icil9LnRwLXJvdHZfYz4udHAtZmxkdi50cC12LWxzdDpub3QoLnRwLWZsZHYtZXhwYW5kZWQpPi50cC1mbGR2X2J7Ym9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czp2YXIoLS1icy1icik7Ym9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6dmFyKC0tYnMtYnIpfS50cC1yb3R2X2M+LnRwLWZsZHYudHAtdi1sc3QudHAtZmxkdi1leHBhbmRlZD4udHAtZmxkdl9ie3RyYW5zaXRpb24tZGVsYXk6MHM7dHJhbnNpdGlvbi1kdXJhdGlvbjowc30udHAtcm90dl9jIC50cC1mbGR2LnRwLXYtdmxzdDpub3QoLnRwLWZsZHYtZXhwYW5kZWQpPi50cC1mbGR2X2J7Ym9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6dmFyKC0tYnMtYnIpfS50cC1yb3R2LnRwLXJvdHYtbm90IC50cC1yb3R2X2M+LnRwLWZsZHYudHAtdi1mc3R7bWFyZ2luLXRvcDpjYWxjKC0xKnZhcigtLWNudC12cCkpfS50cC1yb3R2LnRwLXJvdHYtbm90IC50cC1yb3R2X2M+LnRwLWZsZHYudHAtdi1mc3Q+LnRwLWZsZHZfYntib3JkZXItdG9wLWxlZnQtcmFkaXVzOnZhcigtLWJzLWJyKTtib3JkZXItdG9wLXJpZ2h0LXJhZGl1czp2YXIoLS1icy1icil9LnRwLXJvdHZfYz4udHAtdGFidi50cC12LWxzdD4udHAtdGFidl9je2JvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6dmFyKC0tYnMtYnIpO2JvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOnZhcigtLWJzLWJyKX0udHAtcm90dl9jPi50cC10YWJ2LnRwLXYtbHN0Pi50cC10YWJ2X2l7Ym9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czp2YXIoLS1icy1icil9LnRwLXJvdHYudHAtcm90di1ub3QgLnRwLXJvdHZfYz4udHAtdGFidi50cC12LWZzdHttYXJnaW4tdG9wOmNhbGMoLTEqdmFyKC0tY250LXZwKSl9LnRwLXJvdHYudHAtcm90di1ub3QgLnRwLXJvdHZfYz4udHAtdGFidi50cC12LWZzdD4udHAtdGFidl90e2JvcmRlci10b3AtbGVmdC1yYWRpdXM6dmFyKC0tYnMtYnIpO2JvcmRlci10b3AtcmlnaHQtcmFkaXVzOnZhcigtLWJzLWJyKX0udHAtcm90di50cC12LWRpc2FibGVkLC50cC1yb3R2IC50cC12LWRpc2FibGVke3BvaW50ZXItZXZlbnRzOm5vbmV9LnRwLXJvdHYudHAtdi1oaWRkZW4sLnRwLXJvdHYgLnRwLXYtaGlkZGVue2Rpc3BsYXk6bm9uZX0udHAtc3Bydl9ye2JhY2tncm91bmQtY29sb3I6dmFyKC0tZ3J2LWZnKTtib3JkZXItd2lkdGg6MDtkaXNwbGF5OmJsb2NrO2hlaWdodDoycHg7bWFyZ2luOjA7d2lkdGg6MTAwJX0udHAtc3Bydi50cC12LWRpc2FibGVkIC50cC1zcHJ2X3J7b3BhY2l0eTouNX0nLFxuICAgICAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgICAgICAgIExpc3RCbGFkZVBsdWdpbixcbiAgICAgICAgICAgICAgICBTZXBhcmF0b3JCbGFkZVBsdWdpbixcbiAgICAgICAgICAgICAgICBTbGlkZXJCbGFkZVBsdWdpbixcbiAgICAgICAgICAgICAgICBUYWJCbGFkZVBsdWdpbixcbiAgICAgICAgICAgICAgICBUZXh0QmxhZGVQbHVnaW4sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmNvbnN0IFZFUlNJT04gPSBuZXcgU2VtdmVyKCc0LjAuNScpO1xuXG5leHBvcnQgeyBCbGFkZUFwaSwgQnV0dG9uQXBpLCBGb2xkZXJBcGksIExpc3RCbGFkZUFwaSwgTGlzdElucHV0QmluZGluZ0FwaSwgUGFuZSwgU2VtdmVyLCBTZXBhcmF0b3JCbGFkZUFwaSwgU2xpZGVyQmxhZGVBcGksIFNsaWRlcklucHV0QmluZGluZ0FwaSwgVGFiQXBpLCBUYWJQYWdlQXBpLCBUZXh0QmxhZGVBcGksIFRwQ2hhbmdlRXZlbnQsIFZFUlNJT04gfTtcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=