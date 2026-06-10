const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/sessionRequests.json");

const getSessionRequests = () => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");

    if (!data) {
      return [];
    }

    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const saveSessionRequests = (sessionRequests) => {
  fs.writeFileSync(filePath, JSON.stringify(sessionRequests, null, 2));
};

exports.getMySessionRequests = (req, res) => {
  const sessionRequests = getSessionRequests();

  const myRequests = sessionRequests.filter(
    (request) => request.userId === req.user.id
  );

  res.json(myRequests);
};

exports.createSessionRequest = (req, res) => {
  const {
    topic,
    preferredDate,
    preferredTime,
    message
  } = req.body;

  if (!topic || !preferredDate || !preferredTime) {
    return res.status(400).json({
      message: "Topic, preferred date and preferred time are required"
    });
  }

  const sessionRequests = getSessionRequests();

  const newSessionRequest = {
    id: Date.now(),
    userId: req.user.id,
    topic,
    preferredDate,
    preferredTime,
    message: message || "",
    status: "pending",
    createdAt: new Date().toISOString()
  };

  sessionRequests.push(newSessionRequest);
  saveSessionRequests(sessionRequests);

  res.status(201).json({
    message: "Session request submitted successfully",
    sessionRequest: newSessionRequest
  });
};

exports.deleteSessionRequest = (req, res) => {
  const { id } = req.params;

  const sessionRequests = getSessionRequests();

  const requestIndex = sessionRequests.findIndex(
    (request) =>
      request.id === Number(id) &&
      request.userId === req.user.id
  );

  if (requestIndex === -1) {
    return res.status(404).json({
      message: "Session request not found"
    });
  }

  sessionRequests.splice(requestIndex, 1);

  saveSessionRequests(sessionRequests);

  res.json({
    message: "Session request deleted successfully"
  });
};

exports.getAllSessionRequestsForAdmin = (req, res) => {
  const sessionRequests = getSessionRequests();

  res.json(sessionRequests);
};

exports.updateSessionRequestStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["pending", "confirmed", "rejected"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid status"
    });
  }

  const sessionRequests = getSessionRequests();

  const sessionRequest = sessionRequests.find(
    (request) => request.id === Number(id)
  );

  if (!sessionRequest) {
    return res.status(404).json({
      message: "Session request not found"
    });
  }

  sessionRequest.status = status;
  sessionRequest.updatedAt = new Date().toISOString();

  saveSessionRequests(sessionRequests);

  res.json({
    message: "Session request status updated successfully",
    sessionRequest
  });
};

exports.deleteSessionRequestForAdmin = (req, res) => {
  const { id } = req.params;

  const sessionRequests = getSessionRequests();

  const requestIndex = sessionRequests.findIndex(
    (request) => request.id === Number(id)
  );

  if (requestIndex === -1) {
    return res.status(404).json({
      message: "Session request not found"
    });
  }

  sessionRequests.splice(requestIndex, 1);

  saveSessionRequests(sessionRequests);

  res.json({
    message: "Session request deleted successfully"
  });
};