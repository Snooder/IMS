import { Injectable } from "@angular/core";

import { Item } from "./item";
import { furniture } from "./furniture";

@Injectable({
    providedIn: "root"
})
export class ItemService {

    getItems(): Promise<Item[]> {
        return fetch('http://192.168.1.10:3005/properties').then(res=>res.json());
    }

    getItem(id: string): Promise<Item> {
        return fetch('http://192.168.1.10:3005/properties/' + id).then(res=>res.json());
    }

    getFurniture(id:string): Promise<[]> {
        return fetch('http://192.168.1.10:3005/properties/' + id + '/furniture').then(res=>res.json());
    }
}
