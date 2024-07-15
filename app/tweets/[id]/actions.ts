"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidateTag, unstable_cache as nextCache } from "next/cache";

export async function liketweet(tweetId: number) {
  await new Promise((r) => setTimeout(r, 10000));
  const session = await getSession();
  try {
    await db.tweetLike.create({
      data: {
        tweetId,
        userId: session.id!,
      },
    });
    revalidateTag("tweets");
  } catch (e) { }
}

export async function disliketweet(tweetId: number) {
  await new Promise((r) => setTimeout(r, 10000));
  try {
    const session = await getSession();
    await db.tweetLike.delete({
      where: {
        id: {
          tweetId,
          userId: session.id!,
        },
      },
    });
    revalidateTag("tweets");
  } catch (e) { }
}

export const createComment = async (
  tweetId: number,
  payload: string,
  userId: number
) => {
  await db.tweetComment.create({
    data: {
      payload,
      userId,
      tweetId,
    },
  });
  revalidateTag(`comments-${tweetId}`);
  revalidateTag("tweets");
};