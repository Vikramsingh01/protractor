import { Component, OnInit, Input, EventEmitter } from '@angular/core';

export class NsrdComponent{
  private tableId: number;
  private listId: number;

  constructor(){

  }

  setTableId(tableId:number){
    this.tableId = tableId;
  }

  setListId(listId:number){
    this.listId = listId;
  }

}
