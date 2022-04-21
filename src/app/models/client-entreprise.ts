import { ClientEmployee } from "./client-employee";
import { Project } from "./project";
export class ClientEntreprise {
    id?:number;
    name? : string;
    address? : string;
    email? : string;
    type? : string;
    employees?: ClientEmployee[];
    projects?: Project[];
}
