const generateRequestId = require("./generateRequestId");

function createResponse(status, message, data = {}, error = {}) {
  return {
    status,
    message,
    data: {
      ...data,
      timestamp: Math.floor(Date.now() / 1000),
      requestId: generateRequestId(),
    },
    error: {
      code: error.code || null,
      details: error.details || null,
    },
  };
}

module.exports = createResponse;
