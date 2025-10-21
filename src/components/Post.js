import "./Post.css"
import { getDatabase, ref, remove } from "firebase/database";
import app from "../fb/fbConfig.js";

const Post = ({ id, group, body, contact }) => {

    const handleDelete = (id) => {
        const db = getDatabase(app);
        const announcementRef = ref(db, `announcements/${id}`);
    
        remove(announcementRef)
          .catch((error) => {
            console.error("Error deleting announcement:", error);
          });
      };

    return (
        <div className="post" id={id}>
            <div className="info">
                <p className="post-group">{group}</p>
                <p className="post-body">{body}</p>
                <p className="post-contact">Contact <span className="post-email">{contact}</span> to learn more.</p>
            </div>
            <div class="material-symbols-rounded trash" onClick={() => handleDelete(id)}>delete</div>
        </div>

    )
}

export default Post