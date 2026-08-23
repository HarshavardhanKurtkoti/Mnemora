import os
import uuid
from typing import List
from langchain_core.documents import Document
from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    UnstructuredMarkdownLoader,
    WebBaseLoader,
)

class DocumentLoaderService:
    @staticmethod
    def _add_metadata(docs: List[Document], source: str) -> List[Document]:
        """Add unique IDs and basic metadata to each document before chunking."""
        for doc in docs:
            # Use source as document_id for deterministic chunk tracking
            doc.metadata["document_id"] = source
            doc.metadata["source"] = source
            if "page" not in doc.metadata:
                doc.metadata["page"] = 0 # Default if not PDF
        return docs

    @staticmethod
    def load_pdf(file_path: str) -> List[Document]:
        loader = PyPDFLoader(file_path)
        docs = loader.load()
        return DocumentLoaderService._add_metadata(docs, source=os.path.basename(file_path))
        
    @staticmethod
    def load_markdown(file_path: str) -> List[Document]:
        loader = UnstructuredMarkdownLoader(file_path)
        docs = loader.load()
        return DocumentLoaderService._add_metadata(docs, source=os.path.basename(file_path))
        
    @staticmethod
    def load_text(file_path: str) -> List[Document]:
        loader = TextLoader(file_path)
        docs = loader.load()
        return DocumentLoaderService._add_metadata(docs, source=os.path.basename(file_path))
        
    @staticmethod
    def load_web(url: str) -> List[Document]:
        loader = WebBaseLoader(url)
        docs = loader.load()
        return DocumentLoaderService._add_metadata(docs, source=url)
        
    @classmethod
    def load_any(cls, file_path_or_url: str) -> List[Document]:
        if file_path_or_url.startswith("http"):
            return cls.load_web(file_path_or_url)
        
        ext = os.path.splitext(file_path_or_url)[1].lower()
        if ext == ".pdf":
            return cls.load_pdf(file_path_or_url)
        elif ext == ".md":
            return cls.load_markdown(file_path_or_url)
        elif ext == ".txt":
            return cls.load_text(file_path_or_url)
        else:
            raise ValueError(f"Unsupported file extension: {ext}")
