"use client";
import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Container from "@/app/components/core/Container";

const Page = () => {
  const md = `
  # Privacy Policy

This Privacy Policy describes how we collect, use, and handle your information when you use our services that interact with Spotify.

## 1. Information We Collect

We collect various types of information when you use our services in conjunction with Spotify. This may include:

- **Account Information:** When you connect your account with Spotify, we may collect your username, email address, profile information, and other details you choose to share.
- **Usage Data:** Information about how you use our services in connection with Spotify, including songs listened to, playlists created, preferences, and interactions with the platform.

- **Device Information:** We may collect device-specific information such as device type, operating system, unique device identifiers, and network information when you access our services via Spotify.

## 2. How We Use Your Information

We use the information collected in conjunction with Spotify to:

- Provide and personalize our services according to your preferences.
- Improve our services, including analyzing usage patterns and trends.
- Communicate with you regarding updates, new features, or changes to our services.
- Ensure the security and integrity of our services and users.

## 3. Sharing of Information

We may share information collected through our services and Spotify in the following circumstances:

- **Third-party Service Providers:** We may engage third-party service providers to assist in providing our services. These providers may have access to your information to perform services on our behalf.
- **Legal Compliance:** We may disclose information if required by law, regulation, or legal process.

## 4. Your Choices and Controls

You may have certain controls and choices regarding the information collected in connection with Spotify. This may include accessing, updating, or deleting certain information. Refer to Spotify’s settings and privacy controls for more information on managing your data.

## 5. Security

We take reasonable measures to protect the information collected in connection with Spotify to prevent unauthorized access, use, or disclosure.

## 6. Updates to this Policy

We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of any significant changes via email or through our services.

## 7. Contact Us

If you have any questions or concerns about this Privacy Policy or our practices concerning information collected in connection with Spotify, please contact us at [songsymmetry@gmail.com].
`;

  return (
    <Container>
      <ReactMarkdown className="markdown-body">{md}</ReactMarkdown>
      <style jsx global>{`
        .markdown-container {
          margin: 0 auto;
          padding: 20px;
        }
        .markdown-body {
          line-height: 1.2;
          font-size: 16px;
        }
        /* Example additional styles */
        .markdown-body > h1 {
          font-weight: 700;
          font-size: 28px;
          margin-bottom: 10px;
        }
        p {
          padding: 8px 0;
        }
        .markdown-body > h2 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
          margin-top: 8px;
        }
        ul {
          padding: 16px;
        }
        ul li {
          padding: 4px;
        }
        ul li p {
          padding: 0;
        }
        /* Add more styles as needed */
      `}</style>
    </Container>
  );
};

export default Page;
