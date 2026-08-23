# CI/CD Pipeline
Deployments are managed by GitHub Actions. Every push to main triggers a full suite of unit and integration tests.

## Blue/Green
We utilize Blue/Green deployment to minimize downtime. The traffic router is Envoy proxy.

