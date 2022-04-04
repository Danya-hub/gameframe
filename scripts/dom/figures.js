import Canvas from "./canvas.js";
// import {
//     widthCanvas, heightCanvas,
// } from "../config.js";

export default class {
    Circle(args) {
        Canvas.ctx.arc(args.finalCompute.x + args.clientCompute.radius, args.finalCompute.y + args.clientCompute.radius, args.clientCompute.radius, 0, 2 * Math.PI);
        args.isFill ? Canvas.ctx.fill() : Canvas.ctx.stroke();
    }

    Rect(args) {
        Canvas.ctx.rect(...Object.values(Object.assign(args.clientCompute, args.finalCompute)));
        args.isFill ? Canvas.ctx.fill() : Canvas.ctx.stroke();
    }

    Text(args) {
        Canvas.ctx[args.isFill ? 'fillText' : 'strokeText'](args.text, args.finalCompute.x, args.finalCompute.y);
    }
}