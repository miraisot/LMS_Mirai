import Link from "next/link";
import { site } from "@/lib/config";

export function BrandMark() {
  return (
    <Link href="/" className="relative flex h-6 w-[174px] shrink-0 items-center">
      {site.logoUrl ? (
        // Logo URL comes from env and may be any host.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={site.logoUrl}
          alt={site.name}
          className="h-6 w-[174px] object-contain object-left"
        />
      ) : (
        <span className="font-display text-lg text-white">{site.name}</span>
      )}
    </Link>
  );
}
