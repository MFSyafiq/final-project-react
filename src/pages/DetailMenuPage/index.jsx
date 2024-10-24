import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/footer";
import { useEffect, useState } from "react";
import axios from "axios";

const DetailMenuPage = () => {
  const [menu, setMenu] = useState({});
  const { id } = useParams();
  ("https://reqres.in/api/register");
  const getDetailMenu = () => {
    axios
      .get(`https://reqres.in/api/users/${id}`)
      .then((res) => {
        setMenu(res.data.data);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getDetailMenu();
  }, []);

  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(`/edit-page`);
  };

  return (
    <div>
      <div className="bg-gray-200 min-h-screen">
        <Navbar />
        <div className="flex flex-col md:flex-row pt-8 md:pl-8 md:gap-16 gap-8 justify-center items-center md:items-start">
          <div className="border rounded-lg bg-white p-4 max-w-[90%] md:max-w-[500px]">
            <img
              className="w-full h-auto rounded"
              src={menu?.avatar}
              alt={`${menu?.first_name} ${menu?.last_name}`}
            />
          </div>

          <div className="gap-4 flex flex-col border rounded-lg bg-white p-4 max-w-[90%] md:max-w-[500px]">
            <div className="font-bold text-[20px] pb-2">Our Team Profile</div>

            <div>{`Name: ${menu?.first_name} ${menu?.last_name}`}</div>
            <div>{`Email: ${menu?.email} `}</div>
            <div className="w-full text-left">
              {`${menu?.first_name} ${menu?.last_name}`} is a dedicated software
              engineer team based in Silicon Valley, California. With a diverse
              set of skills in programming languages, frameworks, and cloud
              technologies, they have spent years developing innovative software
              solutions for various industries. Their work has been recognized
              for enhancing user experiences and optimizing business operations.
              The team frequently collaborates with startups and established
              companies to tackle complex technical challenges. Outside of work,
              they enjoy participating in hackathons, contributing to
              open-source projects, and mentoring aspiring developers through
              coding boot camps and workshops.
            </div>
            <button
              className="bg-blue-500 text-white rounded-lg p-2 w-full hover:bg-blue-600 transition-colors"
              onClick={handleRedirect}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DetailMenuPage;
