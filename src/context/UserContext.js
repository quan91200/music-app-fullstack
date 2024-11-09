import React, { createContext, useReducer, useContext } from "react"
import * as api from "../api/api"

// Khởi tạo context
const UserWorkContext = createContext()

// Action types
const actionTypes = {
    SET_USER: "SET_USER",
    SET_POSTS: "SET_POSTS",
    SET_COMMENTS: "SET_COMMENTS",
    SET_LIKES: "SET_LIKES",
    SET_RELATIONSHIPS: "SET_RELATIONSHIPS",
}

// Reducer để cập nhật state
const userWorkReducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return { ...state, user: action.payload };
        case actionTypes.SET_POSTS:
            return { ...state, posts: action.payload };
        case actionTypes.SET_COMMENTS:
            return { ...state, comments: action.payload };
        case actionTypes.SET_LIKES:
            return { ...state, likes: action.payload };
        case actionTypes.SET_RELATIONSHIPS:
            return { ...state, relationships: action.payload };
        default:
            return state;
    }
}

// Provider component
export const UserWorkProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userWorkReducer, {
        user: null,
        posts: [],
        comments: [],
        likes: [],
        relationships: [],
    })

    // Hàm để lấy dữ liệu người dùng và cập nhật state
    const fetchUserData = async (userId) => {
        try {
            const data = await api.fetchUserData(userId);
            dispatch({ type: actionTypes.SET_USER, payload: data })
        } catch (error) {
            console.error("Error fetching user data:", error)
        }
    }

    // Hàm để lấy danh sách bài viết
    const fetchPosts = async () => {
        try {
            const data = await api.fetchPosts();
            dispatch({ type: actionTypes.SET_POSTS, payload: data })
        } catch (error) {
            console.error("Error fetching posts:", error)
        }
    }

    // Hàm để lấy danh sách bình luận
    const fetchComments = async (postId) => {
        try {
            const data = await api.fetchComments(postId)
            dispatch({ type: actionTypes.SET_COMMENTS, payload: data })
        } catch (error) {
            console.error("Error fetching comments:", error)
        }
    }

    // Hàm để lấy danh sách lượt thích
    const fetchLikes = async (postId) => {
        try {
            const data = await api.fetchLikes(postId);
            dispatch({ type: actionTypes.SET_LIKES, payload: data })
        } catch (error) {
            console.error("Error fetching likes:", error)
        }
    }

    // Hàm để lấy mối quan hệ
    const fetchRelationships = async (userId) => {
        try {
            const data = await api.fetchRelationships(userId)
            dispatch({ type: actionTypes.SET_RELATIONSHIPS, payload: data })
        } catch (error) {
            console.error("Error fetching relationships:", error)
        }
    }

    return (
        <UserWorkContext.Provider
            value={{
                state,
                fetchUserData,
                fetchPosts,
                fetchComments,
                fetchLikes,
                fetchRelationships,
            }}
        >
            {children}
        </UserWorkContext.Provider>
    )
}

// Custom hook để sử dụng context dễ dàng
export const useUserWork = () => {
    return useContext(UserWorkContext)
}