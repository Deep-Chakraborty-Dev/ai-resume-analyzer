import { Link } from 'react-router';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-pink-400 text-lg font-bold text-white shadow-lg">
          R
        </span>
        <div className="flex flex-col">
          <p className="text-2xl font-bold text-gradient leading-none">Resumer</p>
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
            AI review
          </span>
        </div>
      </Link>
      <Link to="/upload" className="primary-button w-fit">
        Upload Resume
      </Link>
    </nav>
  );
};

export default Navbar;
