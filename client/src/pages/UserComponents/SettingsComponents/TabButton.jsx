function TabButton({ icon: Icon, label, isActive, onClick }) {
  return (
    <button
      className={`px-4 py-3 font-medium text-sm flex items-center cursor-pointer ${
        isActive
          ? "text-blue-800 border-b-2 border-blue-800"
          : "text-gray-500 hover:text-blue-800"
      } transition-colors duration-200`}
      onClick={onClick}
    >
      <Icon size={16} className="mr-2" />
      {label}
    </button>
  );
}

export default TabButton;
