import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import Prismic from 'prismic-javascript';
import { Document } from 'prismic-javascript/types/documents';
import Link from 'next/link';
import PrismicDom from 'prismic-dom';

import { client } from '@/lib/prismic';

// interface IProduct {
//   id: string;
//   title: string;
// }

interface CategoryProps {
  category: Document;
  products: Document[];
}

export default function Categories({category, products}: CategoryProps) {
  const router = useRouter();

  if(router.isFallback) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <h1>{PrismicDom.RichText.asText(category.data.title)}</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <Link href={`/catalog/products/${product.uid}`} >
              <a>{PrismicDom.RichText.asText(product.data.title)}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await client().query([
    Prismic.Predicates.at('document.type', 'category'),
  ]);

  // const response = await fetch(`http://localhost:3333/categories`);
  // const categories = await response.json();

  const paths = categories.results.map(category => {
    return {
      params: { slug: category.uid }
    }
  })

  return {
    paths: paths,
    fallback: true,
  }
};

export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {
  const { slug } = context.params;

  const category = await client().getByUID('category', String(slug), {});

  const products = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.at('my.product.category', category.id),
  ]);
  
  // const response = await fetch(`http://localhost:3333/products?category_id=${slug}`);
  // const products = await response.json();
  
  return {
    props: {
      category,
      products: products.results,
    },
    revalidate: 60,
  }
}