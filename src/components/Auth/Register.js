import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../../utils/supabase';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    role: 'voter' // Default role
  });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Register user with Supabase Auth
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (authError) throw authError;

      // Upload photo to storage if provided
      let photoUrl = null;
      if (photo) {
        console.log("Starting photo upload...");
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        // Upload the file
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(filePath, photo);
          
        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw uploadError;
        }
        
        console.log("Upload successful:", uploadData);
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(filePath);
          
        photoUrl = urlData.publicUrl;
        console.log("Generated photo URL:", photoUrl);
      }

      // Insert user data into simple_users table
      console.log("Inserting user with photo URL:", photoUrl);
      const { data: insertData, error: insertError } = await supabase
        .from('simple_users')
        .insert({
          email: formData.email,
          name: formData.name,
          dob: formData.dob,
          photo_url: photoUrl,
          role: formData.role,
          has_voted: false
        })
        .select();

      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }
      
      console.log("User inserted successfully:", insertData);

      // Registration successful - redirect to login
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create an Account</h2>
        
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a strong password"
              minLength="6"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="photo">Profile Photo</label>
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={handleFileChange}
              accept="image/*"
              className="file-input"
            />
            <small className="form-text text-muted">Upload a profile photo (optional)</small>
          </div>
          
          <div className="input-group">
            <label>Role</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="role"
                  value="voter"
                  checked={formData.role === 'voter'}
                  onChange={handleChange}
                />
                <span>Voter</span>
              </label>
              
              <label className="radio-label">
                <input
                  type="radio"
                  name="role"
                  value="host"
                  checked={formData.role === 'host'}
                  onChange={handleChange}
                />
                <span>Host/Party</span>
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;