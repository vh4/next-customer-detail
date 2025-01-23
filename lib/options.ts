import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Username',
          type: 'text'
        },
        password: { label: 'Password', type: 'password' },
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      authorize: async (credentials) : Promise<any> => {
        try {
          const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
            username: credentials?.username,
            password: credentials?.password,
          })

		  const response = data as {username:string, name:string};
          return { ...response}

        } catch (error: any) {
          throw new Error(JSON.stringify(error?.response?.data))
        }
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  session: {
    maxAge: 60 * 60
  },
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (trigger === 'update') return { ...token, ...session }

      if (user) return { ...token, ...user }
    },
    async session({ session }) {
      session = { ...session }
      return session
    }
  }
}
