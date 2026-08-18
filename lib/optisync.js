function optisyncBase() {
  return String(process.env.OPTISYNC_URL || "")
    .trim()
    .replace(/\/$/, "");
}

async function optisyncFetch(path, init) {
  const base = optisyncBase();
  const secret = String(process.env.HANDLER_SECRET || "").trim();
  if (!base) {
    return {
      ok: false,
      status: 503,
      data: { error: "OPTISYNC_URL is not configured on the handler." },
    };
  }
  if (!secret) {
    return {
      ok: false,
      status: 503,
      data: { error: "HANDLER_SECRET is not configured on the handler." },
    };
  }

  try {
    const res = await fetch(`${base}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
        "X-Handler-Secret": secret,
        ...(init && init.headers ? init.headers : {}),
      },
      cache: "no-store",
    });
    const parsed = await res.json().catch(() => ({}));
    const data = parsed && typeof parsed === "object" ? parsed : {};
    if (!res.ok && typeof data.error !== "string") {
      data.error = `RankBrain X returned ${res.status}.`;
    }
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    return {
      ok: false,
      status: 502,
      data: {
        error: error instanceof Error ? error.message : "OptiSync request failed.",
      },
    };
  }
}

module.exports = { optisyncBase, optisyncFetch };
