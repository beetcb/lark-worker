import { postWithAuthOptions } from "../helper";
import { errorHandler } from "../helper";
export async function sendTextMessage(
  token: string,
  body: {
    receiver: string;
    text: string;
  },
) {
  const response = await postWithAuthOptions(
    "/im/v1/messages?receive_id_type=chat_id",
    token,
    {
      receive_id: body.receiver,
      msg_type: "text",
      content: JSON.stringify({ text: body.text }),
    },
  );

  return await errorHandler(response);
}
