const httpStatus = require("http-status-codes"),
  contentTypes = require("./contentTypes"),
  utils = require("./utils");

const routes = { GET: {}, POST: {} };

exports.handle = (req, res) => {
  const path = req.url.split("?")[0];
  const action = routes[req.method] && routes[req.method][path];

  if (!action) {
    res.writeHead(httpStatus.NOT_FOUND, contentTypes.html);
    return utils.getFile("views/error.html", res);
  }

  try {
    action(req, res);
  } catch (e) {
    console.log(`Error handling ${req.method} ${req.url}: ${e.message}`);
    res.writeHead(httpStatus.INTERNAL_SERVER_ERROR, contentTypes.html);
    utils.getFile("views/error.html", res);
  }
};

exports.get = (url, action) => { routes["GET"][url] = action; };
exports.post = (url, action) => { routes["POST"][url] = action; };