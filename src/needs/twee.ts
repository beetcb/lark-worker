import { DateTime } from 'luxon'
import { addOneRecord } from '../api/bitable/addRecords'
import { RecordField, AttachedFileRecordField } from '../types/lark'

const groupManagers = {
  ou_4e46926d8b36b9afe38e204dbd5a75ed: '心理健康中心',
  ou_81dd05e9e2bc49685ecc47a589e6acac: '学生教育管理',
  ou_82fb65098f088809578c87e61c534e84: '辅导员发展中心',
  ou_69ba414c50f33ef36aba43ad346c4552: '国防及安全教育',
  ou_b0e82c49c4a427298c7bbd344dea6276: '信息化办公室',
  ou_be17e04234d8db37bc78c8c3ca5b36dc: '学生资助中心',
  ou_63e958f57002d4f6ba19878657039df8: '开发测试部门',
}

// 本文件根据个人需求封装了一些自定义API调用方法
export async function tweeAddRecord(
  token: string,
  opts: { text: string; departmentUserId: keyof typeof groupManagers },
) {
  const [_, description, weekday] = opts.text.match(/(\S+)\s+(\d{1})/) ?? []

  if (description && weekday) {
    const fields: TweeFilds = {
      推文任务描述: description,
      预计截止日期: getDeadlineTimestamp(Number(weekday)),
      落实组别: groupManagers[opts.departmentUserId] as any,
    }

    console.warn(fields)
    const result = await addOneRecord(
      token,
      {
        appToken: 'bascneuHWdvFNzzYKnyApjjKRVd',
        tableId: 'tblqlnF2k9fHGb9B',
      },
      {
        fields,
      },
    )

    if (result === 'Error') {
      return '添加任务失败'
    } else {
      return `推文任务[${description}]添加成功`
    }
  }

  return `请指定${description ? '' : '推文任务描述'}${
    weekday ? '' : '、预计截止日期'
  }`
}

/**
 * 根据星期数设置推文截止时间,支持识别下周(当指定星期数小于当前时间星期数时)
 */
function getDeadlineTimestamp(w: number) {
  const dt = DateTime.now()
  const cWeekday = dt.weekday
  if (w < cWeekday) {
    return dt
      .plus({ days: 7 - cWeekday + w })
      .set({ hour: 23 })
      .toMillis()
  }
  return dt.set({ weekday: w, hour: 23 }).toMillis()
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
