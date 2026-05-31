const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/profiles.json");

const getProfiles = () => {
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

const saveProfiles = (profiles) => {
  fs.writeFileSync(filePath, JSON.stringify(profiles, null, 2));
};

exports.getMyProfile = (req, res) => {
  const profiles = getProfiles();

  const profile = profiles.find((item) => item.userId === req.user.id);

  if (!profile) {
    return res.json(null);
  }

  res.json(profile);
};

exports.saveMyProfile = (req, res) => {
  const {
    fullName,
    nationality,
    currentCountry,
    targetUniversity,
    targetProgram,
    studyLevel
  } = req.body;

  const profiles = getProfiles();

  const existingProfile = profiles.find((item) => item.userId === req.user.id);

  if (existingProfile) {
    existingProfile.fullName = fullName;
    existingProfile.nationality = nationality;
    existingProfile.currentCountry = currentCountry;
    existingProfile.targetUniversity = targetUniversity;
    existingProfile.targetProgram = targetProgram;
    existingProfile.studyLevel = studyLevel;
    existingProfile.updatedAt = new Date().toISOString();

    saveProfiles(profiles);

    return res.json({
      message: "Profile updated successfully",
      profile: existingProfile
    });
  }

  const newProfile = {
    userId: req.user.id,
    fullName,
    nationality,
    currentCountry,
    targetUniversity,
    targetProgram,
    studyLevel,
    createdAt: new Date().toISOString(),
    updatedAt: null
  };

  profiles.push(newProfile);
  saveProfiles(profiles);

  res.json({
    message: "Profile saved successfully",
    profile: newProfile
  });
};