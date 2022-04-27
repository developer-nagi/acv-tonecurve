/*
 * ACV-TONECURVE licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * @author Nagi Fuyumi [StellarCapital]
 * @version 1.0
 */

import MonotonicCubicSpline from "./lib/MonotonicCubicSpline";
import readACV, { ACV_POINTS, ACV_POINT } from "./lib/ReadACV";
import ArrayUtil from "./lib/ArrayUtil";
import { ALPHA_POINTS } from "./lib/ALPHA_POINTS";

export class AcvToneCurve {
  private _curves: ALPHA_POINTS;
  private _acv: readACV;

  constructor(acvFile: string) {
    this._acv = new readACV(acvFile);
    this._curves = this._getCurves(this._acv.getPoints());
  }

  private _getCurve = (curvePoints: ACV_POINT[]) => {
    const curve: number[] = [];
    const x: number[] = [];
    const y: number[] = [];

    for (let i = 0; i < curvePoints.length; i++) {
      const p: ACV_POINT = curvePoints[i];
      x.push(p.x);
      y.push(p.y);
    }

    const cubicSpline = new MonotonicCubicSpline(x, y);

    for (let i = 0; i <= 256; i++)
      curve[i] = Math.round(cubicSpline.interpolate(i)) || 0;

    return curve;
  };

  private _getCurves = (allPoints: ACV_POINTS) => {
    let getCurves: number[][] = [];
    let curves: ALPHA_POINTS = {
      a: [],
      r: [],
      g: [],
      b: [],
    };

    for (const i in allPoints) getCurves.push(this._getCurve(allPoints[i]));

    curves.a = getCurves[0];
    curves.r = getCurves[1];
    curves.g = getCurves[2];
    curves.b = getCurves[3];

    for (const i in curves) {
      const min = ArrayUtil.getLowestAbove(curves[i], 0) - 1;
      for (let j = 0; j <= curves[i].length; j++) {
        if (curves[i][j] == 0) curves[i][j] = min;
      }
    }

    return curves;
  };

  public doCurves = (imageData: Uint8ClampedArray) => {
    const length: number = imageData.length;

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
}

export default AcvToneCurve;
