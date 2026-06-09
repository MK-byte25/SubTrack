import { useState } from 'react';

const SubForm = ({ fetchSubs }) => {
  const [formData, setFormData] = useState({ name: '', cost: '', billingCycle: 'Monthly', category: 'Entertainment' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('https://subtrack-backend-86nz.onrender.com/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, cost: Number(formData.cost) })
    });
    setFormData({ name: '', cost: '', billingCycle: 'Monthly', category: 'Entertainment' });
    fetchSubs(); // Refresh the list
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">Add Subscription</h5>
        <form onSubmit={handleSubmit} className="row g-2">
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="Name (e.g., Netflix)" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="col-md-2">
            <input type="number" step="0.01" className="form-control" placeholder="Cost" value={formData.cost} onChange={(e) => setFormData({...formData, cost: e.target.value})} required />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={formData.billingCycle} onChange={(e) => setFormData({...formData, billingCycle: e.target.value})}>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="Category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required />
          </div>
          <div className="col-md-1">
            <button type="submit" className="btn btn-primary w-100">+</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubForm;