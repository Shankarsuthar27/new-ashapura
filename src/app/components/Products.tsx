import { motion } from 'motion/react';
import { ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router';
import { useProducts } from '../context/ProductContext';

export function Products() {
  const { products: allProducts } = useProducts();
  // Show first 6 products as featured
  const products = allProducts.slice(0, 6);
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked selection of the latest and greatest tech
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative h-72 overflow-hidden bg-gray-100">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Discount Badge */}
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                  -{product.discount}%
                </div>

                {/* Quick View Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <button className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-orange-500 hover:text-white transition-all duration-300">
                    <Eye className="w-4 h-4" />
                    Quick View
                  </button>
                </motion.div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors duration-300"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
