import Link from "next/link";

function Footer() {
  return (
    <footer className="w-full bg-transparent text-white p-8">
      <div className="container flex flex-col md:flex-row items-center justify-center gap-6">
        <div className="flex space-x-4">
          <Link
            className="text-sm md:text-base hover:underline"
            href="/privacy"
          >
            Privacy Policy
          </Link>
          <div>-</div>
          <Link
            className="text-sm md:text-base hover:underline"
            href="/terms-and-condition"
          >
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
