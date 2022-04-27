/*
 * ACV-TONECURVE licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * @author Nagi Fuyumi [StellarCapital]
 * @version 1.0
 */

export default class MonotonicCubicSpline {
  private x: number[];
  private y: number[];
  private m: number[];

  constructor(x: number[], y: number[]) {
    const n: number = x.length;
    const delta: number[] = [];
    const m: number[] = [];
    const alpha: number[] = [];
    const beta: number[] = [];
    const dist: number[] = [];
    const tau: number[] = [];

    for (
      let i = 0, _ref = n - 1;
      0 <= _ref ? i < _ref : i > _ref;
      0 <= _ref ? (i += 1) : (i -= 1)
    ) {
      delta[i] = (y[i + 1] - y[i]) / (x[i + 1] - x[i]);
      if (i > 0) {
        m[i] = (delta[i - 1] + delta[i]) / 2;
      }
    }
    m[0] = delta[0];
    m[n - 1] = delta[n - 2];
    const to_fix = [];
    for (
      let i = 0, _ref2 = n - 1;
      0 <= _ref2 ? i < _ref2 : i > _ref2;
      0 <= _ref2 ? (i += 1) : (i -= 1)
    ) {
      if (delta[i] === 0) {
        to_fix.push(i);
      }
    }
    for (let _i = 0, _len = to_fix.length; _i < _len; _i++) {
      const i = to_fix[_i];
      m[i] = m[i + 1] = 0;
    }
    for (
      let i = 0, _ref3 = n - 1;
      0 <= _ref3 ? i < _ref3 : i > _ref3;
      0 <= _ref3 ? (i += 1) : (i -= 1)
    ) {
      alpha[i] = m[i] / delta[i];
      beta[i] = m[i + 1] / delta[i];
      dist[i] = Math.pow(alpha[i], 2) + Math.pow(beta[i], 2);
      tau[i] = 3 / Math.sqrt(dist[i]);
    }
    const to_fix_2 = [];
    for (
      let i = 0, _ref4 = n - 1;
      0 <= _ref4 ? i < _ref4 : i > _ref4;
      0 <= _ref4 ? (i += 1) : (i -= 1)
    ) {
      if (dist[i] > 9) {
        to_fix_2.push(i);
      }
    }
    for (let _j = 0, _len2 = to_fix.length; _j < _len2; _j++) {
      const i = to_fix_2[_j];
      m[i] = tau[i] * alpha[i] * delta[i];
      m[i + 1] = tau[i] * beta[i] * delta[i];
    }
    this.x = x.slice(0, n);
    this.y = y.slice(0, n);
    this.m = m;
  }

  public interpolate = (x: number) => {
    let _ref: number;
    let i: number;
    for (
      i = _ref = this.x.length - 2;
      _ref <= 0 ? i <= 0 : i >= 0;
      _ref <= 0 ? (i += 1) : (i -= 1)
    ) {
      if (this.x[i] <= x) {
        break;
      }
    }
    const h = this.x[i + 1] - this.x[i];
    const t = (x - this.x[i]) / h;
    const t2 = Math.pow(t, 2);
    const t3 = Math.pow(t, 3);
    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = t3 - 2 * t2 + t;
    const h01 = -2 * t3 + 3 * t2;
    const h11 = t3 - t2;

    return (
      h00 * this.y[i] +
      h10 * h * this.m[i] +
      h01 * this.y[i + 1] +
      h11 * h * this.m[i + 1]
    );
  };
}
