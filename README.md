# Node.js SSE Server

Ce projet consiste en une implémentation d'un serveur SSE
(**S**erver-**S**ent **E**vents) en Node.js via Express,
permettant d'ajouter des données et de les publier.

Ce projet contient une implémentation
d'un serveur express fournissant des routes SSE,
disponible sur le port 3000 par défaut.

En particulier, il s'appuie sur le paquet
[`sse-pubsub`](https://www.npmjs.com/package/sse-pubsub)
comme interface simplifiant l'implémentation des SSE côté serveur.

## Installation

Ce projet dépend de Node.js.
Pour installer les dépendances, nous utilisons NPM :

```console
npm install
```

## Utilisation

Il suffit de démarrer le serveur souhaité :

```console
node start
```

Le démarrage du serveur expose une API,
dont la documentation
