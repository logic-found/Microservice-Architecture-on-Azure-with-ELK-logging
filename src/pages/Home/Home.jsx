import React, { useState, useEffect} from "react";
import "./Home.scss";
import { FaPlus as Plus } from "react-icons/fa";
import NoteCard from "../../component/NoteCard/NoteCard";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import toast from 'react-hot-toast';
import CreateNoteForm from "../../component/NoteForm/CreateNoteForm";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotes } from '../../slice/NotesSlice'
import { setAuth } from '../../slice/UserSlice'


const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const allNotes = useSelector((state) => state.notes.allNotes)
  const [openModal, setOpenModal] = useState(false);


  const getAllNotesFun = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) navigate('/signIn')
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/notesFunction/getAllNotes`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      dispatch(getAllNotes(response.data))
      dispatch(setAuth(true))
    }
    catch (err) {
      if (err.code === "ERR_NETWORK") {
        navigate('/signIn')
        toast.error("Server connection error")
      }
      else if (err.response?.status === 401) {   // if json error than navigate to login page
        toast.error("Please login to access this resource")
        navigate('/signIn')
      }
      else if(err.response?.data?.err){   
        toast.error(err.response?.data?.err?.message || "Internal Server Error")
      }
      console.log(err)
    }
  }

  
  useEffect(() => {
    getAllNotesFun();
  }, [dispatch])


  return (
    <>
      <div className="home">
        <div className="homeContent">

          <div className="createNewContent" onClick={() => setOpenModal(true)}>
            <div className="createNewIcon">
              <Plus />
            </div>
            <div className="createNew">Create New Notes</div>
          </div>
          <div className="notesContent">
            {allNotes?.map((note, index) => (
              <NoteCard key={index} id={(note._id)? note._id:null} title={note.title} description={note.description} color={note.color}/>
            ))}
          </div>
        </div>
      </div>
      {openModal &&
        <CreateNoteForm openModal={openModal} setOpenModal={setOpenModal}/>
      }
    </>
  );
};

export default Home;
