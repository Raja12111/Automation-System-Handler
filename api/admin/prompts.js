const { requireHandlerAuth } = require("../../lib/auth");
const { optisyncFetch } = require("../../lib/optisync");

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const auth = requireHandlerAuth(req);
  if (!auth.ok) {
    return res.status(401).json({ ok: false, error: auth.error });
  }

  if (req.method === "GET") {
    const result = await optisyncFetch("/api/automation/admin/prompts", {
      method: "GET",
    });
    return res.status(result.status || 502).json(result.data);
  }

  if (req.method === "PUT") {
    const result = await optisyncFetch("/api/automation/admin/prompts", {
      method: "PUT",
      body: JSON.stringify(req.body || {}),
    });
    return res.status(result.status || 502).json(result.data);
  }

  return res.status(405).json({ ok: false, error: "Method not allowed" });
};
