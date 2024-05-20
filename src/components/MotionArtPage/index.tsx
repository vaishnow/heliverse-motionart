import Applications from "./Applications";
import BrowserSupport from "./BrowserSupport";
import Features from "./Features";
import Footer from "./Footer";
import Hero from "./Hero";
import Navbar from "./Navbar";
import RatingsContainer from "./RatingsContainer";
import WebGLCanvas from "../WebGLCanvas";

const index = () => {
  return (
    <div className="max-h-screen overflow-y-scroll scrollbar-none">
      <div className="max-w-screen-xl mx-auto">
        <WebGLCanvas/>
        <Navbar/>
        <main className="text-light font-outfit pointer-events-none">
          <Hero />
          <RatingsContainer />
          <Applications />
          <BrowserSupport />
          <Features />
        </main>
      </div>
      <Footer/>
    </div>
  );
};
export default index;
