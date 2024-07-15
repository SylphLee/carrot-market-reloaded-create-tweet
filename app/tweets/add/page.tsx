"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TweetType, tweetSchema } from "./schema";
import { addTweet } from "./actions";

export default function AddTweets() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TweetType>({
    resolver: zodResolver(tweetSchema),
  });

  const onSubmit = handleSubmit(async (data: TweetType) => {    
    const formData = new FormData();
    formData.append("tweet", data.tweet);
    const errors = await addTweet(formData);
    if (errors) {
      
    }
  });
  const onValid = async () => {
    await onSubmit();
  };

  return (
    <div>
      <form action={onValid} className="p-5 flex flex-col gap-5">
        <Input
          required
          placeholder="tweer"
          type="text"
          {...register("tweet")}
          errors={[errors.tweet?.message ?? ""]}
        />
        <Button text="추가 완료!" />
      </form>
    </div>
  );
}