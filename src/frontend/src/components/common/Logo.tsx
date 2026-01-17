interface LogoProps {
    className?: string;
}

export const Logo = ({ className = 'h-12' }: LogoProps) => {
    return (
        <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBmN7AeougHlExYeMjobtXWIaTtsOqIGck5g&s"
            alt="Tuya Bank Logo"
            className={`object-contain ${className}`}
        />
    );
};
