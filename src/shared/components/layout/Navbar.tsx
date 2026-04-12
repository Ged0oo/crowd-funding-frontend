import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import SearchBar from "../../../features/discovery/components/SearchBar";
import { useAuthStore } from "../../../app/store";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const links = useMemo(
    () => [
      { to: "/", label: "Home" },
      { to: "/categories/technology", label: "Categories" },
      { to: "/projects/create", label: "Start Project" },
    ],
    [],
  );

  return (
    <header className="sticky top-0 z-50 border-b border-amber-900/15 bg-amber-50/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-amber-900"
        >
          CrowdFund Dev
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="ml-auto rounded-md border border-amber-900/20 px-3 py-1 text-sm text-amber-900 md:hidden"
          aria-label="Toggle menu"
        >
          Menu
        </button>

        <nav
          className={`w-full items-center gap-3 md:flex md:w-auto ${menuOpen ? "flex" : "hidden"} flex-col md:flex-row`}
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-amber-900 text-white"
                    : "text-amber-900 hover:bg-amber-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <SearchBar className="w-full md:w-72" />

          {user ? (
            <div className="flex items-center gap-2">
              <NavLink
                to="/profile"
                className="rounded-md px-3 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100"
              >
                Profile
              </NavLink>
              <button
                type="button"
                onClick={logout}
                className="rounded-md bg-stone-900 px-3 py-2 text-sm font-medium text-white hover:bg-stone-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink
                to="/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-md bg-amber-900 px-3 py-2 text-sm font-medium text-white hover:bg-amber-800"
              >
                Register
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
