import React, { useState, useEffect } from "react"
import axios from "axios"
import CommentList from "./CommentList"
import CommentCreate from "./CommentCreate"

const PostList = () => {
    const [posts, setPosts] = useState([])
    
    const fetchPosts = async () => {
        const res = await axios.get("http://posts.com/posts")
    
        setPosts(res.data)
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    const renderedPosts = Object.values(posts).map((post) => {
        return (
            <div className="col-md-3 mb-2" key={post.id}>
                <div className="card">
                    <div className="card-body">
                        <h2>{post.title}</h2>
                        <CommentList comments={post.comments} />
                        <CommentCreate postId={post.id} />
                    </div>
                </div>
            </div>
        )
    })
    return (
        <div className="row">{renderedPosts}</div>
    )
}

export default PostList