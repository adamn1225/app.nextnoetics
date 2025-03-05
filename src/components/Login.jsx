"use client";
import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient"; // Ensure the correct path to supabaseClient
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVerified, setIsVerified] = useState(true); // Add state to track verification status

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting to log in...");
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log("Login successful, fetching user profile...");
      // Fetch the user's profile to determine their role
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;

      if (!userId) {
        throw new Error("User ID not found");
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (!profileData) {
        throw new Error("No profile data found");
      }

      // Check if the user is verified
      if (!authData.user || !authData.user.email_confirmed_at) {
        setIsVerified(false);
        throw new Error("Please verify your email to continue.");
      }

      console.log("Profile data found, redirecting...");
      // Redirect based on user role
      if (profileData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      setError("");

      const { error } = await supabase.auth.resend({
        type: "signup", // Add the type property
        email,
      });

      if (error) throw error;

      setError("Verification email resent. Please check your inbox.");
    } catch (err) {
      console.error("Resend verification failed:", err);
      setError(err.message || "Failed to resend verification email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-700">
      <div className="bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-md w-5/6 md:w-full max-w-md">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-white text-center mb-6">
          Client Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-900 dark:text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full text-zinc-900 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-900 dark:text-white"
            >
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border text-zinc-900 border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 top-1/3 right-0 pr-3 flex items-center text-zinc-500"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-blue-500 dark:text-blue-400 hover:underline">
              <Link to="/reset-password">Forgot Password?</Link>
            </p>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="onboardbutton flex justify-center w-full text-white font-bold py-3 px-6 rounded-lg"
          >
            {loading ? "Logging in..." : "Log In"}
            <div className="arrow-wrapper">
              <div className="arrow"></div>
            </div>
          </button>
          {!isVerified && (
            <div className="mt-4 text-center">
              <p className="text-sm text-zinc-600 dark:text-zinc-50">Didn&quot;t receive the verification email?</p>
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={loading}
                className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Resend Verification Email
              </button>
            </div>
          )}
          <p className="text-lg text-center text-blue-500 hover:text-blue-500 dark:hover:text-blue-500 dark:text-blue-400 underline ">
            <Link to="/">Go back to homepage</Link>
          </p>
          <p className="text-lg text-center">
            <Link className='underline text-sm text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 dark:text-blue-300' to="/privacy-policy">
              Privacy Policy
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;