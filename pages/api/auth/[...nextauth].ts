import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "../../../lib/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log("=== AUTH START ===");
          
          if (!credentials?.email || !credentials?.password) {
            console.error("Missing credentials");
            return null;
          }

          console.log("Connecting to DB...");
          await connectDB();
          console.log("DB connected");

          console.log("Finding user...");
          const user = await User.findOne({ email: credentials.email });
          
          if (!user) {
            console.error("User not found");
            return null;
          }

          console.log("Verifying password...");
          const isValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValid) {
            console.error("Invalid password");
            return null;
          }

          console.log("Auth successful");
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("=== AUTH ERROR ===");
          console.error(error);
          return null;
        }
      }
    })
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug mode
};

export default NextAuth(authOptions);