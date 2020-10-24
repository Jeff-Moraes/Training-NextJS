import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Prismic from 'prismic-javascript';
import { Document } from 'prismic-javascript/types/documents';
import PrismicDom from 'prismic-dom';
// import { useState, useEffect } from 'react';

import { client } from '@/lib/prismic';
import SEO from '@/components/SEO';

import { Title } from '@/styles/pages/Home';

interface HomeProps {
  recommendedProducts: Document[];
}

export default function Home({recommendedProducts}: HomeProps) {
  
  // Client-side data fetching example
  // const [recommendedProducts, setRecommendedProducts] = useState<IProduct[]>([]);
  // useEffect(() => {
  //   fetch('http://localhost:3333/recommended').then(response => {
  //     response.json().then(data => setRecommendedProducts(data))
  //   })
  // }, [])

  // const handleSum = async () => {
  //   // dynamic import
  //   const { math } = await import('../lib/math');
  //   alert(math.sum(2,2))
  // }

  return (
    <div>
      <SEO
        title="Home page"
        image="boost.png"
        shouldExcludeTitleSuffix
      />

      <section>
        <Title>Products</Title>

        <ul>
          {recommendedProducts.map(recommendedProduct => (
            <li key={recommendedProduct.id}>
              <Link href={`/catalog/products/${recommendedProduct.uid}`} >
                <a>{PrismicDom.RichText.asText(recommendedProduct.data.title)}</a>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* <button onClick={handleSum}>Sum</button> */}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const recommendedProducts = await client().query([
    Prismic.Predicates.at('document.type', 'product')
  ])

  return { 
    props: {
      recommendedProducts: recommendedProducts.results
    }
  }

  // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recommended`);
  // const recommendedProducts = await response.json();
  // return { 
  //   props: {
  //     recommendedProducts
  //   }
  // }
}
