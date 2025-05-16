function BackgroundShapes({ animationComplete }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <div
        className={`absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-500 opacity-5 transition-all duration-1000 delay-300 ${
          animationComplete ? "scale-100 opacity-5" : "scale-95 opacity-0"
        }`}
      ></div>
      <div
        className={`absolute bottom-20 right-20 w-64 h-64 rounded-full bg-blue-400 opacity-5 transition-all duration-1000 delay-500 ${
          animationComplete ? "scale-100 opacity-5" : "scale-95 opacity-0"
        }`}
      ></div>
      <div
        className={`absolute top-1/3 right-10 w-24 h-24 rounded-full bg-blue-600 opacity-5 transition-all duration-1000 delay-700 ${
          animationComplete ? "scale-100 opacity-5" : "scale-95 opacity-0"
        }`}
      ></div>
    </div>
  );
}

export default BackgroundShapes;
