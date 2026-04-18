import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50">
      <div className="flex flex-col md:flex-row justify-between items-center px-12 py-16 gap-8 max-w-[1440px] mx-auto">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <span className="text-xl font-bold text-slate-900 font-headline">
            The Digital Oasis
          </span>
          <p className="text-slate-500 text-sm max-w-xs text-center md:text-left">
            The premium marketplace for discovering and backing the future of growth in the Nile valley and beyond.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
          <Link to="/" className="text-slate-500 text-sm hover:text-emerald-500 transition-all">About Us</Link>
          <Link to="/" className="text-slate-500 text-sm hover:text-emerald-500 transition-all">Terms of Service</Link>
          <Link to="/" className="text-slate-500 text-sm hover:text-emerald-500 transition-all">Privacy Policy</Link>
          <Link to="/" className="text-slate-500 text-sm hover:text-emerald-500 transition-all">Contact Support</Link>
        </div>

        {/* Social + Copyright */}
        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-slate-400 hover:text-emerald-600 cursor-pointer">public</span>
            <span className="material-symbols-outlined text-slate-400 hover:text-emerald-600 cursor-pointer">chat_bubble</span>
            <span className="material-symbols-outlined text-slate-400 hover:text-emerald-600 cursor-pointer">share</span>
          </div>
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} The Digital Oasis Crowdfunding. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
