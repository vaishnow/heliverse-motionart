import { Card, CardDesc, CardImg, CardTitle } from "../common/Card";
import { GoArrowRight } from "react-icons/go";
import wandImg from "../../assets/motionarteffect-img5.png";
import layoutImg1 from "../../assets/motionarteffect-img10.png";
import layoutImg2 from "../../assets/motionarteffect-img11.png";

const Applications = () => {
  return (
    <>
      <div className="p-3 flex my-5">
        <div className="w-3/5">
          <h2>
            Turn Your Cursor Into A Colorful Magic Wand & Charm Your Visitors
          </h2>
          <p className="my-5">
            Motion Art for Elementor is a groundbreaking plugin that empowers
            you to effortlessly infuse your website with visually stunning
            motion art elements.
          </p>
          <button className="bg-ma-grad bg-gradient-to-l p-5 text-xl flex justify-center items-center space-x-4 rounded-[20px]">
            <span>Purchase From Envato </span>
            <GoArrowRight />
          </button>
        </div>
        <img src={wandImg} alt="Wand" />
      </div>
      <h2 className="text-center w-[55%] mx-auto mt-32">
        Apply On Any Section Or Enable For Whole Page
      </h2>
      <div className="flex mt-10 space-x-5 ">
        <div>
          <Card>
            <CardTitle>Apply On Section</CardTitle>
            <CardDesc>
              Apply on section is a game-changer, offering an unparalleled way
              to manage applications directly from your website.
            </CardDesc>
            <CardImg src={layoutImg1} alt="Window Layout" />
          </Card>
        </div>
        <div>
          <Card className="mt-32">
            <CardTitle>Apply On Section</CardTitle>
            <CardDesc>
              Apply on section is a game-changer, offering an unparalleled way
              to manage applications directly from your website.
            </CardDesc>
            <CardImg src={layoutImg2} alt="Window Layout" />
          </Card>
        </div>
      </div>
    </>
  );
};
export default Applications;
