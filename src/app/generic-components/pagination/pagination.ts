export class Pagination{
    number: number;
    size: number;
    totalPages: number;

    constructor(){
        this.number = 0;
        this.size = 10;
        this.totalPages = 1;
    }
}
export class Sort{
    field: string;
    sort: string;

    constructor(){
        this.field = "";
        this.sort = "asc";
    }
}

export class SortFilterPagination{
    paginationObj?: Pagination;
    sortObj?: Sort = new Sort();
    filterObj?: any = {};

    constructor(){
        this.paginationObj = new Pagination();
        this.sortObj = new Sort();
    }
    
}