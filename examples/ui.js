'use strict';

import Canvas, {
    Objects
} from "../scripts/dom/canvas.js";

Objects.Rect({
    clientCompute: {
        x: 0,
        y: 0,
        w: 100,
        h: 40,
    },
    events: [{
        name: 'click',
        method() {
            console.log('Hellow, world');
        },
    }],
    $children: [Objects.Text({
        text: 'Click me',
        clientCompute: {
            x: 0,
            y: 0,
        },
        style: {
            font: {
                weight: 500,
                size: '14px',
                family: 'sans-serif',
            },
            textAlign: 'center',
        },
        position: {
            x: 'middle',
            y: 'middle'
        },
        isFill: true,
    })],
});

// TODO: create Path2D for canvas path

console.log(Canvas.ctx);

new Canvas();