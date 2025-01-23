import { isOptions } from '@/lib/options'
import NextAuth from 'next-auth'


const handler = NextAuth(isOptions)

export { handler as GET, handler as POST }