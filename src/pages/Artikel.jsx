import { pdfjs } from "react-pdf"
// import SampelPdf from "../assets/sampel.pdf"
import PDFViewer from "../components/PDFViewer";

// Set worker URL to enable worker support (replace this with your own workerSrc)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// Path to your PDF file
const aktivitasFisik = '/A5-Buku-Aktivitas-Fisik.pdf';
const diabetesMellitus = '/Diabetes-Mellitus.pdf';
const manajemenDiet = '/MANAJEMEN-DIET.pdf';
const relaksiOtot = '/relaksasi-otot-progresif.pdf';
const senamKaki = '/Senam-kaki.pdf';
const terapiJalan = '/Terapi-Jalan-Kaki.pdf';
const makananHarian = '/A5-Buku-makanan-Harian.pdf';

function Artikel() {
  return (
    <div className="my-0 mx-auto min-h-full max-w-screen-sm bg-white">
        <div className="border-b-2 border-gray-400">
            <h2 className="text-xl font-bold px-4 py-4">Artikel</h2>
        </div>

        <div className="py-4 border-b-2 border-gray-400">
          <h2 className="px-4 font-semibold text-xl mb-4">Aktivitas Fisik</h2>
          <PDFViewer file={aktivitasFisik} scale={0.66} />
        </div>

        <div className="py-4 border-b-2 border-gray-400">
          <h2 className="px-4 font-semibold text-xl mb-4">Terapi Jalan Kaki</h2>
          <PDFViewer file={terapiJalan} scale={0.47} />
          {/* <Document file={terapiJalan} onLoadSuccess={onDocumentLoadSuccess} canvas={{ height: 600 }}>
            <Page scale={0.47} pageNumber={pageNumber}  />
          </Document>

          <div className="pt-5 px-4 flex justify-center gap-4">
            <p>Page {pageNumber} of {numPages} </p>
            <Button disabled={pageNumber <= 1} onClick={goToPrevPage}> Previous </Button>
            <Button disabled={pageNumber >= numPages} onClick={goToNextPage}> Next </Button>
          </div> */}
        </div>

        <div className="py-4 border-b-2 border-gray-400">
          <h2 className="px-4 font-semibold text-xl mb-4">Senam Kaki</h2>
          <PDFViewer file={senamKaki} scale={0.28} />
        </div>

        <div className="py-4 border-b-2 border-gray-400">
          <h2 className="px-4 font-semibold text-xl mb-4">Relaksi Otot</h2>
          <PDFViewer file={relaksiOtot} scale={0.46} />
        </div>

        <div className="py-4 border-b-2 border-gray-400">
          <h2 className="px-4 font-semibold text-xl mb-4">Diabetes Mellitusk</h2>
          <PDFViewer file={diabetesMellitus} scale={0.27} />
        </div>

        <div className="py-4 border-b-2 border-gray-400">
          <h2 className="px-4 font-semibold text-xl mb-4">Manajemen Diet</h2>
          <PDFViewer file={manajemenDiet} scale={0.3} />
        </div>

        <div className="py-4 border-b-2 border-gray-400 mb-20">
          <h2 className="px-4 font-semibold text-xl mb-4">Makanan Harian</h2>
          <PDFViewer file={makananHarian} scale={0.66} />
        </div>
    </div>
  )
}

export default Artikel