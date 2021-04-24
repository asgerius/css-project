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

    private addrs = {
        tfidf: "https://raw.githubusercontent.com/asgerius/css-project/master/data/tfidf.json",
        stopwords: "https://raw.githubusercontent.com/asgerius/css-project/master/data/stopwords.json",
    };

    isLoading = true;
    tfidf: TFIDF | null = null;
    stopwords: Array<string> = [];

    constructor(private http: HttpClient) {
        const futures = [
            this.get<TFIDF>(this.addrs.tfidf).then((res) => {
                this.tfidf = res;
            }),
            this.get<Array<string>>(this.addrs.stopwords).then((res) => {
                this.stopwords = res;
            }),
        ];
        Promise.all(futures).then(() => {
            this.isLoading = false;
        });
    }

    private async getData() {

    }

    public async get<T>(addr: string) {
        return this.http.get<T>(addr).toPromise();
    }
}
