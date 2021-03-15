// 加法
export function add(...arg) {
    let decimal = 0;
    let args = [ ...arg ];
    // let args = Array.from(arguments);
    if (args.length === 0) return 0;
    if (args.length === 1) return +args[0];
    try {
        let arr = args.map(item => {
            if (!item) return 0;
            if (isNaN(parseFloat(item))) throw new Error('type Number');
            decimal = Math.max(parseFloat(item).toString().split('.')[1]?.length || 0, decimal);
            return parseFloat(item);
        });
        let pow = Math.pow(10, decimal);
        return arr.map(item => item * pow).reduce((pre, cur) => pre + cur, 0) / pow;
    } catch (e) {
        console.error('type Number');
        return 0;
    }
}
// 减法
export function subtract(...arg) {
    let decimal = 0;
    let args = [ ...arg ];
    if (args.length === 0) return 0;
    if (args.length === 1) return +args[0];
    try {
        let arr = args.map(item => {
            if (!item) return 0;
            if (isNaN(parseFloat(item))) throw new Error('type Number');
            decimal = Math.max(parseFloat(item).toString().split('.')[1]?.length || 0, decimal);
            return parseFloat(item);
        });
        let pow = Math.pow(10, decimal);
        return arr.map(item => item * pow).reduce((pre, cur) => pre - cur) / pow;
    } catch (e) {
        console.error('type Number');
        return 0;
    }
}
// 乘法
export function multiply(...arg) {
    let decimal = 0;
    let args = [ ...arg ];
    if (args.length === 0) return 0;
    if (args.length === 1) return +args[0];
    try {
        let arr = args.map(item => {
            if (item === undefined || item === '') return '1';
            if (isNaN(parseFloat(item))) throw new Error('type Number');
            decimal += parseFloat(item).toString().split('.')[1]?.length || 0;
            return parseFloat(item) + '';
        });
        let pow = Math.pow(10, decimal);
        return arr.map(item => +item.replace('.', '')).reduce((pre, cur) => pre * cur) / pow;
    } catch (e) {
        console.error('type Number');
        return 0;
    }
}
// 除法
export function divide(...arg) {
    let decimal = 0;
    let args = [ ...arg ];
    if (args.length === 0) return 0;
    if (args.length === 1) return +args[0];
    try {
        let arr = args.map(item => {
            if (item === undefined || item === '') return '1';
            if (isNaN(parseFloat(item))) throw new Error('type Number');
            decimal += parseFloat(item).toString().split('.')[1]?.length || 0;
            return parseFloat(item) + '';
        });
        let pow = Math.pow(10, decimal);
        return arr.map(item => +item.replace('.', '')).reduce((pre, cur) => pre / cur) * pow;
    } catch (e) {
        console.error('type Number');
        return 0;
    }
}

/**
     * HSL颜色值转换为RGB.
     * 换算公式改编自 http://en.wikipedia.org/wiki/HSL_color_space.
     * h, s, 和 l 设定在 [0, 1] 之间
     * 返回的 r, g, 和 b 在 [0, 255]之间
     *
     * @param  Number  h      色相
     * @param  Number  s      饱和度
     * @param  Number  l      亮度
     * @return  Array          RGB色值数值
     */
function hue2rgb(p, q, t){
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 1/6) return p + (q - p) * 6 * t;
    if(t < 1/2) return q;
    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
}
export function hslToRgb(h, s, l){
    // h = Math.round(h > 1 ? 1 : h < 0 ? 0 : h * 100) / 100;
    // s = Math.round(s > 1 ? 1 : s < 0 ? 0 : s * 100) / 100;
    // l = Math.round(l > 1 ? 1 : l < 0 ? 0 : l * 100) / 100;
    let r, g, b;
    if(s === 0){
        r = g = b = l; // achromatic
    }else{
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
     * RGB 颜色值转换为 HSL.
     * 转换公式参考自 http://en.wikipedia.org/wiki/HSL_color_space.
         * r, g, 和 b 需要在 [0, 255] 范围内
     * 返回的 h, s, 和 l 在 [0, 1] 之间
     *
     * @param  Number  r      红色色值
     * @param  Number  g      绿色色值
     * @param  Number  b      蓝色色值
     * @return  Array          HSL各值数组
     */
export function rgbToHsl(r, g, b){
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if(max === min){
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return [Math.floor(h*100), Math.round(s*100), Math.round(l*100)];
}

/*****
 * 防抖 (time 时间内再次促发, fn 的执行会延迟到time 时间结束后执行)
 * @param fn
 * @param time
 * @returns {Function}
 */
export function debounce(fn, time) {
    let timer = null;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, arguments);
        }, time);
    }
}

/****
 * 节流 ( time 时间内执行一尺)
 * @param fn
 * @param time
 * @returns {Function}
 */
export function throttle(fn, time) {
    let flag = false;
    let ctx = this;
    return function () {
        if (flag) return;
        flag = true;
        setTimeout(() => {
            fn.apply(ctx, arguments);
            flag = false;
        }, time);
    }
}
