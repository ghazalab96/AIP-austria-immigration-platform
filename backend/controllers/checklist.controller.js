const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/checklists.json");

const getChecklists = () => {
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

const saveChecklists = (checklists) => {
  fs.writeFileSync(filePath, JSON.stringify(checklists, null, 2));
};

const defaultChecklist = {
  admissionLetter: false,
  passport: false,
  financialProof: false,
  healthInsurance: false,
  accommodationProof: false,
  passportPhoto: false,
  applicationForm: false
};

exports.getMyChecklist = (req, res) => {
  const checklists = getChecklists();

  const checklist = checklists.find((item) => item.userId === req.user.id);

  if (!checklist) {
    return res.json({
      userId: req.user.id,
      ...defaultChecklist
    });
  }

  res.json(checklist);
};

exports.saveMyChecklist = (req, res) => {
  const {
    admissionLetter,
    passport,
    financialProof,
    healthInsurance,
    accommodationProof,
    passportPhoto,
    applicationForm
  } = req.body;

  const checklists = getChecklists();

  const existingChecklist = checklists.find((item) => item.userId === req.user.id);

  if (existingChecklist) {
    existingChecklist.admissionLetter = Boolean(admissionLetter);
    existingChecklist.passport = Boolean(passport);
    existingChecklist.financialProof = Boolean(financialProof);
    existingChecklist.healthInsurance = Boolean(healthInsurance);
    existingChecklist.accommodationProof = Boolean(accommodationProof);
    existingChecklist.passportPhoto = Boolean(passportPhoto);
    existingChecklist.applicationForm = Boolean(applicationForm);
    existingChecklist.updatedAt = new Date().toISOString();

    saveChecklists(checklists);

    return res.json({
      message: "Checklist updated successfully",
      checklist: existingChecklist
    });
  }

  const newChecklist = {
    userId: req.user.id,
    admissionLetter: Boolean(admissionLetter),
    passport: Boolean(passport),
    financialProof: Boolean(financialProof),
    healthInsurance: Boolean(healthInsurance),
    accommodationProof: Boolean(accommodationProof),
    passportPhoto: Boolean(passportPhoto),
    applicationForm: Boolean(applicationForm),
    createdAt: new Date().toISOString(),
    updatedAt: null
  };

  checklists.push(newChecklist);
  saveChecklists(checklists);

  res.json({
    message: "Checklist saved successfully",
    checklist: newChecklist
  });
};