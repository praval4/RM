import React, { useState, useEffect } from 'react'
import '../../styles/profile.css'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const Profile = () => {
    const { id } = useParams()
    const [ profile, setProfile ] = useState(null)
    const [ videos, setVideos ] = useState([])
    const [ loading, setLoading ] = useState(true)

    useEffect(() => {
  const fetchProfile = async () => {
    try {
      setLoading(true);
      // detect whether it's user or partner route
      const isPartner = window.location.pathname.includes('/partner/');
      const url = `http://localhost:3000/api/food-partner/${isPartner ? 'partner' : 'user'}/${id}`;

      const response = await axios.get(url, { withCredentials: true });
      console.log('Profile data:', response.data);

      setProfile(response.data.foodPartner);
      setVideos(response.data.foodPartner.foodItems || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setLoading(false);
    }
  };

  fetchProfile();
}, [id]);


    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
    }

    if (!profile) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Profile not found</div>
    }

    return (
        <main className="profile-page">
            <section className="profile-header">
                <div className="profile-meta">
                    <img 
                        className="profile-avatar" 
                        src="https://images.unsplash.com/photo-1754653099086-3bddb9346d37?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D" 
                        alt="Business avatar" 
                    />

                    <div className="profile-info">
                        <h1 className="profile-pill profile-business" title="Business name">
                            {profile.name}
                        </h1>
                        <p className="profile-pill profile-address" title="Address">
                            {profile.address}
                        </p>
                    </div>
                </div>

                <div className="profile-stats" role="list" aria-label="Stats">
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">total videos</span>
                        <span className="profile-stat-value">{videos.length}</span>
                    </div>
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">contact</span>
                        <span className="profile-stat-value" style={{ fontSize: '1.2rem' }}>
                            {profile.phone}
                        </span>
                    </div>
                </div>
            </section>

            <hr className="profile-sep" />

            <section className="profile-grid" aria-label="Videos">
                {videos.length > 0 ? (
                    videos.map((v) => (
                        <div key={v._id} className="profile-grid-item">
                            <video
                                className="profile-grid-video"
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                src={v.video} 
                                muted
                            />
                        </div>
                    ))
                ) : (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                        No videos yet
                    </p>
                )}
            </section>
        </main>
    )
}

export default Profile