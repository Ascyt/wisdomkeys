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
    public selectedCollectionIndex: number = 0;
    public get selectedCollection(): Collection { 
        return this.collections[this.selectedCollectionIndex]; 
    }

    public getNewValue(): Value {
        return {question: "", answer:""};
    }

    public removeEmptyValues(): void {
        this.selectedCollection.values = this.selectedCollection.values.filter(value => value.question !== "" || value.answer !== "");
    }
}