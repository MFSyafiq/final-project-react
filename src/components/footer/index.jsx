export const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-900 text-white py-8">
        <div className=" mx-auto px-4">
          {/* Flex container for the three sections with space between */}
          <div className="flex justify-between mb-8">
            {/* Hubungi Kami Section */}
            <div className="w-1/3">
              <h3 className="text-2xl font-semibold mb-4">Hubungi Kami</h3>
              <ul className="text-lg">
                <li>
                  Email:{" "}
                  <a
                    href="mailto:support@sportres.com"
                    className="text-blue-400"
                  >
                    support@sportres.com
                  </a>
                </li>
                <li>
                  Telepon:{" "}
                  <a href="tel:+1234567890" className="text-blue-400">
                    +1 234 567 890
                  </a>
                </li>
                <li>Alamat: Jl. Olahraga No. 123, Jakarta, Indonesia</li>
              </ul>
            </div>

            {/* Quick Links Section */}
            <div className="w-1/3">
              <h3 className="text-2xl font-semibold mb-4">Quick Links</h3>
              <ul className="text-lg">
                <li>
                  <a href="/about" className="text-blue-400">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-blue-400">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-blue-400">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Follow Us Section */}
            <div className="w-1/3">
              <h3 className="text-2xl font-semibold mb-4">Follow Us</h3>
              <ul className="flex space-x-6 text-lg">
                <li>
                  <a
                    href="https://facebook.com/sportres"
                    className="text-blue-400"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/sportres"
                    className="text-blue-400"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/sportres"
                    className="text-blue-400"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright Section */}
          <div>
            <p className="text-lg text-center">
              &copy; Sport Res. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
