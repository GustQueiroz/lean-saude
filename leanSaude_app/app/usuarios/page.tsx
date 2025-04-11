"use client";

import { useState } from "react";
import { UserFilters } from "@/components/user-filters";
import { UserTable } from "@/components/user-table";

export default function UsuariosPage() {
  const [filters, setFilters] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "id",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const totalItems = 5;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const toggleUserStatus = (userId: number) => {
    console.log("Toggling status for user:", userId);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Usuários</h1>
      <div className="flex items-center space-x-4">
        <div className="relative flex-1"></div>
        <UserFilters filters={filters} setFilters={setFilters} />
      </div>
      <UserTable
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        toggleUserStatus={toggleUserStatus}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalItems={totalItems}
      />
    </div>
  );
}
