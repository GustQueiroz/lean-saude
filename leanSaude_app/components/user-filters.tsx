"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserFiltersProps {
  filters: string[];
  setFilters: (filters: string[]) => void;
}

export function UserFilters({ filters, setFilters }: UserFiltersProps) {
  const [open, setOpen] = useState(false);

  const handleAddFilter = () => {
    setFilters([...filters, `Filtro ${filters.length + 1}`]);
  };

  const handleRemoveFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className={cn(
          "flex items-center gap-1",
          filters.length > 0 && "bg-primary/10 border-primary/20"
        )}
        onClick={() => setOpen(!open)}
      >
        Filtros
        {filters.length > 0 && (
          <Badge className="ml-1 bg-primary text-white">{filters.length}</Badge>
        )}
        <ChevronDown className="h-4 w-4 ml-1" />
      </Button>

      {open && (
        <div className="absolute top-10 left-0 bg-white border rounded-md shadow-md p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filtros aplicados</h4>
              <Button size="sm" className="h-8 gap-1" onClick={handleAddFilter}>
                <Plus className="h-4 w-4" /> Adicionar
              </Button>
            </div>

            {filters.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                Nenhum filtro aplicado. Adicione um filtro para refinar os
                resultados.
              </div>
            ) : (
              <div className="space-y-2">
                {filters.map((filter, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <span className="text-sm">{filter}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleRemoveFilter(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
