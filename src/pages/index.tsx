import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';

import { Title } from '../styles/pages/Home';

interface IProduct {
  id: string;
  title: string;
}

interface HomeProps {
  recommendedProducts: IProduct[];
}

export default function Home({recommendedProducts}: HomeProps) {
  
  // Client-side data fetching example
  // const [recommendedProducts, setRecommendedProducts] = useState<IProduct[]>([]);
  // useEffect(() => {
  //   fetch('http://localhost:3333/recommended').then(response => {
  //     response.json().then(data => setRecommendedProducts(data))
  //   })
  // }, [])

  return (
    <div>
      <section>
        <Title>Products</Title>

        <ul>
          {recommendedProducts.map(recommendedProduct => (
            <li key={recommendedProduct.id}>
              {recommendedProduct.title}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch('http://localhost:3333/recommended');
  const recommendedProducts = await response.json();
  return { 
    props: {
      recommendedProducts
    }
  }
}
