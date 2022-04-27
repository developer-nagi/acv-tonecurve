"use strict";
/*
 * ACV-TONECURVE licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * @author Nagi Fuyumi [StellarCapital]
 * @version 1.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class ACVReader {
    constructor(acv) {
        this._points = {
            rgb: [],
            r: [],
            g: [],
            b: [],
        };
        this._offset = 4;
        const buf = Buffer.from(fs_1.default.readFileSync(acv));
        const ref = ["r", "g", "b"];
        const length = buf.readUInt16BE(this._offset);
        this._offset += 2;
        this._points.rgb.push({ x: 0, y: buf.readUInt16BE(this._offset) });
        this._offset += 4;
        for (let i = 1; i < length; i++) {
            const y = buf.readUInt16BE(this._offset);
            this._offset += 2;
            const x = buf.readUInt16BE(this._offset);
            this._offset += 2;
            this._points.rgb.push({ x, y });
        }
        for (let i = 0; i < 3; i++) {
            const length = buf.readUInt16BE(this._offset);
            this._offset += 2;
            const array = this._points[ref[i]];
            for (let j = 0; j < length; j++) {
                const y = buf.readUInt16BE(this._offset);
                this._offset += 2;
                const x = buf.readUInt16BE(this._offset);
                this._offset += 2;
                array.push({ x, y });
            }
        }
    }
    getPoints() {
        return this._points;
    }
}
exports.default = ACVReader;
