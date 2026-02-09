const ListingPreview = ({ image, title, location, price }) => {
  return (
    <div className="listing-preview">
      <img src={image} alt={title} />

      <div className="listing-details">
        <h3>{title}</h3>
        <p>📍 {location}</p>
        <p>💰 {price}</p>

        <button className="btn-primary">View Details</button>
      </div>
    </div>
  );
};

export default ListingPreview;
