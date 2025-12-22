import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-5 bg-base-100">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
