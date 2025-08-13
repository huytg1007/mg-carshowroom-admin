"use client";
import React, { useState, useEffect } from "react";
import newsService from "@/services/newService";
import { News } from "@/interfaces/newsInterface";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import NewsModal from "../modal/NewsModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";

export default function NewsTable() {
  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    setLoading(true);
    setError(null);
    try {
      const res = await newsService.getAllNews();
      if (res.success && res.data) {
        setNewsItems(res.data);
      } else {
        setError(res.message || "Lỗi khi lấy dữ liệu tin tức");
      }
    } catch (err) {
      setError("Lỗi khi lấy dữ liệu tin tức: " + err);
    } finally {
      setLoading(false);
    }
  }

  const handleShowDetail = (news: News) => {
    setSelectedNews(news);
    setIsAddingNew(false);
    setModalOpen(true);
  };

  const handleAddNewNews = () => {
    setSelectedNews(null);
    setIsAddingNew(true);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedNews(null);
    setIsAddingNew(false);
  };

  const handleDeleteClick = (newsId: number | undefined) => {
    if (newsId) {
      setNewsToDelete(newsId);
      setConfirmDeleteOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (newsToDelete) {
      try {
        const result = await newsService.deleteNews(newsToDelete);
        if (result.success) {
          // Remove the deleted news from the state
          setNewsItems((prevNews) =>
            prevNews.filter((news) => news.id !== newsToDelete)
          );
          setConfirmDeleteOpen(false);
          setNewsToDelete(null);
        } else {
          alert(`Lỗi khi xóa: ${result.message}`);
        }
      } catch (error) {
        alert(`Lỗi khi xóa: ${error}`);
      }
    }
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="rounded-xl border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Danh sách tin tức
        </h4>
        <Button onClick={handleAddNewNews}>Thêm mới</Button>
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
                <TableCell className="font-semibold">ID</TableCell>
                <TableCell className="font-semibold">Tiêu đề</TableCell>
                <TableCell className="font-semibold">Hình ảnh</TableCell>
                <TableCell className="font-semibold">Thời gian</TableCell>
                <TableCell className="font-semibold">Trạng thái</TableCell>
                <TableCell className="font-semibold">Hành động</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newsItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                newsItems.map((news) => (
                  <TableRow key={news.id}>
                    <TableCell>{news.id}</TableCell>
                    <TableCell>{news.name}</TableCell>
                    <TableCell>
                      {news.imageUrl ? (
                        <div className="relative w-24 h-14 rounded overflow-hidden">
                          <Image
                            src={news.imageUrl}
                            alt={news.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">
                          Không có ảnh
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(news.createdAt)}</TableCell>
                    <TableCell>
                      {news.isActive ? (
                        <span className="bg-success bg-opacity-10 text-success px-3 py-1 rounded">
                          Hiển thị
                        </span>
                      ) : (
                        <span className="bg-danger bg-opacity-10 text-danger px-3 py-1 rounded">
                          Ẩn
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleShowDetail(news)}
                        className="hover:text-primary mr-4"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteClick(news.id)}
                        className="hover:text-danger"
                      >
                        Xóa
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* News Modal */}
      {modalOpen && (
        <NewsModal
          news={selectedNews}
          open={modalOpen}
          onClose={handleCloseModal}
          isNew={isAddingNew}
          onNewsUpdated={fetchNews}
        />
      )}

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onOpenChange={() => setConfirmDeleteOpen(false)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Bạn có chắc chắn muốn xóa tin tức này?</p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setConfirmDeleteOpen(false)}
              className="border px-4 py-2 rounded-md"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Xóa
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
