

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"

import { ThemeProvider } from "../src/components/ThemeProvider/theme-provider"
// import LandingPage from "./pages/LandingPage/LandingPage";
import Ehr from "./pages/EhrPage/EhrPage";
import DoctorDashboard from "./pages/DoctorDashboard/DoctorDashboard";
import InventoryPage from "./pages/Inventory/InventoryPage";
import Appointments from "./pages/Appointments/Appointments";
import PatientDetails from "./components/PatientRecord1";
import MedicalHistory from "./components/MedicalHistory";
import DoctorDetails from "./components/DoctorInfo";
import TestReport from "./components/TestReport";
import GeneralUserDashboard from './pages/DashboardPage/GeneralUserDashboard'
import DoctorAppointments from "./pages/DoctorPages/AppointmentsPage/DoctorAppointments";
import Dashboard from "./pages/DashboardPage/Dashboard";
import InternetIdentity from "./pages/Login-Signup/InternetIdentity"
import LoginSignup from "./pages/Login-Signup/Login-Signup"
import MetaMaskAuth from "./pages/Login-Signup/Metamask"
import Medications from "./pages/Medications/medications"
import Emergency from "./pages/Emergency/emergency"

import LandingPage from "./pages/LandingPage/LandingPage";


function App() {

  const router = createBrowserRouter([
    
    // other pages....
    {
      path: "/",
      element: <LandingPage />,

    },
    {
      path: "/login",
      element: <LoginSignup />,

    },
    {
      path: "/medications",
      element: <Medications/>,
    },
    
    {
      path: "/internetidentity",
      element:<InternetIdentity/>
    },
    {
      path: "/emergency",
      element: <Emergency/>,
    },
    {
      path: "/metamask",
      element:<MetaMaskAuth/>
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/user-dashboard",
      element: <GeneralUserDashboard></GeneralUserDashboard>,
    },
    // other pages....
    {
      path: "/health-records",
      element: <Ehr />,
    },

    {
      path: "/doctor-dashboard",
      element: <DoctorDashboard />,
    },

    {
      path: "/inventory",
      element: <InventoryPage />,
    },
    

    {
      path: "/appointments",
      element: <Appointments />,
    },
    {
      path: "/patient/:id",
      element: <PatientDetails />
    },
    {
      path: "/patient/:id/medical-history",
      element: <MedicalHistory />
    },
    {
      path: "/patient/:id/test-report",
      element: <TestReport />
    },
    {
      path: "/doctor/:id",
      element: <DoctorDetails/>
    },
    {
      path:"/doctor-appointments",
      element: <DoctorAppointments />
    },

    {
      path: "*",
      
      element: <h1>404</h1>,
    }


  ])


  return (
    <div className="overflow-hidden">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

      <RouterProvider router={router} />
      </ThemeProvider>

      
    </div>
  )
}

export default App;