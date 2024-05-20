import { FeatCard, FeatDesc, FeatImg, FeatTitle } from "../common/FeatCard";
import feat1 from "../../assets/motionarteffect-img9.png";
import feat2 from "../../assets/motionarteffect-img6.png";
import feat3 from "../../assets/motionarteffect-img7.png";

const Features = () => {
  const features = [
    {
      img: feat1,
      title: "Light Weight",
      desc: "Motion Art for Elementor is designed to be lightweight.",
    },
    {
      img: feat2,
      title: "100% Responsive",
      desc: "Create a consistent visual experience across all devices.",
    },
    {
      img: feat3,
      title: "User Friendly Interface",
      desc: "Ensure a smooth experience for both applicants and administrators.",
    },
  ];

  return (
    <>
      <div className="w-[55%] text-center mx-auto">
        <h2>An All-Round Plugin With Powerful Features</h2>
        <p className="mx-5 my-10">
          Whether you're a seasoned web designer or just starting out, Motion
          Art for Elementor seamlessly integrates with the Elementor platform,
          providing you with a seamless and intuitive experience.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-5 p-5">
        {features.map(({ desc, img, title }) => (
          <FeatCard key={title}>
            <FeatImg src={img} alt={title} />
            <FeatTitle>{title}</FeatTitle>
            <FeatDesc>{desc}</FeatDesc>
          </FeatCard>
        ))}
      </div>
    </>
  );
};
export default Features;
