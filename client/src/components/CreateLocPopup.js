import Popup from "reactjs-popup";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import { useAppContext } from "../context/appContext";

const CreateLocPopup = ({setDisplay}) => {
  const navigate = useNavigate();
  const { handleChange } = useAppContext();

  return (
    <div className="welcome">
      <Popup className="welcome" disableBackdropClick={true} backdrop="static" open={true} modal nested>
        <div
          className="modal"
          style={{
            width: "500px",
            maxWidth: "90vw",
            background: "#ffffff",
            padding: "1.5rem 2rem",
          }}
        >
          {/* <h3 className="header"> Warning </h3> */}
          <div className="content">
            {" "}
            BEFORE you add your own custom location please:
            <ul
              style={{
                listStyle: "inside",
                marginLeft: "1rem",
                marginTop: "0.5rem",
                textTransform: "capitalize",
              }}
            >
              <li>Make sure the information you input is correct</li>
              <li>Write an appropriate and correctly formatted school name</li>
              <li>Make sure that your location is not already listed (which may have been listed slightly differently)</li>
            </ul>
            <strong>Return</strong> to go back to existing locations if you are unsure about adding one, or <strong>Continue</strong> to add a new location.
          </div>
          <div className="modal-btn-container">
              <button
                className="btn btn-block submit-btn"
                onClick={() => {
                  setDisplay(false);
                }}
                style={{ margin: "0.5rem 0" }}
              >
                Return
              </button>
              <button
                className="btn btn-block modal-clear-btn"
                onClick={() => {
                  handleChange({ name: "pendingApproval", value: false });
                  setTimeout(() => {
                    navigate("/createLoc");
                  }, 500);
                }}
              >
                Continue
              </button>
            </div>
        </div>
      </Popup>
    </div>
  );
};
export default CreateLocPopup;

