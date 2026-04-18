import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../app/store";
import { logoutApi } from "../../../features/auth/api/authApi";
import { useMyProfile } from "../../../features/auth/hooks/useMyProfile";
import Avatar from "../ui/Avatar";
import SearchBar from "../../../features/discovery/components/SearchBar";

const NAV_LINKS = [
  { to: "/", label: "Discover" },
  { to: "/categories", label: "Categories" },
  { to: "/projects/create", label: "Start Project" },
];

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const { data: profileResponse } = useMyProfile();
  const fetchedUser = profileResponse?.data?.data || profileResponse?.data;
  const displayUser = fetchedUser || user;

  const parseProfilePicture = (url: string | undefined | null) => {
    if (!url) return undefined;
    if (url.includes("googleusercontent.com")) {
      const decoded = decodeURIComponent(url);
      const match = decoded.match(/(https:\/\/.+)/);
      if (match) return match[0];
    }
    return url;
  };

  // const links = useMemo(
  //   () => [
  //     { to: "/", label: "Home" },
  //     { to: "/categories", label: "Categories" },
  //     { to: "/projects/create", label: "Start Project" },
  //   ],
  //   [],
  // );
  function handleSearch(e: { preventDefault(): void }) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  }

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

        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
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
          {accessToken ? (
            <>
              <NavLink
                to="/my-profile"
                className="text-sm font-medium text-on-surface-variant hover:bg-surface-container-low rounded-lg px-3 py-2 transition-colors"
              >
                Profile
              </NavLink>
              <button
                type="button"
                onClick={async () => {
                  const refresh = localStorage.getItem("refreshToken");
                  if (refresh) {
                    try {
                      await logoutApi(refresh);
                    } catch (e) {
                      console.error(e);
                    }
                  }
                  logout();
                }}
                className="text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low rounded-xl px-4 py-2 transition-colors"
              >
                Log Out
              </button>
              <Link
                to="/my-profile"
                className="hover:opacity-80 transition-opacity shrink-0"
              >
                <Avatar
                  src={parseProfilePicture(displayUser?.profile_picture)}
                  initials={
                    displayUser?.first_name
                      ? (
                        displayUser.first_name.charAt(0) +
                        (displayUser.last_name
                          ? displayUser.last_name.charAt(0)
                          : "")
                      ).toUpperCase()
                      : displayUser?.username
                        ? displayUser.username.charAt(0).toUpperCase()
                        : "?"
                  }
                />
              </Link>
            </>
          ) : (
            <NavLink
              to="/authenticate"
              className="rounded-xl bg-linear-to-br from-primary to-primary-container px-5 py-2.5 text-sm font-bold text-on-primary shadow-md active:scale-95 transition-all duration-200"
            >
              Start Now
            </NavLink>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="lg:hidden rounded-xl border border-outline-variant/30 p-2 text-on-surface-variant"
          aria-label="Toggle menu"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-outline-variant/20 bg-white px-6 py-4 flex flex-col gap-3">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 rounded-xl bg-surface-container-low border border-outline-variant/20 px-3 py-2"
          >
            <svg
              className="h-4 w-4 shrink-0 text-outline"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-outline outline-none"
              placeholder="Search projects..."
            />
          </form>

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

          {accessToken ? (
            <>
              <NavLink
                to="/my-profile"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low"
              >
                Profile
              </NavLink>
              <button
                type="button"
                onClick={async () => {
                  const refresh = localStorage.getItem("refreshToken");
                  if (refresh) {
                    try {
                      await logoutApi(refresh);
                    } catch (e) {
                      console.error(e);
                    }
                  }
                  logout();
                  setMenuOpen(false);
                }}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-left text-on-surface-variant hover:bg-surface-container-low"
              >
                Log Out
              </button>
            </>
          ) : (
            <NavLink
              to="/authenticate"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-linear-to-br from-primary to-primary-container px-5 py-2.5 text-sm font-bold text-on-primary text-center"
            >
              Start Now
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
}
