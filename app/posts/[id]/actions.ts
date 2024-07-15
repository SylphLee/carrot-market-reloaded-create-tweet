"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidateTag, unstable_cache as nextCache } from "next/cache";

export async function likePost(postId: number) {
  await new Promise((r) => setTimeout(r, 10000));
  const session = await getSession();
  try {
    await db.postLike.create({
      data: {
        postId,
        userId: session.id!,
      },
    });
    revalidateTag("posts");
  } catch (e) { }
}

export async function dislikePost(postId: number) {
  await new Promise((r) => setTimeout(r, 10000));
  try {
    const session = await getSession();
    await db.postLike.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    });
    revalidateTag("posts");
  } catch (e) { }
}

export const createComment = async (
  postId: number,
  payload: string,
  userId: number
) => {
  await db.postComment.create({
    data: {
      payload,
      userId,
      postId,
    },
  });
  revalidateTag(`comments-${postId}`);
  revalidateTag("posts");
};