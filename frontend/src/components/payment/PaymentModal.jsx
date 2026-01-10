import { useState } from 'react'

const PaymentModal = ({ isOpen, onClose, onSuccess, totalAmount }) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Generate mock payment ID
            const paymentId = 'pay_' + Math.random().toString(36).substr(2, 16)

            // 90% success rate
            if (Math.random() > 0.1) {
                onSuccess(paymentId)
            } else {
                throw new Error('Payment failed. Please try again.')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                    disabled={loading}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Payment Details</h2>
                    <p className="text-slate-600 mt-2">Total Amount: <span className="font-bold text-primary-600">₹{totalAmount.toFixed(2)}</span></p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Card Number
                        </label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            required
                            className="input-field"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Cardholder Name
                        </label>
                        <input
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            className="input-field"
                            disabled={loading}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Expiry Date
                            </label>
                            <input
                                type="text"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                placeholder="MM/YY"
                                maxLength="5"
                                required
                                className="input-field"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                CVV
                            </label>
                            <input
                                type="text"
                                name="cvv"
                                value={formData.cvv}
                                onChange={handleChange}
                                placeholder="123"
                                maxLength="3"
                                required
                                className="input-field"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 btn-primary disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Processing...</span>
                                </span>
                            ) : (
                                `Pay ₹${totalAmount.toFixed(2)}`
                            )}
                        </button>
                    </div>
                </form>

                <p className="text-xs text-slate-500 text-center mt-4">
                    🔒 This is a mock payment gateway for demonstration purposes
                </p>
            </div>
        </div>
    )
}

export default PaymentModal
