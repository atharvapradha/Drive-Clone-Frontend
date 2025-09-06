import { useState } from 'react';
import client from '../api/client';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await client.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      // Redirect to dashboard after successful login
      nav('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded shadow w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">Login</h2>
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
        <button className="w-full py-2 bg-blue-600 text-white rounded">
          Sign in
        </button>
        <p className="mt-3 text-sm">
          No account?{' '}
          <Link to="/signup" className="text-blue-600">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
