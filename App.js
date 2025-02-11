import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Tariff data with product details
const tariffData = {
  USA: { tariff: 25, product: "Automobiles" },
  China: { tariff: 20, product: "Electronics" },
  "European Union": { tariff: 10, product: "Steel" },
  India: { tariff: 5, product: "Textiles" },
};

const getColor = (tariff) => {
  return tariff >= 25
    ? "#FF5733" // High Tariffs (Red)
    : tariff >= 10
    ? "#FF8C00" // Medium Tariffs (Orange)
    : tariff >= 1
    ? "#FFD700" // Low Tariffs (Yellow)
    : "#A9A9A9"; // No Tariffs (Gray)
};

const TradeWarTracker = () => {
  const [news, setNews] = useState([]);

  const fetchNews = () => {
    fetch("https://newsapi.org/v2/everything?q=tariff&apiKey=da5f4af9e0a347a1b86fd02ced98995c")
      .then((res) => res.json())
      .then((data) => {
        if (data.articles) {
          setNews(data.articles.slice(0, 5)); // Get the first 5 articles
        }
      })
      .catch((err) => console.error("Error fetching news:", err));
  };

  useEffect(() => {
    // Fetch news initially
    fetchNews();

    // Set up periodic updates every 5 minutes (300000 milliseconds)
    const intervalId = setInterval(fetchNews, 300000);

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Coordinates for the countries (Updated with more precise locations)
  const getCountryCoordinates = (country) => {
    const coords = {
      USA: [37.0902, -95.7129], // Center of the USA
      China: [35.8617, 104.1954], // Center of China
      "European Union": [50.8503, 4.3517], // Brussels, Belgium
      India: [20.5937, 78.9629], // Center of India
    };
    return coords[country] || [0, 0]; // Default to [0, 0] if country is not found
  };

  return (
    <div className="container">
      <header>
        <h1>🌍 Global Trade War Tracker</h1>
      </header>

      {/* Latest News Section */}
      <div className="news-section">
        <h2>📰 Latest Trade War News</h2>
        <ul>
          {news.map((article, index) => (
            <li key={index}>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                {article.title}
              </a>
              <p>{article.source.name}</p>
              <p><small>Published at: {new Date(article.publishedAt).toLocaleString()}</small></p>
            </li>
          ))}
        </ul>
      </div>

      {/* Tariff Map Section */}
      <div className="map-section">
        <h2>🌍 Tariff Map</h2>
        {/* Leaflet map container */}
        <MapContainer center={[20, 0]} zoom={2} style={{ height: "500px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {Object.entries(tariffData).map(([country, { tariff, product }]) => {
            const color = getColor(tariff);
            const coords = getCountryCoordinates(country);

            return (
              <Marker key={country} position={coords} icon={new L.DivIcon({ className: 'leaflet-div-icon', html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%"></div>` })}>
                <Popup>
                  <b>{country}</b><br />
                  Product: {product}<br />
                  Tariff: {tariff}%
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default TradeWarTracker;
