import { isMessageReceive, isVerification, sendRes } from './utils'
import { sendTextMessage } from './api/message/sendMessage'
import { tweeAddRecord } from './needs/twee'

import getTenantAccessToken from './api/auth'

export async function handleRequest(
  request: Request,
  e: FetchEvent,
): Promise<Response> {
  // 只接收 POST 请求
  if (request.method.toUpperCase() !== 'POST') {
    // @ts-ignore
    if (!APP_ID || !APP_SECRET || !APP_VERIFICATION_TOKEN) {
      return new Response(
        '请先设置 APP_ID、APP_SECRET、APP_VERIFICATION_TOKEN 环境变量',
        {
          status: 200,
          headers: { 'content-type': 'text/plain' },
        },
      )
    }

    return sendRes()
  }

  const body = await request.json()

  if (isVerification(body)) {
    console.warn('Verification challenge')
    // 校验 verification token 是否匹配，token 不匹配说明该回调并非来自开发平台
    // @ts-ignore
    if (body.token !== APP_VERIFICATION_TOKEN) {
      console.warn(`verification token not match, token = %s`, body.token)
      return sendRes()
    }
    return sendRes({ challenge: body.challenge })
  }

  console.warn('Req Coming', JSON.stringify(body, null, '  '))

  // 避免响应超过飞书 1s 限制
  e.waitUntil(msgHandler(body))

  return sendRes()
}

async function msgHandler(body: any) {
  if (isMessageReceive(body)) {
    // 此处只处理 text 类型消息，其他类型消息忽略
    if (body.event.message.message_type !== 'text') {
      return sendRes()
    }

    // 在群聊中，只有被@了才回复
    if (
      body.event.message.chat_type === 'group' &&
      !body.event.message.mentions?.length
    ) {
      return sendRes()
    }

    const accessToken = await getTenantAccessToken()
    if (!accessToken) {
      console.warn(`Invalid verification token`, accessToken)
      return sendRes()
    }

    const mentions = body.event.message.mentions
    let { text } = JSON.parse(body.event.message.content)
    let departmentUserId = body.event.sender.sender_id.open_id as any

    if (mentions != null) {
      text = text.replace(/@_user_\d/g, (key: string) => {
        const user = mentions.find((x) => x.key === key)
        if (user === undefined) {
          return key
        }
        departmentUserId = user.id.open_id
        return `<at user_id="${user.id.open_id}">${user.name}</at>`
      })
    }

    await sendTextMessage(accessToken, {
      receiver: body.event.message.chat_id,
      text: await tweeAddRecord(accessToken, {
        text: text as string,
        departmentUserId,
      }),
    })
    return sendRes()
  }

  return sendRes()
}
