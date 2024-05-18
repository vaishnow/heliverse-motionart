import Applications from "./Applications";
import BrowserSupport from "./BrowserSupport";
import Features from "./Features";
import Footer from "./Footer";
import Hero from "./Hero";
import Navbar from "./Navbar";
import RatingsContainer from "./RatingsContainer";

const index = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <RatingsContainer />
        <Applications />
        <BrowserSupport />
        <Features />
      </main>
      <Footer />
    </>
  );
};
export default index;
