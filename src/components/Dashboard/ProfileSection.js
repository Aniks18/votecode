import React from 'react';
import './Dashboard.css';

const ProfileSection = ({ user }) => {
  if (!user) {
    return <div>Loading user profile...</div>;
  }

  // Format date of birth
  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  console.log("Uder data:", user);
  console.log("Photo URL", user.photo_url);

  return (
    <div className="profile-card">
      <div className="profile-header">
        <h2 className="profile-title">Your Profile</h2>
      </div>
      
      <div className="profile-content">
        {/* Profile Photo */}
        <div className="profile-photo-container">
          {user.photo_url ? (
            <img 
              src={user.photo_url} 
              alt={user.name} 
              className="avatar"
              onError={(e) => {
                console.error("Image failed to load:", e);
                e.target.onerror = null; 
                e.target.src = "https://via.placeholder.com/100?text=" + user.name.charAt(0).toUpperCase();
              }}
            />
          ) : (
            <div className="avatar avatar-placeholder">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        {/* User Details */}
        <div className="profile-details">
          <div className="profile-detail-item">
            <h3 className="profile-detail-label">Full Name</h3>
            <p className="profile-detail-value">{user.name}</p>
          </div>
          
          <div className="profile-detail-item">
            <h3 className="profile-detail-label">Email Address</h3>
            <p className="profile-detail-value">{user.email}</p>
          </div>
          
          <div className="profile-detail-item">
            <h3 className="profile-detail-label">Date of Birth</h3>
            <p className="profile-detail-value">{formatDate(user.dob)}</p>
          </div>
          
          <div className="profile-detail-item">
            <h3 className="profile-detail-label">Voting Status</h3>
            {user.has_voted ? (
              <div className="badge badge-accent">
                Voted
              </div>
            ) : (
              <div className="badge badge-secondary">
                Not Voted Yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;