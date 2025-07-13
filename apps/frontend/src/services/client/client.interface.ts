export interface ClientBody {
    name: string;
    lastName: string;
    phone: string;
    address: string;
    email: string;
    identify: string;
}

export interface GroupClients { 
    allClients: IClients[];
    clients: IClients[]
}

export interface IClients {
    id:          number;
    name:        string;
    lastName:    string;
    identify:    string;
    email:       string;
    phone:       string;
    address:     string;
    photo:       string;
    createdDate: Date;
    planId:      number;
    plan:        Plan;
}

export interface Plan {
    id:          number;
    name:        string;
    price:       number;
    description: string;
}
