"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { UserFilters } from "@/components/user-filters";
import { UserTable } from "@/components/user-table";
import { api } from "@/lib/api";

export default function UsuariosPage() {
  const [filters, setFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "id",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users", {
        params: {
          page: currentPage,
          perPage: itemsPerPage,
          orderBy: sortConfig.key,
          order: sortConfig.direction,
          query: searchQuery,
        },
      });

      setUsers(response.data.data);
      setTotalItems(response.data.total);
    } catch (err) {
      console.error("Erro ao buscar usuários", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage, sortConfig, searchQuery]);

  const toggleUserStatus = (userId: number) => {
    console.log("Toggling status for user:", userId);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Usuários</h1>
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar ID ou nome ou telefone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <UserFilters filters={filters} setFilters={setFilters} />
      </div>
      <UserTable
        users={users}
        loading={loading}
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
