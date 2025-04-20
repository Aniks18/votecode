import React, { useState } from 'react';
import supabase from '../../utils/supabase';
import './Dashboard.css';

const RoleSection = ({ user }) => {
  const [candidateInfo, setCandidateInfo] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Function to handle creating a candidate (for host users)
  const handleCreateCandidate = async (e) => {
    e.preventDefault();
    
    if (user.role !== 'host') {
      setError('Only hosts can create candidates');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const { error } = await supabase
        .from('simple_candidates')
        .insert([
          {
            name: candidateInfo.name,
            description: candidateInfo.description,
            email: user.email  // Use the host's email instead of ID
          }
        ]);
        
      if (error) throw error;
      
      // Reset form and show success message
      setCandidateInfo({ name: '', description: '' });
      setSuccess('Candidate created successfully!');
      
    } catch (err) {
      console.error('Error creating candidate:', err);
      setError(err.message || 'Failed to create candidate');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCandidateInfo(prev => ({ ...prev, [name]: value }));
  };

  if (!user) {
    return <div>Loading role information...</div>;
  }

  return (
    <div className="role-card">
      <div className="role-header">
        <h2 className="role-title">Your Role</h2>
      </div>
      
      <div className="role-content">
        <div className="role-status">
          <h3 className="role-detail-label">Current Role</h3>
          <div className="mt-1">
            {user.role === 'voter' ? (
              <div className="badge badge-accent">
                Voter
              </div>
            ) : (
              <div className="badge badge-secondary">
                Host / Party
              </div>
            )}
          </div>
        </div>
        
        {/* Role-specific content */}
        {user.role === 'voter' ? (
          <div className="voter-info">
            <p className="role-description">
              As a voter, you have the right to cast your vote for one candidate in the election.
            </p>
            
            <div className="voter-guidelines">
              <h3 className="guidelines-title">Voting Guidelines:</h3>
              <ul className="guidelines-list">
                <li>You can only vote once</li>
                <li>Your vote is anonymous</li>
                <li>You cannot change your vote after casting</li>
                <li>Review all candidates before making a decision</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="host-info">
            <p className="role-description">
              As a host, you can create a candidate/party for the election.
            </p>
            
            {/* Form to create a candidate */}
            <form onSubmit={handleCreateCandidate} className="candidate-form">
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success">
                  {success}
                </div>
              )}
              
              <div className="input-group">
                <label htmlFor="name">
                  Candidate/Party Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={candidateInfo.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter candidate or party name"
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={candidateInfo.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Describe the candidate or party"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Candidate'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSection;