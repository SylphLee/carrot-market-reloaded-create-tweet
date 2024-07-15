"use server";

import { productSchema } from "@/app/products/add/schema";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import { notFound, redirect } from "next/navigation";


export async function updateProduct(_: any, formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };
  const id = Number(formData.get("productId"));
  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const update = await db.product.update({
      where: {
        id,
      },
      data: {
        title: result.data.title,
        description: result.data.description,
        price: result.data.price,
        photo: result.data.photo,
      },
    });
    if (update) {
      revalidateTag("home-products");
      revalidateTag("product-detail");
      redirect(`/products/${id}`);
    }
  }
}

export async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

export const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});



export async function getProductTitle(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });
  return product;
}

export const getCachedProductDetail = nextCache(getProductDetail, ["product-detail"], {
  tags: ["product-detail"],
});

export async function getProductDetail(id: number) {
  const ProductDetail = await db.product.findMany({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      price: true,
      description: true,
    },
  });
  return ProductDetail;
};

export async function getDeletdChk(id: number) {  
  if (isNaN(id)) return notFound();
  const product = await getCachedProduct(id);
  if (!product) return notFound();
  const session = await getSession();
  const isOwner = session.id === product.userId;
  return isOwner;
}

