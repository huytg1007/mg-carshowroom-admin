"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { useForm, Controller } from "react-hook-form";
import { CreateNewsRequest, News } from "@/interfaces/newsInterface";
import Image from "next/image";
import newsService from "@/services/newService";
import { Input } from "../ui/input";
import { MinimalTiptapEditor } from "../ui/minimal-tiptap";
import { ImagePlus } from "lucide-react";
import { Button } from "../ui/button";

export default function NewsModal({
  news,
  open,
  onClose,
  isNew = false,
  onNewsUpdated,
}: {
  news: News | null;
  open: boolean;
  onClose: () => void;
  isNew?: boolean;
  onNewsUpdated: () => void;
}) {
  const form = useForm({
    defaultValues: isNew
      ? { name: "", content: "", isActive: true }
      : news
      ? {
          name: news.name,
          content: news.content,
          isActive: news.isActive,
        }
      : { name: "", content: "", isActive: true },
  });

  const [newsImagePreview, setNewsImagePreview] = useState<string | null>(
    news?.imageUrl || null
  );
  const newsImageFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (news) {
      form.reset({
        name: news.name,
        content: news.content,
        isActive: news.isActive,
      });
      setNewsImagePreview(news.imageUrl || null);
    } else if (isNew) {
      form.reset({ name: "", content: "", isActive: true });
      setNewsImagePreview(null);
    }
  }, [news, isNew, form]);

  const onSubmit = async (values: CreateNewsRequest) => {
    try {
      const newsImageFile = newsImageFileRef.current?.files?.[0];
      let response;
      if (isNew) {
        response = await newsService.createNews(
          {
            name: values.name,
            content: values.content,
            newsImage: newsImageFile
              ? {
                  file: newsImageFile,
                  sortOrder: 0,
                }
              : undefined,
          },
          newsImageFile
        );
      } else {
        if (!news?.id) return;
        response = await newsService.updateNews(
          news.id,
          {
            name: values.name,
            content: values.content,
            newsImage: newsImageFile
              ? {
                  file: newsImageFile,
                  sortOrder: 0,
                }
              : undefined,
          },
          newsImageFile
        );
      }

      if (response.success) {
        onClose();
        onNewsUpdated();
      } else {
        alert(
          response.message ||
            (isNew ? "Thêm mới thất bại" : "Cập nhật thất bại")
        );
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      alert(
        "Đã xảy ra lỗi trong quá trình xử lý: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[95vh] sm:max-w-[1200px] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {isNew ? "Thêm mới tin tức" : "Chỉnh sửa tin tức"}
          </DialogTitle>
          <DialogDescription>
            {isNew
              ? "Nhập thông tin để thêm mới tin tức"
              : "Chỉnh sửa thông tin tin tức"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input placeholder="Tiêu đề tin tức" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung</FormLabel>
                  <FormControl>
                    <div className="h-[400px] overflow-y-auto">
                      <MinimalTiptapEditor
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full h-400 "
                        editorContentClassName="p-5"
                        output="html"
                        placeholder="Enter your description..."
                        autofocus={true}
                        editable={true}
                        editorClassName="focus:outline-hidden"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <FormControl>
                    <select
                      aria-label="Trạng thái"
                      value={String(field.value)}
                      className="w-full h-11 rounded-lg border px-4"
                      onChange={(e) =>
                        field.onChange(e.target.value === "true")
                      }
                    >
                      <option value="true">Hiển thị</option>
                      <option value="false">Ẩn</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Ảnh đại diện</FormLabel>
              <label
                htmlFor="news-image-upload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer p-6 hover:border-brand-500 transition-colors bg-gray-50"
              >
                <ImagePlus className="w-10 h-10 text-gray-400 mb-2" />
                <span className="text-gray-500 text-sm mb-1">
                  Kéo & thả hoặc bấm để chọn ảnh đại diện
                </span>
                <span className="text-xs text-gray-400">
                  (Chỉ nhận file ảnh, kích thước tối đa 5MB)
                </span>
                <input
                  id="news-image-upload"
                  type="file"
                  accept="image/*"
                  ref={newsImageFileRef}
                  title="Chọn ảnh đại diện cho tin tức"
                  placeholder="Chọn ảnh đại diện"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewsImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden"
                />
              </label>
              {newsImagePreview && (
                <div className="mt-2 flex justify-center">
                  <Image
                    src={newsImagePreview}
                    alt="News Preview"
                    width={300}
                    height={150}
                    className="rounded border"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="submit" className="bg-amber-500">
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
