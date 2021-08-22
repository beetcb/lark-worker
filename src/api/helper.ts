const API_ORIGIN = "https://open.feishu.cn/open-apis";

export async function errorHandler(res: Response) {
  const body = await res.json();
  if (body.code !== 0) {
    console.log("API request error, code = %d, msg = %s", body.code, body.msg);
    return "Error";
  }
  return body.msg;
}

export function getWithAuthOptions(apiEndpointPath: string, token: string) {
  return fetch(`${API_ORIGIN}${apiEndpointPath}`, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: "Bearer " + token,
    },
  });
}

export function postWithAuthOptions(
  apiEndpointPath: string,
  token: string,
  body: any = {}
) {
  return fetch(`${API_ORIGIN}${apiEndpointPath}`, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: "Bearer " + token,
    },
    method: "POST",
    body: JSON.stringify(body),
  });
}
