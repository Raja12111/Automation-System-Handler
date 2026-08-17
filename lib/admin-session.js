const { createHmac, timingSafeEqual } = require("crypto");

function signingSecret() {
  return String(process.env.HANDLER_SECRET || "").trim();
}

function signBody(body, secret) {
  return createHmac("sha256", secret).update(body).digest("base64url");
}

function verifyAdminToken(token) {
  const secret = signingSecret();
  if (!secret || !token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = signBody(body, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (payload.role !== "ADMIN" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function requireAdminAccess(req) {
  const header = String(req.headers.authorization || "");
  const provided = header.toLowerCase().startsWith("bearer ")
    ? header.slice(7).trim()
    : String(req.headers["x-handler-secret"] || "").trim();
  const expected = signingSecret();
  if (!expected) {
    return { ok: false, error: "HANDLER_SECRET is not configured on the handler." };
  }
  if (provided && provided === expected) {
    return { ok: true };
  }
  if (verifyAdminToken(provided)) {
    return { ok: true };
  }
  return { ok: false, error: "Unauthorized" };
}

module.exports = { verifyAdminToken, requireAdminAccess };
