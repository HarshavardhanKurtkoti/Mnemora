# Upload Process
Files are uploaded directly to AWS S3 using presigned URLs. The maximum file size limit is 50MB for standard users.

## Chunking
Files larger than 10MB are uploaded via S3 multipart upload in 5MB chunks to ensure reliability over poor connections.

