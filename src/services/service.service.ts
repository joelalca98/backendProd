import { Service, ServiceModel } from "../models/service.model";


export async function createService ( service : Service){
    return ServiceModel.create(service).catch((error : any) => {
        console.log("Error creating service "); 
    }) 

}

export async function findService( serviceId : string ){
    return ServiceModel.findById(serviceId).populate('services').catch((error : any) => {
        console.log("Error finding service "); 
    }) 
}


export async function findAllServices(){
    return ServiceModel.find().catch((error : any) => {
        console.log("Error finding all"); 
    })
}


export async function deleteServiceById( serviceId : string){
    return ServiceModel.findByIdAndDelete( serviceId).catch((error : any) => {
        console.log("Error deleting service"); 
    })
}

export async function updateServiceById( updated : Service){
    return ServiceModel.findByIdAndUpdate( updated._id, updated, { new: true }).catch((error : any) => {
        console.log("Error updating service"); 
    })
}