import React , {useState}from 'react'
import './NoteCard.scss'
import {FiEdit as Edit} from 'react-icons/fi'
import {AiOutlineDelete as Delete} from 'react-icons/ai'
import axios from 'axios'
import toast from 'react-hot-toast';
import UpdateNoteForm from '../NoteForm/UpdateNoteForm'
import { useDispatch, useSelector } from "react-redux";
import { deleteNote } from '../../slice/NotesSlice'

const NoteCard = ({id, title, description, color}) => {
  const dispatch = useDispatch()
  const [openModal, setOpenModal] = useState(false);  
  
  
  const deleteNoteFun = async (e) => {
    try{
      e.preventDefault();
      const token = localStorage.getItem('token')
      if(!token) navigate('/signIn')
      const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/notesFunction/deleteNote/${id}`, {
        headers : {
          Authorization : `Bearer ${token}`
        }
      })
      toast.success("Note deleted!")
      dispatch(deleteNote(response.data))
    }
    catch(err){
      if (err.code === "ERR_NETWORK") {
        navigate('/signIn')
        toast.error("Server connection error")
      }
      else if(err.response?.status === 401){   // if json error than navigate to login page
        toast.error("Please login to access this resource")
        navigate('/signIn')
      }
      else if(err.response?.data?.err){  
        toast.error(err.response?.data?.err?.message || "Internal Server Error")
      }
      console.log(err)
    }
  }

  return (
    <>
    <div className="noteCard" style={{'backgroundColor': `${color}`}}>
        <div className="noteCard-Title">{title}</div>
        <div className="noteCard-Desc">{description}</div>
        <div className="noteCard-IconDiv">
          <div className="noteCard-Icon" onClick={() => setOpenModal(true)}><Edit /></div>
          <div className="noteCard-Icon" onClick={(e) => deleteNoteFun(e)}><Delete /></div>
        </div>
    </div>
    {openModal && <UpdateNoteForm openModal={openModal} setOpenModal={setOpenModal} id={id} title={title} description={description} color={color}/>}
    </>
  )
}

export default NoteCard