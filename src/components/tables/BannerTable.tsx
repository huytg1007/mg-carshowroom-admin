"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import bannerService from "@/services/bannerService";
import { BannerType } from "@/interfaces/bannerInterface";
import BannerModal from "../modal/BannerModal";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function BannerTable() {
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<BannerType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bannerService.getAllBanners();
      if (res.success && res.data) setBanners(res.data);
      else setError(res.message || "Lỗi khi lấy dữ liệu banner");
    } catch (err) {
      setError("Lỗi khi lấy dữ liệu banner: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleAdd = () => {
    setSelectedBanner(null);
    setOpenModal(true);
  };

  const handleEdit = (banner: BannerType) => {
    setSelectedBanner(banner);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedBanner(null);
  };

  const handleBannerUpdated = () => {
    fetchBanners();
    handleModalClose();
  };

  return (
    <div className="rounded-xl border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Danh sách Banner</h2>
        <Button onClick={handleAdd}>Thêm mới</Button>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="font-semibold">Hình ảnh</TableCell>
                <TableCell className="font-semibold">Tên banner</TableCell>
                <TableCell className="font-semibold">Ảnh</TableCell>
                <TableCell className="font-semibold">Trạng thái</TableCell>
                <TableCell className="font-semibold">Hành động</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                banners.map((banner, idx) => (
                  <TableRow key={banner.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{banner.name}</TableCell>
                    <TableCell>
                      {banner.imageUrl && (
                        <div className="relative w-16 h-10 rounded overflow-hidden">
                          <Image
                            src={banner.imageUrl}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{banner.isActive ? "Hiển thị" : "Ẩn"}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleEdit(banner)}>
                        Sửa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
      <BannerModal
        banner={selectedBanner}
        open={openModal}
        onClose={handleModalClose}
        isNew={!selectedBanner}
        onBannerUpdated={handleBannerUpdated}
      />
    </div>
  );
}
