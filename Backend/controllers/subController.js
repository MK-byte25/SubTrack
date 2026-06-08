const Subscription = require('../models/Subscription');

// Get all subscriptions
const getSubs = async (req, res) => {
  try {
    const query = req.query.userId ? { userId: req.query.userId } : {};
    const subs = await Subscription.find(query).sort({ createdAt: -1 });
    res.status(200).json(subs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new subscription
const addSub = async (req, res) => {
  try {
    const newSub = new Subscription(req.body);
    const savedSub = await newSub.save();
    res.status(201).json(savedSub);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a subscription
const deleteSub = async (req, res) => {
  try {
    await Subscription.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Subscription deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a subscription
const updateSub = async (req, res) => {
  try {
    const updatedSub = await Subscription.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.status(200).json(updatedSub);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getSubs, addSub, deleteSub, updateSub };