export const searchCourses = async (req, res) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      rating,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    // 🔎 Keyword Search
    if (keyword) {
      query.$text = { $search: keyword };
    }

    // 📂 Category Filter
    if (category) {
      query.category = category;
    }

    // 💲 Price Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // ⭐ Rating Filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // 📄 Pagination
    const skip = (page - 1) * limit;

    // 🔃 Sorting
    let sortOption = {};
    if (sort === "price_asc") sortOption.price = 1;
    if (sort === "price_desc") sortOption.price = -1;
    if (sort === "rating") sortOption.rating = -1;
    if (sort === "newest") sortOption.createdAt = -1;

    const courses = await Course.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: courses
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};