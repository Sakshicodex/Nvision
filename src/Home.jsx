import React from "react";
import HeroContent from "./HeroContent";
import RegistrationForm from "./RegistrationForm";
import Navbar from "./Navbar";



const Hero = () => {
  const scrollToRegistrationForm = () => {
    // Use document.querySelector with the ID or class of your RegistrationForm section
    document.getElementById("registration-form-section").scrollIntoView({
      behavior: 'smooth'
    });
  };
  return (
    <div className="relative flex flex-col h-full w-full" id="about-me">
     <Navbar></Navbar>
     <HeroContent onRegisterClick={scrollToRegistrationForm} />
      <RegistrationForm></RegistrationForm>
    </div>
  );
};

export default Hero;
