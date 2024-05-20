import browsersImg from "../../assets/motionarteffect-img8.png"

const BrowserSupport = () => {
  return (
    <div className="flex flex-col items-center text-center px-8 py-12 mx-5 my-36 space-y-5 bg-gradient-to-b from-[#0D061F] to-[#251E35] rounded-2xl border-2 border-[#FFFFFF10]">
      <h3>Supported by All Popular Browsers</h3>
      <p className="w-5/6 md:w-2/5">
        Rest assured, Motion Art is designed to be compatible with all major web
        browsers.
      </p>
      <img src={browsersImg} alt="Major Browsers" />
    </div>
  );
};
export default BrowserSupport;
