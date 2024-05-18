import fiveStar from "../../assets/motionarteffect-img4.png";

type Props = {
  src: string;
  score?: number;
  reviews?: number;
};

const Rating = ({ src, score = 4.5, reviews = 9 }: Props) => {
  return (
    <div>
      <img src={src} alt="" />
      <div>
        <img src={fiveStar} alt="five stars" />
        <p>
          <span>{score}</span> Score,
          <span>{reviews}</span> Reviews
        </p>
      </div>
    </div>
  );
};
export default Rating;
