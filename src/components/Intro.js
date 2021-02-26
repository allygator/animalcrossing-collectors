import React, { useContext, useState, useEffect } from "react";
import UserContext from "./UserContext";

function Intro() {
  const userData = useContext(UserContext);
  
  return (
    <div
    >
      <h1>Welcome to AC:NH Critter Collector.</h1>
      <p>Use the globe to switch hemispheres.</p>
      <p>By default the buttons will display the currently available critters in your timezone. If your game is not in your timezone, check the box and use the specific month/time selectors.</p>
      <h3 className={userData?.authUser ? "reduce hidden" : "reduce"}>Login to save what you have caught and donated.</h3>
      </div>
  );
}

export default Intro;