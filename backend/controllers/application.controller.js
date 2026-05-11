const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/applications.json");

// helper
const getApplications = () => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (err) {
    return [];
  }
};

const saveApplications = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

exports.createApplication = (req, res) => {
  const { type, country, reason } = req.body;

   if (!type || !country) {
    return res.status(400).json({
      message: "type and country are required"
    });
  }

  const applications = getApplications();

  const newApp = {
    id: Date.now(),
    userId: req.user.id,
    type,        // e.g. student, work
    country,     // e.g. Austria
    reason,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: null,
    notes: ""
  };

  applications.push(newApp);
  saveApplications(applications);

  res.json({
    message: "Application created",
    application: newApp
  });
};

exports.getMyApplications = (req, res) => {
  const applications = getApplications();

  const myApps = applications.filter(
    app => app.userId === req.user.id
  );

  res.json(myApps);
};

exports.updateApplication = (req, res) => {
  const applications = getApplications();

  const app = applications.find(
    a => a.id == req.params.id && a.userId === req.user.id
  );  

  if (!app) {
    return res.status(404).json({ message: "Not found" });
  }

  if (app.status !== "pending") {
    return res.status(400).json({
      message: "Cannot edit after submission"
    });
  }

  const { type, country, reason } = req.body;

  if (!type && !country && !reason) {
    return res.status(400).json({
        message: "Nothing to update"
    });
  } 

  if (type) app.type = type;
  if (country) app.country = country;
  if (reason) app.reason = reason;

  app.updatedAt = new Date().toISOString();

  saveApplications(applications);

  res.json({
    message: "Application updated",
    application: app
  });
};

exports.deleteApplication = (req, res) => {
  let applications = getApplications();

  const filtered = applications.filter(
    a => !(a.id == req.params.id && a.userId === req.user.id)
  );

  if (filtered.length === applications.length) {
    return res.status(404).json({ message: "Not found" });
  }

  saveApplications(filtered);

  res.json({ message: "Deleted successfully" });
};