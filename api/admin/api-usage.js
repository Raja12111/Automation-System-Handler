const { requireAdminAccess } = require("../../lib/admin-session");
const { optisyncFetch } = require("../../lib/optisync");
const { fallbackPageStatuses } = require("../../lib/page-catalog");

async function handlePageStatus(req, res) {
  if (req.method === "GET") {
    const result = await optisyncFetch("/api/automation/admin/page-status", {
      method: "GET",
    });
    if (result.ok && Array.isArray(result.data && result.data.pages) && result.data.pages.length) {
      return res.status(200).json(result.data);
    }
    const fallback = fallbackPageStatuses();
    fallback.error =
      (result.data && result.data.error) ||
      "Showing the RankBrain X page list. Live status will sync when RankBrain X answers.";
    return res.status(200).json(fallback);
  }

  if (req.method === "PUT") {
    const result = await optisyncFetch("/api/automation/admin/page-status", {
      method: "PUT",
      body: JSON.stringify(req.body || {}),
    });
    if (result.ok && Array.isArray(result.data && result.data.pages)) {
      return res.status(result.status || 200).json(result.data);
    }
    return res.status(result.status || 502).json({
      error:
        (result.data && result.data.error) ||
        "Could not save page status on RankBrain X.",
    });
  }

  return res.status(405).json({ ok: false, error: "Method not allowed" });
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const auth = requireAdminAccess(req);
  if (!auth.ok) {
    return res.status(401).json({ ok: false, error: auth.error });
  }

  const resource = String((req.query && req.query.resource) || "").trim();
  if (resource === "page-status") {
    return handlePageStatus(req, res);
  }

  if (req.method === "PUT") {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const action = typeof body.action === "string" ? body.action : "";
    if (action === "connect" || action === "disconnect") {
      const result = await optisyncFetch("/api/automation/admin/api-usage", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      return res.status(result.status || 502).json(result.data);
    }
  }

  if (req.method === "GET" || req.method === "POST" || req.method === "PUT") {
    const method = req.method === "GET" ? "GET" : "POST";
    let result = await optisyncFetch("/api/automation/admin/api-usage", { method });
    if (!result.ok && result.status === 405 && method === "POST") {
      result = await optisyncFetch("/api/automation/admin/api-usage", { method: "GET" });
    }
    return res.status(result.status || 502).json(result.data);
  }

  return res.status(405).json({ ok: false, error: "Method not allowed" });
};
