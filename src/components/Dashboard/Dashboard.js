import React, { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';
import ProfileSection from './ProfileSection';
import RoleSection from './RoleSection';
import CandidatesSection from './CandidatesSection';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) throw new Error('User not found');

        // Get user details from custom table by email
        const { data: userData, error: userError } = await supabase
          .from('simple_users')
          .select('*')
          .eq('email', authUser.email)
          .single();

        if (userError) throw userError;

        // Get all candidates with vote counts (simplified version)
        const { data: candidatesData, error: candidatesError } = await supabase
          .from('simple_candidates')
          .select('*')
          .order('created_at', { ascending: false });

        if (candidatesError) throw candidatesError;

        // Get vote counts for each candidate
        const { data: votesData, error: votesError } = await supabase
          .from('simple_votes')
          .select('candidate_id');

        if (votesError) throw votesError;

        // Count votes for each candidate
        const voteCount = {};
        votesData.forEach(vote => {
          voteCount[vote.candidate_id] = (voteCount[vote.candidate_id] || 0) + 1;
        });

        // Add vote count to candidates
        const processedCandidates = candidatesData.map(candidate => ({
          ...candidate,
          voteCount: voteCount[candidate.id] || 0
        }));

        setUser(userData);
        setCandidates(processedCandidates);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVote = async (candidateId) => {
    try {
      // Check if user has already voted
      if (user.has_voted) {
        alert('You have already cast your vote');
        return;
      }

      // Record the vote
      const { error: voteError } = await supabase
        .from('simple_votes')
        .insert([{ voter_email: user.email, candidate_id: candidateId }]);

      if (voteError) throw voteError;

      // Update user's voting status
      const { error: userUpdateError } = await supabase
        .from('simple_users')
        .update({ has_voted: true })
        .eq('id', user.id);

      if (userUpdateError) throw userUpdateError;

      // Update local state
      setUser(prev => ({ ...prev, has_voted: true }));
      
      // Update candidate vote count in local state
      setCandidates(prev => 
        prev.map(candidate => 
          candidate.id === candidateId 
            ? { ...candidate, voteCount: candidate.voteCount + 1 }
            : candidate
        )
      );

      alert('Your vote has been recorded successfully!');
    } catch (err) {
      console.error('Error casting vote:', err);
      alert('Failed to cast vote. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      
      <div className="dashboard-grid">
        {/* Section 1: User Profile */}
        <div className="dashboard-section">
          <ProfileSection user={user} />
        </div>
        
        {/* Section 2: User Role */}
        <div className="dashboard-section">
          <RoleSection user={user} />
        </div>
        
        {/* Section 3: Candidates/Voting */}
        <div className="dashboard-section">
          <CandidatesSection
            candidates={candidates}
            onVote={handleVote}
            userHasVoted={user?.has_voted}
            userRole={user?.role}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;