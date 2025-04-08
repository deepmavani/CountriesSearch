import React, { useEffect, useState } from "react";
import axios from "axios";

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://countries-search-data-prod-812920491762.asia-south1.run.app/countries"
        );

        const transformedData = response.data.map((country, index) => ({
            id: `${country.common}-${index}`,
            name: country.common || "Unknown",
            flag: country.png || "https://via.placeholder.com/100x60?text=No+Flag",
          }));

        setCountries(transformedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching countries:", err);
      }
    };

    fetchCountries();
  }, []);

  const filteredCountries = countries.filter(
    (country) =>
      country.name &&
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div style={styles.loading}>Loading countries...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  return (
    <div style={styles.appContainer}>
      <input
        type="text"
        placeholder="Search for countries..."
        style={styles.searchInput}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div style={styles.countriesContainer}>
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country) => (
            <div key={country.id} style={styles.card}>
              <img
                src={country.flag}
                alt={`Flag of ${country.name}`}
                style={styles.flag}
                onError={(e) => {
                  if (!e.target.dataset.fallback) {
                    e.target.src =
                      "https://via.placeholder.com/100x60?text=No+Flag";
                    e.target.dataset.fallback = "true";
                  }
                }}
              />
              <h3 style={styles.name}>{country.name}</h3>
            </div>
          ))
        ) : (
          <div style={styles.noResults}>
            {searchTerm ? "No matches found" : "No countries available"}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  appContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  searchInput: {
    width: "100%",
    maxWidth: "400px",
    display: "block",
    margin: "0 auto 30px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  countriesContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  },
  card: {
    width: "140px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "10px",
    textAlign: "center",
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease",
    cursor: "pointer",
  },
  flag: {
    width: "100%",
    height: "80px",
    objectFit: "cover",
    borderRadius: "4px",
    border: "1px solid #eee",
    marginBottom: "10px",
  },
  name: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
  },
  loading: {
    textAlign: "center",
    padding: "20px",
    fontSize: "18px",
  },
  error: {
    textAlign: "center",
    padding: "20px",
    color: "red",
    fontSize: "18px",
  },
  noResults: {
    textAlign: "center",
    width: "100%",
    padding: "20px",
    fontSize: "16px",
    color: "#666",
  },
};

export default Countries;
