import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { Button, Select, message } from "antd";
import JalanCepat from "../assets/jalancepat.mp3"
import JalanLambat from "../assets/jalanlambat.mp3"
import TimerAudio from "../assets/timer.mp3"
import { sanityClient } from "../lib/sanity/getClient";
import moment from "moment";

const { Option } = Select;

function Home() {
  const navigate = useNavigate();
  const opadId = (localStorage.getItem('opadId'));
  console.log('cek id user: ', opadId)

  useEffect(() => {
    // Check if the user is authenticated when the component mounts
    if (!isAuthenticated()) {
      // If not authenticated, redirect to the sign-in page
      message.error("Kamu belum login. Silahkan login terlebir dahulu!");
      navigate("/");
    }
  }, [navigate]);

  const [serverData, setServerData] = useState({
    data: [],
    error: null,
    loading: true,
  });

  useEffect(() => {
    async function fetchSanityData() {
      try {
        const sanityData = await sanityClient.fetch(`*[_type == 'user-opad']{
          _id,
          name,
          email,
          type,
          password,
          ttl,
          gender,
          alamat,
          datetk,
          tekanandarah,
          tekanandarah2,
          dategd,
          guladarah,
          tb,
          bb,
          telepon
        }`);

        // Filter the data array based on opadId
        const filteredData = sanityData.filter(item => item._id === opadId);

        setServerData({
          data: filteredData,
          error: null,
          loading: false,
        });
      } catch (error) {
        setServerData({
          data: [],
          error: 'Error getting data. Please try again later.',
          loading: false,
        });
      }
    }

    fetchSanityData();
  }, []);
  console.log('cek data home: ', serverData)

  const [time, setTime] = useState(0);
  const [instruction, setInstruction] = useState('');
  const [selectedMode, setSelectedMode] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [repeatAudio] = useState(new Audio(`${TimerAudio}`));
  const [showButton, setShowButton] = useState(false);

  const JalanCepatAudio = new Audio(`${JalanCepat}`);
  const JalanLambatAudio = new Audio(`${JalanLambat}`);
  // const RepeatAudio = new Audio(`${TimerAudio}`);

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
    if (time !== 0 && time % 10 === 0) {
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

  const sistole = serverData?.data[0]?.tekanandarah;
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

  const diastole = serverData?.data[0]?.tekanandarah2;
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

  const gulaDarah = serverData?.data[0]?.guladarah;
  const kategoriGulaDarah = tentukanKategoriGulaDarah(gulaDarah);
  console.log("cek gula darah: ", kategoriGulaDarah)

  const tinggiBadan = serverData?.data[0]?.tb;
  const tinggiBadanM = tinggiBadan / 100;
  const beratBadan = serverData?.data[0]?.bb;
  const iMT = beratBadan / (tinggiBadanM * tinggiBadanM);
  const iMTBulat = iMT.toFixed(2);
  console.log('tb: ', iMTBulat);

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
  
  return (
    <>
      <section className="my-0 mx-auto min-h-full max-w-screen-sm bg-white">
        <div className="bg-sky-950 text-white py-6">
          <h3 className="text-2xl px-4 font-semibold">Selamat Datang</h3>
          <hp className="text-lg px-4">{serverData?.data[0]?.name}</hp>
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
                  <Button size="large" className="bg-sky-950 text-white" onClick={handleStartStop} disabled={!selectedMode}>
                    {isRunning ? 'Stop' : 'Mulai'}
                  </Button>
                </div>
                <div className="mt-5 text-center text-lg">
                  <h2>Mode: {selectedMode} Menit</h2>
                  <h2>Time: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</h2>
                  {instruction && <p className="font-bold text-center mt-6">{`"${instruction}..."`}</p>}

                  {showButton && (
                    <Button onClick={handleSubmit} className="mt-6 bg-sky-950 text-white" size="large">
                      Saya sudah melakukan latihan
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 grid grid-cols-2 gap-14 py-16">
          {serverData?.data[0]?.tekanandarah && (
            <div className="flex flex-col justify-center text-center items-center">
              <div className={`w-28 h-28 rounded-full flex flex-col justify-center items-center text-white text-2xl font-bold ${kategoriTekananDarah === 'Rendah' ? 'bg-yellow-500' : kategoriTekananDarah === 'Normal' ? 'bg-green-500' : 'bg-red-500'}`}>
                {serverData?.data[0]?.tekanandarah}<br/>
                <span className="text-sm font-light">{kategoriTekananDarah}</span>
              </div>
              <p>Sistole</p>
              {kategoriTekananDarah === 'Tinggi' && <Button className="absolute mt-44">Rekomendasi</Button>}
            </div>
          )}

          {serverData?.data[0]?.tekanandarah2 && (
            <div className="flex flex-col justify-center text-center items-center">
              <div className={`w-28 h-28 rounded-full flex flex-col justify-center items-center text-white text-2xl font-bold ${kategoriTekananDarahDiastolik === 'Rendah' ? 'bg-yellow-500' : kategoriTekananDarahDiastolik === 'Normal' ? 'bg-green-500' : 'bg-red-500'}`}>
                {serverData?.data[0]?.tekanandarah2}<br/>
                <span className="text-sm font-light">{kategoriTekananDarahDiastolik}</span>
              </div>
              <p>Diastole</p>
              {kategoriTekananDarahDiastolik === 'Tinggi' && <Button className="absolute mt-44">Rekomendasi</Button>}
            </div>
          )}

          {serverData?.data[0]?.guladarah && (
            <div className="flex flex-col justify-center text-center items-center">
              <div className={`w-28 h-28 rounded-full flex flex-col justify-center items-center text-white text-2xl font-bold ${kategoriGulaDarah === 'Rendah' ? 'bg-yellow-500' : kategoriGulaDarah === 'Normal' ? 'bg-green-500' : 'bg-red-500'}`}>
                {serverData?.data[0]?.guladarah}<br/>
                <span className="text-sm font-light">{kategoriGulaDarah}</span>
              </div>
              <p>Gula Darah</p>
              {kategoriGulaDarah === 'Tinggi' && <Button className="absolute mt-44">Rekomendasi</Button>}
            </div>
          )}

          {serverData?.data[0]?.tb && (
            <div className="flex flex-col justify-center text-center items-center">
              <div className={`w-28 h-28 rounded-full flex flex-col justify-center items-center text-white text-2xl font-bold ${kategoriIMT === 'Sangat kurus' || kategoriIMT === 'Kurus'  ? 'bg-yellow-500' : kategoriIMT === 'Normal' ? 'bg-green-500' : 'bg-red-500'}`}>
                {iMTBulat}<br/>
                <span className="text-sm font-light">{kategoriIMT}</span>
              </div>
              <p>IMT</p>
                {(kategoriIMT === 'Obesitas' || kategoriIMT === 'Overweight') && <Button className="absolute mt-44">Rekomendasi</Button>}
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
    </>
  )
}

export default Home