const h = document.createElement.bind(document);
export default class VirtualScroll {
    rootEl = null;
    listEl = null;
    fakeScrollEl = null;
    data = [];
    _scrollOffset = 0;
    _currentRange= {start:0, end:0};
    _itemHeight = 50;
    _itemsToRender= 11;
    updateInProgress = false;

    constructor(rootEl) {
        this.rootEl = rootEl;
    }

    set scrollOffset(val) {
        this._scrollOffset = val;
        const {start,end} = this.calculateRange(val);
        this.updateListEl(start, end);
        this._currentRange = {start,end};
        this.listEl.style.marginTop = `${this.scrollOffset - val%this._itemHeight}px`;
    }

    get scrollOffset() {
        return this._scrollOffset;
    }

    render(data) {
        this.data= data;
        const {start,end} =this._currentRange = this.calculateRange(0);
        this.listEl = this.createListEl(this.data.slice(start,end));
        this.fakeScrollEl = this.createFakeScrollEl(this._data);
        this.rootEl.addEventListener('scroll', this.onScrollEvent.bind(this));
        this.rootEl.append( this.fakeScrollEl, this.listEl);
    }

    createListEl(data) {
        const listEl = h('ul');
        const listItemsEls = data.map((dataItem,idx)=> this.createListItemEl(dataItem));
        listEl.append(...listItemsEls);
        listEl.classList.add('list');
        return listEl;
    }

    onScrollEvent(){
        if(this.updateInProgress) return;
        this.updateInProgress =true;
        window.requestAnimationFrame(()=> {
            this.scrollOffset = this.rootEl.scrollTop;
            this.updateInProgress =false;
        });
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

    createFakeScrollEl(data) {
        const fakeScrollEl = h('div');
        fakeScrollEl.classList.add('fake-scroll');
        fakeScrollEl.style.height = `${this._itemHeight*data.length}px`;
        return fakeScrollEl;
    }

    updateListEl(start, end){
        const {start:currentStart, end:currentEnd} = this._currentRange;

        if(start===currentStart) return;

        let dataItemsToAdd = [];
        let itemsToRemove = [];

        const isScrollDown = start > currentStart;

        if(isScrollDown){
            dataItemsToAdd = this.data.slice(currentEnd, end);
            itemsToRemove = this.data.slice(currentStart, start);
        }
        else{
            dataItemsToAdd = this.data.slice(start, currentStart);
            itemsToRemove = this.data.slice(end, currentEnd);
        }
        this.addItemsToList(dataItemsToAdd, isScrollDown);
        this.removeItemsFromList(itemsToRemove);
    }

    addItemsToList(dataItemsToAdd, isScrollDown){
        const listItemsElToAdd = dataItemsToAdd.map(dataItem=>{
            return this.createListItemEl(dataItem);
        });
        if(isScrollDown) {
            this.listEl.append(...listItemsElToAdd);
        }
        else{
            this.listEl.prepend(...listItemsElToAdd);
        }
    }

    removeItemsFromList(itemsToRemove){
        itemsToRemove.forEach(item=>{
            this.listEl.removeChild(this.listEl.children.namedItem(item.id));
        });
    }

    calculateRange(scrollOffset) {
        const start = parseInt(scrollOffset / this._itemHeight);
        const end = parseInt(scrollOffset / this._itemHeight + this._itemsToRender);
        return {start, end};
    }
}

