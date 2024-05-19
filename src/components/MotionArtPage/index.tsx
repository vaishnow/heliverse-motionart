import Applications from "./Applications";
import BrowserSupport from "./BrowserSupport";
import Features from "./Features";
import Footer from "./Footer";
import Hero from "./Hero";
import Navbar from "./Navbar";
import RatingsContainer from "./RatingsContainer";

const index = () => {
  return (
    <div className="max-w-screen-xl mx-auto">
      <Navbar/>
      <main className="text-light font-outfit">
        <Hero />
        <RatingsContainer />
        <Applications />
        <BrowserSupport />
        <Features />
      </main>
      <Footer/>
    </div>
  );
};
export default index;
