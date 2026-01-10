import { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../config/axios'

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth)
    const [activeTab, setActiveTab] = useState('profile')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: {
            fullName: user?.address?.fullName || '',
            phone: user?.address?.phone || '',
            address: user?.address?.address || '',
            city: user?.address?.city || '',
            state: user?.address?.state || '',
            pincode: user?.address?.pincode || '',
        },
    })

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    const handleProfileChange = (e) => {
        const { name, value } = e.target
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1]
            setProfileData(prev => ({
                ...prev,
                address: { ...prev.address, [addressField]: value }
            }))
        } else {
            setProfileData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordData(prev => ({ ...prev, [name]: value }))
    }

    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            await api.put('/api/profile', profileData)
            setMessage({ type: 'success', text: 'Profile updated successfully!' })
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' })
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        setMessage({ type: '', text: '' })

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' })
            return
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
            return
        }

        setLoading(true)

        try {
            await api.put('/api/profile/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            })
            setMessage({ type: 'success', text: 'Password changed successfully!' })
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">My Profile</h1>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'profile'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-slate-600 hover:text-slate-800'
                            }`}
                    >
                        Profile Information
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'password'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-slate-600 hover:text-slate-800'
                            }`}
                    >
                        Change Password
                    </button>
                </div>

                {/* Message */}
                {message.text && (
                    <div className={`mb-6 px-4 py-3 rounded-lg ${message.type === 'success'
                            ? 'bg-green-50 border border-green-200 text-green-700'
                            : 'bg-red-50 border border-red-200 text-red-700'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <form onSubmit={handleProfileSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profileData.name}
                                        onChange={handleProfileChange}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileData.email}
                                        onChange={handleProfileChange}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleProfileChange}
                                    className="input-field"
                                />
                            </div>

                            <div className="border-t border-slate-200 pt-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Shipping Address</h3>

                                <div className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                name="address.fullName"
                                                value={profileData.address.fullName}
                                                onChange={handleProfileChange}
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                name="address.phone"
                                                value={profileData.address.phone}
                                                onChange={handleProfileChange}
                                                className="input-field"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Address
                                        </label>
                                        <textarea
                                            name="address.address"
                                            value={profileData.address.address}
                                            onChange={handleProfileChange}
                                            rows="3"
                                            className="input-field"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                name="address.city"
                                                value={profileData.address.city}
                                                onChange={handleProfileChange}
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                State
                                            </label>
                                            <input
                                                type="text"
                                                name="address.state"
                                                value={profileData.address.state}
                                                onChange={handleProfileChange}
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Pincode
                                            </label>
                                            <input
                                                type="text"
                                                name="address.pincode"
                                                value={profileData.address.pincode}
                                                onChange={handleProfileChange}
                                                maxLength="6"
                                                className="input-field"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary disabled:bg-slate-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Updating...' : 'Update Profile'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Password Tab */}
                {activeTab === 'password' && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    minLength="6"
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    minLength="6"
                                    className="input-field"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary disabled:bg-slate-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Changing...' : 'Change Password'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProfilePage
