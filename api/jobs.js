const { requireHandlerAuth } = require("../lib/auth");

function jobId() {
  return `job_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const auth = requireHandlerAuth(req);
  if (!auth.ok) {
    return res.status(401).json({ ok: false, error: auth.error });
  }

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      service: "automation-system-handler",
      usage: "POST JSON { type, clientId, payload } with Authorization: Bearer <HANDLER_SECRET>",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const type = String(body.type || "generic").trim() || "generic";
  const clientId = body.clientId ? String(body.clientId) : null;
  const id = body.id ? String(body.id) : jobId();
  const receivedAt = new Date().toISOString();

  return res.status(202).json({
    ok: true,
    accepted: true,
    jobId: id,
    type,
    clientId,
    receivedAt,
    source: req.headers["x-optisync-source"] || "optisync",
  });
};
