exports.checkAustrianHoliday = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        message: "Date is required"
      });
    }

    const selectedDate = new Date(date);

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date format"
      });
    }

    const year = selectedDate.getFullYear();

    const apiUrl = `https://date.nager.at/api/v3/PublicHolidays/${year}/AT`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res.status(500).json({
        message: "Could not fetch Austrian public holidays"
      });
    }

    const holidays = await response.json();

    const holiday = holidays.find((item) => item.date === date);

    if (!holiday) {
      return res.json({
        date,
        isHoliday: false,
        holidayName: null,
        localName: null
      });
    }

    res.json({
      date,
      isHoliday: true,
      holidayName: holiday.name,
      localName: holiday.localName
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while checking public holiday"
    });
  }
};