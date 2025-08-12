"use client";

import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import Image from "next/image";
import { Car } from "@/interfaces/carInterface";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import carService from "@/services/carService";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

// Zod schema for CarProperty
const propertySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Tên thuộc tính không được để trống"),
  value: z.string().min(1, "Giá trị không được để trống"),
  carDetailId: z.number().optional(),
});

// Zod schema for CarDetail
const detailSchema = z.object({
  id: z.number().optional(),
  carName: z.string().min(1, "Tên phiên bản không được để trống"),
  price: z.number().min(0, "Giá phải >= 0"),
  description: z.string().optional(),
  carId: z.number().optional(),
  thumbnailImageId: z.number().optional(),
  thumbnailImageUrl: z.string().optional(),
  thumbnailImage: z.any().optional(),
  detailImageUploads: z.any().optional(),
  properties: z.array(propertySchema),
});

// Zod schema for CarFeature
const featureSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Tên tính năng không được để trống"),
  carId: z.number().optional(),
  imageId: z.number().optional(),
  imageUrl: z.string().optional(),
  featureImage: z.any().optional(),
});

// Zod schema for Car
const carSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Tên xe không được để trống"),
  description: z.string().optional(),
  featureTitle: z.string().optional(),
  featureDescription: z.string().optional(),
  imageId: z.number().optional(),
  imageUrl: z.string().optional(),
  details: z.array(detailSchema),
  features: z.array(featureSchema),
  isActive: z.boolean(),
});

type CarFormType = z.infer<typeof carSchema>;

export default function CarDetailModal({
  car,
  open,
  onClose,
  isNew = false,
}: {
  car: Car | null;
  open: boolean;
  onClose: () => void;
  isNew?: boolean;
}) {
  const form = useForm<CarFormType>({
    resolver: zodResolver(carSchema),
    defaultValues: isNew
      ? {
          name: "",
          description: "",
          featureTitle: "",
          featureDescription: "",
          isActive: true,
          details: [],
          features: [],
        }
      : car || {},
    mode: "onChange",
  });

  // For car main image preview
  const [carImagePreview, setCarImagePreview] = React.useState<string | null>(
    car?.imageUrl || null
  );
  const carImageFileRef = useRef<HTMLInputElement | null>(null);
  // For detail image file state (avoid any)
  type DetailImageFileMap = { [detailIdx: number]: File | undefined };
  const [detailImageFiles, setDetailImageFiles] =
    React.useState<DetailImageFileMap>({});

  // Update form values when car changes
  useEffect(() => {
    console.log("Car:", car);
    if (car) {
      // Deep ensure all arrays are present
      const safeCar = {
        ...car,
        details: Array.isArray(car.details)
          ? car.details.map((detail) => ({
              ...detail,
              properties: Array.isArray(detail.properties)
                ? detail.properties
                : [],
            }))
          : [],
        features: Array.isArray(car.features) ? car.features : [],
      };
      form.reset(safeCar);
      setCarImagePreview(car.imageUrl || null);
    }
  }, [car, form]);

  // Field arrays for details and features
  const detailsArray = useFieldArray({
    control: form.control,
    name: "details",
  });
  const featuresArray = useFieldArray({
    control: form.control,
    name: "features",
  });

  // Sync useFieldArray for nested properties (ensure react-hook-form controls all property fields)
  useEffect(() => {
    detailsArray.fields.forEach((detail, detailIdx) => {
      if (!Array.isArray(detail.properties)) return;
      detail.properties.forEach((prop, propIdx) => {
        // If value is undefined, set it from car data (if available)
        const value = form.getValues(
          `details.${detailIdx}.properties.${propIdx}.value`
        );
        if (value === undefined && prop.value !== undefined) {
          form.setValue(
            `details.${detailIdx}.properties.${propIdx}.value`,
            prop.value
          );
        }
      });
    });
  }, [detailsArray.fields, form]);

  // Submit handler
  const onSubmit = async (values: CarFormType) => {
    // Convert isActive from string to boolean
    const submitValues = {
      ...values,
      isActive: String(values.isActive) === "true",
    };

    try {
      if (isNew) {
        // Creating a new car
        // Since we need to provide carImage for new cars, we would typically handle file uploads here
        // This is a simplified version - in a real app, you'd need to handle file selection UI

        alert(
          "Feature not fully implemented: Would create a new car with proper image upload UI"
        );
        onClose();
        // In a real implementation:
        // const response = await carService.createCar(createRequest);
        // if (response.success) {
        //     alert('Thêm xe mới thành công!');
        //     onClose();
        //     window.location.reload();
        // } else {
        //     alert(`Lỗi: ${response.message}`);
        // }
      } else {
        // Updating an existing car
        if (!values.id) return;
        // Prepare FormData for file upload
        const formData = new FormData();
        // Main car fields
        formData.append("id", String(values.id));
        formData.append("name", values.name);
        if (values.description)
          formData.append("description", values.description);
        if (values.featureTitle)
          formData.append("featureTitle", values.featureTitle);
        if (values.featureDescription)
          formData.append("featureDescription", values.featureDescription);
        formData.append("isActive", String(submitValues.isActive));

        // Car main image file
        const carImageFile = carImageFileRef.current?.files?.[0];
        if (carImageFile) {
          formData.append("carImage", carImageFile);
        }

        // Details (with thumbnail file)
        submitValues.details.forEach((detail, idx) => {
          formData.append(`details[${idx}][carName]`, detail.carName);
          formData.append(`details[${idx}][price]`, String(detail.price));
          if (detail.description)
            formData.append(`details[${idx}][description]`, detail.description);
          if (detail.thumbnailImageUrl)
            formData.append(
              `details[${idx}][thumbnailImageUrl]`,
              detail.thumbnailImageUrl
            );
          // Thumbnail file
          const file = detailImageFiles[idx];
          if (file) {
            formData.append(`details[${idx}][thumbnailImage]`, file);
          }
          // Properties
          detail.properties.forEach((prop, pidx) => {
            formData.append(
              `details[${idx}][properties][${pidx}][name]`,
              prop.name
            );
            formData.append(
              `details[${idx}][properties][${pidx}][value]`,
              prop.value
            );
          });
        });
        // Features
        submitValues.features.forEach((feature, idx) => {
          formData.append(`features[${idx}][name]`, feature.name);
          if (feature.imageUrl)
            formData.append(`features[${idx}][imageUrl]`, feature.imageUrl);
        });

        // Call API (you need to support multipart/form-data in backend)
        const res = await carService.updateCarWithFormData(values.id, formData);
        if (res.success) {
          onClose();
        } else {
          alert(res.message || "Cập nhật thất bại");
        }
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      alert(
        "Đã xảy ra lỗi trong quá trình xử lý: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };

  // Only return null if we're editing (not adding new) and there's no car data
  if (!isNew && !car) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-5xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{isNew ? "Thêm xe mới" : "Chỉnh sửa xe"}</DialogTitle>
          <DialogDescription>
            {isNew
              ? "Nhập thông tin để thêm xe mới"
              : "Chỉnh sửa toàn bộ thông tin xe và các phiên bản, tính năng."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tên xe <span className="text-error-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={car?.name}
                        placeholder="Tên xe"
                        {...field}
                        min={undefined}
                        max={undefined}
                        step={undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Car main image upload */}
              <div className="col-span-2">
                <label className="font-semibold">Ảnh đại diện xe</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={carImageFileRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setCarImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="block mt-1"
                  placeholder="Chọn ảnh đại diện xe"
                  title="Chọn ảnh đại diện xe"
                />
                {(carImagePreview || (!isNew && car?.imageUrl)) && (
                  <Image
                    src={
                      carImagePreview ||
                      (!isNew && car?.imageUrl) ||
                      "/images/placeholder.png"
                    }
                    alt="Car"
                    width={120}
                    height={80}
                    className="rounded mt-2"
                  />
                )}
              </div>
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        value={String(field.value)}
                        className="w-full h-11 rounded-lg border px-4"
                      >
                        <option value="true">Đang bán</option>
                        <option value="false">Ngừng bán</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={form.getValues("description")}
                        placeholder="Mô tả"
                        {...field}
                        min={undefined}
                        max={undefined}
                        step={undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="featureTitle"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Tiêu đề tính năng</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={form.getValues("featureTitle")}
                        placeholder="Tiêu đề tính năng"
                        {...field}
                        min={undefined}
                        max={undefined}
                        step={undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="featureDescription"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Mô tả tính năng</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={form.getValues("featureDescription")}
                        placeholder="Mô tả tính năng"
                        {...field}
                        min={undefined}
                        max={undefined}
                        step={undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Details */}
            <div>
              <div className="font-semibold mb-2">Các phiên bản:</div>
              {detailsArray.fields.map((detail, detailIdx) => (
                <div
                  key={detail.id || detailIdx}
                  className="mb-4 border-b pb-2"
                >
                  <div className="flex gap-3 mb-1">
                    <FormField
                      control={form.control}
                      name={`details.${detailIdx}.carName`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Tên phiên bản</FormLabel>
                          <FormControl>
                            <Input
                              defaultValue={detail.carName}
                              placeholder="Tên phiên bản"
                              {...field}
                              min={undefined}
                              max={undefined}
                              step={undefined}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`details.${detailIdx}.price`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Giá</FormLabel>
                          <FormControl>
                            <Input
                              defaultValue={detail.price}
                              type="number"
                              placeholder="Giá"
                              {...field}
                              min="0"
                              max={undefined}
                              step={undefined}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-3 mb-1">
                    <FormField
                      control={form.control}
                      name={`details.${detailIdx}.description`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Mô tả</FormLabel>
                          <FormControl>
                            <Input
                              defaultValue={detail.description}
                              placeholder="Mô tả"
                              {...field}
                              min={undefined}
                              max={undefined}
                              step={undefined}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`details.${detailIdx}.thumbnailImageUrl`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Ảnh đại diện phiên bản</FormLabel>
                          <FormControl>
                            <div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  setDetailImageFiles((prev) => ({
                                    ...prev,
                                    [detailIdx]: file,
                                  }));
                                  if (file) {
                                    form.setValue(
                                      `details.${detailIdx}.thumbnailImageUrl`,
                                      URL.createObjectURL(file)
                                    );
                                  }
                                }}
                                className="block mt-1"
                                title="Chọn ảnh đại diện phiên bản"
                              />
                              {field.value && (
                                <Image
                                  src={field.value}
                                  alt="Thumbnail"
                                  width={80}
                                  height={60}
                                  className="rounded mt-2"
                                />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Properties */}
                  <div className="ml-2 mt-1">
                    <div className="font-semibold text-xs mb-1">
                      Thông số kỹ thuật:
                    </div>
                    {detail.properties.map((prop, propIdx) => (
                      <div key={prop.id || propIdx} className="flex gap-2 mb-1">
                        <FormField
                          control={form.control}
                          name={`details.${detailIdx}.properties.${propIdx}.name`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Tên</FormLabel>
                              <FormControl>
                                <Input
                                  defaultValue={prop.name}
                                  placeholder="Tên"
                                  {...field}
                                  min={undefined}
                                  max={undefined}
                                  step={undefined}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`details.${detailIdx}.properties.${propIdx}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Giá trị</FormLabel>
                              <FormControl>
                                <Input
                                  defaultValue={prop.value}
                                  placeholder="Giá trị"
                                  {...field}
                                  min={undefined}
                                  max={undefined}
                                  step={undefined}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div>
              <div className="font-semibold mb-2">Tính năng nổi bật:</div>
              <div className="grid grid-cols-2 gap-2">
                {featuresArray.fields.map((feature, featureIdx) => (
                  <div
                    key={feature.id || featureIdx}
                    className="flex items-center gap-2 border rounded p-2"
                  >
                    <FormField
                      control={form.control}
                      name={`features.${featureIdx}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Tên tính năng</FormLabel>
                          <FormControl>
                            <Input
                              defaultValue={feature.name}
                              placeholder="Tên tính năng"
                              {...field}
                              min={undefined}
                              max={undefined}
                              step={undefined}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch(`features.${featureIdx}.imageUrl`) ? (
                      <Image
                        src={
                          form.watch(`features.${featureIdx}.imageUrl`) ||
                          "/images/brand/brand-01.svg"
                        }
                        width={200}
                        height={100}
                        alt={
                          form.watch(`features.${featureIdx}.name`) || "feature"
                        }
                        className="object-cover border-2 rounded-lg" // crop and fill
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="submit"
                className="bg-brand-500 text-white px-4 py-2 rounded text-sm"
              >
                Lưu
              </button>
              <DialogClose asChild>
                <button
                  type="button"
                  className="border px-4 py-2 rounded text-sm"
                  onClick={onClose}
                >
                  Đóng
                </button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
