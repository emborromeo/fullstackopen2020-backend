const { request } = require('express');
const express= require('express');
const app= express();
const morgan = require("morgan");
app.use(express.json());


 //logging to cmd
morgan.token('data', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status  :res[content-length] - :response-time ms :data '))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]
//SHOW COMPLETE
app.get('/api/persons', (request, response) => {
  response.json(persons);
  console.log(persons);
})

//step5
const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }
  
// ADD  PERSON
app.post('/api/persons', (request, response) => {
    const body = request.body;
    const personDuplicate = persons.find(person => person.name === body.name);

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
    
   }
   //cheking if the added name is duplicate
   if (personDuplicate) {
     return response.status(409).json({
        error: 'name must be unique',
     });
          
    }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
    
  }

  persons = persons.concat(person);

  response.json(person)
})
//step3  SHOW BY ID
app.get('/api/persons/:id', (request, response) => {    
    const id = Number(request.params.id)
    console.log(id);
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
  })

//step2 SHOW INFO
app.get('/info', (request, response) => {
    const personsLength=persons.length;
    console.log(personsLength);
    response.send(`
    <p>Phonebook has info for ${personsLength} people</p>
    <p>${new Date()}</p>
    `);
  
})

//step4 DELETE
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.filter(person => person.id !== id) 
    response.send('Got a DELETE request at /user')
 
    response.status(204).end();
      
  })


  const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`)
})