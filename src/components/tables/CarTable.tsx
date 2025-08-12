"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import carService from "@/services/carService";
import { Car } from "@/interfaces/carInterface";
import Image from "next/image";

// Component
import CarDetailModal from "../modal/CarDetailModal";
import { EditIcon } from "lucide-react";

export default function CarTable() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    async function fetchCars() {
      setLoading(true);
      setError(null);
      try {
        const res = await carService.getAllCars();
        if (res.success && res.data) {
          setCars(res.data);
        } else {
          setError(res.message || "Lỗi khi lấy dữ liệu xe");
        }
      } catch (err) {
        setError("Lỗi khi lấy dữ liệu xe: " + err);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  const handleShowDetail = (car: Car) => {
    setSelectedCar(car);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCar(null);
    setIsAddingNew(false);
  };

  const handleAddNewCar = () => {
    setSelectedCar(null);
    setIsAddingNew(true);
    setModalOpen(true);
  };

  return (
    <div className="rounded-xl border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Danh sách xe
        </h4>
        <button
          className="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600 text-sm flex items-center"
          onClick={handleAddNewCar}
        >
          <span className="mr-1">+</span> Thêm mới
        </button>
      </div>
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Đang tải dữ liệu...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : (
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Hình ảnh
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Tên xe
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Mô tả
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Tính năng nổi bật
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Trạng thái
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {cars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {car.imageUrl && (
                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                          <Image
                            src={car.imageUrl}
                            alt={car.name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                      )}
                      {!car.imageUrl && (
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start font-medium text-gray-800 dark:text-white/90">
                      {car.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {car.description}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <ul className="list-disc ml-4">
                        {car.features.slice(0, 3).map((feature) => (
                          <li key={feature.id}>{feature.name}</li>
                        ))}
                        {car.features.length > 3 && <li>...</li>}
                      </ul>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge
                        className="text-xs"
                        color={car.isActive ? "success" : "error"}
                      >
                        {car.isActive ? "Đang bán" : "Ngừng bán"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <button
                        className="px-3 py-1 bg-brand-50 rounded hover:bg-brand-600 text-xs"
                        onClick={() => handleShowDetail(car)}
                      >
                        <EditIcon />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <CarDetailModal
        car={selectedCar}
        open={modalOpen}
        onClose={handleCloseModal}
        isNew={isAddingNew}
      />
    </div>
  );
}
