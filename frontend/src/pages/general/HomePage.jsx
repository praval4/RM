import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // added useNavigate
import { createPortal } from 'react-dom';
import axios from 'axios';
import '../../styles/home.css';

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const observerRef = useRef(null);
  const [portalEl, setPortalEl] = useState(null);
  const navigate = useNavigate(); // added

  useEffect(() => {
    // create portal root for saved button so fixed positioning isn't affected by ancestor transforms
    const el = document.createElement('div');
    el.id = 'saved-btn-root';
    document.body.appendChild(el);
    setPortalEl(el);
    return () => {
      if (el.parentNode !== null) {
       el.parentNode.removeChild(el);
     }
    };
  }, []);

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://rm-backend-l8at.onrender.com/api/food', {
          withCredentials: true
        });
        console.log('API Response:', response.data);
        setReels(response.data.foodItems);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos. Please login.');
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Function to play video at specific index
  const playVideo = useCallback((index) => {
    const video = videoRefs.current[index];
    if (video) {
      console.log('Attempting to play video:', index);
      video.play()
        .then(() => console.log('Video', index, 'playing'))
        .catch(err => {
          console.log('Play error:', err);
          setTimeout(() => {
            video.play().catch(e => console.log('Retry failed:', e));
          }, 300);
        });
    }
  }, []);

  // Function to pause video at specific index
  const pauseVideo = useCallback((index) => {
    const video = videoRefs.current[index];
    if (video) {
      console.log('Pausing video:', index);
      video.pause();
      video.currentTime = 0;
    }
  }, []);

  // Use Intersection Observer for better scroll detection
  useEffect(() => {
    if (reels.length === 0) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const options = {
      root: containerRef.current,
      threshold: 0.5, 
      rootMargin: '0px'
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const videoIndex = parseInt(entry.target.dataset.index);
        
        if (entry.isIntersecting) {
          console.log('Video in view:', videoIndex);
          setCurrentIndex(videoIndex);
          playVideo(videoIndex);
        } else {
          console.log('Video out of view:', videoIndex);
          pauseVideo(videoIndex);
        }
      });
    }, options);

    // Observe all video containers
    const videoElements = containerRef.current?.querySelectorAll('.reel-item');
    videoElements?.forEach((element) => {
      observerRef.current.observe(element);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [reels.length, playVideo, pauseVideo]);

  // Like video
  const handleLike = async (reel) => {
    try {
      const response = await axios.post(
        'https://rm-backend-l8at.onrender.com/api/food/like',
        { foodId: reel._id },
        { withCredentials: true }
      );
      
      if (response.data.like) {
        setReels((prev) =>
          prev.map((v) =>
            v._id === reel._id ? { ...v, likeCount: (v.likeCount || 0) + 1 } : v
          )
        );
      } else {
        setReels((prev) =>
          prev.map((v) =>
            v._id === reel._id ? { ...v, likeCount: Math.max((v.likeCount || 0) - 1, 0) } : v
          )
        );
      }
    } catch (err) {
      console.error('Error liking video:', err);
    }
  };

  // Save video
  const handleSave = async (reel) => {
    try {
      const response = await axios.post(
        'https://rm-backend-l8at.onrender.com/api/food/save',
        { foodId: reel._id },
        { withCredentials: true }
      );
      
      if (response.data.save) {
        setReels((prev) =>
          prev.map((v) =>
            v._id === reel._id ? { ...v, savesCount: (v.savesCount || 0) + 1, saved: true } : v
          )
        );
      } else {
        setReels((prev) =>
          prev.map((v) =>
            v._id === reel._id ? { ...v, savesCount: Math.max((v.savesCount || 0) - 1, 0), saved: false } : v
          )
        );
      }
    } catch (err) {
      console.error('Error saving video:', err);
    }
  };

  
  const handleLogout = async () => {
    try {
      await axios.post(
        'https://rm-backend-l8at.onrender.com/api/auth/logout',
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      try { localStorage.removeItem('token'); localStorage.removeItem('user');

      } catch(e){}
      try {
        navigate('/user/login', { replace: true });
        // fallback to hard replace to clear history entry and reload
        window.location.replace('/user/login');
      } catch (e) {
        window.location.replace('/user/login');
      }
    }
  };

  // Loading
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Loading videos...</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={() => window.location.href = '/user/login'}>
          Go to Login
        </button>
      </div>
    );
  }

  // No video
  if (reels.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>No videos available</p>
      </div>
    );
  }

  // save button
  const savedButton = (
    <Link to="/saved" className="saved-floating-btn" title="Saved Reels">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </Link>
  );

  return (
    <>
      {/* Added logout button */}
      <button
        onClick={handleLogout}
        className="logout-btn"
        style={{
          position: 'fixed',
          top: 14,
          right: 100,
          zIndex: 3000,
          padding: '8px 12px',
          borderRadius: 6,
          border: 'none',
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          cursor: 'pointer'
        }}
        title="Logout"
      >
        Logout
      </button>

      <div ref={containerRef} className="reels-container">
        {reels.map((reel, index) => (
          <div 
            key={reel._id} 
            className="reel-item"
            data-index={index}
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              className="reel-video"
              src={reel.video}
              loop
              preload="auto"
              muted
              playsInline
              webkit-playsinline="true"
            />
            
            <div className="reel-overlay" />

            {/* Like, Comments, Save */}
            <div className="reel-actions">
              <button className="action-btn" onClick={() => handleLike(reel)} aria-label="Like">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span className="action-count">{reel.likeCount || 0}</span>
              </button>

              <button className="action-btn" aria-label="Comments">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="action-count">{reel.commentsCount || 0}</span>
              </button>

              {/* Save button placed beneath Like and Comments */}
              <button
                className={`action-btn save-action${reel.saved ? ' saved' : ''}`}
                onClick={() => handleSave(reel)}
                aria-pressed={!!reel.saved}
                aria-label="Save"
                title={reel.saved ? 'Unsave' : 'Save'}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill={reel.saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                <span className="action-count">{reel.savesCount || 0}</span>
              </button>
            </div>
            
            <div className="reel-content">
              <p className="reel-description">
                {reel.description}
              </p>
              
              {/* Bottom row: Visit Store only (removed duplicate save button) */}
              <div className="reel-bottom-row" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
                <Link 
                  to={`/food-partner/user/${reel.foodPartner}`}
                  className="visit-store-btn"
                  style={{ textDecoration: 'none', padding: '6px 10px', background: 'var(--accent, #ff6b6b)', color: '#fff', borderRadius: 6 }}
                >
                  Visit Store
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {portalEl ? createPortal(savedButton, portalEl) : null}
    </>
  );
};

export default Home;