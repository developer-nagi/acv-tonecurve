import AcvToneCurve from "./index";
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
