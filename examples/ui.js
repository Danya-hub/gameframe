'use strict';

import Tags from "../src/tags/index.js";

Tags.Button('Click me', {
    w: 100,
    h: 40,
    y: 80,
});

Tags.Select(['First', 'Second', 'Third'], {
    w: 100,
    h: 40,
});