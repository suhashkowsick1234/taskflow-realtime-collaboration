type Props = {
  focus?: "earth" | "mars";
};

export default function SolarSystem({ focus }: Props) {
  const zoomClass =
    focus === "earth" ? "scale-[2.5]" :
    focus === "mars"  ? "scale-[2.8]" :
    "scale-100";

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center transition-transform duration-1000 ${zoomClass}`}
    >
      <div className="sun"></div>

      {/* Hide other planets when focusing */}
      {!focus && (
        <>
          <div className="orbit orbit-mercury"><div className="planet mercury" /></div>
          <div className="orbit orbit-venus"><div className="planet venus" /></div>
          <div className="orbit orbit-earth"><div className="planet earth" /></div>
          <div className="orbit orbit-mars"><div className="planet mars" /></div>
          <div className="orbit orbit-jupiter"><div className="planet jupiter" /></div>
          <div className="orbit orbit-saturn"><div className="planet saturn" /></div>
          <div className="orbit orbit-uranus"><div className="planet uranus" /></div>
          <div className="orbit orbit-neptune"><div className="planet neptune" /></div>
        </>
      )}

      {/* EARTH + MOON */}
      {focus === "earth" && (
        <div className="orbit orbit-earth">
          <div className="planet earth" />
          <div className="moon-orbit">
            <div className="moon" />
          </div>
        </div>
      )}

      {/* MARS + PHOBOS + DEIMOS */}
      {focus === "mars" && (
        <div className="orbit orbit-mars">
          <div className="planet mars" />

          <div className="moon-orbit small">
            <div className="phobos" />
          </div>

          <div className="moon-orbit large">
            <div className="deimos" />
          </div>
        </div>
      )}
    </div>
  );
}
