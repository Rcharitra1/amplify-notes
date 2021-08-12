import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {API, graphqlOperation} from 'aws-amplify'
import {createNote, deleteNote, updateNote} from '../../graphql/mutations';

import { listNotes } from '../../graphql/queries';
// import {onCreateNote} from '../../graphql/subscriptions';

const HomePageStyled = styled.div`
    header{
        background-color: lightpink;
        padding:2rem;

    }
    h1{
        text-align: center;
        color:white;
    }
    form{
        margin-bottom: 1.5rem;
        margin-left:0.5rem;
        margin-right:0.5rem;
        display: flex;
        justify-content: center;
        padding:1rem;
        flex-direction: column;

    }
    input{
        padding:1rem 0.5rem;
        border-radius: 6px;
        border:none;
        box-shadow: 1px 1px 0 0 lightgray;
        flex:1;
        border-bottom:0.5px solid black;

    }
    button{
        padding:0.5rem;
        border-radius: 6px;
        box-shadow: 1px 1px 0 0 lightgrey;
        margin:0.5rem 0;
        background-color: lightgreen;
        color:white;
        font-weight: bold;
        border-color: lightgreen;
    }
    button:hover{
        color:lightgreen;
        background-color: white;
    }
    ul{
        list-style: none;
        text-align: center;
        padding:0;
        margin:0;
        margin: 0 0.5rem;
    }
    li{
        padding:0.5rem;
        border-radius: 6px;
        box-shadow: 2px 2px 0 0 lightgrey;
        margin:0.5rem 1rem;
        background-color: salmon;
        color:white;
        font-weight: bold;
        border-color: salmon;
        display: flex;
        justify-content: center;
        align-items: center;

    }
    li>*{
        margin:0 0.5rem;
    }

    li>button{
        background-color: red;
        border-color: red;
    }
    li>button:hover{
        background-color: white;
        color:red;
    }
    .error{
        color:red;
        font-size: 0.8rem;
    }
    .clear{
        background-color: skyblue;
        box-shadow: 1px 1px 0 0 skyblue;
        border-color: skyblue;
    }
    .clear:hover{
        color:skyblue
    }
`;


const HomePage = (props)=>{
    const [notes, setNotes ]=useState([]);
    const [note, setNote]=useState('');
    const [error, setError]=useState('');
    const [noteId, setNoteId]=useState('');

    const getNotes = (async()=>{
        
        const getAll=await API.graphql(graphqlOperation(listNotes));

        // console.log(getAll);
        setNotes(getAll.data.listNotes.items)

        // console.log();

    //  await API.graphql(graphqlOperation(onCreateNote)).subscribe({
    //         next: noteData=>{
    //             // console.log(noteData)

    //             const newNote = noteData.value.data.onCreateNote;
    //             // console.log(newNote)
    //             // const prevNotes = notes.filter((item) => item.id!==newNote.id);

    //             // console.log(prevNotes);
    //             const copyNotes = [...notes];
    //             console.log(copyNotes)
    //             const updatedNotes = [newNote, ...copyNotes];
    //             setNotes(updatedNotes)
    //             // console.log(notes)
    //         }
    //     })
    })

    const handleDeleteNote = async(id)=>{
        if(window.confirm('Are you sure you want to delete this note?'))
        {
           

       
            const res=await API.graphql(graphqlOperation(deleteNote, {input:{id: id}}))
            const deleteId = res.data.deleteNote.id;

            const filtredArray = notes.filter(item=> item.id!==deleteId);
            setNotes(filtredArray);
            handleClearInput();
        }else
        {
            return;
        }
        
    }

    const handleEditNote = async(item)=>{
        setNote(item.note);
        setNoteId(item.id);

    }

    useEffect(()=>{
        getNotes();

        //  const createNoteListner=API.graphql(graphqlOperation(onCreateNote)).subscribe({
        //     next: noteData=>{
        //         // console.log(noteData)

        //         const newNote = noteData.value.data.onCreateNote;
        //         // const prevNotes = notes.filter((item) => item.id!==newNote.id);

             
        //         // const updatedNotes = [...prevNotes, newNote];
        //         // setNotes(updatedNotes)
        //         // // console.log(notes)

        //         setNotes(prevNotes =>{
        //             const olNotes = prevNotes.filter(note=> note.id!==newNote.id)

        //             console.log(prevNotes);

        //             const updatedNote = [...olNotes, newNote];
        //             return updatedNote;
        //         })
        //     }
        // })

        // return ()=>{
        //     createNoteListner.unsubscribe();
        // }
    }, [])

    const handleChangeNote = (e)=>{
        e.preventDefault();
        setNote(e.target.value);
        // console.log(note);
    }

    const handleAddNote = async(e)=>{
        e.preventDefault();
        setError('');

        if(note.trim().length!==0)
        {
            if(noteId.trim().length===0)
            {
                //add
                const res =await API.graphql(graphqlOperation(createNote, {input:{note}}))
         
                const newNote = {
                    id: res.data.createNote.id,
                    note:res.data.createNote.note
                };
    
                const addNotes = [...notes];
                addNotes.unshift(newNote);
                setNotes(addNotes);
            }else
            {
                //update

                const response = await API.graphql(graphqlOperation(
                    updateNote, {input:{id:noteId, note:note}}));

                // console.log(response.data.updateNote);

                const updatedNote = {
                    id:response.data.updateNote.id,
                    note: response.data.updateNote.note
                };

                let updatedArray = [...notes];
                const indexToUpdate = updatedArray.findIndex((item)=>item.id===updatedNote.id);
                // console.log(indexToUpdate);

                updatedArray[indexToUpdate]=updatedNote;

                setNotes(updatedArray);
                
            }

            setNoteId('');

            setNote('');
        }else
        {
            setError('Provide a valid input for note text');
        }
        

    }

    const handleClearInput = ()=>{
        setError('');
        setNoteId('');
        setNote('');
    }
    return (
        <HomePageStyled>
        <header>
        <h1>Amplify Note Taking App</h1>
        </header>
        <form onSubmit={handleAddNote}>
        <input type='text' 
        value={note} onChange={handleChangeNote}
        
        placeholder='enter notes here'/>
        {error.length!==0 && <p className='error'>{error}</p>}
        <button type='submit'>{noteId.length!==0?'Update Note': 'Add Note'}</button>
        <button type='button' className='clear' onClick={()=>handleClearInput()}>Clear</button>
        </form>

        <ul>
        {
           notes.length>0 ? notes.map((item)=>{
                return <li onClick={handleEditNote.bind(this, item)} key={item.id}>
                <p>{item.note}</p><button type='button' onClick={handleDeleteNote.bind(this, item.id)}>&times;</button>
                </li>
            }):
            <li>No Notes to display</li>
        }
        </ul>
        
        </HomePageStyled>
    );
}


export default HomePage;