import { Button, Collapse, DatePicker, Input, Table, message } from "antd"
import { useEffect, useState } from "react";
import { sanityClient } from "../lib/sanity/getClient";
import { isAuthenticated } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



const columns = [
  {
    title: 'Aktivitas',
    dataIndex: 'latihan',
    key: 'latihan',
  },
  {
    title: 'Waktu',
    dataIndex: 'date',
    key: 'date',
  },
];

function Kesehatan() {
    const navigate = useNavigate();
    // const opadData = JSON.parse(localStorage.getItem('opadData'));
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

    const [isLoading, setIsLoading] = useState(true);
    const [serverDataLatihan, setServerDataLatihan] = useState({
      data: [],
      error: null,
      loading: true,
    });
  
    useEffect(() => {
      async function fetchSanityData() {
        try {
          setIsLoading(true);
          const sanityData = await sanityClient.fetch(`*[_type == 'latihan-opad']{
            _id,
            latihan,
            date,
            user,
          }`);
  
          setServerDataLatihan({
            data: sanityData,
            error: null,
            loading: false,
          });
        } catch (error) {
          setServerDataLatihan({
            data: [],
            error: 'Error getting data. Please try again later.',
            loading: false,
          });
        } finally {
          setIsLoading(false);
        }
      }
  
      fetchSanityData();
    }, []);

    let dataSource = [];
    if (serverDataLatihan && serverDataLatihan.data && serverDataLatihan.data.length > 0) {
      dataSource = serverDataLatihan.data
      .filter(item => item.user?._ref === opadId)
      .map((item) => ({
        key: item._id,
        latihan: item.latihan ? 'Sudah latihan' : '-',
        date: moment(item.date).format('MM/DD/YYYY, h:mm a') || "-"
      }));
    }
    console.log('cek data latihan: ', dataSource)

    const createSanityTekananDarah = async (userData) => {
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
                  _type: 'opad-tekanandarah', // Ganti dengan jenis dokumen pengguna di Sanity Anda
                  user: {
                    _type: 'reference',
                    _ref: opadId // Assuming userData.userId contains the ID of the user document
                  },
                  sistole: userData.sistole,
                  diastole: userData.diastole,
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
      sistole: '',
      diastole: '',
      date: '',
    });

    async function handleSubmitTekananDarah(event) {
      event.preventDefault();
      try {
        // Send POST request to your Sanity backend to create a new user
        await createSanityTekananDarah(formData);
  
        message.success("Berhasil menambahkan data.")
        fetchSanityDataTK();
  
        // Reset the form after successful registration
        setFormData({
          sistole: '',
          diastole: '',
          date: '',
        });
      } catch (error) {
        console.error('Error registering user:', error);
      }
    }

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

    const createSanityGulaDarah = async (userData) => {
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
                  _type: 'opad-guladarah', // Ganti dengan jenis dokumen pengguna di Sanity Anda
                  user: {
                    _type: 'reference',
                    _ref: opadId // Assuming userData.userId contains the ID of the user document
                  },
                  guladarah: userData.guladarah,
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
  
    const [formDataGD, setFormDataGD] = useState({
      user: {
        _type: 'reference',
        _ref: opadId
      },
      guladarah: '',
      date: '',
    });

    async function handleSubmitGulaDarah(event) {
      event.preventDefault();
      try {
        // Send POST request to your Sanity backend to create a new user
        await createSanityGulaDarah(formDataGD);
  
        message.success("Berhasil menambahkan data.")
        fetchSanityDataGD();
  
        // Reset the form after successful registration
        setFormData({
          guladarah: '',
          date: '',
        });
      } catch (error) {
        console.error('Error registering user:', error);
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

    const createSanityIMT = async (userData) => {
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
                  _type: 'opad-imt', // Ganti dengan jenis dokumen pengguna di Sanity Anda
                  user: {
                    _type: 'reference',
                    _ref: opadId // Assuming userData.userId contains the ID of the user document
                  },
                  tb: userData.tb,
                  bb: userData.bb,
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
  
    const [formDataIMT, setFormDataIMT] = useState({
      user: {
        _type: 'reference',
        _ref: opadId
      },
      tb: '',
      bb: '',
      date: '',
    });

    async function handleSubmitIMT(event) {
      event.preventDefault();
      try {
        // Send POST request to your Sanity backend to create a new user
        await createSanityIMT(formDataIMT);
  
        message.success("Berhasil menambahkan data.")
        fetchSanityDataIMT();
  
        // Reset the form after successful registration
        setFormDataIMT({
          tb: '',
          bb: '',
          date: '',
        });
      } catch (error) {
        console.error('Error registering user:', error);
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

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        const sistole = payload.find(data => data.dataKey === 'sistole');
        const diastole = payload.find(data => data.dataKey === 'diastole');
        const kategoriTekananDarah = tentukanKategoriTekananDarah(sistole?.value);
        const kategoriTekananDarahDiastolik = tentukanKategoriTekananDarahDiastolik(diastole?.value);
    
        return (
          <div className="custom-tooltip" style={{ backgroundColor: '#ffff', padding: '5px', border: '1px solid #cccc' }}>
            <p className="label text-xs">{`${label}`}</p>
            <p className="intro text-xs">{`Sistole: ${sistole?.value} mmHg (${kategoriTekananDarah})`}</p>
            <p className="intro text-xs">{`Diastole: ${diastole?.value} mmHg (${kategoriTekananDarahDiastolik})`}</p>
          </div>
        );
      }
      return null;
    };       
  
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

    const CustomTooltipGD = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        const gulaDarah = payload[0].payload.guladarah;
        const kategoriGulaDarah = tentukanKategoriGulaDarah(gulaDarah);
        return (
          <div className="custom-tooltip" style={{ backgroundColor: '#ffff', padding: '5px', border: '1px solid #cccc' }}>
            <p className="label text-xs">{`${label}`}</p>
            <p className="intro text-xs">{`Gula darah: ${payload[0].value} gr/dl (${kategoriGulaDarah})`}</p>
          </div>
        );
      }
    
      return null;
    };    
  
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

    const CustomTooltipIMT = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        const tinggiBadan = payload.find(data => data.dataKey === 'tb');
        const beratBadan = payload.find(data => data.dataKey === 'bb');
        const iMT = beratBadan?.value / ((tinggiBadan?.value / 100) * (tinggiBadan?.value / 100));
        const iMTBulat = iMT.toFixed(2);
        const kategoriIMT = tentukanKategoriIMT(iMTBulat);
    
        return (
          <div className="custom-tooltip" style={{ backgroundColor: '#ffff', padding: '5px', border: '1px solid #cccc' }}>
            <p className="label text-xs">{`${label}`}</p>
            <p className="intro text-xs">{`Tinggi badan: ${tinggiBadan?.value} cm`}</p>
            <p className="intro text-xs">{`Berat badan: ${beratBadan?.value} kg`}</p>
            <p className="intro text-xs">{`IMT: ${iMTBulat} (${kategoriIMT})`}</p>
          </div>
        );
      }
    
      return null;
    };
    
    return (
      <div className="my-0 mx-auto min-h-full max-w-screen-sm bg-white">
          <div className="border-b-2 border-gray-400">
              <h2 className="text-xl font-bold px-4 py-4">Kesehatan</h2>
          </div>

          <div className="py-10 px-4 pb-96">
            <Collapse defaultActiveKey={['1']}>
              <Collapse.Panel header="Tekanan Darah" key="1">
                <div className="py-6">
                  <form className="px-4 items-center" onSubmit={handleSubmitTekananDarah}>
                  {/* <h2 className="font-bold text-[18px] lg:text-4xl mb-10 text-gray-900 uppercase">Biodata <br/><span className="text-xl">({opadData[0]?.name})</span></h2> */}
                    <DatePicker
                      name="date"
                      placeholder="Tanggal Pemeriksaan"
                      size="large"
                      className="mb-4 border w-full"
                      required
                      value={formData.date}
                      onChange={(date) => setFormData({ ...formData, date })}
                    />
                    <Input
                      type="number"
                      name="sistole"
                      placeholder="Sistole"
                      size="large"
                      className="mb-4 border"
                      required
                      value={formData.sistole}
                      onChange={(e) => setFormData({ ...formData, sistole: e.target.value })}
                    />
                    <Input
                      type="number"
                      name="diastole"
                      placeholder="Disastole"
                      size="large"
                      className="mb-8 border"
                      value={formData.diastole}
                      onChange={(e) => setFormData({ ...formData, diastole: e.target.value })}
                    />
                    <Button
                      className="text-white bg-sky-950 w-full"
                      htmlType="submit"
                      size="large"
                    >
                      Submit
                    </Button>
                  </form>

                  {dataSourceTK[0]?.sistole && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-lg px-4">Riwayat:</h3>
                      <p className="px-4">Tanggal pemeriksaan: <span className="font-semibold">{moment(dataSourceTK[0]?.date).format('DD MMMM YYYY')}</span></p>
                      <p className="px-4">Sistole: <span className="font-semibold">{dataSourceTK[0]?.sistole} mmhg ({kategoriTekananDarah})</span></p>
                      <p className="px-4">Diastole: <span className="font-semibold">{dataSourceTK[0]?.diastole} mmhg ({kategoriTekananDarahDiastolik})</span></p>

                      <div className="mt-6 w-full">
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={dataSourceTK}
                            margin={{
                              top: 20,
                              right: 0,
                              left: -25,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="sistole" fill="#8884d8" />
                            <Bar dataKey="diastole" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              </Collapse.Panel>
              <Collapse.Panel header="Gula Darah" key="2">
                <div className="py-6">
                  <form className="px-4 items-center" onSubmit={handleSubmitGulaDarah}>
                  {/* <h2 className="font-bold text-[18px] lg:text-4xl mb-10 text-gray-900 uppercase">Biodata <br/><span className="text-xl">({opadData[0]?.name})</span></h2> */}
                    <DatePicker
                      name="date"
                      placeholder="Tanggal Pemeriksaan"
                      size="large"
                      className="mb-4 border w-full"
                      required
                      value={formDataGD.date}
                      onChange={(date) => setFormDataGD({ ...formDataGD, date })}
                    />
                    <Input
                      type="number"
                      name="guladarah"
                      placeholder="Gula Darah"
                      size="large"
                      className="mb-4 border"
                      required
                      value={formDataGD.guladarah}
                      onChange={(e) => setFormDataGD({ ...formDataGD, guladarah: e.target.value })}
                    />
                    <Button
                      className="text-white bg-sky-950 w-full"
                      htmlType="submit"
                      size="large"
                    >
                      Submit
                    </Button>
                  </form>

                  {dataSourceGD[0]?.guladarah && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-lg px-4">Riwayat:</h3>
                      <p className="px-4">Tanggal pemeriksaan: <span className="font-semibold">{moment(dataSourceGD[0]?.date).format('DD MMMM YYYY')}</span></p>
                      <p className="px-4">Gula darah: <span className="font-semibold">{dataSourceGD[0]?.guladarah} gr/dl ({kategoriGulaDarah})</span></p>
                    
                      <div className="mt-8">
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={dataSourceGD}
                            margin={{
                              top: 20,
                              right: 0,
                              left: -25,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip content={<CustomTooltipGD />} />
                            <Legend />
                            <Bar dataKey="guladarah" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              </Collapse.Panel>
              <Collapse.Panel header="IMT" key="3">
                <div className="py-6">
                  <form className="px-4 items-center" onSubmit={handleSubmitIMT}>
                    <DatePicker
                      name="date"
                      placeholder="Tanggal Pemeriksaan"
                      size="large"
                      className="mb-4 border w-full"
                      required
                      value={formDataIMT.date}
                      onChange={(date) => setFormDataIMT({ ...formDataIMT, date })}
                    />
                    <Input
                      type="number"
                      name="tb"
                      placeholder="Tinggi Badan"
                      size="large"
                      className="mb-4 border"
                      required
                      value={formDataIMT.tb}
                      onChange={(e) => setFormDataIMT({ ...formDataIMT, tb: e.target.value })}
                    />
                    <Input
                      type="number"
                      name="bb"
                      placeholder="Berat Badan"
                      size="large"
                      className="mb-4 border"
                      required
                      value={formDataIMT.bb}
                      onChange={(e) => setFormDataIMT({ ...formDataIMT, bb: e.target.value })}
                    />
                    <Button
                      className="text-white bg-sky-950 w-full"
                      htmlType="submit"
                      size="large"
                    >
                      Submit
                    </Button>
                  </form>
                  
                  {dataSourceIMT[0]?.tb && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-lg px-4">Riwayat:</h3>
                      <p className="px-4">Tinggi badan: <span className="font-semibold">{dataSourceIMT[0]?.tb} cm</span></p>
                      <p className="px-4">Berat badan: <span className="font-semibold">{dataSourceIMT[0]?.bb} kg</span></p>
                      <p className="px-4">IMT: <span className="font-semibold">{iMTBulat} ({kategoriIMT})</span></p>

                      <div className="mt-6">
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={dataSourceIMT}
                            margin={{
                              top: 20,
                              right: 0,
                              left: -25,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip content={<CustomTooltipIMT />} />
                            <Legend />
                            <Bar dataKey="tb" fill="#8884d8" />
                            <Bar dataKey="bb" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              </Collapse.Panel>
              <Collapse.Panel header="Aktivitas Latihan" key="4">
                <div className="py-6">
                  <Table className='font-normal' columns={columns} dataSource={dataSource} loading={isLoading}/>
                </div>
              </Collapse.Panel>
            </Collapse>
          </div>
      </div>
    )
  }
  
  export default Kesehatan