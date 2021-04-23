from __future__ import annotations
import os
import sys
import datetime as dt
import json
import math
from typing import Any

import click
import pandas as pd
import stackapi
from pelutils import log, Levels
from tqdm import tqdm

# Fetch data from five years
DAY_INTERVAL = 7
START_DATE = dt.datetime(2015, 1, 1)
END_DATE = dt.datetime(2020, 1, 1)

SITE = stackapi.StackAPI("stackoverflow")
SITE.max_pages = 1
N_REQUESTS = math.ceil((END_DATE - START_DATE).days / DAY_INTERVAL)
assert N_REQUESTS < 300

def _get_by_nested_keys(d: dict, keys: list[str]) -> tuple[str, Any]:
    if len(keys) == 1:
        return d.get(keys[0])
    else:
        return _get_by_nested_keys(d[keys[0]], keys[1:])

def get_data(language: str) -> pd.DataFrame:

    os.makedirs(os.path.join("data", language), exist_ok=True)
    log.section("Getting data for %s from %s to %s" % (language, START_DATE.date(), END_DATE.date()-dt.timedelta(days=1)))
    log("Using %i requests" % N_REQUESTS)
    quota_remaing = 300
    questions = list()

    start, end = START_DATE, START_DATE + dt.timedelta(days=DAY_INTERVAL)
    for i in tqdm(range(N_REQUESTS)):
        # https://api.stackexchange.com/docs/questions#order=desc&min=20&sort=votes&tagged=python&filter=!1vKwrUXWvyD.TpY90UkpXYBdGop(leg63YHefbVAp1OvUVcr6gm(GFSV5lk6l3zSE8i&site=stackoverflow&run=true
        r = SITE.fetch(
            "questions",
            fromdate=start,
            todate=end,
            tagged=language,
            sort="creation",
            filter="!)PBt)ZX9Bm(JUgw*DM)sjdIE*XsapktUmLzYx2hZO*0Ucza8VQCedEvwmjgs5h_VvaGrwX",
        )
        quota_remaing = r["quota_remaining"]
        questions += r["items"]
        # Save fetched data
        with open(os.path.join("data", language, "response_%i.json" % i), "w") as f:
            json.dump(r["items"], f)

        start += dt.timedelta(days=DAY_INTERVAL)
        end += dt.timedelta(days=DAY_INTERVAL)
        if start >= END_DATE:
            break
        elif end > END_DATE:
            end = END_DATE

    log("Got %i responses" % len(questions), "Remaining quota: %i" % quota_remaing)

    # Save useful things from response
    log.section("Extracting useful data")
    useful_question_keys = { "title", "body", "view_count", "score", "creation_date", "link",
        "question_id", "owner/user_id", "owner/reputation" }
    useful_answer_keys = { "body", "creation_date", "score", "owner/user_id", "owner/reputation", "answer_id" }
    useful_comment_keys = useful_answer_keys
    filtered_questions, filtered_answers, filtered_comments = list(), list(), list()
    for _, q in tqdm(enumerate(questions)):
        filtered_questions.append({
            "language": language,
            **{ key: str(_get_by_nested_keys(q, key.split("/"))) for key in useful_question_keys if key in q or "/" in key }
        })
        for answer in q.get("answers", list()):
            filtered_answers.append({
                "language": language,
                "question_id": str(q["question_id"]),
                **{ key: str(_get_by_nested_keys(answer, key.split("/"))) for key in useful_answer_keys if key in answer or "/" in key }
            })
            for comment in answer.get("comments", list()):
                filtered_comments.append({
                    "language": language,
                    "question_id": str(q["question_id"]),
                    "answer_id": str(answer["answer_id"]),
                    **{ key: str(_get_by_nested_keys(comment, key.split("/"))) for key in useful_comment_keys if key in comment or "/" in key },
                })
        for comment in q.get("comments", list()):
            filtered_comments.append({
                "language": language,
                "question_id": str(q["question_id"]),
                **{ key: str(_get_by_nested_keys(comment, key.split("/"))) for key in useful_comment_keys if key in comment or "/" in key },
            })

    df = pd.DataFrame(filtered_questions)
    q_path = os.path.join("data", language, "questions.pkl")
    df.to_pickle(q_path)
    log("Saved %i questions to %s" % (len(df), q_path))
    del df

    df = pd.DataFrame(filtered_answers)
    a_path = os.path.join("data", language, "answers.pkl")
    df.to_pickle(a_path)
    log("Saved %i answers to %s" % (len(df), a_path))
    del df

    df = pd.DataFrame(filtered_comments)
    c_path = os.path.join("data", language, "comments.pkl")
    df.to_pickle(c_path)
    log("Saved %i comments to %s" % (len(df), c_path))
    del df


@click.command()
@click.argument("language")
def run(language: str):
    path = os.path.join("data", "%s-questions.pkl" % language)
    if os.path.exists(path):
        cont = log.bool_input(log.input("%s eksisterer allerede. Vil du fortsætte alligevel? [j/n] " % path), default=False)
        if not cont:
            sys.exit()
    get_data(language.lower())


if __name__ == "__main__":
    with log.log_errors:
        log.configure("local_data.log", "Fetching data", print_level=Levels.DEBUG)
        run()
