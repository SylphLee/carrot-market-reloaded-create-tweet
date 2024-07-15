import TweetsList from "@/components/tweets-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

async function getTweetsList() {
  const tweets = await db.tweet.findMany({
    select: {
      id: true,
      tweet: true,   
      views: true,
      description: true,
    },    
    orderBy: {
      created_at: "desc",
    }
  });
  return tweets;
}

export type InitialTweets = Prisma.PromiseReturnType<typeof getTweetsList>;

export default async function tweets() {
  const InitialTweets = await getTweetsList();
  return (
    <div>
      <TweetsList InitialTweets={InitialTweets} />
      <a
        href="/tweets/add"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed 
        bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </a>
    </div>
  );
}