import { Button, DatePicker, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sanityClient } from "../lib/sanity/getClient";
import { deauthUser, isAuthenticated } from "../utils/auth";
import moment from "moment";

const { Option } = Select;

function Profile() {
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
            ttl,
            gender,
            alamat,
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
                    name: opadData.name,
                    ttl: opadData.ttl,
                    gender: opadData.gender,
                    alamat: opadData.alamat,
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
      name: "",
      ttl: null,
      gender: "",
      alamat: "",
      telepon: "",
    });

    useEffect(() => {
      setFormUpdate({
        name: serverData?.data[0]?.name || "",
        ttl: serverData?.data[0]?.ttl || "",
        gender: serverData?.data[0]?.gender || "Jenis Kelamin",
        alamat: serverData?.data[0]?.alamat || "",
        telepon: serverData?.data[0]?.telepon || "",
      });
    }, [serverData]);

    const handleUpdateChange = (e) => {
      const { name, value } = e.target;
      setFormUpdate({ ...formUpdate, [name]: value });
    };

    const handleUpdateChangeDate = (date, dateString) => {
      if (dateString && moment(dateString, 'YYYY-MM-DD', true).isValid()) {
        setFormUpdate({ ...formUpdate, ttl: dateString });
      } else {
        // Tanggal tidak valid, Anda bisa menangani ini sesuai kebutuhan Anda
      }
    };
    

    async function handleSubmit(event) {
      event.preventDefault();
      try {
        // Send POST request to your Sanity backend to create a new user
        await updateSanityUser(formUpdate);

        message.success("Update biodata berhasil.")

      } catch (error) {
        console.error('Error registering user:', error);
      }
    }
    return (
      <div className="my-0 mx-auto min-h-full max-w-screen-sm bg-white mb-20">
          <div className="border-b-2 border-gray-400">
              <h2 className="text-xl font-bold px-4 py-4">Profile</h2>
          </div>

          <div className="py-10 pb-32">
            <form className="px-4 items-center" onSubmit={handleSubmit}>
              <h2 className="font-bold text-[18px] lg:text-4xl mb-10 text-gray-900 uppercase">Biodata <br/><span className="text-xl">({opadData[0]?.name})</span></h2>
              <Input
                type="text"
                name="name"
                placeholder="Nama"
                size="large"
                className="mb-4 border"
                value={formUpdate.name}
                onChange={handleUpdateChange}
                required
              />
              <DatePicker
                name="ttl"
                placeholder="Tanggal Lahir"
                size="large"
                className="mb-4 border w-full"
                value={formUpdate.ttl ? moment(formUpdate.ttl, 'YYYY-MM-DD') : null}
                onChange={handleUpdateChangeDate}
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
                type="number"
                name="telepon"
                placeholder="Nomor Telepon"
                size="large"
                className="mb-8 border"
                value={formUpdate.telepon}
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
            <div className="px-4 py-4">
              <Button size="large" onClick={deauthUser} className="bg-sky-950 text-white w-full">Logout</Button>
            </div>
          </div>
      </div>
    )
  }
  
  export default Profile