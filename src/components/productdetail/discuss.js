import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const Discuss = () => {
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussion, setNewDiscussion] = useState('');
  const [replyMessages, setReplyMessages] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editMessage, setEditMessage] = useState('');
  
  const { productId } = useParams();
  const { isAuthenticated, token, user } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const isBuyer = user?.role === 'buyer';
  const isSeller = user?.role === 'seller';

  // Fungsi untuk mendapatkan userId dari discussion
  const getUserIdFromDiscussion = (discussion) => {
    return discussion?.userId?._id || 'Unknown';
  };

  // Bungkus fetchDiscussions dengan useCallback
  const fetchDiscussions = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/discuss/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDiscussions(response.data.discussions);
    } catch (error) {
      console.error('Error fetching discussions:', error);
      toast.error('Failed to load discussions');
    }
  }, [productId, token, apiUrl]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDiscussions();
    }
  }, [isAuthenticated, fetchDiscussions]);

  // Pisahkan handler untuk new discussion dan reply
  const handleNewDiscussion = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to participate in discussions');
      return;
    }

    if (!isBuyer) {
      toast.error('Only buyers can start new discussions');
      return;
    }

    try {
      await axios.post(
        `${apiUrl}/discuss/add/${productId}`,
        {
          chat: newDiscussion,
          replyId: null
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setNewDiscussion('');
      fetchDiscussions();
      toast.success('Discussion posted successfully');
    } catch (error) {
      toast.error('Failed to post discussion');
    }
  };

  const handleReply = async (e, discussionId) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to participate in discussions');
      return;
    }

    try {
      await axios.post(
        `${apiUrl}/discuss/add/${productId}`,
        {
          chat: replyMessages[discussionId] || '',
          replyId: discussionId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setReplyMessages(prev => ({
        ...prev,
        [discussionId]: ''
      }));
      fetchDiscussions();
      toast.success('Reply posted successfully');
    } catch (error) {
      toast.error('Failed to post reply');
    }
  };

  const handleReplyChange = (discussionId, value) => {
    setReplyMessages(prev => ({
      ...prev,
      [discussionId]: value
    }));
  };

  const handleEdit = async (discussId) => {
    if (!isBuyer) {
      toast.error('Only buyers can edit messages');
      return;
    }

    try {
      await axios.put(
        `${apiUrl}/discuss/update/${discussId}`,
        { chat: editMessage },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setEditingId(null);
      setEditMessage('');
      fetchDiscussions();
      toast.success('Message updated successfully');
    } catch (error) {
      toast.error('Failed to update message');
    }
  };

  const handleDelete = async (discussId) => {
    if (!isBuyer) {
      toast.error('Only buyers can delete messages');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await axios.put(
        `${apiUrl}/discuss/delete/${discussId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      fetchDiscussions();
      toast.success('Message deleted successfully');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  return (
    <div className="max-w-4xl p-4">
      <h2 className="text-2xl font-bold mb-6">Discussion</h2>

      {/* Form diskusi baru - hanya untuk buyer */}
      {isAuthenticated && isBuyer && (
        <form onSubmit={handleNewDiscussion} className="mb-8 bg-white p-4 rounded-lg shadow-md border-2 border-blue-100">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Start New Discussion</h3>
          <div className="flex flex-col space-y-3">
            <textarea
              value={newDiscussion}
              onChange={(e) => setNewDiscussion(e.target.value)}
              placeholder="What would you like to discuss about this product?"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              rows="3"
            />
            <button
              type="submit"
              className="self-end px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Post Discussion
            </button>
          </div>
        </form>
      )}

      {/* Daftar Diskusi */}
      <div className="space-y-8">
        {discussions
          .filter(discussion => !discussion.replyId)
          .map((mainDiscussion) => {
            const replies = discussions
              .filter(reply => {
                let currentReply = reply;
                while (currentReply.replyId) {
                  if (currentReply.replyId._id === mainDiscussion._id) {
                    return true;
                  }
                  currentReply = currentReply.replyId;
                }
                return false;
              })
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            return (
              <div key={mainDiscussion._id} className="bg-white rounded-lg shadow-sm border">
                {/* Diskusi Utama */}
                <div className="p-4 border-b">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {getUserIdFromDiscussion(mainDiscussion).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          User: {getUserIdFromDiscussion(mainDiscussion)}
                        </span>
                        <p className="text-sm text-gray-500">
                          {format(new Date(mainDiscussion.createdAt), 'MMM d, yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {isBuyer && mainDiscussion.userId._id === user._id && (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(mainDiscussion._id);
                              setEditMessage(mainDiscussion.chat);
                            }}
                            className="text-green-500 hover:text-green-700 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(mainDiscussion._id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {editingId === mainDiscussion._id ? (
                    <div className="flex flex-col space-y-2">
                      <textarea
                        value={editMessage}
                        onChange={(e) => setEditMessage(e.target.value)}
                        className="w-full p-3 border rounded-lg bg-gray-50"
                        rows="2"
                      />
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditMessage('');
                          }}
                          className="px-4 py-1.5 text-gray-600 hover:text-gray-800 font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEdit(mainDiscussion._id)}
                          className="px-4 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 mt-2">{mainDiscussion.chat}</p>
                  )}
                </div>

                {/* Daftar Reply */}
                {replies.length > 0 && (
                  <div className="bg-gray-50 p-4">
                    <div className="space-y-4">
                      {replies.map((reply) => (
                        <div key={reply._id} className="pl-4 border-l-2 border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">
                                  {getUserIdFromDiscussion(reply).charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-900 text-sm">
                                  User: {getUserIdFromDiscussion(reply)}
                                </span>
                                <p className="text-xs text-gray-500">
                                  {format(new Date(reply.createdAt), 'MMM d, yyyy HH:mm')}
                                </p>
                              </div>
                            </div>
                            {isBuyer && reply.userId._id === user._id && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingId(reply._id);
                                    setEditMessage(reply.chat);
                                  }}
                                  className="text-green-500 hover:text-green-700 text-xs font-medium"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(reply._id)}
                                  className="text-red-500 hover:text-red-700 text-xs font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                          {editingId === reply._id ? (
                            <div className="flex flex-col space-y-2 mt-2">
                              <textarea
                                value={editMessage}
                                onChange={(e) => setEditMessage(e.target.value)}
                                className="w-full p-2 border rounded-lg bg-white"
                                rows="2"
                              />
                              <div className="flex space-x-2 justify-end">
                                <button
                                  onClick={() => {
                                    setEditingId(null);
                                    setEditMessage('');
                                  }}
                                  className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm font-medium"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleEdit(reply._id)}
                                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-medium"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-700 text-sm mt-1">{reply.chat}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form Reply - terpisah dari form diskusi baru */}
                {isAuthenticated && (isBuyer || isSeller) && (
                  <div className="p-4 bg-gray-50 border-t">
                    <form onSubmit={(e) => handleReply(e, mainDiscussion._id)} className="space-y-3">
                      <textarea
                        value={replyMessages[mainDiscussion._id] || ''}
                        onChange={(e) => handleReplyChange(mainDiscussion._id, e.target.value)}
                        placeholder="Write your reply here..."
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                        rows="2"
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                        >
                          Reply
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {!isAuthenticated && (
        <div className="text-center py-6 bg-gray-50 rounded-lg border mt-4">
          <p className="text-gray-600">
            Please login to participate in discussions
          </p>
        </div>
      )}
    </div>
  );
};

export default Discuss;
