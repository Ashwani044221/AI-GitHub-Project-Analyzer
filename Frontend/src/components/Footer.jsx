const Footer = () => {
  return (
    <footer className="border-t border-blue-900/20 bg-[#040B1E]">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI GitHub
            </h2>

            <p className="mt-4 text-slate-400 leading-relaxed">
              AI-powered project analysis platform helping developers
              improve GitHub repositories, resumes, interview skills,
              and career growth.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Product
            </h3>

            <ul className="space-y-3 text-slate-400">
              <li className="hover:text-white cursor-pointer">
                GitHub Analysis
              </li>
              <li className="hover:text-white cursor-pointer">
                Resume Review
              </li>
              <li className="hover:text-white cursor-pointer">
                Interview Questions
              </li>
              <li className="hover:text-white cursor-pointer">
                Skill Gap Analysis
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Resources
            </h3>

            <ul className="space-y-3 text-slate-400">
              <li className="hover:text-white cursor-pointer">
                Documentation
              </li>
              <li className="hover:text-white cursor-pointer">
                Blog
              </li>
              <li className="hover:text-white cursor-pointer">
                Career Tips
              </li>
              <li className="hover:text-white cursor-pointer">
                Support
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Contact
            </h3>

            <ul className="space-y-3 text-slate-400">
              <li>support@aigithub.com</li>
              <li>help@aigithub.com</li>
              <li>Available 24/7</li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-blue-900/20 mt-12 pt-8">

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} AI GitHub Project Analyzer.
              All rights reserved.
            </p>

            <div className="flex items-center gap-6 text-slate-500 text-sm">
              <span className="hover:text-white cursor-pointer">
                Privacy Policy
              </span>

              <span className="hover:text-white cursor-pointer">
                Terms of Service
              </span>

              <span className="hover:text-white cursor-pointer">
                Cookies
              </span>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;