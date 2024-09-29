// import { AnimatedTooltipPreview } from '../../components/3dPinTest';
// import { HeroScrollDemo } from '../../components/ScrollHero';
// import Roadmap from '../../components/FeatureSection/Feature';
import Hero from '../../components/HeroSection/Hero';
// import Navbar from '../../components/Navbar/Navbar';
// import DNA from '../../components/3D_Elements/DNA';
// import { AnimatedPinDemo } from '../../components/3dPinReal';
// import { BackgroundBoxesDemo } from '../../components/BackgroundBoxes';
import  CardSpotlightEffect1  from '../../components/CardSpotlightEffect';
// import { BackgroundBoxesDemo } from '../../components/BackgroundBoxes';
// import { HeroScrollDemo } from '../../components/ScrollHero';
// import { AnimatedPinDemo } from '../../components/3dPinReal';
// import Roadmap from '../../components/FeatureSection/Feature';
import { NavbarDemo } from '../../components/Navbar/Navbar2';
// import { Hero2 } from '../../components/HeroSection/Hero2';
// import MetaMaskLogo from '../../components/MetamaskLogo';


// import { AppleCardsCarouselDemo } from '../../components/ExpandableCarousel';
// import '../../index.css';




    import { useTheme } from '../../components/ThemeProvider/theme-provider';
function LandingPage() {
    const { theme } = useTheme();

    const backgroundImage = theme === 'dark' ? '/webglBG.png' : '/webgl3.jpg';

    return (
      <>
  
        {/* <section style={{ backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
         
    
         }}> */}
          <NavbarDemo/>
          <Hero/>
      
        {/* </section> */}

     
        <CardSpotlightEffect1/>
      </>
    );
}


export default LandingPage;
   

