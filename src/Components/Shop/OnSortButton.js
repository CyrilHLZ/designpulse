const SortButton = ({ label, onClick }) => {
    return (
        <button onClick={onClick}>
            {label}
        </button>
    );
};

export default SortButton;