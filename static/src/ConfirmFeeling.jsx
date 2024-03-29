import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const ConfirmFeeling = ({ sendFeeling, checkMsgStatus }) => {
  const msg = useRef();

  const navigate = useNavigate();

  const getConfirm = (e) => {
    let answer = e.target.value;
    if (answer === "yes") {
      sessionStorage.removeItem("baseEmotionId");
      sessionStorage.removeItem("secondEmotionId");
      sessionStorage.removeItem("thirdEmotionId");
      sessionStorage.removeItem("feeling");
      sessionStorage.removeItem("entry");
      sendFeeling(null);
      checkMsgStatus();
    }

    e.target.checked = false;
    msg.current.classList.add("hide");
    document.getElementById("greet-info").classList.remove("hide");
    navigate("/");
  };

  return (
    <div
      id="confirm-wrapper"
      className="hide container fs-6 p-2 text-center shadow rounded"
      ref={msg}
    >
      <h6 className="">do you want to change your emotion?</h6>
      <form action="#" className="form-check-inline">
        <input
          type="radio"
          name="confirm"
          value="yes"
          className="form-check-input me-2"
          onChange={getConfirm}
        />
        <label htmlFor="confirm" className="form-check-label">
          yes
        </label>
        <input
          type="radio"
          name="confirm"
          value="no"
          className="form-check-input ms-3 me-2"
          onChange={getConfirm}
        />
        <label htmlFor="confirm" className="form-check-label">
          no
        </label>
      </form>
    </div>
  );
};

export default ConfirmFeeling;
