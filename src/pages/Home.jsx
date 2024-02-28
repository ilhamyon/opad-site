import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deauthUser, isAuthenticated } from "../utils/auth";
import { Button, Menu, Select, message } from "antd";
import JalanCepat from "../assets/jalancepat.mp3"
import JalanLambat from "../assets/jalanlambat.mp3"
import TimerAudio from "../assets/timer.mp3"

const { Option } = Select;

function Home() {
  const navigate = useNavigate();
  const opadData = JSON.parse(localStorage.getItem('opadData'));
  // const opadId = (localStorage.getItem('opadId'));
  // console.log('cek user: ', opadData)

  useEffect(() => {
    // Check if the user is authenticated when the component mounts
    if (!isAuthenticated()) {
      // If not authenticated, redirect to the sign-in page
      message.error("Kamu belum login. Silahkan login terlebir dahulu!");
      navigate("/");
    }
  }, [navigate]);

  const menu = (
    <Menu>
      <Menu.Item key="signout" onClick={deauthUser}>Logout</Menu.Item>
    </Menu>
  );

  const [time, setTime] = useState(0);
  const [instruction, setInstruction] = useState('');
  const [selectedMode, setSelectedMode] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  const JalanCepatAudio = new Audio(`${JalanCepat}`);
  const JalanLambatAudio = new Audio(`${JalanLambat}`);
  const RepeatAudio = new Audio(`${TimerAudio}`);

  const startTimer = (duration) => {
    const id = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
    setIntervalId(id);

    setTimeout(() => {
      clearInterval(id);
      setTime(0);
      setInstruction('');
      setSelectedMode(null);
    }, duration * 60000);
  };

  const handleModeChange = (value) => {
    setSelectedMode(value);
  };

  const handleStartTimer = () => {
    if (selectedMode) {
      startTimer(parseInt(selectedMode));
      RepeatAudio.loop = true;
      RepeatAudio.play();
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
  
  return (
    <>
      <section className="my-0 mx-auto min-h-full max-w-screen-sm bg-white">
        <div className="bg-sky-950 text-white py-6">
          <h3 className="text-2xl px-4 font-semibold">Selamat Datang</h3>
          <hp className="text-lg px-4">{opadData[0]?.name}</hp>
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
                  <Button size="large" className="bg-sky-950 text-white" onClick={handleStartTimer} disabled={!selectedMode}>
                    Mulai
                  </Button>
                </div>
                <div className="mt-5 px-5 text-lg">
                  <h2>Mode: {selectedMode} Menit</h2>
                  <h2>Time: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</h2>
                  {instruction && <p className="font-bold text-center mt-6">{`"${instruction}..."`}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 grid grid-cols-2 gap-6 py-10">
          <div className="flex flex-col justify-center text-center items-center">
            <div className="w-28 h-28 bg-sky-900 rounded-full flex flex-col justify-center items-center text-white text-2xl font-bold">
              350<br/>
              <span className="text-sm font-light">Tinggi</span>
            </div>
            <p>Gula Darah</p>
          </div>
          <div className="flex flex-col justify-center text-center items-center">
            <div className="w-28 h-28 bg-sky-900 rounded-full flex flex-col justify-center items-center text-white text-2xl font-bold">
              350<br/>
              <span className="text-sm font-light">Tinggi</span>
            </div>
            <p>Tekanan Darah</p>
          </div>
          <div className="flex flex-col justify-center text-center items-center">
            <div className="w-28 h-28 bg-sky-900 rounded-full flex flex-col justify-center items-center text-white text-2xl font-bold">
              350<br/>
              <span className="text-sm font-light">Obesitas</span>
            </div>
            <p>IMT</p>
          </div>
        </div>

        <h2 className="px-4 text-xl font-semibold">Informasi Kesehatan</h2>
        <div className="grid grid-cols-3 p-4 gap-3 mb-20">
          <div className="flex flex-col justify-center text-center items-center">
            <img className="rounded-2xl w-28 h-28 object-cover" src="https://media.istockphoto.com/id/1359055641/id/video/rekan-dokter-di-rumah-sakit-mendiskusikan-kasus-saat-berjalan-di-koridor-rumah-sakit.jpg?s=640x640&k=20&c=Nj6IAu2Yu6R4OPfEpkYFvuprz0QiiYWM3a-r225uOA0=" />
            <p className="text-center">Video<br/> &nbsp;</p>
          </div>
          <div className="flex flex-col justify-center text-center items-center">
            <img className="rounded-2xl w-28 h-28 object-cover" src="https://blogs.insanmedika.co.id/wp-content/uploads/2020/05/Tugas-Perawat.jpg" />
            <p className="text-center">Artikel<br/> &nbsp;</p>
          </div>
          <div className="flex flex-col justify-center text-center items-center">
            <img className="rounded-2xl w-28 h-28 object-cover" src="https://awsimages.detik.net.id/community/media/visual/2020/05/05/c7f69650-d103-46d4-992c-d5e876968a6e.jpeg?w=600&q=90" />
            <p className="text-center">Hubungi Perawat</p>
          </div>
        </div>
        </section>
    </>
  )
}

export default Home