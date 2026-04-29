import "./Login.css";   // ← ADDED
import { useState } from "react";
import API from "./api";
import logo from "./assets/blacklogo.png";  // ← ADDED

function Login({ onLogin }) {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setError("");
        setLoading(true);

        const url = isSignup ? `${API}/api/auth/signup` : `${API}/api/auth/login`;
        const body = isSignup
            ? { username: formData.username, email: formData.email, password: formData.password }
            : { email: formData.email, password: formData.password };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const res = await response.json();

            if (!response.ok) {
                setError(res.error || "Something went wrong");
            } else {
                localStorage.setItem("token", res.token);
                localStorage.setItem("username", res.username);
                onLogin(res.username);
            }
        } catch (err) {
            setError("Network error. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="loginPage">
            <div className="loginBox">
                <img src={logo} alt="logo" className="loginLogo" />  {/* ← CHANGED */}
                <h1>SigmaGPT</h1>
                <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>

                {isSignup && (
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                )}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === "Enter" ? handleSubmit() : ""}
                />

                {error && <p className="errorMsg">{error}</p>}

                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
                </button>

                <p className="switchText">
                    {isSignup ? "Already have an account?" : "Don't have an account?"}
                    <span onClick={() => setIsSignup(!isSignup)}>
                        {isSignup ? " Login" : " Sign Up"}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;