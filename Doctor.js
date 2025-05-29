const express = require("express");
app = express();
app.use(express.json());
const user = [{
  Name : "John" , 
  kidneys : [{healthy : false},
    {healthy : true}]
}]

app.get("/" , function(req,res){
  const johnkidney = user[0].kidneys;
  const numberofkidney = johnkidney.length;
  let numberofHealthyKidney = 0 ;
  for(let i = 0 ; i < johnkidney.length ; i++){
    if(johnkidney[i].healthy){
      numberofHealthyKidney++;
    }
  }
  const numberofUnhealthykidney = numberofkidney - numberofHealthyKidney;
  res.json({
    numberofkidney,
    numberofHealthyKidney,
    numberofUnhealthykidney
  })
})
app.post("/" , function(req,res){
  const isHealthy = req.body.isHealthy;
  user[0].kidneys.push({
    healthy : isHealthy
  })
  res.json({
    msg : "done!"
  })
})
function isthereatleastoneunhealthykidney(){
  for(let i = 0 ; i < user[0].kidneys.length;i++){
    if(user[0].kidneys[i].healthy == false){
      return true;
    }
  }
  return false;
}
app.delete("/" , function(req,res){
  if(isthereatleastoneunhealthykidney()){
    const newKidneys = [];
    for(let i = 0 ; i < user[0].kidneys.length ; i++){
      if(user[0].kidneys[i].healthy){
        newKidneys.push({
          healthy : true
        })
      }
    }
    user[0].kidneys = newKidneys;
    res.json({msg : "done!"});
  }else{
    res.status(411).json({
      msg:"YOU have no Bad Kidneys"
    });
  }
})

app.put("/", function(req, res){
  for(let i = 0 ; i < user[0].kidneys.length ; i++){
    user[0].kidneys[i].healthy = true;
  }
  res.json({});
})
app.listen(3000);
