#Phase d'authentification
```mermaid
sequenceDiagram
    USER->>AUTHENTIFICATION:POST /register
    AUTHENTIFICATION->>REDIS_AUTH: check if the username isn't already exits in redis then store {firstname, lastname, username, passwrod}
    REDIS_AUTH->>AUTHENTIFICATION:OK
    AUTHENTIFICATION->>+USER:OK
    note right of USER : if user is not in redis database
    USER->>+AUTHENTIFICATION: POST /login
    AUTHENTIFICATION->>REDIS_AUTH: verify if the username and password are correct
    AUTHENTIFICATION->>USER:OK
    note left of AUTHENTIFICATION: create a session and store username
```
#Phase de jeux
```mermaid
sequenceDiagram
    USER->>+MOTUS:POST /checkword  inputWord
    note right of MOTUS : calcul nb tentative(tries) + score
    MOTUS->>USER : result
    note left of MOTUS: verify if the session exists (user authentified) then get the username from the session
    MOTUS->>+SCORE : POST /setscore {username, score, tries}
    SCORE->>REDIS_SCOORE : store {username, score, tries}
    REDIS_SCORE->>SCORE : OK
    SCORE->>MOTUS : OK
```
#Phase de visualisation du score
```mermaid
sequenceDiagram
    SCORE->>+REDIS_SCORE : GET /getscore
    REDIS_SCORE->>SCORE : OK
```
flowchart LR
    user-->motus
    motus-->|getscore|score
    motus-->|setscore|score
    score-->redis
![MOTUS_SCORE](https://github.com/essadany/motus/assets/100642085/7fb9f715-2294-496e-9634-0d004f288e88)
