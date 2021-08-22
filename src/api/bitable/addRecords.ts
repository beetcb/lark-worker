import { errorHandler, postWithAuthOptions } from "../helper";

export async function addOneRecord(
  token: string,
  where: {
    appToken: string;
    tableId: string;
  },
  body: {
    recordId?: string;
    fields: any;
  }
): Promise<string> {
  const { recordId, fields } = body;
  const res = await postWithAuthOptions(
    `/bitable/v1/apps/${where.appToken}/tables/${where.tableId}/records`,
    token,
    {
      record_id: recordId,
      fields: fields,
    }
  );

  return await errorHandler(res);
}
