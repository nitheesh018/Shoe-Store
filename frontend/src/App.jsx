import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        newestOnTop={true}
        closeOnClick
        draggable
        theme="dark"
      />

      {/* Page Layout */}
      <div className="flex bg-[#121212] min-h-screen text-white">
        {/* Sidebar Navigation */}
        <Navigation />

        {/* Routed Page Content */}
        <main className="flex-1 overflow-x-auto p-4">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default App;
