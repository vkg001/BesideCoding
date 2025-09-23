import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      Swal.fire({
        title: "Please Log In",
        text: "You must be logged in to access this page.",
        icon: "warning",
        confirmButtonText: "Login",
        confirmButtonColor: "#16a34a",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/signin");
        }
      });
    }
  }, [user, navigate]);

  // If user not logged in, don't render anything
  return user ? children : null;
};

export default RequireAuth;
