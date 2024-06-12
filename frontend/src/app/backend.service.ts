import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Collection, ValuesService } from "./values.service";

interface FormattedCollection {
    collectionname: string;
    avgspeed: number|undefined;
    bestspeed: number|undefined;
    wordamount: number;
    userid: number;
    values?: FormattedValue[];
}
interface FormattedValue {
    word: string;
    answer: string;
}

@Injectable({
    providedIn: "root"
})

export class BackendService {
    private apiUrl = 'http://localhost:3000/api/';

    public username:string|null;
    private password:string|null;
    public userId:number|null;
    public isLoggedIn:boolean = false;

    constructor(private httpClient:HttpClient, private valueService:ValuesService) {
        this.username = localStorage.getItem('username');
        this.password = localStorage.getItem('password');
        this.userId = Number(localStorage.getItem('userId'));

        if (this.username !== null && this.password !== null) {
            this.login(this.username, this.password);
        }
    }

    signup(username: string, password: string): Promise<any> {
        const body = { username, password };
    
        return new Promise<any>((resolve, reject) => {
            this.httpClient.post<any>(this.apiUrl + "users/register", body).subscribe({
                next: (response) => {
                    console.log('Signup successful', response);

                    this.username = username;
                    this.password = password;
                    this.isLoggedIn = true;

                    localStorage.setItem('username', username);
                    localStorage.setItem('password', password);

                    for (let collection of this.valueService.collections) {
                        this.addCollection(collection);
                    }

                    resolve(response);
                },
                error: (error) => {
                    console.error('Signup failed', error);
                    reject(error);
                }
            });
        });
    }

    login(username: string, password: string): Promise<any> {
        const body = { username, password };
    
        return new Promise<any>((resolve, reject) => {
            this.httpClient.post<any>(this.apiUrl + "auth/login", body).subscribe({
                next: (response) => {
                    console.log('Login successful', response);

                    this.username = response._username;
                    this.password = response._password;
                    this.userId = response._userId;
                    this.isLoggedIn = true;

                    localStorage.setItem('username', username);
                    localStorage.setItem('password', password);

                    this.loadCollections();

                    resolve(response);
                },
                error: (error) => {
                    console.error('Login failed', error);
                    reject(error);
                }
            });
        });
    }

    loadCollections(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.httpClient.get<any>(this.apiUrl + "collections/getAll/" + this.userId).subscribe({
                next: (response) => {
                    console.log('Values loaded', response);
                    for (let collection of response) {
                        const frontendFormattedCollection:Collection = {
                            name: collection.collectionname,
                            values: [],
                            wordsCorrect: collection.wordamount,
                            avgWpm: collection.avgspeed,
                            bestWpm: collection.bestspeed
                        };
                        this.valueService.collections.push(frontendFormattedCollection);
                    }
                    resolve(response);
                },
                error: (error) => {
                    console.error('Values loading failed', error);
                    reject(error);
                }
            });
        });
    }
    formatCollection(collection:Collection):FormattedCollection {
        if (this.userId === null) {
            throw new Error('User ID not set');
        }

        return {
            "collectionname": collection.name,
            "avgspeed": this.valueService.selectedCollection.avgWpm,
            "bestspeed": this.valueService.selectedCollection.bestWpm,
            "wordamount": this.valueService.selectedCollection.wordsCorrect,
            "userid": this.userId
        }
    }

    addCollection(collection:Collection): Promise<any> {
        const formattedCollection = this.formatCollection(collection);

        return new Promise<any>((resolve, reject) => {
            this.httpClient.post<any>(this.apiUrl + "collections/" + this.userId, formattedCollection).subscribe({
                next: (response) => {
                    console.log('Collection added', response);
                    resolve(response);
                },
                error: (error) => {
                    console.error('Collection adding failed', error);
                    reject(error);
                }
            });
        });
    }
    updateCollection(collection:Collection): Promise<any> {
        const formattedCollection = this.formatCollection(collection);

        return new Promise<any>((resolve, reject) => {
            this.httpClient.put<any>(this.apiUrl + "collections/" + this.userId, formattedCollection).subscribe({
                next: (response) => {
                    console.log('Collection updated', response);
                    resolve(response);
                },
                error: (error) => {
                    console.error('Collection updating failed', error);
                    reject(error);
                }
            });
        });
    }

    logout(): void {
        this.isLoggedIn = false;
        this.username = null;
        this.password = null;
        localStorage.removeItem('username');
        localStorage.removeItem('password');
    }

    deleteAccount(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.httpClient.delete<any>(this.apiUrl + "users/" + this.userId).subscribe({
                next: (response) => {
                    console.log('Account deleted', response);
                    this.logout();
                    resolve(response);
                },
                error: (error) => {
                    console.error('Account deletion failed', error);
                    reject(error);
                }
            });
        });
    }
}