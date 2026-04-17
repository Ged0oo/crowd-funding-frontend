import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../../../app/store";
import Avatar from "../ui/Avatar";
import SearchBar from "../../../features/discovery/components/SearchBar";

const NAV_LINKS = [
  { to: "/",            label: "Discover" },
  { to: "/categories",  label: "Featured"  },
  { to: "/projects/create", label: "Start Project" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between gap-6 px-8 py-4 max-w-full mx-auto">

        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-2xl font-black bg-linear-to-br from-emerald-700 to-emerald-500 bg-clip-text text-transparent font-headline tracking-tight"
          >
            The Digital Oasis
          </Link>

          <SearchBar className="hidden lg:block w-80" />
        </div>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-primary px-3 py-1 text-sm font-bold text-primary font-headline"
                  : "px-3 py-1 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <NavLink
                to="/profile"
                className="text-sm font-medium text-on-surface-variant hover:bg-surface-container-low rounded-lg px-3 py-2 transition-colors"
              >
                Profile
              </NavLink>
              <button
                type="button"
                onClick={logout}
                className="text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low rounded-xl px-4 py-2 transition-colors"
              >
                Log Out
              </button>
              <Avatar
                src={user.profile_picture}
                initials={(user.first_name.charAt(0) + user.last_name.charAt(0)).toUpperCase()}
              />
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low rounded-xl px-4 py-2 transition-colors"
              >
                Log In
              </NavLink>
              <NavLink
                to="/authenticate"
                className="rounded-xl bg-linear-to-br from-primary to-primary-container px-5 py-2.5 text-sm font-bold text-on-primary shadow-md active:scale-95 transition-all duration-200"
              >
                Start Now
              </NavLink>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden rounded-xl border border-outline-variant/30 p-2 text-on-surface-variant"
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-outline-variant/20 bg-white px-6 py-4 flex flex-col gap-3">
          <SearchBar />

          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "rounded-xl bg-surface-container-low px-4 py-2.5 text-sm font-bold text-primary"
                  : "rounded-xl px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low"
              }
            >
              {link.label}
            </NavLink>
          ))}

          {user ? (
            <>
              <NavLink to="/profile" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low">
                Profile
              </NavLink>
              <button type="button" onClick={() => { logout(); setMenuOpen(false); }} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-left text-on-surface-variant hover:bg-surface-container-low">
                Log Out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low">
                Log In
              </NavLink>
              <NavLink to="/authenticate" onClick={() => setMenuOpen(false)} className="rounded-xl bg-linear-to-br from-primary to-primary-container px-5 py-2.5 text-sm font-bold text-on-primary text-center">
                Start Now
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}
