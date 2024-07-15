import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/solid";

export default function AddTweet() {
  return (
    <div>      
      <Link
        href="/tweets/add"
        className="flex flex-col items-center text-white transition-colors"
      >
        <PlusIcon className="size-10" />
        Tweet 추가
      </Link>
    </div>
  )
}