const StatCard = ({ icon, number, label }) => {
  return (
    <div className="stat-card">
      <i className={`fas ${icon}`}></i>
      <p className="stat-number">{number}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
};

export default StatCard;
