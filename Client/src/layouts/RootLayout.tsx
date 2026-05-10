import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const RootLayout: React.FC = () => {
  return (
    <div className="app-root">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
