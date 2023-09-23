import React from 'react';
import './Home.css'; // Import the CSS file
import { Button } from '../Button';

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-main-text">Automation for business and home</div>
      <div className="home-sub-text">Save time and get more done</div>
      <Button linkTo="/register" type="button" buttonStyle="btn--primary" buttonSize="btn--large">
        Start today
      </Button>
    </div>
  );
}
