module.exports = function handler(req, res) {
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(200).json({
    ok: true,
    service: "automation-system-handler",
    role: "optisync-handler",
    configured: Boolean(String(process.env.HANDLER_SECRET || "").trim()),
    optisyncUrl: process.env.OPTISYNC_URL || null,
    time: new Date().toISOString(),
  });
};
