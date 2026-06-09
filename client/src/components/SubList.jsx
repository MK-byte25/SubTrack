const SubList = ({ subs, fetchSubs }) => {
  const handleDelete = async (id) => {
    await fetch(`https://subtrack-backend-86nz.onrender.com/api/subscriptions/${id}`, { method: 'DELETE' });
    fetchSubs(); // Refresh the list
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Active Subscriptions</h5>
        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Cost</th>
              <th>Cycle</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((sub) => (
              <tr key={sub._id}>
                <td><strong>{sub.name}</strong></td>
                <td><span className="badge bg-secondary">{sub.category}</span></td>
                <td>${sub.cost.toFixed(2)}</td>
                <td>{sub.billingCycle}</td>
                <td>
                  <button onClick={() => handleDelete(sub._id)} className="btn btn-sm btn-outline-danger">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subs.length === 0 && <p className="text-center text-muted">No subscriptions tracked yet.</p>}
      </div>
    </div>
  );
};

export default SubList;