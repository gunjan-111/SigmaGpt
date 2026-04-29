import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";
import API from "./api";
import logo from "./assets/blacklogo.png";

function Sidebar({ isOpen, onClose }) {   // ← ADD isOpen, onClose props
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API}/api/thread`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            setAllThreads(filteredData);
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId])

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
        onClose(); // ← close sidebar on mobile
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API}/api/thread/${newThreadId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const res = await response.json();
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
            onClose(); // ← close sidebar on mobile
        } catch(err) {
            console.log(err);
        }
    }

    const deleteThread = async (threadId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API}/api/thread/${threadId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const res = await response.json();
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            if(threadId === currThreadId) createNewChat();
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <>
            {/* Dark overlay on mobile */}
            <div className={`overlay ${isOpen ? "show" : ""}`} onClick={onClose}></div>

            <section className={`sidebar ${isOpen ? "open" : ""}`}>
                <button onClick={createNewChat}>
                    <img src={logo} alt="gpt logo" className="logo" />
                    <span><i className="fa-solid fa-pen-to-square"></i></span>
                </button>

                <ul className="history">
                    {
                        allThreads?.map((thread, idx) => (
                            <li key={idx}
                                onClick={() => changeThread(thread.threadId)}
                                className={thread.threadId === currThreadId ? "highlighted" : " "}
                            >
                                {thread.title}
                                <i className="fa-solid fa-trash"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteThread(thread.threadId);
                                    }}
                                ></i>
                            </li>
                        ))
                    }
                </ul>

                <div className="sign">
                    <p>By ApnaCollege &hearts;</p>
                </div>
            </section>
        </>
    )
}

export default Sidebar;