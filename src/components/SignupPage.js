import React from 'react';
import SignUp from './SignUp';

const SignupPage = ({ onSignUp, onNavigateToLogin }) => {
  return <SignUp onSignUp={onSignUp} onNavigateToLogin={onNavigateToLogin} />;
};

export default SignupPage;
