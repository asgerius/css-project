import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// { Language: { Word: TF-IDF } }
export interface TFIDF {
    [key: string]: { [key: string]: number };
}

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    private addr = "https://raw.githubusercontent.com/asgerius/css-project/master/data/tfidf.json";

    isLoading = true;
    tfidf: TFIDF | null = null;

    constructor(private http: HttpClient) {
        this.getTFIDF().then((res) => {
            this.tfidf = res;
            this.isLoading = false;
        });
    }

    public async getTFIDF() {
        return this.http.get<TFIDF>(this.addr).toPromise();
    }
}
