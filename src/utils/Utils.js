export function range(start, end) {
    if (!end) end = start, start = 0;
    return [...Array(end - start).keys()].map(i => i + start);
}
