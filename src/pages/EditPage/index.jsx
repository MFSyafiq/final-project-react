import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/footer";

const EditPage = () => {
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios
        .get(`https://reqres.in/api/users/${id}`)
        .then((res) => {
          console.log("masuk");
          setName(res.data.data.first_name);
          setJob(res.data.data.job || "");
        })
        .catch((err) => {
          console.log("gagal");
          setError("Error fetching user data");
        });
    }
  }, [id]);

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangeJob = (e) => {
    setJob(e.target.value);
  };

  const handleCancel = () => {
    navigate(`/menu-page`);
  };

  const handleEdit = () => {
    if (name === "" || job === "") {
      setError("Name and job fields are required");
      setSuccess(false);
      return;
    }

    const payload = {
      name: name,
      job: job,
    };

    axios
      .put(`https://reqres.in/api/users/${id}`, payload)
      .then((res) => {
        console.log("bisaaa");
        setSuccess(true);
        setError(false);

        setTimeout(() => {
          navigate("/");
        }, 3000);
      })
      .catch((err) => {
        console.log("gak bisaa");
        setError(err?.response?.data?.error || "An error occurred");
        setSuccess(false);
      });
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="bg-white rounded-xl flex flex-col gap-6 p-8 shadow-lg max-w-md w-full mx-4">
          <p className="text-2xl font-semibold justify-center flex">
            Edit User
          </p>

          <input
            className="bg-gray-200 border rounded-lg p-2 pl-4 w-full"
            type="text"
            placeholder="Name"
            value={name} // Masukkan nilai state 'name'
            onChange={handleChangeName}
          />
          <input
            className="bg-gray-200 border rounded-lg p-2 pl-4 w-full"
            type="text"
            placeholder="Job"
            value={job} // Masukkan nilai state 'job'
            onChange={handleChangeJob}
          />
          {error && (
            <p className="text-red-400 font-bold text-center">{error}</p>
          )}
          {success && (
            <p className="text-green-400 font-bold text-center">
              User updated successfully!
            </p>
          )}

          {/* Mengatur div induk tombol */}
          <div className="flex flex-col items-center gap-4">
            <button
              className="bg-black text-white rounded-lg p-2 w-1/2 hover:bg-black transition-colors"
              onClick={handleEdit}
            >
              Confirm
            </button>

            <button
              className="bg-red-700 text-white rounded-lg p-2 w-1/2 hover:bg-red-800 transition-colors"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EditPage;
