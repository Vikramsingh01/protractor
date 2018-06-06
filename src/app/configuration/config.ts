import {Injectable} from '@angular/core';

@Injectable()
export class Config {

    public static cache = {};

    constructor(private data: any) {
     }

    public static loadInstance(jsonFile: string) {
        return new Promise((resolve, reject) => {
            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.open('GET', jsonFile, true);
            xobj.onreadystatechange = () => {
                if (xobj.readyState == 4) {
                    if (xobj.status == 200) {
                        //this.cache[jsonFile] = new Config(JSON.parse(xobj.responseText));
                        this.cache = JSON.parse(xobj.responseText);
                        resolve();
                    }
                    else {
                        reject(`Could not load file '${jsonFile}': ${xobj.status}`);
                    }
                }
            }
            xobj.send(null);
        });
    }

    public static getInstance() {
        return this.cache;
    }

    public get(key: string) {
        if (this.data == null) {
            return null;
        }
        if (key in this.data) {
            return this.data[key];
        }
        return null;
    }
}
