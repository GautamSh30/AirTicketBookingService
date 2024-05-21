const { BookingService } = require("../services/index");
const { StatusCodes } = require("http-status-codes");

const { REMINDER_BINDING_KEY } = require("../config/serverConfig");

const { createChannel, publishMessage } = require("../utils/messageQueue");

const bookingService = new BookingService();

class BookingController {
  constructor() {}

  async sendMessageToQueue(req, res) {
    const channel = await createChannel();
    const payload = {
      data: {
        subject: "This is noti from queue",
        content: "Soe queue will subscribe this",
        recepientEmail: "notificationservicesanket@gmail.com",
        notificationTime: "2024-05-21T15:35:00",
      },
      service: "CREATE_TICKET",
    };
    publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
    return res.status(200).json({
      message: "Successfully published the event",
    });
  }

  async create(req, res) {
    try {
      const response = await bookingService.createBooking(req.body);
      return res.status(StatusCodes.OK).json({
        message: "Successfully created a booking",
        success: true,
        err: {},
        data: response,
      });
    } catch (error) {
      return res.status(error.statusCode).json({
        message: error.message,
        success: false,
        err: error.explanation,
        data: {},
      });
    }
  }
}
module.exports = BookingController;
