import React from 'react';
import './Dashboard.css';

const CandidatesSection = ({ candidates, onVote, userHasVoted, userRole }) => {
  // Sort candidates by vote count (descending)
  const sortedCandidates = [...candidates].sort((a, b) => b.voteCount - a.voteCount);

  return (
    <div className="candidates-card">
      <div className="candidates-header">
        <h2 className="candidates-title">Election Candidates</h2>
      </div>
      
      <div className="candidates-content">
        {sortedCandidates.length === 0 ? (
          <p className="no-candidates">No candidates available yet.</p>
        ) : (
          <div className="candidates-list">
            {sortedCandidates.map(candidate => (
              <div key={candidate.id} className="candidate-item">
                <div className="candidate-info">
                  <div>
                    <h3 className="candidate-name">{candidate.name}</h3>
                    <p className="candidate-description">{candidate.description}</p>
                  </div>
                  
                  <div className="vote-count">
                    <div className="badge">
                      {candidate.voteCount} {candidate.voteCount === 1 ? 'vote' : 'votes'}
                    </div>
                  </div>
                </div>
                
                {/* Vote button (only for voters who haven't voted yet) */}
                {userRole === 'voter' && !userHasVoted && (
                  <div className="vote-action">
                    <button
                      onClick={() => onVote(candidate.id)}
                      className="btn btn-accent w-100"
                    >
                      Vote for this Candidate
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Show message if user has already voted */}
        {userRole === 'voter' && userHasVoted && (
          <div className="voted-message">
            <p>
              You have already cast your vote. Thank you for participating!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatesSection;