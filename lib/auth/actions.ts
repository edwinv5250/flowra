"use server"

import { encodedRedirect } from "@/lib/auth/redirect"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key)

  if (typeof value !== "string" || !value.trim()) {
    return null
  }

  return value.trim()
}

export async function login(formData: FormData) {
  const email = getRequiredString(formData, "email")
  const password = getRequiredString(formData, "password")

  if (!email || !password) {
    return encodedRedirect("error", "/login", "Email and password are required.")
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return encodedRedirect("error", "/login", error.message)
  }

  redirect("/")
}

export async function signup(formData: FormData) {
  const email = getRequiredString(formData, "email")
  const password = getRequiredString(formData, "password")

  if (!email || !password) {
    return encodedRedirect("error", "/signup", "Email and password are required.")
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return encodedRedirect("error", "/signup", error.message)
  }

  return encodedRedirect(
    "success",
    "/login",
    "Account created. Check your email if confirmation is enabled, then log in.",
  )
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
