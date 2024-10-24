import { useEffect, useState } from "react";

const Modal = ({ isModalOpen }) => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
      },
    };
    const formData = new FormData();
    formData.append("image", file);
    axios
      .post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/upload-image",
        formData,
        config
      )
      .then((res) => {})
      .catch((err) => {});
  };

  useEffect(() => {
    if (file) {
      handleUpload();
    }
  }, [file]);

  return (
    <div>
      <h1>Modal</h1>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default Modal;
