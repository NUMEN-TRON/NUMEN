function filterAdrHeadTail(adr = '', head = 6, tail = 4) {
    if (!adr) return '';
    return adr.toString().slice(0, head) + '...' + adr.toString().slice(-tail);
}

export default filterAdrHeadTail