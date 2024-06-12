import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

export interface Collection {
    name: string;
    values: Value[];
    wordsCorrect:number;
    avgWpm:number|undefined;
    bestWpm:number|undefined;
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
    public selectedCollection!: Collection;

    private onSelectedCollectionChangeSource = new Subject<void>();

    constructor() {
        this.changeSelectedCollection(this.addCollection());
    }

    public onSelectedCollectionChange = this.onSelectedCollectionChangeSource.asObservable();

    public changeSelectedCollection(collection:Collection): void {
        this.selectedCollection = collection;
        this.onSelectedCollectionChangeSource.next();
    }

    public addCollection():Collection {
        const newCollection:Collection = {
            name: `Collection ${this.collections.length + 1}`, 
            values: [this.getNewValue()],
            wordsCorrect: 0,
            avgWpm: undefined,
            bestWpm: undefined
        };
        this.collections.push(newCollection);
        return newCollection;
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

    public getRandomValue(): Value {
        return this.selectedCollection.values[Math.floor(Math.random() * this.selectedCollection.values.length)];
    }

    public allowSpaceToSubmit(): boolean {
        // No answers can contain spaces
        for (const value of this.selectedCollection.values) {
            if (value.answer.includes(" ")) {
                return false;
            }
        }
        return true;
    }

    public getWpm(answerLength:number, elapsedTime:number):number {
        // Assuming 5 characters per word
        const words = answerLength / 5;
        const minutes = elapsedTime / 60000;
        return words / minutes;
      }
    
    public updateWpm(answerLength:number, elapsedTime:number):void {
        let wpm:number = this.getWpm(answerLength, elapsedTime);

        if (this.selectedCollection.avgWpm === undefined) {
            this.selectedCollection.avgWpm = 0;
        }
        if (this.selectedCollection.bestWpm === undefined) {
            this.selectedCollection.bestWpm = 0;
        }
    
        this.selectedCollection.avgWpm = (this.selectedCollection.avgWpm * this.selectedCollection.wordsCorrect + wpm) / (this.selectedCollection.wordsCorrect + 1);
        this.selectedCollection.wordsCorrect++;
        if (wpm > this.selectedCollection.bestWpm) {
        this.selectedCollection.bestWpm = wpm;
        }
    }
    
    public resetHistory():void {
        this.selectedCollection.wordsCorrect = 0;
        this.selectedCollection.avgWpm = 0;
    }
}