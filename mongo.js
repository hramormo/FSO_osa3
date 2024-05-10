const mongoose = require('mongoose')



const password = process.argv[2]

const url = `mongodb+srv://sekinviela:${password}@fsocluster.xrv5cqh.mongodb.net/puhelinluettelo?retryWrites=true&w=majority&appName=FSOcluster`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

const newName = process.argv[3]
const newNumber = process.argv[4]

const person = new Person({})

if (process.argv.length<4){
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}
else if (process.argv.length<6){
    const newName = process.argv[3]
    const newNumber = process.argv[4]

    const person = new Person({
        name: `${newName}`,
        number: `${newNumber}`
    })

    person.save().then(result => {
        console.log(`added ${newName} number ${newNumber} to phonebook `)
        mongoose.connection.close()
    })

}