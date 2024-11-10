/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios'

const API_URL = 'http://localhost:8800/api'

// Hàm lấy dữ liệu người dùng
export const fetchUserData = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/users/${userId}`)
        return response.data
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message)
    }
}

// Hàm lấy danh sách bài viết
export const fetchPosts = async () => {
    try {
        const response = await axios.get(`${API_URL}/posts`)
        return response.data
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message)
    }
}

// Hàm lấy bình luận của một bài viết
export const fetchComments = async (postId) => {
    try {
        const response = await axios.get(`${API_URL}/posts/${postId}/comments`)
        return response.data
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message)
    }
}

// Hàm lấy lượt thích của một bài viết
export const fetchLikes = async (postId) => {
    try {
        const response = await axios.get(`${API_URL}/posts/${postId}/likes`)
        return response.data
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message)
    }
}

// Hàm lấy mối quan hệ người dùng
export const fetchRelationships = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/users/${userId}/relationships`)
        return response.data
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message)
    }
}

// Hàm thêm bài viết
export const addPost = async (newPost) => {
    try {
        const response = await axios.post(`${API_URL}/posts`, newPost)
        return response.data
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message)
    }
}

// Hàm cập nhật bài viết
export const updatePost = async (updatedPost) => {
    try {
        const response = await axios.put(`${API_URL}/posts/${updatedPost.id}`, updatedPost)
        return response.data
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message)
    }
}

// Hàm xóa bài viết
export const deletePost = async (postId) => {
    try {
        await axios.delete(`${API_URL}/posts/${postId}`)
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message)
    }
}

// Hàm thêm bình luận
export const addComment = async (newComment) => {
    try {
        const response = await axios.post(`${API_URL}/comments`, newComment)
        return response.data
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message)
    }
}

// Hàm cập nhật bình luận
export const updateComment = async (updatedComment) => {
    try {
        const response = await axios.put(`${API_URL}/comments/${updatedComment.id}`, updatedComment)
        return response.data
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message)
    }
}

// Hàm xóa bình luận
export const deleteComment = async (commentId) => {
    try {
        await axios.delete(`${API_URL}/comments/${commentId}`)
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message)
    }
}

// Hàm thêm like
export const addLike = async (newLike) => {
    try {
        const response = await axios.post(`${API_URL}/likes`, newLike)
        return response.data
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message)
    }
}

// Hàm xóa like
export const deleteLike = async (likeId) => {
    try {
        await axios.delete(`${API_URL}/likes/${likeId}`)
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message)
    }
}

// Hàm thêm mối quan hệ
export const addRelationship = async (newRelationship) => {
    try {
        const response = await axios.post(`${API_URL}/relationships`, newRelationship)
        return response.data
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message)
    }
}

// Hàm xóa mối quan hệ
export const deleteRelationship = async (relationshipId) => {
    try {
        await axios.delete(`${API_URL}/relationships/${relationshipId}`)
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message)
    }
}

export default {
    fetchUserData,
    fetchPosts,
    fetchComments,
    fetchLikes,
    fetchRelationships,
    addPost,
    updatePost,
    deletePost,
    addComment,
    updateComment,
    deleteComment,
    addLike,
    deleteLike,
    addRelationship,
    deleteRelationship,
}
