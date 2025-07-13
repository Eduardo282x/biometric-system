export interface PlanBody { 
    price: number;
    name: string;
    description: string;
}

export interface GroupPlans {
    allPlans: IPlan[]
    plans: IPlan[]
}

export interface IPlan extends PlanBody {
    id: number;
}