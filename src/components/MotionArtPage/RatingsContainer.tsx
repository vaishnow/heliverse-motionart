import g2Logo from "../../assets/motionarteffect-img1.png";
import envatoLogo from "../../assets/motionarteffect-img2.png";
import wordpressLogo from "../../assets/motionarteffect-img3.png";
import Rating from "../common/Rating";

const RatingsContainer = () => {
  return (
    <section>
      <h3 className="text-2xl text-center font-semibold">
        Trusted by thousands of users around the world
      </h3>
      <div className="flex flex-wrap gap-10 justify-around py-14">
        <Rating src={envatoLogo} />
        <Rating src={g2Logo} />
        <Rating src={wordpressLogo} />
      </div>
    </section>
  );
};
export default RatingsContainer;
