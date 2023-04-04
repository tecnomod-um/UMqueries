import { Link } from "react-router-dom";
import StartButtonStyles from "./StartButton.module.css";

function StartButton() {
    return (
        <Link to={'/queries'}>
            <button className={StartButton.button}>
                Go to query page
            </button>
        </Link>
    );
}

export default StartButton;