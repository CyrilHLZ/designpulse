const ClickButton = ({ label, onClick }) => {
    return (
                <button onClick={onClick}>
                    {label}
                </button>
    );
};

export default ClickButton;