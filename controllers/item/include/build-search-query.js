/**
 * build query dependant of category and search query
 */
buildSearchQuery = function (req) {
  let querys = {}

  const category = req.params.category;
  const searchQuery = req.params.search_query;
  const listing = req.params.listing;
  const regex = new RegExp(searchQuery, 'i');

  if (category !== 'default') { querys.category = category; }

  if (listing === 'marketplace') { querys.listingType = 1 }
  if (listing === 'auction') { querys.listingType = 2 }

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
