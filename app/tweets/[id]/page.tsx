import db from "@/lib/db";
import {getSession} from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";
import TweetLikeButton from "@/components/tweet-like-button";
import TweetCommentList from "@/components/tweet-comment-list";

const getTweet = async (id: number) => {
  try {
    const tweet = await db.tweet.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            tweetcomment: true,
          },
        },
      },
    });
    return tweet;
  } catch (e) {
    return null;
  }
};
const getCachedtweet = nextCache(getTweet, ["tweet-detail"], { revalidate: 60 });
const getLikeStatus = async (tweetId: number, userId: number) => {
  const isLiked = Boolean(
    await db.tweetLike.findUnique({
      where: {
        id: {
          tweetId: tweetId,
          userId: userId,
        },
      },
    })
  );
  const likeCount = await db.tweetLike.count({
    where: {
      tweetId,
    },
  });
  return { likeCount, isLiked };
};

const getCachedLikeStatus = (tweetId: number, userId: number) => {
  const cachedOperation = nextCache(
    getLikeStatus,
    [`tweet-like-status-${tweetId}`],
    {
      tags: [`like-status-${tweetId}`],
    }
  );
  return cachedOperation(tweetId, userId);
};

const getUser = async (userId: number) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      avatar: true,
    },
  });
  return user;
};

const getCachedUser = (userId: number) => {
  const cachedOperation = nextCache(getUser, [`user-info-${userId}`], {
    tags: [`user-info-${userId}`],
  });
  return cachedOperation(userId);
};

const getComments = async (tweetId: number) => {
  const comments = await db.tweetComment.findMany({
    where: {
      tweetId,
    },
    select: {
      payload: true,
      created_at: true,
      id: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return comments;
};

const getCachedComments = (tweetId: number) => {
  const cachedOperation = nextCache(getComments, [`tweet-comment-${tweetId}`], {
    tags: [`comments-${tweetId}`],
  });
  return cachedOperation(tweetId);
};

const tweetDetail = async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();
  const tweet = await getCachedtweet(id);
  const session = await getSession();
  if (!tweet) {
    return notFound();
  }
  const comments = await getCachedComments(id);
  const user = await getCachedUser(session.id!);
  const { likeCount, isLiked } = await getCachedLikeStatus(id, session.id!);
  return (
    <div className="p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        <div>
          <span className="text-sm font-semibold">{tweet.user.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(tweet.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{tweet.tweet}</h2>
      <p className="mb-5">{tweet.description}</p>      
      <div className="flex flex-col gap-5 items-start mb-10">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {tweet.views}</span>
        </div>
        <TweetLikeButton isLiked={isLiked} likeCount={likeCount} tweetId={id} />
      </div>
      <TweetCommentList tweetId={id} commentsData={comments} user={user!} />
    </div>
  );
};

export default tweetDetail;