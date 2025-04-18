# MlbPicks

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

# Shutdown Heroku Servers
$ heroku ps:scale web=0 -a mlb-picks

# Start Heroku Servers
$ heroku ps:scale web=1 -a mlb-picks

## Run Heroku Logs when app doesn't work
$ heroku logs --tail -a mlb-picks

## Run Redis CLI from cmd w/ Unix
$ wsl
$ redis-cli -u redis://default:f1DYQKVzeL9dVvFw9ULp1Sro5w59g4NK@redis-12887.c239.us-east-1-2.ec2.redns.redis-cloud.com:12887

## To Kill Port already in use, run terminal in admin mode
$ netstat -ano | findstr :<PORT>
$ taskkill /PID <PID> /F
