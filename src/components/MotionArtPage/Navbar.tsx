import maLogo from "../../assets/MotionArtEffect-logo.png";

const Navbar = () => {
  return (
    <nav className="bg-dark font-outfit">
      <div className="flex justify-between items-center px-3 h-20 pt-5 max-w-[1280px] mx-auto">
        <img src={maLogo} alt="MotionArt Effect" />
        <button className="px-9 py-4 rounded-md bg-white">Purchase Now</button>
      </div>
    </nav>
  );
};
export default Navbar;
