import { Injectable } from "@angular/core";

export interface Collection {
    name: string;
    values: Value[];
}

export interface Value { 
    question: string;
    answer: string;
}

@Injectable({
    providedIn: "root"
})

export class ValuesService {
    public collections: Collection[] = [];
    public selectedCollection: Collection;

    constructor() {
        this.addCollection();
        this.selectedCollection = this.collections[0];
    }

    public addCollection(): void {
        this.collections.push({name: `Collection ${this.collections.length + 1}`, values: [this.getNewValue()]});
        this.selectedCollection = this.collections[this.collections.length - 1];
    }

    public removeCollection(collection: Collection): void {
        this.collections = this.collections.filter(c => c !== collection);
        if (this.selectedCollection === collection) {
            this.selectedCollection = this.collections[0];
        }
    }

    public getNewValue(): Value {
        return {question: "", answer:""};
    }

    public removeEmptyValues(): void {
        this.selectedCollection.values = this.selectedCollection.values.filter(value => value.question !== "" || value.answer !== "");
    }
}