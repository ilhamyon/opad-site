import { Document, Page, pdfjs } from "react-pdf"
import SampelPdf from "../assets/sampel.pdf"

// Set worker URL to enable worker support (replace this with your own workerSrc)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// Path to your PDF file
const pdfUrl = '/sampel.pdf';

function Artikel() {
  return (
    <div className="my-0 mx-auto min-h-full max-w-screen-sm bg-white">
        <div className="border-b-2 border-gray-400">
            <h2 className="text-xl font-bold px-4 py-4">Artikel</h2>
        </div>

        <div className="px-4 py-6 flex justify-center">
          <embed
            src={`${pdfUrl}`}
            type="application/pdf"
            width="100%"
            height="540px"
            className="border-2 border-gray-200"
          />
          {/* <iframe src="/sampel.pdf" width="100%" height="500px" /> */}
          {/* <Document file={pdfUrl}>
            <Page pageNumber={3} />
          </Document> */}
        </div>
    </div>
  )
}

export default Artikel