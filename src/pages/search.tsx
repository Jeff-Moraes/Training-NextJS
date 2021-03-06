import { GetServerSideProps } from "next";
import Link from 'next/link';
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import Prismic from 'prismic-javascript';
import { Document } from 'prismic-javascript/types/documents';
import PrismicDom from 'prismic-dom';
import { client } from "@/lib/prismic";

interface SearchProps {
  searchResults: Document[];
}

export default function Search({ searchResults }: SearchProps) {
  const router = useRouter();
  const [ search, setSearch ] = useState("");

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();

    router.push(
      `/search?q=${encodeURIComponent(search)}`
    )

    setSearch('');
  }

  return (
    <div>
      <h1>Search</h1>
      <form onSubmit={handleSearch} >
        <input
          type="text"
          value={search}
          onChange={({target}) => setSearch(target.value)} />
          <button type="submit">Search</button>
      </form>


        <ul>
          {searchResults.map(product => (
            <li key={product.id}>
              <Link href={`/catalog/products/${product.uid}`} >
                <a>{PrismicDom.RichText.asText(product.data.title)}</a>
              </Link>
            </li>
          ))}
        </ul>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<SearchProps> = async (context) => {
  const { q } = context.query;

  if(!q) {
    return { props: { searchResults: [] } }
  }

  const searchResults = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.fulltext('my.product.title', String(q)),
  ]);

  return {
    props: {
      searchResults: searchResults.results,
    }
  }

}
