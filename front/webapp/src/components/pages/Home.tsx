import React from 'react';
import './Home.css';
import { Button } from '../Button';
import Title from '../Title';

export default function Home() {
  return (
    <div className="home-container">
      <Title title="Automation for business and home" />
      <div className="home-sub-text">Save time and get more done</div>
      <Button linkTo="/register" type="button" buttonStyle="btn--primary" buttonSize="btn--large">
        Start today
      </Button>
    </div>
  );
}
