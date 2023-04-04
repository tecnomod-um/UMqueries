import { Link } from "react-router-dom";
import StartButtonStyles from "./startButton.module.css";

function StartButton() {
    return (
        <Link to={'/queries'}>
            <button className={StartButtonStyles.button}>
                Go to query page
            </button>
        </Link>
    );
}

export default StartButton;