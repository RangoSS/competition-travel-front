import React, { useEffect, useState } from 'react';

const activities = {
  Clear: [
    "Go hiking",
    "Visit outdoor attractions",
    "Have a picnic",
    "Go sightseeing",
    "Outdoor photography"
  ],
  Clouds: [
    "Visit museums",
    "Walking tour",
    "Shopping",
    "Café hopping",
    "City exploration"
  ],
  Rain: [
    "Visit indoor attractions",
    "Museum tours",
    "Shopping malls",
    "Local cuisine experience",
    "Indoor entertainment"
  ],
  Snow: [
    "Skiing",
    "Snowboarding",
    "Winter photography",
    "Visit warm cafés",
    "Indoor activities"
  ]
};

const ActivityRecommendations = ({ weather }) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`https://api.unsplash.com/photos/random?query=${weather?.condition.text}&client_id=YOUR_UNSPLASH_ACCESS_KEY`);
        const data = await response.json();
        setImageUrl(data[0]?.urls?.small || '');
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    if (weather) {
      fetchImage();
    }
  }, [weather]);

  return (
    <div className="activity-recommendations">
      <h5>Recommended Activities</h5>
      <ul>
        {activities[weather?.condition.text] && activities[weather?.condition.text].map((activity, idx) => (
          <li key={idx}>{activity}</li>
        ))}
      </ul>
      {imageUrl && <img src={imageUrl} alt="Suggested activities" />}
    </div>
  );
};

export default ActivityRecommendations;
