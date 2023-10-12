import React from 'react';
import './Confirm.css';
import { Button } from '../Button';
import Title from '../Title';
import Confetti from 'react-confetti';

export default function Confirm() {
  return (
    <div className="confirm-container">
    <Confetti numberOfPieces={100} />
    <div className="confirm-main-text">Account successfully confirmed !</div>
      <Button linkTo="/login" type="button" buttonStyle="btn--primary" buttonSize="btn--large">
        Login
      </Button>
    </div>
  );
}
