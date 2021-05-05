import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as Plotly from 'plotly.js';

// { Language: { Word: TF-IDF } }
export interface TFIDF {
    [key: string]: { [key: string]: number };
}

export interface Validation {
    number_of_words: Array<number>;
    accs: Array<number>;
    f1s: Array<number>;
}

export interface SentCorr {
    belovedness: Array<number>;
    mean_sent: Array<number>;
    a: number;
    b: number;
}

export interface SentDist {
    sent: Array<number>;
    prob: Array<number>;
}

export interface Degdist {
    in_hist: Array<number>;
    x_in: Array<number>;
    out_hist: Array<number>;
    x_out: Array<number>;
}


@Injectable({
    providedIn: 'root'
})
export class CommonService {

    private addrs = {
        tfidf: "https://raw.githubusercontent.com/asgerius/css-project/master/data/tfidf.json",
        stopwords: "https://raw.githubusercontent.com/asgerius/css-project/master/data/stopwords.json",
        validation: "https://raw.githubusercontent.com/asgerius/css-project/master/data/accs_f1.json",
        sentcorr: "https://raw.githubusercontent.com/asgerius/css-project/master/data/sentcorr.json",
        sentdist: "https://raw.githubusercontent.com/asgerius/css-project/master/data/sentdist.json",
        degdist: "https://raw.githubusercontent.com/asgerius/css-project/master/degreeplots/so_graph_degreehist.json",
    };

    isLoading = true;
    tfidf: TFIDF = {};
    languages: Array<string> = [];
    langscores: { [key: string]: number } = {};
    total: number = 0;
    stopwords: Array<string> = [];
    stopwordRegex: RegExp = RegExp("");

    validation: Validation | null = null;
    sentcorr: SentCorr | null = null;
    sentdist: SentDist | null = null;
    degdist: Degdist | null = null;

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
            this.get<Array<string>>(this.addrs.stopwords).then(res => {
                this.stopwords = res;
                this.stopwordRegex = RegExp("\\b(" + this.stopwords.join("|") + ")\\b", "gm");
            }),
            this.get<Validation>(this.addrs.validation).then(res => {
                this.validation = res;
            }),
            this.get<SentCorr>(this.addrs.sentcorr).then(res => {
                this.sentcorr = res;
            }),
            this.get<SentDist>(this.addrs.sentdist).then(res => {
                this.sentdist = res;
            }),
            this.get<Degdist>(this.addrs.degdist).then(res => {
                this.degdist = res;
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
        this.total = 0;
        const words = text.split(" ");
        for (let lang of this.languages) {
            this.langscores[lang] = 0;
            for (let word of words) {
                this.langscores[lang] += this.tfidf[lang][word] ?? 0;
            }
            this.total += Math.pow(this.langscores[lang], 2);
        }
    }

    public getHslColour(language: string): string | null {
        let score = 200 * Math.pow(this.langscores[language], 2) / this.total;
        if (score > 120)
            score = 120;
        else if (isNaN(score))
            return null;
        return `hsl(${score}, 100%, 50%)`;
    }

    public capitalize(text: string): string {
        if (!text)
            return text;
        text = text.toLowerCase();
        return text[0].toUpperCase() + text.substr(1);
    }
}
