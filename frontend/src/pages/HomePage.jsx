import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, setSort } from '../store/slices/productSlice'
import FilterSidebar from '../components/filters/FilterSidebar'
import ProductCard from '../components/products/ProductCard'
import Loader from '../components/common/Loader'

const HomePage = () => {
    const dispatch = useDispatch()
    const { items: products, filters, loading, error } = useSelector((state) => state.products)

    useEffect(() => {
        dispatch(fetchProducts(filters))
    }, [dispatch, filters])

    const handleSortChange = (e) => {
        dispatch(setSort(e.target.value))
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Filter Sidebar */}
                <aside className="lg:w-64 flex-shrink-0">
                    <FilterSidebar />
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h2 className="text-2xl font-bold text-slate-800">
                            Products ({products.length} items)
                        </h2>

                        {/* Sort Dropdown */}
                        <select
                            value={filters.sort}
                            onChange={handleSortChange}
                            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="featured">Sort by: Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>

                    {/* Loading State */}
                    {loading && <Loader />}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Products Grid */}
                    {!loading && !error && products.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-500 text-lg">No products found matching your filters.</p>
                            <p className="text-slate-400 text-sm mt-2">Try adjusting your search criteria.</p>
                        </div>
                    )}

                    {!loading && !error && products.length > 0 && (
                        <div
                            key={products.map(p => p._id).join('-')}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HomePage
