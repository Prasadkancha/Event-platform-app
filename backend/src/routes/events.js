const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Event = require('../models/Event');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

/**
 * POST /api/events
 * body: { title, description, datetime, location, capacity }
 * file: image (optional)
 * protected
 */
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const data = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const evt = new Event({
      ...data,
      imageUrl,
      creator: req.user.id
    });
    await evt.save();
    res.json(evt);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

/**
 * PUT /api/events/:id
 * update event
 * protected, creator only
 */
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check permission - fetch user to see if admin
    const user = await User.findById(req.user.id);
    const isAdmin = user && user.isAdmin;

    if (event.creator.toString() !== req.user.id && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const data = req.body;
    // If file provided, update imageUrl, else keep existing
    if (req.file) {
      data.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

/**
 * GET /api/events
 * list events
 */
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ datetime: 1 }).limit(200);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/events/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const e = await Event.findById(req.params.id).populate('attendees', 'name email');
    if (!e) return res.status(404).json({ message: 'Event not found' });
    res.json(e);
  } catch (err) {
    res.status(400).json({ message: 'Invalid event id' });
  }
});

/**
 * POST /api/events/:id/rsvp
 */
router.post('/:id/rsvp', auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const eventId = req.params.id;

    // Atomic update: only update if user not in attendees AND attendees size < capacity
    const updated = await Event.findOneAndUpdate(
      {
        _id: eventId,
        attendees: { $ne: userId },
        $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] }
      },
      { $addToSet: { attendees: userId } },
      { new: true }
    );

    if (!updated) {
      // Check why it failed for better error message
      const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      if (event.attendees.includes(req.user.id)) return res.status(400).json({ message: 'Already RSVPed' });
      if (event.attendees.length >= event.capacity) return res.status(400).json({ message: 'Event is full' });
      return res.status(400).json({ message: 'Could not RSVP' });
    }

    // Add to user RSVPs (best effort)
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { rsvps: updated._id } }).catch(err => console.error(err));

    res.json({ message: 'RSVP successful', event: updated });
  } catch (err) {
    console.error('RSVP Error:', err);
    res.status(500).json({ message: 'Server error during RSVP' });
  }
});

/**
 * POST /api/events/:id/cancel
 */
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.id;
    const updated = await Event.findByIdAndUpdate(eventId, { $pull: { attendees: userId } }, { new: true });
    await User.findByIdAndUpdate(userId, { $pull: { rsvps: eventId } }).catch(() => { });
    res.json({ message: 'Cancelled', event: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * DELETE /api/events/:id
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check if user is creator or admin
    const user = await User.findById(req.user.id);
    const isAdmin = user && user.isAdmin;

    if (event.creator.toString() !== req.user.id && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
