import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { background} from "../../assets";
import Button from "../Buttons/Button";
import MenuSvg from "../../assets/svg/MenuSvg";
import { useState } from "react";

const navigation = [
    {
        id: "0",
        title: "Features",
        url: "#features",
    },
    {
        id: "1",
        title: "Pricing",
        url: "#3dPins",
    },
    {
        id: "2",
        title: "How to use",
        url: "#how-to-use",
    },
    {
        id: "3",
        title: "Roadmap",
        url: "#roadmap",
    },
    {
        id: "4",
        title: "New account",
        url: "#signup",
        onlyMobile: true,
    },
    {
        id: "5",
        title: "Sign in",
        url: "#login",
        onlyMobile: true,
    },
];

const Header = () => {
    const pathname = useLocation();
    const [openNavigation, setOpenNavigation] = useState(false);

    const toggleNavigation = () => {
        if (openNavigation) {
            setOpenNavigation(false);
            enablePageScroll();
        } else {
            setOpenNavigation(true);
            disablePageScroll();
        }
    };

    const handleClick = () => {
        if (!openNavigation) return;

        enablePageScroll();
        setOpenNavigation(false);
    };

    return (
        <div className="fixed top-5 left-0 right-0 flex justify-center items-center z-50 rounded-2xl">
            <div className={`w-70vh border-b border-n-6 lg:bg-[#1b183084] rounded-full lg:backdrop-blur-sm ${openNavigation ? "bg-[#1b1830]" : "bg-[#1b1830]/90 backdrop-blur-sm"}`}>
                <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
                    <a className="block w-[12rem] xl:mr-8" href="#hero">
                        {/* <img src={openai} width={190} height={40} alt="OpenAI" /> */}
                        <h1 className="text-2xl"> 
                            <span className="text-green-500">
                            Heal
                            </span>
                            ers</h1>
                    </a>

                    <nav className={`${openNavigation ? "flex" : "hidden"} fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}>
                        <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
                            {navigation.map((item) => (
                                <a
                                    key={item.id}
                                    href={item.url}
                                    onClick={handleClick}
                                    className={`block relative font-code text-2xl uppercase text-white transition-colors hover:text-color-1 ${item.onlyMobile ? "lg:hidden" : ""} px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-sm lg:font-semibold ${
                                        item.url === pathname.hash ? "z-2 lg:text-white" : "lg:text-white/50"
                                    } lg:leading-5 lg:hover:text-white xl:px-12`}
                                >
                                    {item.title}
                                </a>
                            ))}
                        </div>

                        <div className="absolute inset-0 pointer-events-none lg:hidden">
                            <div className="absolute inset-0 opacity-[.03]">
                                <img className="w-full h-full object-cover" src={background} width={688} height={953} alt="" />
                            </div>

                            <div className="absolute top-1/2 left-1/2 w-[51.375rem] aspect-square border border-n-2/10 rounded-full -translate-x-1/2 -translate-y-1/2">
                                <div className="absolute top-1/2 left-1/2 w-[36.125rem] aspect-square border border-n-2/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute top-1/2 left-1/2 w-[23.125rem] aspect-square border border-n-2/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                            </div>

                            <div className="absolute top-0 left-5 w-0.25 h-full bg-n-6"></div>
                            <div className="absolute top-0 right-5 w-0.25 h-full bg-n-6"></div>

                            <div className="absolute top-[4.4rem] left-16 w-3 h-3 bg-gradient-to-b from-[#DD734F] to-[#1A1A32] rounded-full"></div>
                            <div className="absolute top-[12.6rem] right-16 w-3 h-3 bg-gradient-to-b from-[#B9AEDF] to-[#1A1A32] rounded-full"></div>
                            <div className="absolute top-[26.8rem] left-12 w-6 h-6 bg-gradient-to-b from-[#88E5BE] to-[#1A1A32] rounded-full"></div>
                        </div>
                    </nav>

                    <a href="#signup" className="button hidden mr-8 text-white/50 transition-colors hover:text-white lg:block">
                        New account
                    </a>
                    {/* <Button className="hidden lg:flex" href="#login">
                        Sign in
                    </Button> */}
                    <button className=" relative inline-flex h-12 w-24 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 transform hover:-translate-y-1 transition duration-400">
  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
    Sign in 
  </span>
</button>
                    <Button className="ml-auto lg:hidden" onClick={toggleNavigation}>
                        <MenuSvg openNavigation={openNavigation} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Header;
