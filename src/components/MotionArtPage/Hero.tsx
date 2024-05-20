const Hero = () => {
  return (
    <section className="flex py-20 px-8 text-lg flex-wrap">
      <aside className="w-full md:w-1/4 py-5">
        <div className="w-32 max-md:ms-auto me-auto">
          <p className="pb-3 text-ma-grad font-semibold">
            Transform Your Website
          </p>
          <p className="font-light">With Motion Art Effect</p>
        </div>
      </aside>
      <div className="md:w-1/2 mx-auto">
        <h1 className="text-[55px] font-semibold leading-normal">
          Attract Your Visitors Attention With Colorful
          <span className="text-ma-grad"> Motion Art Effect</span>
        </h1>
        <p className="text-[#EEE5FFBD]">
          Unleash the power of creativity with Motion Art for Elementor - your
          ultimate solution for seamlessly integrating captivating animations
          into your website.
        </p>
      </div>
      <div className="w-1/4"></div>
    </section>
  );
};
export default Hero;
