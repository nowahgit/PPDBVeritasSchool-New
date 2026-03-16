"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WelcomeRedirect({ hasBerkas }: { hasBerkas: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!hasBerkas && pathname !== "/welcome") {
      router.push("/welcome");
    } else if (hasBerkas && pathname === "/welcome") {
      router.push("/dashboard");
    }
  }, [hasBerkas, pathname, router]);

  return null;
}
