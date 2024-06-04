import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { Button, Modal, Select, message } from "antd";
import JalanCepat from "../assets/jalancepat.mp3"
import JalanLambat from "../assets/jalanlambat.mp3"
import TerimaKasih from "../assets/terimakasih.mp3"
import TimerAudio from "../assets/timer.mp3"
import { sanityClient } from "../lib/sanity/getClient";
import moment from "moment";
const logo = '/OPAD-logo.png';

const { Option } = Select;

function Home() {
  const navigate = useNavigate();
  const opadId = (localStorage.getItem('opadId'));
  const opadUser = (localStorage.getItem('opadUser'));
  console.log('cek id user: ', opadId)

  useEffect(() => {
    // Check if the user is authenticated when the component mounts
    if (!isAuthenticated()) {
      // If not authenticated, redirect to the sign-in page
      message.error("Kamu belum login. Silahkan login terlebir dahulu!");
      navigate("/");
    }
  }, [navigate]);

  const [isLoading, setIsLoading] = useState(true);
  const [serverDataTekananDarah, setServerDataTekananDarah] = useState({
    data: [],
    error: null,
    loading: true,
  });

  async function fetchSanityDataTK() {
    try {
      setIsLoading(true);
      const sanityData = await sanityClient.fetch(`*[_type == 'opad-tekanandarah']{
        _id,
        sistole,
        diastole,
        date,
        user,
      }`);

      setServerDataTekananDarah({
        data: sanityData,
        error: null,
        loading: false,
      });
    } catch (error) {
      setServerDataTekananDarah({
        data: [],
        error: 'Error getting data. Please try again later.',
        loading: false,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const [serverDataGulaDarah, setServerDataGulaDarah] = useState({
    data: [],
    error: null,
    loading: true,
  });

  async function fetchSanityDataGD() {
    try {
      setIsLoading(true);
      const sanityData = await sanityClient.fetch(`*[_type == 'opad-guladarah']{
        _id,
        guladarah,
        date,
        user,
      }`);

      setServerDataGulaDarah({
        data: sanityData,
        error: null,
        loading: false,
      });
    } catch (error) {
      setServerDataGulaDarah({
        data: [],
        error: 'Error getting data. Please try again later.',
        loading: false,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const [serverDataIMT, setServerDataIMT] = useState({
    data: [],
    error: null,
    loading: true,
  });

  async function fetchSanityDataIMT() {
    try {
      setIsLoading(true);
      const sanityData = await sanityClient.fetch(`*[_type == 'opad-imt']{
        _id,
        tb,
        bb,
        date,
        user,
      }`);

      setServerDataIMT({
        data: sanityData,
        error: null,
        loading: false,
      });
    } catch (error) {
      setServerDataIMT({
        data: [],
        error: 'Error getting data. Please try again later.',
        loading: false,
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchSanityDataTK();
    fetchSanityDataGD();
    fetchSanityDataIMT();
  }, []);

  let dataSourceTK = [];
    if (serverDataTekananDarah && serverDataTekananDarah.data && serverDataTekananDarah.data.length > 0) {
      dataSourceTK = serverDataTekananDarah.data
      .filter(item => item.user?._ref === opadId)
      .sort((a, b) => moment(b.date) - moment(a.date))
      .map((item) => ({
        key: item._id,
        sistole: item.sistole,
        diastole: item.diastole,
        date: moment(item.date).format('MM/DD/YYYY') || "-"
      }));
    }
    console.log('cek data tekanan darah: ', dataSourceTK)

    let dataSourceGD = [];
    if (serverDataGulaDarah && serverDataGulaDarah.data && serverDataGulaDarah.data.length > 0) {
      dataSourceGD = serverDataGulaDarah.data
      .filter(item => item.user?._ref === opadId)
      .sort((a, b) => moment(b.date) - moment(a.date))
      .map((item) => ({
        key: item._id,
        guladarah: item.guladarah,
        date: moment(item.date).format('MM/DD/YYYY') || "-"
      }));
    }
    console.log('cek data gula darah: ', dataSourceGD)

    let dataSourceIMT = [];
    if (serverDataIMT && serverDataIMT.data && serverDataIMT.data.length > 0) {
      dataSourceIMT = serverDataIMT.data
      .filter(item => item.user?._ref === opadId)
      .sort((a, b) => moment(b.date) - moment(a.date))
      .map((item) => ({
        key: item._id,
        tb: item.tb,
        bb: item.bb,
        date: moment(item.date).format('MM/DD/YYYY') || "-"
      }));
    }
    console.log('cek data tekanan darah: ', dataSourceIMT)

  const [time, setTime] = useState(0);
  const [instruction, setInstruction] = useState('');
  const [selectedMode, setSelectedMode] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [repeatAudio] = useState(new Audio(`${TimerAudio}`));
  const [showButton, setShowButton] = useState(false);

  const JalanCepatAudio = new Audio(`${JalanCepat}`);
  const JalanLambatAudio = new Audio(`${JalanLambat}`);
  const TerimaKasihAudio = new Audio(`${TerimaKasih}`);

  const startTimer = (duration) => {
    const id = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
    setIntervalId(id);
    setIsRunning(true)
    setShowButton(false);

    setTimeout(() => {
      clearInterval(id);
      setTime(0);
      setInstruction('');
      setSelectedMode(null);
      repeatAudio.pause();
      setIsRunning(false);
      setShowButton(true);
    }, duration * 60000);
  };

  const stopTimer = () => {
    clearInterval(intervalId);
    setTime(0);
    setInstruction('');
    setSelectedMode(null);
    repeatAudio.pause(); // Hentikan pemutaran audio yang diulang
    repeatAudio.currentTime = 0; // Set waktu audio ke awal
    setIsRunning(false);
    setShowButton(true);
    TerimaKasihAudio.play();
  };

  const handleModeChange = (value) => {
    setSelectedMode(value);
  };

  const handleStartStop = () => {
    if (!isRunning) {
      if (selectedMode) {
        startTimer(parseInt(selectedMode));
        repeatAudio.loop = true;
        repeatAudio.play();
      }
    } else {
      stopTimer();
    }
  };

  useEffect(() => {
    if (time !== 0 && time % 180 === 0) {
      setInstruction(prevInstruction => prevInstruction === 'Jalan Cepat' ? 'Jalan Lambat' : 'Jalan Cepat');
    }
  }, [time]);

  useEffect(() => {
    if (instruction === 'Jalan Cepat') {
      JalanCepatAudio.play();
    } else if (instruction === 'Jalan Lambat') {
      JalanLambatAudio.play();
    }
  }, [instruction]);

  const tentukanKategoriTekananDarah = (sistole) => {
    if (sistole < 90) {
        return "Rendah";
    } else if (sistole >= 90 && sistole <= 129) {
        return "Normal";
    } else {
        return "Tinggi";
    }
  };

  const sistole = dataSourceTK[0]?.sistole;
  const kategoriTekananDarah = tentukanKategoriTekananDarah(sistole);

  const tentukanKategoriTekananDarahDiastolik = (diastole) => {
    if (diastole >= 60 && diastole <= 84) {
        return "Normal";
    } else if (diastole < 60) {
        return "Rendah";
    } else {
        return "Tinggi";
    }
  };

  const diastole = dataSourceTK[0]?.diastole;
  const kategoriTekananDarahDiastolik = tentukanKategoriTekananDarahDiastolik(diastole);

  const tentukanKategoriGulaDarah = (gulaDarah) => {
    if (gulaDarah < 80) {
        return "Rendah";
    } else if (gulaDarah > 200) {
        return "Tinggi";
    } else {
        return "Normal";
    }
  };

  const gulaDarah = dataSourceGD[0]?.guladarah;
  const kategoriGulaDarah = tentukanKategoriGulaDarah(gulaDarah);
  console.log("cek gula darah: ", kategoriGulaDarah)

  const tinggiBadan = dataSourceIMT[0]?.tb;
  const tinggiBadanM = tinggiBadan / 100;
  const beratBadan = dataSourceIMT[0]?.bb;
  const iMT = beratBadan / (tinggiBadanM * tinggiBadanM);
  const iMTBulat = iMT.toFixed(2);
  console.log('IMT: ', iMTBulat);

  const tentukanKategoriIMT = (iMT) => {
    if (iMT < 17) {
        return "Sangat kurus";
    } else if (iMT >= 17 && iMT < 18.5) {
        return "Kurus";
    } else if (iMT >= 18.5 && iMT < 25) {
        return "Normal";
    } else if (iMT >= 25 && iMT < 27) {
        return "Overweight";
    } else {
        return "Obesitas";
    }
  };

  const kategoriIMT = tentukanKategoriIMT(iMTBulat);

  const createSanityLatihan = async (userData) => {
    try {
      const response = await fetch(`https://ln9ujpru.api.sanity.io/v2021-03-25/data/mutate/production`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer skAdQo8vEzaH81Ah4n2X8QDNsgIfdWkJlLmbo3CbT6Nt3nW7iTLx2roYCOm9Rlp1mQV2nEEGCqf4aGSMaJx67iK5PZPe7CgmI9Lx9diRdq0ssoRzl1LhiUFXHQmKu0utxgBa1ttoKwat3KIFt2B5vskrT82ekR5B8sbSzE51VjZHy3T7Q62P`,
        },
        body: JSON.stringify({
          mutations: [
            {
              create: {
                _type: 'latihan-opad', // Ganti dengan jenis dokumen pengguna di Sanity Anda
                user: {
                  _type: 'reference',
                  _ref: opadId // Assuming userData.userId contains the ID of the user document
                },
                latihan: userData.latihan,
                date: userData.date,
              },
            },
          ],
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create user in Sanity');
      }
  
      const data = await response.json();
      console.log('User created:', data);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const [formData, setFormData] = useState({
    user: {
      _type: 'reference',
      _ref: opadId
    },
    latihan: '',
    date: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Mengatur tanggal hari ini
    const formattedDate = moment().format();

    // Menyiapkan data yang akan dikirim
    const updatedFormData = {
      ...formData,
      latihan: true,
      date: formattedDate,
    };

    try {
      // Kirim POST request ke backend Sanity untuk membuat screening baru
      await createSanityLatihan(updatedFormData);

      // Tampilkan pesan sukses
      message.success("Anda telah latihan hari ini.");
      setShowButton(false)

    } catch (error) {
      // Tangani kesalahan
      console.error('Error registering user:', error);
    }
  };

  const [visible, setVisible] = useState(false);
  const [modalContentId, setModalContentId] = useState(null);

  const handleOpenModal = (id) => {
    setModalContentId(id);
    setVisible(true);
  };

  const handleCloseModal = () => {
    setVisible(false);
    setModalContentId(null); // Reset modal content id when modal is closed
  };
  
  return (
    <>
      <section className="my-0 mx-auto min-h-full max-w-screen-sm bg-white">
        <div className="bg-[#5b8bdf] text-white py-6 px-6 flex justify-between items-center">
          <div>
            <h3 className="text-2xl px-4 font-semibold">Hello,</h3>
            <hp className="text-lg px-4">{opadUser}</hp>
          </div>
          <div className="px-4">
            <img src={logo} width={120}/>
          </div>
        </div>

        <div className="px-4 mt-10">
          <div className="border-2 border-sky-950 py-4 rounded-2xl">
            <h3 className="text-center text-xl">Interval Walking Therapi Mode</h3>
            <div className="p-4">
              <div>
                <div className="flex gap-4 justify-center">
                  <Select size="large" placeholder="Pilih Mode" onChange={handleModeChange} style={{ width: 200, marginBottom: 16 }}>
                    <Option value="15">15 Menit</Option>
                    <Option value="20">20 Menit</Option>
                    <Option value="30">30 Menit</Option>
                    <Option value="45">45 Menit</Option>
                    <Option value="60">60 Menit</Option>
                  </Select>
                  <Button size="large" className="bg-[#5b8bdf] text-white" onClick={handleStartStop} disabled={!selectedMode}>
                    {isRunning ? 'Stop' : 'Mulai'}
                  </Button>
                </div>
                <div className="mt-5 text-center text-lg">
                  <h2>Mode: {selectedMode} Menit</h2>
                  <h2>Time: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</h2>
                  {instruction && <p className="font-bold text-center mt-6">{`"${instruction}..."`}</p>}

                  {showButton && (
                    <Button onClick={handleSubmit} className="mt-6 bg-[#5b8bdf] text-white" size="large">
                      Saya sudah melakukan latihan
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 grid grid-cols-2 gap-14 py-16">
          {dataSourceTK[0]?.sistole && (
            <div className="flex flex-col justify-center text-center items-center">
              <div className={`w-28 h-28 rounded-full flex flex-col justify-center items-center text-white text-2xl font-bold ${kategoriTekananDarah === 'Rendah' ? 'bg-yellow-500' : kategoriTekananDarah === 'Normal' ? 'bg-green-500' : 'bg-red-500'}`}>
                {dataSourceTK[0]?.sistole}<br/>
                <span className="text-sm font-light">{kategoriTekananDarah}</span>
              </div>
              <p>Sistole</p>
              {kategoriTekananDarah === 'Tinggi' && <Button onClick={() => handleOpenModal("SistoleTinggi")} className="absolute mt-44">Anjuran</Button>}
              {kategoriTekananDarah === 'Rendah' && <Button onClick={() => handleOpenModal("SistoleRendah")} className="absolute mt-44">Anjuran</Button>}
              {kategoriTekananDarah === 'Normal' && <Button onClick={() => handleOpenModal("SistoleNormal")} className="absolute mt-44">Anjuran</Button>}
            </div>
          )}

          {dataSourceTK[0]?.diastole && (
            <div className="flex flex-col justify-center text-center items-center">
              <div className={`w-28 h-28 rounded-full flex flex-col justify-center items-center text-white text-2xl font-bold ${kategoriTekananDarahDiastolik === 'Rendah' ? 'bg-yellow-500' : kategoriTekananDarahDiastolik === 'Normal' ? 'bg-green-500' : 'bg-red-500'}`}>
                {dataSourceTK[0]?.diastole}<br/>
                <span className="text-sm font-light">{kategoriTekananDarahDiastolik}</span>
              </div>
              <p>Diastole</p>
              {kategoriTekananDarahDiastolik === 'Tinggi' && <Button onClick={() => handleOpenModal("DiastoleTinggi")} className="absolute mt-44">Anjuran</Button>}
              {kategoriTekananDarahDiastolik === 'Rendah' && <Button onClick={() => handleOpenModal("DiastoleRendah")} className="absolute mt-44">Anjuran</Button>}
              {kategoriTekananDarahDiastolik === 'Normal' && <Button onClick={() => handleOpenModal("DiastoleNormal")} className="absolute mt-44">Anjuran</Button>}
            </div>
          )}

          {dataSourceGD[0]?.guladarah && (
            <div className="flex flex-col justify-center text-center items-center">
              <div className={`w-28 h-28 rounded-full flex flex-col justify-center items-center text-white text-2xl font-bold ${kategoriGulaDarah === 'Rendah' ? 'bg-yellow-500' : kategoriGulaDarah === 'Normal' ? 'bg-green-500' : 'bg-red-500'}`}>
                {dataSourceGD[0]?.guladarah}<br/>
                <span className="text-sm font-light">{kategoriGulaDarah}</span>
              </div>
              <p>Gula Darah</p>
              {kategoriGulaDarah === 'Tinggi' && <Button onClick={() => handleOpenModal("GDTinggi")} className="absolute mt-44">Anjuran</Button>}
              {kategoriGulaDarah === 'Rendah' && <Button onClick={() => handleOpenModal("GDRendah")} className="absolute mt-44">Anjuran</Button>}
              {kategoriGulaDarah === 'Normal' && <Button onClick={() => handleOpenModal("GDNormal")} className="absolute mt-44">Anjuran</Button>}
            </div>
          )}

          {dataSourceIMT[0]?.tb && (
            <div className="flex flex-col justify-center text-center items-center">
              <div className={`w-28 h-28 rounded-full flex flex-col justify-center items-center text-white text-2xl font-bold ${kategoriIMT === 'Sangat kurus' || kategoriIMT === 'Kurus'  ? 'bg-yellow-500' : kategoriIMT === 'Normal' ? 'bg-green-500' : 'bg-red-500'}`}>
                {iMTBulat}<br/>
                <span className="text-sm font-light">{kategoriIMT}</span>
              </div>
              <p>IMT</p>
                {(kategoriIMT === 'Obesitas' || kategoriIMT === 'Overweight') && <Button onClick={() => handleOpenModal("IMTObesitas")} className="absolute mt-44">Anjuran</Button>}
                {(kategoriIMT === 'Kurus' || kategoriIMT === 'Sangat kurus') && <Button onClick={() => handleOpenModal("IMTKurus")} className="absolute mt-44">Anjuran</Button>}
                {kategoriIMT === 'Normal'  && <Button onClick={() => handleOpenModal("IMTNormal")} className="absolute mt-44">Anjuran</Button>}
            </div>
          )}
        </div>

        <h2 className="px-4 text-xl font-semibold">Informasi Kesehatan</h2>
        <div className="grid grid-cols-3 p-4 gap-3 mb-20">
          <div className="flex flex-col justify-center text-center items-center">
            <Link to="/video">
              <img className="rounded-2xl w-28 h-28 object-cover" src="https://media.istockphoto.com/id/1359055641/id/video/rekan-dokter-di-rumah-sakit-mendiskusikan-kasus-saat-berjalan-di-koridor-rumah-sakit.jpg?s=640x640&k=20&c=Nj6IAu2Yu6R4OPfEpkYFvuprz0QiiYWM3a-r225uOA0=" />
              <p className="text-center">Video<br/> &nbsp;</p>
            </Link>
          </div>
          <div className="flex flex-col justify-center text-center items-center">
            <Link to="/artikel">
              <img className="rounded-2xl w-28 h-28 object-cover" src="https://blogs.insanmedika.co.id/wp-content/uploads/2020/05/Tugas-Perawat.jpg" />
              <p className="text-center">Artikel<br/> &nbsp;</p>
            </Link>
          </div>
          <div className="flex flex-col justify-center text-center items-center">
            <a href="https://wa.me/6285326698776?text=Hi%2C%20Saya%20ingin%20konsultasi" target="_blank">
              <img className="rounded-2xl w-28 h-28 object-cover" src="https://awsimages.detik.net.id/community/media/visual/2020/05/05/c7f69650-d103-46d4-992c-d5e876968a6e.jpeg?w=600&q=90" />
              <p className="text-center">Hubungi Perawat</p>
            </a>
          </div>
        </div>
        </section>
        <Modal
          title=""
          visible={visible}
          onCancel={handleCloseModal}
          footer={[
            <Button key="cancel" onClick={handleCloseModal}>
              Tutup
            </Button>
          ]}
        >
          <div className="mt-6">
            {modalContentId === "IMTNormal" &&
              <div>
                <ul className="list-disc px-6">
                  <li>Bagus!</li>
                  <li>Pertahankan berat badan ideal dengan makan sehat dengan gizi seimbang</li>
                  <li>Rutin berolahraga minimal 30 menit sehari, 5 kali dalam seminggu</li>
                  <li>Hindari makanan manis, asin, dan berlemak</li>
                </ul>
              </div>
            }

            {modalContentId === "IMTKurus" &&
              <div>
                <ul className="list-disc px-6">
                  <li>Tingkatkan asupan kalori dengan makanan tinggi protein, lemak sehat, karbohidrat kompleks</li>
                  <li>Tetap Olahraga</li>
                  <li>Konsultasikan ke Dokter jika ada penurunan berat badan secara drastis</li>
                </ul>
              </div>
            }

            {modalContentId === "IMTObesitas" &&
              <div>
                <ul className="list-disc px-6">
                  <li>Hati-hati!</li>
                  <li>Tetap konsumsi makanan sehat dengan gizi seimbang</li>
                  <li>Kurangi dan hindari makanan yang mengandung tinggi gula, garam dan lemak</li>
                  <li>Konsultasikan ke Dokter dan Ahli Gizi jika ingin memulai program menurunkan berat badan</li>
                  <li>Lakukan aktivitas olahraga secara rutin minimal 30 menit dalam sehari. 5 kali dalam seminggu</li>
                  <li>Tingkatkan aktivitas fisik harian dengan lebih banyak gerak dan berjalan kaki</li>
                  <li>Hindari terlalu lama duduk atau rebahan di luar jam tidur/ jam istirahat</li>
                </ul>
              </div>
            }

            {modalContentId === "GDRendah" &&
              <div>
                <ul className="list-disc px-6">
                  <li>Segera konsumsi makanan & minuman mengandung karbohidrat</li>
                  <li>Pantau selalu kadar gula darah</li>
                  <li>Segera berkonsultasi dengan dokter jika kondisinya semakin parah</li>
                </ul>
              </div>
            }

            {modalContentId === "GDNormal" &&
              <div>
                <ul className="list-disc px-6">
                  <li>Bagus sekali, Pertahankan!</li>
                  <li>Tetap menjaga pola makan sehat dan seimbang</li>
                  <li>Rutin berolahraga minimal 30 menit sehari selama 5 kali dalam seminggu</li>
                  <li>Hindari rokok dan alkohol</li>
                  <li>Tetap minum obat secara teratur</li>
                </ul>
              </div>
            }

            {modalContentId === "GDTinggi" &&
              <div>
                <ul className="list-disc px-6">
                  <li>Waspada!</li>
                  <li>Batasi konsumsi makanan berkarbohidrat dan hindari makanan/minuman tinggi gula</li>
                  <li>Pantau gula darah secara teratur</li>
                  <li>Istirahat yang cukup</li>
                  <li>Teratur minum obat</li>
                  <li>Konsultasikan ke dokter jika mengalami sakit kepala, pusing, dan mual</li>
                  <li>Rujuk segera bila pingsan tiba-tiba</li>
                </ul>
              </div>
            }

            {(modalContentId === "SistoleRendah" || modalContentId === "DiastoleRendah") &&
              <div>
                <ul className="list-disc px-6">
                  <li>Segera berkonsultasi dengan dokter jika mengalami gejala kepala pusing, dan lemas</li>
                  <li>Jangan berdiri secara tiba-tiba</li>
                  <li>Jaga pola makan sehat dengan gizi seimbang</li>
                  <li>Istirahat yang cukup</li>
                  <li>Minum air putih yang cukup</li>
                  <li>Hindari kopi dan alkohol</li>
                </ul>
              </div>
            }

            {(modalContentId === "SistoleNormal" || modalContentId === "DiastoleNormal") &&
              <div>
                <ul className="list-disc px-6">
                  <li>Bagus! Pertahankan</li>
                  <li>Tetap menjaga pola makan sehat</li>
                  <li>Hindari hindari makanan tinggi gula, garam dan lemak</li>
                </ul>
              </div>
            }

            {(modalContentId === "SistoleTinggi" || modalContentId === "DiastoleTinggi") &&
              <div>
                <ul className="list-disc px-6">
                  <li>Hati-hati!!</li>
                  <li>Minum obat sesuai petunjuk secara teratur</li>
                  <li>Konsumsi makanan rendah garam, lemak, dan gula</li>
                  <li>Istirahat cukup</li>
                  <li>Lakukan relaksasi</li>
                  <li>Waspada, segera ke Dokter jika mengalami gejala sakit kepala berat, mimisan, sesak napas, dan nyeri dada</li>
                </ul>
              </div>
            }
          </div>
        </Modal>
    </>
  )
}

export default Home