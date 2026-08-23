import os
import json
import shutil

CORPUS_DIR = "docs/corpus"
DATASET_PATH = "eval/dataset.json"

DOCUMENTS = {
    "authentication.md": [
        ("# Authentication Overview", "The Mnemora system uses OAuth 2.0 for all authentication processes. To authenticate, you must obtain a JWT from the authorization server."),
        ("## Rate Limiting", "Authentication endpoints are strictly rate limited to 10 requests per minute per IP to prevent brute force attacks.")
    ],
    "payment_gateway.md": [
        ("# Payment Processing", "We integrate with Stripe for processing payments. All transactions are securely transmitted using TLS 1.3."),
        ("## Refunds", "Refunds must be requested within 30 days of the transaction. The Stripe webhook handles the asynchronous refund fulfillment.")
    ],
    "user_management.md": [
        ("# User Roles", "Mnemora supports three roles: Admin, Editor, and Viewer. Admins have unrestricted access. Editors can modify content. Viewers have read-only access."),
        ("## Data Deletion", "Users can request full data deletion under GDPR guidelines. This triggers a soft delete, permanently purged after 14 days.")
    ],
    "product_catalog.md": [
        ("# Inventory System", "The product catalog tracks inventory using SKUs. The SKU format is exactly 12 alphanumeric characters, starting with 'PRD-'."),
        ("## Categories", "Products are organized in a hierarchical tree. A product can belong to multiple leaf categories but only one root category.")
    ],
    "search_filtering.md": [
        ("# Search Architecture", "The platform uses Elasticsearch for full-text search. Queries are analyzed using a custom snowball stemmer."),
        ("## Facets", "Faceted navigation allows users to filter by price, brand, and rating. Facet counts are cached in Redis for 5 minutes.")
    ],
    "notification_system.md": [
        ("# Notifications", "The notification service routes messages via Email (SendGrid), SMS (Twilio), and Push (FCM)."),
        ("## Templates", "Message templates are written in Jinja2 and compiled at deployment time to minimize runtime latency.")
    ],
    "analytics_events.md": [
        ("# Event Tracking", "All user actions emit events to Kafka. Events must adhere to the Mnemora Event Schema v2."),
        ("## Dashboards", "Internal dashboards query ClickHouse. Data is aggregated hourly for fast time-series visualization.")
    ],
    "file_uploads.md": [
        ("# Upload Process", "Files are uploaded directly to AWS S3 using presigned URLs. The maximum file size limit is 50MB for standard users."),
        ("## Chunking", "Files larger than 10MB are uploaded via S3 multipart upload in 5MB chunks to ensure reliability over poor connections.")
    ],
    "webhooks.md": [
        ("# Webhook Delivery", "Webhooks are sent with a 5-second timeout. If a delivery fails, the system uses exponential backoff for up to 3 retries."),
        ("## Security Signatures", "Each webhook payload includes an HMAC-SHA256 signature in the 'X-Mnemora-Signature' header to verify authenticity.")
    ],
    "infrastructure.md": [
        ("# Cluster Management", "The system runs on Kubernetes using EKS. The cluster auto-scales based on CPU utilization exceeding 70%."),
        ("## Databases", "PostgreSQL is the primary relational database. Redis is used for caching and sidekiq queues.")
    ],
    "deployment.md": [
        ("# CI/CD Pipeline", "Deployments are managed by GitHub Actions. Every push to main triggers a full suite of unit and integration tests."),
        ("## Blue/Green", "We utilize Blue/Green deployment to minimize downtime. The traffic router is Envoy proxy.")
    ],
    "api_rate_limits.md": [
        ("# Throttling", "Standard API endpoints are rate limited to 1000 requests per hour. The headers 'X-RateLimit-Limit' and 'X-RateLimit-Remaining' are returned."),
        ("## Enterprise Plans", "Enterprise users have custom rate limits ranging up to 10,000 requests per minute. Contact sales to upgrade.")
    ]
}

def generate_corpus():
    if os.path.exists(CORPUS_DIR):
        shutil.rmtree(CORPUS_DIR)
    os.makedirs(CORPUS_DIR)
    
    for filename, chunks in DOCUMENTS.items():
        content = ""
        for title, body in chunks:
            content += f"{title}\n{body}\n\n"
        with open(os.path.join(CORPUS_DIR, filename), "w") as f:
            f.write(content)

def generate_dataset():
    # Because each document has exactly 2 markdown headers, 
    # the MarkdownHeaderTextSplitter will output 2 chunks per doc.
    # Therefore, chunk 0 corresponds to the first header, chunk 1 to the second.
    
    questions = []
    
    # 1. Factual Questions (Direct mapping to one chunk)
    questions.extend([
        {"id": "f_1", "question": "What authentication protocol does Mnemora use?", "expected_chunks": ["authentication.md_0"], "category": "factual"},
        {"id": "f_2", "question": "What is the SKU format for products?", "expected_chunks": ["product_catalog.md_0"], "category": "factual"},
        {"id": "f_3", "question": "What database is used for caching?", "expected_chunks": ["infrastructure.md_1"], "category": "factual"},
        {"id": "f_4", "question": "How long is the webhook delivery timeout?", "expected_chunks": ["webhooks.md_0"], "category": "factual"},
        {"id": "f_5", "question": "What is the maximum file upload size for standard users?", "expected_chunks": ["file_uploads.md_0"], "category": "factual"},
        {"id": "f_6", "question": "Who provides the Email routing service?", "expected_chunks": ["notification_system.md_0"], "category": "factual"},
        {"id": "f_7", "question": "How many requests per minute are allowed for authentication?", "expected_chunks": ["authentication.md_1"], "category": "factual"},
        {"id": "f_8", "question": "What CPU utilization triggers auto-scaling?", "expected_chunks": ["infrastructure.md_0"], "category": "factual"},
        {"id": "f_9", "question": "What signature algorithm verifies webhooks?", "expected_chunks": ["webhooks.md_1"], "category": "factual"},
        {"id": "f_10", "question": "What handles refunds asynchronously?", "expected_chunks": ["payment_gateway.md_1"], "category": "factual"}
    ])

    # 2. Exact Keyword Questions
    questions.extend([
        {"id": "k_1", "question": "What is TLS 1.3 used for?", "expected_chunks": ["payment_gateway.md_0"], "category": "exact_keyword"},
        {"id": "k_2", "question": "What happens under GDPR guidelines?", "expected_chunks": ["user_management.md_1"], "category": "exact_keyword"},
        {"id": "k_3", "question": "What uses X-Mnemora-Signature?", "expected_chunks": ["webhooks.md_1"], "category": "exact_keyword"},
        {"id": "k_4", "question": "How is ClickHouse utilized?", "expected_chunks": ["analytics_events.md_1"], "category": "exact_keyword"},
        {"id": "k_5", "question": "What does Envoy proxy do?", "expected_chunks": ["deployment.md_1"], "category": "exact_keyword"},
        {"id": "k_6", "question": "What is the X-RateLimit-Remaining header?", "expected_chunks": ["api_rate_limits.md_0"], "category": "exact_keyword"},
        {"id": "k_7", "question": "What language uses Jinja2?", "expected_chunks": ["notification_system.md_1"], "category": "exact_keyword"},
        {"id": "k_8", "question": "What size is the multipart upload chunk?", "expected_chunks": ["file_uploads.md_1"], "category": "exact_keyword"},
        {"id": "k_9", "question": "What is Kafka used for?", "expected_chunks": ["analytics_events.md_0"], "category": "exact_keyword"},
        {"id": "k_10", "question": "What does a snowball stemmer do?", "expected_chunks": ["search_filtering.md_0"], "category": "exact_keyword"}
    ])

    # 3. Semantic Questions (Requires understanding meaning, different vocabulary)
    questions.extend([
        {"id": "s_1", "question": "Which messaging queues or brokers does the backend rely on to emit user actions?", "expected_chunks": ["analytics_events.md_0"], "category": "semantic"},
        {"id": "s_2", "question": "Can people read data without being able to change it?", "expected_chunks": ["user_management.md_0"], "category": "semantic"},
        {"id": "s_3", "question": "If I want to return a purchased item, what is the time limit?", "expected_chunks": ["payment_gateway.md_1"], "category": "semantic"},
        {"id": "s_4", "question": "Is it possible for a single item to exist in several bottom-level groupings at once?", "expected_chunks": ["product_catalog.md_1"], "category": "semantic"},
        {"id": "s_5", "question": "How does the system ensure traffic isn't overwhelmed by a single user across standard endpoints?", "expected_chunks": ["api_rate_limits.md_0"], "category": "semantic"},
        {"id": "s_6", "question": "What happens if a notification payload fails to reach the receiving server on the first try?", "expected_chunks": ["webhooks.md_0"], "category": "semantic"},
        {"id": "s_7", "question": "Are messages generated dynamically or compiled beforehand to improve speed?", "expected_chunks": ["notification_system.md_1"], "category": "semantic"},
        {"id": "s_8", "question": "Where do users store their profile pictures and large assets?", "expected_chunks": ["file_uploads.md_0"], "category": "semantic"},
        {"id": "s_9", "question": "Does the search engine store filtering criteria temporarily?", "expected_chunks": ["search_filtering.md_1"], "category": "semantic"},
        {"id": "s_10", "question": "How are new features pushed to production without breaking the live app?", "expected_chunks": ["deployment.md_1"], "category": "semantic"}
    ])

    # 4. Multi-document Questions (Information spans across different docs)
    questions.extend([
        {"id": "md_1", "question": "What databases or data stores does Mnemora use in total?", "expected_chunks": ["infrastructure.md_1", "search_filtering.md_0", "analytics_events.md_1"], "category": "multi_document"},
        {"id": "md_2", "question": "What caching technologies are mentioned across the platform?", "expected_chunks": ["infrastructure.md_1", "search_filtering.md_1"], "category": "multi_document"},
        {"id": "md_3", "question": "What third-party SaaS services are integrated for communications and payments?", "expected_chunks": ["notification_system.md_0", "payment_gateway.md_0"], "category": "multi_document"},
        {"id": "md_4", "question": "How does rate limiting apply to both authentication and general API endpoints?", "expected_chunks": ["authentication.md_1", "api_rate_limits.md_0"], "category": "multi_document"},
        {"id": "md_5", "question": "What handles background queues and where are they executed?", "expected_chunks": ["infrastructure.md_1", "analytics_events.md_0"], "category": "multi_document"},
        {"id": "md_6", "question": "How does data get from an event emission to the internal dashboard?", "expected_chunks": ["analytics_events.md_0", "analytics_events.md_1"], "category": "multi_document"},
        {"id": "md_7", "question": "What happens from a push to main up to blue/green routing?", "expected_chunks": ["deployment.md_0", "deployment.md_1"], "category": "multi_document"},
        {"id": "md_8", "question": "What limits apply to large files and regular API endpoints?", "expected_chunks": ["file_uploads.md_0", "api_rate_limits.md_0"], "category": "multi_document"},
        {"id": "md_9", "question": "What security mechanisms exist for payments and webhooks?", "expected_chunks": ["payment_gateway.md_0", "webhooks.md_1"], "category": "multi_document"},
        {"id": "md_10", "question": "Are user deletions immediate and how are refunds processed?", "expected_chunks": ["user_management.md_1", "payment_gateway.md_1"], "category": "multi_document"}
    ])
    
    # 5. Multi-hop Questions (Need A to find B)
    questions.extend([
        {"id": "mh_1", "question": "Since the search uses Elasticsearch, how long are facet counts cached?", "expected_chunks": ["search_filtering.md_1"], "category": "multi_hop"},
        {"id": "mh_2", "question": "Given the API uses OAuth 2.0, what is the rate limit for auth endpoints?", "expected_chunks": ["authentication.md_1"], "category": "multi_hop"},
        {"id": "mh_3", "question": "Since webhooks can retry 3 times, how long is the initial timeout?", "expected_chunks": ["webhooks.md_0"], "category": "multi_hop"},
        {"id": "mh_4", "question": "For files larger than 10MB, what is the chunk upload size?", "expected_chunks": ["file_uploads.md_1"], "category": "multi_hop"},
        {"id": "mh_5", "question": "Given Enterprise plans have custom limits, what is the standard limit?", "expected_chunks": ["api_rate_limits.md_0"], "category": "multi_hop"},
        {"id": "mh_6", "question": "Since EKS is used, what triggers the auto-scaling?", "expected_chunks": ["infrastructure.md_0"], "category": "multi_hop"},
        {"id": "mh_7", "question": "Because Admins have unrestricted access, what can Editors do?", "expected_chunks": ["user_management.md_0"], "category": "multi_hop"},
        {"id": "mh_8", "question": "Given that Stripe processes payments, when must refunds be requested?", "expected_chunks": ["payment_gateway.md_1"], "category": "multi_hop"},
        {"id": "mh_9", "question": "Since Jinja2 is used for templates, what routes SMS messages?", "expected_chunks": ["notification_system.md_0"], "category": "multi_hop"},
        {"id": "mh_10", "question": "Because SKUs are 12 characters, what prefix do they start with?", "expected_chunks": ["product_catalog.md_0"], "category": "multi_hop"}
    ])

    # 6. No-answer Questions
    questions.extend([
        {"id": "na_1", "question": "What is the capital of France?", "expected_chunks": [], "category": "no_answer"},
        {"id": "na_2", "question": "How do I configure Microsoft SQL Server?", "expected_chunks": [], "category": "no_answer"},
        {"id": "na_3", "question": "What are the names of the founders?", "expected_chunks": [], "category": "no_answer"},
        {"id": "na_4", "question": "Can I use PayPal instead of Stripe?", "expected_chunks": [], "category": "no_answer"},
        {"id": "na_5", "question": "What is the specific IP address of the Elasticsearch cluster?", "expected_chunks": [], "category": "no_answer"},
        {"id": "na_6", "question": "How do I write a custom CSS theme for the frontend?", "expected_chunks": [], "category": "no_answer"},
        {"id": "na_7", "question": "What is the billing cycle for the Enterprise plan?", "expected_chunks": [], "category": "no_answer"},
        {"id": "na_8", "question": "How do I deploy to Azure AKS?", "expected_chunks": [], "category": "no_answer"},
        {"id": "na_9", "question": "What version of Kafka is required?", "expected_chunks": [], "category": "no_answer"},
        {"id": "na_10", "question": "Are there any desktop applications available?", "expected_chunks": [], "category": "no_answer"}
    ])

    for q in questions:
        if not q.get("expected_answer"):
            if q["category"] == "no_answer":
                q["expected_answer"] = "I couldn't find sufficient information in the provided documents to answer this question."
            else:
                q["expected_answer"] = "Auto-generated question for retrieval evaluation."
                
    with open(DATASET_PATH, "w") as f:
        json.dump(questions, f, indent=2)
    return questions

if __name__ == "__main__":
    generate_corpus()
    questions = generate_dataset()
    print(f"Generated {len(DOCUMENTS)} documents in {CORPUS_DIR} and {len(questions)} questions in {DATASET_PATH}")
