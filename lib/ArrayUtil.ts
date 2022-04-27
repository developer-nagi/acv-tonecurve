/*
 * ACV-TONECURVE licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * @author Nagi Fuyumi [StellarCapital]
 * @version 1.0
 */

export default {
  getLowestAbove: (arr: number[], index: number): number => {
    return Math.min(0, ...arr.filter((x: number) => index > x)) || 0;
  },
};
