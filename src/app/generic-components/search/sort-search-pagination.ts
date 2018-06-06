export class Pagination{
    number: number;
    size: number;
    totalElements : number;
    totalPages : number;
    first: boolean;
    last: boolean;

    constructor(){
        this.number = 0;
        this.size = 5;
        this.totalElements = 0;
        this.totalPages = 0;
        this.first = false;
        this.last = true;
    }
}
export class Sort{
    field: string;
    sort: string;

    constructor(){
        this.field = "modifiedDate";
        this.sort = "desc";
    }
}

export class SortSearchPagination{
    paginationObj?: Pagination;
    sortObj?: Sort = new Sort();
    filterObj?: any = {};

    constructor(){
        this.paginationObj = new Pagination();
        this.sortObj = new Sort();
    }
    
}