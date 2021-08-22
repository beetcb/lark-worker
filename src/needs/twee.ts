import { addOneRecord } from '../api/bitable/addRecords'
import { RecordField, AttachedFileRecordField } from '../types/lark'

// 本文件根据个人需求封装了一些自定义API调用方法
export function tweeAddRecord(
  token: string,
  body: {
    recordId?: string
    fields: TweeFilds
  },
) {
  return addOneRecord(
    token,
    {
      appToken: 'bascneuHWdvFNzzYKnyApjjKRVd',
      tableId: 'tblqlnF2k9fHGb9B',
    },
    body,
  )
}

interface TweeFilds extends RecordField {
  推文任务描述: string
  预计截止日期: number
  落实组别:
    | '心理健康中心'
    | '学生教育管理'
    | '辅导员发展中心'
    | '国防及安全教育'
    | '信息化办公室'
    | '学生资助中心'
  附件?: AttachedFileRecordField
}
