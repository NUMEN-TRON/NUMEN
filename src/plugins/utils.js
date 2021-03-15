import router from '@/router'

const utils = {
    go(url) {
        router.push(url);
    },
    rep(url) {
        router.replace(url);
    },
    back() {
        router.back();
    },

    /**
     *  计算浮点数 + - * / ，保留有效数
     * **/
    numCompute(arr = [], type = '*', decimal = 0) {
        let typeWay = {
            '+': numAdd,
            '-': numSub,
            '*': numMulti,
            '/': numDiv,
        };
        if (!Array.isArray(arr))
            throw new Error('type error; need to be arr');

        if (!Object.keys(typeWay).some(key => key === type))
            throw new Error('way err; do not know the way');

        let way = typeWay[type];
        let res = arr.reduce((pre, cur) => way(pre, cur));
        res = isNaN(res) ? 0 : res;

        return !decimal ? res : res.toFixed(decimal);
    },
    resetObj(obj, option = {value: '', in: [], ex: []}) {
        Object.keys(obj).forEach(item => {
            if (option.in.length > 0 && option.in.includes(item)) {
                obj[item] = option.value;
            }
            if (option.ex.length > 0 && !option.ex.includes(item)) {
                obj[item] = option.value;
            }
            if (option.in.length === 0 && option.ex.length === 0) {
                obj[item] = option.value;
            }
        });
    },
};

/**
 * 加法运算，避免数据相加小数点后产生多位数和计算精度损失。
 *
 */
function numAdd(num1, num2) {
    let baseNum1;
    let baseNum2;
    let baseNum;
    try {
        baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));

    return (num1 * baseNum + num2 * baseNum) / baseNum;
}

/**
 * 减法运算，避免数据相减小数点后产生多位数和计算精度损失。
 *
 * @param  num1 被减数
 * @param  num2 减数
 */
function numSub(num1, num2) {
    let baseNum;
    let baseNum1;
    let baseNum2;
    let precision; // 精度
    try {
        baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;

    return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
}

/**
 *
 * 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。
 *
 */
function numMulti(num1, num2) {
    let baseNum = 0;
    try {
        baseNum += num1.toString().split(".")[1].length;
    } catch (e) {
    }
    try {
        baseNum += num2.toString().split(".")[1].length;
    } catch (e) {
    }
    let n1 = Number(num1.toString().replace(".", ""));
    let n2 = Number(num2.toString().replace(".", ""));

    return (n1 * n2 / Math.pow(10, baseNum))
}

/**
 *  除法运算，避免数据相除小数点后产生多位数和计算精度损失。
 *
 *  @param  num1 被除数
 *  @param  num2 除数
 */

function numDiv(num1, num2) {
    let baseNum1 = 0;
    let baseNum2 = 0;
    let baseNum3;
    let baseNum4;
    try {
        baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum3 = Number(num1.toString().replace(".", ""));
    baseNum4 = Number(num2.toString().replace(".", ""));

    if (Number(num2) === 0) {
        return 0;
    }
    return (baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1);
}



export default utils
