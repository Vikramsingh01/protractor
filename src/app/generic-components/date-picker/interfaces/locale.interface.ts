import { IOptions } from "./options.interface";

export interface ILocales {
    [lang: string]: IOptions;
}