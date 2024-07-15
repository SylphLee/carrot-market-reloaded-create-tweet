"use server";

import db from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";

export const onDelete = async (id: number, isOwner: boolean) => {
  if (!isOwner) return;  
  const product = await db.product.delete({
    where: {
      id,
    },    
    select: {
      photo: true,
    },
  });
  const photoId = product.photo.split(
    "https://imagedelivery.net/ROFSGhmTRMR8XH4QsPeB9A/"
  )[1];
  await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${photoId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  revalidatePath("/home");
  revalidateTag("product-detail");
};