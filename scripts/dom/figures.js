import Canvas from "./canvas.js";
// import {
//     widthCanvas, heightCanvas,
// } from "../config.js";

export default class {
    Circle(args) {
        args.$el.arc(args.finalCompute.x + args.clientCompute.radius, args.finalCompute.y + args.clientCompute.radius, args.clientCompute.radius, 0, 2 * Math.PI);
        Canvas.ctx[args.isFill ? 'fill' : 'stroke'](args.$el);
    }

    Rect(args) {
        args.$el.rect(...Object.values(Object.assign(args.clientCompute, args.finalCompute)));
        Canvas.ctx[args.isFill ? 'fill' : 'stroke'](args.$el);
        console.log(args.$el);
    }

    Text(args) {
        Canvas.ctx[args.isFill ? 'fillText' : 'strokeText'](args.text, args.finalCompute.x, args.finalCompute.y);
    }
}