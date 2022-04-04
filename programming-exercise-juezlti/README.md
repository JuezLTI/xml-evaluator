# Programming-exercise-juezlti
## _A simple and efficient way to represent YAPEXIL format as JS objects_

[![N|Solid](https://www.inesctec.pt/assets/images/logo-black.svg)](https://www.inesctec.pt/pt)


_YAPEXIL_ is a _JSON_ format in which the goal is to represent in an orthodoxy manner Programming exercises. This type of representation although efficient could sometimes lead to a complexity that can not be handled by a non-expert in this schema. Therefore this npm package focusing in:

- Facilitate serialization and deserialization
- Translation of YAPEXIL formatted exercises to JS object
- ✨ And more Magics ✨

## Examples
### Fetching remotely exercise 
For loading an exercise placed remotely on the internet do the following:
```js
loadSchemaYAPEXIL().then(() => {
    ProgrammingExercise.loadRemoteExercise(learningObject, {
       'BASE_URL': process.env.BASE_URL,
       'EMAIL': process.env.EMAIL,
       'PASSWORD': process.env.PASSWORD,
        }).then((programmingExercise) => {
            //...stuff
        })
})
```
First, it is necessary to load the schema to evaluate the JSON that will be fetched. The 'loadSchemaYAPEXIL' method does not generate overhead when called multiple times as this method implements a cache.
When the script knows the form of the YAPEXIL Schama it is possible to fetch an exercise in this format by doing 'ProgrammingExercise.loadRemoteExercise'. This method will then load an exercise remotely and expose the exercise as an instance of the ProgrammingExercise class.
### Fetching local exercise 
The ProgrammingExercise class besides making possible the fetch of remotely exercise also makes it possible to load exercise from your file system. To achieve this just do the following
```js
loadSchemaYAPEXIL().then(() => {
    ProgrammingExercise.deserialize(path_to_zip_folder_exercise), `${learningObject}.zip`)
    .then((programmingExercise) => {
            //...stuff
    }).catch((error) => {
            //...stuff
    })
})
```
### Persisting a remotely exercise 
When bandwidth savings or other reasons are needed to persist the exercise, this can be achieved by calling the serialization method on an instance of the Programming Exercise class
```js
programmingExercise.serialize(path_to_folder).then(() => {
    //...stuff
    }).catch((err) => {
    //...stuff
    });
})
```
### Creating an exercise programmatically 
In order to create an exercise programmatically, the user needs to have in his possession the correct values that fit the YAPEXIL schema. More information about the schema could be found at  [YAPEXIL Github](https://raw.githubusercontent.com/KA226-COVID/APIs/main/schemas/YAPEXIL/YAPEXIL.json)


## Installation
To install this package you just need to do

```sh
npm i programming-exercise-juezlti
```


## License

MIT

**Free Software, Hell Yeah!**


   
