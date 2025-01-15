import React from "react";

const ActivityRecommendations = ({ weather }) => {
  const activitySuggestions = {
    hot: ["Swimming", "Beach Day", "Outdoor Hiking", "Water Sports"],
    cold: ["Skiing", "Snowboarding", "Indoor Activities", "Hot Chocolate"],
    rainy: ["Museum Visit", "Indoor Games", "Shopping", "Cooking"],
    clear: ["Hiking", "Cycling", "Picnic", "Nature Walk"],
  };

  let recommendedActivities = [];
  if (weather) {
    const weatherCondition = weather.condition.text.toLowerCase();
    if (weatherCondition.includes("hot")) {
      recommendedActivities = activitySuggestions.hot;
    } else if (weatherCondition.includes("cold")) {
      recommendedActivities = activitySuggestions.cold;
    } else if (weatherCondition.includes("rain")) {
      recommendedActivities = activitySuggestions.rainy;
    } else {
      recommendedActivities = activitySuggestions.clear;
    }
  }

  return (
    <div>
      <h4>Recommended Activities for This Weather</h4>
      <ul>
        {recommendedActivities.map((activity, index) => (
          <li key={index}>{activity}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityRecommendations;
