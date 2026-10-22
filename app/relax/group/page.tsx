import { completeSeoMetadata } from '@/lib/seo'
import GroupCommunity from '../components/GroupCommunity'

// /relax/group — 👥 戰友集結區（Instagram Group 影子溫書室，由 school.q.1 管理）。

export const metadata = completeSeoMetadata({
  title: '戰友集結區 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '這是學生自發 Instagram 溫書群組的外部入口，並非 DSE Level Up 官方社群、課堂或受監管服務；平台無法審核群組內的對話、帳戶或分享內容，學生加入、發言或交換資料前應自行判斷風險，保護個人資料，並在感到不適或受威脅時向可信任成年人或相關服務求助。本站不會代為建立帳戶、轉交訊息或保存對話。', // i18n-exempt: zh-Hant fixed search metadata
}, '/relax/group')

export default function RelaxGroupPage() {
  return <GroupCommunity />
}
