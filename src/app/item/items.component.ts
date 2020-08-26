import { Component, OnInit } from "@angular/core";

import { Item } from "./item";
import { ItemService } from "./item.service";


@Component({
    selector: "ns-items",
    templateUrl: "./items.component.html"
})
export class ItemsComponent implements OnInit {
    items: Item[];
    
    constructor(private itemService: ItemService) { }

    ngOnInit(): void {
        this.itemService.getItems().then(data=>this.items=data);
    }
}

export function moveToTop(){
    this.items.unshift(this.items.splice(this.items.findIndex(item => item.Street === 'Storage'), 1)[0]);
}

