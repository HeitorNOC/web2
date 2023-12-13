import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@email.com' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        } else {
          const { email, password } = credentials
          const response = await fetch('https://task-api-production-ebcc.up.railway.app/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })
          const json = await response.json()
          if(response.status == 200) {
            return json
          } else {
            return null
          }
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    async signIn({ user, account, profile }) {
      return true
    },

    async session({ session, token, user }) {
      session.user.id = Number(token.sub)
      return session;
    },
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };