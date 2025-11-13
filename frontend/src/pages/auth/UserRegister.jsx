import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/forms.css";

const UserRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUserRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://rm-backend-l8at.onrender.com/api/auth/user/register",
        formData,
        { withCredentials: true }
      );

      console.log(response.data);
      alert(response.data.message);
      navigate("/");
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
        <h2>User Register</h2>
        <form onSubmit={handleUserRegister}>
          <input
            type="text"
            placeholder="Full Name"
            name="fullname"
            value={formData.fullname}
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
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
        <p>
          Already have an account? <Link to="/user/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default UserRegister;