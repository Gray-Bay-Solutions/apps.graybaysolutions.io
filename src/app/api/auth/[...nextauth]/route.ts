import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is where you would typically validate against your database
        // For demo purposes, we'll use a simple check
        if (credentials?.email === "demo@graybay.com" && credentials?.password === "demo123") {
          return {
            id: "1",
            name: "Gray Crozier",
            email: "demo@graybay.com",
            image: "https://avatars.githubusercontent.com/u/77633076?v=4"
          }
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        // @ts-ignore
        session.user.id = token.sub as string;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST } 