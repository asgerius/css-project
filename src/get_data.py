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
from pprint import pformat
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
    try:
        with open("key.txt") as f:
            key = f.read()
    except:
        key = None

    log.section("Getting data for %s from %s to %s" % (language, START_DATE.date(), END_DATE.date()))
    quota_remaing = 300
    questions = list()

    start, end = START_DATE, START_DATE + dt.timedelta(days=7)
    for i in log.tqdm(tqdm(range(N_REQUESTS))):
        # https://api.stackexchange.com/docs/questions#order=desc&min=20&sort=votes&tagged=python&filter=!*SU8CGYZitCB.D*(BDVIfh2KKqQ)7jqYCBJzAPqv1FF5P6ymFq8a9Bc8edtQc*PqJ)28g05P&site=stackoverflow&run=true
        r = SITE.fetch(
            "questions",
            key=key,
            fromdate=START_DATE,
            todate=END_DATE,
            tagged=language,
            sort="creation",
            filter="!1vKwrUXWvyD.TpY90UkpXYBdGop(leg63YHefbVAp1OvUVcr6gm(GFSV5lk6l3zSE8i",
        )
        log.debug("Made %i / %i requests. Received %i items" % (i+1, N_REQUESTS, len(r["items"])))
        quota_remaing = r["quota_remaining"]
        questions += r["items"]

        start += dt.timedelta(days=DAY_INTERVAL)
        end += dt.timedelta(days=DAY_INTERVAL)
        if start == END_DATE:
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
            **{ key: _get_by_nested_keys(q, key.split("/")) for key in q.keys() & useful_question_keys },
        }
        for q in tqdm(questions)
    ]
    df = pd.DataFrame(filtered_questions)
    del filtered_questions
    q_path = os.path.join("data", "%s-questions-%s.pkl" % (language, START_DATE.date()))
    df.to_pickle(q_path)
    log("Saved %i questions to %s" % (len(df), q_path))
    del df

    log.section("Filtering answers")
    useful_answer_keys = { "body", "creation_date", "score", "question_id", "owner/user_id", "owner/reputation" }
    filtered_answers = [
        {
            "language": language,
            "question_id": q["question_id"],
            **{ key: _get_by_nested_keys(answer, key.split("/")) for key in answer.keys() & useful_answer_keys },
        }
        for q in tqdm(questions)
        for answer in q["answers"] if "answers" in q
    ]
    df = pd.DataFrame(filtered_answers)
    del filtered_answers
    a_path = os.path.join("data", "%s-answers-%s.pkl" % (language, START_DATE.date()))
    df.to_pickle(a_path)
    log("Saved %i answers to %s" % (len(df), a_path))
    del df

    log.section("Filtering answers")
    useful_comment_keys = useful_answer_keys
    filtered_comments = [
        {
            "language": language,
            "question_id": q["question_id"],
            **{ key: _get_by_nested_keys(comment, key.split("/")) for key in comment.keys() & useful_comment_keys },
        }
        for q in tqdm(questions)
        for comment in q["comments"] if "comments" in q
    ]
    df = pd.DataFrame(filtered_comments)
    del filtered_comments
    c_path = os.path.join("data", "%s-comments-%s.pkl" % (language, START_DATE.date()))
    df.to_pickle(c_path)
    log("Saved %i comments to %s" % (len(df), c_path))
    del df



@click.command()
@click.argument("language")
def run(language: str):
    if os.path.exists(os.path.join("data", "%s-questions-%s.pkl")):
        cont = log.bool_input(log.input("%s eksisterer allerede. Vil du fortsætte alligevel? " % os.path.join("data", "%s-questions-%s.pkl")), default=False)
        if not cont:
            sys.exit()
    get_data(language.lower())


if __name__ == "__main__":
    with log.log_errors:
        log.configure("local_data.log", "Fetching data", print_level=Levels.DEBUG)
        run()
