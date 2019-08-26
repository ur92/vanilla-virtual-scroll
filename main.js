import VirtualScroll from './virtualScroll.js';

const fetchData = async () => {
    return await fetch('https://jsonplaceholder.typicode.com/photos')
        .then(response => response.json());
};

const initVirtualScroll = async (elSelector) => {
    const elem = document.querySelector(elSelector);
    const vs = new VirtualScroll(elem);
    const data = await fetchData();
    vs.render(data);
};
export default initVirtualScroll;
