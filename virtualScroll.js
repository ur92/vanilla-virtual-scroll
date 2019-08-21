const h = document.createElement.bind(document);
export default class VirtualScroll {
    rootEl = null;
    listEl = null
    _data = [];
    _scrollOffset = 0;
    _itemHeight = 50;
    _itemsToRender= 11;
    updateInProgress = false;

    constructor(rootEl) {
        this.rootEl = rootEl;
    }

    set data(val) {
        this._data = val;
        this.render();
    }

    get data() {
        const start = parseInt(this.scrollOffset / this._itemHeight);
        const end = parseInt(this.scrollOffset / this._itemHeight + this._itemsToRender);
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
        const onScrollEvent = this.onScrollEvent.bind(this);
        listEl.addEventListener('scroll', onScrollEvent);
        return listEl;
    }

    onScrollEvent(){
        if(this.updateInProgress) return;
        this.updateInProgress =true;
        window.requestAnimationFrame(()=> {
            this.scrollOffset = this.listEl.scrollTop;
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

    updateListEl(){
        const firstDataId = this.data[0].id;
        const lastDataId = this.data[this._itemsToRender-1].id;
        const firstListId = parseInt(this.listEl.children[0].id);
        const lastListId = parseInt(this.listEl.children[this._itemsToRender-1].id);

        if(firstDataId===firstListId) return;

        let dataItemsToAdd = [];
        let idsToRemove = [];

        const isScrollDown = lastDataId > lastListId;

        if(isScrollDown){
            dataItemsToAdd = this.data.slice(this.data.findIndex(item=>item.id===lastListId)+1);
            if(!dataItemsToAdd) return;
            idsToRemove = [...this.listEl.children]
                .slice(0,dataItemsToAdd.length)
                .map(elem=>elem.id);
        }
        else{
            dataItemsToAdd = this.data.slice(0,this.data.findIndex(item=>item.id===firstListId));
            if(!dataItemsToAdd) return;
            idsToRemove = [...this.listEl.children]
                .slice(this._itemsToRender-dataItemsToAdd.length)
                .map(elem=>elem.id);
        }
        this.addItemsToList(dataItemsToAdd, isScrollDown);
        this.removeItemsFromList(idsToRemove);
        this.updateInProgress = false;
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

    removeItemsFromList(idsToRemove){
        idsToRemove.forEach(id=>{
            this.listEl.removeChild(this.listEl.children.namedItem(id));
        });
    }
}

