"use client";
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const SignupPro = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      const userId = signUpData.user?.id;

      if (userId) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ user_id: userId, email, name: email.split('@')[0], plan: 'pro' }]);

        if (profileError) {
          setError(profileError.message);
          return;
        }

        // Create organization if not provided
        const orgName = organizationName || `${email.split('@')[0]}'s Organization`;
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .insert([{ name: orgName }])
          .select()
          .single();

        if (orgError) {
          setError(orgError.message);
        } else {
          const organizationId = orgData.id;

          // Update profile with organization_id
          const { error: profileUpdateError } = await supabase
            .from('profiles')
            .update({ organization_id: organizationId })
            .eq('user_id', userId);

          if (profileUpdateError) {
            setError(profileUpdateError.message);
          } else {
            // Insert into organization_members table
            const { error: memberError } = await supabase
              .from('organization_members')
              .insert([{ organization_id: organizationId, user_id: userId, role: 'client' }]);

            if (memberError) {
              setError(memberError.message);
            } else {
              setSuccessMessage('Signup successful! Please check your email for the 6-digit token.');
            }
          }
        }
      }
    }
  };

  return (
    <div className="bg-gray-200 dark:bg-zinc-700 min-h-screen flex items-center justify-center w-full">
      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-800 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-secondary">Sign Up for Pro Plan</h1>
        {error && <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>}
        {successMessage && <p className="text-green-600 dark:text-green-400 mb-4">{successMessage}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="organizationName" className="block font-medium text-zinc-900 dark:text-white">Organization Name (optional)</label>
            <input
              type="text"
              id="organizationName"
              name="organizationName"
              placeholder='Your organization name (recommended)'
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="w-full p-2 border rounded bg-zinc-100 text-zinc-900"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-medium text-zinc-900 dark:text-white">Login Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter a valid email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded bg-zinc-100 text-zinc-900"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block font-medium text-zinc-900 dark:text-white">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder='At least 8 characters'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm w-full p-2 border rounded bg-zinc-100 text-zinc-900"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 top-1/3 right-0 pr-3 flex items-center text-zinc-500"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <div className="relative">
            <label htmlFor="confirmPassword" className="block font-medium text-zinc-900 dark:text-white">Confirm Password</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              placeholder='Confirm your password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="shadow-sm w-full p-2 border rounded bg-zinc-100 text-zinc-900"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 top-1/3 right-0 pr-3 flex items-center text-zinc-500"
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <button
            type="submit"
            className="shadow-md bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"

          >
            Sign Up
          </button>
        </form>
        <p className="text-lg text-center mt-8">
          <Link className='underline text-normal' to="/privacy-policy">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPro;