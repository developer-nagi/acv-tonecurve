# ACV-TONECURVE

[![Build Status](https://app.travis-ci.com/Nagi-Fuyumi/acv-tonecurve.svg?branch=main)](https://app.travis-ci.com/Nagi-Fuyumi/acv-tonecurve)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

[Japanese](README_ja.md)

## About

### Module for adapting AdobePhotoshop tone curve preset files to image binary pixel data in Node.js.

It is built with TypeScript and requires no exceptional build.  
It can be installed with the following commands.

```bash
npm i acv-tonecurve
```

## Sample

Please install _node-canvas_ module.

```bash
npm i canvas
```

Easy to use.  
First, when instantiating _AcvToneCurve_, pass the filename as an argument.  
Then pass the binary data obtained from the image data to the _doCurves_ function.  
Pass the rewritten data against the _ctx_ context and rewrite _canvas_.

**TypeScript**

```typescript
import AcvToneCurve from "acv-tonecurve";
import * as Canvas from "canvas";
import fs from "fs";

const Image = Canvas.Image;

const toneCurve = new AcvToneCurve("./test/tone.acv");

const loadImageSync = (file: string) =>
  new Promise<Canvas.Image>((resolve, reject) => {
    try {
      const img = new Image();

      img.onload = () => {
        resolve(img);
      };

      img.src = fs.readFileSync(file);
    } catch (e: any) {
      reject(e);
    }
  });

test("test", async () => {
  const canvas = new Canvas.Canvas(1000, 1000);
  const ctx = canvas.getContext("2d");
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.beginPath();
  ctx.fillStyle = "rgb( 255,255, 255)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const img = await loadImageSync("./test/image.png");

  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  toneCurve.doCurves(imageData.data);

  ctx.putImageData(imageData, 0, 0);

  console.log(canvas.toBuffer());
});
```

**JavaScript**

```javascript
const AcvToneCurve = require("acv-tonecurve");
const Canvas = require("canvas");
const fs = require("fs");

const Image = Canvas.Image;

const toneCurve = new AcvToneCurve.AcvToneCurve("./test/tone.acv");

const loadImageSync = (file) =>
  new Promise((resolve, reject) => {
    try {
      const img = new Image();

      img.onload = () => {
        resolve(img);
      };

      img.src = fs.readFileSync(file);
    } catch (e) {
      reject(e);
    }
  });

test("test", async () => {
  const canvas = new Canvas.Canvas(1000, 1000);
  const ctx = canvas.getContext("2d");
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.beginPath();
  ctx.fillStyle = "rgb( 255,255, 255)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const img = await loadImageSync("./test/image.png");

  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  toneCurve.doCurves(imageData.data);

  ctx.putImageData(imageData, 0, 0);

  console.log(canvas.toBuffer());
});
```

## Resources

Here is a list of resources we consulted in creating acv-tonecurve.  
We are very grateful to them.

Monotonic Spline Curves - http://blog.mackerron.com/2011/01/01/javascript-cubic-splines/  
jQuery-filter.me - https://github.com/MatthewRuddy/jQuery-filter.me

## Change

- 04/28/2022 Fixed a bug that caused an error when requiring as JS.
