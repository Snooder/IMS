import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ItemEventData } from "tns-core-modules/ui/list-view"
import { Menu } from "nativescript-menu";
import { ShowModalOptions } from "tns-core-modules/ui/core/view";
import { Button } from "tns-core-modules/ui/button";

import { fromObject } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
const modalView = "ns-ui-category/modal-view/custom-actionbar/modal-ts-root";
let closeCallback;

const view = require("tns-core-modules/ui/core/view");
const modalViewModulets = "ns-ui-category/modal-view/basics/modal-ts-view-page";

import { Item } from "./item";
import { furniture } from "./furniture"
import { ItemService } from "./item.service";

@Component({
    selector: "ns-details",
    templateUrl: "./item-detail.component.html",
})
export class ItemDetailComponent implements OnInit {
    item: Item;
    
    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
    ) {}

    onItemTap(args: ItemEventData): void {
        console.log('Item with index: ' + args.index + ' tapped');
    }

    buttonTap() {
        Menu.popup({
          view: view.getViewById("menuBtn"),
          actions: ["Move To Another Unit", "Edit Name", "Exit"]
        })
          .then(action => {
              if(action.title=="Move To Another Unit"){
                alert(action.id + " - " + action.title);
                openModal(this);
              }else if(action.title=="Edit Name"){
                alert(action.id + " - " + action.title);
              }else{

              }
          })
          .catch(console.log);
      }

    ngOnInit(): void {
        const id = this.route.snapshot.params.id;
        this.itemService.getItem(id).then(item => {
                this.item = item;
                this.itemService.getFurniture(id).then(furniture=>{
                this.item.furniture = furniture;
                })
        });
    }
    
}
export function onShownModally(args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page: Page = <Page>args.object;
    page.bindingContext = fromObject(context);
}
export function openModal(args) {
    const mainpage: Page = <Page>args.object.page;
    const option: ShowModalOptions = {
        context: "some context",
        closeCallback: () => {},
        fullscreen: true
    };
    mainpage?.showModal(modalView, option);
}