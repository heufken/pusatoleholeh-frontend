import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const Discuss = () => {
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussion, setNewDiscussion] = useState('');
  const [replyMessages, setReplyMessages] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editMessage, setEditMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { productId } = useParams();
  const { isAuthenticated, token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const isBuyer = user?.role === 'buyer';
  const isSeller = user?.role === 'seller';

  // Fungsi untuk mendapatkan nama user dari discussion
  const getUserNameFromDiscussion = (discussion) => {
    return discussion?.userId?.name || 'Unknown User';
  };

  // Fungsi untuk mengecek apakah discussion milik user yang sedang login
  const isOwnDiscussion = (discussion) => {
    return discussion?.userId?._id === user?._id;
  };

  // Bungkus fetchDiscussions dengan useCallback
  const fetchDiscussions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${apiUrl}/discuss/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDiscussions(response.data.discussions);
    } catch (error) {
      console.error('Error fetching discussions:', error);
      toast.error('Gagal memuat diskusi');
    } finally {
      setIsLoading(false);
    }
  }, [productId, token, apiUrl]);

  useEffect(() => {
    fetchDiscussions();
  }, [fetchDiscussions]);

  const handleAuthCheck = () => {
    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu');
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleNewDiscussion = async (e) => {
    e.preventDefault();
    if (!handleAuthCheck()) return;

    if (!isBuyer) {
      toast.error('Hanya pembeli yang dapat memulai diskusi baru');
      return;
    }

    if (!newDiscussion.trim()) {
      toast.error('Pesan tidak boleh kosong');
      return;
    }

    try {
      setIsLoading(true);
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
      await fetchDiscussions();
      toast.success('Diskusi berhasil ditambahkan');
    } catch (error) {
      toast.error('Gagal menambahkan diskusi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = async (e, discussionId) => {
    e.preventDefault();
    if (!handleAuthCheck()) return;

    if (!(isBuyer || isSeller)) {
      toast.error('Hanya pembeli dan penjual yang dapat membalas diskusi');
      return;
    }

    const replyMessage = replyMessages[discussionId];
    if (!replyMessage?.trim()) {
      toast.error('Pesan tidak boleh kosong');
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(
        `${apiUrl}/discuss/add/${productId}`,
        {
          chat: replyMessage,
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
      await fetchDiscussions();
      toast.success('Balasan berhasil ditambahkan');
    } catch (error) {
      toast.error('Gagal menambahkan balasan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplyChange = (discussionId, value) => {
    setReplyMessages(prev => ({
      ...prev,
      [discussionId]: value
    }));
  };

  const handleEdit = async (discussId) => {
    if (!handleAuthCheck()) return;

    if (!isOwnDiscussion(discussions.find(d => d._id === discussId))) {
      toast.error('Anda hanya dapat mengedit pesan Anda sendiri');
      return;
    }

    if (!editMessage.trim()) {
      toast.error('Pesan tidak boleh kosong');
      return;
    }

    try {
      setIsLoading(true);
      await axios.put(
        `${apiUrl}/discuss/update/${discussId}`,
        { chat: editMessage },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setEditingId(null);
      setEditMessage('');
      await fetchDiscussions();
      toast.success('Pesan berhasil diperbarui');
    } catch (error) {
      toast.error('Gagal memperbarui pesan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (discussId) => {
    if (!handleAuthCheck()) return;

    if (!isOwnDiscussion(discussions.find(d => d._id === discussId))) {
      toast.error('Anda hanya dapat menghapus pesan Anda sendiri');
      return;
    }

    if (!window.confirm('Apakah Anda yakin ingin menghapus pesan ini?')) return;

    try {
      setIsLoading(true);
      await axios.put(
        `${apiUrl}/discuss/delete/${discussId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      await fetchDiscussions();
      toast.success('Pesan berhasil dihapus');
    } catch (error) {
      toast.error('Gagal menghapus pesan');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl p-4">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-4">
      <h2 className="text-2xl font-bold mb-6">Diskusi Produk</h2>

      {/* Form diskusi baru - hanya untuk buyer */}
      {isAuthenticated && isBuyer && (
        <form onSubmit={handleNewDiscussion} className="mb-8 bg-white p-4 rounded-lg shadow-md border-2 border-[#4F46E5]/20">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Mulai Diskusi Baru</h3>
          <div className="flex flex-col space-y-3">
            <textarea
              value={newDiscussion}
              onChange={(e) => setNewDiscussion(e.target.value)}
              placeholder="Apa yang ingin Anda tanyakan tentang produk ini?"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] bg-white"
              rows="3"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`self-end px-6 py-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-lg hover:opacity-90 transition-all font-medium ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Kirim Diskusi
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
                      <div className="w-8 h-8 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {getUserNameFromDiscussion(mainDiscussion).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          {getUserNameFromDiscussion(mainDiscussion)}
                        </span>
                        <p className="text-sm text-gray-500">
                          {format(new Date(mainDiscussion.createdAt), 'd MMMM yyyy, HH:mm', { locale: id })}
                        </p>
                      </div>
                    </div>
                    {isOwnDiscussion(mainDiscussion) && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingId(mainDiscussion._id);
                            setEditMessage(mainDiscussion.chat);
                          }}
                          className="text-green-500 hover:text-green-700 text-sm font-medium"
                          disabled={isLoading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(mainDiscussion._id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                          disabled={isLoading}
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>
                  {editingId === mainDiscussion._id ? (
                    <div className="flex flex-col space-y-2">
                      <textarea
                        value={editMessage}
                        onChange={(e) => setEditMessage(e.target.value)}
                        className="w-full p-3 border rounded-lg bg-gray-50"
                        rows="2"
                        disabled={isLoading}
                      />
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditMessage('');
                          }}
                          className="px-4 py-1.5 text-gray-600 hover:text-gray-800 font-medium"
                          disabled={isLoading}
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => handleEdit(mainDiscussion._id)}
                          className={`px-4 py-1.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded hover:opacity-90 transition-all font-medium ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={isLoading}
                        >
                          Simpan
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
                              <div className="w-6 h-6 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">
                                  {getUserNameFromDiscussion(reply).charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-900 text-sm">
                                  {getUserNameFromDiscussion(reply)}
                                </span>
                                <p className="text-xs text-gray-500">
                                  {format(new Date(reply.createdAt), 'd MMMM yyyy, HH:mm', { locale: id })}
                                </p>
                              </div>
                            </div>
                            {isOwnDiscussion(reply) && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingId(reply._id);
                                    setEditMessage(reply.chat);
                                  }}
                                  className="text-green-500 hover:text-green-700 text-xs font-medium"
                                  disabled={isLoading}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(reply._id)}
                                  className="text-red-500 hover:text-red-700 text-xs font-medium"
                                  disabled={isLoading}
                                >
                                  Hapus
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
                                disabled={isLoading}
                              />
                              <div className="flex space-x-2 justify-end">
                                <button
                                  onClick={() => {
                                    setEditingId(null);
                                    setEditMessage('');
                                  }}
                                  className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm font-medium"
                                  disabled={isLoading}
                                >
                                  Batal
                                </button>
                                <button
                                  onClick={() => handleEdit(reply._id)}
                                  className={`px-3 py-1 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded hover:opacity-90 transition-all font-medium ${
                                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                  disabled={isLoading}
                                >
                                  Simpan
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

                {/* Form Reply */}
                {isAuthenticated && (isBuyer || isSeller) && (
                  <div className="p-4 bg-gray-50 border-t">
                    <form onSubmit={(e) => handleReply(e, mainDiscussion._id)} className="space-y-3">
                      <textarea
                        value={replyMessages[mainDiscussion._id] || ''}
                        onChange={(e) => handleReplyChange(mainDiscussion._id, e.target.value)}
                        placeholder="Tulis balasan Anda di sini..."
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] bg-white"
                        rows="2"
                        disabled={isLoading}
                      />
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-4 py-1.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-lg hover:opacity-90 transition-all text-sm font-medium ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        Balas
                      </button>
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
            Silakan login untuk berpartisipasi dalam diskusi
          </p>
        </div>
      )}

      {isAuthenticated && discussions.length === 0 && (
        <div className="text-center py-6 bg-gray-50 rounded-lg border mt-4">
          <p className="text-gray-600">
            Belum ada diskusi. Jadilah yang pertama memulai diskusi!
          </p>
        </div>
      )}
    </div>
  );
};

export default Discuss;
