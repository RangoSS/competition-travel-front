import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { FacebookShareButton, WhatsappShareButton, FacebookIcon, WhatsappIcon } from "react-share";
import "./landing_page.scss";
import Navbar from "../../components/navbar/Navbar";
const credentials = require("./../../components/config/credentials.json");

const LandingPage = () => {
  const [travelList, setTravelList] = useState([]);
  const [filteredTravel, setFilteredTravel] = useState([]);
  const [selectedTravel, setSelectedTravel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [weatherInfo, setWeatherInfo] = useState(null);
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
        `https://api.weatherapi.com/v1/current.json?key=${credentials.apiKey}&q=${cityName}&aqi=no`
      );
      if (!response.ok) throw new Error("Failed to fetch weather data.");
      const data = await response.json();
      setWeatherInfo(data);
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
    }
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedTravel(null);
    setWeatherInfo(null);
  };

  const handleViewMore = (travel) => {
    setSelectedTravel(travel);
    setShowDetailsModal(true);
    fetchWeather(travel.destination);
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  const getWeatherMessage = () => {
    if (!weatherInfo) return "Loading weather data...";
    const condition = weatherInfo.current.condition.text.toLowerCase();
    if (condition.includes("hot") || weatherInfo.current.temp_c > 30) {
      return "☀️ It's hot! Great for swimming, hiking, or outdoor fun.";
    }
    if (condition.includes("windy")) {
      return "🌬️ It's windy! Avoid swimming and secure loose objects.";
    }
    if (condition.includes("rain") || weatherInfo.current.precip_mm > 0) {
      return "🌧️ It's rainy! Perfect for indoor activities or cozying up.";
    }
    return "Enjoy your day! The weather looks good.";
  };

  const getWeatherBackgroundColor = () => {
    if (!weatherInfo) return "lightgray";
    const condition = weatherInfo.current.condition.text.toLowerCase();
    if (condition.includes("hot") || weatherInfo.current.temp_c > 30) {
      return "#FFD700"; // Gold for hot weather
    }
    if (condition.includes("windy")) {
      return "#ADD8E6"; // Light blue for windy weather
    }
    if (condition.includes("rain") || weatherInfo.current.precip_mm > 0) {
      return "#A9A9A9"; // Gray for rainy weather
    }
    return "#90EE90"; // Light green for good weather
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
                className="button primary"
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
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
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

          <div
            style={{
              backgroundColor: getWeatherBackgroundColor(),
              padding: "10px",
              borderRadius: "5px",
              marginTop: "10px",
            }}
          >
            <h5>Weather Information</h5>
            <p>{getWeatherMessage()}</p>
            <Button
              variant="link"
              href="https://www.weatherapi.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              View More Weather
            </Button>
          </div>

          <h5>Gallery</h5>
          <img
            src={selectedTravel?.photo}
            alt="Destination"
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              margin: "5px",
            }}
          />

          <div className="share-buttons">
            <FacebookShareButton
              url={`http://your-website.com/travel/${selectedTravel?.id}`}
              quote={selectedTravel?.destination}
            >
              <FacebookIcon size={32} round={true} />
            </FacebookShareButton>
            <WhatsappShareButton
              url={`http://your-website.com/travel/${selectedTravel?.id}`}
              title={selectedTravel?.destination}
            >
              <WhatsappIcon size={32} round={true} />
            </WhatsappShareButton>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LandingPage;
