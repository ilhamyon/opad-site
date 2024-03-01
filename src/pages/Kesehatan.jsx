import { Button, Collapse, DatePicker, Input, Table, message } from "antd"
import { useEffect, useState } from "react";
import { sanityClient } from "../lib/sanity/getClient";
import { isAuthenticated } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import moment from "moment";

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
    console.log('cek data: ', serverData)

    const updateSanityUser = async (opadData) => {
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
                patch: {
                  id: opadId, // The _id of the document to update
                  set: {
                    datetk: opadData.datetk,
                    tekanandarah: opadData.tekanandarah,
                    tekanandarah2: opadData.tekanandarah2,
                    dategd: opadData.dategd,
                    guladarah: opadData.guladarah,
                    tb: opadData.tb,
                    bb: opadData.bb,
                  },
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

    const [formUpdate, setFormUpdate] = useState({
      datetk: null,
      tekanandarah: "",
      tekanandarah2: "",
      dategd: null,
      guladarah: "",
      tb: "",
      bb: ""
    });

    useEffect(() => {
      setFormUpdate({
        datetk: serverData?.data[0]?.datetk || "",
        tekanandarah: serverData?.data[0]?.tekanandarah || "",
        tekanandarah2: serverData?.data[0]?.tekanandarah2 || "",
        dategd: serverData?.data[0]?.dategd || "",
        guladarah: serverData?.data[0]?.guladarah || "",
        tb: serverData?.data[0]?.tb || "",
        bb: serverData?.data[0]?.bb || "",
      });
    }, [serverData]);

    const handleUpdateChange = (e) => {
      const { name, value } = e.target;
      setFormUpdate({ ...formUpdate, [name]: value });
    };

    const handleUpdateChangeDate = (date, dateString) => {
      if (dateString && moment(dateString, 'YYYY-MM-DD', true).isValid()) {
        setFormUpdate({ ...formUpdate, datetk: dateString });
      } else {
        // Tanggal tidak valid, Anda bisa menangani ini sesuai kebutuhan Anda
      }
    };

    const handleUpdateChangeDateGD = (date, dateString) => {
      if (dateString && moment(dateString, 'YYYY-MM-DD', true).isValid()) {
        setFormUpdate({ ...formUpdate, dategd: dateString });
      } else {
        // Tanggal tidak valid, Anda bisa menangani ini sesuai kebutuhan Anda
      }
    };

    async function handleSubmit(event) {
      event.preventDefault();
      try {
        // Send POST request to your Sanity backend to create a new user
        await updateSanityUser(formUpdate);

        message.success("Update data berhasil.")
        localStorage.setItem('opadData', JSON.stringify(serverData));

      } catch (error) {
        console.error('Error registering user:', error);
      }
    }

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
    return (
      <div className="my-0 mx-auto min-h-full max-w-screen-sm bg-white">
          <div className="border-b-2 border-gray-400">
              <h2 className="text-xl font-bold px-4 py-4">Kesehatan</h2>
          </div>

          <div className="py-10 px-4 pb-96">
            <Collapse defaultActiveKey={['1']}>
              <Collapse.Panel header="Tekanan Darah" key="1">
                <div className="py-6">
                  <form className="px-4 items-center" onSubmit={handleSubmit}>
                  {/* <h2 className="font-bold text-[18px] lg:text-4xl mb-10 text-gray-900 uppercase">Biodata <br/><span className="text-xl">({opadData[0]?.name})</span></h2> */}
                    <DatePicker
                      name="datetk"
                      placeholder="Tanggal Pemeriksaan"
                      size="large"
                      className="mb-4 border w-full"
                      value={formUpdate.datetk ? moment(formUpdate.datetk, 'YYYY-MM-DD') : null}
                      onChange={handleUpdateChangeDate}
                      required
                    />
                    <Input
                      type="number"
                      name="tekanandarah"
                      placeholder="Sistole"
                      size="large"
                      className="mb-4 border"
                      value={formUpdate.tekanandarah}
                      onChange={handleUpdateChange}
                      required
                    />
                    <Input
                      type="number"
                      name="tekanandarah2"
                      placeholder="Disastole"
                      size="large"
                      className="mb-8 border"
                      value={formUpdate.tekanandarah2}
                      onChange={handleUpdateChange}
                    />
                    <Button
                      className="text-white bg-sky-950 w-full"
                      htmlType="submit"
                      size="large"
                    >
                      Update
                    </Button>
                  </form>

                  {serverData?.data[0]?.tekanandarah && (
                    <div className="mt-6 px-4">
                      <h3 className="font-semibold text-lg">Riwayat:</h3>
                      <p>Tanggal pemeriksaan: <span className="font-semibold">{moment(serverData?.data[0]?.datetk).format('DD MMMM YYYY')}</span></p>
                      <p>Sistole: <span className="font-semibold">{serverData?.data[0]?.tekanandarah} mmhg ({kategoriTekananDarah})</span></p>
                      <p>Diastole: <span className="font-semibold">{serverData?.data[0]?.tekanandarah} mmhg ({kategoriTekananDarahDiastolik})</span></p>
                    </div>
                  )}
                </div>
              </Collapse.Panel>
              <Collapse.Panel header="Gula Darah" key="2">
                <div className="py-6">
                  <form className="px-4 items-center" onSubmit={handleSubmit}>
                  {/* <h2 className="font-bold text-[18px] lg:text-4xl mb-10 text-gray-900 uppercase">Biodata <br/><span className="text-xl">({opadData[0]?.name})</span></h2> */}
                    <DatePicker
                      name="dategd"
                      placeholder="Tanggal Pemeriksaan"
                      size="large"
                      className="mb-4 border w-full"
                      value={formUpdate.dategd ? moment(formUpdate.dategd, 'YYYY-MM-DD') : null}
                      onChange={handleUpdateChangeDateGD}
                      required
                    />
                    <Input
                      type="number"
                      name="guladarah"
                      placeholder="Gula Darah"
                      size="large"
                      className="mb-4 border"
                      value={formUpdate.guladarah}
                      onChange={handleUpdateChange}
                      required
                    />
                    <Button
                      className="text-white bg-sky-950 w-full"
                      htmlType="submit"
                      size="large"
                    >
                      Update
                    </Button>
                  </form>

                  {serverData?.data[0]?.guladarah && (
                    <div className="mt-6 px-4">
                      <h3 className="font-semibold text-lg">Riwayat:</h3>
                      <p>Tanggal pemeriksaan: <span className="font-semibold">{moment(serverData?.data[0]?.dategd).format('DD MMMM YYYY')}</span></p>
                      <p>Gula darah: <span className="font-semibold">{serverData?.data[0]?.guladarah} gr/dl ({kategoriGulaDarah})</span></p>
                    </div>
                  )}
                </div>
              </Collapse.Panel>
              <Collapse.Panel header="IMT" key="3">
                <div className="py-6">
                  <form className="px-4 items-center" onSubmit={handleSubmit}>
                    <Input
                      type="number"
                      name="tb"
                      placeholder="Tinggi Badan"
                      size="large"
                      className="mb-4 border"
                      value={formUpdate.tb}
                      onChange={handleUpdateChange}
                      required
                    />
                    <Input
                      type="number"
                      name="bb"
                      placeholder="Berat Badan"
                      size="large"
                      className="mb-4 border"
                      value={formUpdate.bb}
                      onChange={handleUpdateChange}
                      required
                    />
                    <Button
                      className="text-white bg-sky-950 w-full"
                      htmlType="submit"
                      size="large"
                    >
                      Update
                    </Button>
                  </form>
                  
                  {serverData?.data[0]?.tb && (
                    <div className="mt-6 px-4">
                      <h3 className="font-semibold text-lg">Riwayat:</h3>
                      <p>Tinggi badan: <span className="font-semibold">{serverData?.data[0]?.tb} cm</span></p>
                      <p>Berat badan: <span className="font-semibold">{serverData?.data[0]?.bb} kg</span></p>
                      <p>IMT: <span className="font-semibold">{iMTBulat} ({kategoriIMT})</span></p>
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