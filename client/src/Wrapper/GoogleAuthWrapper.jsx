import { GoogleOAuthProvider } from "@react-oauth/google";

export const GoogleAuthWrapper = ({ children }) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  return (
    <>
      {" "}
      <GoogleOAuthProvider clientId={clientId}>
        {children}
      </GoogleOAuthProvider>
    </>
  );
};
