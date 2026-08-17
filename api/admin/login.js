const { optisyncFetch } = require("../../lib/optisync");

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const result = await optisyncFetch("/api/automation/admin/login", {
    method: "POST",
    body: JSON.stringify(req.body || {}),
  });
  return res.status(result.status || 502).json(result.data);
};
