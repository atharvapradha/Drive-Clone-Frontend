import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PreviewModal({ file, onClose }) {
  const [textContent, setTextContent] = useState("");
  const [numPages, setNumPages] = useState(null);

  // Load text content if file is plain text
  useEffect(() => {
    if (file?.type?.startsWith("text")) {
      fetch(file.downloadUrl)
        .then((res) => res.text())
        .then(setTextContent)
        .catch(() => setTextContent("Unable to load text file."));
    }
  }, [file]);

  if (!file) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-4 max-w-4xl w-full h-[85vh] overflow-auto relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-200 px-3 py-1 rounded-full hover:bg-gray-300"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4 truncate">{file.name}</h2>

        {/* Preview by type */}
        {file.type?.startsWith("image") && (
          <img
            src={file.downloadUrl}
            alt={file.name}
            className="max-h-[70vh] max-w-full mx-auto rounded border"
          />
        )}

        {file.type?.includes("pdf") && (
          <div className="flex flex-col items-center">
            <Document
              file={file.downloadUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={<p>Loading PDF...</p>}
            >
              {Array.from(new Array(numPages), (_, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  className="mb-4 shadow border"
                />
              ))}
            </Document>
          </div>
        )}

        {file.type?.startsWith("text") && (
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded max-h-[70vh] overflow-y-auto border">
            {textContent}
          </pre>
        )}

        {/* If unsupported type */}
        {!file.type?.startsWith("image") &&
          !file.type?.includes("pdf") &&
          !file.type?.startsWith("text") && (
            <p className="text-gray-600">Preview not available for this file type.</p>
          )}
      </div>
    </div>
  );
}
