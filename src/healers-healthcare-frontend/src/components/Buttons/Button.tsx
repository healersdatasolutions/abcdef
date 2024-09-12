import React, { ReactNode, MouseEvent } from 'react';
import '../../../src/index.css';

interface ButtonProps {
    className?: string;
    href?: string;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    children: ReactNode;
    white?: boolean;
}

const Button: React.FC<ButtonProps> = ({ className, href, onClick, children, white }) => {
    // Rest of the code

    const classes = `button text-center relative inline-flex items-center justify-center py-0.5 overflow-hidden rounded-full group transition-colors px-0.5 ${white ? "text-n-8 bg-white" : "text-white bg-gradient-to-br"} hover:text-color-1 from-purple-500 to-pink-500 ${className || ""}`;

    const renderedButton = (
        <button className={classes} onClick={onClick}>
            <span className={`relative z-10 px-5 py-2.5 ${white ? '' : 'bg-gray-900'} rounded-full`}>{children}</span>
        </button>
    );

    const renderedLink = (
        <a href={href} className={classes}>
            <span className={`relative w-full px-5 py-2.5 ${white ? '' : 'bg-gray-900'} rounded-full`}>{children}</span>
        </a>
    );

    return href ? renderedLink : renderedButton;
};

export default Button;
