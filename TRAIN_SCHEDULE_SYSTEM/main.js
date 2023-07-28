const express = require('express');
const app = express();
const axios = require('axios');
const port = 3000; 

app.use(express.json());

const authLink="http://20.244.56.144/train/auth";
const getTrainDetail="http://20.244.56.144/train/trains";
const clientData={
    "companyName": "Train west Central",
    "clientID": "46ead45c-8e39-45d1-baa0-c68d79a0429f",
    "clientSecret": "zIfnZAzmsQnELWjX",
    "ownerName": "Sandeep Kumar Jha",
    "ownerEmail": "sjha0766@gmail.com",
    "rollNo": "07620802820"
}

 app.get('/trains', async(req, res) => {

  const authKey = await axios.post(authLink, clientData);
  const trainData =  await axios.get(getTrainDetail, {
    headers: {
        Authorization: `Bearer ${authKey.data.access_token}`,
      },
   });


    const relevantTrains = trainData.data.filter((train) => {
    const timeDifference= train.departureTime.Hours*60 + train.departureTime.Minutes;
    return timeDifference > 30;
    });
    relevantTrains.sort((a, b) => {
    if (a.price.sleeper === b.price.sleeper) {
        if (a.seatsAvailable.sleeper === b.seatsAvailable.sleeper) {
        return new Date(b.departureTime) - new Date(a.departureTime);
        }
        return b.seatsAvailable.sleeper - a.seatsAvailable.sleeper;
    }
    return a.price.sleeper - b.price.sleeper;
    });
 
  return res.json(relevantTrains);
});

app.get('/trains/:number', async (req, res) =>{
    const authKey = await axios.post(authLink, clientData);
    const trainData =  await axios.get(getTrainDetail, {
    headers: {
        Authorization: `Bearer ${authKey.data.access_token}`,
      },
    });

    const data =trainData.data.find(train => train.trainNumber==req.params.number);
    if(data==null)return res.json({Error:"your train Number doesn't found"})
    return res.json(data);

});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});