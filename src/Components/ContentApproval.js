import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase'; // Ensure this points to your Firestore configuration
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';

const ContentApproval = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      const q = query(collection(firestore, 'campaigns')); // Replace 'campaigns' with your collection name
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubmissions(data);
    };

    fetchSubmissions();
  }, []);

  const handleApprove = async (submissionId) => {
    const submissionRef = doc(firestore, 'campaigns', submissionId); // Ensure the collection name matches
    await updateDoc(submissionRef, { status: 'approved' });
    // Optionally, refresh the list or indicate approval in the UI
  };

  const handleRequestRevision = async (submissionId) => {
    const submissionRef = doc(firestore, 'campaigns', submissionId); // Ensure the collection name matches
    await updateDoc(submissionRef, { status: 'revision requested', feedback });
    // Optionally, refresh the list or indicate the revision request in the UI
  };

  const selectSubmission = (submission) => {
    setSelectedSubmission(submission);
    setFeedback(submission.feedback || '');
  };

  const renderSubmissionDetails = () => {
    if (!selectedSubmission) return null;

    return (
      <div>
        <h3>Content Details</h3>
        <p>{selectedSubmission.content}</p> {/* Adjust this based on your content structure */}
        <button onClick={() => handleApprove(selectedSubmission.id)}>Approve</button>
        <button onClick={() => handleRequestRevision(selectedSubmission.id)}>Request Revision</button>
        <div>
          <textarea
            placeholder="Enter feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2>Content Approval</h2>
      <div>
        {submissions.map((submission) => (
          <div key={submission.id} onClick={() => selectSubmission(submission)}>
            <p>Influencer: {submission.influencerName}</p>
            <p>Content Type: {submission.contentType}</p>
            <p>Status: {submission.status}</p>
          </div>
        ))}
      </div>
      {renderSubmissionDetails()}
    </div>
  );
};

export default ContentApproval;
