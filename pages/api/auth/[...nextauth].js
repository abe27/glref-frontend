import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import https from "https";

// console.log(process.env.JWT_SECRET)
// console.log(process.env.API_HOST)

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "vcst-project",
      credentials: {},
      async authorize(credentials, req) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        // console.dir(credentials);
        var raw = JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        });

        // const urlencoded = new URLSearchParams();
        // urlencoded.append("username", credentials.username);
        // urlencoded.append("password", credentials.password);

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        const res = await fetch(
          `${process.env.API_HOST}/login`,
          requestOptions
        );

        if (res.ok) {
          const data = await res.json();
          if (data) {
            return data;
          }
        } else {
          console.dir(res);
        }
        return null;
      },
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: "24h",
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          userId: user.data.data.fcskid,
          userName: user.data.data.fcslogin,
          accessToken: `${user.data.jwt_type} ${user.data.jwt_token}`,
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.user.userId = token.userId;
      session.user.userName = token.userName;
      session.user.accessToken = token.accessToken;
      return session;
    },
  },
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
