import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { findByUsername } from "@/repository/user";
import bcrypt from "bcrypt";
import { z } from "zod";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      authorize: async (credentials): Promise<any> => {
        try {
          const users = await findByUsername(credentials?.username || "");

          if (!users) {
            return null
          }

          if (
            !(await bcrypt.compare(credentials?.password || "", users.password))
          ) {
            return null
          }

          const response = users as { username: string; name: string };
          return { ...response };
        } catch (error: any) {
          if (error instanceof z.ZodError) {
            throw new Error(JSON.stringify(error.errors))
          } else {
            throw new Error(JSON.stringify(error?.response?.data))
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    maxAge: 60 * 60,
    strategy:'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user }
    },

    async session({ session, token } : any) {
      session = { ...session, ...token }

      return session
    }
  }
};
