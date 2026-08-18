const { requireAdminAccess } = require("../lib/admin-session");
const { optisyncBase, optisyncFetch } = require("../lib/optisync");

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const auth = requireAdminAccess(req);
  if (!auth.ok) {
    return res.status(401).json({ ok: false, error: auth.error });
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const handshake = await optisyncFetch("/api/automation/handshake", {
    method: req.method,
    ...(req.method === "POST" ? { body: JSON.stringify(req.body || {}) } : {}),
  });

  return res.status(handshake.ok ? 200 : handshake.status || 502).json({
    ok: handshake.ok,
    linked: Boolean(handshake.ok && handshake.data && handshake.data.linked),
    service: "automation-system-handler",
    optisyncUrl: optisyncBase() || null,
    rankbrainx: handshake.data || null,
    time: new Date().toISOString(),
  });
};
