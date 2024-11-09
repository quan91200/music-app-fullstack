import axios from 'axios'

const API_URL = 'http://localhost:8800/api'

// User API
export const fetchUserData = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/users/find/${userId}`)
        return response.data
    } catch (error) {
        throw new Error('Error fetching user data: ' + error.message)
    }
}

export const updateUserData = async (userId, data) => {
    try {
        const response = await axios.put(`${API_URL}/users`,
            { userId, ...data })
        return response.data
    } catch (error) {
        throw new Error('Error updating user data: ' + error.message)
    }
}

// Post API
export const fetchPosts = async () => {
    try {
        const response = await axios.get(`${API_URL}/posts`)
        return response.data
    } catch (error) {
        throw new Error('Error fetching posts: ' + error.message)
    }
}

export const addPost = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/posts`, data)
        return response.data
    } catch (error) {
        throw new Error('Error adding post: ' + error.message)
    }
}

export const deletePost = async (postId) => {
    try {
        const response = await axios.delete(`${API_URL}/posts/${postId}`)
        return response.data
    } catch (error) {
        throw new Error('Error deleting post: ' + error.message)
    }
}

// Relationship API
export const fetchRelationships = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/relationships/${userId}`)
        return response.data
    } catch (error) {
        throw new Error('Error fetching relationships: ' + error.message)
    }
}

// Like API
export const fetchLikes = async (postId) => {
    try {
        const response = await axios.get(`${API_URL}/likes?postId=${postId}`)
        return response.data
    } catch (error) {
        throw new Error('Error fetching likes: ' + error.message);
    }
}

export const addLike = async (postId) => {
    try {
        const response = await axios.post(`${API_URL}/likes`, { postId })
        return response.data
    } catch (error) {
        throw new Error('Error adding like: ' + error.message)
    }
}

export const deleteLike = async (postId) => {
    try {
        const response = await axios.delete(`${API_URL}/likes`,
            { data: { postId } })
        return response.data
    } catch (error) {
        throw new Error('Error deleting like: ' + error.message)
    }
}

// Story API
export const fetchStories = async () => {
    try {
        const response = await axios.get(`${API_URL}/stories`)
        return response.data
    } catch (error) {
        throw new Error('Error fetching stories: ' + error.message)
    }
}

export const addStory = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/stories`, data)
        return response.data
    } catch (error) {
        throw new Error('Error adding story: ' + error.message)
    }
}

export const deleteStory = async (storyId) => {
    try {
        const response = await axios.delete(`${API_URL}/stories/${storyId}`)
        return response.data
    } catch (error) {
        throw new Error('Error deleting story: ' + error.message)
    }
}

// Comment API
export const fetchComments = async (postId) => {
    try {
        const response = await axios.get(`${API_URL}/comments?postId=${postId}`)
        return response.data
    } catch (error) {
        throw new Error('Error fetching comments: ' + error.message)
    }
}

export const addComment = async (postId, commentData) => {
    try {
        const response = await axios.post(`${API_URL}/comments`,
            { postId, ...commentData })
        return response.data
    } catch (error) {
        throw new Error('Error adding comment: ' + error.message)
    }
}

export const deleteComment = async (commentId) => {
    try {
        const response = await axios.delete(`${API_URL}/comments/${commentId}`)
        return response.data
    } catch (error) {
        throw new Error('Error deleting comment: ' + error.message)
    }
}