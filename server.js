const REPO_OWNER = "zexygodx";
const REPO_NAME = "lua-serzex";
const BRANCH = "main";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const method = request.method;

    if (method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    let filePath = "";

    if (method === "GET") {
      filePath = url.pathname.replace(/^\/+/, "");
    } else if (method === "POST") {
      const text = await request.text();
      const params = new URLSearchParams(text);
      filePath = params.get("key_path") || "";
    } else {
      return new Response("Method not allowed", {
        status: 405
      });
    }

    if (!filePath.endsWith(".lua") || filePath === "") {
      return new Response("Not found", {
        status: 404
      });
    }

    const rawUrl =
      `https://raw.githubusercontent.com/` +
      `${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${filePath}`;

    try {
      const response = await fetch(rawUrl);

      if (!response.ok) {
        return new Response("Not found", {
          status: 404
        });
      }

      const body = await response.text();

      return new Response(body, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (err) {
      return new Response("Proxy error", {
        status: 502
      });
    }
  }
};
