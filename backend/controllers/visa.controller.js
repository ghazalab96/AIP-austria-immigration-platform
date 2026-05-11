const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/applications.json");

exports.getMyVisa = (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const myApps = data.filter(
    app => app.userId === req.user.id
  );

  const visas = myApps.map(app => ({
    applicationId: app.id,
    status: app.status,
    visaType: app.type,
    country: app.country
  }));

  res.json(visas);
};