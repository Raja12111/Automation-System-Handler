const { requireHandlerAuth } = require("../lib/auth");

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const auth = requireHandlerAuth(req);
  if (!auth.ok) {
    return res.status(401).json({ ok: false, error: auth.error });
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  return res.status(200).json({
    ok: true,
    linked: true,
    service: "automation-system-handler",
    optisyncUrl: process.env.OPTISYNC_URL || null,
    time: new Date().toISOString(),
  });
};
