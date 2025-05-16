import { useState, useEffect } from "react";
import Logo from "./Logo";
import NotFoundContent from "./NotFoundContent";
import GoBackButton from "./GoBackButton";
import SupportLink from "./SupportLink";
import BackgroundShapes from "./BackgroundShapes";

function NotFoundPage() {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimationComplete(true), 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div
        className={`w-full max-w-lg transform transition-all duration-1000 ${
          animationComplete
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <Logo />

        <div
          className={`bg-white rounded-xl shadow-lg border border-blue-100 p-8 sm:p-10 transform transition-all duration-1000 delay-200 ${
            animationComplete
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <NotFoundContent />
          <div className="flex justify-center w-full">
            <GoBackButton />
          </div>
        </div>

        <div
          className={`mt-6 text-center transform transition-all duration-1000 delay-400 ${
            animationComplete
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <SupportLink />
        </div>
      </div>

      <BackgroundShapes animationComplete={animationComplete} />
    </div>
  );
}

export default NotFoundPage;
