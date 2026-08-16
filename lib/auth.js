function readSecret(req) {
  const header = String(req.headers.authorization || "");
  if (header.toLowerCase().startsWith("bearer ")) {
    return header.slice(7).trim();
  }
  return String(req.headers["x-handler-secret"] || "").trim();
}

function requireHandlerAuth(req) {
  const expected = String(process.env.HANDLER_SECRET || "").trim();
  if (!expected) {
    return { ok: false, error: "HANDLER_SECRET is not configured on the handler." };
  }
  const provided = readSecret(req);
  if (!provided || provided !== expected) {
    return { ok: false, error: "Unauthorized" };
  }
  return { ok: true };
}

module.exports = { readSecret, requireHandlerAuth };
