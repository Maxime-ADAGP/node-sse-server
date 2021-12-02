# Node.js SSE Server
Ce projet consiste en deux implémentations d'un serveur SSE
(**S**erver-**S**ent **E**vents) en Node.js via Express,
l'un permettant d'ajouter des données et de les publier,
l'autre affichant simplement une date toutes les secondes.

Dans les deux cas, la seule dépendance est express :
```console
$ npm install express
```
Il suffit ensuite de démarrer le serveur souhaité :
```console
$ node server.js
```
ou
```console
$ node server-data.js
```

## `server.js`
Ce fichier contient une implémentation d'un serveur SSE publiant
une date toutes les secondes à ses clients.  
Le serveur est disponible sur le port 3000

### Endpoints disponibles
- `GET /status`: retourne le nombre de clients actuellement connectés
- `GET /events`: renvoie un flux SSE envoyant la date actuelle toutes les
secondes

## `server-data.js`
Ce fichier contient une implémentation d'un serveur SSE plus complexe
que le précédent. Il contient un tableau `facts` qui stockera des données
qu'on lui a fourni via des requêtes POST. 
Le serveur est disponible sur le port 3001

### Endpoints disponibles
- `GET /status`: retourne le nombre de clients actuellement connectés
- `POST /fact`: ajoute l'objet JSON envoyé en corps dans le tableau `facts`
et l'envoie aux clients suivant déjà le flux SSE
- `GET /events`: renvoie un flux SSE qui envoie en première réponse le
contenu de `facts` et enverra ensuite le contenu ajouté à mesure qu'il est
reçu par le serveur

