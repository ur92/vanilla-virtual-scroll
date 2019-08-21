const h = document.createElement.bind(document);
export default class VirtualScroll {
    rootEl = null;
    listEl = null
    _data = [];
    _scrollOffset = 0;
    _itemHeight = 50;

    constructor(rootEl) {
        this.rootEl = rootEl;
    }

    set data(val) {
        this._data = val;
        this.render();
    }

    get data() {
        const start = this.scrollOffset / this._itemHeight;
        const end = this.scrollOffset / this._itemHeight + 10;
        return this._data.slice(start, end);
    }

    set scrollOffset(val) {
        this._scrollOffset = val;
        this.updateListEl();
    }

    get scrollOffset() {
        return this._scrollOffset;
    }

    render() {
        this.listEl = this.createListEl(this.data);
        this.rootEl.appendChild(this.listEl);
    }

    createListEl() {
        const listEl = h('ul');
        const listItemsEls = this.data.map((dataItem,idx)=> this.createListItemEl(dataItem));
        listEl.append(...listItemsEls);
        listEl.classList.add('list');
        listEl.addEventListener('scroll', ()=>{
            this.scrollOffset = listEl.scrollTop;
        });
        return listEl;
    }

    createListItemEl(dataItem){
        const imgEl = h('img');
        imgEl.src=dataItem.thumbnailUrl;

        const descriptionEl = h('p');
        descriptionEl.innerText= dataItem.title;

        const listItemEl = h('li');
        listItemEl.id= dataItem.id;
        listItemEl.append(imgEl, descriptionEl);
        listItemEl.classList.add('list-item');

        return listItemEl;
    }

    updateListEl(){
        const firstDataId = this.data[0].id;
        const lastDataId = this.data[9].id;
        const firstListId = this.listEl.children[0].id;
        const lastListId = this.listEl.children[1].id;

        const idsToAdd = idsToPresent.filter(idx=> {
            return this.listEl.children.namedItem(idx)
        });
        const idsToRemove = idsToPresent.filter(idx=> {
            return this.listEl.children.namedItem(idx)
        });
    }
}

