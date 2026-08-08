import Event from "../models/Event.js";

/*
|--------------------------------------------------------------------------
| Create Event
|--------------------------------------------------------------------------
*/

export const createEvent = async (req, res) => {
  try {
    const { title, date, budget, description } = req.body;

    const event = await Event.create({
      userId: req.user._id,

      title,

      date,

      budget,

      description,
    });

    res.status(201).json({
      success: true,

      message: "Event created successfully",

      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Events
|--------------------------------------------------------------------------
*/

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({
      userId: req.user._id,
    })

      .sort({
        date: 1,
      });

    res.status(200).json({
      success: true,

      count: events.length,

      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Event
|--------------------------------------------------------------------------
*/

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,

      userId: req.user._id,
    });

    if (!event) {
      return res.status(404).json({
        success: false,

        message: "Event not found",
      });
    }

    event.title = req.body.title ?? event.title;

    event.date = req.body.date ?? event.date;

    event.budget = req.body.budget ?? event.budget;

    event.description = req.body.description ?? event.description;

    event.status = req.body.status ?? event.status;

    const updatedEvent = await event.save();

    res.status(200).json({
      success: true,

      message: "Event updated successfully",

      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Event
|--------------------------------------------------------------------------
*/

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,

      userId: req.user._id,
    });

    if (!event) {
      return res.status(404).json({
        success: false,

        message: "Event not found",
      });
    }

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
};
