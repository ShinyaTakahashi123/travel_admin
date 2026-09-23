import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// 管理者サイトはユーザーサイト・プランナーサイトのアカウントとは完全に独立しており、
// 自己登録フォームもGoogleログインも提供しない（3.1節・4.3節参照）。
// メール＋パスワードのCredentialsログインのみを扱う。

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "管理者メールアドレス", type: "email" },
        password: { label: "パスワード", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const admin = await prisma.admin.findUnique({ where: { email } });
        // 招待中(invited)でパスワード未設定、または無効化済み(disabled)のアカウントはログイン不可
        if (!admin || admin.status !== "active" || !admin.passwordHash) return null;

        const valid = await bcrypt.compare(password, admin.passwordHash);
        if (!valid) return null;

        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.adminId = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.adminId as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
