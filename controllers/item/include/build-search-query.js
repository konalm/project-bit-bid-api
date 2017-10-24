/**
 * build query dependant of category and search query
 */
buildSearchQuery = function (req) {
  console.log('build search query');

  let querys = {}

  const category = req.params.category;
  const searchQuery = req.params.search_query;
  const regex = new RegExp(searchQuery, 'i');

  if (category !== 'default') { querys.category = category; }

  querys.sold = false;

  if (searchQuery !== 'default') {
    querys = Object.assign(
      querys,
      { $or:[ {'title': regex}, {'description': regex} ]}
    );
  }

  return querys;
}

module.exports = buildSearchQuery
