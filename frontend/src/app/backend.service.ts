import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ValuesService } from "./values.service";
import { StatisticsService } from "./statistics.service";

@Injectable({
    providedIn: "root"
})

export class BackendService {
    private apiUrl = 'http://localhost:3000/api/';

    public username:string|null;
    private password:string|null;
    public userId:number|null;
    public isLoggedIn:boolean = false;

    constructor(private httpClient:HttpClient, private valueService:ValuesService, private statsService:StatisticsService) {
        this.username = localStorage.getItem('username');
        this.password = localStorage.getItem('password');
        this.userId = Number(localStorage.getItem('userId'));

        if (this.username !== null && this.password !== null) {
            this.login(this.username, this.password)
                .then(() => {
                    this.isLoggedIn = true;
                })
                .catch(() => {
                    this.isLoggedIn = false;
                });
        }
    }

    signup(username: string, password: string): Promise<number> {
        const body = { username, password };
    
        return new Promise<number>((resolve, reject) => {
            this.httpClient.post<any>(this.apiUrl + "users/register", body).subscribe({
                next: (response) => {
                    console.log('Signup successful', response);

                    this.username = username;
                    this.password = password;
                    this.isLoggedIn = true;

                    localStorage.setItem('username', username);
                    localStorage.setItem('password', password);

                    resolve(response);
                },
                error: (error) => {
                    console.error('Signup failed', error);
                    reject(error.status);
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

                    resolve(response);
                },
                error: (error) => {
                    console.error('Login failed', error);
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