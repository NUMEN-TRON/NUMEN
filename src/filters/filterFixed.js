const filterFixed = (val, num = 2) => {
    if (!val || val === '0') return 0;
    try {
        val = parseFloat(val);
        return val.toFixed(num);
    } catch (err) {
        return 0
    }
};

export default filterFixed
