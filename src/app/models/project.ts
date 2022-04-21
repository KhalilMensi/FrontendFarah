export class Project{
    id? : number;
    creationDate? : Date;
    subject? : string;
    description? : string;
    price? : number;
    startDate? : Date;
    deliveryDate? : Date;
    stage? : string;
    clientEntrepriseId? : number;
    documents?: Document[];
}
