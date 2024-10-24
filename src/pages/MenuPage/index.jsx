import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer";

const MenuPage = () => {
  const navigate = useNavigate();

  const [menu, setMenu] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: null,
    totalPage: null,
  });

  useEffect(() => {
    getMenuList();
  }, [pagination.page]);

  const ChangeToDetail = (id) => {
    navigate(`/menu-detail/${id}`);
  };

  const getMenuList = () => {
    axios
      .get(`https://reqres.in/api/users?page=${pagination.page}`)
      .then((res) => {
        setPagination((prev) => ({
          ...prev,
          perPage: res.data.per_page,
          total: res.data.total,
          totalPage: res.data.total_pages,
        }));

        setMenu(res.data.data);
      })
      .catch((err) => {});
  };

  const handleNext = () => {
    setPagination({
      ...pagination,
      page: pagination.page + 1,
    });
  };

  const handleBack = () => {
    setPagination({
      ...pagination,
      page: pagination.page - 1,
    });
  };

  return (
    <div>
      <div className="bg-gray-200 min-h-screen">
        <div>
          <Navbar />
          <h1 className="font-bold pt-10 px-4 md:px-10 text-center">
            Meet our team from all around the world.
          </h1>

          <div className="flex justify-center items-center py-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 px-4">
              {menu.map((user) => (
                <div
                  onClick={() => ChangeToDetail(user.id)}
                  className="bg-white rounded-xl flex flex-col items-center p-6 cursor-pointer shadow-lg transition-transform transform hover:scale-105"
                  key={user.id}
                >
                  <img
                    src={user.avatar}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-24 h-24 rounded-full mb-4"
                  />
                  <h2 className="font-semibold text-lg">{`${user.first_name} ${user.last_name}`}</h2>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-center items-center px-10 md:px-72 py-4">
            <button
              className={`bg-blue-500 text-white rounded-lg p-2 w-[100px] shadow-lg transition-colors ${
                pagination.page === 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }`}
              disabled={pagination.page === 1}
              onClick={handleBack}
            >
              Back
            </button>
            <button
              className={`bg-blue-500 text-white rounded-lg p-2 w-[100px] shadow-lg transition-colors ${
                pagination.page === pagination.totalPage
                  ? "bg-gray-400 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }`}
              disabled={pagination.page === pagination.totalPage}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MenuPage;
