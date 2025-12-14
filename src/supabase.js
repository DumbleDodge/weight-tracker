import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://anvrbqvdswjexseirxhb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFudnJicXZkc3dqZXhzZWlyeGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NDIwMDYsImV4cCI6MjA4MTExODAwNn0.6OStsGMiRnhP4f0xj_Gj54KaUh2HbDEBmLAO2kGXG04'

export const supabase = createClient(supabaseUrl, supabaseKey)