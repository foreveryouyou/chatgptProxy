export default {
  async fetch(request, env) {
    if (request.method == "OPTIONS") {
      const respHeaders = new Headers();
      respHeaders.append("Access-Control-Allow-Origin", "*");
      respHeaders.append("Access-Control-Allow-Headers", "*");
      const response = new Response(null, { headers: respHeaders });
      return response;
    }

    const url = new URL(request.url);
    url.host = "api.openai.com";

    if (!url.pathname.startsWith("/v1/")) {
      return env.ASSETS.fetch(request);
    }

    // 添加自定义头, OPENAI_KEY 在 cloudflare 环境变量中设置
    const reqHeaders = new Headers(request.headers);
    reqHeaders.set("Authorization", "Bearer " + env.OPENAI_KEY);
    // 请求 openai api
    const resp = await fetch(url, {
      headers: reqHeaders,
      method: request.method,
      body: request.body,
      redirect: "follow",
    });
    // 自定义响应，设置 CORS header
    const myResp = new Response(resp.body, resp);
    myResp.headers.set("Access-Control-Allow-Origin", "*");
    myResp.headers.set("Access-Control-Allow-Headers", "*");
    return myResp;
  },
};
