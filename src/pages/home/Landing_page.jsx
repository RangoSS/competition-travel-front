import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from 'react-bootstrap';
import { FacebookShareButton, WhatsappShareButton, FacebookIcon, WhatsappIcon } from 'react-share';
import './landing_page.scss';
import Navbar from "../../components/navbar/Navbar";

const LandingPage = () => {
  const [travelList, setTravelList] = useState([]);
  const [filteredTravel, setFilteredTravel] = useState([]);
  const [selectedTravel, setSelectedTravel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6); // Number of cards visible initially
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTravel = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/travel');
        const data = await response.json();
        setTravelList(data);
        setFilteredTravel(data); // Initially show all travel data
      } catch (error) {
        console.error("Error fetching travel data:", error);
      }
    };

    fetchTravel();
  }, []);

  useEffect(() => {
    const filtered = travelList.filter(travel => {
      const lowerCaseTerm = searchTerm.toLowerCase();
      return (
        travel.destination.toLowerCase().includes(lowerCaseTerm) ||
        travel.description.toLowerCase().includes(lowerCaseTerm)
      );
    });
    setFilteredTravel(filtered);
  }, [searchTerm, travelList]);

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedTravel(null);
  };

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 6); // Increment the visible cards
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
          style={{ width: '300px', marginBottom: '20px' }}
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
              <p><strong>Start Date:</strong> {new Date(travel.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(travel.endDate).toLocaleDateString()}</p>
              <p><strong>Description:</strong> {travel.description}</p>
              <Button
                className="button primary"
                onClick={() => {
                  setSelectedTravel(travel);
                  setShowDetailsModal(true);
                }}
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
          <p><strong>Start Date:</strong> {new Date(selectedTravel?.startDate).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {new Date(selectedTravel?.endDate).toLocaleDateString()}</p>
          <p><strong>Description:</strong> {selectedTravel?.description}</p>
          <p><strong>Contact:</strong> {selectedTravel?.contact}</p>
          <p><strong>Email:</strong> {selectedTravel?.email}</p>

          <h5>Gallery</h5>
          <img
            src={selectedTravel?.photo}
            alt="Destination"
            style={{ width: '100%', height: '150px', objectFit: 'cover', margin: '5px' }}
          />

          <div className="share-buttons">
            <FacebookShareButton url={`http://your-website.com/travel/${selectedTravel?.id}`} quote={selectedTravel?.destination}>
              <FacebookIcon size={32} round={true} />
            </FacebookShareButton>
            <WhatsappShareButton url={`http://your-website.com/travel/${selectedTravel?.id}`} title={selectedTravel?.destination}>
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
