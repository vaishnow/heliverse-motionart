import g2Logo from "../../assets/motionarteffect-img1.png";
import envatoLogo from "../../assets/motionarteffect-img2.png";
import wordpressLogo from "../../assets/motionarteffect-img3.png";
import Rating from "../common/Rating";

const RatingsContainer = () => {
  return (
    <div>
      <Rating src={envatoLogo}/>
      <Rating src={g2Logo}/>
      <Rating src={wordpressLogo}/>
    </div>
  );
};
export default RatingsContainer;
