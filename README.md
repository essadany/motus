#Phase d'authentification
```mermaid
sequenceDiagram
    USER->>AUTHENTIFICATION:POST /register
    AUTHENTIFICATION->>REDIS: store {username, passwrod, score : 0, tries:0}
    REDIS->>AUTHENTIFICATION:OK
    AUTHENTIFICATION->>+USER:OK
    note right of USER : if user is not in redis database
    USER->>+AUTHENTIFICATION: POST /login
    AUTHENTIFICATION->>USER:OK
    AUTHENTIFICATION->>+LOCALSTORAGE : setLocalStorage(username)
```
#Phase de jeux
```mermaid
sequenceDiagram
    MOTUS->>+LOCALSTORAGE : GET /
    note left of LOCALSTORAGE : get the username to identify the user
    LOCALSTORAGE->>MOTUS: username
    USER->>+MOTUS:POST /checkword  inputWord
    note right of MOTUS : calcul nb tentative + score
    MOTUS->>USER : result
    MOTUS->>+SCORE : POST /setscore {username, score, tries}
    SCORE->>REDIS : store {username, score, tries}
    REDIS->>SCORE : OK
    SCORE->>MOTUS : OK
```
#Phase de visualisation du score
```mermaid
sequenceDiagram
    SCORE->>+LOCALSTORAGE : GET /
    note left of LOCALSTORAGE : get the username to identify the user
    LOCALSTORAGE->>SCORE: username
    SCORE->>+REDIS : GET /getscore
    REDIS->>SCORE : OK
```
flowchart LR
    user-->motus
    motus-->|getscore|score
    motus-->|setscore|score
    score-->redis
    
flowchart LR
    user-->motus
    motus-->|addscore user,  mot, +1 : isWordFound|score
    score-->redis
    
