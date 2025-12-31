import SpaceBackground from "./SpaceBackground";
import SolarSystem from "./SolarSystem";

type Props = {
  children: React.ReactNode;
};

export default function AnimatedLayout({ children }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Animations */}
      <SpaceBackground />
      <SolarSystem />

      {/* Page Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
