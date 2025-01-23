// types/next-auth.d.ts
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    username?: string
    name?: string
  }

  interface UserDefault{
	name?: string | null
	username?: string | null
	image?: string | null
  }

  interface User {
    username?: string
    name?: string
  }

  interface JWT {
    username?: string
    name?: string
  }
}