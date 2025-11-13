import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/forms.css";

const FoodPartnerRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    contactName: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePartnerRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://rm-backend-l8at.onrender.com/api/auth/food-partner/register",
        formData,
        { withCredentials: true }
      );

      console.log(response.data);
      alert(response.data.message);
      navigate("/create-food");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h2>Food Partner Register</h2>
        <form onSubmit={handlePartnerRegister}>
          <input
            type="text"
            placeholder="Business Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Contact Person Name"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
        <p>
          Already have an account? <Link to="/food-partner/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;