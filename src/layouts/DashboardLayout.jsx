import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col bg-base-100 min-h-screen">
        {/* Navbar / Toggle for Mobile */}
        <div className="w-full flex items-center p-4 lg:hidden bg-base-200">
          <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost drawer-button lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </label>
          <span className="font-bold ml-4">Blood Donation App</span>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-6 flex-1">
          <Outlet />
        </div>
      </div>
      <div className="drawer-side h-full z-50">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <Sidebar />
      </div>
    </div>
  );
};

export default DashboardLayout;
