# test-api

## How to Run

All you need is to run:

```bash
docker compose up --build
```

to run the application along with the database.

## Testing

I was unable to write integration and/or acceptance tests in time. I spent most of my time trying to get the solution to work instead of tests. If i had more time I would of written more tests.

I have some unit tests that work with `npm run test` for the validation logic. But didn't test anything with the database or the handler logic. I would have also tested for hanlder logic and for the database logic.

For integrationt testing I would only test the handlers while mocking out the database so it remains in scope of the tests. I would write some automated acceptance tests to call each endpoint to see if it all works. Maybe with something like supertest to test the api from e2e. Having the docker containers run while the tests are active.

## Observability

I would have metrics sent via a promethius library for node sent straight to Promethius. And use Grafana to display those metrics. Probably would use something like [prom-client](https://github.com/siimon/prom-client) to hook it all up. And maybe find a way to provide metrics from postgres as well.

For logging I would use Loki and I have pino installed to provide instrumentation for structured logs. I implemented some logging with pino to provide that structured logging with timestamps. I would maybe add some requestIds to those so you can follow each request in its logging.

## How I would get this on Kubernetes

This is all dockerized and ready for kubernetes. All we would need to do is push the `Dockerfile` build up to a container registry like dockerhub and make a Deployment of some kind like this for Kubernetes:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: customerapi
  labels:
    app: customerapi
spec:
  replicas: 1
  selector:
    matchLabels:
      app: customerapi
  template:
    metadata:
      labels:
        app: customerapi
    spec:
      containers:
      - name: customerapi
        image: username/customerapi:latest
        ports:
        - containerPort: 3000
```

also a service:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: customerapi-service
spec:
  selector:
    app: customerapi
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 3000
    targetPort: 3000
    nodePort: 31110
```

this will enable us to deploy to kubernetes.

But we could also utilize helm charts to do so as well and utilize ArgoCD to keep track of the tags to deploy the latest tag onto the cluster. That I don't have any idea how to do since its always been done for me, but it would be the direction I would go to over the first solution. We would also need to store some secrets somewhere for the app to load as environment variables.

## CI/CD Design

I would utilize github actions to run my CI/CD pipeline. I would write a install step, then a build step, then I would deploy the image.

Also, I would have a configurations for kubernetes watched by GitOps solutions like Flux or ArgoCD to ensure I get continous deployments.
