sequenceDiagram
    USER->>+MOTUS:POST /checkword  inputWord
    note left of MOTUS : calcul nb tentative + score

    MOTUS->>USER : result
    MOTUS->>+SCORE : POST /setscore {username, score, tries}
    SCORE->>REDIS : store {username, score, tries}
    REDIS->>SCORE : OK
    SCORE->>MOTUS : OK

flowchart LR
    user-->motus
    motus-->|getscore|score
    motus-->|setscore|score
    score-->redis
    
flowchart LR
    user-->motus
    motus-->|addscore user,  mot, +1 : isWordFound|score
    score-->redis
    
