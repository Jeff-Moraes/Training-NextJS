import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const AddToCartModal = dynamic(
  () => import('@/components/AddToCartModal'),
  { loading: () => <p>Loading...</p>, ssr: false }
  // loading => sets what should be displayed while the modal is loading.
  // ssr: false => makes the component gets rendered from the browser side instead of getting rendered from the server side.
)

const Products: React.FC = () => {
  const router = useRouter();
  const [ isAddToCartModalVisible, setIsAddToCartModalVisible ] = useState(false)

  const handleAddToCart = () => {
    setIsAddToCartModalVisible(true);
  }

  return (
    <div>
      <h1>{router.query.slug}</h1>

      <button onClick={handleAddToCart}>Add to cart</button>
      { isAddToCartModalVisible && <AddToCartModal />}
    </div>
  )
}

export default Products;