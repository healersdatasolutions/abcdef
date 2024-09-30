

// import { AppleCardsCarouselDemo } from '../../components/ExpandableCarousel';
// import '../../index.css';




    import { useTheme } from '../../components/ThemeProvider/theme-provider';
//import React from 'react';
//import { AnimatedPinDemo } from '../../components/3dPinReal';
import Section from '../../components/Section/Section';
import Heading from '../../components/Heading/Heading';
import { Link } from 'react-router-dom';
import { PinContainer } from '../../components/ui/3d-pin';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../../declarations/healers-healthcare-backend/healers-healthcare-backend.did.js';
import { _SERVICE as HospitalService } from '../../../../declarations/healers-healthcare-backend/healers-healthcare-backend.did';
import { useEffect, useState } from 'react';
import { InterfaceFactory } from '@dfinity/candid/lib/cjs/idl';
function Dashboard() {
    const { theme } = useTheme();
    const [hospitalActor, setHospitalActor] = useState<HospitalService | null>(null);
    const [patientCount, setPatientCount] = useState<number>(0);
    const [appointmentCount, setAppointmentCount] = useState<number>(0);
    const [doctorCount, setDoctorCount] = useState<number>(0);
    const [inventoryCount, setInventoryCount] = useState<number>(0);

    const backgroundImage = theme === 'dark' ? '/webglBG.png' : '/webgl3.jpg';
    
    useEffect(() => {
      const initHospitalActor = async () => {
          const hospitalCanisterId = localStorage.getItem('hospitalCanisterId');
          if (!hospitalCanisterId) {
              console.error('Hospital canister ID not found');
              return;
          }

          const agent = new HttpAgent({ host: 'http://localhost:4943' });
          await agent.fetchRootKey();
          
          const actor = Actor.createActor<HospitalService>(idlFactory as unknown as InterfaceFactory, {
              agent,
              canisterId: hospitalCanisterId,
          });

          setHospitalActor(actor);

          // Fetch initial data
          const patients = await actor.listPatients();
          setPatientCount(patients.length);

          const appointments = await actor.listAppointments();
          setAppointmentCount(appointments.length);

          const doctors = await actor.listDoctors();
          setDoctorCount(doctors.length);

          const inventories = await actor.listInventories();
          setInventoryCount(inventories.length);
      };

      initHospitalActor();
  }, []);

    return (
      <>
          {/* <NavbarDemo/> */}
          <div>
                <Section className="overflow-hidden" id="3dPins">
                    <div className="container md:pb-10">
                        <Heading title="Hospital Dashboard" />
                    </div>
                </Section>

                <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full pl-10 pr-10">
                    <Link to="/health-records">
                        <div className="h-[24rem] w-full flex items-center justify-center ">
                            <PinContainer title="Health Record" href="#">
                                <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
                                    <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
                                        Health Records
                                    </h3>
                                    <div className="text-base !m-0 !p-0 font-normal">
                                        <span className="text-slate-500 ">
                                            Total Patients: {patientCount}
                                        </span>
                                    </div>
                                    <img src="medicalrecord.jpg" alt="HealthRecord"/>
                                </div>
                            </PinContainer>
                        </div>
                    </Link>

                    <Link to="/doctor-dashboard">
                        <div className="h-[24rem] w-full flex items-center justify-center ">
                            <PinContainer title="Doctor Dashboard" href="#">
                                <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
                                    <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
                                        Doctor Dashboard
                                    </h3>
                                    <div className="text-base !m-0 !p-0 font-normal">
                                        <span className="text-slate-500 ">
                                            Total Doctors: {doctorCount}
                                        </span>
                                    </div>
                                    <img src="doctdash.png" alt="DoctorDashboard" className="h-88"/>
                                </div>
                            </PinContainer>
                        </div>
                    </Link>

                    <Link to="/appointments">
                        <div className="h-[24rem] w-full flex items-center justify-center ">
                            <PinContainer title="Appointments" href="#">
                                <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
                                    <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
                                        Appointments
                                    </h3>
                                    <div className="text-base !m-0 !p-0 font-normal">
                                        <span className="text-slate-500 ">
                                            Total Appointments: {appointmentCount}
                                        </span>
                                    </div>
                                    <img src="app.png" alt="Appointments"/>
                                </div>
                            </PinContainer>
                        </div>
                    </Link>

                    <Link to="/inventory">
                        <div className="h-[24rem] w-full flex items-center justify-center ">
                            <PinContainer title="Inventory" href="#">
                                <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
                                    <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
                                        Inventory
                                    </h3>
                                    <div className="text-base !m-0 !p-0 font-normal">
                                        <span className="text-slate-500 ">
                                            Total Inventory Sections: {inventoryCount}
                                        </span>
                                    </div>
                                    <img src="inventory.jpg" alt="Inventory"/>
                                </div>
                            </PinContainer>
                        </div>
                    </Link>
                </div>
            </div>

      </>
    );
}


export default Dashboard;
   

