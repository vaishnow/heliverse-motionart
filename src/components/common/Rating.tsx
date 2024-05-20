import fiveStar from "../../assets/motionarteffect-img4.png";

type Props = {
  src: string;
  score?: number;
  reviews?: number;
};

const Rating = ({ src, score = 4.5, reviews = 9 }: Props) => {
  return (
    <div className="flex flex-wrap justify-center">
      <img src={src} alt="" />
      <div className="flex flex-col justify-end pt-2 ps-2">
        <img src={fiveStar} alt="five stars" className="my-auto" />
        <p>
          <span>{score}</span> Score,
          <span>{reviews}</span> Reviews
        </p>
      </div>
    </div>
  );
};
export default Rating;
