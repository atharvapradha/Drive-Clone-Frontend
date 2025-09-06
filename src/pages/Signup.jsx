import { useState } from 'react';
import client from '../api/client';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await client.post('/api/auth/signup', {
        name,
        email,
        password,
      });

      if (res.data?.token) {
        // Save token & redirect to dashboard
        localStorage.setItem('token', res.data.token);
        nav('/dashboard');
      } else {
        alert('Signup successful! Please login.');
        nav('/login');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded shadow w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">Create Account</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          type="text"
          required
          className="mb-3 w-full p-2 border rounded"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
          className="mb-3 w-full p-2 border rounded"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
          className="mb-3 w-full p-2 border rounded"
        />

        <button className="w-full py-2 bg-green-600 text-white rounded">
          Sign Up
        </button>

        <p className="mt-3 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
