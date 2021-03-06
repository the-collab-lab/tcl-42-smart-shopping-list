import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useSnapshot from '../../hooks/useSnapshot';
import ListItem from '../ListItem/ListItem';
import Layout from '../Layout/Layout';
import { normalize, buttonStyles } from '../../lib/util';
import * as Icons from './Icons';

const EmptyList = ({ token }) => (
  <div className="flex flex-col items-center justify-center">
    <h2 className="p-8 font-serif text-center text-xl text-white">
      Your shopping list is empty.
    </h2>
    <Link className="w-1/2" to={`/addItem/${token}`}>
      <button className={buttonStyles}>Add Item</button>
    </Link>
  </div>
);

const FilterInput = ({ userSearch, setUserSearch }) => (
  <div className="mt-9 flex justify-center items-center">
    <input
      className="w-2/3 bg-primary text-white rounded-md border-neutral active:focus:border-secondary"
      type="text"
      placeholder="Search items"
      aria-label="Search items"
      value={userSearch}
      onChange={(e) => setUserSearch(e.target.value)}
    />
    <button
      type="button"
      className={`px-1 ${
        userSearch === ''
          ? 'text-gray-500'
          : 'text-neutral hover:text-secondary'
      }`}
      aria-label="Clear search input"
      disabled={userSearch === ''}
      onClick={() => setUserSearch('')}
    >
      <Icons.X />
    </button>
  </div>
);

export default function List() {
  const { token } = useParams();
  const { docs, isLoading } = useSnapshot(token);
  const [userSearch, setUserSearch] = useState('');

  if (isLoading) {
    return (
      <Layout token={token}>
        <div className="mt-8 font-serif text-white text-xl text-center lowercase">
          Loading list ...
        </div>
      </Layout>
    );
  }

  return (
    <Layout token={token}>
      {docs.length === 0 ? (
        <EmptyList token={token} />
      ) : (
        <>
          <FilterInput {...{ userSearch, setUserSearch }} />
          <ul className="pt-2 m-4">
            {docs
              .filter(({ item }) => {
                // 1) if search input is blank / empty
                // item will pass through filter
                //
                // 2) if search string is part of item name
                // item will pass through filter
                //
                // 3) otherwise item will be filtered out
                if (userSearch === '') {
                  return true;
                } else if (normalize(item).includes(normalize(userSearch))) {
                  return true;
                } else {
                  return false;
                }
              })
              .sort((a, b) => {
                if (a.purchaseFreq < b.purchaseFreq) return -1;
                if (a.purchaseFreq > b.purchaseFreq) return 1;
                return 0;
              })
              .map((doc) => (
                <ListItem key={doc.id} data={doc} token={token} />
              ))}
          </ul>
        </>
      )}
    </Layout>
  );
}
