# Node.js SSE Server

Ce projet consiste en une implémentation d'un serveur SSE
(**S**erver-**S**ent **E**vents) en Node.js via Express,
permettant d'ajouter des données et de les publier.

Dans les deux cas, la seule dépendance est express :

```console
npm install express
```

Il suffit ensuite de démarrer le serveur souhaité :

```console
node server.js
```

ou

```console
node server-data.js
```

## `server.js`

Ce fichier contient une implémentation d'un serveur express
fournissant des routes SSE, disponible sur le port 3000 par défaut.

En particulier, il s'appuie sur le paquet
[`sse-pubsub`](https://www.npmjs.com/package/sse-pubsub)
comme interface simplifiant l'utilisation des SSE.
