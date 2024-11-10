import React, { useState} from 'react'
import './NoteForm.scss'
import Modal from "@mui/material/Modal";
import axios from 'axios'
import { IoIosCloseCircle as Close } from "react-icons/io";
import { AiFillCheckCircle as Check } from "react-icons/ai";
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { updateNote } from '../../slice/NotesSlice'

const UpdateNoteForm = ({ openModal, setOpenModal, id, title, description, color}) => {
    const dispatch = useDispatch()
    const [updatedTitle, seUpdatedTitle] = useState(title)
    const [updatedDescription, setUpdatedDescription] = useState(description)
    const [updatedColor, setUpdatedColor] = useState(color);
    const colorPalate = [
        "#B4F8C8",
        "lightgray",
        "#FFAEBC",
        "coral",
        "#FBE7C6",
        "#A0E7E5",
    ];


    const updateNoteFun = async (e) => {
        try {
            e.preventDefault();
            const token = localStorage.getItem('token')
            if (!token) {
                navigate('/signIn')
                return
            }
            else if (!updatedTitle || !updatedDescription) {
                toast.error("Please enter a Title and Description")
                return
            }
            const response = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/notesFunction/updateNote/${id}`, { title: updatedTitle, description: updatedDescription, color: updatedColor }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success("Note updated!")
            dispatch(updateNote(response.data))

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
                    <form action="" className="form" onSubmit={(e) => updateNoteFun(e)}>
                        <div className="inputTitleDiv">
                            <input
                                type="text"
                                name="title"
                                id=""
                                className="inputField title"
                                placeholder="Title"
                                value={updatedTitle}
                                onChange={(e) => seUpdatedTitle(e.target.value)}
                            />
                            <div className="inputFormIcon">
                                <Check onClick={(e) => updateNoteFun(e)} /> <Close onClick={closeModal} />
                            </div>
                        </div>

                        <div className="inputColorDiv">
                            <p className='inputColor-content'>choose color:</p>
                            <div className="inputColor-block">
                                {colorPalate.map((c, index) => (
                                    <span className="inputColor" style={{ backgroundColor: c, border: `${c === updatedColor ? '2px solid black' : '1px solid black'}` }} onClick={() => setUpdatedColor(c)} key={index}></span>
                                ))
                                }
                            </div>
                        </div>


                        <textarea
                            name="desc"
                            id=""
                            className="inputField desc"
                            placeholder="Write Something..."
                            value={updatedDescription}
                            rows={10}
                            onChange={(e) => setUpdatedDescription(e.target.value)}
                        />
                    </form>
                </div>
            </div>
        </Modal>
    )
}

export default UpdateNoteForm