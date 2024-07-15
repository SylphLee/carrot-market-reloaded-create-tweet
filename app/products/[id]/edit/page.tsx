"use client";

import React, { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { useFormState } from "react-dom";
import DeleteButton from "@/app/(tabs)/home/@modal/(...)products/[id]/delete-button";
import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { getProduct, updateProduct, getCachedProduct, getDeletdChk, getProductDetail, getCachedProductDetail } from "./actions";
import { getUploadUrl } from "@/app/products/add/actions";

export default function EditPage({ params }: { params: { id: string } }) {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [photoId, setPhotoId] = useState("");
  let productTitle = "";
  let productPrice = new String;
  let productPhoto = new String;
  let productDescription = new String;
  
  useEffect(() => {
    async function getPhotoByProduct(id: number) {
      try {
        const result = await getCachedProduct(id);
        
        // productTitle = result?.title;
        // productPrice = new String(result?.price);
        // productPhoto = new String(result?.photo);
        // productDescription = new String(result?.description);
        // console.log(result);
        // console.log(typeof(result?.title));
        // console.log(typeof(productTitle));
        if (result?.photo) {
          setPreview(`${result.photo}/public`);
        } else {
          setPreview("");
        }
        return result;
      } catch (error) {
        console.log("Failed to fetch data:", error);
      }
    }
    
    getPhotoByProduct(Number(params.id));
  }, [params.id]);

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {    
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }    
    const file = files[0];

    const url = URL.createObjectURL(file);
    setPreview(url);

    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setPhotoId(id);
    }
  };

  const interceptAction = async (_: any, formData: FormData) => {
    console.log();
    const file = formData.get("photo");
    if (!file) {
      return;
    }
    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);
    const response = await fetch(uploadUrl, {
      method: "post",
      body: cloudflareForm,
    });
    if (response.status !== 200) {
      return;
    }

    const photoUrl = `https://imagedelivery.net/ROFSGhmTRMR8XH4QsPeB9A/${photoId}`;

    formData.set("photo", photoUrl);
    formData.append("productId", params.id);

    return updateProduct(_, formData);
  };

  const [state, action] = useFormState(interceptAction, null);
  
  return (
    <div>
      <form action={action} className="p-5 flex flex-col gap-3">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex flex-col items-center justify-center gap-3 text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="size-20" />
              <div className="text-sm text-neutral-400">
                사진을 추가해 주세요.
              </div>
            </>
          ) : null}
        </label>
        {
          <span className="text-red-500 font-medium">
            {state?.fieldErrors.photo}
          </span>
        }
        <input
          type="file"
          id="photo"
          name="photo"
          className="hidden"
          accept="image/*"
          onChange={onImageChange}
        />
        <Input
          name="title"          
          required
          placeholder="제목"
          type="text"          
          value={`${productTitle}`}
          errors={state?.fieldErrors.title}          
        />
        <Input
          name="price"
          required
          placeholder="가격"
          type="number"
          errors={state?.fieldErrors.price}
        />
        <Input
          name="description"
          required
          placeholder="자세한 설명"
          type="text"
          errors={state?.fieldErrors.description}
        />
        <Button text="수정하기" />
        {/* <DeleteButton id={id} isOwner={isOwner} /> */}
      </form>
    </div>
  );
};

