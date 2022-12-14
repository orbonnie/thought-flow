import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState, useRef, Fragment } from "react";
import axios from "axios";
import { DateTime } from "luxon";
import {
  Route,
  Link,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";

import NavBar from "./NavBar.jsx";
import Home from "./Home.jsx";
import Profile from "./Profile.jsx";
import About from "./About.jsx";
import Contact from "./Contact.jsx";
import UserAuth from "./UserAuth.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";

const App = (props) => {
  const [user, setUser] = useState(sessionStorage.getItem("user"));
  const [email, setEmail] = useState(sessionStorage.getItem("email"));
  // const [userMsg, setUserMsg] = useState();

  const login = useRef();
  const profile = useRef();
  const alerts = useRef();

  const navigate = useNavigate();
  const location = useLocation();

  const config = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };

  useEffect(() => {
    window.addEventListener("beforeunload", submitSession);

    return () => {
      window.removeEventListener("beforeunload", submitSession);
    };
  }, []);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("user", user);
      sessionStorage.setItem("email", email);
    }
  }, [user]);

  /********** ALERT ***********/
  const showAlert = (msg, time = 2000, page) => {
    if (alerts.current) {
      alerts.current.classList.remove("hide");
      alerts.current.textContent = msg;
    }

    setTimeout(() => {
      if (alerts.current) {
        alerts.current.textContent = "";
        alerts.current.classList.add("hide");
        if (page) navigate(page);
      }
    }, 2000);
  };

  /********** CONTACT ***********/
  const submitContactForm = (msg) => {
    // const msg = {
    //   email: "bowens.swe@gmail.com",
    //   subject: "Testing",
    //   body: "This is my test"
    // }
    axios
      .post("/contact", msg, config)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err.response.data.msg));
  };

  /********** USER ***********/
  const getUser = (email, password) => {
    axios
      .get(`/users/${email}?password=${password}`)
      .then((result) => {
        setUser(result.data.name);
        sessionStorage.setItem("userId", result.data.id);
        setEmail(email);
        navigate("/");
      })
      .catch((err) => showAlert(err.response.data.msg, 6000));
  };

  const updateUser = (user) => {
    if (user) {
      setUser(user);
    } else {
      sessionStorage.clear();
      setUser(null);
      setEmail(null);
    }
  };

  /******** LOGIN / SIGNUP ********/
  const signupUser = (name, email, password) => {
    const user = { name: name, email: email, password: password };

    axios
      .post("/signup", user, config)
      .then((results) => {
        console.log("results", results.data);
        setUser(results.data.user);
        setEmail(results.data.email);
      })
      .catch((err) => {
        navigate("/auth");
        showAlert(err.response.data.msg);
      });
  };

  /********** SIGNOUT ***********/
  const signOut = () => {
    submitSession();
    updateUser("");
  };

  /********** POSTS ***********/
  const retrievePosts = (posts) => {
    setPosts(posts);
  };

  /********** PROFILE ***********/
  const updateProfile = (name, profEmail, cp, np) => {
    let userInfo;

    if (profEmail === email) {
      userInfo = {
        name: name,
        currentPassword: cp,
        newPassword: np,
        newEmail: null,
      };
    } else {
      userInfo = {
        name: name,
        currentPassword: cp,
        newPassword: np,
        newEmail: profEmail,
      };
    }

    axios
      .put(`/update_user/${email}`, userInfo, config)
      .then((res) => {
        console.log(res);
        setUser(name);
        if (profEmail) {
          setEmail(profEmail);
        }
      })
      .catch((err) => showAlert(err.response.data.msg));
  };

  const submitSession = () => {
    if (!sessionStorage.getItem("baseEmotionId")) {
      console.log("not enough session data");
      return;
    }

    const session = {
      user_id: sessionStorage.getItem("userId"),
      base_emotion_id: sessionStorage.getItem("baseEmotionId"),
      second_emotion_id: sessionStorage.getItem("secondEmotionId"),
      third_emotion_id: sessionStorage.getItem("thirdEmotionId"),
      date: DateTime.now().toISO(),
    };

    axios
      .post(`/sessions`, session, config)
      .then((results) => {
        console.log("results", results.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div id="app-container" className="container-fluid pt-2">
      <div id="nav-wrapper" className="container-fluid flex-nowrap">
        <NavBar user={user} showAlert={showAlert} />
      </div>
      <div id="user-alerts" ref={alerts} className="hide"></div>
      {/* {!location.pathname.includes("auth") && <h1>thoughtflow</h1>} */}
      <Routes>
        <Route path="/*" element={<Home user={user} showAlert={showAlert} />} />
        <Route
          path="/profile"
          element={
            <Profile
              user={user}
              email={email}
              updateProfile={updateProfile}
              showAlert={showAlert}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/contact"
          element={
            <Contact
              user={user}
              email={email}
              submitContactForm={submitContactForm}
            />
          }
        />
        <Route
          path="/auth/*"
          element={
            <UserAuth
              user={user}
              getUser={getUser}
              showAlert={showAlert}
              clear={signOut}
              signupUser={signupUser}
            />
          }
        />
      </Routes>
      {/* {location.pathname !== "/auth/*" && <h1>ThoughtFlow</h1>} */}
    </div>
  );
};

export default App;
