// import Button from "../Buttons/Button";
import Heading from "../Heading/Heading";
import Section from "../Section/Section";
// import Tagline from "../Tagline/Tagline";
import { gradient, roadmap2, roadmap3, roadmap4 } from "../../assets";
import Lottie from 'react-lottie';
import animationData from '../../lotties/medical1.json';
import animationData2 from '../../lotties/medical2.json';
import animationData3 from '../../lotties/medical3.json';
import animationData4 from '../../lotties/medical4.json';
// import { MouseParallax } from "react-just-parallax";

// const defaultOptions = {
//     loop: true,
//     autoplay: true,
//     animationData: animationData,
//     rendererSettings: {
//       preserveAspectRatio: "xMidYMid slice"
//     }
//   };

const roadmap = [
    {
        id: "0",
        superTitle:"Find",
        title: " Available Doctors",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi et aliquam corporis nemo accusantium beatae veniam,",
        date: "May 2023",
        status: "done",
        imageUrl: `https://lottie.host/embed/9dec91d3-0d05-4d81-aab6-2ad3adf6abde/Vd3QdIGtpQ.json`,
        colorful: true,
        colorchoice: true,
        defaultOptions: {
            loop: true,
            autoplay: true,
            animationData: animationData4,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice"
            }
          }
    },
    {
        id: "1",
        superTitle:"Easy",
        title: " Slot Booking",

        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi et aliquam corporis nemo accusantium beatae veniam,",        date: "May 2023",
        status: "progress",
        imageUrl: roadmap2,
        colorchoice: false,
        colorful: true,
        defaultOptions: {
            loop: true,
            autoplay: true,
            animationData: animationData3,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice"
            }
          }

    },
    {
        id: "2",
        
        superTitle:"Consultation",
        title: " by the Best",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi et aliquam corporis nemo accusantium beatae veniam,",        date: "May 2023",
        status: "done",
        imageUrl: roadmap3,
        colorful: true,
        defaultOptions: {
            loop: true,
            autoplay: true,
            animationData: animationData2,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice"
            }
          }
        
    },
    {
        id: "3",
        superTitle:"Manage",
        title: " Patient's Health Records",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi et aliquam corporis nemo accusantium beatae veniam,",        date: "May 2023",
        status: "progress",
        imageUrl: roadmap4,
        colorful: true,
        colorchoice: true,
        defaultOptions: {
            loop: true,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice"
            }
          }
    }
];

const Roadmap = () => (
    
    
    <Section className="overflow-hidden" id="roadmap">
        <div className="container md:pb-10">
            <Heading tag="Ready to get started" title="Features Out of the Blue" />

            <div className="relative grid gap-6 md:grid-cols-2 md:gap-4 md:pb-[7rem]">
                {roadmap.map((item) => {
                    // const status = item.status === "done" ? "Done" : "In progress";

                    return (
                        
                        // <MouseParallax  key={item.id} strength={0.07}>

                        <div className={`  m-10 md:flex even:md:translate-y-[7rem] p-1 rounded-[2.5rem] ${item.colorful ? "bg-conic-gradient" : ""} transform hover:scale-95 transition duration-400`} key={item.id}>
                            <div className={`relative p-8 ${item.colorchoice?"bg-gradient-to-b from-[#314755] to-[#26a0da]": "bg-gradient-to-b from-[#00467F] to-[#A5CC82]"}  rounded-[2.4375rem] overflow-hidden xl:p-15`}>
                                <div className="absolute top-0 left-0 max-w-full">
                                    {/* <img className="w-full" src={grid} width={550} height={550} alt="" /> */}
                                </div>
                                <div className="relative z-1">
                                    {/* <div className="flex items-center justify-between max-w-[70%] mb-8 md:mb-20">
                                        <Tagline>{item.date}</Tagline>

                                        <div className="flex items-center px-4 py-1 bg-white rounded text-n-8">
                                            <img className="mr-2.5" src={item.status === "done" ? check2 : loading1} width={16} height={16} alt={status} />
                                            <div className="tagline">{status}</div>
                                        </div>
                                    </div> */}

                                    <div className=" mb-10 -my-10 -mx-15">
                                        {/* <img className="w-full" src={item.imageUrl} width={628} height={426} alt={item.title} /> */}
                                        <Lottie 
	    options={item.defaultOptions}
        height={150}
        width={150}
      />
                                        
                                    </div>

                                    <h4 className="h3 mb-4">
                                        <span className="text-green-400">{item.superTitle}</span>
                                        {item.title}</h4>
                                    <p className="body-1 text-[#221777] text-2xl">{item.text}</p>
                                </div>
                            </div>
                        </div>
                        // </MouseParallax>
                    );
                })}

                <div className="absolute top-[18.25rem] -left-[30.375rem] w-[56.625rem] opacity-60 mix-blend-color-dodge pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 w-[58.85rem] h-[58.85rem] -translate-x-3/4 -translate-y-1/2">
                        <img className="w-full" src={gradient} width={942} height={942} alt="" />
                    </div>
                </div>
            </div>
            <div className="absolute top-[30.25rem] -right-[30.375rem] w-[56.625rem] opacity-60 mix-blend-color-dodge pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 w-[58.85rem] h-[58.85rem] -translate-x-3/4 -translate-y-1/2">
                        <img className="w-full" src={gradient} width={942} height={942} alt="" />
                    </div>
                </div>
                <div className="absolute bottom-[30.25rem] right-[10.375rem] w-[56.625rem] opacity-60 mix-blend-color-dodge pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 w-[58.85rem] h-[58.85rem] -translate-x-3/4 -translate-y-1/2">
                        <img className="w-full" src={gradient} width={942} height={942} alt="" />
                    </div>
                </div>

            {/* <div className="flex justify-center mt-12 md:mt-15 xl:mt-20">
                <Button href="#roadmap">Our roadmap</Button>
            </div> */}
        </div>
    </Section>
);

export default Roadmap;
