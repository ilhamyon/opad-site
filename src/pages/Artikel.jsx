import { Document, Page, pdfjs } from "react-pdf"
import SampelPdf from "../assets/sampel.pdf"
import { useState } from "react";
import { Button } from "antd";

// Set worker URL to enable worker support (replace this with your own workerSrc)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// Path to your PDF file
const pdfUrl = '/sampel.pdf';

function Artikel() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const goToNextPage = () => {
    setPageNumber(prevPageNumber => prevPageNumber + 1);
  };

  const goToPrevPage = () => {
    setPageNumber(prevPageNumber => prevPageNumber - 1);
  };
  return (
    <div className="my-0 mx-auto min-h-full max-w-screen-sm bg-white">
        <div className="border-b-2 border-gray-400">
            <h2 className="text-xl font-bold px-4 py-4">Artikel</h2>
        </div>

        <div>
          {/* <embed
            src={`${pdfUrl}`}
            type="application/pdf"
            width="100%"
            height="540px"
            className="border-2 border-gray-200"
          /> */}
          {/* <iframe src="/sampel.pdf" width="100%" height="540px" /> */}
          <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} canvas={{ height: 600 }}>
            <Page scale={0.5} pageNumber={pageNumber}  />
          </Document>

          <div className="mb-16 py-10 px-4 flex justify-center gap-4">
            <p>Page {pageNumber} of {numPages} </p>
            <Button disabled={pageNumber <= 1} onClick={goToPrevPage}> Previous </Button>
            <Button disabled={pageNumber >= numPages} onClick={goToNextPage}> Next </Button>
          </div>
        </div>
    </div>
  )
}

export default Artikel