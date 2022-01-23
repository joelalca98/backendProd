import { Service} from './../models/service.model';
import { Request, Response } from "express";
import { createService, deleteServiceById, findAllServices, updateServiceById } from '../services/service.service';



export async function createServiceHandler( req: Request, res: Response){
    const service : Service = req.body; 
    console.log(req.body); 
    const created = await createService(service); 
    if(created) return res.status(200).json(created); 
    return res.status(400).send({message: 'Error creating service'});
}
export async function getAllServicesHandler( req: Request, res: Response){
    const services = await findAllServices(); 
    res.status(200).json(services); 

}
export async function updateServiceHandler( req: Request, res: Response){
    const service : Service = req.body; 
    const updated = await updateServiceById(service); 
    if( updated) res.status(200).send(updated);


}

export async function deleteServiceHandler( req: Request, res: Response){
    const id = req.params.id; 
    const deleted = await deleteServiceById(id);
    if(deleted) return res.status(200).send(deleted); 
    
}