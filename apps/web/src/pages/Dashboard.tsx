import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { token, logout, user } = useAuth();
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState('');

    const handleScrape = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ url }),
            });

            if (response.ok) {
                setStatus('Scrape job queued successfully!');
                setUrl('');
            } else {
                setStatus('Failed to queue job.');
            }
        } catch (_err) {
            setStatus('Error connecting to server.');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Dashboard</h2>
                <span>Welcome, {user?.email}</span>
                <button onClick={logout} style={{ backgroundColor: 'var(--color-error)' }}>Logout</button>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface)', padding: '2rem', borderRadius: '12px' }}>
                <h3>Request New Scrape</h3>
                <form onSubmit={handleScrape}>
                    <input
                        type="url"
                        placeholder="Enter URL to scrape"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                    />
                    <button type="submit">Scrape URL</button>
                </form>
                {status && <p style={{ marginTop: '1rem', color: 'var(--color-primary)' }}>{status}</p>}
            </div>
        </div>
    );
}
