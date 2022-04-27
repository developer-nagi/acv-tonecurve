"use strict";
/*
 * ACV-TONECURVE licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * @author Nagi Fuyumi [StellarCapital]
 * @version 1.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    getLowestAbove: (arr, index) => {
        return Math.min(0, ...arr.filter((x) => index > x)) || 0;
    },
};
