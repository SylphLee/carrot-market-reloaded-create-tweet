import Image from "next/image";
import Link from "next/link";
import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";

interface ListTweetProps {
  id: number;
  tweet: string;
  views?: number;
  tweetcomment?: number,
  tweetlikes?: number,
}

export default function ListTweet({
  id,
  tweet,
  views,
  tweetcomment,
  tweetlikes,
}: ListTweetProps) {
  return (
    <Link href={`/tweets/${id}`} className="flex gap-5">
      <div className="p-5 text-white">
        <h2 className="text-lg font-semibold">{tweet}</h2>
        <div className="flex flex-col gap-5 items-start mb-10">
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <EyeIcon className="size-5" />
            <span>조회  :  {views}</span>
            <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
              <span>
                <HandThumbUpIcon className="size-4" />
                {tweetlikes}
              </span>
              <span>
                <ChatBubbleBottomCenterIcon className="size-4" />
                {tweetcomment}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link >
  );
}