# Search Architecture
The platform uses Elasticsearch for full-text search. Queries are analyzed using a custom snowball stemmer.

## Facets
Faceted navigation allows users to filter by price, brand, and rating. Facet counts are cached in Redis for 5 minutes.

