exports.searchUniversities = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "University name is required"
      });
    }

    const apiUrl =
      `http://universities.hipolabs.com/search?name=${encodeURIComponent(name)}&country=Austria`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res.status(500).json({
        message: "Could not fetch universities"
      });
    }

    const data = await response.json();

    const cleanedUniversities = data.map((university) => {
      return {
        name: university.name,
        country: university.country,
        website: university.web_pages && university.web_pages.length > 0
          ? university.web_pages[0]
          : null,
        domain: university.domains && university.domains.length > 0
          ? university.domains[0]
          : null
      };
    });

    res.json(cleanedUniversities);

  } catch (error) {
    res.status(500).json({
      message: "Server error while searching universities"
    });
  }
};