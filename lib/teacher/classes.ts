import 'server-only'
import { randomBytes } from 'crypto'
import { getServiceSupabase } from '@/utils/supabase/server'

// Teacher Radar — Phase 1 class + enrollment helpers (server-only). All access goes
// through the service_role client; the browser never touches these tables. Callers
// (API routes) enforce role via requireRole() before invoking these.

// Unambiguous alphabet (no 0/O/1/I) so codes are easy to read aloud in class.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function genJoinCode(len = 6): string {
  const b = randomBytes(len)
  let s = ''
  for (let i = 0; i < len; i++) s += CODE_ALPHABET[b[i] % CODE_ALPHABET.length]
  return s
}

export interface ClassRow {
  id: string
  name: string
  subject: string | null
  join_code: string
  archived?: boolean
  created_at?: string
}

/** Create a class owned by `teacherId`, retrying if the random join_code collides. */
export async function createClass(
  teacherId: string,
  name: string,
  subject: string | null,
): Promise<ClassRow> {
  const supabase = getServiceSupabase()
  for (let attempt = 0; attempt < 5; attempt++) {
    const join_code = genJoinCode()
    const { data, error } = await supabase
      .from('classes')
      .insert({ teacher_id: teacherId, name, subject, join_code })
      .select('id, name, subject, join_code, created_at')
      .maybeSingle()
    if (!error && data) return data as ClassRow
    if (error && error.code !== '23505') throw error // 23505 = join_code collision → retry
  }
  throw new Error('could not allocate a unique join code')
}

export async function listTeacherClasses(teacherId: string): Promise<ClassRow[]> {
  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('classes')
    .select('id, name, subject, join_code, archived, created_at')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as ClassRow[]
}

/** Enroll a student into the class with `code` (consent starts 'pending'). */
export async function joinByCode(
  studentId: string,
  code: string,
): Promise<{ classId: string; className: string; subject: string | null } | null> {
  const supabase = getServiceSupabase()
  const { data: cls, error } = await supabase
    .from('classes')
    .select('id, name, subject')
    .eq('join_code', code)
    .eq('archived', false)
    .maybeSingle()
  if (error) throw error
  if (!cls) return null

  // Idempotent: re-joining does NOT reset an existing consent decision.
  const { error: enErr } = await supabase
    .from('enrollments')
    .upsert(
      { class_id: cls.id, student_id: studentId },
      { onConflict: 'class_id,student_id', ignoreDuplicates: true },
    )
  if (enErr) throw enErr
  return { classId: cls.id, className: cls.name, subject: cls.subject }
}

/** Set the CALLER's own consent for a class. Returns false if they aren't enrolled. */
export async function setConsent(
  studentId: string,
  classId: string,
  consent: 'granted' | 'declined',
): Promise<boolean> {
  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('enrollments')
    .update({ consent_status: consent })
    .eq('student_id', studentId) // ownership: a student can only set their OWN consent
    .eq('class_id', classId)
    .select('id')
    .maybeSingle()
  if (error) throw error
  return Boolean(data)
}
