from __future__ import annotations
import os
import sys
import datetime as dt
import math
from typing import Any

import click
import pandas as pd
import stackapi
from pelutils import log, Levels
from tqdm import tqdm

# Fetch data from five years
DAY_INTERVAL = 14
START_DATE = dt.datetime(2010, 1, 1)
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
    log.section("Getting data for %s from %s to %s" % (language, START_DATE.date(), END_DATE.date()-dt.timedelta(days=1)))
    quota_remaing = 300
    questions = list()

    start, end = START_DATE, START_DATE + dt.timedelta(days=DAY_INTERVAL)
    for i in log.tqdm(tqdm(range(N_REQUESTS))):
        # https://api.stackexchange.com/docs/questions#order=desc&min=20&sort=votes&tagged=python&filter=!*SU8CGYZitCB.D*(BDVIfh2KKqQ)7jqYCBJzAPqv1FF5P6ymFq8a9Bc8edtQc*PqJ)28g05P&site=stackoverflow&run=true
        r = SITE.fetch(
            "questions",
            fromdate=start,
            todate=end,
            tagged=language,
            sort="creation",
            filter="!1vKwrUXWvyD.TpY90UkpXYBdGop(leg63YHefbVAp1OvUVcr6gm(GFSV5lk6l3zSE8i",
        )
        log.debug(
            "Made %i / %i requests. Received %i items" % (i+1, N_REQUESTS, len(r["items"])),
            "Remaining quota: %i" % r["quota_remaining"],
        )
        quota_remaing = r["quota_remaining"]
        questions += r["items"]

        start += dt.timedelta(days=DAY_INTERVAL)
        end += dt.timedelta(days=DAY_INTERVAL)
        if start >= END_DATE:
            break
        elif end > END_DATE:
            end = END_DATE
    log("Got %i responses" % len(questions), "Remaining quota: %i" % quota_remaing)

    log.section("Filtering questions")
    os.makedirs("data", exist_ok=True)
    # Save useful things from response
    useful_question_keys = { "title", "body", "view_count", "score", "creation_date", "link",
        "question_id", "owner/user_id", "owner/reputation" }
    filtered_questions = [
        {
            "language": language,
            **{ key: str(_get_by_nested_keys(q, key.split("/"))) for key in useful_question_keys if key in q or "/" in key },
        }
        for q in tqdm(questions)
    ]
    df = pd.DataFrame(filtered_questions)
    del filtered_questions
    q_path = os.path.join("data", "%s-questions.pkl" % language)
    df.to_pickle(q_path)
    log("Saved %i questions to %s" % (len(df), q_path))
    del df

    log.section("Filtering answers")
    useful_answer_keys = { "body", "creation_date", "score", "owner/user_id", "owner/reputation" }
    filtered_answers = [
        {
            "language": language,
            "question_id": q["question_id"],
            **{ key: str(_get_by_nested_keys(answer, key.split("/"))) for key in useful_answer_keys if key in answer or "/" in key },
        }
        for q in tqdm(questions) if "answers" in q
        for answer in q["answers"]
    ]
    df = pd.DataFrame(filtered_answers)
    del filtered_answers
    a_path = os.path.join("data", "%s-answers.pkl" % language)
    df.to_pickle(a_path)
    log("Saved %i answers to %s" % (len(df), a_path))
    del df

    log.section("Filtering comments")
    useful_comment_keys = useful_answer_keys
    filtered_comments = [
        {
            "language": language,
            "question_id": q["question_id"],
            **{ key: str(_get_by_nested_keys(comment, key.split("/"))) for key in useful_comment_keys if key in comment or "/" in key },
        }
        for q in tqdm(questions) if "comments" in q
        for comment in q["comments"]
    ]
    df = pd.DataFrame(filtered_comments)
    del filtered_comments
    c_path = os.path.join("data", "%s-comments.pkl" % language)
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
