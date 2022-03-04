const express = require('express');
const router = express.Router()
const eventsModel = require('../models/events');

//{CREATE} get all info from events
router.get('/', (req, res, next) =>{
    eventsModel.find({},(err, data)=>{
        if(err) {
            console.log(err)
        }else{
            console.log(data)
            res.json(data)
        }
    })
});

//{CREATE}create new event
router.post('/new-event', (req, res, next)=>{
    console.log(req.body)
    eventsModel.create(req.body, (error, data)=>{
    if(error){
        return next(error);
    }else{
        console.log(data)
        res.send('New Event added');
    }
    });
});

//{READ} find one event
router.get('/find/:evid', (req, res, next)=>{
    eventsModel.find({evid : req.params.evid}, (error, results)=>{
        if(error){
            return next(error);
        }else{
            res.json(results);
        }
    });
});

//{UPDATE} Add/remove attendees from events
router.put('/attendee/:evid', (req, res, next)=>{
    var id_type = req.body.type
    var id_num = req.body.id
    var action = req.body.action
    
    //add to events
    if(action == 'add'){
        //add volunteer id's
        if (id_type == 'volunteer'){
            eventsModel.findOneAndUpdate({evid : parseInt(req.params.evid)},{
                $push:{'attendees.vid':id_num}
            }, 
                (error, results) => {
                    if(error){
                        return next(error);
                    }else{
                    res.send('Added new volunteer attendee to event.')
                    console.log('Added new volunteer attendee to event.')
                }
            });
        }
        //add employee ids
        if (id_type == 'employee'){
            eventsModel.findOneAndUpdate({evid : parseInt(req.params.evid)},{
                $push:{'attendees.employeeID':id_num}
            }, 
                (error, results) => {
                    if(error){
                        return next(error);
                    }else{
                    res.send('Added new employee attendee to event.')
                    console.log('Added new employee attendee to event.')
                }
            });
        }
        //add client ids
        if (id_type == 'client'){
            eventsModel.findOneAndUpdate({evid : parseInt(req.params.evid)},{
                $push:{'attendees.cid':id_num}
            }, 
                (error, results) => {
                    if(error){
                        return next(error);
                    }else{
                    res.send('Added new client attendee to event.')
                    console.log('Added new client attendee to event.')
                }
            });
        }
    }
    //remove attendees from events
    if(action == 'del'){
        //remove volunteer id
        if (id_type == 'volunteer'){
            eventsModel.findOneAndUpdate({evid : parseInt(req.params.evid)},{
                $pull:{'attendees.vid':id_num}
            }, 
                (error, results) => {
                    if(error){
                        return next(error);
                    }else{
                    res.send('Removed volunteer attendee from event.')
                    console.log('Removed volunteer attendee from event.')
                }
            });
        }
        //remove employee id
        if (id_type == 'employee'){
            eventsModel.findOneAndUpdate({evid : parseInt(req.params.evid)},{
                $pull:{'attendees.employeeID':id_num}
            }, 
                (error, results) => {
                    if(error){
                        return next(error);
                    }else{
                    res.send('Removed employee attendee from event.')
                    console.log('Removed employee attendee from event.')
                }
            });
        }
        //remove client id
        if (id_type == 'client'){
            eventsModel.findOneAndUpdate({evid : parseInt(req.params.evid)},{
                $pull:{'attendees.cid':id_num}
            }, 
                (error, results) => {
                    if(error){
                        return next(error);
                    }else{
                    res.send('Removed client attendee from event.')
                    console.log('Removed client attendee from event.')
                }
            });
        }
    }

});

//get event and attendee information
router.get('/event-attendees', (req, res, next)=>{
    //join documents to get volunteers, clients, employees data
    eventsModel.aggregate([
        {
            $lookup:{
                from:'volunteers',
                localField:'attendees.vid',
                foreignField:'vid',
                as: 'volunteers'
            }
        },
        {
            $lookup:{
                from:"clients",
                localField:'attendees.cid',
                foreignField:'cid',
                as:'clients'
            }
        },
        {
            $lookup:{
                from:'employees',
                localField:'attendees.employeeID',
                foreignField:'employeeID',
                as:'employees'
            }
        },
            //only get back specifi fields
            {
                $project:{
                    '_id':0,
                    'evid':1,
                    'ev_name':1,
                    'ev_host':1,
                    'ev_date':1,
                    'city':1,
                    'st':1,
                    'zip':1,
                    'volunteers.vid':1,
                    'volunteers.first_name':1,
                    'volunteers.last_name':1,
                    'volunteers.phone_num':1,
                    'clients.cid':1,
                    'clients.first_name':1,
                    'clients.last_name':1,
                    'clients.phone_number':1,
                    'employees.employeeID':1,
                    'employees.firstName':1,
                    'employees.lastName':1,
                    'employees.phone':1
                }
            }
    ],(error, results)=>{
        if(error){
            return next(error)
        }else{
            console.log(results)
            res.json(results)
        }
    })

});



//{UPDATE} event data
router.put('/update/:evid', (req, res, next)=>{
    eventsModel.findOneAndUpdate({evid : req.params.evid},{
        $set:req.body
        }, (error, results) => {
        if(error){
            return next(error);
        }else{
            res.send('Event information updated.')
            console.log('Event information updated.')
        }
    });
});

//{DELETE} event
router.delete('/del/:evid', (req, res, next)=> {
    eventsModel.deleteOne({evid : parseInt(req.params.evid)}, (error, data)=>{
        if(error){
            return next(error);
        }else {
            //res.status(200).json({msg:data})
            res.send('deleted from db')
            console.log('deleted')
        }
    })
})



module.exports = router