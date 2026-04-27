import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";

const Footer = ({ isAdmin = false }) => {
  return (
    <footer className="self-stretch bg-slate-900 px-4 pb-8 pt-12 sm:px-6 lg:px-10 xl:px-16">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
        {/* Top Section: Logo + All Link Columns */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Logo and About Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center">
              <img
                src={"/logo.png"}
                className="mr-3 h-10 w-10 object-contain sm:h-12 sm:w-12"
                alt="Logo"
              />
              <span className="text-2xl font-bold text-white sm:text-[32px]">EduMart</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              EduMart is a comprehensive digital learning platform offering Live Classes, E-Library, and Online Test Series to help students learn, practice, and succeed in a competitive environment.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-white/80 transition-colors hover:text-white">About Us</Link></li>
              <li><Link to="/features" className="text-sm text-white/80 transition-colors hover:text-white">Our Features</Link></li>
              <li><Link to="/contact" className="text-sm text-white/80 transition-colors hover:text-white">Contact Us</Link></li>
              <li><Link to="/instructor-signup" className="text-sm text-white/80 transition-colors hover:text-white">Careers</Link></li>
              <li><Link to="/blogs" className="text-sm text-white/80 transition-colors hover:text-white">Blogs</Link></li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white" onClick={() => window.location.href = '/features'}>Services</h3>
            <ul className="space-y-2">
              <li><span className="cursor-pointer text-sm text-white/80 transition-colors hover:text-white" onClick={() => window.location.href = '/features'}>Online Classes</span></li>
              <li><span className="cursor-pointer text-sm text-white/80 transition-colors hover:text-white" onClick={() => window.location.href = '/features'}>Practical Labs</span></li>
              <li><span className="cursor-pointer text-sm text-white/80 transition-colors hover:text-white" onClick={() => window.location.href = '/features'}>E-Library</span></li>
              <li><span className="cursor-pointer text-sm text-white/80 transition-colors hover:text-white" onClick={() => window.location.href = '/features'}>Weekly Tests</span></li>
              <li><span className="cursor-pointer text-sm text-white/80 transition-colors hover:text-white" onClick={() => window.location.href = '/features'}>Tutors Marketplace</span></li>
              <li><span className="cursor-pointer text-sm text-white/80 transition-colors hover:text-white" onClick={() => window.location.href = '/features'}>School Events</span></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy-policy" className="text-sm text-white/80 transition-colors hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="text-sm text-white/80 transition-colors hover:text-white">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" className="text-sm text-white/80 transition-colors hover:text-white">Refund Policy</Link></li>
              <li><Link to="/faqs" className="text-sm text-white/80 transition-colors hover:text-white">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact Info & Follow Us Combined Column */}
          <div>
            {/* Contact Info */}
            <div className="mb-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Contact Us</h3>
              <div className="space-y-2 text-sm text-white/80">
                <p>📍 Scheme No 54, Vijay Nagar, Indore, Madhya Pradesh, India</p>
                <p>📞 +91 78987 81533</p>
                <p>📧 karominfo@kacpl.in</p>
              </div>
            </div>

            {/* Follow Us */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Follow Us</h3>
              <div className="flex flex-wrap gap-4">
                <a href="https://www.facebook.com/profile.php?id=61587711429879" target="_blank" rel="noopener noreferrer" className="cursor-pointer text-white/80 hover:text-white transition-colors">
                  <FaFacebook size={22} />
                </a>
                <a href="https://www.instagram.com/karom_edumart" target="_blank" rel="noopener noreferrer" className="cursor-pointer text-white/80 hover:text-white transition-colors">
                  <FaInstagram size={22} />
                </a>
                <a href="https://www.linkedin.com/company/karom-edumart" target="_blank" rel="noopener noreferrer" className="cursor-pointer text-white/80 hover:text-white transition-colors">
                  <FaLinkedin size={22} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className={`mt-8 mb-10 pl-[-20px] pt-5 ${isAdmin ? 'border-t border-[#5b6255]' : 'border-t border-[#6c7564]'} justify-between items-center flex-col md:flex-row flex gap-6 md:gap-0`}>
          <p className={`text-sm sm:text-base ${isAdmin ? 'text-white' : 'text-white'}`} onClick={() => window.open('https://www.alphanexis.com', '_blank')}>
            © {new Date().getFullYear()} Developed By. Alphanexis Technologies PVT.Ltd.
          </p>
          <div className="flex gap-3 pr-32">
            <a
              href="https://www.linkedin.com/company/alphanexis/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-[#6c7564] flex items-center justify-center hover:border-[#d7d0bf] hover:bg-[#5b6255] text-white hover:text-[#efece6] transition-all duration-200"
              title="LinkedIn"
            >
              <FaLinkedin className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com/yourpage"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-[#6c7564] flex items-center justify-center hover:border-[#d7d0bf] hover:bg-[#5b6255] text-white hover:text-[#efece6] transition-all duration-200"
              title="Instagram"
            >
              <FaInstagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.facebook.com/people/AlphaNexis/61562936054548/?rdid=vrnyFSNe5naB2gz7&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1My4zij8wm%2F"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-[#6c7564] flex items-center justify-center hover:border-[#d7d0bf] hover:bg-[#5b6255] text-white hover:text-[#efece6] transition-all duration-200"
              title="Facebook"
            >
              <FaFacebook className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/8817617752"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-[#6c7564] flex items-center justify-center hover:border-[#d7d0bf] hover:bg-[#5b6255] text-white hover:text-[#efece6] transition-all duration-200"
              title="WhatsApp"
            >
              <FaWhatsapp className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;