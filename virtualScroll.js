const h = ([elementTag]) => document.createElement(elementTag);
export default class VirtualScroll {
    _currentRange = {start: 0, end: 0};
    _itemHeight = 50;
    _itemsToRender = 11;
    rootEl = null;
    listEl = null;
    data = [];

    constructor(rootEl) {
        this.rootEl = rootEl;
    }

    render(data) {
        this.data = data;
        const {start, end} = this._currentRange = this.calculateRange(0);
        this.listEl = this.createListEl(data.slice(start, end));
        const fakeScrollEl = this.createFakeScrollEl(data);
        const onScrollUpdate = this.update.bind(this);
        this.rootEl.addEventListener('scroll', onScrollUpdate);
        this.rootEl.append(fakeScrollEl, this.listEl);
    }

    update() {
        window.requestAnimationFrame(() => {
            const scrollOffset = this.rootEl.scrollTop;
            const {start, end} = this.calculateRange(scrollOffset);
            this.updateListEl(start, end);
            this._currentRange = {start, end};
            this.listEl.style.marginTop = `${this._itemHeight * start}px`;
        });
    }

    createListEl(data) {
        const listEl = h`ul`;
        const listItemsEls = data.map((dataItem, idx) => this.createListItemEl(dataItem));
        listEl.append(...listItemsEls);
        listEl.classList.add('list');
        return listEl;
    }

    createListItemEl(dataItem) {
        const imgEl = h`img`;
        imgEl.src = dataItem.thumbnailUrl;

        const descriptionEl = h`p`;
        descriptionEl.innerText = dataItem.title;

        const listItemEl = h`li`;
        listItemEl.id = dataItem.id;
        listItemEl.append(imgEl, descriptionEl);
        listItemEl.classList.add('list-item');

        return listItemEl;
    }

    createFakeScrollEl(data) {
        const fakeScrollEl = h`div`;
        fakeScrollEl.classList.add('fake-scroll');
        fakeScrollEl.style.height = `${this._itemHeight * data.length}px`;
        return fakeScrollEl;
    }

    updateListEl(start, end) {
        const {start: currentStart, end: currentEnd} = this._currentRange;

        if (start === currentStart) return;

        let dataItemsToAdd = [];
        let itemsToRemove = [];

        const isScrollDown = start > currentStart;

        if (isScrollDown) {
            dataItemsToAdd = this.data.slice(currentEnd, end);
            itemsToRemove = this.data.slice(currentStart, start);
        } else {
            dataItemsToAdd = this.data.slice(start, currentStart);
            itemsToRemove = this.data.slice(end, currentEnd);
        }
        this.addItemsToList(dataItemsToAdd, isScrollDown);
        this.removeItemsFromList(itemsToRemove);
    }

    addItemsToList(dataItemsToAdd, isScrollDown) {
        const listItemsElToAdd = dataItemsToAdd.map(dataItem => {
            return this.createListItemEl(dataItem);
        });
        if (isScrollDown) {
            this.listEl.append(...listItemsElToAdd);
        } else {
            this.listEl.prepend(...listItemsElToAdd);
        }
    }

    removeItemsFromList(itemsToRemove) {
        itemsToRemove.forEach(item => {
            this.listEl.removeChild(this.listEl.children.namedItem(item.id));
        });
    }

    calculateRange(scrollOffset) {
        const start = parseInt(scrollOffset / this._itemHeight);
        const end = parseInt(scrollOffset / this._itemHeight + this._itemsToRender);
        return {start, end};
    }
}

