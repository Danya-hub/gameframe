import * as Config from "../config.js";
import Figure from "./figures.js";
import {
    isObj as tryObj,
} from "../helper.js"
import {
    ReactiveFunc,
} from "../convert.js";

function apply(func, _this, args) {
    if (!/^[A-Z]/g.test(func.name)) return;

    const component = Canvas._parent(Object.assign({
            name: func.name,
        },
        Object.keys(Path2D.prototype).includes(func.name.replace(/^\w/g, (sVal) => sVal.toLowerCase())) ? {
            $el: new Path2D(),
        } : {},
        ...args
    ));

    if (this._inheritStyle)
        Object.keys(this._inheritStyle).forEach(key => {
            let style = component.style || (component.style = {});
            if (!style[key])
                style[key] = this._inheritStyle[key];
        });

    this.$children.push(component);

    return component;
};

class Canvas {
    static $el = document.createElement('canvas');
    static ctx = this.$el.getContext('2d');
    static $children = [];

    static _inheritStyle = {};
    static width = 0;
    static height = 0;

    constructor(inheritStyle = {}, children = []) {
        Canvas.$children = Canvas.$children || children;
        Canvas._inheritStyle = inheritStyle;
    }

    static _parent(comp) {
        let isObj = tryObj(comp);

        if (isObj && comp.$children)
            comp.$children.forEach(e => {
                if (!(isObj = typeof e == 'object')) return;
                e.$parent = comp;
                this._parent(e.$children);
            });

        return comp;
    }

    _create() {
        Canvas.width = Canvas.$el.width = Config.widthCanvas;
        Canvas.height = Canvas.$el.height = Config.heightCanvas;

        Config.ROOT_COMPONENT.append(Canvas.$el);
    }

    finalCompute(comp) {
        comp.finalCompute = {
            x: (comp.position?.x == 'middle' ? (comp.$parent.clientCompute?.w || comp.$parent.clientCompute?.radius * 2 || 0) / 2 :
                    comp.position?.x == 'end' ? (comp.$parent.clientCompute?.w || 0) / 2 : 0) -
                (comp.clientCompute?.radius || 0) + (comp.clientCompute?.x || 0) +
                (comp.$parent?.finalCompute.x || 0) + (!comp.isFill ? comp.style?.lineWidth || 0 : 0),
            y: (comp.position?.y == 'middle' ? (comp.$parent.clientCompute?.h || comp.$parent.clientCompute?.radius * 2 || 0) / 4 :
                    comp.position?.y == 'end' ? (comp.$parent.clientCompute?.h || 0) / 2 : 0) +
                (comp.clientCompute?.y || 0) + (comp.$parent?.finalCompute.y || 0) +
                (!comp.isFill ? comp.style?.lineWidth || 0 : 0) + parseInt(comp.style?.font?.size || 0),
        };
    }

    renderCanvasComp(arr) {
        arr.forEach(obj => {
            this.finalCompute(obj);

            if (obj.style)
            Object.keys(obj.style).forEach(key => {
                    Canvas.ctx[key] = tryObj(obj.style[key]) ? Object.values(obj.style[key]).join(' ') : obj.style[key];
                });

            Figure.prototype[obj.name](obj);

            if (obj.$children)
                this.renderCanvasComp(obj.$children);
        });
    }
}

function events(arrEvents) {
    arrEvents.forEach(e => {
        Canvas.$el.addEventListener(e.name, ({
            clientX,
            clientY,
        }) => {
            Canvas.ctx.isPointInPath(e.$el, clientX, clientY) && e.methods.enter ? e.methods.enter() :
                e.methods.leave ? e.methods.leave() : null;
        })
    });
}

export const Objects = ReactiveFunc.call(Canvas, Figure.prototype, {
    apply,
});

export default new Proxy(Canvas, {
    construct(target, args) {
        Canvas.prototype._create();
        Canvas.prototype.renderCanvasComp(target.$children.filter(e => !e.$parent));

        events(Canvas.$children.filter(comp => comp.$el && comp.events).map(comp => {
            comp.events.forEach(event => event.$el = comp.$el);

            return comp.events;
        }).flat());

        return new target(...args);
    }
});