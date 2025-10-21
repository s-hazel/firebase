import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from "../fb/fbConfig.js"
import { useNavigate } from "react-router-dom"
import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext.js";
import "./Login.css"

function Login() {
    const { setSignedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleGoogle = async (e) => {
        e.preventDefault();
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    const reset = (ev) => {
        const email = document.getElementById("email").value;
        sendPasswordResetEmail(auth, email)
            .then(() => {
                setEmailError("Sent!")
            })
            .catch((err) => {
                if (err.code === "auth/missing-email") {
                    setEmailError('Enter your email then press "Forgot?" again')
                }
            });
    };

    const authEmail = async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Reset error messages
        setEmailError("");
        setPasswordError("");

        // Check if fields are empty
        if (!email) {
            setEmailError("Email is required");
            return;
        } else if (!emailPattern.test(email)) {
            setEmailError("Please enter a valid email address");
            return;
        }
        if (!password) {
            setPasswordError("Password is required");
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCred) => {
                setSignedIn(true);
                navigate("/dashboard");
            })
            .catch((err) => {
                const error = err.code;
                if (error === "auth/wrong-password" || error === "auth/invalid-credential") {
                    setPasswordError("Incorrect password");
                } else if (error === "auth/user-not-found") {
                    setEmailError("User not found");
                } else {
                    setPasswordError("Login failed. Please try again.");
                }
            });
    };

    const createEmail = async (e) => {
        e.preventDefault()
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        // Account Created
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCred) => {
                alert("account created successfully")
            })
            .catch((err) => {
                const error = err.code

                if (error === "auth/email-already-in-use") {
                    alert("Email already in use!")
                } else if (error === "auth/weak-password") {
                    alert("Password must be at least 6 characters long")
                }
            })
    }

    return (
        <div className="login-page">
            <div className="two-sided">
                <div className="left">
                    <form onSubmit={authEmail} className="traditional" noValidate>
                        <img src="1421c84b-93b0-404c-9efa-7c43108b279f.png" alt="" className='logo' />
                        <p className="app-name">MHS Hack Club TVs</p>
                        <p className="tagline">Sign In</p>
                        <div className="hr"></div>

                        <p className="label">Email</p>
                        <input type="email" className="email" id="email" autoComplete="username" />
                        {emailError && <p className="error-message">{emailError}</p>}

                        <div className="pass">
                            <p className="label">Password</p>
                            <p className="forgot" onClick={reset}>Forgot?</p>
                        </div>
                        <input type="password" className="password" id="password" autoComplete="current-password" />
                        {passwordError && <p className="error-message">{passwordError}</p>}

                        {/* <div className="alt-login">
                    <button onClick={handleGoogle} className="login">
                        <img src="g-logo.svg" alt="" />
                    </button>
                </div> */}

                        <button className="submit" id="submit">Sign In</button>
                        <p className='authority'>Authorized Access Only</p>
                    </form>
                </div>
                <div className="right">
                </div>
            </div>
        </div>
    );
}

export default Login;
