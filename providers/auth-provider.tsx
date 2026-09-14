"use client";

import { Amplify } from "aws-amplify";
import "aws-amplify/auth/enable-oauth-listener";

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "",
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN || "",
          scopes: ["openid", "email", "profile"],
          redirectSignIn: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN || "http://localhost:3000/"],
          redirectSignOut: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT || "http://localhost:3000/"],
          responseType: "code" as const,
        },
      },
    },
  },
};

Amplify.configure(amplifyConfig, { ssr: true });

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
