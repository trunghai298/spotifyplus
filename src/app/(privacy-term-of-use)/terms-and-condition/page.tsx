"use client";
import Container from "@/app/components/core/Container";
import React from "react";
import ReactMarkdown from "react-markdown";

const Page = () => {
  const terms = `
  # Terms and Conditions

Welcome to SongSymmetry. These Terms and Conditions ("Terms") govern your use of our website.

By accessing and using SongSymmetry, you agree to these Terms. If you do not agree with any part of these terms, please refrain from using our website.

## 1. Acceptance of Terms

You agree to comply with these Terms when using SongSymmetry. These Terms constitute a legally binding agreement between you and SongSymmetry.

## 2. User Responsibilities

When using SongSymmetry, you agree to:
- Provide accurate and updated information when required.
- Not engage in any activity that may disrupt or interfere with the website's functionality.
- Respect the rights of other users and the website itself.

## 3. Use of Content

The content on SongSymmetry is provided for informational purposes only. You agree not to reproduce, distribute, modify, or republish any material without proper authorization.

## 4. Disclaimer of Liability

SongSymmetry does not guarantee the accuracy, completeness, or reliability of the information on SongSymmetry. Your use of the website is at your own risk.

## 5. Intellectual Property Rights

All content and materials on SongSymmetry are the property of SongSymmetry and are protected by copyright and other intellectual property laws.

## 6. Governing Law

These Terms shall be governed by and construed in accordance with the laws of SongSymmetry, without regard to its conflict of law provisions.

## 7. Changes to These Terms

We reserve the right to modify or replace these Terms at any time. Your continued use of SongSymmetry after any changes constitute your acceptance of the new Terms.

## 8. Contact Us

If you have any questions about these Terms, please contact us at [songsymmetry@gmail.com].
`;
  return (
    <Container>
      <ReactMarkdown className="markdown-body">{terms}</ReactMarkdown>
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
