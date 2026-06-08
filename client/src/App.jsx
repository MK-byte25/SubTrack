import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import SubForm from './components/SubForm';
import SubList from './components/SubList';

function App() {
  const [subs, setSubs] = useState([]);

  const fetchSubs = async () => {
    const res = await fetch('http://localhost:5000/api/subscriptions');
    const data = await res.json();
    setSubs(data);
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  return (
    <div className="container mt-5" style={{ maxWidth: '900px' }}>
      <h2 className="mb-4 text-center fw-bold">SubWatch FinTech Tracker</h2>
      <Dashboard subs={subs} />
      <SubForm fetchSubs={fetchSubs} />
      <SubList subs={subs} fetchSubs={fetchSubs} />
    </div>
  );
}

export default App;