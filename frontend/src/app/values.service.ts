import { Injectable } from "@angular/core";

export interface Value { 
    question: string;
    answer: string;
}

@Injectable({
    providedIn: "root"
})

export class ValuesService {
    public values: Value[] = [];

    public getNewValue(): Value {
        return {question: "", answer:""};
    }

    public removeEmptyValues(): void {
        this.values = this.values.filter(value => value.question !== "" || value.answer !== "");
    }
}