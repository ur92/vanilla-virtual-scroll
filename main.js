import VirtualScroll from './virtualScroll.js';

const fetchData = async () => {
    return await fetch('/data.json')
        .then(response => response.json());
};

const initVirtualScroll = async (elSelector) => {
    try {
        const elem = document.querySelector(elSelector);
        const vs = new VirtualScroll(elem);
        vs.data = await fetchData();
    } catch (e) {
        console.error('data fetch failed, msg: ', e.message);
    }
};

initVirtualScroll('.virtual-scroll')
