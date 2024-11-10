import React, { useState} from 'react'
import './NoteForm.scss'
import Modal from "@mui/material/Modal";
import axios from 'axios'
import { IoIosCloseCircle as Close } from "react-icons/io";
import { AiFillCheckCircle as Check } from "react-icons/ai";
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { addNote } from '../../slice/NotesSlice'

const CreateNoteForm = ({ openModal, setOpenModal }) => {
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('');
  const colorPalate = [
    "#B4F8C8",
    "lightgray",
    "#FFAEBC",
    "coral",
    "#FBE7C6",
    "#A0E7E5",
  ];


  const addNoteFun = async (e) => {
    try {
      e.preventDefault();
      const token = localStorage.getItem('token')
      if (!token){
        navigate('/signIn')
        return
      }
      else if(!title || !description){
        toast.error("Please enter a Title and Description")
        return
      } 

      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/notesFunction/addNote`, { title, description, color}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success("Note saved!")
      setOpenModal(false)
      dispatch(addNote(response.data))
    }
    catch (err) {
      if (err.code === "ERR_NETWORK") {
        navigate('/signIn')
        toast.error("Server connection error")
      }
      else if (err.response?.status === 401) {   // if json error than navigate to login page
        toast.success("Please login first")
        navigate('/signIn')
      }
      else if(err.response?.data?.err){  
        toast.error(err.response?.data?.err?.message || "Internal Server Error")
      }
      console.log(err)
    }
  }
  const closeModal = () => {
    setOpenModal(false)
  }



  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="noteForm">
        <div className="noteForm-Content">
          <form action="" className="form" onSubmit={(e) => addNoteFun(e)}>
            <div className="inputTitleDiv">
              <input
                type="text"
                name="title"
                id=""
                className="inputField title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="inputFormIcon">
                <Check onClick={(e) => addNoteFun(e)} /> <Close onClick={closeModal} />
              </div>
            </div>


            <div className="inputColorDiv">
              <p className='inputColor-content'>choose color:</p>
              <div className="inputColor-block">
              {colorPalate.map((c, index)=> (
                  <span className="inputColor" style={{backgroundColor: c, border:`${c === color? '2px solid black':'1px solid black' }` }} onClick={() => setColor(c)} key={index}></span>
              ))
              }
              </div>
            </div>


            <textarea
              name="desc"
              id=""
              className="inputField desc"
              placeholder="Write Something..."
              value={description}
              rows={10}
              onChange={(e) => setDescription(e.target.value)}
            />
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default CreateNoteForm