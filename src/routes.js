const express = require('express') //express é uma biblioteca para criar um servidor
const routes = express.Router() //routes cria os caminhos 
const ProfileController = require('./controllers/ProfileController')




const Job = {
    data: [
        
            {   
                id: 1,
                name: "Pizzaria Guloso",
                "daily-hours": 2,
                "total-hours": 60,
                createdAt: Date.now()
            

            },
            {   
                id: 2,
                name: "OneTwo Guloso",
                "daily-hours": 3,
                "total-hours": 47,
                createdAt: Date.now()
                 
            }
        
    ],   
    controllers:{
        index (req, res){

            const updatedJob = Job.data.map((job) => {
               
               
                   const remaining = Job.services.remainingDays(job)
                   const status = remaining <= 0 ? 'done' : 'progress'
                   
                   return {
                       ...job,
                       remaining,
                       status,
                       budget: Job.services.calculateBudget(job,Profile.data["value-hour"])
                   }
               })    
                
               return res.render("index", {jobs:updatedJob})
               
               
        },
        create(req,res){
            return res.render("job")
          },
      
          save(req,res){
              const job = req.body
              job.createdAt = Date.now() //atribuindo uma nova data
      
          const lastId = Job.data[Job.data.length - 1] ?.id || 0;
      
          Job.data.push({
              id: lastId +1,
              name: req.body.name,
              "daily-hours": req.body["daily-hours"],
              "total-hours": req.body["total-hours"],
              createdAt: Date.now()    
      
          })
          return res.redirect('/')
        
        },

        show(req,res){
        
            const jobId = req.params.id
            
            const job = Job.data.find(job => Number(jog.id) === Number(jobId))

            if(!job){
                return res.send('Job not found!')
            }

            job.budget = Job.services.calculateBudget(job,Profile.data["value-hour"])

            return res.render("job-edit", {job})


            


        },
        update(req,res){
            const jobId = req.params.id
            
            const job = Job.data.find(job => Number(job.id) === Number(jobId))

            if(!job){
                return res.send('Job not found!')
            }
            const updatedJob ={
                ...job,
                name: req.body.name,
                "total-hours": req.body["total-hours"],
                "daily-hours": req.body["daily-hours"],
            }

            Job.data = Job.data.map(job => {
                if (Number(job.id) === Number(jobId)){
                    job = updatedJob
                }
                return job
            })
            res.redirect('/job/' + jobId)

        },
        delete(req,res){
            const jobId = req.params.id

            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))

            return res.redirect('/')
        }
    
    },

   

    services:{
        remainingDays(job){
            //calculo do tempo restante
            const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed()
         
            const createdDate = new Date(job.createdAt)
            const dueDay = createdDate.getDate() + Number(remainingDays)
            const dueDateInMs = createdDate.setDate(dueDay)
        
            const timeDiffInMs = dueDateInMs - Date.now()
            //transformar mili em dias
            const dayInMs = 1000 * 60 * 60 * 24
            const dayDiff = Math.floor(timeDiffInMs / dayInMs)
        
            //restam x dias
            return dayDiff
        
        },
        calculateBudget: (job,valueHour) => valueHour * job["total-hours"]
    }
}   
    

routes.get('/', Job.controllers.index)
routes.get('/job', Job.controllers.create)
routes.post('/job', Job.controllers.save)
routes.get('/job/:id', Job.controllers.show)
routes.post('/job/:id', Job.controllers.update)
routes.post('/job/delete/:id', Job.controllers.delete)
routes.get('/profile', ProfileController.index)
routes.post('/profile', ProfileController.update)


module.exports = routes 