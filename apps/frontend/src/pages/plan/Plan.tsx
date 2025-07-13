
import { useEffect, useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

import { FilterComponent } from "@/components/table/FilterComponent"
import { TableComponent } from "@/components/table/TableComponent"
import { planColumns } from "./plan.data"
import { GroupPlans, IPlan, PlanBody } from "@/services/plan/plan.interface"
import { PlanForm } from "./PlanForm"
import { createPlan, getPlans, updatePlan } from "@/services/plan/plan.service"

export const Plan = () => {
    const [plans, setPlans] = useState<GroupPlans>({ allPlans: [], plans: [] });
    const [planSelected, setPlanSelected] = useState<IPlan | null>(null);
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        getPlansApi();
    }, []);

    const getPlansApi = async () => {
        try {
            const response: IPlan[] = await getPlans();
            setPlans({ allPlans: response, plans: response });
        } catch (err) {
            console.log(err);
        }
    }

    const newPlan = () => {
        setPlanSelected(null);
        setOpen(true);
    }

    const getActionTable = (action: string, data: IPlan) => {
        setPlanSelected(data);
        if (action == 'edit') {
            setOpen(true);
        }
        if (action == 'delete') {
            console.log('Eliminar');
        }
    }

    const getActionForm = async (data: PlanBody) => {
        if (planSelected) {
            await updatePlan(planSelected.id, data);
        } else {
            await createPlan(data);
        }
        setOpen(false);
        await getPlansApi();
    }

    const onFilterPlan = (plans: IPlan[]) => {
        setPlans(prev => ({ ...prev, plans }))
    }

    return (
        <div className="space-y-4 text-white">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Gestión de Planes</h1>
                <p className="text-muted-foreground">Administre los planes del gimnasio.</p>
            </div>
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <FilterComponent
                        data={plans.allPlans}
                        onSearch={onFilterPlan}
                        columns={planColumns}
                        placeholder="Buscar plan..."
                    />
                </div>
                <div className="flex gap-2">
                    <Button onClick={newPlan} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Plan
                    </Button>
                </div>
            </div>

            <TableComponent
                data={plans.plans}
                columns={planColumns}
                actionTable={getActionTable}
            />


            {open && (
                <PlanForm
                    data={planSelected}
                    open={open}
                    setOpen={setOpen}
                    onSubmit={getActionForm}
                />
            )}

            {/* Edit Plan Dialog */}

        </div>
    )
}
