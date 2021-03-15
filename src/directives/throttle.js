const throttle = {
    /*bind: (el, binding) => {
        let throttleTime = binding.value; // 防抖时间
        if (!throttleTime) { // 用户若不设置防抖时间，则默认2s
            throttleTime = 2000;
        }
        let cbFun;
        el.addEventListener('click', e => {
            if (!cbFun) { // 第一次执行
                cbFun = setTimeout(() => {
                    cbFun = null;
                    el.style.pointerEvents = 'auto';
                }, throttleTime);
            } else {
                // e.stopImmediatePropagation();
                // e.stopPropagation();
                // e.preventDefault();
                el.style.pointerEvents = 'none';
            }
        }, true);
    },*/
    inserted(el, binding) {
        el.callback = binding.value;
        el.time = el.getAttribute('time') || 2000;
        el.addEventListener('click', () => {
            const nowTime = new Date().getTime();
            if (!el.preTime || nowTime - el.preTime > el.time) {
                el.preTime = nowTime;
                el.callback();
            }
        })
    },
    update: function(el, binding) {
        el.callback = binding.value;
        el.time = el.getAttribute('time') || 2000;
    }
};

export default throttle
