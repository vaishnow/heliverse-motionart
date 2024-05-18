import { Card, CardDesc, CardImg, CardTitle } from "../common/Card";
import { GoArrowRight } from "react-icons/go";
import wandImg from "../../assets/motionarteffect-img5.png";
import layoutImg1 from "../../assets/motionarteffect-img10.png";
import layoutImg2 from "../../assets/motionarteffect-img11.png";

const Applications = () => {
  return (
    <>
      <div>
        <div>
          <h2>
            Turn Your Cursor Into A Colorful Magic Wand & Charm Your Visitors
          </h2>
          <p>
            Motion Art for Elementor is a groundbreaking plugin that empowers
            you to effortlessly infuse your website with visually stunning
            motion art elements.
          </p>
          <button>
            Purchase From Envato <GoArrowRight />
          </button>
        </div>
        <img src={wandImg} alt="Wand" />
      </div>
      <div>
        <h2>Apply On Any Section Or Enable For Whole Page</h2>
        <Card>
          <CardDesc>Apply On Section</CardDesc>
          <CardTitle>
            Apply on section is a game-changer, offering an unparalleled way to
            manage applications directly from your website.
          </CardTitle>
          <CardImg src={layoutImg1} alt="Window Layout" />
        </Card>
        <Card>
          <CardDesc>Apply On Section</CardDesc>
          <CardTitle>
            Apply on section is a game-changer, offering an unparalleled way to
            manage applications directly from your website.
          </CardTitle>
          <CardImg src={layoutImg2} alt="Window Layout" />
        </Card>
      </div>
    </>
  );
};
export default Applications;
