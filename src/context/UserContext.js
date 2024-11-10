import React, { createContext, useReducer, useContext } from "react"
import api from "../api/api.js"

// Khởi tạo context
const UserWorkContext = createContext()

// Action types
const actionTypes = {
    SET_USER: "SET_USER",
    SET_POSTS: "SET_POSTS",
    SET_COMMENTS: "SET_COMMENTS",
    SET_LIKES: "SET_LIKES",
    SET_RELATIONSHIPS: "SET_RELATIONSHIPS",
    ADD_ITEM: "ADD_ITEM", // Dùng chung cho các item: post, comment, like, relationship
    UPDATE_ITEM: "UPDATE_ITEM", // Dùng chung cho các item
    DELETE_ITEM: "DELETE_ITEM", // Dùng chung cho các item
    SET_ERROR: "SET_ERROR",
    SET_LOADING: "SET_LOADING", // Thêm trạng thái loading
}

// Reducer để cập nhật state
const userWorkReducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return { ...state, user: action.payload }
        case actionTypes.SET_POSTS:
            return { ...state, posts: action.payload }
        case actionTypes.SET_COMMENTS:
            return { ...state, comments: action.payload }
        case actionTypes.SET_LIKES:
            return { ...state, likes: action.payload }
        case actionTypes.SET_RELATIONSHIPS:
            return { ...state, relationships: action.payload }
        case actionTypes.ADD_ITEM:
            return {
                ...state,
                [action.payload.type]: [...state[action.payload.type], action.payload.data]
            }
        case actionTypes.UPDATE_ITEM:
            return {
                ...state,
                [action.payload.type]: state[action.payload.type].map(item =>
                    item.id === action.payload.data.id ? action.payload.data : item
                ),
            }
        case actionTypes.DELETE_ITEM:
            return {
                ...state,
                [action.payload.type]: state[action.payload.type]
                    .filter(item => item.id !== action.payload.id),
            }
        case actionTypes.SET_ERROR:
            return { ...state, error: action.payload }
        case actionTypes.SET_LOADING:
            return { ...state, isLoading: action.payload }
        default:
            return state
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
        isLoading: false,
        error: null,
    })

    // Hàm để gọi API và dispatch action
    const fetchData = async (actionType, apiCall, payload = {}) => {
        try {
            dispatch({ type: actionTypes.SET_LOADING, payload: true })
            const data = await apiCall(payload)
            dispatch({ type: actionType, payload: data })
        } catch (error) {
            dispatch({ type: actionTypes.SET_ERROR, payload: error.message })
        } finally {
            dispatch({ type: actionTypes.SET_LOADING, payload: false })
        }
    };

    // Gọi API và dispatch action cho các dữ liệu
    const fetchUserData = (userId) =>
        fetchData(actionTypes.SET_USER, api.fetchUserData, userId)
    const fetchPosts = () =>
        fetchData(actionTypes.SET_POSTS, api.fetchPosts)
    const fetchComments = (postId) =>
        fetchData(actionTypes.SET_COMMENTS, api.fetchComments, postId)
    const fetchLikes = (postId) =>
        fetchData(actionTypes.SET_LIKES, api.fetchLikes, postId)
    const fetchRelationships = (userId) =>
        fetchData(actionTypes.SET_RELATIONSHIPS, api.fetchRelationships, userId)

    // Hàm thêm, cập nhật, xóa chung cho các item
    const addItem = (type, newItem) =>
        fetchData(actionTypes.ADD_ITEM, api[`add${type}`], newItem)
    const updateItem = (type, updatedItem) =>
        fetchData(actionTypes.UPDATE_ITEM, api[`update${type}`], updatedItem)
    const deleteItem = (type, itemId) =>
        fetchData(actionTypes.DELETE_ITEM, api[`delete${type}`], itemId)

    return (
        <UserWorkContext.Provider
            value={{
                state,
                fetchUserData,
                fetchPosts,
                fetchComments,
                fetchLikes,
                fetchRelationships,
                addItem,
                updateItem,
                deleteItem,
            }}
        >
            {children}
        </UserWorkContext.Provider>
    )
}

export const useUserWork = () => {
    return useContext(UserWorkContext)
}