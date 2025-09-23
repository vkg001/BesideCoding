import React, { useState } from 'react'; // No longer need useRef for this
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// 1. Import the hook instead of the component
import { useGoogleLogin } from '@react-oauth/google'; 
import Swal from 'sweetalert2';
import '@lottiefiles/lottie-player';
import successLoginAnimation from '../assets/Pin code Password Protection, Secure Login animation.json';
import withReactContent from 'sweetalert2-react-content';
import Lottie from 'lottie-react'; // You're using <Lottie />, so this is needed

const MySwal = withReactContent(Swal);

// --- Your components (AuthPageLogo, GoogleIcon, GitHubIcon) are unchanged ---
const AuthPageLogo = () => (
    <div className="flex flex-col items-center mb-8">
      <img src="src/assets/besideCoding-Full.png" alt="besideCoding Logo" className="h-[100px] w-auto" />
    </div>
);
const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C14.01,4.73 15.47,5.36 16.63,6.44L18.88,4.19C17.02,2.62 14.77,1.75 12.19,1.75C6.93,1.75 2.86,5.82 2.86,12C2.86,18.18 7.02,22.25 12.19,22.25C17.6,22.25 21.5,18.33 21.5,11.33C21.5,10.74 21.43,10.43 21.35,11.1Z" />
    </svg>
);
const GitHubIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
);
// --- End of unchanged components ---
export const showLottieSuccess = async (message) => {
  await MySwal.fire({
    title: <p className="text-white text-lg font-bold">Login Successful!</p>,
    html: (
      <div className="flex flex-col items-center">
        <div className="w-40 h-40">
          <Lottie animationData={successLoginAnimation} loop={false} />
        </div>
        <p className="mt-4 text-white">{message}</p>
      </div>
    ),
    background: "#1e1e1e",
    showConfirmButton: true,
    confirmButtonText: "Ok",
    confirmButtonColor: "#22c55e",
    customClass: {
      popup: 'rounded-2xl shadow-xl',
      confirmButton: 'bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-6 py-2',
    },
    showClass: {
      popup: 'animate__animated animate__fadeInDown',
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp',
    },
  });
};

const SignInPage = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  // 2. We no longer need the ref for the Google button
  // const googleLoginRef = useRef(null); 
  

  const handleSubmit = async (e) => {
    // ... (Your existing form submission logic is fine)
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/signin', {
        email: emailOrUsername,
        password: password,
      }, { withCredentials: true });

      const { message, is_admin } = res.data;
      await showLottieSuccess(message);


      if (is_admin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An unexpected server error occurred';
      Swal.fire({ title: 'Login Failed', text: errorMessage, icon: 'error' });
    }
  };

  const handleGoogleError = () => {
    Swal.fire({ title: 'Login Failed', text: 'An error occurred during Google authentication.', icon: 'error' });
  };
  
  // 3. Use the hook to get a login function
  const googleLogin = useGoogleLogin({
    // This is the success callback
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      // IMPORTANT: The hook gives you an access_token.
      // Your backend was expecting a JWT `credential`. You need to adjust the backend
      // or send this access_token to the backend to get user info.
      try {
        const res = await axios.post('http://localhost:8080/api/auth/google', {
          // Send the access_token to your backend
          access_token: tokenResponse.access_token,
        }, { withCredentials: true });
          
        const { message, is_admin } = res.data;
        await showLottieSuccess(message);

        
        if (is_admin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/profile');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Google Sign-in failed!';
        Swal.fire({ title: 'Login Failed', text: errorMessage, icon: 'error' });
      }
    },
    // This is the error callback
    onError: handleGoogleError,
  });

  return (
    <>
      {/* 4. We can completely remove the hidden GoogleLogin component */}

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <AuthPageLogo />
        </div>
        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Form inputs are unchanged */}
              <div>
                <input id="email-username" name="email-username" type="text" required value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" placeholder="Username or E-mail"/>
              </div>
              <div>
                <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" placeholder="Password"/>
              </div>
              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <a href="#" className="font-medium text-orange-600 hover:text-orange-500">
                    Forgot Password?
                  </a>
                </div>
              </div>
              <div>
                <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 cursor-pointer">
                  Sign In
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-orange-600 hover:text-orange-500">
                  Sign Up
                </Link>
              </p>
            </div>

            <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">or you can sign in with</span></div>
            </div>
            
            <div className="mt-6 flex justify-center space-x-4">
              {/* 5. Update the onClick to call the function from the hook */}
              <button
                  type="button"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer"
                  aria-label="Sign in with Google"
                  onClick={() => googleLogin()}
              >
                  <GoogleIcon />
              </button>
              <button
                  type="button"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer"
                  aria-label="Sign in with GitHub"
              >
                  <GitHubIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInPage;