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
exports.AcvToneCurve = void 0;
const MonotonicCubicSpline_1 = __importDefault(require("./lib/MonotonicCubicSpline"));
const ReadACV_1 = __importDefault(require("./lib/ReadACV"));
const ArrayUtil_1 = __importDefault(require("./lib/ArrayUtil"));
class AcvToneCurve {
    constructor(acvFile) {
        this._getCurve = (curvePoints) => {
            const curve = [];
            const x = [];
            const y = [];
            for (let i = 0; i < curvePoints.length; i++) {
                const p = curvePoints[i];
                x.push(p.x);
                y.push(p.y);
            }
            const cubicSpline = new MonotonicCubicSpline_1.default(x, y);
            for (let i = 0; i <= 256; i++)
                curve[i] = Math.round(cubicSpline.interpolate(i)) || 0;
            return curve;
        };
        this._getCurves = (allPoints) => {
            let getCurves = [];
            let curves = {
                a: [],
                r: [],
                g: [],
                b: [],
            };
            for (const i in allPoints)
                getCurves.push(this._getCurve(allPoints[i]));
            curves.a = getCurves[0];
            curves.r = getCurves[1];
            curves.g = getCurves[2];
            curves.b = getCurves[3];
            for (const i in curves) {
                const min = ArrayUtil_1.default.getLowestAbove(curves[i], 0) - 1;
                for (let j = 0; j <= curves[i].length; j++) {
                    if (curves[i][j] == 0)
                        curves[i][j] = min;
                }
            }
            return curves;
        };
        this.doCurves = (imageData) => {
            const length = imageData.length;
            for (let i = 0; i < length; i += 4) {
                imageData[i] = this._curves.r[imageData[i]];
                imageData[i + 1] = this._curves.g[imageData[i + 1]];
                imageData[i + 2] = this._curves.b[imageData[i + 2]];
            }
            for (let i = 0; i < length; i += 4) {
                imageData[i] = this._curves.a[imageData[i]];
                imageData[i + 1] = this._curves.a[imageData[i + 1]];
                imageData[i + 2] = this._curves.a[imageData[i + 2]];
            }
        };
        this._acv = new ReadACV_1.default(acvFile);
        this._curves = this._getCurves(this._acv.getPoints());
    }
}
exports.AcvToneCurve = AcvToneCurve;
exports.default = AcvToneCurve;
