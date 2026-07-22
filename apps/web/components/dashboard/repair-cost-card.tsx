"use client";

import { useMemo, useState, useTransition } from "react";
import { GlassCard, Button } from "@nexora/ui/components";
import { updateRepairCostsAction } from "@/lib/actions/ticket.actions";
import { useRouter } from "next/navigation";
interface Props {
  ticketId: string;

  laborCost: number | null;
  partsCost: number |null;
  discount: number | null;
  tax: number | null;
  finalCost: number | null;

  status: string;


}


export function RepairCostCard({
  ticketId,
  laborCost,
  partsCost,
  discount,
  tax,
}: Props) {
  const router = useRouter();
  const [labor, setLabor] = useState(Number(laborCost ?? 0));
  const [parts, setParts] = useState(Number(partsCost ?? 0));
  const [discountValue, setDiscountValue] = useState(Number(discount ?? 0));
  const [taxValue, setTaxValue] = useState(Number(tax ?? 0));

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(() => {
    return labor + parts + taxValue - discountValue;
  }, [labor, parts, taxValue, discountValue]);

  function handleSave() {
    setError(null);
      console.log("Guardar");

    const formData = new FormData();

    formData.set("ticketId", ticketId);
    formData.set("laborCost", labor.toString());
    formData.set("partsCost", parts.toString());
    formData.set("discount", discountValue.toString());
    formData.set("tax", taxValue.toString());

    startTransition(async () => {
      const result = await updateRepairCostsAction(formData);

      if (!result.success) {
        setError(result.error ?? "Error al guardar.");
      }
      router.refresh();
    });
  }

  return (
    <GlassCard>
      <h3 className="mb-4 font-display text-sm font-bold">
        Costos de la reparación
      </h3>

      <div className="space-y-3">
        <input
          type="number"
          value={labor}
          onChange={(e) => setLabor(Number(e.target.value))}
          placeholder="Mano de obra"
          className="w-full rounded-lg border border-border/10 bg-surface/5 p-3"
        />

 <label className="text-sm font-medium text-foreground/80">
    Repuestos
  </label>
        <input
        
          type="number"
          value={parts}
          onChange={(e) => setParts(Number(e.target.value))}
          placeholder="Repuestos"
          className="w-full rounded-lg border border-border/10 bg-surface/5 p-3"
        />

         <label className="text-sm font-medium text-foreground/80">
    Descuentos
  </label>

        <input
          type="number"
          value={discountValue}
          onChange={(e) => setDiscountValue(Number(e.target.value))}
          placeholder="Descuento"
          className="w-full rounded-lg border border-border/10 bg-surface/5 p-3"
        />
 <label className="text-sm font-medium text-foreground/80">
    Impuestos
  </label>
        <input
          type="number"
          value={taxValue}
          onChange={(e) => setTaxValue(Number(e.target.value))}
          placeholder="Impuestos"
          className="w-full rounded-lg border border-border/10 bg-surface/5 p-3"
        />
      </div>

      <div className="mt-5 border-t border-border/10 pt-4">
        <p className="text-xs text-text-muted">Total</p>

        <p className="font-display text-xl font-bold">
          ${total.toLocaleString("es-CO")}
        </p>
      </div>

      <Button
        onClick={handleSave}
        disabled={isPending}
        className="mt-5 w-full"
        
      >
        {isPending ? "Guardando..." : "Generar Factura"}
    
      </Button>

      {error && (
        <p className="mt-3 text-xs text-danger">
          {error}
        </p>
      )}
    </GlassCard>
  );
}