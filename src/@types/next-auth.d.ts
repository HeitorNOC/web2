import NextAuth from "next-auth/next"

declare module 'next-auth' {
  interface User {
    id: string
    name: string
    avatar_url: string
    email: string 
  }
    interface Session {
      user: {
        id: number
        email: string
        name: string
      },
      expires: string
    }
  
}