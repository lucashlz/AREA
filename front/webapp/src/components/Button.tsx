import React from 'react';
import './Button.css';
import { Link } from 'react-router-dom';

type ButtonProps = {
    children: React.ReactNode;
    type: "button" | "submit" | "reset";
    onClick?: () => void;
    buttonStyle: 'btn--primary' | 'btn--outline' | 'btn--primary-inverted';
    buttonSize: 'btn--medium' | 'btn--large';
    linkTo?: string;
};

export const Button: React.FC<ButtonProps> = ({
    children,
    type,
    onClick,
    buttonStyle = 'btn--primary',
    buttonSize = 'btn--medium',
    linkTo
}) => {
    if (linkTo) {
        return (
            <Link to={linkTo} className={`btn ${buttonStyle} ${buttonSize}`}>
                {children}
            </Link>
        );
    } else {
        return (
            <button
                className={`btn ${buttonStyle} ${buttonSize}`}
                onClick={onClick}
                type={type}
            >
                {children}
            </button>
        );
    }
};
