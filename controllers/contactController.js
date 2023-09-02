const asyncHandler = require("express-async-handler")
const Contact=require("../models/contactModel")

// @desc get all contacts
// @router GET /api/contacts/
// @access private

const getContacts= asyncHandler(async(req,res)=>{
    {
        const contact= await Contact.find({user_id:req.user.id});
        res.status(200).json(contact)
    }
})

// @desc get a contact
// @router GET /api/contacts/:id
// @access private
const getContact= asyncHandler(async (req,res)=>{
    const contact= await Contact.findById(req.params.id)
    if(!contact){
        res.status(404);
        throw new Error (`${req.params.id} is not found`);
    }
        res.status(200).json(contact)
    
})

// @desc create a contact
// @router POST /api/contacts/
// @access private
const createContact= asyncHandler( async(req,res)=>{

    {
        
    const {name, email, phone}=req.body;
    if (!name|| !email|| !phone){
        res.status(400);
        throw new Error ("All fields are mandatory !");
    }
    
    const contact=await Contact.create({
name,email,phone,user_id:req.user.id
    })
    res.status(201).json(contact)
    }
})

// @desc Update a contact
// @router PUT /api/contacts/:id
// @access private
const updateContact= asyncHandler(async(req,res)=>{
   const contact=await Contact.findById(req.params.id)
   if(!contact){
    res.status(404);
    throw new Error(`The id:${req.params.id}, does not exist`);
   }
   if(contact.user_id!==req.user.id){
    res.status(403);
    throw new Error("User not authorized to update this contact")
   }
   
   const updatedContact=await Contact.findByIdAndUpdate(req.params.id,req.body,
    {new: true});
   res.status(201).json(updatedContact)
})

// @desc delete a contact
// @router DELETE /api/contacts/:id
// @access private
const deleteContact= asyncHandler(async(req,res)=>{
    
    const contact=await Contact.findById(req.params.id)
    
    if(!contact){
        res.status(404);
        throw new Error(`The id:${req.params.id}, does not exist`);
       }
    if(contact.user_id!==req.user.id){
    res.status(403);
    throw new Error("User not authorized to delete contact")
   }
   
    const deleteContact=await Contact.deleteOne();
    res.status(204).send(deleteContact)
    
})


module.exports={getContacts,getContact,updateContact,createContact,deleteContact}