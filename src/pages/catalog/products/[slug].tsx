import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';
import { Document } from 'prismic-javascript/types/documents';
import PrismicDom from 'prismic-dom';

import { client } from '@/lib/prismic';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const AddToCartModal = dynamic(
  () => import('@/components/AddToCartModal'),
  { loading: () => <p>Loading...</p>, ssr: false }
  // loading => sets what should be displayed while the modal is loading.
  // ssr: false => makes the component gets rendered from the browser side instead of getting rendered from the server side.
)

interface ProductProps {
  product: Document;
}

export default function Products({ product }: ProductProps) {
  const router = useRouter();
  const [ isAddToCartModalVisible, setIsAddToCartModalVisible ] = useState(false)

  const handleAddToCart = () => {
    setIsAddToCartModalVisible(!isAddToCartModalVisible);
  }

  if(router.isFallback) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <img
        src={product.data.thumbnail.url}
        alt={PrismicDom.RichText.asText(product.data.title)}
        style={{ width: "400px" }}
      />
      <h1>{PrismicDom.RichText.asText(product.data.title)}</h1>

      <div dangerouslySetInnerHTML={{ __html: PrismicDom.RichText.asText(product.data.description)}} />

      <p>price: €{product.data.price}</p>

      <button onClick={handleAddToCart}>Add to cart</button>
      { isAddToCartModalVisible && <AddToCartModal />}
    </div>
  )
}
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  }
};

export const getStaticProps: GetStaticProps<ProductProps> = async (context) => {
  const { slug } = context.params;
  const product = await client().getByUID('product', String(slug), {});
  
  return {
    props: {
      product,
    },
    revalidate: 5,
  }
}