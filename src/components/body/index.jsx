import { Link } from "react-router-dom";
import Footer from "../footer";

const Body = () => {
  return (
    <div className="font-sans">
      <div className="flex justify-center pt-[150px] px-4 bg-gray-100 py-20">
        <div className="max-w-6xl">
          <h3 className="text-[50px] justify-center flex font-semibold mb-6">
            Company
          </h3>
          <div className="text-lg leading-relaxed text-gray-700 text-center">
            Tech Farid Inc. is a forward-thinking software engineering company
            dedicated to creating transformative digital solutions that redefine
            industries. With a diverse team of skilled developers, designers,
            and project managers, Tech Innovators Inc. has spent years building
            robust applications and platforms that enhance productivity and
            drive innovation. From artificial intelligence and machine learning
            to cloud computing and cybersecurity, their expertise covers a wide
            range of cutting-edge technologies. The company’s work has been
            showcased in various tech conferences and industry publications, and
            they actively collaborate with startups and enterprises to bring
            visionary ideas to life. Join Tech Innovators Inc. on their journey
            to revolutionize the digital landscape, empowering businesses and
            individuals with the tools to succeed in an ever-evolving
            technological world.
          </div>
        </div>
      </div>

      <div className="bg-black text-white py-16 text-center">
        <h2 className="text-[40px] font-bold mb-5">Explore Our Website</h2>
        <Link to="/login">
          <button className="bg-white text-black px-8 py-3 rounded shadow-md transition duration-300 hover:bg-gray-200">
            Explore
          </button>
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default Body;
