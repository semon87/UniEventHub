import Event from "../models/Event.js";
import Club from "../models/Club.js";

// @desc    Create event
// @route   POST /api/events
// @access  Private (Club)
export async function createEvent(req, res) {
  try {
    let { title, description, eventType, startDateTime, endDateTime, venue, entryFee, participantLimit, coverImage } = req.body;

    if (req.file) {
      coverImage = req.file.path;
    }

    // Validate dates
    if (new Date(endDateTime) <= new Date(startDateTime)) {
      return res.status(400).json({
        success: false,
        message: "End date and time must be after start date and time",
      });
    }

    const event = await Event.create({
      title,
      description,
      eventType: eventType || "Other",
      startDateTime,
      endDateTime,
      venue,
      entryFee,
      participantLimit: participantLimit || 0,
      coverImage,
      organizer: req.user._id,
    });

    // Add event to club's events array
    await Club.findByIdAndUpdate(req.user._id, {
      $push: { events: event._id },
    });

    await event.populate("organizer", "name email");

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// export async function getAllEvents(req, res) {
//   try {
//     const events = await Event.find()
//       .populate("organizer", "name email")
//       .sort({ startDateTime: 1 });
//     res.status(200).json({
//       success: true,
//       count: events.length,
//       data: events,
//     });
//   }
//   catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }

// }

// @desc    Get all events with filters
// @route   GET /api/events
// @access  Public
export async function getAllEvents(req, res) {
  try {
    const { search, startDate, endDate, status, organizer, showAll, type } = req.query;

    let query = { isApproved: true };

    // Allow organizers/moderators to see all events if requested
    // Note: ideally we should check req.user here, but this is a public endpoint currently.
    // For now, if organizer param is present, we trust the frontend to show what's needed, 
    // OR we change the logic to: if organizer param is set, show all their events regardless of approval.
    // But public users shouldn't see unapproved events of an organizer.
    // So, we should stick to: `isApproved: true` unless `showAll=true` AND `status` is provided or similar.
    
    // Simplest approach for this task:
    if (showAll === 'true') {
        delete query.isApproved;
    }
    
    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by date range
    if (startDate || endDate) {
      query.startDateTime = {};
      if (startDate) {
        query.startDateTime.$gte = new Date(startDate);
      }
      if (endDate) {
        query.startDateTime.$lte = new Date(endDate);
      }
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by organizer
    if (organizer) {
      query.organizer = organizer;
    }

    // Filter by event type
    if (type && type !== 'all') {
      query.eventType = type;
    }

    const events = await Event.find(query)
      .populate("organizer", "name email")
      .sort({ startDateTime: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export async function getEvent(req, res) {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name email")
      .populate("interestedStudents", "name studentId email")
      .populate("goingStudents", "name studentId email");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Club - Owner only)
export async function updateEvent(req, res) {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this event",
      });
    }

    let { title, description, startDateTime, endDateTime, venue, status, entryFee, participantLimit, coverImage } =
      req.body;

    if (req.file) {
      coverImage = req.file.path;
    }

    // Validate dates if both are provided
    if (startDateTime && endDateTime) {
      if (new Date(endDateTime) <= new Date(startDateTime)) {
        return res.status(400).json({
          success: false,
          message: "End date and time must be after start date and time",
        });
      }
    }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, startDateTime, endDateTime, venue, status, entryFee, participantLimit, coverImage },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Club - Owner only)
export async function deleteEvent(req, res) {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this event",
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    // Remove event from club's events array
    await Club.findByIdAndUpdate(req.user._id, {
      $pull: { events: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// @desc    Get event attendees (interested and going)
// @route   GET /api/events/:id/attendees
// @access  Private (Club - Owner only)
export async function getEventAttendees(req, res) {
  try {
    const event = await Event.findById(req.params.id)
      .populate("interestedStudents", "name studentId email department batch")
      .populate("goingStudents", "name studentId email department batch");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view attendees",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        interested: event.interestedStudents,
        interestedCount: event.interestedStudents.length,
        going: event.goingStudents,
        goingCount: event.goingStudents.length,
        totalCount:
          event.interestedStudents.length + event.goingStudents.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// @desc    Join event (Student)
// @route   POST /api/events/:id/join
// @access  Private (Student)
export async function joinEvent(req, res) {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.status === "cancelled" || event.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot join cancelled or completed event",
      });
    }

    // Check if already interested or going
    if (
      event.interestedStudents.includes(req.user._id) ||
      event.goingStudents.includes(req.user._id)
    ) {
      return res.status(400).json({
        success: false,
        message: "You have already joined this event",
      });
    }

    // Check participant limit
    if (event.participantLimit > 0 && event.goingStudents.length >= event.participantLimit) {
      return res.status(400).json({
        success: false,
        message: "Event participant limit reached",
      });
    }

    // Add to goingStudents
    event.goingStudents.push(req.user._id);
    await event.save();

    res.status(200).json({
      success: true,
      message: "Successfully joined event",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// @desc    Leave event (Student)
// @route   POST /api/events/:id/leave
// @access  Private (Student)
export async function leaveEvent(req, res) {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.status === "cancelled" || event.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot leave cancelled or completed event",
      });
    }

    // Check if student is in goingStudents
    const studentIndex = event.goingStudents.indexOf(req.user._id);
    if (studentIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "You are not registered for this event",
      });
    }

    // Remove from goingStudents
    event.goingStudents.splice(studentIndex, 1);
    await event.save();

    res.status(200).json({
      success: true,
      message: "Successfully left event",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
