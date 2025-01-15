import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import {
  FacebookShareButton,
  WhatsappShareButton,
  FacebookIcon,
  WhatsappIcon,
} from "react-share";
import Navbar from "../../components/navbar/Navbar";
import MapView from "../../components/map/MapView";
import ActivityRecommendations from "../../components/map/ActivityRecommendations";
import "./landing_page.scss";
const credentials = require("./../../components/config/credentials.json");

const LandingPage = () => {
  const [travelList, setTravelList] = useState([]);
  const [filteredTravel, setFilteredTravel] = useState([]);
  const [selectedTravel, setSelectedTravel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [searchedLocation, setSearchedLocation] = useState("");
  const [favoritePlaces, setFavoritePlaces] = useState([]);
  const [locationCoordinates, setLocationCoordinates] = useState(null); // Track coordinates
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTravel = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/travel");
        if (!response.ok) throw new Error("Failed to fetch travel data.");
        const data = await response.json();
        setTravelList(data);
        setFilteredTravel(data);
      } catch (error) {
        console.error("Error fetching travel data:", error.message);
      }
    };
    fetchTravel();
  }, []);

  useEffect(() => {
    const filtered = travelList.filter((travel) => {
      const lowerCaseTerm = searchTerm.toLowerCase();
      return (
        travel.destination.toLowerCase().includes(lowerCaseTerm) ||
        travel.description.toLowerCase().includes(lowerCaseTerm)
      );
    });
    setFilteredTravel(filtered);
  }, [searchTerm, travelList]);

  const fetchWeather = async (cityName) => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${credentials.apiKey}&q=${cityName}&days=1&aqi=no&alerts=no`
      );
      if (!response.ok) throw new Error("Failed to fetch weather data.");
      const data = await response.json();
      setWeatherInfo(data.current);
      setForecast(data.forecast.forecastday[0].day);
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
    }
  };

  const fetchLocationCoordinates = async (location) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`
      );
      if (!response.ok) throw new Error("Failed to fetch coordinates.");
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setLocationCoordinates({ lat, lon });
      }
    } catch (error) {
      console.error("Error fetching location coordinates:", error.message);
    }
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedTravel(null);
    setWeatherInfo(null);
    setForecast(null);
  };

  const handleViewMore = (travel) => {
    setSelectedTravel(travel);
    setShowDetailsModal(true);
    fetchWeather(travel.destination);
    fetchLocationCoordinates(travel.destination); // Fetch coordinates for map
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  const handleSearchLocation = () => {
    fetchWeather(searchedLocation);
    fetchLocationCoordinates(searchedLocation); // Fetch coordinates for searched location
  };

  const handleAddToFavorites = (place) => {
    setFavoritePlaces((prev) => [...prev, place]);
  };

  return (
    <div className="landing-page">
      <Navbar />
      <h1 className="heads">Explore Travel Destinations</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <Form.Control
          type="text"
          placeholder="Search destinations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "300px", marginBottom: "20px" }}
        />
      </div>

      {/* Travel Cards */}
      <div className="travel-cards-container">
        {filteredTravel.slice(0, visibleCount).map((travel) => (
          <div key={travel.id} className="travel-card">
            <img
              src={travel.photo}
              alt="Destination"
              className="travel-image"
            />
            <div className="travel-details">
              <h2>{travel.destination}</h2>
              <p>
                <strong>Description:</strong> {travel.description}
              </p>
              <Button
               className="purple"
                onClick={() => handleViewMore(travel)}
              >
                View More
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < filteredTravel.length && (
        <div className="load-more-container">
          <Button variant="primary" onClick={handleLoadMore}>
            Load More
          </Button>
        </div>
      )}

      {/* Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={handleCloseDetailsModal}
        size="lg"
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedTravel?.destination}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Details</h5>
          <p>
            <strong>Description:</strong> {selectedTravel?.description}
          </p>
          <p>
            <strong>Contact:</strong> {selectedTravel?.contact}
          </p>
          <p>
            <strong>Email:</strong> {selectedTravel?.email}
          </p>

          {/* Weather Information */}
          <div
            style={{
              padding: "15px",
              borderRadius: "10px",
              color: "black", // Ensuring all text is black
              marginTop: "10px",
              textAlign: "center",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              background: weatherInfo?.condition.text.includes('hot')
                ? 'linear-gradient(to right, #FF7E5F, #FEB47B)' : 'linear-gradient(to right, #A1FFCE, #FAFFD1)', // Just an example for hot condition
            }}
          >
            <h5>Weather Information</h5>
            <p>{weatherInfo ? `${weatherInfo.condition.text}` : 'Loading weather...'}</p>
            {forecast && (
              <div>
                <p>
                  <strong>Rain Chance:</strong> {forecast.daily_chance_of_rain}%
                </p>
                <p>
                  <strong>Wind Speed:</strong> {weatherInfo.wind_kph} kph
                </p>
                <p>
                  <strong>Temperature:</strong> {weatherInfo.temp_c}°C
                </p>
              </div>
            )}

            {/* Recommended Activities */}
           {/*  <ActivityRecommendations weather={weatherInfo} />*/}
          </div>

          {/* Search Button to find the area */}
          <div>
            <Form.Control
              type="text"
              placeholder="Search location..."
              value={searchedLocation}
              onChange={(e) => setSearchedLocation(e.target.value)}
            />
            <Button variant="primary" onClick={handleSearchLocation} style={{ marginTop: "20px", backgroundColor: "#8e44ad", borderColor: "#8e44ad" }} >
            
              Search
            </Button>
          </div>

          {/* Map and Activities */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: "60%" }}>
              <MapView
                location={selectedTravel?.destination}
                coordinates={locationCoordinates} // Pass the dynamic coordinates
              />
            </div>
            <div style={{ width: "35%", paddingLeft: "20px" }}>
              {/* Render ActivityRecommendations for weather conditions */}
              <ActivityRecommendations weather={weatherInfo} />
            </div>
          </div>

          {/* Add to Favorites */}
          <Button
            variant="success"
            onClick={() => handleAddToFavorites(selectedTravel?.destination)}
            style={{ marginTop: "20px", backgroundColor: "#8e44ad", borderColor: "#8e44ad" }} // Purple button
          >
            Add to Favorites
          </Button>

          {/* Share Buttons */}
          <div style={{ marginTop: "20px" }}>
            <FacebookShareButton
              url={`https://www.example.com/${selectedTravel?.destination}`}
              quote="Check out this amazing destination!"
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <WhatsappShareButton
              url={`https://www.example.com/${selectedTravel?.destination}`}
              title="Check out this amazing destination!"
            >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LandingPage;
