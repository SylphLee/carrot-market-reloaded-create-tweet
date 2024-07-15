"use client";

import {
  ArrowLongLeftIcon as Solidarrowlongleft,
  ArrowLongRightIcon as Solidarrowlongright,
} from "@heroicons/react/24/solid";
import {
  ArrowLongLeftIcon as Outlinearrowlongleft,
  ArrowLongRightIcon as Outlinearrowlongright,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AddTweet from "./top-add-tweet";

export default function TopBar() {
  const pathname = usePathname();
  return (
    <div className="fixed top-0 w-full mx-auto max-w-screen-md grid grid-cols-3
     border-neutral-600 border-t px-5 py-3 *:text-white justify-between">
      <Link href="/products" className="flex flex-col items-start gap-px">
        {pathname === "/products" ? (
          <Solidarrowlongleft className="w-7 h-7" />
        ) : (
          <Outlinearrowlongleft className="w-7 h-7" />
        )}
        <span>이전 페이지</span>
      </Link>
      <AddTweet />  
      <Link href="/profile" className="flex flex-col items-end gap-px">
        {pathname === "/profile" ? (
          <Solidarrowlongright className="w-7 h-7" />
        ) : (
          <Outlinearrowlongright className="w-7 h-7" />
        )}
        <span>다음 페이지</span>
      </Link>
    </div>
  );
}