const express = require('express');
const axios = require('axios');
const app = express()


app.get('/', function(req, res) {
    axios
        .get('https://jsonplaceholder.typicode.com/todos?ID=12345')
        .then(function (response) {
            let dataFiltered = response.data;
            
            let newFiltered = dataFiltered.map(({id, title, completed}) => ({id, title, completed}));
            
            res.send(newFiltered);
        })
        .catch(function (error) {
        console.log(error);
        })
});

app.get('/user/:id', function(req, res){
    let one = `https://jsonplaceholder.typicode.com/users/${req.params.id}`;
    let two = 'https://jsonplaceholder.typicode.com/todos?ID=12345';

    const requestOne = axios.get(one);
    const requestTwo = axios.get(two);

    axios.all([requestOne, requestTwo])
        .then(axios.spread((...responses) => {
            const responseOne = responses[0].data
            const responseTwo = responses[1].data
            // const responseTwoSyncd = responseTwo.reduce(function(acc, curr){
            //                             if(curr.userId == req.params.id){acc = curr}
            //                         });
            const property = {}
            property.id = responseOne.id
            property.name = responseOne.name
            property.email = responseOne.email
            property.phone = responseOne.phone
            property.todos = []
            for(i = 0; i < responseTwo.length; i++){
                if(responseTwo[i].userId == req.params.id)
                property.todos[property.todos.length] = responseTwo[i];
            }

            res.send(property);
            // console.log(property.todos);
            // console.log(responseTwoSyncd);
        }))
        .catch(function (error) {
            console.log(error);
        })
        
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to ${port}......`));