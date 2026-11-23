import { notePdfResponse } from '@/lib/notes/pdfRequest'
export const runtime='nodejs'
export const maxDuration=60
export async function GET(request:Request,{params}:{params:Promise<{subject:string}>}) {
  const {subject}=await params
  return notePdfResponse(subject,new URL(request.url).searchParams.get('topic'))
}
