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
  const isProductSeller = user?._id === discussions[0]?.productId?.userId;

  // Fungsi untuk mendapatkan nama user dari discussion
  const getUserNameFromDiscussion = (discussion) => {
    const name = discussion?.userId?.name || 'Unknown User';
    const isSeller = discussion?.userId?.role === 'seller';
    return { name, isSeller };
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

    if (!newDiscussion.trim()) {
      toast.error('Pesan tidak boleh kosong');
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(
        `${apiUrl}/discuss/add/${productId}`,
        { chat: newDiscussion },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setNewDiscussion('');
      await fetchDiscussions();
      toast.success('Pesan berhasil ditambahkan');
    } catch (error) {
      toast.error('Gagal menambahkan pesan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = async (e, discussionId) => {
    e.preventDefault();
    if (!handleAuthCheck()) return;

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
    <div className="p-4 bg-gradient-to-br from-[#4F46E5]/5 to-[#7C3AED]/5 rounded-lg">
      <div className="flex items-center mb-4">
        <div className="w-1 h-8 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-lg mr-3"></div>
        <h2 className="text-xl font-bold text-gray-800">Diskusi Produk</h2>
      </div>
      
      {/* Form diskusi baru */}
      {(isBuyer || (isSeller && isProductSeller)) && (
        <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <form onSubmit={handleNewDiscussion} className="flex flex-col space-y-2">
            <textarea
              value={newDiscussion}
              onChange={(e) => setNewDiscussion(e.target.value)}
              placeholder={isSeller ? "Balas pertanyaan pembeli..." : "Tanyakan sesuatu tentang produk ini..."}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all resize-none"
              rows="3"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl hover:shadow-md transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Mengirim...' : 'Kirim'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Daftar diskusi */}
      <div className="space-y-4">
        {discussions.map((discussion) => (
          <div key={discussion._id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            {/* Header diskusi */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{getUserNameFromDiscussion(discussion).name}</span>
                {getUserNameFromDiscussion(discussion).isSeller && (
                  <span className="px-2 py-1 text-xs font-medium text-[#4F46E5] bg-[#4F46E5]/10 rounded-full">
                    Penjual
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {format(new Date(discussion.createdAt), 'dd MMM yyyy HH:mm', { locale: id })}
              </span>
            </div>
            
            {editingId === discussion._id ? (
              <div className="mt-2">
                <textarea
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all resize-none"
                  rows="3"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditMessage('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => handleEdit(discussion._id)}
                    className="px-4 py-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl hover:shadow-md transition-all"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-2 text-gray-700">{discussion.chat}</p>
                <div className="flex items-center gap-4 mt-2">
                  {!discussion.replyId && (isBuyer || (isSeller && isProductSeller)) && (
                    <button
                      onClick={() => handleReplyChange(discussion._id, '')}
                      className="text-sm text-[#4F46E5] hover:text-[#7C3AED] transition-colors"
                    >
                      Balas
                    </button>
                  )}
                  {isOwnDiscussion(discussion) && (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(discussion._id);
                          setEditMessage(discussion.chat);
                        }}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(discussion._id)}
                        className="text-sm text-red-600 hover:text-red-700 transition-colors"
                      >
                        Hapus
                      </button>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Form balasan */}
            {replyMessages[discussion._id] !== undefined && !discussion.replyId && (
              <form
                onSubmit={(e) => handleReply(e, discussion._id)}
                className="mt-4"
              >
                <textarea
                  value={replyMessages[discussion._id]}
                  onChange={(e) => handleReplyChange(discussion._id, e.target.value)}
                  placeholder="Tulis balasan..."
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all resize-none"
                  rows="2"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => handleReplyChange(discussion._id, undefined)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl hover:shadow-md transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'Mengirim...' : 'Kirim Balasan'}
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discuss;
