

const HealthCard = ({ title, description, link, bgColor, textColor, hoverColor }) => {
  return (
    <div
      onClick={() => window.open(link, "_blank")}
      className={`p-4 rounded-lg shadow-md cursor-pointer transition duration-300 ${bgColor} hover:${hoverColor}`}
    >
      <h3 className={`font-bold ${textColor}`}>{title}</h3>
      <p className="text-gray-900">{description}</p>
    </div>
  );
};
export default HealthCard;