import React from 'react';
import SignUp from './SignUp';

const SignupPage = ({ onSignUp, onNavigateToLogin, loading, error }) => {
  return (
    <SignUp
      onSignUp={onSignUp}
      onNavigateToLogin={onNavigateToLogin}
      loading={loading}
      error={error}
    />
  );
};

export default SignupPage;
