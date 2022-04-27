/*
 * ACV-TONECURVE licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * @author Nagi Fuyumi [StellarCapital]
 * @version 1.0
 */

import fs from "fs";

export interface ACV_POINT {
  x: number;
  y: number;
}

export interface ACV_POINTS {
  [key: string]: ACV_POINT[];
}

export default class ACVReader {
  private _points: ACV_POINTS = {
    rgb: [],
    r: [],
    g: [],
    b: [],
  };
  private _offset: number = 4;

  constructor(acv: string) {
    const buf: Buffer = Buffer.from(fs.readFileSync(acv));
    const ref: string[] = ["r", "g", "b"];
    const length: number = buf.readUInt16BE(this._offset);

    this._offset += 2;

    this._points.rgb.push({ x: 0, y: buf.readUInt16BE(this._offset) });
    this._offset += 4;

    for (let i = 1; i < length; i++) {
      const y: number = buf.readUInt16BE(this._offset);
      this._offset += 2;
      const x: number = buf.readUInt16BE(this._offset);
      this._offset += 2;
      this._points.rgb.push({ x, y });
    }

    for (let i = 0; i < 3; i++) {
      const length: number = buf.readUInt16BE(this._offset);
      this._offset += 2;
      const array: ACV_POINT[] = this._points[ref[i]];
      for (let j = 0; j < length; j++) {
        const y: number = buf.readUInt16BE(this._offset);
        this._offset += 2;
        const x: number = buf.readUInt16BE(this._offset);
        this._offset += 2;
        array.push({ x, y });
      }
    }
  }

  public getPoints(): ACV_POINTS {
    return this._points;
  }
}
