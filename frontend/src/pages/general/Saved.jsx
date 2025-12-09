import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/home.css'
import axios from 'axios'

const Saved = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    const fetchSaved = async () => {
      setLoading(true)
      setError('')
      try {
        const resp = await axios.get('https://rm-backend-l8at.onrender.com/api/food/save', { withCredentials: true })
        // inspect response shape in case API differs
        // console.debug('saved response', resp)
        const savedFoods = (resp.data?.savedFoods || []).map(item => ({
          _id: item.food._id,
          video: item.food.video,
          description: item.food.description,
          likeCount: item.food.likeCount,
          savesCount: item.food.savesCount,
          commentsCount: item.food.commentsCount,
          foodPartner: item.food.foodPartner,
          saved: true
        }))
        if (!mounted) return
        setVideos(savedFoods)
      } catch (err) {
        console.error('Failed to fetch saved foods', err)
        if (!mounted) return

        if (err.response) {
          // Server responded with a status outside 2xx
          if (err.response.status === 404) {
            setError('Saved endpoint not found (404). Verify backend route /api/food/save or correct URL.')
          } else if (err.response.status === 401 || err.response.status === 403) {
            setError('Unauthorized. You may need to log in.')
          } else {
            setError(`Server error ${err.response.status}. Check server logs.`)
          }
        } else if (err.request) {
          // Request made but no response
          setError('No response from server. Is the backend running on http://localhost:3000 ?')
        } else {
          // Something else
          setError('Failed to load saved reels.')
        }
        setVideos([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchSaved()

    return () => { mounted = false }
  }, [])

  const toggleSave = async (item) => {
    try {
      const resp = await axios.post(
        'https://rm-backend-l8at.onrender.com/api/food/save',
        { foodId: item._id },
        { withCredentials: true }
      )

      const saveFlag = resp.data?.save

      if (saveFlag === false) {
        // Now unsaved on server -> remove locally
        setVideos(prev => prev.filter(v => v._id !== item._id))
      } else if (saveFlag === true) {
        // Still saved (or re-saved) -> ensure flag/count
        setVideos(prev =>
          prev.map(v =>
            v._id === item._id ? { ...v, saved: true, savesCount: (v.savesCount || 0) + 1 } : v
          )
        )
      } else {
        // fallback: toggle local flag (best-effort)
        setVideos(prev =>
          prev.map(v =>
            v._id === item._id ? { ...v, saved: !v.saved } : v
          )
        )
      }
    } catch (err) {
      console.error('Failed to toggle save', err)
      // show minimal user feedback if needed
    }
  }

  if (loading) {
    return (
      <div className="saved-page-empty" style={{ padding: 24 }}>
        <p>Loading saved reels...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="saved-page-empty" style={{ padding: 24 }}>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="saved-page-empty" style={{ padding: 24 }}>
        <p>No saved reels yet.</p>
      </div>
    )
  }

  return (
    <div className="saved-list" style={{ padding: 12 }}>
      {videos.map((v) => (
        <div key={v._id} className="saved-item" style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-start' }}>
          <div style={{ width: 160, height: 90, overflow: 'hidden', borderRadius: 8, background: '#000' }}>
            <video
              src={v.video}
              preload="metadata"
              muted
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              controls
            />
          </div>

          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 500 }}>{v.description || 'No description'}</p>
            <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
              <Link to={`/food-partner/${v.foodPartner}`} className="visit-store-btn" style={{ textDecoration: 'none', padding: '6px 10px', background: 'var(--accent, #ff6b6b)', color: '#fff', borderRadius: 6 }}>
                Visit Store
              </Link>

              <button
                onClick={() => toggleSave(v)}
                className="save-inline-btn"
                style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.08)', background: v.saved ? '#222' : 'transparent', color: v.saved ? '#fff' : 'inherit' }}
                aria-pressed={!!v.saved}
              >
                {v.saved ? 'Unsave' : 'Save'} 
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Saved