import { useDispatch, useSelector } from 'react-redux'
import { setCategory, setPriceRange, setDiscount, clearFilters } from '../../store/slices/productSlice'
import { FiStar } from 'react-icons/fi'

const FilterSidebar = () => {
    const dispatch = useDispatch()
    const filters = useSelector((state) => state.products.filters)

    const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Accessories']

    const handleCategoryChange = (category) => {
        const currentCategories = filters.category || []
        const isSelected = currentCategories.includes(category)

        if (isSelected) {
            // Remove category
            dispatch(setCategory(currentCategories.filter(c => c !== category)))
        } else {
            // Add category
            dispatch(setCategory([...currentCategories, category]))
        }
    }

    const handlePriceChange = (e, type) => {
        const value = parseInt(e.target.value)
        if (type === 'min') {
            dispatch(setPriceRange({ min: value, max: filters.maxPrice }))
        } else {
            dispatch(setPriceRange({ min: filters.minPrice, max: value }))
        }
    }

    const handleDiscountChange = (discount) => {
        const currentDiscounts = filters.minDiscount || []
        const isSelected = currentDiscounts.includes(discount)

        if (isSelected) {
            dispatch(setDiscount(currentDiscounts.filter(d => d !== discount)))
        } else {
            dispatch(setDiscount([...currentDiscounts, discount]))
        }
    }

    const handleClearFilters = () => {
        dispatch(clearFilters())
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Filters</h2>
                <button
                    onClick={handleClearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                    Clear All
                </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
                <h3 className="font-semibold text-slate-700 mb-3">Category</h3>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <label key={category} className="flex items-center space-x-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.category.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                                className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                            />
                            <span className="text-slate-700 group-hover:text-primary-600 transition-colors">
                                {category}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
                <h3 className="font-semibold text-slate-700 mb-3">Price Range</h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-sm text-slate-600 mb-1 block">Max: ₹{filters.maxPrice}</label>
                        <input
                            type="range"
                            min="0"
                            max="50000"
                            step="1000"
                            value={filters.maxPrice}
                            onChange={(e) => handlePriceChange(e, 'max')}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                    </div>
                </div>
            </div>

            {/* Discount Filter */}
            <div>
                <h3 className="font-semibold text-slate-700 mb-3">Discount</h3>
                <div className="space-y-2">
                    {[
                        { label: '50% or more', value: 50 },
                        { label: '40% or more', value: 40 },
                        { label: '30% or more', value: 30 },
                        { label: '20% or more', value: 20 },
                        { label: '10% or more', value: 10 },
                    ].map((discount) => (
                        <label key={discount.value} className="flex items-center space-x-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.minDiscount.includes(discount.value)}
                                onChange={() => handleDiscountChange(discount.value)}
                                className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                            />
                            <span className="text-slate-700 group-hover:text-primary-600 transition-colors">
                                {discount.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FilterSidebar
