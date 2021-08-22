export default async function getTenantAccessToken() {
  // @ts-ignore
  let tenant_access_token = await LARK.get('tenant_access_token')
  if (!tenant_access_token) {
    const response = await fetch(
      'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal/',
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          // @ts-ignore
          app_id: APP_ID,
          // @ts-ignore
          app_secret: APP_SECRET,
        }),
      },
    )

    const body = await response.json()

    if (body.code !== 0) {
      console.log('get tenant_access_token error, code = %d', body.code)
      return
    }

    console.warn(
      `Set tenant_access_token, expires after ${body.expire / 60} mins`,
    )
    tenant_access_token = body.tenant_access_token
    // @ts-ignore
    await LARK.put('tenant_access_token', tenant_access_token, {
      expirationTtl: body.expire,
    })
    return tenant_access_token
  }

  return tenant_access_token
}
