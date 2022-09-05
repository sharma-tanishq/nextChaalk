import { FC } from "react";

interface WavyBackgroundSvgProps {}

const WavyBackgroundSvg: FC<WavyBackgroundSvgProps> = () => {
  return (
    <svg
      style={{
        position: "fixed",
        left: "0",
        bottom: "-12rem",
        opacity: "10%",
        filter: "grayscale(60%)",
      }}
      width="100%"
      height="100%"
      id="svg"
      viewBox="0 0 1440 600"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="5%" stopColor="#002bdc" />
          <stop offset="95%" stopColor="#32ded4" />
        </linearGradient>
      </defs>
      <path
        d="M 0,600 C 0,600 0,200 0,200 C 97.7129186602871,157.98086124401914 195.4258373205742,115.96172248803828 291,128 C 386.5741626794258,140.03827751196172 480.0095693779905,206.13397129186606 568,220 C 655.9904306220095,233.86602870813394 738.5358851674641,195.5023923444976 828,175 C 917.4641148325359,154.4976076555024 1013.8468899521531,151.85645933014354 1117,159 C 1220.153110047847,166.14354066985646 1330.0765550239234,183.07177033492823 1440,200 C 1440,200 1440,600 1440,600 Z"
        stroke="none"
        strokeWidth="0"
        fill="url(#gradient)"
        fillOpacity="0.53"
        className="transition-all duration-300 ease-in-out delay-150 path-0"
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="5%" stopColor="#002bdc" />
          <stop offset="95%" stopColor="#32ded4" />
        </linearGradient>
      </defs>
      <path
        d="M 0,600 C 0,600 0,400 0,400 C 75.16746411483251,378.1818181818182 150.33492822966502,356.3636363636364 248,364 C 345.665071770335,371.6363636363636 465.82775119617224,408.7272727272727 584,421 C 702.1722488038278,433.2727272727273 818.3540669856459,420.7272727272727 914,394 C 1009.6459330143541,367.2727272727273 1084.7559808612439,326.3636363636364 1169,325 C 1253.2440191387561,323.6363636363636 1346.622009569378,361.8181818181818 1440,400 C 1440,400 1440,600 1440,600 Z"
        stroke="none"
        strokeWidth="0"
        fill="url(#gradient)"
        fillOpacity="1"
        className="transition-all duration-300 ease-in-out delay-150 path-1"
      />
    </svg>
  );
};

export default WavyBackgroundSvg;
