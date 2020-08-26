import * as express from "express";
import { Request, Response } from "express";
import {returnServerDetails} from './serverdetails.js';

const app = express.default();

var locations = {
    properties: [],
    furniture: [],
    getProperties: function(){
        return this.properties;
    },
    setProperties: function(listLocations){
        this.properties = listLocations;
    },
    getFurniture: function(){
        return this.furniture;
    },
    setFurniture: function(listFurniture){
        this.furniture = listFurniture;
    },
    findProperty: function(id){
        var listOfProperties = locations.getProperties();
        for(var i=0;i<listOfProperties.length;i++){
            if(listOfProperties[i]['_id']==id){
                return listOfProperties[i];
            }
        }
    },
    getMatchingFurniture: function(locationID){
        var matchingFurniture = [];
        var inventory = locations.getFurniture();
        var currLocation = locations.findProperty(locationID);
        for(var i=0; i<inventory.length;i++){
            if(currLocation['Street'] == inventory[i]['Location']){
                matchingFurniture.push(inventory[i]);
            }
        }
        console.log(matchingFurniture);
        return matchingFurniture;
    }
    }

var furniture = {
    furniture: [],
    getProperties: function(){
        return this.furniture;
    },
    setProperties: function(listFurniture){
        this.furniture = listFurniture;
    },
}

async function main(){
    const {MongoClient} = require('mongodb');

    const uri = returnServerDetails();
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const client = new MongoClient(uri);
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
        await  listDatabases(client);

        locations.setProperties(await listProperties(client));
        locations.setFurniture(await listFurniture(client));

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function listProperties(client){
    return client.db('InventorySystem').collection('Locations').find().toArray().then(token => {return token});

};

async function listDatabases(client){
    var databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
main().catch(console.error);

async function listFurniture(client){
    return client.db('InventorySystem').collection('Inventory').find().toArray().then(token => {return token});
};

app.get('/', (req: Request, res: Response) => {
    res.send("Ello World");
});

app.get('/properties', (req:Request, res: Response) => {
    res.json(locations.getProperties());
});

app.get('/properties/:id', (req:Request, res:Response)=>{
    const id = (req.params.id);
    var properties = locations.getProperties();
    const foundItem = properties.filter(i=>i['_id'] == id)[0];
    res.json(foundItem);
})

app.get('/properties/:id/furniture', (req:Request, res:Response)=>{
    const id = (req.params.id);
    var properties = locations.getProperties();
    const foundItem = properties.filter(i=>i['_id'] == id)[0];
    var furniture = locations.getMatchingFurniture(id);
    res.json(furniture);
})

app.get('/furniture', (req:Request, res: Response) => {
    res.json(furniture.getProperties());
});

app.get('/furniture/:id', (req:Request, res:Response)=>{
    const id = (req.params.id);
    var properties = furniture.getProperties();
    const foundItem = properties.filter(i=>i['_id'] == id)[0];
    console.log(foundItem);
    res.json(foundItem);
})

app.listen(3005);
console.log("Server started");