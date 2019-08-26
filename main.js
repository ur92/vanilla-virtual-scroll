import VirtualScroll from './virtualScroll.js';

const fetchData = async () => {
    return await fetch('https://jsonplaceholder.typicode.com/photos')
        .then(response => response.json());
};

const initVirtualScroll = async (elSelector) => {
    try {
        const elem = document.querySelector(elSelector);
        const vs = new VirtualScroll(elem);
        const data = await fetchData();
        vs.render(data);
    } catch (e) {
        console.error('data fetch failed, msg: ', e.message);
    }
};
export default initVirtualScroll;
