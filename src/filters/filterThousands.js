const filterThousands = (num = 0) => {
    try {
        num = parseFloat(num);
    } catch (e) {
        return 0;
    }
    if (isNaN(num)) return 0;

    num = num.toString();
    let intSection = '',
        floatSection = '';
    if (num.indexOf('.') > 0) {
        [intSection, floatSection] = num.split('.');
        floatSection = '.' + floatSection;
    } else {
        intSection = num;
    }

    let result = [];
    if (intSection.length < 4) {
        return intSection + floatSection;
    }
    intSection.split('').reverse().forEach((item, index) => {
        if(index % 3 === 0 && index !== 0) result.unshift(',');
        result.unshift(item);
    });

    return result.join('') + floatSection;
};

export default filterThousands;
