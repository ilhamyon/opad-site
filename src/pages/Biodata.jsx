import { Button, Input, Select, message } from "antd"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { isAuthenticated } from "../utils/auth";
import { sanityClient } from "../lib/sanity/getClient";

const { Option } = Select;

function Biodata() {
  const navigate = useNavigate();
  const opadData = JSON.parse(localStorage.getItem('opadData'));
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
          umur,
          gender,
          alamat,
          faskes,
          tb,
          bb,
          keluhan,
          telepon,
          resiko
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
  console.log('cek biodata: ', serverData)

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
                  umur: opadData.umur,
                  gender: opadData.gender,
                  alamat: opadData.alamat,
                  faskes: opadData.faskes,
                  tb: opadData.tb,
                  bb: opadData.bb,
                  keluhan: opadData.keluhan,
                  telepon: opadData.telepon,
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
    umur: "",
    gender: "",
    alamat: "",
    faskes: "",
    tb: "",
    bb: "",
    keluhan: "",
    telepon: "",
  });

  useEffect(() => {
    setFormUpdate({
      umur: serverData?.data[0]?.umur || "",
      gender: serverData?.data[0]?.gender || "Jenis Kelamin",
      alamat: serverData?.data[0]?.alamat || "",
      faskes: serverData?.data[0]?.faskes || "",
      tb: serverData?.data[0]?.tb || "",
      bb: serverData?.data[0]?.bb || "",
      keluhan: serverData?.data[0]?.keluhan || "",
      telepon: serverData?.data[0]?.telepon || "",
    });
  }, [serverData]);

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setFormUpdate({ ...formUpdate, [name]: value });
  };

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      // Send POST request to your Sanity backend to create a new user
      await updateSanityUser(formUpdate);

      message.success("Update biodata berhasil.")
      navigate('/screening');

    } catch (error) {
      console.error('Error registering user:', error);
    }
  }
  return (
    <>
      <section>
        <div className="lg:flex">
          <div className="lg:w-1/2 lg:py-0 py-10 flex items-center">
            <form className="w-full lg:px-28 px-4 items-center" onSubmit={handleSubmit}>
              <h2 className="font-bold text-[18px] lg:text-4xl mb-10 text-gray-900 uppercase">Biodata <span className="text-sm">({opadData[0]?.name})</span></h2>
              <Input
                type="text"
                name="umur"
                placeholder="Umur"
                size="large"
                className="mb-4 border"
                value={formUpdate.umur}
                onChange={handleUpdateChange}
                required
              />
              <Select
                defaultValue="Laki-laki"
                name="gender"
                size="large"
                className="mb-4 w-full"
                placeholder="Jenis Kelamin"
                required
                value={formUpdate.gender}
                onChange={(value) => setFormUpdate({ ...formUpdate, gender: value })}
              >
                <Option value="Laki-laki">Laki-laki</Option>
                <Option value="Perempuan">Perempuan</Option>
              </Select>
              <Input
                type="text"
                name="alamat"
                placeholder="Alamat"
                size="large"
                className="mb-4 border"
                value={formUpdate.alamat}
                onChange={handleUpdateChange}
                required
              />
              <Input
                type="text"
                name="faskes"
                placeholder="Fasyankes yang digunakan"
                size="large"
                className="mb-4 border"
                value={formUpdate.faskes}
                onChange={handleUpdateChange}
                required
              />
              <Input
                type="text"
                name="tb"
                placeholder="Tinggi Badan"
                size="large"
                className="mb-4 border"
                value={formUpdate.tb}
                onChange={handleUpdateChange}
                required
              />
              <Input
                type="text"
                name="bb"
                placeholder="Berat Badan"
                size="large"
                className="mb-4 border"
                value={formUpdate.bb}
                onChange={handleUpdateChange}
                required
              />
              <Input
                type="text"
                name="keluhan"
                placeholder="Keluhan Saat Ini"
                size="large"
                className="mb-4 border"
                value={formUpdate.keluhan}
                onChange={handleUpdateChange}
              />
              <Input
                type="number"
                name="telepon"
                placeholder="Nomor Telepon"
                size="large"
                className="mb-8 border"
                value={formUpdate.telepon}
                onChange={handleUpdateChange}
              />
              <Button
                className="text-white bg-rose-700 w-full"
                htmlType="submit"
                size="large"
              >
                Submit
              </Button>
              <p className="flex justify-center text-sm font-light mt-8 text-gray-500">
                <Link to="/home" className="text-rose-700"> Back to Home</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default Biodata