import uuid
from typing import List
import tiktoken
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter, MarkdownHeaderTextSplitter
from src.config.settings import settings

class ChunkingService:
    @staticmethod
    def tiktoken_len(text: str) -> int:
        # Get the tokenizer for the chosen OpenAI model, default to cl100k_base
        try:
            tokenizer = tiktoken.encoding_for_model(settings.LLM_MODEL_NAME)
        except KeyError:
            tokenizer = tiktoken.get_encoding("cl100k_base")
        return len(tokenizer.encode(text, disallowed_special=()))

    @staticmethod
    def chunk_documents(docs: List[Document]) -> List[Document]:
        """
        Splits documents into smaller chunks. 
        Tries to preserve Markdown structure if the source is Markdown, otherwise falls back to RecursiveCharacter.
        Uses tiktoken to ensure chunks respect token limits instead of character limits.
        """
        chunked_docs = []
        
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
            length_function=ChunkingService.tiktoken_len,
            separators=["\n\n", "\n", " ", ""]
        )
        
        # Define headers to split on for Markdown
        headers_to_split_on = [
            ("#", "Header 1"),
            ("##", "Header 2"),
            ("###", "Header 3"),
        ]
        markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers_to_split_on)

        for doc in docs:
            # Ensure metadata has page, even if null
            if "page" not in doc.metadata:
                doc.metadata["page"] = None
                
            source = doc.metadata.get("source", "")
            if source.endswith(".md"):
                # First split by headers
                md_splits = markdown_splitter.split_text(doc.page_content)
                
                # Then apply recursive character splitter with token counter
                for split in md_splits:
                    # preserve original metadata + new header metadata
                    merged_meta = {**doc.metadata, **split.metadata}
                    sub_chunks = text_splitter.split_text(split.page_content)
                    
                    for sub in sub_chunks:
                        new_doc = Document(page_content=sub, metadata=merged_meta.copy())
                        chunked_docs.append(new_doc)
            else:
                # Standard splitting
                sub_chunks = text_splitter.split_documents([doc])
                chunked_docs.extend(sub_chunks)
                
        # Final pass: add a unique chunk_id to every chunk
        for i, chunk in enumerate(chunked_docs):
            chunk.metadata["chunk_id"] = f"{chunk.metadata.get('document_id', 'unknown')}_{i}"
            
        return chunked_docs
