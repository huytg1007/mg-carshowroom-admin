"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { BannerType, CreateBannerRequest } from "@/interfaces/bannerInterface";
import bannerService from "@/services/bannerService";
import { Input } from "../ui/input";
import Image from "next/image";
import { Button } from "../ui/button";
import { useAtom } from "jotai";
import { carMinimalAtom } from "@/jotai/carAtom";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";

export default function BannerModal({
  banner,
  open,
  onClose,
  isNew = false,
  onBannerUpdated,
}: {
  banner: BannerType | null;
  open: boolean;
  onClose: () => void;
  isNew?: boolean;
  onBannerUpdated: () => void;
}) {
  const form = useForm<CreateBannerRequest>({
    defaultValues: isNew
      ? { name: "", carId: undefined }
      : banner
      ? { name: banner.name, carId: banner.carId }
      : { name: "", carId: undefined },
  });

  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(
    banner?.imageUrl || null
  );
  const bannerImageFileRef = useRef<HTMLInputElement | null>(null);
  const [cars] = useAtom(carMinimalAtom);

  useEffect(() => {
    if (banner) {
      form.reset({ name: banner.name, carId: banner.carId });
      setBannerImagePreview(banner.imageUrl || null);
    } else if (isNew) {
      form.reset({ name: "", carId: undefined });
      setBannerImagePreview(null);
    }
  }, [banner, isNew, form]);

  const onSubmit = async (values: CreateBannerRequest) => {
    try {
      const bannerImageFile = bannerImageFileRef.current?.files?.[0];
      let response;
      if (isNew) {
        response = await bannerService.createBanner(
          {
            name: values.name,
            carId: values.carId,
            bannerImage: bannerImageFile
              ? { file: bannerImageFile, sortOrder: 0 }
              : undefined,
          },
          bannerImageFile
        );
      } else {
        if (!banner?.id) return;
        response = await bannerService.updateBanner(
          banner.id,
          {
            name: values.name,
            carId: values.carId,
            bannerImage: bannerImageFile
              ? { file: bannerImageFile, sortOrder: 0 }
              : undefined,
          },
          bannerImageFile
        );
      }
      if (response.success) {
        onClose();
        onBannerUpdated();
      } else {
        alert(
          response.message ||
            (isNew ? "Thêm mới thất bại" : "Cập nhật thất bại")
        );
      }
    } catch (error) {
      alert("Có lỗi xảy ra! " + error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isNew ? "Thêm Banner" : "Sửa Banner"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên banner</FormLabel>
                  <FormControl>
                    <Input placeholder="Tên banner" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="carId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chọn xe</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(val) =>
                      field.onChange(val ? Number(val) : undefined)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="-- Chọn xe liên kết --" />
                    </SelectTrigger>
                    <SelectContent>
                      {cars?.map((car) => (
                        <SelectItem key={car.id} value={String(car.id)}>
                          {car.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nếu muốn chọn carId thì thêm field ở đây */}
            <div>
              <FormLabel>Ảnh banner</FormLabel>
              <label
                htmlFor="banner-image-upload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer p-6 hover:border-brand-500 transition-colors bg-gray-50"
              >
                <svg
                  className="w-10 h-10 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 16v-8m-4 4h8" />
                </svg>
                <span className="text-gray-500 text-sm mb-1">
                  Kéo & thả hoặc bấm để chọn ảnh banner
                </span>
                <span className="text-xs text-gray-400">
                  (Chỉ nhận file ảnh, kích thước tối đa 5MB)
                </span>
                <input
                  id="banner-image-upload"
                  type="file"
                  accept="image/*"
                  ref={bannerImageFileRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setBannerImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden"
                />
              </label>
              {bannerImagePreview && (
                <div className="mt-2 flex justify-center">
                  <Image
                    src={bannerImagePreview}
                    alt="Banner Preview"
                    width={300}
                    height={100}
                    className="rounded border"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="submit" className="bg-amber-500 ">
                {isNew ? "Thêm mới" : "Cập nhật"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Đóng
                </Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
