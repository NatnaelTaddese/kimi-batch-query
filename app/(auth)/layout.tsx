import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted dark:bg-black flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <span className="text-4xl tracking-normal md:text-6xl">BQ</span>
        </Link>
        {children}
        <div className="text-center text-xs text-balance text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="text-primary underline-offset-4 hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-primary underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
