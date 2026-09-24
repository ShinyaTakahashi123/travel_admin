import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getClientIp, ipRateLimitKey, emailRateLimitKey, isRateLimited, recordRateLimitEvent } from "@/lib/rate-limit";

// 管理者サイトはユーザーサイト・プランナーサイトのアカウントとは完全に独立しており、
// 自己登録フォームもGoogleログインも提供しない（3.1節・4.3節参照）。
// メール＋パスワードのCredentialsログインのみを扱う。

class RateLimitedError extends CredentialsSignin {
  code = "rate_limited";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // 管理者権限は影響が大きいため、ログインの有効期間を短くしておく
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "管理者メールアドレス", type: "email" },
        password: { label: "パスワード", type: "password" },
      },
      authorize: async (credentials, request) => {
        const email = (credentials?.email as string | undefined)?.trim().toLowerCase();
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        // 総当たり対策: 同じメール5回/15分・同じIP20回/15分の失敗で一時的にブロックする
        const ip = getClientIp(request.headers);
        const emailKey = emailRateLimitKey("admin-login", email);
        const ipKey = ipRateLimitKey("admin-login", ip);
        if ((await isRateLimited(emailKey, 5, 15)) || (await isRateLimited(ipKey, 20, 15))) {
          throw new RateLimitedError();
        }

        const admin = await prisma.admin.findUnique({ where: { email } });
        // 招待中(invited)でパスワード未設定、または無効化済み(disabled)のアカウントはログイン不可
        if (!admin || admin.status !== "active" || !admin.passwordHash) {
          await Promise.all([recordRateLimitEvent(emailKey), recordRateLimitEvent(ipKey)]);
          return null;
        }

        const valid = await bcrypt.compare(password, admin.passwordHash);
        if (!valid) {
          await Promise.all([recordRateLimitEvent(emailKey), recordRateLimitEvent(ipKey)]);
          return null;
        }

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
      // 利用停止・無効化・権限変更・パスワード変更をログイン中の人にもすぐ効かせるため、
      // 毎回DBを確認する（存在しない・非activeならnullを返してログアウト扱いにする）
      // 初回サインイン時だけemailでアカウントを探し、以降はtoken内のIDで確認する
      // (同じメールアドレスのAdminが作り直された場合に、古いJWTがつながらないようにするため)
      if (user?.email) {
        const admin = await prisma.admin.findUnique({ where: { email: user.email } });
        if (!admin || admin.status !== "active") return null;
        token.adminId = admin.id;
        token.role = admin.role;
        return token;
      }
      if (!token.adminId) return null;
      const admin = await prisma.admin.findUnique({ where: { id: token.adminId as string } });
      if (!admin || admin.status !== "active") return null;
      if (admin.passwordChangedAt && token.iat && admin.passwordChangedAt.getTime() / 1000 > token.iat) {
        return null;
      }
      token.role = admin.role;
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
