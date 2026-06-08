const Dashboard = ({ subs }) => {
  // Calculate monthly burn rate and annual cost
  const monthlyTotal = subs.reduce((acc, curr) => {
    return curr.billingCycle === 'Monthly' ? acc + curr.cost : acc + (curr.cost / 12);
  }, 0);

  const annualTotal = monthlyTotal * 12;

  return (
    <div className="row mb-4 text-center">
      <div className="col-md-6">
        <div className="card bg-danger text-white shadow-sm">
          <div className="card-body">
            <h5>Monthly Burn Rate</h5>
            <h2>${monthlyTotal.toFixed(2)}</h2>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card bg-dark text-white shadow-sm">
          <div className="card-body">
            <h5>Total Annual Cost</h5>
            <h2>${annualTotal.toFixed(2)}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;