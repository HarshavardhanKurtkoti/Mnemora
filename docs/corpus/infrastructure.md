# Cluster Management
The system runs on Kubernetes using EKS. The cluster auto-scales based on CPU utilization exceeding 70%.

## Databases
PostgreSQL is the primary relational database. Redis is used for caching and sidekiq queues.

