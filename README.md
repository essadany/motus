sequenceDiagram
    USER->>+MOTUS:POST /checkword  inputWord
    note left of MOTUS : calcul nb tentative + score

    MOTUS->>USER : result
    MOTUS->>+SCORE : POST /setscore {username, score, tries}
    SCORE->>REDIS : store {username, score, tries}
    REDIS->>SCORE : OK
    SCORE->>MOTUS : OK
