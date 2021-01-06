# ALkomprar FRONT

front for alkomprar app


## Getting Started
Download node.js LTS recommended 

* [Node.Js](https://nodejs.org/) - version LTS


### Installing

Must have Node.js y YARN

clone the project, download it and inside the project folder run:

```
yarn install
```

### Run application

Regardless of the environment in which the application runs,
it is necessary to configure the environment variables in the .env.{environment}.

I.E. If you want run in local environment, you need configure, the env.local file,
in this file you need set the super token (this is provided from backend project),
and the host where the backend project is running.


To start the application in local environment:

```
yarn start:local
```

When you want build in staging or production environment, you needs execute:
```
yarn build:staging

yarn build:production
```

### SASS & bootstrap

sass styles in 

```
src/styles
```

regular bootstrap 4 classNames for markup 

have fun!
