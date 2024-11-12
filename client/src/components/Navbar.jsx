import { Outlet, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <header>
        <nav className="navbar flex justify-end">
          <ul>
            <li className="btn-navbar underline inline-block mr-3">
              <a href="/">
                <img
                  src="image/login.png"
                  alt="login icon"
                  className="inline-block mr-1"
                  height="45px"
                  width="45px"
                />
              </a>
              <NavLink
                to="/"
                className={({ isActive }) => {
                  return isActive && "text-primary";
                }}
              >
                Sign Up
              </NavLink>
            </li>
            <li className="btn-navbar underline inline-block mr-3">
              <a href="/login">
                <img
                  src="image/login.png"
                  alt="login icon"
                  className="inline-block mr-1"
                  height="45px"
                  width="45px"
                />
              </a>
              <NavLink
                to="/login"
                className={({ isActive }) => {
                  return isActive && "text-primary";
                }}
              >
                Login
              </NavLink>
            </li>
            <li className="btn-navbar underline inline-block mr-3">
              <a href="/transcode">
                <img
                  src="image/transcode.png"
                  alt="transcode icon"
                  className="inline-block mr-1"
                  height="45px"
                  width="45px"
                />
              </a>
              <NavLink
                to="transcode"
                className={({ isActive }) => {
                  return isActive && "text-primary";
                }}
              >
                Transcode/Download
              </NavLink>
            </li>
            <li className="btn-navbar underline inline-block mr-3">
              <a href="/videos">
                <img
                  src="/image/list.png"
                  alt="list icon"
                  className="inline-block mr-1"
                  height="45px"
                  width="45px"
                />
              </a>
              <NavLink
                to="videos"
                className={({ isActive }) => {
                  return isActive && "text-primary";
                }}
              >
                Video List
              </NavLink>
            </li>
            <li className="btn-navbar underline inline-block mr-3">
              <a href="/upload">
                <img
                  src="image/upload.png"
                  alt="upload icon"
                  className="inline-block mr-1"
                  height="45px"
                  width="45px"
                />
              </a>
              <NavLink
                to="upload"
                className={({ isActive }) => {
                  return isActive && "text-primary";
                }}
              >
                Upload
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <Outlet />
    </>
  );
}
