import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    tfidf: TFIDF = {};
    languages: Array<string> = [];
    langscores: { [key: string]: number } = {};
    stopwords: Array<string> = [];
    stopwordRegex: RegExp = RegExp("");

    get likeliestLanguage(): string {
        let max = 0;
        let best: string = "Unable to classify";
        for (const lang of this.languages) {
            if (this.langscores[lang] > max) {
                max = this.langscores[lang];
                best = lang;
            }
        }
        return this.capitalize(best);
    }

    constructor(private http: HttpClient) {
        const futures = [
            this.get<TFIDF>(this.addrs.tfidf).then((res) => {
                this.tfidf = res;
                this.languages = Object.keys(res);
                for (const lang of this.languages) {
                    this.langscores[lang] = 0;
                }
            }),
            this.get<Array<string>>(this.addrs.stopwords).then((res) => {
                this.stopwords = res;
                this.stopwordRegex = RegExp("\\b(" + this.stopwords.join("|") + ")\\b", "gm");
            }),
        ];
        Promise.all(futures).then(() => {
            this.isLoading = false;
        });
    }

    public async get<T>(addr: string) {
        return this.http.get<T>(addr).toPromise();
    }

    public classify(text: string) {
        const words = text.split(" ");
        for (let lang of this.languages) {
            this.langscores[lang] = 0;
            for (let word of words) {
                this.langscores[lang] += this.tfidf[lang][word] ?? 0;
            }
        }
    }

    public capitalize(text: string): string {
        if (!text)
            return text;
        text = text.toLowerCase();
        return text[0].toUpperCase() + text.substr(1);
    }
}
