"use server";

import db from "@/lib/db";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { tweetSchema } from "./schema";

export async function addTweet(formData: FormData) {
  const data = {
    tweet: formData.get("tweet"),
  };
  const result = tweetSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const tweet = await db.tweet.create({
        data: {
          tweet: result.data.tweet,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      redirect(`/tweets/${tweet.id}`);
      //redirect("/products")
    }
  }
}